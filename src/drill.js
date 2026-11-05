/*
 * LabZero Mama: timed emergency drills (adult CPR, haemorrhage control). MIT licence.
 *
 * A drill is a set of actions. Each action costs simulated seconds. A meter
 * (for example, blood lost or time without compressions) moves at a rate the
 * trainee's actions change. Scoring is a deterministic function of what was
 * done, when, and in what order.
 */
(function () {
  "use strict";

  function clock(t) { var m = Math.floor(t / 60), s = Math.round(t % 60); return m + ":" + (s < 10 ? "0" : "") + s; }

  function init(c, id) {
    var d = c.drills[id];
    return { t: d.clockStart || 0, done: {}, order: [], log: [], meter: d.meter ? d.meter.start : 0, rate: d.meter ? d.meter.rate : 0, finished: false, harmful: [], seen: {} };
  }

  function note(r, text, kind) { r.log.push({ t: r.t, text: text, kind: kind || "info" }); }

  function advance(d, r, sec) {
    for (var i = 0; i < sec; i++) {
      r.t += 1;
      r.meter += r.rate;
      if (d.meter && d.meter.max !== undefined) r.meter = Math.min(d.meter.max, r.meter);
      (d.events || []).forEach(function (e, k) {
        if (!r.seen[k] && r.t >= e.t && (!e.when || e.when(r))) { r.seen[k] = true; note(r, e.text, e.kind || "warn"); }
      });
    }
  }

  function did(r, id) { return !!r.done[id]; }

  function act(c, id, r, aid) {
    var d = c.drills[id];
    if (r.finished) return;
    var a = d.actions.find(function (x) { return x.id === aid; });
    if (!a) return;
    if (a.repeat !== true && did(r, aid)) { note(r, "Already done."); return; }
    var err = a.can ? a.can(r, did) : null;
    if (err) { note(r, err, "warn"); return; }
    advance(d, r, a.cost || 0);
    (r.done[aid] = r.done[aid] || []).push(r.t);
    r.order.push(aid);
    if (a.rate !== undefined) r.rate = typeof a.rate === "function" ? a.rate(r, did) : a.rate;
    var text = typeof a.text === "function" ? a.text(r, did) : a.text;
    if (a.harmful) r.harmful.push(a.harmful);
    note(r, text, a.harmful ? "bad" : a.kind || "info");
    if (a.end) { r.finished = true; if (d.outcome) note(r, d.outcome(r, did), "good"); }
  }

  function evaluate(c, id, r) {
    var d = c.drills[id], critical = [], notes = [];
    if (!r) return { score: 0, critical: ["Did not attempt the emergency."], notes: [] };
    var ess = d.rules.essential, pts = 0;
    ess.forEach(function (e) {
      var first = r.done[e.id] ? r.done[e.id][0] : null;
      var a = d.actions.find(function (x) { return x.id === e.id; });
      if (first === null) {
        if (e.critical) critical.push(e.critical); else notes.push("Not done: " + a.label + ".");
      } else if (e.by !== undefined && first > e.by) {
        pts += 0.5;
        if (e.late) critical.push(e.late + " (at " + clock(first) + ", target " + clock(e.by) + ")");
        else notes.push(a.label + " was late: " + clock(first) + " (target " + clock(e.by) + ").");
      } else pts += 1;
    });
    (d.rules.before || []).forEach(function (b) {
      if (r.done[b.a] && r.done[b.b] && r.done[b.b][0] < r.done[b.a][0]) notes.push(b.note);
    });
    r.harmful.forEach(function (h) { critical.push(h); });
    if (d.meterNote) { var m = d.meterNote(r); if (m) notes.push(m); }
    var score = Math.max(0, Math.min(100, Math.round(100 * pts / ess.length - 25 * r.harmful.length)));
    return { score: score, critical: critical, notes: notes };
  }

  window.MamaDrill = { init: init, act: act, evaluate: evaluate, clock: clock, did: did };
})();

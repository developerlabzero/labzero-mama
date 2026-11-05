/*
 * LabZero Mama: newborn resuscitation step. MIT licence.
 *
 * A timed sequence. Every action costs simulated seconds; the baby's heart rate,
 * breathing and colour respond to what the trainee does and how quickly.
 * The physiology is deliberately simple and deterministic, so scoring is repeatable.
 */
(function () {
  "use strict";

  function init(c) {
    var s = c.resus.start;
    return {
      t: 0, hr: s.hr, breathing: "none", tone: "floppy", colour: "blue",
      dried: false, cord: false, help: false, suction: false, o2: false,
      ventStartedAt: null, ventilating: false, effective: false, effSeconds: 0,
      chestChecked: false, hrChecks: [], lastHr: null, compressions: [], harmful: [],
      log: [], done: false, outcome: null
    };
  }

  function advance(r, sec) {
    for (var i = 0; i < sec; i++) {
      r.t += 1;
      if (r.ventilating && r.effective) {
        r.effSeconds += 1;
        r.hr = Math.min(150, r.hr + 25 / 30);
      } else if (r.ventilating) {
        r.hr = Math.max(40, r.hr - 3 / 30);
      } else {
        r.hr = Math.max(30, r.hr - 8 / 30);
      }
      if (r.effSeconds >= 60 && r.hr > 100 && r.breathing === "none") r.breathing = "gasping";
      if (r.effSeconds >= 90 && r.hr >= 120) { r.breathing = "regular"; r.tone = "some tone"; }
      r.colour = r.hr > 100 && r.breathing !== "none" ? "pink centrally" : r.hr > 80 ? "pale" : "blue";
    }
  }

  function note(r, text, kind) { r.log.push({ t: r.t, text: text, kind: kind || "info" }); }

  function act(c, r, id) {
    if (r.done) return;
    var a = c.resus.actions.find(function (x) { return x.id === id; });
    if (!a) return;
    switch (id) {
      case "help":
        r.help = true; note(r, "You called for help. A second midwife is coming."); break;
      case "dry":
        r.dried = true; advance(r, a.cost); note(r, "Dried thoroughly and removed the wet cloth. The baby is still not breathing."); break;
      case "stimulate":
        advance(r, a.cost); note(r, "Rubbed the back. No response."); break;
      case "suction":
        r.suction = true; advance(r, a.cost); note(r, "Cleared meconium from the mouth, then the nose. Still not breathing."); break;
      case "cord":
        r.cord = true; advance(r, a.cost); note(r, "Clamped and cut the cord and moved the baby to the resuscitation area."); break;
      case "ventilate":
        if (r.ventilating) { note(r, "You are already ventilating."); break; }
        r.ventilating = true; r.ventStartedAt = r.t; advance(r, a.cost);
        note(r, "Started bag-and-mask ventilation with room air at 40 breaths a minute.", "good"); break;
      case "chest":
        if (!r.ventilating) { note(r, "You are not ventilating yet."); break; }
        r.chestChecked = true; advance(r, a.cost);
        note(r, r.effective ? "The chest rises with each breath." : "The chest is NOT rising. Air is leaking around the mask.", r.effective ? "good" : "warn"); break;
      case "reposition":
        if (!r.ventilating) { note(r, "Start ventilation first."); break; }
        advance(r, a.cost); r.effective = true;
        note(r, "Repositioned the head in a neutral position and reapplied the mask firmly. The chest now rises.", "good"); break;
      case "vent30":
        if (!r.ventilating) { note(r, "Start ventilation first."); break; }
        advance(r, a.cost); note(r, "Ventilated for 30 seconds."); break;
      case "hr":
        advance(r, a.cost); r.lastHr = Math.round(r.hr);
        r.hrChecks.push({ t: r.t, hr: r.lastHr, effSeconds: r.effSeconds });
        note(r, "Heart rate " + r.lastHr + " per minute. Breathing: " + r.breathing + ".", r.lastHr < 60 ? "warn" : r.lastHr < 100 ? "info" : "good"); break;
      case "compress":
        advance(r, a.cost); r.compressions.push({ t: r.t, hr: Math.round(r.hr), effSeconds: r.effSeconds });
        var ok = r.hr < 60 && r.effSeconds >= 30;
        if (!ok) r.harmful.push(c.resus.messages.compress);
        note(r, ok ? "Started chest compressions, 3 compressions to 1 breath." : "Started chest compressions. The heart rate was above 60 or ventilation was not yet effective; compressions interrupt the breaths the baby needs.", ok ? "info" : "bad"); break;
      case "oxygen":
        r.o2 = true; advance(r, a.cost);
        note(r, r.effSeconds < 60 ? "Connected 100% oxygen. Room air is recommended first; add oxygen only if the heart rate stays low despite good ventilation." : "Added oxygen.", r.effSeconds < 60 ? "warn" : "info"); break;
      case "wait":
        advance(r, a.cost);
        if (!r.ventilating) { r.harmful.push(c.resus.messages.wait); note(r, "You waited 30 seconds. The baby did not breathe and the heart rate is falling.", "bad"); }
        else note(r, "You paused ventilation to watch. The baby is not ready to breathe alone.", "warn");
        break;
      case "dangle":
        advance(r, a.cost); r.harmful.push(c.resus.messages.dangle); note(r, "Held the baby upside down and slapped. This is harmful and wastes time.", "bad"); break;
      case "naloxone":
        advance(r, a.cost); r.harmful.push(c.resus.messages.naloxone); note(r, "Looked for naloxone. It is not part of newborn resuscitation and the mother had no opioids.", "bad"); break;
      case "stop":
        r.done = true;
        if (r.breathing === "regular" && r.hr >= 100) {
          r.outcome = "stable";
          note(r, "Stopped ventilation. The baby is breathing regularly with a heart rate of " + Math.round(r.hr) + ". Handed over for close monitoring.", "good");
        } else {
          r.outcome = "premature";
          r.harmful.push(c.resus.messages.stopEarly);
          note(r, "Stopped ventilation too early. The baby is not breathing well on its own. Your colleague restarts ventilation.", "bad");
        }
        break;
    }
    if (!r.done && r.t >= c.resus.timeLimit) {
      r.done = true;
      r.outcome = r.breathing === "regular" ? "stable" : "poor";
      note(r, r.outcome === "stable" ? "Five minutes have passed. The baby is breathing regularly." : "Five minutes have passed without effective ventilation. The heart rate is " + Math.round(r.hr) + " and the outlook is poor. The senior team takes over.", r.outcome === "stable" ? "good" : "bad");
    }
  }

  function evaluate(c, r) {
    var pts = 0, critical = [], notes = [];
    var v = r.ventStartedAt;
    if (v !== null && v <= 60) pts += 30;
    else if (v !== null && v <= 90) { pts += 15; notes.push("Ventilation started at " + v + " seconds. Aim to start within the Golden Minute (60 seconds)."); }
    else { notes.push("Ventilation " + (v === null ? "was never started" : "started at " + v + " seconds") + "."); critical.push(c.resus.messages.late); }
    if (r.dried && (v === null || r.log.findIndex(function (l) { return /Dried/.test(l.text); }) < r.log.findIndex(function (l) { return /Started bag/.test(l.text); }))) pts += 10;
    else notes.push("Dry the baby first: it starts breathing in some babies and prevents cold stress.");
    if (r.cord) pts += 5;
    if (r.effective) pts += 15; else { notes.push("The chest never rose, so the breaths were not reaching the lungs. Check chest rise and reposition the head and mask."); critical.push(c.resus.messages.ineffective); }
    if (r.hrChecks.some(function (h) { return h.effSeconds >= 30; })) pts += 15; else notes.push("Check the heart rate after 30–60 seconds of effective ventilation; it tells you whether resuscitation is working.");
    if (r.help) pts += 5; else notes.push("Call for help as soon as a baby needs resuscitation.");
    if (r.outcome === "stable") pts += 20;
    if (r.suction && r.ventStartedAt !== null && r.log.findIndex(function (l) { return /Cleared meconium/.test(l.text); }) > -1 && r.ventStartedAt > 60) notes.push("Suction only when the airway is blocked. It should not delay ventilation.");
    if (r.o2 && r.compressions.length === 0 && r.hrChecks.every(function (h) { return h.hr >= 60; })) { pts -= 5; }
    r.harmful.forEach(function (h) { if (critical.indexOf(h) === -1) critical.push(h); });
    pts -= 20 * r.harmful.length;
    return { score: Math.max(0, Math.min(100, Math.round(pts))), critical: critical, notes: notes };
  }

  function clock(t) { var m = Math.floor(t / 60), s = t % 60; return m + ":" + (s < 10 ? "0" : "") + s; }

  window.MamaResus = { init: init, act: act, evaluate: evaluate, clock: clock };
})();

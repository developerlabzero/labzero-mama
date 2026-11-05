/*
 * LabZero Mama: scoring rules and learner records. MIT licence.
 *
 * Rules, not AI, decide whether an action was safe. Every score below is a
 * deterministic function of the learner's choices and the approved case file.
 */
(function () {
  "use strict";

  function pct(n, d) { return d ? Math.round((n / d) * 100) : 0; }
  function clamp(n) { return Math.max(0, Math.min(100, Math.round(n))); }
  function has(set, id) { return set.indexOf(id) !== -1; }
  function best(options) { return options.slice().sort(function (a, b) { return b.score - a.score; })[0]; }

  function availableKeys(c, tests) {
    var keys = [];
    tests.forEach(function (t) {
      var r = c.results.reports[t];
      if (r && r.rows) r.rows.forEach(function (row) { if (row.key) keys.push(row.key); });
    });
    return keys;
  }

  function criticalRowsShown(c, tests) {
    var rows = [];
    tests.forEach(function (t) {
      var r = c.results.reports[t];
      if (r && r.rows) r.rows.forEach(function (row) { if (row.critical) rows.push(row); });
    });
    return rows;
  }

  function followupVariant(c, s) { return c.followupPick ? c.followupPick(s) : c.followup; }

  // Score one branching conversation (file room, family meeting).
  function scoreScene(scene, picks, critical, fb, label) {
    var sum = 0;
    scene.turns.forEach(function (t, i) {
      var o = t.options[picks[i]];
      if (!o) return;
      sum += o.score;
      if (o.flag) critical.push(o.flag);
      if (o.score < 100) fb.push(label + ", " + t.speaker + ": a stronger response was “" + best(t.options).text + "”");
    });
    return Math.round(sum / scene.turns.length);
  }

  function sceneDomain(c, st) { return (c.sceneDomains && c.sceneDomains[st]) || (st === "family" ? "family" : st); }

  function evaluate(c, s, day) {
    var scores = {}, critical = [], fb = [];
    var steps = c.steps;

    // Patient experience: the lobby conversation, the surge decision and the file room
    var hasExp = c.domains.some(function (d) { return d.id === "experience"; });
    if (hasExp) {
      var parts = [];
      var lobby = (window.MAMA_CLINIC.patients.find(function (p) { return p.caseId === c.id; }) || {});
      var lp = day && day.lobby[c.id] !== undefined ? lobby.options[day.lobby[c.id]] : null;
      if (lobby.options) {
        parts.push(lp ? lp.score : 0);
        if (!lp) fb.push("You did not speak to her during the queue walk.");
        else {
          if (lp.flag) critical.push(lp.flag);
          if (lp.score < 100) fb.push("Queue walk: a stronger response was “" + best(lobby.options).text + "”");
        }
      }
      if (c.inSurge) {
        var sg = window.MAMA_CLINIC.surge, so = day && day.surge !== undefined ? sg.options[day.surge] : null;
        parts.push(so ? so.score : 0);
        if (!so) fb.push("The gate decision was not made.");
        else { if (so.flag) critical.push(so.flag); if (so.score < 100) fb.push("At the gate: a stronger decision was “" + best(sg.options).text + "”"); }
      }
      if (has(steps, "records")) parts.push(scoreScene(c.scenes.records, s.scene.records || [], critical, fb, "File room"));
      scores.experience = parts.length ? Math.round(parts.reduce(function (a, b) { return a + b; }, 0) / parts.length) : 0;
    }

    // Nurse vitals: essentials measured (60%) and abnormal values recognised (40%)
    if (has(steps, "vitals")) {
      var ess = c.vitals.filter(function (v) { return v.essential; });
      var took = ess.filter(function (v) { return has(s.vitalsTaken, v.id); }).length;
      var measured = c.vitals.filter(function (v) { return has(s.vitalsTaken, v.id); });
      var truth = measured.filter(function (v) { return v.abnormal; }).map(function (v) { return v.id; });
      var marked = s.vitalsFlags.filter(function (id) { return has(s.vitalsTaken, id); });
      var tp = marked.filter(function (id) { return has(truth, id); }).length;
      var union = truth.length + marked.length - tp;
      scores.vitals = clamp(60 * took / ess.length + 40 * (union ? tp / union : 1));
      var vMissed = ess.filter(function (v) { return !has(s.vitalsTaken, v.id); }).map(function (v) { return v.label; });
      if (vMissed.length) fb.push("Vitals not taken: " + vMissed.join("; ") + ".");
      truth.filter(function (id) { return !has(marked, id); }).forEach(function (id) {
        var v = c.vitals.find(function (x) { return x.id === id; }); fb.push("Abnormal and not flagged: " + v.label + " " + v.value + ".");
      });
    }

    if (has(steps, "triage")) {
      var tri = c.triage.options.find(function (o) { return o.id === s.triage; }) || { score: 0 };
      scores.prioritisation = tri.score;
      if (tri.critical) critical.push(tri.critical);
    }

    if (has(steps, "resus")) {
      var rr = window.MamaResus.evaluate(c, s.resus);
      scores.resuscitation = rr.score;
      rr.critical.forEach(function (x) { critical.push(x); });
      rr.notes.forEach(function (x) { fb.push(x); });
    }

    if (has(steps, "history")) {
      var crit = c.history.intents.filter(function (i) { return i.critical; });
      var other = c.history.intents.filter(function (i) { return !i.critical; });
      var critAsked = crit.filter(function (i) { return has(s.asked, i.id); }).length;
      var otherAsked = other.filter(function (i) { return has(s.asked, i.id); }).length;
      scores.history = clamp(70 * critAsked / crit.length + 30 * Math.min(1, otherAsked / Math.min(5, other.length)));
      var missed = crit.filter(function (i) { return !has(s.asked, i.id); }).map(function (i) { return i.chip; });
      if (missed.length) fb.push("You did not ask: " + missed.join("; ") + ".");
    }

    if (has(steps, "exam")) {
      var essE = c.exam.filter(function (e) { return e.essential; });
      scores.assessment = pct(essE.filter(function (e) { return has(s.exams, e.id); }).length, essE.length);
      var exMissed = essE.filter(function (e) { return !has(s.exams, e.id); }).map(function (e) { return e.label; });
      if (exMissed.length) fb.push("Assessments missed: " + exMissed.join("; ") + ".");
    }

    if (has(steps, "tests")) {
    var essT = c.tests.filter(function (t) { return t.essential; });
    var unnecessary = c.tests.filter(function (t) { return t.appropriate === false && has(s.tests, t.id); });
    scores.investigations = clamp(80 * essT.filter(function (t) { return has(s.tests, t.id); }).length / essT.length + 20 - 10 * unnecessary.length);
    var tMissed = essT.filter(function (t) { return !has(s.tests, t.id); }).map(function (t) { return t.label; });
    if (tMissed.length) fb.push("Essential tests not ordered: " + tMissed.join("; ") + ".");
    unnecessary.forEach(function (t) { fb.push("Unnecessary: " + t.label + ". " + t.why); });
    }
    if (has(steps, "results")) {

    var available = availableKeys(c, s.tests);
    var truthR = c.results.significant.filter(function (k) { return has(available, k); });
    var flagged = s.flags.filter(function (k) { return has(available, k); });
    var tpR = flagged.filter(function (k) { return has(truthR, k); }).length;
    var unionR = truthR.length + flagged.length - tpR;
    var critShown = criticalRowsShown(c, s.tests).length > 0;
    scores.interpretation = clamp((unionR ? tpR / unionR : 1) * (critShown ? 80 : 100) + (critShown && s.ackCritical ? 20 : 0));
    if (critShown && !s.ackCritical) critical.push("Did not acknowledge a critical result: " + c.results.criticalNote);
    }
    if (has(steps, "diagnosis")) {

    var dx = c.diagnosis.options.find(function (o) { return o.id === s.dx; }) || { score: 0 };
    scores.diagnosis = dx.score;
    }
    if (has(steps, "meds")) {

    var errs = c.medicationChart.lines.filter(function (l) { return l.error; });
    var caught = errs.filter(function (l) { return has(s.rxFlags, l.id); }).length;
    var falseFlags = c.medicationChart.lines.filter(function (l) { return !l.error && has(s.rxFlags, l.id); }).length;
    scores.medication = clamp(100 * caught / errs.length - 20 * falseFlags);
    errs.forEach(function (l) {
      if (!has(s.rxFlags, l.id)) critical.push("Missed a prescribing error: " + l.drug + ", " + l.order + ".");
      fb.push(l.drug + ": " + l.why);
    });
    }
    if (has(steps, "manage")) {

    var maxW = 0, got = 0, harmful = 0;
    c.management.options.forEach(function (o) {
      var w = o.kind === "critical" ? 3 : o.kind === "essential" ? 1 : 0;
      maxW += w;
      var picked = has(s.mgmt, o.id);
      if (picked) got += w;
      if (o.kind === "critical" && !picked) critical.push("Did not choose: " + o.label.charAt(0).toLowerCase() + o.label.slice(1) + ".");
      if (o.kind === "harmful" && picked) { harmful += 1; critical.push(o.critical); }
    });
    scores.management = clamp(100 * got / maxW - 25 * harmful);
    }

    // Every other conversation scene (family meeting, arrival, breaking bad news...)
    steps.forEach(function (st) {
      if (st === "records" || !c.scenes || !c.scenes[st]) return;
      scores[sceneDomain(c, st)] = scoreScene(c.scenes[st], s.scene[st] || [], critical, fb, c.scenes[st].title);
    });

    // Timed emergency drills
    steps.forEach(function (st) {
      if (!c.drills || !c.drills[st]) return;
      var dr = window.MamaDrill.evaluate(c, st, (s.drills || {})[st]);
      scores[c.drills[st].domain] = dr.score;
      dr.critical.forEach(function (x) { critical.push(x); });
      dr.notes.forEach(function (x) { fb.push(x); });
    });

    if (has(steps, "followup")) {
    var fu = followupVariant(c, s);
    var fuPick = fu.options.find(function (o) { return o.id === s.followup; });
    scores.monitoring = fuPick && fuPick.correct ? 100 : 0;
    if (!fuPick || !fuPick.correct) critical.push("Did not respond correctly when the condition changed (" + fu.time.toLowerCase() + ").");
    }

    if (c.extraFeedback) c.extraFeedback(s, day).forEach(function (x) { fb.push(x); });

    // Hints cost 5 points per level in practice mode; learn mode is never a competence run.
    if (s.mode === "practice" && s.hints && window.MamaTuto) {
      Object.keys(s.hints).forEach(function (step) {
        var d = window.MamaTuto.domainOf(c, step);
        if (d && scores[d] !== undefined && s.hints[step] > 0) { scores[d] = clamp(scores[d] - 5 * s.hints[step]); fb.push("Hints used at " + step + ": " + s.hints[step] + " (−" + 5 * s.hints[step] + " points)."); }
      });
    }

    var ids = c.domains.map(function (d) { return d.id; });
    var total = Math.round(ids.reduce(function (a, id) { return a + (scores[id] || 0); }, 0) / ids.length);
    var mode = s.mode || "assessment";
    return { scores: scores, total: total, critical: critical, feedback: fb, mode: mode,
      passed: mode !== "learn" && total >= 70 && critical.length === 0 };
  }

  // ---- Learner records (stored only on this device) ----
  var KEY = "labzero-mama.sessions.v1";
  function loadSessions() { try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch (e) { return []; } }
  function saveSession(rec) {
    try { var all = loadSessions(); all.push(rec); localStorage.setItem(KEY, JSON.stringify(all.slice(-200))); return true; }
    catch (e) { return false; }
  }
  function clearSessions() { try { localStorage.removeItem(KEY); } catch (e) { /* ignore */ } }

  function buildRecord(c, s, result, day) {
    return {
      schema: "labzero-mama/learner-record@0.2",
      sessionId: s.sessionId, caseId: c.id, caseVersion: c.version, role: s.role,
      mode: s.mode || "assessment", hintsUsed: s.hints || {},
      startedAt: s.startedAt, completedAt: new Date().toISOString(),
      durationSeconds: Math.round((Date.now() - Date.parse(s.startedAt)) / 1000),
      choices: {
        queueWalk: day ? day.lobby[c.id] : undefined, gateDecision: c.inSurge && day ? day.surge : undefined, scenes: s.scene,
        drills: s.drills ? Object.keys(s.drills).reduce(function (o, k) { o[k] = { log: s.drills[k].log, order: s.drills[k].order }; return o; }, {}) : undefined,
        vitalsTaken: s.vitalsTaken, vitalsFlagged: s.vitalsFlags,
        triage: s.triage, asked: s.asked, exams: s.exams, tests: s.tests, flags: s.flags,
        ackCritical: s.ackCritical, diagnosis: s.dx, prescriptionFlags: s.rxFlags,
        management: s.mgmt, followup: s.followup,
        resuscitation: s.resus ? { log: s.resus.log, ventilationStartedAtSeconds: s.resus.ventStartedAt, outcome: s.resus.outcome } : undefined
      },
      dialogue: s.dialogue,
      domainScores: result.scores, totalScore: result.total,
      criticalErrors: result.critical, passed: result.passed, example: false
    };
  }

  // Clearly labelled example sessions so the dashboard is not empty on first open.
  var PATTERNS = [
    [100, 75, 80, 90, 85, 100, 100, 100, 100, 0], [70, 52, 60, 70, 60, 60, 50, 70, 100, 1],
    [100, 88, 100, 100, 100, 100, 100, 90, 100, 0], [20, 40, 40, 60, 47, 60, 50, 40, 0, 2],
    [100, 70, 80, 80, 74, 100, 100, 80, 100, 1], [70, 64, 60, 70, 80, 60, 100, 65, 100, 1],
    [100, 82, 100, 90, 100, 100, 100, 100, 100, 0], [70, 46, 60, 60, 54, 0, 50, 70, 0, 2]
  ];
  function exampleCohort(c) {
    var roles = ["Nursing and midwifery", "Medicine", "Pharmacy"];
    var pool = (c.exampleErrors || []).concat((c.management ? c.management.options : []).filter(function (o) { return o.kind === "harmful"; }).map(function (o) { return o.critical; }));
    return PATTERNS.map(function (p, i) {
      var base = p.slice(0, 9), scores = {};
      c.domains.forEach(function (d, j) { scores[d.id] = j < 9 ? base[j] : base[(j * 4) % 9]; });
      var total = Math.round(c.domains.reduce(function (a, d) { return a + scores[d.id]; }, 0) / c.domains.length);
      var errs = []; for (var k = 0; k < p[9]; k++) errs.push(pool[(i + k) % pool.length]);
      return { sessionId: "example-" + c.id + "-" + (i + 1), caseId: c.id, role: roles[i % 3], domainScores: scores,
        totalScore: total, criticalErrors: errs, passed: total >= 70 && errs.length === 0, example: true };
    });
  }

  window.MamaEngine = {
    evaluate: evaluate, sceneDomain: sceneDomain, availableKeys: availableKeys, criticalRowsShown: criticalRowsShown, followupVariant: followupVariant,
    loadSessions: loadSessions, saveSession: saveSession, clearSessions: clearSessions,
    buildRecord: buildRecord, exampleCohort: exampleCohort
  };
})();

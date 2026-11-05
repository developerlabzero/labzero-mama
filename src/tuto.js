/*
 * LabZero Mama: Tuto, the in-simulation tutor. MIT licence.
 *
 * Tuto teaches only from the approved case file: every hint and every review
 * line is built from the case's own rubric, reasons and explanations.
 * Tuto never invents clinical content.
 */
(function () {
  "use strict";

  function has(a, id) { return a.indexOf(id) !== -1; }
  function list(items) { return items.length ? items.join("; ") : "none"; }
  function best(opts) { return opts.slice().sort(function (a, b) { return b.score - a.score; })[0]; }

  var DOMAIN = { records: "experience", vitals: "vitals", history: "history", exam: "assessment", triage: "prioritisation",
    tests: "investigations", results: "interpretation", diagnosis: "diagnosis", meds: "medication", manage: "management",
    family: "family", followup: "monitoring", resus: "resuscitation" };

  var BRIEF = {
    records: "The file room is where many visits go wrong. Protect her dignity, her privacy and her right to be seen today. Then read the folder: old visits hide clues.",
    vitals: "Measure what her story needs. Ask: what could harm her (or her baby) today? Then tick every number that is outside normal.",
    history: "Open questions first, then the specifics. Ask the hard questions directly and kindly. People rarely volunteer what frightens them most.",
    exam: "Examine with consent and look for the findings that would change your plan.",
    triage: "Match urgency to danger signs, not to how calm she looks or how long the queue is.",
    tests: "Order the tests that change what you do next. Every extra test costs her time and the system money.",
    results: "Scan the flags, act on any critical result first, then ask: does this fit my working diagnosis?",
    diagnosis: "Pick the diagnosis that explains all of it: her story, the timeline, the examination and the results.",
    meds: "Read every line like the pharmacist on duty: right drug, dose, route and duration, and right for this patient (pregnancy, HIV medicines, overdose risk).",
    manage: "Treat the cause, keep her safe, and plan ahead with her, not just for her.",
    family: "Respect first, explanation second, blame never. Make room for her voice.",
    badnews: "Breaking bad news: the right Setting, ask what she already understands (Perception), ask how much she wants to know (Invitation), give the news clearly (Knowledge), respond to her Emotions, then agree a plan and Summarise. SPIKES.",
    followup: "Something has changed. Reassess before you act.",
    resus: "The Golden Minute: dry, ventilate, check the chest rises, then check the heart rate."
  };

  function domainOf(c, step) {
    if (c.drills && c.drills[step]) return c.drills[step].domain;
    if (c.scenes && c.scenes[step] && step !== "records") return window.MamaEngine.sceneDomain(c, step);
    return DOMAIN[step];
  }

  function briefing(c, step) {
    if (c.tuto && c.tuto[step]) return c.tuto[step];
    if (BRIEF[step]) return BRIEF[step];
    if (c.drills && c.drills[step]) return "Every second counts here. Do the life-saving things first, in the right order, then the rest.";
    return "Stay calm and kind. Choose what keeps everyone safe and respected.";
  }

  function drillHint(c, s, step, level) {
    var d = c.drills[step], r = (s.drills || {})[step] || { done: {} };
    var left = d.rules.essential.filter(function (e) { return !r.done[e.id]; });
    var label = function (id) { return d.actions.find(function (a) { return a.id === id; }).label; };
    if (level === 1) return d.hint1 || "What will kill her fastest? Deal with that first.";
    if (level === 2) return left.length + " essential actions still to do. " + (left[0] && left[0].by !== undefined ? "The first one has a time target of " + window.MamaDrill.clock(left[0].by) + "." : "");
    return left.length ? "Next: " + label(left[0].id) + "." + (left.length > 1 ? " Then: " + list(left.slice(1, 3).map(function (e) { return label(e.id); })) + "." : "") : "All essentials done. Finish the drill.";
  }

  function sceneHint(c, s, step, level) {
    var t = currentTurn(c, s, step);
    if (!t) return "This conversation is finished. Read what happened, then carry on.";
    if (level === 1) return (c.sceneHints && c.sceneHints[step]) || "Which response keeps her safe, respected and in care? Avoid anything that blames, shames or sends her away.";
    if (level === 2) return "One option does all three: it is respectful, it solves the problem in front of you, and it keeps her here.";
    return "Strongest response: “" + best(t.options).text + "”";
  }

  function currentTurn(c, s, key) {
    var sc = c.scenes[key], picks = s.scene[key] || [];
    return sc.turns[picks.length];
  }

  // level 1 = nudge, 2 = stronger hint, 3 = show the answer
  function hint(c, s, step, level) {
    var ess, n;
    if (c.drills && c.drills[step]) return drillHint(c, s, step, level);
    if (c.scenes && c.scenes[step] && step !== "records" && step !== "family") return sceneHint(c, s, step, level);
    switch (step) {
      case "records": case "family": {
        var t = currentTurn(c, s, step);
        if (!t) return "This conversation is finished. Read what happened, then carry on.";
        if (level === 1) return "Which response keeps her safe, respected and in care? Avoid anything that blames, shames or sends her away.";
        if (level === 2) return "One option does all three: it is respectful, it solves the problem in front of you, and it keeps her here.";
        return "Strongest response: “" + best(t.options).text + "”";
      }
      case "vitals":
        ess = c.vitals.filter(function (v) { return v.essential; });
        if (level === 1) return "Start with her main complaint. Which measurement is most likely to be abnormal, and which one must be known before any medicine is given?";
        if (level === 2) return ess.length + " measurements are essential for her. You have taken " + ess.filter(function (v) { return has(s.vitalsTaken, v.id); }).length + ".";
        return "Essential: " + list(ess.map(function (v) { return v.label; })) + ". Abnormal among these: " +
          list(c.vitals.filter(function (v) { return v.abnormal; }).map(function (v) { return v.label; })) + ".";
      case "history":
        ess = c.history.intents.filter(function (i) { return i.critical; });
        n = ess.filter(function (i) { return has(s.asked, i.id); }).length;
        if (level === 1) return "Have you asked about the thing she is least likely to volunteer? Think about danger to her life, and about what you need before prescribing.";
        if (level === 2) return "There are " + ess.length + " key topics in this history. You have covered " + n + ".";
        return "Key questions still to ask: " + list(ess.filter(function (i) { return !has(s.asked, i.id); }).map(function (i) { return "“" + i.chip + "”"; })) + ".";
      case "exam":
        ess = c.exam.filter(function (e) { return e.essential; });
        if (level === 1) return "Which examination findings would change what happens to her today?";
        if (level === 2) return ess.length + " assessments are essential here. You have done " + ess.filter(function (e) { return has(s.exams, e.id); }).length + ".";
        return "Essential: " + list(ess.map(function (e) { return e.label; })) + ".";
      case "triage": {
        var flags = c.triage.vitals.filter(function (v) { return v.flag; }).map(function (v) { return v.label + " (" + v.value + ")"; });
        if (level === 1) return "Count her danger signs before you choose. How fast could this harm her?";
        if (level === 2) return "Danger signs on screen: " + list(flags) + ". Choose the option that matches that level of danger.";
        return c.triage.feedback;
      }
      case "tests":
        ess = c.tests.filter(function (t) { return t.essential; });
        if (level === 1) return "Which tests would change what you do next? Skip anything that only delays care.";
        if (level === 2) return ess.length + " tests are essential. " + c.tests.filter(function (t) { return t.appropriate === false; }).length + " on the list are not needed.";
        return "Essential: " + list(ess.map(function (t) { return t.label; })) + ".";
      case "results": {
        var keys = window.MamaEngine.availableKeys(c, s.tests);
        var sig = [];
        s.tests.forEach(function (id) { var r = c.results.reports[id]; if (r && r.rows) r.rows.forEach(function (row) { if (row.key && has(c.results.significant, row.key) && has(keys, row.key)) sig.push(row.analyte); }); });
        if (level === 1) return "Scan the Flag column first. Is there a critical result you must acknowledge?";
        if (level === 2) return sig.length + " results here should change your thinking.";
        return "Significant: " + list(sig) + ".";
      }
      case "diagnosis": {
        var wrong = c.diagnosis.options.filter(function (o) { return o.score === 0; }).slice(0, 2).map(function (o) { return o.label; });
        if (level === 1) return "Which option explains everything, not just the main complaint?";
        if (level === 2) return "You can rule out: " + list(wrong) + ".";
        return "Best fit: " + best(c.diagnosis.options).label + ".";
      }
      case "meds": {
        var errs = c.medicationChart.lines.filter(function (l) { return l.error; });
        if (level === 1) return "For each line ask: is it safe for her (pregnancy, other medicines, suicide risk), and are the dose, route and duration right?";
        if (level === 2) return errs.length + " lines are unsafe as written.";
        return "Unsafe: " + list(errs.map(function (l) { return l.drug; })) + ".";
      }
      case "manage": {
        var crit = c.management.options.filter(function (o) { return o.kind === "critical"; });
        var harm = c.management.options.filter(function (o) { return o.kind === "harmful"; });
        if (level === 1) return "Three jobs: treat the cause, keep her safe, plan ahead with her. And watch for options that sound kind but cause harm.";
        if (level === 2) return crit.length + " actions are critical and " + harm.length + " on the list would harm her.";
        return "Critical: " + list(crit.map(function (o) { return o.label; })) + ".";
      }
      case "followup": {
        var f = window.MamaEngine.followupVariant(c, s);
        if (level === 1) return "What has changed, and what is the biggest danger now?";
        if (level === 2) return "Reassess and protect her first. Avoid options that wait, or that stop something abruptly without a reason.";
        return "Best action: " + f.options.filter(function (o) { return o.correct; })[0].label + ".";
      }
      case "resus":
        if (level === 1) return "Is the chest rising with each breath? If not, nothing else works.";
        if (level === 2) return "Order: call for help, dry, clamp the cord, ventilate within 60 seconds, check the chest, check the heart rate after 30 seconds of good breaths.";
        return "If the chest is not rising, reposition the head and mask. Do compressions only if the heart rate stays below 60 despite good ventilation.";
    }
    return "Take your time. Think about what would keep her safe.";
  }

  // Short review after each step (Learn mode)
  function review(c, s, step, day) {
    var good = [], fix = [];
    if (c.drills && c.drills[step]) {
      var dr = window.MamaDrill.evaluate(c, step, (s.drills || {})[step]);
      dr.critical.forEach(function (x) { fix.push(x); });
      dr.notes.forEach(function (x) { fix.push(x); });
      if (!fix.length) good.push("Fast, ordered and safe.");
      if (c.drills[step].teach) fix.push(c.drills[step].teach);
      return { good: good, fix: fix };
    }
    if (c.scenes && c.scenes[step] && step !== "records" && step !== "family") step = "__scene:" + step;
    if (step.indexOf("__scene:") === 0) {
      var st = step.slice(8);
      c.scenes[st].turns.forEach(function (t, i) {
        var o = t.options[(s.scene[st] || [])[i]];
        if (!o) return;
        if (o.score === 100) good.push("Strong response to " + t.speaker + ".");
        else fix.push(t.speaker + ": a stronger response was “" + best(t.options).text + "”");
      });
      if (c.scenes[st].teach) fix.push(c.scenes[st].teach);
      return { good: good, fix: fix };
    }
    switch (step) {
      case "records": case "family":
        c.scenes[step].turns.forEach(function (t, i) {
          var o = t.options[(s.scene[step] || [])[i]];
          if (!o) return;
          if (o.score === 100) good.push("Strong response to " + t.speaker + ".");
          else fix.push(t.speaker + ": a stronger response was “" + best(t.options).text + "”");
        });
        break;
      case "vitals": {
        var ess = c.vitals.filter(function (v) { return v.essential; });
        var missed = ess.filter(function (v) { return !has(s.vitalsTaken, v.id); });
        var taken = c.vitals.filter(function (v) { return has(s.vitalsTaken, v.id); });
        var unflagged = taken.filter(function (v) { return v.abnormal && !has(s.vitalsFlags, v.id); });
        var wrongly = taken.filter(function (v) { return !v.abnormal && has(s.vitalsFlags, v.id); });
        if (!missed.length) good.push("You took every essential measurement.");
        else fix.push("Also needed: " + list(missed.map(function (v) { return v.label; })) + ".");
        unflagged.forEach(function (v) { fix.push(v.label + " " + v.value + " is abnormal."); });
        wrongly.forEach(function (v) { fix.push(v.label + " " + v.value + " is within normal limits."); });
        if (!unflagged.length && !wrongly.length && taken.length) good.push("You read the numbers correctly.");
        break;
      }
      case "history": {
        var crit = c.history.intents.filter(function (i) { return i.critical; });
        var miss = crit.filter(function (i) { return !has(s.asked, i.id); });
        if (!miss.length) good.push("You covered every key topic.");
        else fix.push("Key questions you did not ask: " + list(miss.map(function (i) { return "“" + i.chip + "”"; })));
        if (c.extraFeedback) c.extraFeedback(s, day).filter(function (x) { return /ask/i.test(x); }).forEach(function (x) { fix.push(x); });
        break;
      }
      case "exam": {
        var m = c.exam.filter(function (e) { return e.essential && !has(s.exams, e.id); });
        if (!m.length) good.push("You did every essential assessment.");
        else fix.push("Also needed: " + list(m.map(function (e) { return e.label; })) + ".");
        break;
      }
      case "triage": {
        var b = best(c.triage.options), pick = c.triage.options.find(function (o) { return o.id === s.triage; });
        if (pick && pick.id === b.id) good.push("Right call: " + b.label + ".");
        else fix.push("The safest choice was “" + b.label + "”. " + (pick && pick.critical ? pick.critical : ""));
        fix.push(c.triage.feedback);
        break;
      }
      case "tests": {
        var essT = c.tests.filter(function (t) { return t.essential && !has(s.tests, t.id); });
        var extra = c.tests.filter(function (t) { return t.appropriate === false && has(s.tests, t.id); });
        if (!essT.length && !extra.length) good.push("Focused and complete. Nothing wasted.");
        essT.forEach(function (t) { fix.push("Missing: " + t.label + "."); });
        extra.forEach(function (t) { fix.push("Not needed: " + t.label + ". " + t.why); });
        break;
      }
      case "results": {
        var keys = window.MamaEngine.availableKeys(c, s.tests);
        var missedSig = [];
        s.tests.forEach(function (id) { var r = c.results.reports[id]; if (r && r.rows) r.rows.forEach(function (row) { if (row.key && has(c.results.significant, row.key) && has(keys, row.key) && !has(s.flags, row.key)) missedSig.push(row.analyte); }); });
        var crit2 = window.MamaEngine.criticalRowsShown(c, s.tests).length > 0;
        if (crit2 && !s.ackCritical) fix.push("You did not acknowledge the critical result. " + c.results.criticalNote);
        if (missedSig.length) fix.push("Also significant: " + list(missedSig) + ".");
        if (!fix.length) good.push("You spotted what mattered.");
        break;
      }
      case "diagnosis":
        if (s.dx === best(c.diagnosis.options).id) good.push("Correct diagnosis.");
        else fix.push("Best fit: " + best(c.diagnosis.options).label + ".");
        fix.push(c.diagnosis.explain);
        break;
      case "meds":
        c.medicationChart.lines.forEach(function (l) {
          if (l.error && !has(s.rxFlags, l.id)) fix.push("Unsafe: " + l.drug + ". " + l.why);
          if (l.error && has(s.rxFlags, l.id)) good.push("Caught: " + l.drug + ". " + l.why);
          if (!l.error && has(s.rxFlags, l.id)) fix.push(l.drug + " was safe as written.");
        });
        break;
      case "manage":
        c.management.options.forEach(function (o) {
          if (o.kind === "critical" && !has(s.mgmt, o.id)) fix.push("Missing a critical action: " + o.label + ".");
          if (o.kind === "harmful" && has(s.mgmt, o.id)) fix.push("Harmful: " + o.critical);
        });
        if (!fix.length) good.push("Safe, complete plan.");
        break;
      case "followup": {
        var f = window.MamaEngine.followupVariant(c, s);
        var p = f.options.find(function (o) { return o.id === s.followup; });
        if (p && p.correct) good.push("Right response.");
        else fix.push("Best action: " + f.options.filter(function (o) { return o.correct; })[0].label + ".");
        fix.push(f.explain);
        break;
      }
    }
    return { good: good, fix: fix };
  }

  window.MamaTuto = { DOMAIN: DOMAIN, domainOf: domainOf, briefing: briefing, hint: hint, review: review };
})();

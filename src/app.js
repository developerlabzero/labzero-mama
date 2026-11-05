/*
 * LabZero Mama: user interface. MIT licence.
 */
(function () {
  "use strict";

  var CASES = window.MAMA_CASES;
  var CLINIC = window.MAMA_CLINIC;
  var E = window.MamaEngine;
  var D = window.MamaDialogue;
  var R = window.MamaResus;
  var DR = window.MamaDrill;

  var LABELS = { records: "File room", vitals: "Vitals", triage: "Triage", resus: "Resuscitate", history: "History", exam: "Examine",
    tests: "Order tests", results: "Results", diagnosis: "Diagnose", meds: "Check chart", manage: "Manage",
    family: "Family meeting", followup: "Follow up", debrief: "Debrief" };

  var C = null, state = null, lastStep = -2, dashCase = CASES[0].id, settings = loadSettings();
  var day = { lobby: {}, open: null, role: "Nursing and midwifery", mode: "learn", followed: {}, surge: undefined, showAll: false };
  var T = window.MamaTuto;
  var MODES = [
    { id: "learn", label: "Learn with Tuto", detail: "Briefings, hints and a review after every step. Not scored for competence." },
    { id: "practice", label: "Practice", detail: "Hints on request; each hint costs 5 points." },
    { id: "assessment", label: "Assessment", detail: "No Tuto. This is the run that counts." }
  ];

  function steps() { return C.steps.concat(["debrief"]); }
  function stepLabel(id) { return (C.stepLabels && C.stepLabels[id]) || LABELS[id] || id; }
  function lobbyEntry(id) { return CLINIC.patients.find(function (p) { return p.caseId === id; }); }
  function caseById(id) { return CASES.find(function (c) { return c.id === id; }); }

  function fresh(role) {
    return {
      sessionId: "s-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
      startedAt: new Date().toISOString(), role: role, mode: day.mode, hints: {}, reviewing: false, step: 0, stepId: null,
      scene: {}, vitalsTaken: [], vitalsFlags: [],
      triage: null, asked: [], dialogue: [], exams: [], tests: [], flags: [], ackCritical: false,
      dx: null, rxFlags: [], mgmt: [], followup: null, resus: null, drills: {}, result: null, saved: false
    };
  }

  function loadSettings() {
    var d = { voice: false, useLLM: false, endpoint: "", apiKey: "", model: "" };
    try { var s = JSON.parse(sessionStorage.getItem("labzero-mama.settings") || "null"); if (s) d = Object.assign(d, s); } catch (e) {}
    return d;
  }
  function storeSettings() { try { sessionStorage.setItem("labzero-mama.settings", JSON.stringify(settings)); } catch (e) {} }

  // ---------- helpers ----------
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  function esc(s) { return String(s).replace(/[&<>"']/g, function (ch) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]; }); }
  function toggle(arr, id) { var i = arr.indexOf(id); if (i === -1) arr.push(id); else arr.splice(i, 1); }
  function has(arr, id) { return arr.indexOf(id) !== -1; }

  function render() {
    $("#view-case").classList.toggle("in-lobby", !C);
    if (!C) { renderLobby(); return; }
    state.stepId = steps()[state.step];
    renderStepper();
    renderPatient();
    var setting = C.stepSettings && C.stepSettings[state.stepId] ? '<p class="setting">' + esc(C.stepSettings[state.stepId]) + "</p>" : "";
    $("#stage").innerHTML = setting + (VIEWS[state.stepId] ? VIEWS[state.stepId]() : genericView(state.stepId));
    bind();
    if (state.step !== lastStep) { var h = $("#stage h2"); if (h) h.focus({ preventScroll: true }); lastStep = state.step; }
  }

  // ---------- the clinic lobby ----------
  function renderLobby() {
    $("#stepper").hidden = true;
    $("#patient").innerHTML = "";
    var talked = Object.keys(day.lobby).length;
    var html = '<p class="setting">' + esc(CLINIC.name) + " · waiting area · " + esc(CLINIC.now) + "</p>" +
      '<h2 tabindex="-1">Monday morning, the queue is out the door</h2>' +
      '<p class="lead">' + esc(CLINIC.intro) + "</p>" +
      '<ul class="ambient">' + CLINIC.ambient.map(function (a) { return "<li>" + esc(a) + "</li>"; }).join("") + "</ul>" +
      '<fieldset class="roles"><legend>Your role today</legend>' +
      ["Nursing and midwifery", "Medicine", "Pharmacy"].map(function (r, i) {
        return '<label class="choice"><input type="radio" name="role" id="role-' + i + '" value="' + r + '"' + (day.role === r ? " checked" : "") + "><span>" + r + "</span></label>";
      }).join("") + "</fieldset>" +
      '<fieldset class="modes"><legend>How do you want to play?</legend>' + MODES.map(function (m) {
        return '<label class="choice"><input type="radio" name="mode" id="mode-' + m.id + '" value="' + m.id + '"' + (day.mode === m.id ? " checked" : "") + '><span><strong>' + m.label + "</strong><br><small>" + m.detail + "</small></span></label>";
      }).join("") + "</fieldset>" +
      (day.mode !== "assessment" ? tutoCard('Sawubona! I\'m Tuto. I\'ll walk the clinic with you today. Start with the queue walk: talk to every woman before you decide who can\'t wait. Some of them won\'t tell you what\'s really wrong unless you ask kindly.', "") : "") +
      '<p class="task"><strong>Queue walk.</strong> ' + esc(CLINIC.task) + "</p>" +
      '<div class="benches">' + CLINIC.patients.map(function (p) {
        var c = caseById(p.caseId); if (!c) return "";
        var pick = day.lobby[p.caseId], done = day.followed[p.caseId];
        var open = day.open === p.caseId;
        var body = "";
        if (pick !== undefined) {
          body = '<p class="said">“' + esc(p.said) + '”</p><p class="you-said">You: ' + esc(p.options[pick].text) + '</p><p class="reaction">' + esc(p.options[pick].reply) + "</p>";
        } else if (open) {
          body = '<p class="said">“' + esc(p.said) + '”</p><div class="say">' + p.options.map(function (o, j) {
            return '<button type="button" class="sayopt" data-lobby="' + p.caseId + '" data-opt="' + j + '">' + esc(o.text) + "</button>";
          }).join("") + "</div>";
        }
        return '<article class="seat' + (pick !== undefined && p.options[pick].fastTrack ? " fast" : "") + '">' +
          '<header><span class="ticket">Ticket ' + esc(p.ticket) + '</span><span class="wait">since ' + esc(p.arrived) + " · " + esc(p.waited) + "</span></header>" +
          '<div class="mood" aria-label="Frustration ' + p.mood + ' of 5">' + [1, 2, 3, 4, 5].map(function (i) { return '<span class="' + (i <= p.mood ? "on" : "") + '"></span>'; }).join("") + "</div>" +
          '<p class="look">' + esc(p.look) + "</p>" + body +
          '<div class="seat-actions">' +
            (pick === undefined && !open ? '<button type="button" data-talk="' + p.caseId + '">Speak to her</button>' : "") +
            (p.event ? '<span class="waiting-note">' + (eventUnlocked("collapse") ? "Collapsed on the bench" : "Waiting for her repeat tablets") + "</span>" :
            '<button type="button" class="primary" data-follow="' + p.caseId + '">' + (done !== undefined ? "Follow again (" + done + ")" : "Follow her visit") + "</button>") +
          "</div>" +
        "</article>";
      }).join("") + "</div>" +
      '<p class="hint">' + talked + " of " + CLINIC.patients.length + " spoken to on the queue walk." + (talked < CLINIC.patients.length ? " Someone in this queue may not be able to wait." : "") + "</p>" +
      renderEvents();
    $("#stage").innerHTML = html;
    bindLobby();
  }

  function routineDone() { return CLINIC.patients.filter(function (p) { return !p.event && day.followed[p.caseId] !== undefined; }).length; }
  function eventUnlocked(id) {
    if (day.showAll) return true;
    if (id === "collapse") return routineDone() >= 1;
    if (id === "surge") return day.followed[CLINIC.collapse.caseId] !== undefined;
    if (id === "taxi") return CLINIC.surge.cases.some(function (x) { return day.followed[x.caseId] !== undefined; });
    return false;
  }

  function renderEvents() {
    var out = "";
    if (eventUnlocked("collapse")) {
      var cd = day.followed[CLINIC.collapse.caseId];
      out += '<section class="alarm" aria-live="assertive"><p class="alarm-time">' + esc(CLINIC.collapse.time) + '</p><h3>' + esc(CLINIC.collapse.title) + "</h3><p>" + esc(CLINIC.collapse.text) + '</p><div class="seat-actions"><button type="button" class="primary danger" data-follow="' + CLINIC.collapse.caseId + '">' + (cd !== undefined ? "Run the scenario again (" + cd + ")" : "Run to her") + "</button></div></section>";
    }
    if (eventUnlocked("surge")) {
      var sg = CLINIC.surge, pk = day.surge;
      out += '<section class="alarm surge" aria-live="assertive"><p class="alarm-time">' + esc(sg.time) + '</p><h3>' + esc(sg.title) + "</h3>" +
        sg.text.map(function (t) { return "<p>" + esc(t) + "</p>"; }).join("") +
        (pk === undefined ? '<fieldset class="list say"><legend>' + esc(sg.question) + "</legend>" + sg.options.map(function (o, j) {
          return '<button type="button" class="sayopt" data-surge="' + j + '">' + esc(o.text) + "</button>";
        }).join("") + "</fieldset>" :
        '<p class="you-said">You: ' + esc(sg.options[pk].text) + '</p><p class="reaction">' + esc(sg.options[pk].reply) + "</p>" +
        '<div class="seat-actions">' + sg.cases.map(function (x) {
          var dn = day.followed[x.caseId];
          return '<button type="button" class="primary" data-follow="' + x.caseId + '">' + esc(x.label) + (dn !== undefined ? " (" + dn + ")" : "") + "</button>";
        }).join("") + "</div>") + "</section>";
    }
    if (CLINIC.maternity && eventUnlocked("collapse")) {
      out += '<h3 class="unit-head">Meanwhile, in the maternity unit</h3>' + CLINIC.maternity.map(function (m) {
        var md = day.followed[m.caseId];
        return '<section class="alarm maternity" aria-live="polite"><p class="alarm-time">' + esc(m.time) + '</p><h3>' + esc(m.title) + "</h3><p>" + esc(m.text) + '</p><div class="seat-actions"><button type="button" class="primary danger" data-follow="' + m.caseId + '">' + (md !== undefined ? "Run the scenario again (" + md + ")" : esc(m.button)) + "</button></div></section>";
      }).join("");
    }
    if (eventUnlocked("taxi")) {
      var tx = CLINIC.taxi, td = day.followed[tx.caseId];
      out += '<section class="alarm" aria-live="assertive"><p class="alarm-time">' + esc(tx.time) + '</p><h3>' + esc(tx.title) + "</h3><p>" + esc(tx.text) + '</p><div class="seat-actions"><button type="button" class="primary danger" data-follow="' + tx.caseId + '">' + (td !== undefined ? "Run the scenario again (" + td + ")" : "Go to the taxi") + "</button></div></section>";
    }
    if (!eventUnlocked("taxi")) out += '<p class="hint reviewer"><button type="button" class="linkish" id="showall">Reviewer shortcut: unlock every emergency now</button></p>';
    return out;
  }

  function bindLobby() {
    var sa = $("#showall"); if (sa) sa.onclick = function () { day.showAll = true; render(); };
    document.querySelectorAll("[data-surge]").forEach(function (b) { b.onclick = function () { day.surge = parseInt(b.dataset.surge, 10); render(); }; });
    document.querySelectorAll('input[name="role"]').forEach(function (i) { i.onchange = function () { day.role = i.value; }; });
    document.querySelectorAll('input[name="mode"]').forEach(function (i) { i.onchange = function () { day.mode = i.value; render(); }; });
    document.querySelectorAll("[data-talk]").forEach(function (b) { b.onclick = function () { day.open = b.dataset.talk; render(); }; });
    document.querySelectorAll("[data-lobby]").forEach(function (b) { b.onclick = function () { day.lobby[b.dataset.lobby] = parseInt(b.dataset.opt, 10); day.open = null; render(); }; });
    document.querySelectorAll("[data-follow]").forEach(function (b) {
      b.onclick = function () { C = caseById(b.dataset.follow); state = fresh(day.role); lastStep = -2; render(); window.scrollTo({ top: 0 }); };
    });
  }

  function renderStepper() {
    var el = $("#stepper");
    el.innerHTML = '<li class="lobby-link"><button type="button" id="tolobby">Lobby</button></li>' + steps().map(function (id, i) {
      var cls = i < state.step ? "done" : i === state.step ? "now" : "";
      return '<li class="' + cls + '"><span class="n">' + (i + 1) + '</span><span class="t">' + stepLabel(id) + "</span></li>";
    }).join("");
    el.hidden = false;
    $("#tolobby").onclick = function () { C = null; state = null; render(); };
  }

  function earlyMonitor() {
    var p = lobbyEntry(C.id) || {};
    var tiles = [{ k: "Ticket", v: p.ticket || "–", u: "" }, { k: "Waited", v: (p.waited || "").split(" ")[0] + " h", u: "since " + (p.arrived || "") , alert: true }];
    C.vitals.filter(function (v) { return has(state.vitalsTaken, v.id); }).slice(-2).forEach(function (v) {
      tiles.push({ k: v.label.split(" (")[0], v: v.value.length > 9 ? v.value.slice(0, 9) + "…" : v.value, u: v.unit.length > 12 ? "" : v.unit, alert: v.abnormal });
    });
    return tiles;
  }

  function renderPatient() {
    var p = C.patient;
    var early = has(["records", "vitals"], state.stepId);
    var tiles = early && C.vitals && lobbyEntry(C.id) ? earlyMonitor() : C.monitor(state);
    $("#patient").innerHTML =
      '<p class="eyebrow">Patient</p><h3>' + esc(p.name) + "</h3>" +
      '<p class="meta">' + esc(String(p.age)) + (typeof p.age === "number" ? " years" : "") + " · " + esc(p.obstetric) + "</p>" +
      '<p class="meta">' + esc(p.arrival) + "</p>" +
      '<div class="monitor" aria-label="Observations">' + tiles.map(function (m) { return mon(m.k, m.v, m.u, m.alert); }).join("") + "</div>" +
      '<p class="case-tag">' + (state.stepId === "debrief" ? esc(C.family) + " · " : "") + "Case v" + esc(C.version) + "</p>" +
      '<p class="role-tag">Playing as: <strong>' + esc(state.role) + "</strong> · " + esc(MODES.find(function (m) { return m.id === state.mode; }).label) + "</p>" + renderTuto();
  }
  function tutoCard(say, extra) {
    return '<aside class="tuto" aria-label="Tuto, your tutor"><div class="tuto-face" aria-hidden="true">T</div><div class="tuto-body"><p class="tuto-name">Tuto</p><p>' + esc(say) + "</p>" + extra + "</div></aside>";
  }

  function renderTuto() {
    if (state.mode === "assessment" || state.stepId === "debrief") return "";
    var lvl = state.hints[state.stepId] || 0, shown = "";
    for (var i = 1; i <= lvl; i++) shown += '<p class="tuto-hint"><span>Hint ' + i + "</span>" + esc(T.hint(C, state, state.stepId, i)) + "</p>";
    var btn = lvl < 3 ? '<button type="button" id="hint" class="tuto-btn">' + (lvl === 0 ? "Give me a hint" : lvl === 1 ? "A bigger hint" : "Show me the answer") + (state.mode === "practice" ? " (\u22125 points)" : "") + "</button>" : "";
    return tutoCard(T.briefing(C, state.stepId), shown + btn);
  }

  function mon(k, v, u, alert) { return '<div class="m' + (alert ? " alert" : "") + '"><span class="k">' + esc(k) + '</span><span class="v">' + esc(v) + '</span><span class="u">' + esc(u) + "</span></div>"; }

  function nav(label, disabled, hint) {
    if (state && state.reviewing) {
      var rv = T.review(C, state, state.stepId, day);
      return '<div class="tuto-review" role="status"><div class="tuto-face" aria-hidden="true">T</div><div><p class="tuto-name">Tuto\u2019s review</p>' +
        (rv.good.length ? '<ul class="rv-good">' + rv.good.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul>" : "") +
        (rv.fix.length ? '<ul class="rv-fix">' + rv.fix.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul>" : "") +
        '</div></div><div class="nav"><button class="primary" id="next">On to the next step</button></div>';
    }
    return '<div class="nav">' + (hint ? '<p class="hint">' + hint + "</p>" : "") +
      '<button class="primary" id="next"' + (disabled ? " disabled" : "") + ">" + (label || "Continue") + "</button></div>";
  }

  function viewScene(key) {
    var sc = C.scenes[key], picks = state.scene[key] || (state.scene[key] = []), out = "";
    for (var i = 0; i < sc.turns.length; i++) {
      var t = sc.turns[i], pick = picks[i];
      out += '<div class="msg pt"><span class="who">' + esc(t.speaker) + "</span><p>" + esc(t.line) + "</p></div>";
      if (pick === undefined) {
        out += '<fieldset class="list say"><legend>What do you say?</legend>' + t.options.map(function (o, j) {
          return '<button type="button" class="sayopt" data-say="' + key + '" data-opt="' + j + '">' + esc(o.text) + "</button>";
        }).join("") + "</fieldset>";
        break;
      }
      out += '<div class="msg you"><span class="who">You</span><p>' + esc(t.options[pick].text) + "</p></div>" +
        '<p class="reaction">' + esc(t.options[pick].reply) + "</p>";
    }
    return { done: picks.length === sc.turns.length, html: '<h2 tabindex="-1">' + esc(sc.title) + '</h2><p class="lead">' + esc(sc.lead) + "</p>" + '<div class="chat convo">' + out + "</div>" };
  }

  function genericView(id) {
    if (C.scenes && C.scenes[id]) {
      var sc = C.scenes[id], v = viewScene(id), ev = sc.event ? sc.event(state, day) : null;
      return (ev ? '<div class="event warn"><p>' + esc(ev) + "</p></div>" : "") + v.html + (v.done && sc.after ? '<div class="event"><p>' + esc(sc.after) + "</p></div>" : "") + nav(sc.next || "Continue", !v.done);
    }
    if (C.drills && C.drills[id]) return viewDrill(id);
    return "<p>Unknown step.</p>";
  }

  function viewDrill(id) {
    var d = C.drills[id], r = state.drills[id] || (state.drills[id] = DR.init(C, id));
    var groups = {};
    d.actions.forEach(function (a) { (groups[a.group] = groups[a.group] || []).push(a); });
    var log = r.log.slice().reverse().map(function (l) { return '<li class="lg lg-' + l.kind + '"><span class="ts">' + DR.clock(l.t) + "</span><span>" + esc(l.text) + "</span></li>"; }).join("");
    var meter = d.meter ? '<span class="meter">' + esc(d.meter.label) + ": <strong>" + esc(d.meter.fmt ? d.meter.fmt(r.meter) : Math.round(r.meter)) + "</strong> " + esc(d.meter.unit) + "</span>" : "";
    return '<h2 tabindex="-1">' + esc(d.title) + '</h2><p class="lead">' + esc(d.intro) + "</p>" +
      '<div class="clockbar' + (d.alarm && d.alarm(r) ? " golden" : "") + '"><span class="big">' + DR.clock(r.t) + "</span><span>" + esc(d.status ? d.status(r, DR.did) : "") + "</span>" + meter + "</div>" +
      (r.finished ? "" : '<div class="resus-actions">' + Object.keys(groups).map(function (g) {
        return '<div class="rg"><p class="eyebrow">' + esc(g) + "</p>" + groups[g].map(function (a) {
          var used = a.repeat !== true && DR.did(r, a.id);
          return '<button type="button" class="ra' + (a.end ? " end" : "") + '" data-drill="' + a.id + '"' + (used ? " disabled" : "") + "><span>" + esc(a.label) + '</span><span class="cost">' + (used ? "done" : a.cost ? "+" + a.cost + " s" : "now") + "</span></button>";
        }).join("") + "</div>";
      }).join("") + "</div>") +
      '<section><h3>What has happened</h3><ol class="log">' + (log || '<li class="lg"><span class="ts">' + DR.clock(r.t) + "</span><span>" + esc(d.opening) + "</span></li>") + "</ol></section>" +
      nav(d.next || "Continue", !r.finished, r.finished ? "" : esc(d.finishHint || "Finish the emergency to continue"));
  }

  // ---------- views ----------
  var VIEWS = {
    records: function () {
      var v = viewScene("records");
      var file = v.done && C.file ? '<article class="report folder"><header><span>' + esc(C.file.title) + '</span><span class="lab">Read before she is seen</span></header><ul>' +
        C.file.entries.map(function (e) { return "<li>" + esc(e) + "</li>"; }).join("") + "</ul></article>" : "";
      return v.html + file + nav("Take her to the nurse", !v.done);
    },

    vitals: function () {
      var warn = C.beforeVitals ? C.beforeVitals(state, day) : null;
      var taken = C.vitals.filter(function (v) { return has(state.vitalsTaken, v.id); });
      return (warn ? '<div class="event warn"><p>' + esc(warn) + "</p></div>" : "") +
        '<h2 tabindex="-1">The vitals station</h2><p class="lead">Sister Nkosi has a queue of her own. Choose the measurements this patient needs, then tick any result that is abnormal.</p>' +
        '<div class="actions">' + C.vitals.map(function (v) {
          var done = has(state.vitalsTaken, v.id);
          return '<button type="button" class="ra" data-vital="' + v.id + '"' + (done ? " disabled" : "") + "><span>" + esc(v.label) + '</span><span class="cost">' + (done ? "done" : "measure") + "</span></button>";
        }).join("") + "</div>" +
        (taken.length ? '<div class="tablewrap"><table class="vtable"><thead><tr><th>Measurement</th><th>Result</th><th>She says</th><th>Abnormal?</th></tr></thead><tbody>' +
          taken.map(function (v) {
            return "<tr><td>" + esc(v.label) + '</td><td class="num">' + esc(v.value) + " " + esc(v.unit) + '</td><td class="talk">' + esc(v.line) + '</td><td><input type="checkbox" aria-label="Mark ' + esc(v.label) + ' abnormal" data-vflag="' + v.id + '"' + (has(state.vitalsFlags, v.id) ? " checked" : "") + "></td></tr>";
          }).join("") + "</tbody></table></div>" : "") +
        nav("Send her to the doctor", taken.length === 0, taken.length + " measured");
    },

    triage: function () {
      var t = C.triage;
      return '<h2 tabindex="-1">' + esc(t.title) + "</h2>" +
        '<p class="lead">' + esc(t.look) + "</p>" +
        '<div class="vitals">' + t.vitals.map(function (v) {
          return '<div class="vital' + (v.flag ? " high" : "") + '"><span>' + esc(v.label) + "</span><strong>" + esc(v.value) + " <small>" + esc(v.unit) + "</small></strong></div>";
        }).join("") + "</div>" +
        '<fieldset class="triage-grid"><legend>' + esc(t.question) + "</legend>" + t.options.map(function (o, i) {
          return '<label class="tri tri-' + i + '"><input type="radio" name="triage" id="tri-' + o.id + '" value="' + o.id + '"' + (state.triage === o.id ? " checked" : "") + '><span class="tl">' + esc(o.label) + '</span><span class="td">' + esc(o.detail) + "</span></label>";
        }).join("") + "</fieldset>" +
        (state.triage ? '<p class="explain">' + esc(t.feedback) + "</p>" : "") +
        nav("Confirm", !state.triage);
    },

    resus: function () {
      var r = state.resus || (state.resus = R.init(C));
      var groups = {};
      C.resus.actions.forEach(function (a) { (groups[a.group] = groups[a.group] || []).push(a); });
      var log = r.log.slice().reverse().map(function (l) { return '<li class="lg lg-' + l.kind + '"><span class="ts">' + R.clock(l.t) + "</span><span>" + esc(l.text) + "</span></li>"; }).join("");
      var golden = r.t <= 60 && !r.ventilating;
      return '<h2 tabindex="-1">Resuscitate</h2><p class="lead">' + esc(C.resus.intro) + "</p>" +
        '<div class="clockbar' + (golden ? " golden" : "") + '"><span class="big">' + R.clock(r.t) + "</span><span>" + (r.ventilating ? (r.effective ? "Ventilating · chest rising" : "Ventilating · check the chest") : golden ? "Golden Minute: start ventilation by 1:00" : "Not yet ventilating") + "</span></div>" +
        (r.done ? '<div class="event' + (r.outcome === "stable" ? "" : " warn") + '"><p>' + esc(r.outcome === "stable" ? C.resus.afterStable : r.log[r.log.length - 1].text) + "</p></div>" :
        '<div class="resus-actions">' + Object.keys(groups).map(function (g) {
          return '<div class="rg"><p class="eyebrow">' + esc(g) + "</p>" + groups[g].map(function (a) {
            return '<button type="button" class="ra" data-resus="' + a.id + '"><span>' + esc(a.label) + '</span><span class="cost">' + (a.cost ? "+" + a.cost + " s" : "now") + "</span></button>";
          }).join("") + "</div>";
        }).join("") + "</div>") +
        '<section><h3>What has happened</h3><ol class="log">' + (log || '<li class="lg"><span class="ts">0:00</span><span>The baby is born. Not breathing.</span></li>') + "</ol></section>" +
        nav("Continue", !r.done, r.done ? "" : "Finish the resuscitation to continue");
    },

    history: function () {
      var h = C.history;
      var asked = state.dialogue.map(function (d) {
        return '<div class="msg you"><span class="who">You</span><p>' + esc(d.q) + "</p></div>" +
          '<div class="msg pt"><span class="who">' + esc(h.speaker) + (d.method === "llm" ? " · matched by AI" : "") + "</span><p>" + esc(d.a) + "</p></div>";
      }).join("");
      return '<h2 tabindex="-1">' + esc(h.title || (h.speakerRole === "the patient" ? "Take a history" : "Ask " + h.speakerRole)) + "</h2>" +
        '<p class="lead">' + esc(h.prompt) + "</p>" +
        '<div class="chat" id="chat" aria-live="polite">' + (asked || '<p class="empty">“' + esc(C.opening) + '”</p>') + "</div>" +
        '<form class="ask" id="askform"><label for="q" class="sr">Your question</label><input id="q" autocomplete="off" placeholder="Type your question"><button type="submit">Ask</button></form>' +
        '<details class="suggest"><summary>Suggested questions</summary><div class="chips">' +
        h.intents.map(function (i) { return '<button type="button" class="chip' + (has(state.asked, i.id) ? " used" : "") + '" data-chip="' + i.id + '">' + esc(i.chip) + "</button>"; }).join("") +
        "</div></details>" +
        nav("Finish questions", state.asked.length === 0, state.asked.length + " of " + h.intents.length + " topics covered");
    },

    exam: function () {
      var after = C.afterTriage ? C.afterTriage(state) : null;
      return (after ? '<div class="event warn"><p>' + esc(after) + "</p></div>" : "") +
        '<h2 tabindex="-1">' + esc(C.examTitle || "Examine her") + '</h2><p class="lead">' + esc(C.examLead || "Choose each examination. The finding appears when you perform it.") + "</p>" +
        '<div class="actions">' + C.exam.map(function (e) {
          var done = has(state.exams, e.id);
          return '<div class="act' + (done ? " done" : "") + '"><button type="button" data-exam="' + e.id + '"' + (done ? " disabled" : "") + ">" + esc(e.label) + "</button>" +
            (done ? '<p class="finding">' + esc(e.finding) + "</p>" : "") + "</div>";
        }).join("") + "</div>" + nav("Finish", state.exams.length === 0);
    },

    tests: function () {
      var groups = {};
      C.tests.forEach(function (t) { (groups[t.group] = groups[t.group] || []).push(t); });
      return '<h2 tabindex="-1">Order investigations</h2><p class="lead">Order what will change your management. Each unnecessary test costs time and money.</p>' +
        '<div class="order">' + Object.keys(groups).map(function (g) {
          return "<fieldset><legend>" + esc(g) + "</legend>" + groups[g].map(function (t) {
            return '<label class="check"><input type="checkbox" id="t-' + t.id + '" data-test="' + t.id + '"' + (has(state.tests, t.id) ? " checked" : "") + "><span>" + esc(t.label) + "</span></label>";
          }).join("") + "</fieldset>";
        }).join("") + "</div>" + nav("Send requests", state.tests.length === 0, state.tests.length + " requested");
    },

    results: function () {
      var crit = E.criticalRowsShown(C, state.tests).length > 0;
      var reports = state.tests.map(function (id) {
        var r = C.results.reports[id]; if (!r) return "";
        var body = r.rows ? '<div class="tablewrap"><table><thead><tr><th>Test</th><th>Result</th><th>Units</th><th>Reference</th><th>Flag</th><th>Significant?</th></tr></thead><tbody>' +
          r.rows.map(function (row) {
            return "<tr" + (row.critical ? ' class="crit"' : "") + "><td>" + esc(row.analyte) + '</td><td class="num">' + esc(row.value) + "</td><td>" + esc(row.unit) + '</td><td class="num">' + esc(row.range) + '</td><td class="flag">' + (row.flag ? '<span class="f f-' + row.flag + '">' + row.flag + "</span>" : "") + "</td><td>" +
              (row.key ? '<input type="checkbox" aria-label="Mark ' + esc(row.analyte) + ' as significant" data-flag="' + row.key + '"' + (has(state.flags, row.key) ? " checked" : "") + ">" : "") + "</td></tr>";
          }).join("") + "</tbody></table></div>" : '<p class="report-text">' + esc(r.text) + "</p>";
        return '<article class="report"><header><span>' + esc(r.title) + '</span><span class="lab">Reported (simulated time)</span></header>' + body + "</article>";
      }).join("");
      return '<h2 tabindex="-1">Read the results</h2><p class="lead">' + esc(C.results.turnaround) + " Tick every result that changes your thinking.</p>" +
        (crit ? '<div class="critical-call"><strong>Critical result.</strong> ' + esc(C.results.criticalNote) + '<label class="check"><input type="checkbox" id="ack"' + (state.ackCritical ? " checked" : "") + "><span>I acknowledge this result and will act on it</span></label></div>" : "") +
        reports + nav("Continue", false);
    },

    diagnosis: function () {
      return '<h2 tabindex="-1">What is wrong?</h2><p class="lead">Choose the working diagnosis that fits everything you found.</p>' +
        '<fieldset class="list"><legend class="sr">Working diagnosis</legend>' + C.diagnosis.options.map(function (o) {
          return '<label class="choice"><input type="radio" name="dx" id="dx-' + o.id + '" value="' + o.id + '"' + (state.dx === o.id ? " checked" : "") + "><span>" + esc(o.label) + "</span></label>";
        }).join("") + "</fieldset>" + nav("Confirm diagnosis", !state.dx);
    },

    meds: function () {
      return '<h2 tabindex="-1">Check the medication chart</h2><p class="lead">' + esc(C.medicationChart.intro) + " Flag each line that is unsafe as written.</p>" +
        '<div class="chart">' + C.medicationChart.lines.map(function (l, i) {
          return '<label class="rx"><span class="no">' + (i + 1) + '</span><span class="drug"><strong>' + esc(l.drug) + "</strong>" + esc(l.order) + '</span><span class="flagbox"><input type="checkbox" id="rx-' + l.id + '" data-rx="' + l.id + '"' + (has(state.rxFlags, l.id) ? " checked" : "") + "> Unsafe</span></label>";
        }).join("") + "</div>" + nav("Chart checked", false);
    },

    manage: function () {
      return '<h2 tabindex="-1">Manage now</h2><p class="lead">' + (state.role === "Pharmacy" ? "Choose what you recommend to the team." : "Choose every action you take.") + "</p>" +
        '<fieldset class="list"><legend class="sr">Management</legend>' + C.management.options.map(function (o) {
          return '<label class="check"><input type="checkbox" id="m-' + o.id + '" data-mgmt="' + o.id + '"' + (has(state.mgmt, o.id) ? " checked" : "") + "><span>" + esc(o.label) + "</span></label>";
        }).join("") + "</fieldset>" + nav("Carry out the plan", state.mgmt.length === 0);
    },

    family: function () {
      var v = viewScene("family");
      return v.html + nav("End the meeting", !v.done);
    },

    followup: function () {
      var f = E.followupVariant(C, state);
      return '<h2 tabindex="-1">' + esc(f.time) + "</h2>" +
        '<div class="event"><p>' + esc(f.situation) + "</p></div>" +
        (has(state.mgmt, "bolus") ? '<div class="event warn"><p>She is also breathless. SpO₂ has fallen to 89% and there are crackles at both lung bases after the fluid bolus.</p></div>' : "") +
        '<fieldset class="list"><legend>What do you do?</legend>' + f.options.map(function (o) {
          return '<label class="choice"><input type="radio" name="fu" id="fu-' + o.id + '" value="' + o.id + '"' + (state.followup === o.id ? " checked" : "") + "><span>" + esc(o.label) + "</span></label>";
        }).join("") + "</fieldset>" + nav("Act", !state.followup);
    },

    debrief: function () {
      if (!state.result) {
        state.result = E.evaluate(C, state, day);
        if (!state.saved) { E.saveSession(E.buildRecord(C, state, state.result, day)); state.saved = true; day.followed[C.id] = state.result.total; }
      }
      var r = state.result;
      var top = C.diagnosis ? C.diagnosis.options.slice().sort(function (a, b) { return b.score - a.score; })[0] : null;
      var crit = r.critical.length ? '<section class="crit-list"><h3>Critical errors (' + r.critical.length + ")</h3><ul>" + r.critical.map(function (c) { return "<li>" + esc(c) + "</li>"; }).join("") + "</ul><p>Critical errors are reported separately and cannot be averaged away.</p></section>" : '<section class="clean"><h3>No critical errors</h3><p>Every safety-critical step was completed.</p></section>';
      var f = C.followup ? E.followupVariant(C, state) : null;
      return '<h2 tabindex="-1">Debrief: ' + esc(C.patient.name) + "</h2>" +
        '<div class="verdict ' + (r.passed ? "pass" : "fail") + '"><span class="big">' + r.total + "</span><span><strong>" + (r.mode === "learn" ? "Learning run with Tuto" : r.passed ? "Competent on this case" : "Not yet competent on this case") + "</strong><br>" + (r.mode === "learn" ? "Ready to test yourself? Play this case again in Assessment mode." : "Pass rule: 70 or more and no critical errors.") + "</span></div>" +
        crit +
        "<section><h3>By competency</h3>" + bars(C.domains, r.scores) + "</section>" +
        (top ? "<section><h3>Diagnosis</h3><p>" + (state.dx === top.id ? "Correct. " : "The working diagnosis was: " + esc(top.label) + ". ") + esc(C.diagnosis.explain) + "</p></section>" : "") +
        (C.debriefNote ? "<section><h3>" + esc(C.debriefNote.title) + "</h3>" + C.debriefNote.paras.map(function (x) { return "<p>" + esc(x) + "</p>"; }).join("") + "</section>" : "") +
        (f ? "<section><h3>What happened next</h3><p>" + esc(f.explain) + "</p></section>" : "") +
        (r.feedback.length ? "<section><h3>Feedback</h3><ul>" + r.feedback.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul></section>" : "") +
        "<section><h3>Learning points</h3><ul>" + C.learningPoints.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul></section>" +
        (C.support ? '<p class="support-note">' + esc(C.support) + "</p>" : "") +
        '<div class="nav"><button id="todash">Open the dashboard</button><button class="primary" id="backlobby">Back to the lobby</button></div>';
    }
  };

  function bars(domains, scores) {
    return '<div class="bars">' + domains.map(function (d) {
      var v = scores[d.id] || 0;
      return '<div class="bar"><span class="bl">' + esc(d.label) + '</span><span class="track"><span class="fill ' + (v >= 70 ? "ok" : v >= 40 ? "mid" : "low") + '" style="width:' + v + '%"></span></span><span class="bv">' + v + "</span></div>";
    }).join("") + "</div>";
  }

  // ---------- dashboard ----------
  function renderDashboard() {
    var c = caseById(dashCase) || CASES[0];
    var mine = E.loadSessions().filter(function (s) { return s.caseId === c.id; });
    var examples = E.exampleCohort(c);
    var all = mine.concat(examples);
    var avg = {};
    c.domains.forEach(function (d) { avg[d.id] = Math.round(all.reduce(function (a, s) { return a + (s.domainScores[d.id] || 0); }, 0) / all.length); });
    var passRate = Math.round(100 * all.filter(function (s) { return s.passed; }).length / all.length);
    var errs = {};
    all.forEach(function (s) { s.criticalErrors.forEach(function (e) { var k = e.split(":")[0].replace(/\.$/, ""); errs[k] = (errs[k] || 0) + 1; }); });
    var top = Object.keys(errs).sort(function (a, b) { return errs[b] - errs[a]; }).slice(0, 5);
    var weakest = c.domains.slice().sort(function (a, b) { return avg[a.id] - avg[b.id]; })[0];
    var allMine = E.loadSessions();
    $("#dash").innerHTML =
      '<div class="dash-head"><div><p class="eyebrow">Cohort view</p><h2 tabindex="-1">Where trainees struggle</h2></div>' +
      '<div class="field"><label for="dash-case">Case</label><select id="dash-case">' + CASES.map(function (x) { return '<option value="' + x.id + '"' + (x.id === c.id ? " selected" : "") + ">" + esc(x.patient.name + ": " + x.title) + "</option>"; }).join("") + "</select></div></div>" +
      '<p class="lead">' + mine.length + " of your session" + (mine.length === 1 ? "" : "s") + " plus " + examples.length + ' <span class="pill">example</span> sessions. Data stays on this device; the public dashboard will publish anonymised totals only.</p>' +
      '<div class="kpis"><div><span class="k">Sessions</span><span class="v">' + all.length + '</span></div><div><span class="k">Pass rate</span><span class="v">' + passRate + '%</span></div><div><span class="k">Weakest skill</span><span class="v small">' + esc(weakest.label) + "</span></div></div>" +
      "<section><h3>Average score by competency</h3>" + bars(c.domains, avg) + "</section>" +
      '<section><h3>Most common critical errors</h3><ol class="errs">' + (top.length ? top.map(function (k) { return "<li><span>" + esc(k) + '</span><span class="num">' + errs[k] + "</span></li>"; }).join("") : "<li>None yet.</li>") + "</ol></section>" +
      '<section><h3>Learner record format</h3><p>Each completed case produces one JSON record (schema <code>labzero-mama/learner-record@0.2</code>). Copy all your records below.</p>' +
      '<textarea id="export" readonly rows="6">' + esc(JSON.stringify(allMine, null, 2)) + '</textarea><div class="nav"><button id="copy">Copy records</button><button id="clear">Clear my records</button></div><p class="hint" id="copymsg" aria-live="polite"></p></section>';
    $("#dash-case").onchange = function () { dashCase = this.value; renderDashboard(); };
    $("#copy").onclick = function () {
      var t = $("#export"), msg = $("#copymsg");
      try { navigator.clipboard.writeText(t.value).then(function () { msg.textContent = "Copied."; }, function () { t.select(); msg.textContent = "Selected. Press Ctrl+C to copy."; }); }
      catch (e) { t.select(); msg.textContent = "Selected. Press Ctrl+C to copy."; }
    };
    $("#clear").onclick = function () { E.clearSessions(); renderDashboard(); };
  }

  function showView(v) {
    $("#view-case").hidden = v !== "case";
    $("#view-dash").hidden = v !== "dash";
    $("#view-about").hidden = v !== "about";
    document.querySelectorAll(".tabs button").forEach(function (b) { b.setAttribute("aria-current", b.dataset.view === v ? "page" : "false"); });
    if (v === "dash") { if (C) dashCase = C.id; renderDashboard(); }
  }

  // ---------- events ----------
  function next() {
    if (state.mode === "learn" && !state.reviewing && state.stepId !== "resus") { state.reviewing = true; render(); var r = $(".tuto-review"); if (r) r.scrollIntoView({ behavior: "smooth", block: "center" }); return; }
    state.reviewing = false;
    state.step = Math.min(steps().length - 1, state.step + 1); render(); window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function askQuestion(text, chipId) {
    text = (text || "").trim(); if (!text) return;
    var res;
    if (chipId) res = { intent: C.history.intents.find(function (i) { return i.id === chipId; }), method: "suggested" };
    else res = await D.ask(text, C.history.intents, settings);
    var answer = res.intent ? res.intent.reply : C.history.fallback;
    state.dialogue.push({ q: text, a: answer, intent: res.intent ? res.intent.id : null, method: res.method });
    if (res.intent && !has(state.asked, res.intent.id)) state.asked.push(res.intent.id);
    D.speak(answer, settings.voice);
    render();
    var chat = $("#chat"); if (chat) chat.scrollTop = chat.scrollHeight;
    var q = $("#q"); if (q) q.focus();
  }

  function bind() {
    var b;
    if ((b = $("#next"))) b.onclick = next;
    if ((b = $("#hint"))) b.onclick = function () { state.hints[state.stepId] = (state.hints[state.stepId] || 0) + 1; render(); };
    if ((b = $("#backlobby"))) b.onclick = function () { C = null; state = null; render(); window.scrollTo({ top: 0 }); };
    if ((b = $("#todash"))) b.onclick = function () { showView("dash"); };
    document.querySelectorAll('input[name="triage"]').forEach(function (i) { i.onchange = function () { state.triage = i.value; render(); }; });
    document.querySelectorAll('input[name="dx"]').forEach(function (i) { i.onchange = function () { state.dx = i.value; render(); }; });
    document.querySelectorAll('input[name="fu"]').forEach(function (i) { i.onchange = function () { state.followup = i.value; render(); }; });
    document.querySelectorAll("[data-exam]").forEach(function (x) { x.onclick = function () { state.exams.push(x.dataset.exam); render(); }; });
    document.querySelectorAll("[data-vital]").forEach(function (x) { x.onclick = function () { state.vitalsTaken.push(x.dataset.vital); render(); }; });
    document.querySelectorAll("[data-vflag]").forEach(function (x) { x.onchange = function () { toggle(state.vitalsFlags, x.dataset.vflag); }; });
    document.querySelectorAll("[data-drill]").forEach(function (x) { x.onclick = function () { DR.act(C, state.stepId, state.drills[state.stepId], x.dataset.drill); render(); }; });
    document.querySelectorAll("[data-resus]").forEach(function (x) { x.onclick = function () { R.act(C, state.resus, x.dataset.resus); render(); }; });
    document.querySelectorAll("[data-test]").forEach(function (x) { x.onchange = function () { toggle(state.tests, x.dataset.test); render(); }; });
    document.querySelectorAll("[data-flag]").forEach(function (x) { x.onchange = function () { toggle(state.flags, x.dataset.flag); }; });
    document.querySelectorAll("[data-rx]").forEach(function (x) { x.onchange = function () { toggle(state.rxFlags, x.dataset.rx); }; });
    document.querySelectorAll("[data-mgmt]").forEach(function (x) { x.onchange = function () { toggle(state.mgmt, x.dataset.mgmt); render(); }; });
    document.querySelectorAll("[data-say]").forEach(function (x) { x.onclick = function () { state.scene[x.dataset.say].push(parseInt(x.dataset.opt, 10)); render(); }; });
    document.querySelectorAll("[data-chip]").forEach(function (x) { x.onclick = function () { askQuestion(x.textContent, x.dataset.chip); }; });
    var ack = $("#ack"); if (ack) ack.onchange = function () { state.ackCritical = ack.checked; };
    var form = $("#askform"); if (form) form.onsubmit = function (e) { e.preventDefault(); askQuestion($("#q").value); };
  }

  function bindChrome() {
    document.querySelectorAll(".tabs button").forEach(function (b) { b.onclick = function () { showView(b.dataset.view); }; });
    var v = $("#set-voice"); v.checked = settings.voice; v.onchange = function () { settings.voice = v.checked; storeSettings(); };
    var l = $("#set-llm"); l.checked = settings.useLLM; l.onchange = function () { settings.useLLM = l.checked; storeSettings(); };
    ["endpoint", "apiKey", "model"].forEach(function (k) { var i = $("#set-" + k); i.value = settings[k]; i.oninput = function () { settings[k] = i.value; storeSettings(); }; });
  }

  bindChrome();
  render();
  showView("case");
})();

/*
 * LabZero Mama case: "She was waiting since five"
 * Content licence: CC BY 4.0 (see CONTENT_LICENSE.md). Code licence: MIT.
 *
 * FICTIONAL TRAINING CASE. Not for clinical use.
 * Clinical, legal and governance content is pending review by an emergency
 * physician and a facility quality manager.
 */
window.MAMA_CASES = window.MAMA_CASES || [];
window.MAMA_CASES.push({
  id: "sudden-death-lobby",
  version: "0.1.0",
  status: "Draft: pending clinical validation",
  title: "She was waiting since five",
  family: "Emergency care: sudden cardiac death in the waiting room",
  why: "Long queues without triage at the door let time-critical illness wait. A death in the waiting room tests resuscitation, dignity, honest communication with a bereaved family, and whether the system learns.",
  setting: "Ikhwezi Community Health Centre waiting area",
  patient: { name: "Gogo Busisiwe Dlamini", age: 71, obstetric: "Retired domestic worker. High blood pressure and type 2 diabetes", arrival: "Ticket 033 · in the queue since 05:00" },
  opening: "Gogo Dlamini has collapsed on bench 3.",
  steps: ["collapse", "cpr", "triage", "aftermath", "notify", "manage"],
  stepLabels: { collapse: "Collapse", cpr: "Resuscitate", triage: "Stop or continue", aftermath: "The waiting room", notify: "Telling the family", manage: "After a death" },
  stepSettings: {
    collapse: "Ikhwezi CHC · waiting area, bench 3 · 10:52", cpr: "Ikhwezi CHC · waiting area floor",
    triage: "Ikhwezi CHC · waiting area · 11:20", aftermath: "Ikhwezi CHC · waiting area",
    notify: "Ikhwezi CHC · the quiet room · 12:35", manage: "Ikhwezi CHC · facility manager's office"
  },
  sceneDomains: { collapse: "recognition", aftermath: "dignity", notify: "communication" },
  domains: [
    { id: "experience", label: "Queue walk" }, { id: "recognition", label: "Recognising arrest" },
    { id: "resuscitation", label: "Resuscitation" }, { id: "prioritisation", label: "Decision to stop" },
    { id: "dignity", label: "Dignity and the waiting room" }, { id: "communication", label: "Telling the family" },
    { id: "management", label: "Duties after a death" }
  ],

  tuto: {
    collapse: "Check response and breathing in under ten seconds. Gasping is not breathing. Then call for help and start compressions.",
    cpr: "Push hard and fast, get the defibrillator on, shock VF, give adrenaline early in asystole, and keep every pause short.",
    triage: "Stopping is a team decision based on facts: how long, which rhythm, reversible causes found or not.",
    aftermath: "Dignity for the woman who died, care for the people who watched, safety for everyone still waiting.",
    notify: "Private room. Sit down. A warning shot, then the word ‘died’. Then be quiet and let them feel it.",
    manage: "Be honest, report it, learn from it. Never change the record after the event."
  },

  monitor: function (s) {
    var r = s.drills && s.drills.cpr;
    if (s.stepId === "collapse") return [
      { k: "Response", v: "None", u: "", alert: true }, { k: "Breathing", v: "Gasping", u: "", alert: true },
      { k: "Pulse", v: "?", u: "" }, { k: "Collapsed", v: "10:52", u: "" }];
    if (s.stepId === "cpr" && r) {
      var n = (r.done.analyse || []).length;
      return [
        { k: "Rhythm", v: !r.done.pads ? "?" : n === 0 ? "Not checked" : n <= 2 ? "VF" : "Asystole", u: "", alert: true },
        { k: "CPR", v: r.done.compress ? "On" : "Off", u: "", alert: !r.done.compress },
        { k: "Shocks", v: String((r.done.shock || []).length), u: "" },
        { k: "Adrenaline", v: String((r.done.adrenaline || []).length + (r.done.long ? 3 : 0)), u: "mg" }];
    }
    return [
      { k: "Rhythm", v: "Asystole", u: "", alert: true }, { k: "Died", v: "11:21", u: "" },
      { k: "Waited", v: "5 h 52", u: "min", alert: true }, { k: "Ticket", v: "033", u: "" }];
  },

  scenes: {
    collapse: {
      title: "She has collapsed",
      lead: "Gogo Dlamini is slumped across bench 3. Her eyes are open. People are backing away.",
      event: function (s, day) {
        var q = day && day.lobby["sudden-death-lobby"];
        if (q === 0) return "You had asked for her ECG. She collapsed in the corridor while the ECG machine was being found: it was in another room with a flat battery.";
        if (q === undefined) return "Nobody reached her on the queue walk. She has been sitting on the bench since 05:00.";
        return "She stayed on the bench after the queue walk. She has been here since 05:00.";
      },
      turns: [
        { speaker: "Bench 3", line: "Her head has dropped onto her chest. A woman next to her is shaking her shoulder: “Gogo! Gogo!”",
          options: [
            { text: "Tap her shoulders and shout “Gogo, can you hear me?” while you look at her chest for breathing, for no more than ten seconds.", score: 100, reply: "No response. Her chest does not move." },
            { text: "Give her sugar water; her sugar must be low.", score: 0, flag: "Tried sugar water on an unresponsive woman instead of checking for breathing.", reply: "The water runs out of the corner of her mouth." },
            { text: "Ask the people around her what happened first.", score: 30, reply: "Everyone talks at once. Thirty seconds pass." }
          ]},
        { speaker: "Bench 3", line: "She gives one slow, noisy gasp. Then nothing for several seconds. Then another gasp.",
          options: [
            { text: "That's agonal gasping, not breathing. Lie her flat on the floor, shout “Collapse in the waiting room! Crash trolley and AED!” and start compressions.", score: 100, reply: "You get her onto the floor. Sister Nkosi is already running." },
            { text: "She's breathing. Put her in the recovery position and watch her.", score: 0, flag: "Mistook agonal gasping for normal breathing.", reply: "She lies on her side. The gasps stop." },
            { text: "Run to fetch the doctor yourself.", score: 20, flag: "Left an unresponsive patient alone to fetch help.", reply: "When you come back, nobody has touched her." }
          ]}
      ],
      teach: "Cardiac arrest = unresponsive and not breathing normally. Slow, noisy gasps (agonal breathing) are a sign of arrest, not of breathing.",
      next: "Start resuscitation"
    },

    aftermath: {
      title: "The waiting room afterwards",
      lead: "Gogo Dlamini has died on the floor of the waiting area. Forty people watched.",
      turns: [
        { speaker: "The waiting room", line: "Two young men are filming on their phones. The woman who sat next to her is sobbing: “She was next to me since five o'clock.”",
          options: [
            { text: "Put up the screens. Calmly: “Please stop filming and delete that. She is somebody's mother.” Ask a colleague to sit with the woman who is crying.", score: 100, reply: "The phones go down. Someone fetches the woman a cup of tea." },
            { text: "Ignore the phones. There's no time.", score: 20, reply: "A video of her body is on social media within the hour." },
            { text: "Shout at them and grab their phones.", score: 30, reply: "A scuffle starts. Security has to step in." }
          ]},
        { speaker: "Sister Nkosi", line: "Doctor, what do we do with her? The mortuary van will take hours.",
          options: [
            { text: "Move her with dignity to a private room: close her eyes, straighten her body, cover her, and keep her belongings together and labelled. Leave the drip and airway in place until the doctor decides whether the death must be reported.", score: 100, reply: "Sister Nkosi folds Gogo's hands and puts her church hat beside her." },
            { text: "Leave her on the floor under a sheet until the van comes.", score: 0, flag: "Left a deceased patient on display in the waiting room.", reply: "Children in the queue stare at the sheet." },
            { text: "Take out the drip and tubes and wash her now, so she's ready for the family.", score: 40, reply: "If the death has to be reported for a forensic post-mortem, the devices should stay in place." }
          ]},
        { speaker: "A man in the queue", line: "Is this place safe? Who is next? My mother is also sick!",
          options: [
            { text: "Speak to the whole room: “A patient became very ill and has died. We are very sorry. The clinic is open. If you have chest pain, difficulty breathing, bleeding or feel very weak, tell a nurse now.” Then triage the whole queue.", score: 100, reply: "Three people put up their hands. One of them has chest pain." },
            { text: "Say nothing and call the next ticket.", score: 10, flag: "Did not triage the queue again after a patient died in it.", reply: "The man sits down, still angry." },
            { text: "Tell everyone to go home and come back tomorrow.", score: 0, flag: "Sent a waiting room home without triage.", reply: "People leave. Nobody knows who among them was sick." }
          ]}
      ],
      teach: "A death in the waiting room means triage at the door failed. Protect her dignity, care for the people who watched, and triage everyone still waiting.",
      next: "Her family has arrived"
    },

    notify: {
      title: "Telling her family",
      lead: "Her daughter Zodwa has arrived with her husband Sipho. They were told on the phone only that ‘your mother is sick’.",
      turns: [
        { speaker: "Zodwa, at reception", line: "Where's my mother? They phoned me. They said she's sick!",
          options: [
            { text: "“I'm Dr Mthembu. Please come with me to a quiet room where we can sit down.” Ask if anyone else is with her.", score: 100, reply: "She grips Sipho's arm and follows you." },
            { text: "At the desk: “I'm sorry, your mother passed away.”", score: 0, flag: "Broke news of a death at the reception desk.", reply: "She collapses to the floor in front of the queue." },
            { text: "“Please wait here while I find the doctor.” Say nothing else.", score: 40, reply: "She waits twenty minutes, imagining the worst." }
          ]},
        { speaker: "Zodwa", line: "What happened? Is she okay? Can I see her?",
          options: [
            { text: "“Zodwa, I'm afraid I have very sad news. Your mother collapsed in the waiting room this morning. Her heart stopped. We tried to restart it for almost half an hour, but we couldn't. I'm so sorry. She has died.” Then stay quiet.", score: 100, reply: "There is a long silence. Then Zodwa starts to wail. Sipho holds her." },
            { text: "“We lost her. She's gone to a better place.”", score: 30, reply: "“Lost her? Where is she?” Zodwa doesn't understand." },
            { text: "“She had a cardiac arrest with asystole that didn't respond to advanced life support.”", score: 10, reply: "Zodwa stares at you. “Is she alive or not?”" }
          ]},
        { speaker: "Zodwa", line: "She was sitting here since five o'clock! Why did nobody help her?",
          options: [
            { text: "“You have every right to ask that. She told us her chest was sore, and that will be investigated properly. The facility manager will meet you and you will get answers. I'm sorry this happened here.”", score: 100, reply: "Zodwa cries, but she nods. “I want to know the truth.”" },
            { text: "“We have hundreds of patients. We can't see everyone at once.”", score: 0, flag: "Responded defensively to a grieving family.", reply: "Sipho stands up, shouting. Security comes to the door." },
            { text: "“It was her time. It was God's will.”", score: 20, reply: "“Don't tell me about God,” Zodwa says. “Tell me what happened.”" }
          ]},
        { speaker: "Sipho, her son-in-law", line: "Can we see her? Our elders will want to know… we must take her home properly.",
          options: [
            { text: "“Yes, you can see her now. Take as long as you need. Afterwards I'll explain what happens next: the death notification, whether a post-mortem is needed, and the undertaker you choose. Would you like us to call your minister or anyone else?”", score: 100, reply: "Zodwa asks for her pastor. She holds her mother's hand for a long time." },
            { text: "“The body is going to the mortuary. You can see her there.”", score: 20, reply: "Sipho shakes his head. “You won't even let us see her?”" },
            { text: "“No viewing until the paperwork is finished.”", score: 10, reply: "They wait two hours in the corridor." }
          ]}
      ],
      teach: "Tell families in person, in private, sitting down. A warning shot, then the plain word ‘died’. Allow silence. Answer hard questions honestly, without defending the system, and explain what happens next."
    }
  },

  drills: {
    cpr: {
      domain: "resuscitation",
      title: "Resuscitate",
      intro: "Adult basic and advanced life support on the waiting-room floor. Every action costs time. The clock started when she collapsed.",
      opening: "Unresponsive, not breathing normally.",
      clockStart: 20,
      meter: { label: "Time without compressions", unit: "s", start: 20, rate: 1 },
      alarm: function (r) { return !r.done.compress; },
      status: function (r, did) {
        if (!did(r, "compress")) return "No compressions: no blood is reaching her brain";
        if (r.shockPending) return "VF: shock advised";
        var n = (r.done.analyse || []).length;
        return n >= 3 ? "Asystole · CPR in progress" : "CPR in progress";
      },
      hint1: "Nothing matters more than starting compressions within the first minute. Then the defibrillator.",
      actions: [
        { id: "help", group: "First minute", label: "Send someone running for the crash trolley and AED", cost: 2, text: "Sister Nkosi runs for the trolley. A cleaner clears the benches." },
        { id: "compress", group: "First minute", label: "Start chest compressions: centre of the chest, 5–6 cm deep, 100–120 a minute", cost: 5, rate: 0, text: "You kneel and start. Someone counts out loud with you." },
        { id: "scribe", group: "First minute", label: "Ask a colleague to write down the times and drugs", cost: 0, text: "The cleaner, Mr Zungu, takes a pen: “I'm writing.”" },
        { id: "ems", group: "First minute", label: "Phone EMS (10177): priority 1, cardiac arrest", cost: 20, text: "Ambulance dispatched. Estimated arrival: 40 minutes." },
        { id: "cycle", group: "Keep going", label: "Two minutes of CPR (30 compressions to 2 breaths), then swap compressors", cost: 120, repeat: true,
          can: function (r, did) { return did(r, "compress") ? null : "Start compressions first."; },
          text: "Two minutes of good-quality CPR. Compressors swap without a pause." },
        { id: "airway", group: "Keep going", label: "Open the airway; bag-valve mask with oxygen, 2 breaths after every 30 compressions", cost: 15,
          can: function (r, did) { return !did(r, "help") ? "There is no bag-valve mask in the waiting room. Send for the crash trolley." : r.t < r.done.help[0] + 60 ? "The trolley is still on its way. Keep compressing." : null; },
          text: "Airway open, oxygen connected. The chest rises with each breath." },
        { id: "pads", group: "Defibrillator", label: "Attach the AED pads while compressions continue", cost: 15,
          can: function (r, did) { return !did(r, "help") ? "Nobody has fetched the AED." : r.t < r.done.help[0] + 60 ? "The AED is still on its way. Keep compressing." : null; },
          text: "Pads on: one below the right collarbone, one on the left side of the chest." },
        { id: "analyse", group: "Defibrillator", label: "Hands off: let the AED analyse the rhythm", cost: 10, repeat: true,
          can: function (r, did) { return did(r, "pads") ? null : "Attach the pads first."; },
          text: function (r) {
            var n = r.done.analyse.length;
            if (n <= 2) { r.shockPending = true; return "“Shock advised.” Ventricular fibrillation."; }
            r.shockPending = false; return "“No shock advised.” A flat line: asystole. Restart compressions straight away.";
          } },
        { id: "shock", group: "Defibrillator", label: "“Everybody clear!” Deliver the shock, then restart compressions at once", cost: 5, repeat: true,
          can: function (r) { return r.shockPending ? null : "No shock is advised. Never shock without an analysis that advises it."; },
          text: function (r) { r.shockPending = false; return "Shock delivered. Compressions restarted immediately."; } },
        { id: "iv", group: "Drugs", label: "IV access", cost: 40,
          can: function (r, did) { return did(r, "help") && r.t >= r.done.help[0] + 60 ? null : "The trolley with the IV kit hasn't arrived."; },
          text: "18 G cannula in the right forearm. Saline running." },
        { id: "adrenaline", group: "Drugs", label: "Adrenaline 1 mg IV, then a flush", cost: 10, repeat: true,
          can: function (r, did) { return did(r, "iv") ? null : "No IV access yet."; },
          text: "Adrenaline 1 mg given. The next dose is due in 3–5 minutes." },
        { id: "causes", group: "Drugs", label: "Check glucose and look for reversible causes (4 Hs and 4 Ts)", cost: 30,
          can: function (r, did) { return did(r, "help") ? null : "Get the trolley and the team first."; },
          text: "Glucose 7.2 mmol/L. No bleeding, no trauma, no signs of a clot in the lungs. Chest heaviness since this morning, high blood pressure and diabetes: most likely a heart attack." },
        { id: "long", group: "Keep going", label: "Continue advanced life support for 15 minutes: 2-minute cycles, adrenaline every 3–5 minutes, rhythm checks", cost: 900,
          can: function (r, did) { return (r.done.analyse || []).length >= 3 && did(r, "adrenaline") ? null : "Not yet: get the defibrillator working and treat the rhythm you find first."; },
          text: "Fifteen more minutes. Asystole at every rhythm check. Three more doses of adrenaline. No signs of life." },
        { id: "water", group: "Do not", label: "Splash water on her face and sit her up", cost: 10, harmful: "Tried to revive a woman in cardiac arrest with water instead of CPR.", text: "Nothing happens. Precious seconds pass." },
        { id: "carry", group: "Do not", label: "Carry her to the treatment room before starting CPR", cost: 90, harmful: "Delayed CPR to move the patient.", text: "It takes four people a minute and a half to carry her down the corridor." },
        { id: "pulse", group: "Do not", label: "Stop compressions every 30 seconds to feel for a pulse", cost: 30, harmful: "Interrupted compressions repeatedly to feel for a pulse.", text: "Every pause lets her blood pressure fall back to zero." },
        { id: "review", group: "Decision", label: "Pause at about 25 minutes for a team review", cost: 0, end: true,
          can: function (r, did) { return did(r, "long") ? null : "Keep going. Advanced life support is not finished."; },
          text: "You ask everyone to stop for a moment." }
      ],
      events: [
        { t: 240, when: function (r) { return !r.done.pads; }, text: "Four minutes and the defibrillator is still not on her chest." }
      ],
      rules: {
        essential: [
          { id: "help", by: 30, critical: "Did not call for the crash trolley and defibrillator." },
          { id: "compress", by: 60, critical: "Never started chest compressions.", late: "Chest compressions started late" },
          { id: "pads", by: 240, critical: "Never attached the defibrillator." },
          { id: "analyse" },
          { id: "shock", critical: "Did not shock a shockable rhythm (VF)." },
          { id: "airway" }, { id: "iv" },
          { id: "adrenaline", critical: "Gave no adrenaline in asystole." },
          { id: "ems" }, { id: "causes" }, { id: "scribe" }
        ],
        before: [
          { a: "shock", b: "adrenaline", note: "In VF, shock first; adrenaline comes after the third shock. In asystole, give adrenaline as soon as you can." }
        ]
      },
      meterNote: function (r) { return r.meter > 60 ? "She went " + Math.round(r.meter) + " seconds without compressions after collapsing. Aim for under 60." : ""; },
      outcome: function (r) { return "The team pauses at " + window.MamaDrill.clock(r.t) + " after the collapse. No pulse, no breathing, asystole on the monitor."; },
      demo: ["help", "compress", "scribe", "ems", "cycle", "pads", "analyse", "shock", "airway", "iv", "cycle", "analyse", "shock", "cycle", "analyse", "adrenaline", "causes", "long", "review"],
      teach: "Adult cardiac arrest: compressions within a minute, the defibrillator on as soon as it arrives, shock VF without delay, adrenaline as soon as possible in asystole and then every 3–5 minutes, and keep pauses short. Even excellent resuscitation often fails once the heart has stopped. That is why the warning signs earlier in the day matter so much.",
      next: "Team review"
    }
  },

  triage: {
    title: "The team looks at you",
    question: "You are leading. Decide",
    vitals: [
      { label: "Rhythm", value: "Asystole", unit: "", flag: "high" },
      { label: "Since collapse", value: "~28", unit: "min", flag: "high" },
      { label: "Adrenaline", value: "4", unit: "mg" },
      { label: "Reversible cause", value: "None found", unit: "" }
    ],
    look: "EMS is still 25 minutes away. Her daughter has been phoned and is on her way. Sister Nkosi is soaked in sweat from compressions.",
    options: [
      { id: "stop", label: "Stop", detail: "Agree as a team to stop. The doctor confirms death and records the time: 11:21", score: 100 },
      { id: "family", label: "Wait for the family", detail: "Keep doing CPR until her daughter arrives, so she can see that we tried", score: 30 },
      { id: "ems", label: "Wait for EMS", detail: "Another 25 minutes of CPR, then hand over to the paramedics", score: 30 },
      { id: "alone", label: "Stop quietly", detail: "Stop compressions yourself without saying anything to the team", score: 50 }
    ],
    feedback: "After prolonged advanced life support with persistent asystole, no reversible cause and no signs of life, further resuscitation will not help her. Stopping is a team decision led by the doctor, who confirms death and records the time. Continuing only until the family or EMS arrives does not help her; the family should instead be told honestly that everything was tried."
  },

  management: {
    options: [
      { id: "notes", label: "Record the full resuscitation timeline, the drugs given and the time of death in her notes", kind: "critical" },
      { id: "sae", label: "Report a serious adverse event (patient safety incident) to the facility manager within 24 hours, including that she reported chest pain while in the queue", kind: "critical" },
      { id: "dha", label: "The doctor completes the death notification (DHA-1663) only if satisfied the death was natural; if not, it is reported to SAPS for a forensic post-mortem", kind: "critical" },
      { id: "debrief", label: "Hold a hot debrief with the resuscitation team today", kind: "essential" },
      { id: "support", label: "Offer staff and the witnesses in the waiting room support (employee wellness programme, counselling)", kind: "essential" },
      { id: "manager", label: "Arrange for the facility manager to meet the family and explain how to lay a complaint", kind: "essential" },
      { id: "sats", label: "Start triage at the door (South African Triage Scale) every morning, beginning tomorrow", kind: "essential" },
      { id: "falsify", label: "Add a note to her file that she was triaged when she arrived", kind: "harmful", critical: "Altered the clinical record after the event." },
      { id: "silence", label: "Tell staff not to discuss what happened with the family", kind: "harmful", critical: "Told staff to withhold information from a bereaved family." },
      { id: "blame", label: "Write in the report that she should have told staff she was unwell", kind: "harmful", critical: "Blamed the patient for a system failure." }
    ]
  },

  debriefNote: {
    title: "Could she have been saved?",
    paras: [
      "Gogo Dlamini had a heavy chest and a sore left arm from the moment she woke up. She waited almost six hours. An ECG on arrival may well have shown a heart attack, and aspirin and urgent transfer would have given her a real chance.",
      "This is why triage at the door matters. Under the South African Triage Scale, chest pain that may be cardiac is very urgent; it does not wait in a queue. Her death is a system failure first and an individual one second.",
      "In this scenario she dies whatever you do during the resuscitation. That is realistic: even excellent CPR often fails once the heart has stopped. The lesson is earlier in the day."
    ]
  },

  extraFeedback: function () { return []; },
  exampleErrors: ["Left an elderly woman with chest heaviness and arm pain in the queue.", "Mistook agonal gasping for normal breathing.", "Broke news of a death at the reception desk.", "Responded defensively to a grieving family."],

  learningPoints: [
    "Chest heaviness with arm pain in an older person with high blood pressure and diabetes is a heart attack until proven otherwise. Triage it at the door.",
    "Unresponsive and not breathing normally means cardiac arrest. Gasping is not breathing.",
    "Compressions within a minute, the defibrillator as soon as it arrives, minimal pauses.",
    "Stopping resuscitation is a team decision based on facts, led by the doctor.",
    "Tell the family in private, sitting down, using the word ‘died’. Answer hard questions honestly.",
    "After a death: protect the dead person's dignity, triage the waiting room again, report the incident, and never change the record."
  ],

  support: "Bereavement and trauma support: SADAG 0800 567 567 (check numbers before use)."
});

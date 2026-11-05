/*
 * LabZero Mama case: "He stabbed her"
 * Content licence: CC BY 4.0 (see CONTENT_LICENSE.md). Code licence: MIT.
 *
 * FICTIONAL TRAINING CASE. Not for clinical use.
 * Clinical content is pending review by an emergency physician or trauma surgeon.
 */
window.MAMA_CASES = window.MAMA_CASES || [];
window.MAMA_CASES.push({
  id: "stab-wound-thigh",
  version: "0.1.0",
  status: "Draft: pending clinical validation",
  title: "He stabbed her",
  family: "Trauma: stab wound with life-threatening bleeding",
  inSurge: true,
  why: "Interpersonal violence is a leading cause of injury in South Africa, and much of it is gender-based. Bleeding kills within minutes; clinic staff who stop it buy the time a surgeon needs.",
  setting: "Ikhwezi Community Health Centre emergency room, then EMS transfer to the regional trauma unit",
  patient: { name: "Lerato Mokoena", age: 24, obstetric: "Hairdresser. Stabbed in the upper left thigh outside a tavern", arrival: "Arrived by taxi at 11:40" },
  opening: "Bright red blood is pulsing from her thigh.",
  steps: ["primary", "triage", "tests", "results", "diagnosis", "meds", "manage", "followup"],
  stepLabels: { primary: "Stop the bleeding", triage: "Priority", diagnosis: "Shock", manage: "Handover" },
  stepSettings: {
    primary: "Ikhwezi CHC · emergency room floor · 11:41", triage: "Ikhwezi CHC · emergency room",
    tests: "Ikhwezi CHC · emergency room, waiting for EMS", results: "Ikhwezi CHC · emergency room",
    diagnosis: "Ikhwezi CHC · emergency room", meds: "Ikhwezi CHC · emergency room",
    manage: "Ikhwezi CHC · emergency room", followup: "Ikhwezi CHC · ambulance bay"
  },
  domains: [
    { id: "experience", label: "Decision at the gate" }, { id: "bleeding", label: "Haemorrhage control" },
    { id: "prioritisation", label: "Transfer priority" }, { id: "investigations", label: "Test selection" },
    { id: "interpretation", label: "Result interpretation" }, { id: "diagnosis", label: "Recognising shock" },
    { id: "medication", label: "Medication safety" }, { id: "management", label: "Handover and protection" },
    { id: "monitoring", label: "Monitoring and response" }
  ],

  tuto: {
    primary: "Catastrophic bleeding comes before airway and breathing. Hands on the wound, then a tourniquet if pressure isn't enough.",
    triage: "Look at her pulse, blood pressure and alertness, not at how calm the room has become.",
    tests: "At a clinic, only order what travels with her or changes the next hour. She needs a surgeon, not a scan here.",
    diagnosis: "Put the numbers together: pulse, blood pressure, breathing, skin and mind tell you how much blood she has lost.",
    manage: "Protect the tourniquet, protect her privacy, protect the evidence, and get her moving."
  },

  monitor: function (s) {
    var r = s.drills && s.drills.primary;
    var loss = r ? Math.round(r.meter / 50) * 50 : 1200;
    var tq = r && r.done.tourniquet;
    return [
      { k: "HR", v: s.stepId === "followup" ? "136" : "128", u: "/min", alert: true },
      { k: "BP", v: "86/54", u: "mmHg", alert: true },
      { k: "Blood loss", v: "~" + loss, u: "mL est.", alert: loss > 1000 },
      { k: "Tourniquet", v: tq ? "On" : "None", u: tq ? "at " + window.MamaDrill.clock(tq[0]) : "", alert: !tq }
    ];
  },

  scenes: {},

  drills: {
    primary: {
      domain: "bleeding",
      title: "Stop the bleeding",
      intro: "Lerato is on the emergency room floor. A 4 cm wound in her upper inner left thigh is pumping bright red blood with every heartbeat. She is pale, sweaty and asking for water.",
      opening: "Bright red blood is pulsing from her thigh.",
      clockStart: 0,
      meter: { label: "Estimated blood loss", unit: "mL", start: 1200, rate: 10, fmt: function (v) { return "~" + Math.round(v / 50) * 50; } },
      alarm: function (r) { return !r.done.pressure; },
      status: function (r, did) { return did(r, "tourniquet") ? "Bleeding controlled" : did(r, "pressure") ? "Slowing under pressure, still seeping" : "Pumping"; },
      hint1: "Catastrophic bleeding comes first, even before the airway: hands on the wound.",
      actions: [
        { id: "pressure", group: "First seconds", label: "Kneel and press hard on the wound with gauze, using your body weight", cost: 5, rate: 3, text: "The bleeding slows, but blood still seeps through the gauze." },
        { id: "help", group: "First seconds", label: "Shout for help and the emergency trolley", cost: 0, text: "Sister Mahlangu comes running with the trolley and takes over the pressure." },
        { id: "gloves", group: "First seconds", label: "Put on gloves", cost: 3, text: "Gloves on." },
        { id: "tourniquet", group: "Control", label: "Tourniquet high and tight on the thigh; tighten until the bleeding stops; write the time on it", cost: 25, rate: 0,
          text: "The bleeding stops. The time is written on the tourniquet. She screams; it hurts a lot, and that is expected." },
        { id: "pack", group: "Control", label: "Pack the wound tightly with gauze and keep pressing", cost: 40, rate: 1, text: "Packed. A slow ooze continues." },
        { id: "elevate", group: "Control", label: "Lift the leg and wait to see if it stops", cost: 60, harmful: "Relied on lifting the leg instead of pressure for arterial bleeding.", text: "Blood keeps pumping down her leg." },
        { id: "abcde", group: "Circulation", label: "Quick ABCDE: airway, breathing, circulation, disability, expose (front and back)", cost: 30,
          text: "Airway clear; she is talking. Breathing 28 a minute. Weak radial pulse 128. BP 86/54. Capillary refill 4 s. GCS 14, confused. One wound only, front and back checked." },
        { id: "o2", group: "Circulation", label: "Oxygen by face mask", cost: 10, text: "Oxygen on. SpO₂ 96%." },
        { id: "iv", group: "Circulation", label: "Two large-bore IV lines (16 G); draw blood for haemoglobin and crossmatch", cost: 60,
          can: function (r, did) { return did(r, "help") ? null : "You are alone and holding the wound. Call for help first."; },
          text: "Two 16 G lines in. Blood drawn." },
        { id: "txa", group: "Circulation", label: "Tranexamic acid 1 g IV over 10 minutes", cost: 15,
          can: function (r, did) { return did(r, "iv") ? null : "No IV access yet."; }, text: "Tranexamic acid running. Time noted: within an hour of injury." },
        { id: "fluid", group: "Circulation", label: "Ringer's lactate 250 mL bolus, then reassess (aim: a radial pulse and an alert patient)", cost: 30,
          can: function (r, did) { return did(r, "iv") ? null : "No IV access yet."; }, text: "Bolus in. Her radial pulse is a little stronger and she answers more clearly." },
        { id: "flood", group: "Circulation", label: "Run 3 litres of saline in as fast as possible", cost: 30, harmful: "Gave large volumes of crystalloid to a bleeding patient, diluting her clotting factors.",
          can: function (r, did) { return did(r, "iv") ? null : "No IV access yet."; }, text: "The bags run in. Her blood is getting thinner." },
        { id: "warm", group: "Circulation", label: "Remove wet clothes; cover her with warm blankets", cost: 20, text: "Wet jeans cut off and bagged. Warm blankets on. She stops shivering." },
        { id: "ems", group: "Get her out", label: "Call EMS: priority 1 transfer to the regional trauma unit", cost: 30, text: "Priority 1 ambulance dispatched. Twenty minutes away." },
        { id: "loosen", group: "Get her out", label: "Loosen the tourniquet every 10 minutes to let blood reach the leg", cost: 10, harmful: "Loosened a tourniquet on a bleeding patient.",
          can: function (r, did) { return did(r, "tourniquet") ? null : "There is no tourniquet on."; }, text: "Blood pumps out again. You re-tighten it, but she has lost more." },
        { id: "handover", group: "Get her out", label: "The ambulance is here: hand over to the crew (SBAR)", cost: 60, end: true,
          can: function (r, did) { return did(r, "ems") ? null : "No ambulance has been called yet."; }, text: "You give a clear handover." }
      ],
      events: [
        { t: 60, when: function (r) { return !r.done.pressure; }, text: "She is going grey. Her eyes roll back. The blood is still pumping." },
        { t: 240, when: function (r) { return r.done.pressure && !r.done.tourniquet; }, text: "Blood is still soaking through the gauze. Pressure alone is not controlling this wound." }
      ],
      rules: {
        essential: [
          { id: "pressure", by: 20, critical: "Never applied direct pressure to a pumping wound.", late: "Bleeding was not pressed on quickly" },
          { id: "help", by: 30 },
          { id: "tourniquet", by: 180, critical: "Did not use a tourniquet for life-threatening limb bleeding.", late: "Tourniquet applied late" },
          { id: "abcde" }, { id: "o2" }, { id: "iv" },
          { id: "txa", critical: "Did not give tranexamic acid to a bleeding trauma patient." },
          { id: "fluid" }, { id: "warm" },
          { id: "ems", by: 600, critical: "Did not arrange urgent transfer." }
        ],
        before: [
          { a: "pressure", b: "abcde", note: "Catastrophic bleeding comes before ABC: press first, then assess." }
        ]
      },
      meterNote: function (r) { return "Estimated blood loss at handover: about " + Math.round(r.meter / 50) * 50 + " mL."; },
      outcome: function () { return "The crew take over. Lerato is alert, the bleeding is controlled and the drip is running."; },
      demo: ["pressure", "help", "tourniquet", "abcde", "o2", "iv", "txa", "fluid", "warm", "ems", "handover"],
      teach: "Life-threatening limb bleeding: direct pressure at once, then a tourniquet high and tight if pressure fails, with the time written on it. Tranexamic acid within 3 hours of injury, small fluid boluses only, keep her warm, and transfer fast. She needs blood and a surgeon.",
      next: "Decide her priority"
    }
  },

  triage: {
    title: "How urgent is the transfer?",
    question: "Choose her triage priority",
    vitals: [
      { label: "Heart rate", value: "128", unit: "/min", flag: "high" },
      { label: "BP", value: "86/54", unit: "mmHg", flag: "high" },
      { label: "Breathing", value: "28", unit: "/min", flag: "high" },
      { label: "Alertness", value: "Confused (GCS 14)", unit: "", flag: "high" }
    ],
    look: "The bleeding is controlled. Lerato is quieter now, which the people in the room take as a good sign.",
    options: [
      { id: "red", label: "Red: emergency", detail: "Immediate. Priority 1 ambulance to a hospital that can transfuse and operate", score: 100 },
      { id: "orange", label: "Orange: very urgent", detail: "Transfer within the hour when an ambulance is free", score: 40, critical: "Under-triaged a patient in haemorrhagic shock." },
      { id: "yellow", label: "Yellow: urgent", detail: "Observe at the clinic and transfer later today", score: 0, critical: "Kept a patient in shock at the clinic." },
      { id: "green", label: "Green: routine", detail: "The bleeding has stopped; stitch the wound here", score: 0, critical: "Treated a stab wound with shock as a minor injury." }
    ],
    feedback: "Low blood pressure, a fast pulse, fast breathing and confusion mean she is in shock. A quieter patient is not a better patient. She is red (emergency): she needs blood and surgery now."
  },

  tests: [
    { id: "hb", label: "Point-of-care haemoglobin", group: "Bedside", essential: true },
    { id: "xm", label: "Blood sample for group and crossmatch, sent with her", group: "Bedside", essential: true },
    { id: "preg", label: "Urine pregnancy test", group: "Bedside", essential: true },
    { id: "glucose", label: "Finger-prick glucose", group: "Bedside", essential: false, appropriate: true },
    { id: "xray", label: "X-ray of the thigh before she leaves", group: "Imaging", essential: false, appropriate: false, why: "It delays a patient in shock and won't change what the trauma unit does. They will image her if needed." },
    { id: "ecg", label: "12-lead ECG", group: "Bedside", essential: false, appropriate: false, why: "A fast pulse here is from blood loss. An ECG does not change the plan." }
  ],

  results: {
    turnaround: "Bedside results in minutes.",
    reports: {
      hb: { title: "Point-of-care haemoglobin", rows: [
        { analyte: "Haemoglobin", value: "7.4", unit: "g/dL", range: "12.0–15.0", flag: "L", critical: true, key: "hb" } ]},
      preg: { title: "Urine pregnancy test", rows: [
        { analyte: "Beta-hCG (urine)", value: "Negative", unit: "", range: "Negative", flag: "", key: "pregneg" } ]},
      glucose: { title: "Glucose", rows: [ { analyte: "Glucose", value: "6.2", unit: "mmol/L", range: "4.0–7.8", flag: "" } ]},
      xm: { title: "Crossmatch sample", text: "Two tubes labelled at the bedside and packed in the transfer bag with the request form." },
      xray: { title: "X-ray left femur", text: "No fracture. (It took 35 minutes; the ambulance waited.)" },
      ecg: { title: "ECG", text: "Sinus tachycardia, 128 per minute." }
    },
    significant: ["hb", "pregneg"],
    criticalNote: "Hb 7.4 g/dL after acute bleeding. She needs blood urgently, and the true loss is bigger than this number shows: Hb falls further as fluid moves in."
  },

  diagnosis: {
    options: [
      { id: "c3", label: "Haemorrhagic shock, class III (about 30–40% of blood volume lost) from an arterial injury in the thigh", score: 100 },
      { id: "c2", label: "Class II haemorrhage (15–30%): compensated, no shock", score: 40 },
      { id: "c4", label: "Class IV haemorrhage (over 40%): about to arrest", score: 40 },
      { id: "c1", label: "Class I haemorrhage (under 15%): minor blood loss", score: 10 },
      { id: "faint", label: "A faint from fright (vasovagal)", score: 0 }
    ],
    explain: "A pulse of 128, low systolic blood pressure, breathing at 28, slow capillary refill and confusion fit class III haemorrhagic shock: roughly 30–40% of her blood volume, about 1.5–2 litres in an adult. A pulsing bleed from the upper inner thigh suggests injury to a branch of the femoral artery."
  },

  medicationChart: {
    intro: "The emergency room chart, written in a hurry. Check every line.",
    lines: [
      { id: "txa", drug: "Tranexamic acid", order: "1 g IV over 10 minutes, then 1 g IV over 8 hours", error: false },
      { id: "morph", drug: "Morphine", order: "10 mg IM stat for pain", error: true,
        why: "In shock, IM absorption is unreliable and a large dose can drop her blood pressure and breathing. Give small IV doses, titrated to effect." },
      { id: "diclo", drug: "Diclofenac", order: "75 mg IM stat", error: true,
        why: "NSAIDs impair platelet function and can harm the kidneys in shock. Avoid them during active bleeding." },
      { id: "td", drug: "Tetanus and diphtheria vaccine (Td)", order: "0.5 mL IM", error: false },
      { id: "rl", drug: "Ringer's lactate", order: "250 mL IV bolus; repeat only if the radial pulse is lost or she becomes less alert", error: false }
    ]
  },

  management: {
    options: [
      { id: "sbar", label: "Phone the trauma unit with an SBAR handover, including the tourniquet time and the tranexamic acid time", kind: "critical" },
      { id: "tqtime", label: "Make sure the tourniquet time is written on the tourniquet and on the transfer note", kind: "critical" },
      { id: "evidence", label: "Put her clothes in a paper bag for SAPS and document the wound accurately", kind: "essential" },
      { id: "safety", label: "Ask her privately who stabbed her and whether she will be safe; give her the GBV Command Centre number", kind: "essential" },
      { id: "saps", label: "With her consent, help her open a case with SAPS", kind: "essential" },
      { id: "contact", label: "Ask her who she wants told where she is", kind: "essential" },
      { id: "police", label: "Delay the transfer until the police have taken her statement", kind: "harmful", critical: "Delayed a life-saving transfer for a police statement." },
      { id: "remove", label: "Take off the tourniquet before transfer to check whether the bleeding has stopped", kind: "harmful", critical: "Removed a tourniquet before surgical control." },
      { id: "boyfriend", label: "Tell the man who says he is her boyfriend which hospital she is going to", kind: "harmful", critical: "Disclosed an assault victim's location without her consent." }
    ]
  },

  followupPick: function () { return this.followup; },
  followup: {
    time: "In the ambulance bay, 25 minutes later",
    situation: "As she is lifted onto the stretcher, blood starts seeping from the wound again, below the tourniquet. Her pulse rises to 136.",
    options: [
      { id: "tighten", label: "Tighten the tourniquet further; if it still bleeds, put a second tourniquet just above the first, write the time, and tell the crew", correct: true },
      { id: "loosen", label: "Loosen the tourniquet so you can reposition it", correct: false },
      { id: "pack", label: "Lift the leg and add more gauze only", correct: false },
      { id: "ignore", label: "Leave it; the hospital will sort it out", correct: false }
    ],
    explain: "Bleeding past a tourniquet means it is not tight enough, or the leg has swollen or the tourniquet has slipped during the move. Tighten it; if that fails, add a second one above the first. Never loosen it to check."
  },

  extraFeedback: function (s, day) {
    var out = [];
    if (day && day.surge === 1) out.push("At the gate you went to the loudest patient first. Lerato lost more blood while she waited.");
    return out;
  },
  exampleErrors: ["Prioritised the loudest patient over life-threatening bleeding.", "Did not use a tourniquet for life-threatening limb bleeding.", "Under-triaged a patient in haemorrhagic shock."],

  learningPoints: [
    "The loudest patient is not always the sickest. Pumping blood comes first.",
    "Direct pressure at once; a tourniquet high and tight if pressure fails; write the time.",
    "A quiet, confused patient with a fast pulse and low blood pressure is in shock, not ‘settling’.",
    "Tranexamic acid within 3 hours of injury; small fluid boluses; keep her warm; transfer fast.",
    "Protect her privacy and safety. Many stabbings of women are by a partner or ex-partner."
  ],

  support: "Gender-based violence: GBV Command Centre 0800 428 428 (check numbers before use)."
});

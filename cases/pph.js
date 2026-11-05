/*
 * LabZero Mama case: "She's just tired"
 * Content licence: CC BY 4.0 (see CONTENT_LICENSE.md). Code licence: MIT.
 *
 * FICTIONAL TRAINING CASE. Not for clinical use.
 * Clinical content is pending review by an obstetrician or advanced midwife
 * (postpartum haemorrhage, first-response bundle, NASG).
 */
window.MAMA_CASES = window.MAMA_CASES || [];
window.MAMA_CASES.push({
  id: "pph-atony",
  version: "0.1.0",
  status: "Draft: pending clinical validation",
  title: "She's just tired",
  family: "Obstetrics: postpartum haemorrhage",
  why: "Obstetric haemorrhage is one of the leading direct causes of maternal death in South Africa and worldwide, and many of these deaths are judged avoidable. Measuring blood loss instead of guessing, and giving the whole first-response bundle at once, saves lives.",
  setting: "Ikhwezi CHC midwife obstetric unit (MOU), then the regional hospital",
  patient: { name: "Nokuthula Khumalo", age: 34, obstetric: "Para 5. Born 25 minutes ago after a 14-hour labour; baby 4.1 kg", arrival: "Gave birth in the MOU at 13:05" },
  opening: "I'm so tired, sisi. I just want to sleep.",
  steps: ["pph", "triage", "tests", "results", "diagnosis", "meds", "manage", "followup"],
  stepLabels: { pph: "Bleeding after birth", triage: "Transfer", diagnosis: "Cause" },
  stepSettings: {
    pph: "Ikhwezi CHC · MOU delivery room · 13:30", triage: "Ikhwezi CHC · MOU",
    tests: "Ikhwezi CHC · MOU", results: "Regional hospital · labour ward",
    diagnosis: "Regional hospital · labour ward", meds: "Regional hospital · labour ward",
    manage: "Regional hospital · labour ward", followup: "Regional hospital · high care, 3 hours later"
  },
  domains: [
    { id: "haemorrhage", label: "First response to PPH" }, { id: "prioritisation", label: "Transfer decision" },
    { id: "investigations", label: "Test selection" }, { id: "interpretation", label: "Result interpretation" },
    { id: "diagnosis", label: "Finding the cause" }, { id: "medication", label: "Medication safety" },
    { id: "management", label: "Management" }, { id: "monitoring", label: "Monitoring and response" }
  ],

  tuto: {
    pph: "Measure, don't guess. When the drape reaches 500 mL, or less if she looks unwell, give the whole bundle at once: rub the uterus, oxytocin, tranexamic acid, IV fluids, examine for the cause, and escalate.",
    triage: "Bleeding controlled at a clinic is not bleeding cured. Where can she get blood and theatre if it starts again?",
    diagnosis: "The four Ts: Tone, Trauma, Tissue, Thrombin. What did your hands find?"
  },

  monitor: function (s) {
    var r = s.drills && s.drills.pph;
    var loss = r ? Math.round(r.meter / 50) * 50 : 600;
    var bad = !r || !r.finished;
    return [
      { k: "Blood loss", v: String(loss), u: "mL (drape)", alert: loss >= 500 },
      { k: "HR", v: s.stepId === "followup" ? "128" : bad ? "118" : "104", u: "/min", alert: true },
      { k: "BP", v: s.stepId === "followup" ? "90/58" : bad ? "94/60" : "102/66", u: "mmHg", alert: true },
      { k: "Uterus", v: r && (r.done.bimanual || r.done.oxyiv) ? "Firm" : "Soft", u: "", alert: !(r && (r.done.bimanual || r.done.oxyiv)) }
    ];
  },

  scenes: {},

  drills: {
    pph: {
      domain: "haemorrhage",
      title: "Bleeding after birth",
      intro: "Nokuthula gave birth 25 minutes ago. The placenta came 10 minutes ago. The student midwife says, “She's just tired.” You lift the sheet: the calibrated drape under her already reads 600 mL, and blood is trickling steadily.",
      opening: "The drape reads 600 mL and rising.",
      clockStart: 0,
      meter: { label: "Measured blood loss (drape)", unit: "mL", start: 600, rate: 5, fmt: function (v) { return Math.round(v / 50) * 50; } },
      alarm: function (r) { return r.rate >= 3; },
      status: function (r) { return r.rate >= 3 ? "Bleeding steadily" : r.rate > 0.5 ? "Slowing" : "Bleeding controlled"; },
      hint1: "Call it out loud (“PPH!”), then hands on the uterus. Everything else follows in parallel.",
      actions: [
        { id: "help", group: "First minute", label: "Call it: “PPH!” Second midwife, doctor, and EMS on standby", cost: 5, text: "Sister Ndlovu runs in with the PPH box." },
        { id: "fundus", group: "First minute", label: "Feel the uterus", cost: 5, text: "Soft and boggy, above the umbilicus. A gush of clots comes out as you press." },
        { id: "massage", group: "First minute", label: "Rub up the uterus (fundal massage) and keep rubbing", cost: 15, rate: function (r) { return Math.min(r.rate, 3); }, text: "The uterus firms a little under your hand, then softens again when you stop." },
        { id: "iv", group: "Drugs and fluids", label: "Two large-bore IV lines; take blood for Hb and crossmatch, and a bedside clotting test", cost: 60,
          can: function (r, did) { return did(r, "help") ? null : "You're alone with your hands on her uterus. Call for help first."; }, text: "Two 16 G lines in. Bloods taken." },
        { id: "oxyiv", group: "Drugs and fluids", label: "Oxytocin 20 units in 1 L Ringer's lactate, run fast", cost: 20, rate: function (r, did) { return Math.min(r.rate, did(r, "massage") ? 1 : 2); },
          can: function (r, did) { return did(r, "iv") ? null : "No IV access yet."; }, text: "The infusion runs. The uterus is firmer." },
        { id: "txa", group: "Drugs and fluids", label: "Tranexamic acid 1 g IV over 10 minutes", cost: 15, rate: function (r) { return Math.min(r.rate, Math.max(0.3, r.rate - 0.5)); },
          can: function (r, did) { return did(r, "iv") ? null : "No IV access yet."; }, text: "Tranexamic acid running, 25 minutes after birth." },
        { id: "fluids", group: "Drugs and fluids", label: "Warmed Ringer's lactate, 1 L, then reassess", cost: 30,
          can: function (r, did) { return did(r, "iv") ? null : "No IV access yet."; }, text: "Fluids in. Pulse 108, BP 98/62." },
        { id: "miso", group: "Drugs and fluids", label: "Misoprostol 800 µg sublingually", cost: 10, rate: function (r) { return Math.min(r.rate, 1); }, text: "Misoprostol given under her tongue." },
        { id: "bolus", group: "Drugs and fluids", label: "Oxytocin 10 units as a rapid undiluted IV push", cost: 5, harmful: "Gave a rapid undiluted IV bolus of oxytocin, which can cause severe hypotension.", text: "Her blood pressure drops sharply. She goes grey." },
        { id: "bladder", group: "Examine", label: "Empty the bladder (catheter)", cost: 30, text: "A full bladder drained (450 mL of urine). The uterus contracts better." },
        { id: "placenta", group: "Examine", label: "Check the placenta and membranes are complete", cost: 30, text: "Placenta and membranes complete." },
        { id: "tears", group: "Examine", label: "Inspect the perineum, vagina and cervix for tears", cost: 60, text: "A small first-degree tear, barely bleeding. The blood is coming from inside the uterus." },
        { id: "bimanual", group: "Escalate", label: "Bimanual uterine compression", cost: 60, rate: function (r) { return Math.min(r.rate, 0.3); }, text: "Your fist in the anterior fornix, your other hand pressing down on the fundus. The bleeding almost stops." },
        { id: "nasg", group: "Escalate", label: "Apply the anti-shock garment (NASG)", cost: 60, text: "NASG applied from the ankles up. Her pulse slows a little." },
        { id: "ems", group: "Escalate", label: "Priority 1 transfer to hospital (theatre and blood available)", cost: 20, text: "Ambulance dispatched, 30 minutes away." },
        { id: "wait", group: "Do not", label: "Let her rest and see if it settles on its own", cost: 120, harmful: "Waited for a postpartum haemorrhage to settle.", text: "Two minutes later the drape has filled further. She is drowsy." },
        { id: "done", group: "Hand over", label: "Bleeding controlled: keep rubbing, monitor every 15 minutes, hand over to EMS", cost: 0, end: true,
          can: function (r, did) { return !did(r, "ems") ? "No ambulance has been called." : r.rate > 1 ? "She is still bleeding. Do more before you hand over." : null; }, text: "You hand over to the crew, still rubbing the uterus." }
      ],
      events: [
        { t: 90, when: function (r) { return !r.done.massage; }, text: "The drape fills faster. Nobody has a hand on her uterus yet." },
        { t: 240, when: function (r) { return r.meter >= 1000; }, text: "1 000 mL. She is pale and asks for water. Her pulse is 124." }
      ],
      rules: {
        essential: [
          { id: "help", by: 20, critical: "Did not call for help for a postpartum haemorrhage." },
          { id: "fundus" },
          { id: "massage", by: 60, critical: "Did not massage the uterus.", late: "Uterine massage started late" },
          { id: "iv" },
          { id: "oxyiv", by: 300, critical: "Did not give an oxytocin infusion.", late: "Oxytocin started late" },
          { id: "txa", critical: "Did not give tranexamic acid for postpartum haemorrhage." },
          { id: "fluids" }, { id: "bladder" }, { id: "placenta" }, { id: "tears" },
          { id: "ems", critical: "Did not arrange transfer to a facility with blood and theatre." }
        ],
        before: [
          { a: "massage", b: "tears", note: "Rub the uterus first; examine for tears once the bundle is running." }
        ]
      },
      meterNote: function (r) { return "Total measured blood loss at handover: " + Math.round(r.meter / 50) * 50 + " mL."; },
      outcome: function (r) { return "Bleeding controlled at " + Math.round(r.meter / 50) * 50 + " mL measured. She is pale but talking."; },
      demo: ["help", "fundus", "massage", "iv", "oxyiv", "txa", "fluids", "bladder", "placenta", "tears", "ems", "done"],
      teach: "PPH: measure blood loss with a calibrated drape. At 500 mL, or less with abnormal signs, give the whole first-response bundle together: uterine massage, an oxytocin infusion, tranexamic acid, IV fluids, examination for the cause (the four Ts) and escalation. If bleeding continues: bimanual compression, the anti-shock garment, and transfer.",
      next: "Decide on transfer"
    }
  },

  triage: {
    title: "Does she still need to go?",
    question: "The bleeding has slowed. Decide",
    vitals: [
      { label: "Measured loss", value: "~1 000", unit: "mL", flag: "high" },
      { label: "HR", value: "104", unit: "/min", flag: "high" },
      { label: "BP", value: "102/66", unit: "mmHg" },
      { label: "Uterus", value: "Firm with the infusion", unit: "" }
    ],
    look: "Her husband says, “She looks better now. Can she just stay here and rest?”",
    options: [
      { id: "transfer", label: "Transfer now", detail: "Priority 1 to the hospital with the infusion running, a midwife escort and the measured blood loss on the referral", score: 100 },
      { id: "stay", label: "Keep her here", detail: "Observe overnight in the MOU; transfer only if she bleeds again", score: 20, critical: "Kept a woman after a major PPH at a facility without blood or theatre." },
      { id: "morning", label: "Transfer tomorrow", detail: "Book a routine transfer for the morning", score: 10, critical: "Delayed transfer after a major PPH." },
      { id: "home", label: "Discharge home", detail: "She is talking and the bleeding has stopped", score: 0, critical: "Discharged a woman after a major postpartum haemorrhage." }
    ],
    feedback: "About a litre of measured loss with a fast pulse is a major haemorrhage. She may need blood, may bleed again, and may need theatre. That is only available at the hospital: transfer now, with the infusion running and an escort."
  },

  tests: [
    { id: "hb", label: "Haemoglobin", group: "Blood", essential: true },
    { id: "xm", label: "Group and crossmatch", group: "Blood", essential: true },
    { id: "clot", label: "Bedside clotting test", group: "Blood", essential: true },
    { id: "plt", label: "Platelets and fibrinogen", group: "Blood", essential: false, appropriate: true },
    { id: "us", label: "Pelvic ultrasound before transfer", group: "Imaging", essential: false, appropriate: false, why: "The placenta is complete and the uterus is the obvious source. A scan delays transfer." },
    { id: "ecg", label: "ECG", group: "Other", essential: false, appropriate: false, why: "Her fast pulse is from blood loss. An ECG won't change the plan." }
  ],

  results: {
    turnaround: "Bedside clotting test at the MOU; hospital results on arrival.",
    reports: {
      hb: { title: "Haemoglobin", rows: [ { analyte: "Haemoglobin", value: "6.9", unit: "g/dL", range: "12.0–15.0", flag: "L", critical: true, key: "hb" } ]},
      xm: { title: "Crossmatch", rows: [ { analyte: "Group", value: "B, RhD positive", unit: "", range: "", flag: "" }, { analyte: "Units ready", value: "2", unit: "", range: "", flag: "" } ]},
      clot: { title: "Bedside clotting test", rows: [ { analyte: "Clot formed", value: "Yes, at 7 minutes", unit: "", range: "Clot within 8 minutes", flag: "", key: "clotok" } ]},
      plt: { title: "Platelets and fibrinogen", rows: [
        { analyte: "Platelets", value: "164", unit: "×10⁹/L", range: "150–400", flag: "" },
        { analyte: "Fibrinogen", value: "2.4", unit: "g/L", range: "> 2.0 after birth", flag: "", key: "fibok" } ]},
      us: { title: "Ultrasound", text: "Empty uterus. (Transfer delayed 40 minutes.)" },
      ecg: { title: "ECG", text: "Sinus tachycardia." }
    },
    significant: ["hb", "clotok", "fibok"],
    criticalNote: "Hb 6.9 g/dL after a major haemorrhage, with a fast pulse: she needs a blood transfusion."
  },

  diagnosis: {
    options: [
      { id: "tone", label: "Primary postpartum haemorrhage from uterine atony (Tone)", score: 100 },
      { id: "trauma", label: "Postpartum haemorrhage from a genital tract tear (Trauma)", score: 20 },
      { id: "tissue", label: "Retained placenta or membranes (Tissue)", score: 20 },
      { id: "thrombin", label: "A clotting disorder (Thrombin)", score: 10 },
      { id: "normal", label: "Normal blood loss after a big baby", score: 0 }
    ],
    explain: "A soft, boggy uterus above the umbilicus that firms with massage and oxytocin, a complete placenta, only a minor tear, and a normal clotting test point to uterine atony. Her risk factors were five previous births, a 14-hour labour and a 4.1 kg baby."
  },

  medicationChart: {
    intro: "Hospital chart after transfer. Check every line.",
    lines: [
      { id: "oxy", drug: "Oxytocin", order: "20 units in 1 L Ringer's lactate over 4–8 hours (maintenance)", error: false },
      { id: "txa", drug: "Tranexamic acid", order: "A second 1 g IV dose if bleeding restarts within 24 hours", error: false },
      { id: "miso", drug: "Misoprostol", order: "800 µg sublingually every 2 hours until bleeding stops", error: true,
        why: "Misoprostol is given as a single dose for PPH. Repeated doses add fever and shivering, not benefit. Escalate to other treatments if bleeding continues." },
      { id: "iron", drug: "Ferrous sulphate", order: "200 mg daily; no transfusion needed, Hb 6.9", error: true,
        why: "Hb 6.9 g/dL after an acute haemorrhage, with a fast pulse, needs a blood transfusion now. Iron is for later." },
      { id: "blood", drug: "Packed red cells", order: "2 units, then recheck Hb and pulse", error: false }
    ]
  },

  management: {
    options: [
      { id: "transfuse", label: "Transfuse and recheck", kind: "critical" },
      { id: "obs", label: "Pulse, BP, uterus and bleeding every 15 minutes for the first 2 hours", kind: "critical" },
      { id: "record", label: "Record the measured blood loss and every drug time on the chart", kind: "critical" },
      { id: "skin", label: "Keep the baby skin-to-skin and breastfeeding when she is stable", kind: "essential" },
      { id: "explain", label: "Explain to her and her husband what happened", kind: "essential" },
      { id: "contra", label: "Discuss contraception before discharge (para 5, risk of PPH again)", kind: "essential" },
      { id: "review", label: "Report and review as a maternal near-miss", kind: "essential" },
      { id: "walk", label: "Let her walk to the toilet alone in the first hours", kind: "harmful", critical: "Let a woman after a major PPH walk unaccompanied." },
      { id: "remove", label: "Remove the anti-shock garment in the ambulance to make her comfortable", kind: "harmful", critical: "Removed the anti-shock garment before definitive care." },
      { id: "early", label: "Discharge her in 6 hours like a normal birth", kind: "harmful", critical: "Planned early discharge after a major PPH." }
    ]
  },

  followupPick: function () { return this.followup; },
  followup: {
    time: "Three hours later, in high care",
    situation: "After two units of blood, the uterus is firm, but Nokuthula is oozing from her IV sites and the blood in the kidney dish doesn't clot. Pulse 128. BP 90/58.",
    options: [
      { id: "coag", label: "Coagulopathy: activate the massive transfusion protocol (plasma, cryoprecipitate, platelets), send clotting tests, call the senior obstetrician and anaesthetist", correct: true },
      { id: "oxy", label: "More oxytocin", correct: false },
      { id: "wait", label: "More crystalloid and recheck in the morning", correct: false },
      { id: "iron", label: "Start IV iron", correct: false }
    ],
    explain: "Oozing from drip sites and blood that doesn't clot after a large haemorrhage mean the clotting factors are used up (coagulopathy, possibly DIC). Oxytocin won't help: she needs blood products to replace them, and senior help."
  },

  extraFeedback: function () { return []; },
  exampleErrors: ["Did not massage the uterus.", "Waited for a postpartum haemorrhage to settle.", "Kept a woman after a major PPH at a facility without blood or theatre."],

  learningPoints: [
    "‘She's just tired’ can be shock. Measure blood loss with a calibrated drape; don't guess.",
    "At 500 mL, or less with abnormal signs: give the whole bundle together. Massage, oxytocin, tranexamic acid, fluids, examine, escalate.",
    "The four Ts: Tone, Trauma, Tissue, Thrombin. Atony is the most common cause.",
    "Never give oxytocin as a rapid undiluted IV push.",
    "If bleeding continues: bimanual compression, the anti-shock garment, transfer.",
    "After a major PPH: transfer, transfuse, watch closely, and look out for coagulopathy."
  ]
});

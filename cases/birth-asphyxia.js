/*
 * LabZero Mama case: "Not breathing at birth"
 * Content licence: CC BY 4.0 (see CONTENT_LICENSE.md). Code licence: MIT.
 *
 * FICTIONAL TRAINING CASE. Not for clinical use.
 * Clinical content is pending review by a qualified neonatal clinician and must be
 * checked against the newborn resuscitation guidelines the training institution teaches.
 */
window.MAMA_CASES = window.MAMA_CASES || [];
window.MAMA_CASES.push({
  id: "birth-asphyxia-term",
  version: "0.1.0",
  status: "Draft: pending clinical validation",
  title: "Not breathing at birth",
  family: "Newborn: birth asphyxia",
  why: "Intrapartum-related complications such as birth asphyxia are among the leading causes of newborn death in Africa. Most of these babies can be saved by a trained person who starts ventilation in the first minute.",
  setting: "Midwife obstetric unit, night shift",
  patient: {
    name: "Baby boy of Lerato Dlamini",
    age: "Newborn",
    obstetric: "Born at 39 weeks after a 2-hour second stage. Thick meconium-stained liquor.",
    arrival: "Born at 02:14. Birth weight 3.2 kg"
  },
  opening: "The baby is out. He's not crying, sisi. He's not crying.",
  steps: ["triage", "resus", "history", "tests", "results", "diagnosis", "meds", "manage", "followup"],
  stepLabels: { triage: "First look", history: "Handover" },
  domains: [
    { id: "prioritisation", label: "Recognition at birth" },
    { id: "resuscitation", label: "Resuscitation" },
    { id: "history", label: "Handover questions" },
    { id: "investigations", label: "Test selection" },
    { id: "interpretation", label: "Result interpretation" },
    { id: "diagnosis", label: "Diagnosis" },
    { id: "medication", label: "Medication safety" },
    { id: "management", label: "Management" },
    { id: "monitoring", label: "Monitoring and response" }
  ],

  monitor: function (s) {
    var r = s.resus;
    if (!r) return [
      { k: "Clock", v: "0:00", u: "since birth" }, { k: "HR", v: "?", u: "/min" },
      { k: "Breathing", v: "none", u: "", alert: true }, { k: "Tone", v: "floppy", u: "", alert: true }
    ];
    var after = r.done && r.outcome === "stable";
    return [
      { k: "Clock", v: window.MamaResus.clock(r.t), u: "since birth", alert: !r.ventilating && r.t > 45 },
      { k: "HR", v: r.lastHr === null ? "?" : String(r.lastHr), u: "/min", alert: r.lastHr !== null && r.lastHr < 100 && !after },
      { k: "Breathing", v: after ? "regular" : r.breathing, u: "", alert: r.breathing === "none" },
      { k: "Tone", v: after ? "hypotonic" : r.tone, u: "", alert: true }
    ];
  },

  triage: {
    title: "First look at birth",
    vitals: [
      { label: "Crying", value: "No", unit: "", flag: "high" },
      { label: "Breathing", value: "None", unit: "", flag: "high" },
      { label: "Tone", value: "Floppy", unit: "" },
      { label: "Colour", value: "Blue", unit: "" },
      { label: "Liquor", value: "Thick meconium", unit: "" }
    ],
    look: "The baby lies limp on his mother's abdomen, covered in meconium. No cry, no breathing movements.",
    question: "What does this baby need?",
    options: [
      { id: "resus", label: "Resuscitation now", detail: "Start the steps of newborn resuscitation", score: 100 },
      { id: "doctor", label: "Call the doctor and wait", detail: "Do nothing until the doctor arrives", score: 10, critical: "Waited for a doctor instead of starting resuscitation." },
      { id: "skin", label: "Routine care", detail: "Skin-to-skin with mother and observe", score: 0, critical: "Treated a non-breathing baby as needing routine care." },
      { id: "weigh", label: "Weigh and measure first", detail: "Complete the birth register", score: 0, critical: "Delayed resuscitation for routine tasks." }
    ],
    feedback: "A baby who is not breathing or crying at birth needs help immediately. Every second counts in the Golden Minute."
  },

  resus: {
    start: { hr: 70 },
    timeLimit: 300,
    intro: "The clock is running from birth. Each action takes time. Watch the heart rate and the chest.",
    actions: [
      { id: "help", label: "Call for help", cost: 0, group: "Prepare" },
      { id: "dry", label: "Dry thoroughly and remove the wet cloth", cost: 15, group: "Prepare" },
      { id: "stimulate", label: "Rub the back to stimulate", cost: 10, group: "Prepare" },
      { id: "suction", label: "Clear the airway: suction mouth, then nose", cost: 15, group: "Airway" },
      { id: "cord", label: "Clamp and cut the cord; move to the resuscitation area", cost: 10, group: "Airway" },
      { id: "ventilate", label: "Start bag-and-mask ventilation (room air, 40/min)", cost: 5, group: "Breathe" },
      { id: "chest", label: "Check that the chest is rising", cost: 3, group: "Breathe" },
      { id: "reposition", label: "Reposition head and reapply mask", cost: 10, group: "Breathe" },
      { id: "vent30", label: "Ventilate for 30 seconds", cost: 30, group: "Breathe" },
      { id: "hr", label: "Check heart rate (stethoscope)", cost: 6, group: "Assess" },
      { id: "oxygen", label: "Connect 100% oxygen", cost: 5, group: "Assess" },
      { id: "compress", label: "Start chest compressions", cost: 30, group: "Assess" },
      { id: "wait", label: "Wait to see if he breathes on his own", cost: 30, group: "Other" },
      { id: "dangle", label: "Hold upside down and slap the back", cost: 10, group: "Other" },
      { id: "naloxone", label: "Give naloxone", cost: 10, group: "Other" },
      { id: "stop", label: "Breathing well: stop ventilation and hand over", cost: 0, group: "Finish" }
    ],
    messages: {
      late: "Did not start ventilation within 2 minutes of birth.",
      ineffective: "Ventilation was never effective (chest not rising).",
      compress: "Started chest compressions when they were not indicated.",
      wait: "Waited for spontaneous breathing instead of ventilating.",
      dangle: "Held the baby upside down and slapped him.",
      naloxone: "Gave naloxone, which has no place in newborn resuscitation here.",
      stopEarly: "Stopped ventilation before the baby was breathing regularly."
    },
    afterStable: "At 10 minutes: heart rate 142, breathing regularly, SpO₂ 93% in room air. He is floppy and lethargic with a weak suck. Apgar scores 2 at 1 minute, 5 at 5 minutes and 7 at 10 minutes."
  },

  history: {
    speaker: "Sister Nkosi",
    speakerRole: "the midwife",
    prompt: "Ask the midwife about the labour and the mother. She answers only from her approved handover.",
    intents: [
      { id: "gestation", chip: "How many weeks was the pregnancy?", critical: true,
        keywords: ["weeks", "gestation", "term", "preterm", "due"], reply: "39 weeks by an early scan." },
      { id: "fetal_heart", chip: "How was the fetal heart in labour?", critical: true,
        keywords: ["fetal heart", "heart rate", "decelerations", "ctg", "distress", "monitoring"],
        reply: "Late decelerations for the last 40 minutes of the second stage. We called the doctor but he was in theatre." },
      { id: "meconium", chip: "When was meconium noticed?", critical: true,
        keywords: ["meconium", "liquor", "green", "waters colour"], reply: "The liquor turned thick and green about an hour before birth." },
      { id: "opioids", chip: "Did the mother get pethidine or morphine?", critical: true,
        keywords: ["pethidine", "morphine", "opioid", "pain relief", "analgesia", "drugs in labour"],
        reply: "No. She had no pain relief except breathing support." },
      { id: "membranes", chip: "When did the membranes rupture?", critical: false,
        keywords: ["membranes", "rupture", "waters broke", "rom", "water"], reply: "Ten hours before birth." },
      { id: "fever", chip: "Did the mother have a fever?", critical: false,
        keywords: ["fever", "temperature", "infection", "hot", "chorio"], reply: "No. Her temperature was 36.9 throughout." },
      { id: "hiv", chip: "What is the mother's HIV status?", critical: false,
        keywords: ["hiv", "status", "arv", "positive", "negative"], reply: "Negative at 32 weeks, and the rapid test in labour was negative." },
      { id: "labour", chip: "How long was the labour?", critical: false,
        keywords: ["labour", "labor", "long", "second stage", "pushing", "duration"], reply: "Fourteen hours in total. The second stage was two hours." },
      { id: "diabetes", chip: "Any diabetes or high blood pressure?", critical: false,
        keywords: ["diabetes", "sugar", "blood pressure", "hypertension"], reply: "No. Her antenatal card is normal." },
      { id: "apgar", chip: "What were the Apgar scores?", critical: false,
        keywords: ["apgar", "score"], reply: "I scored 2 at one minute, 5 at five minutes and 7 at ten minutes." }
    ],
    fallback: "Sorry, I didn't catch that. Ask me about the labour or the mother."
  },

  tests: [
    { id: "glucose", label: "Capillary blood glucose", group: "Bedside", essential: true },
    { id: "temp", label: "Axillary temperature", group: "Bedside", essential: true },
    { id: "gas", label: "Blood gas (cord or first hour)", group: "Blood", essential: true },
    { id: "fbc", label: "Full blood count", group: "Blood", essential: false, appropriate: true },
    { id: "culture", label: "Blood culture and CRP", group: "Blood", essential: false, appropriate: true },
    { id: "electrolytes", label: "Sodium, potassium and calcium", group: "Blood", essential: false, appropriate: true },
    { id: "cxr", label: "Chest X-ray", group: "Imaging", essential: false, appropriate: false, why: "He is breathing regularly with normal saturation and a clear chest." },
    { id: "cranial_us", label: "Cranial ultrasound", group: "Imaging", essential: false, appropriate: false, why: "It does not change management in the first hour." },
    { id: "bilirubin", label: "Serum bilirubin", group: "Blood", essential: false, appropriate: false, why: "Not useful at one hour of age." }
  ],

  results: {
    turnaround: "Bedside results are immediate; blood results returned 40 minutes later (simulated).",
    reports: {
      glucose: { title: "Bedside glucose", rows: [
        { analyte: "Glucose", value: "1.9", unit: "mmol/L", range: "≥ 2.6", flag: "L", critical: true, key: "glu" } ]},
      temp: { title: "Observations", rows: [
        { analyte: "Axillary temperature", value: "35.6", unit: "°C", range: "36.5–37.5", flag: "L", key: "temp" } ]},
      gas: { title: "Blood gas", rows: [
        { analyte: "pH", value: "6.98", unit: "", range: "7.25–7.45", flag: "L", key: "ph" },
        { analyte: "pCO₂", value: "8.1", unit: "kPa", range: "4.7–6.7", flag: "H" },
        { analyte: "Base deficit", value: "15", unit: "mmol/L", range: "< 8", flag: "H", key: "bd" },
        { analyte: "Lactate", value: "9.8", unit: "mmol/L", range: "< 2.5", flag: "H", key: "lac" } ]},
      fbc: { title: "Full blood count", rows: [
        { analyte: "Haemoglobin", value: "17.1", unit: "g/dL", range: "14.0–22.0", flag: "", key: "hb" },
        { analyte: "White cell count", value: "18.2", unit: "×10⁹/L", range: "9.0–30.0", flag: "", key: "wcc" },
        { analyte: "Platelets", value: "210", unit: "×10⁹/L", range: "150–450", flag: "" } ]},
      culture: { title: "Infection markers", rows: [
        { analyte: "CRP", value: "4", unit: "mg/L", range: "< 10", flag: "", key: "crp" },
        { analyte: "Blood culture", value: "Pending (48 h)", unit: "", range: "", flag: "" } ]},
      electrolytes: { title: "Electrolytes", rows: [
        { analyte: "Sodium", value: "138", unit: "mmol/L", range: "133–146", flag: "" },
        { analyte: "Potassium", value: "5.2", unit: "mmol/L", range: "3.7–5.9", flag: "" },
        { analyte: "Calcium (ionised)", value: "1.12", unit: "mmol/L", range: "1.05–1.37", flag: "" } ]},
      cxr: { title: "Chest X-ray", text: "Clear lung fields. Normal heart size. Tube not required." },
      cranial_us: { title: "Cranial ultrasound", text: "No haemorrhage. Subtle generalised brightness; repeat as advised by the neonatal team." },
      bilirubin: { title: "Bilirubin", rows: [
        { analyte: "Total bilirubin", value: "28", unit: "µmol/L", range: "age-dependent", flag: "" } ]}
    },
    significant: ["glu", "temp", "ph", "bd", "lac"],
    criticalNote: "Bedside glucose 1.9 mmol/L, below the treatment threshold."
  },

  diagnosis: {
    options: [
      { id: "hie", label: "Birth asphyxia with hypoxic-ischaemic encephalopathy (HIE), hypoglycaemia and hypothermia", score: 100 },
      { id: "asphyxia_ok", label: "Birth asphyxia, fully recovered, routine care", score: 30 },
      { id: "mas", label: "Meconium aspiration syndrome", score: 20 },
      { id: "sepsis", label: "Early-onset neonatal sepsis", score: 10 },
      { id: "chd", label: "Congenital heart disease", score: 0 },
      { id: "normal", label: "Normal transition after birth", score: 0 }
    ],
    explain: "Late decelerations, a non-breathing baby who needed ventilation, severe metabolic acidosis on the blood gas and an abnormal neurological state (floppy, lethargic, weak suck) point to birth asphyxia with HIE. The low glucose and temperature need urgent treatment. His chest is clear and the infection markers are normal, so meconium aspiration and sepsis are less likely."
  },

  medicationChart: {
    intro: "Weight 3.2 kg. The doctor wrote this chart by phone. Check every line before anything is given.",
    lines: [
      { id: "dex_bolus", drug: "Dextrose 10%", order: "6.4 mL IV over 5–10 minutes (2 mL/kg)", error: false },
      { id: "dex_maint", drug: "Dextrose 10% maintenance", order: "60 mL/kg/day IV = 8 mL per hour", error: false },
      { id: "vitk", drug: "Vitamin K (phytomenadione)", order: "1 mg IM once", error: false },
      { id: "bicarb", drug: "Sodium bicarbonate 8.4%", order: "10 mL IV now to correct the acidosis", error: true,
        why: "Sodium bicarbonate is not recommended. The acidosis improves with effective ventilation and circulation, and concentrated bicarbonate can harm the newborn brain." },
      { id: "pheno", drug: "Phenobarbital", order: "20 mg IM now to prevent seizures", error: true,
        why: "Phenobarbital is not given to prevent seizures, and 20 mg is the wrong dose. If he has a seizure, the loading dose is 20 mg/kg IV (64 mg for 3.2 kg)." }
    ]
  },

  management: {
    options: [
      { id: "glucose", label: "Treat the low glucose: dextrose 10% bolus, then IV maintenance, recheck in 30 minutes", kind: "critical" },
      { id: "warm", label: "Restore normal temperature (36.5–37.5 °C) and avoid overheating", kind: "critical" },
      { id: "refer", label: "Admit to the neonatal unit and phone the referral centre about therapeutic cooling within 6 hours of birth", kind: "critical" },
      { id: "monitor", label: "Monitor heart rate, breathing, SpO₂, temperature and glucose, and watch for seizures", kind: "essential" },
      { id: "mother", label: "Explain what happened to the mother and keep her close to her baby", kind: "essential" },
      { id: "document", label: "Document resuscitation times, actions and Apgar scores", kind: "essential" },
      { id: "bath", label: "Bath him now to wash off the meconium", kind: "harmful", critical: "Bathed a cold, unstable newborn." },
      { id: "bottle", label: "Give a bottle feed of formula now", kind: "harmful", critical: "Fed a floppy baby with a weak suck by bottle (aspiration risk)." },
      { id: "window", label: "Leave him by the open window so he cools down", kind: "harmful", critical: "Left the baby to cool without control or monitoring." },
      { id: "ward", label: "Send him to the postnatal ward with his mother as a routine baby", kind: "harmful", critical: "Sent a baby with HIE and hypoglycaemia to routine care." }
    ]
  },

  followupPick: function (s) {
    return s.mgmt.indexOf("glucose") !== -1 ? this.followup.treated : this.followup.untreated;
  },
  followup: {
    treated: {
      time: "Three hours later",
      situation: "Rhythmic jerking of the right arm and lip-smacking for two minutes. Glucose 3.4 mmol/L. Temperature 36.8 °C.",
      options: [
        { id: "seizure_mx", label: "Support the airway and give oxygen, confirm the glucose, give phenobarbital 20 mg/kg IV (64 mg) as a loading dose, and call the doctor", correct: true },
        { id: "restrain", label: "Hold the arm still until the jerking stops", correct: false },
        { id: "feed", label: "Feed him; he is probably hungry", correct: false },
        { id: "wait", label: "Observe and document; seizures in newborns stop on their own", correct: false }
      ],
      explain: "Seizures are common after birth asphyxia and signal HIE. Exclude low glucose, then load with phenobarbital and involve the neonatal team."
    },
    untreated: {
      time: "One hour later",
      situation: "He is jittery, then has a seizure. Glucose 1.2 mmol/L.",
      options: [
        { id: "glucose_now", label: "Give dextrose 10% 2 mL/kg IV now (6.4 mL), start IV maintenance, recheck glucose in 30 minutes, and call the doctor", correct: true },
        { id: "pheno_only", label: "Give phenobarbital and leave the glucose for later", correct: false },
        { id: "oral", label: "Give a bottle of sugar water", correct: false },
        { id: "wait", label: "Recheck the glucose in two hours", correct: false }
      ],
      explain: "The low glucose was not treated, and it has caused a seizure. Hypoglycaemia damages the newborn brain; treat it immediately with IV dextrose."
    }
  },

  extraFeedback: function () { return []; },

  learningPoints: [
    "The Golden Minute: a baby who is not breathing needs ventilation within 60 seconds of birth.",
    "Dry and keep warm first; it costs seconds and prevents cold stress.",
    "Ventilation is the single most important step. If the chest does not rise, reposition the head and mask.",
    "The heart rate tells you whether resuscitation is working. Compressions only if it stays below 60 despite 30 seconds of effective ventilation.",
    "After resuscitation: check glucose and temperature, watch for seizures, and discuss cooling with the referral centre within 6 hours."
  ]
});

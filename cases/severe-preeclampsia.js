/*
 * LabZero Mama case: "Headache at 34 weeks"
 * Content licence: CC BY 4.0 (see CONTENT_LICENSE.md). Code licence: MIT.
 *
 * FICTIONAL TRAINING CASE. Not for clinical use.
 * Clinical content is pending review by a qualified obstetric clinician and
 * must be checked against the treatment guidelines the training institution teaches.
 */
window.MAMA_CASES = window.MAMA_CASES || [];
window.MAMA_CASES.push({
  id: "severe-preeclampsia-34w",
  version: "0.1.0",
  status: "Draft: pending clinical validation",
  title: "Headache at 34 weeks",
  family: "Hypertensive disorders of pregnancy",
  setting: "Ikhwezi Community Health Centre, then the district hospital",
  patient: {
    name: "Thandeka Mokoena",
    age: 24,
    obstetric: "G2P1, 34 weeks and 2 days by early ultrasound",
    arrival: "Ticket 012 · in the queue since 06:10"
  },
  opening: "My head has been pounding since this morning, and now the lights look funny. Sisi, I'm scared for the baby.",
  why: "Hypertensive disorders of pregnancy are a leading cause of maternal death in South Africa. Recognising severe pre-eclampsia in the clinic and starting magnesium sulphate before transfer saves mothers and babies.",
  steps: ["records", "vitals", "history", "exam", "triage", "tests", "results", "diagnosis", "meds", "manage", "followup"],
  stepLabels: { records: "File room", vitals: "Vitals", history: "Doctor", exam: "Examine", triage: "Decision" },
  stepSettings: {
    records: "Ikhwezi CHC · file room",
    vitals: "Ikhwezi CHC · nurse's vitals station",
    history: "Ikhwezi CHC · doctor's consulting room",
    exam: "Ikhwezi CHC · doctor's consulting room",
    triage: "Ikhwezi CHC · deciding what happens next",
    tests: "District hospital · maternity unit",
    results: "District hospital · maternity unit",
    diagnosis: "District hospital · maternity unit",
    meds: "District hospital · maternity unit",
    manage: "District hospital · maternity unit",
    followup: "District hospital · labour ward"
  },
  domains: [
    { id: "experience", label: "Patient experience" },
    { id: "vitals", label: "Nurse vitals" },
    { id: "history", label: "History taking" },
    { id: "assessment", label: "Examination" },
    { id: "prioritisation", label: "Clinic decision" },
    { id: "investigations", label: "Test selection" },
    { id: "interpretation", label: "Result interpretation" },
    { id: "diagnosis", label: "Diagnosis" },
    { id: "medication", label: "Medication safety" },
    { id: "management", label: "Management" },
    { id: "monitoring", label: "Monitoring and response" }
  ],

  monitor: function (s) {
    var later = s.stepId === "followup" || s.stepId === "debrief";
    var mg = s.mgmt.indexOf("mgso4") !== -1, bolus = s.mgmt.indexOf("bolus") !== -1;
    return [
      { k: "BP", v: s.exams.indexOf("repeat_bp") !== -1 ? "170/114" : "168/112", u: "mmHg", alert: true },
      { k: "HR", v: "98", u: "/min" },
      { k: "RR", v: later && mg ? "11" : "18", u: "/min", alert: later && mg },
      { k: "SpO\u2082", v: later && bolus ? "89" : "98", u: "%", alert: later && bolus },
      { k: "Urine", v: "3+", u: "protein", alert: true }
    ];
  },

  beforeVitals: function (s, day) {
    var p = window.MAMA_CLINIC.patients.find(function (x) { return x.caseId === "severe-preeclampsia-34w"; });
    var pick = day && day.lobby[this.id] !== undefined ? p.options[day.lobby[this.id]] : null;
    return pick && pick.fastTrack ? null :
      "Thandeka was not fast-tracked. She reached the vitals station at 11:20, after five hours in the queue. She vomited twice on the bench and says her vision is worse.";
  },

  extraFeedback: function (s) {
    return s.exams.indexOf("reflexes") === -1 && s.mgmt.indexOf("mgso4") !== -1
      ? ["You started magnesium sulphate without recording baseline reflexes."] : [];
  },

  followupPick: function (s) {
    return s.mgmt.indexOf("mgso4") !== -1 ? this.followup.withMagnesium : this.followup.withoutMagnesium;
  },

  file: {
    title: "Maternity case record (carried by the patient)",
    entries: [
      "20 weeks: BP 118/74. Urine clear. Booking bloods normal. HIV positive, on TLD.",
      "28 weeks: BP 128/82. Fundal height 27 cm.",
      "32 weeks: BP 142/94. Urine protein trace. \u201cReturn in 1 week for BP check.\u201d",
      "33 weeks: no entry. Visit missed."
    ]
  },

  scenes: {
    records: {
      title: "The file room",
      lead: "The queue for files moves slowly. The clerk, Mrs Dube, has been on her feet since seven.",
      turns: [
        { speaker: "Mrs Dube (clerk)", line: "Mokoena? There's no clinic folder for Mokoena. She must come back tomorrow.",
          options: [
            { text: "She has her maternity case record with her. She can be seen with that now, and we'll open a folder later.", score: 100,
              reply: "Mrs Dube shrugs and stamps a ticket. \u201cFine. Next!\u201d" },
            { text: "Let's search the shelves together until we find it.", score: 30,
              reply: "Twenty minutes pass. Thandeka holds her head in her hands." },
            { text: "Come back tomorrow, sisi.", score: 0, flag: "Turned away a pregnant woman with danger signs over a missing folder.",
              reply: "Thandeka starts to cry." }
          ]},
        { speaker: "Thandeka", line: "I've been waiting since six. My head is getting worse.",
          options: [
            { text: "I'm taking you straight to the nurse now.", score: 100, reply: "She stands, steadying herself on your arm." },
            { text: "Drink some water and sit down.", score: 20, reply: "She sips the water. It doesn't help." },
            { text: "Please be patient like everyone else.", score: 0, flag: "Asked a woman with danger signs to keep waiting.", reply: "She sits back down." }
          ]}
      ]
    }
  },

  vitals: [
    { id: "bp", label: "Blood pressure", value: "168/112", unit: "mmHg", abnormal: true, essential: true, line: "Is it high? My feet are swollen too." },
    { id: "pulse", label: "Pulse", value: "98", unit: "/min", abnormal: false, essential: false, line: "My heart feels like it's running." },
    { id: "temp", label: "Temperature", value: "36.8", unit: "\u00b0C", abnormal: false, essential: false, line: "I'm not feverish, just this head." },
    { id: "weight", label: "Weight", value: "74", unit: "kg (+3 kg in 2 weeks)", abnormal: true, essential: true, line: "Haibo, I've picked up so much weight suddenly." },
    { id: "glucose", label: "Finger-prick glucose", value: "5.4", unit: "mmol/L", abnormal: false, essential: false, line: "I ate bread at five this morning." },
    { id: "urine", label: "Urine dipstick", value: "Protein 3+", unit: "", abnormal: true, essential: true, line: "Must I pee in this small thing? Okay." },
    { id: "hb", label: "Haemoglobin (finger prick)", value: "11.4", unit: "g/dL", abnormal: false, essential: false, line: "I take my iron tablets every day." },
    { id: "preg", label: "Urine pregnancy test", value: "Not needed", unit: "", abnormal: false, essential: false, line: "Sisi, I'm 34 weeks pregnant!" }
  ],

  triage: {
    title: "What happens next?",
    question: "You are the clinic doctor. Decide her next step",
    vitals: [
      { label: "Blood pressure", value: "170/114", unit: "mmHg", flag: "high" },
      { label: "Urine protein", value: "3+", unit: "", flag: "high" },
      { label: "Symptoms", value: "Headache, vision, epigastric pain", unit: "", flag: "high" },
      { label: "Gestation", value: "34 weeks", unit: "" }
    ],
    look: "Thandeka is lying on the couch with her eyes closed against the light. Her mother is holding her hand.",
    options: [
      { id: "transfer", label: "Emergency transfer", detail: "Give the magnesium sulphate loading dose and oral nifedipine, call an ambulance, and send her with a nurse and a referral letter", score: 100 },
      { id: "letter", label: "Refer tomorrow", detail: "Write a referral letter for the hospital antenatal clinic tomorrow", score: 20, critical: "Delayed hospital care for severe pre-eclampsia with danger signs." },
      { id: "taxi", label: "Send by taxi", detail: "Tell her to take a taxi to the hospital now", score: 30, critical: "Sent a woman at risk of eclampsia to hospital without stabilisation or an escort." },
      { id: "home", label: "Treat and send home", detail: "Give paracetamol and recheck the BP next week", score: 0, critical: "Sent home a woman with severe pre-eclampsia." }
    ],
    feedback: "Severe hypertension with headache, visual disturbance and proteinuria at 34 weeks means severe pre-eclampsia with imminent eclampsia. Start magnesium sulphate and an antihypertensive in the clinic, then transfer by ambulance with an escort."
  },

  history: {
    speaker: "Thandeka",
    speakerRole: "the patient",
    prompt: "Type a question in your own words, or tap a suggestion. She answers only from her approved case script.",
    intents: [
      { id: "headache", chip: "Tell me about the headache", critical: true,
        keywords: ["headache", "head", "pain in head", "ikhanda", "migraine", "pounding"],
        reply: "It started this morning. It's the worst headache I've had. I took two Panado at nine but it didn't help." },
      { id: "vision", chip: "Any change in your eyesight?", critical: true,
        keywords: ["vision", "eyes", "see", "sight", "blurry", "blurred", "lights", "flashing", "amehlo"],
        reply: "Since lunchtime I see flashing lights, and things look blurry." },
      { id: "epigastric", chip: "Any pain in your tummy?", critical: true,
        keywords: ["stomach", "tummy", "abdomen", "abdominal", "belly", "epigastric", "ribs", "isisu", "heartburn"],
        reply: "Yes, here under my ribs in the middle, going to the right. It feels like bad heartburn." },
      { id: "allergies", chip: "Do you have any allergies?", critical: true,
        keywords: ["allergy", "allergies", "allergic", "reaction"],
        reply: "No, I'm not allergic to anything." },
      { id: "medicines", chip: "What medicines do you take?", critical: false,
        keywords: ["medicine", "medication", "pills", "tablets", "treatment", "taking", "arv", "drugs"],
        reply: "My ARVs every night, and the iron and folic acid from the clinic." },
      { id: "hiv", chip: "Do you know your HIV status?", critical: false,
        keywords: ["hiv", "status", "viral load", "positive"],
        reply: "I'm living with HIV. I've been on ARVs since 2021. The clinic said my viral load was not detectable in August." },
      { id: "fetal_movements", chip: "Is the baby moving?", critical: false,
        keywords: ["baby", "moving", "movements", "kicks", "kicking", "ingane"],
        reply: "Yes, but a bit less than usual today." },
      { id: "bleeding", chip: "Any bleeding or leaking water?", critical: false,
        keywords: ["bleeding", "blood", "water", "leaking", "fluid", "membranes"],
        reply: "No bleeding. No water." },
      { id: "contractions", chip: "Any tightenings or contractions?", critical: false,
        keywords: ["contractions", "tightening", "tightenings", "labour", "labor", "pains"],
        reply: "No tightenings." },
      { id: "seizure", chip: "Any fits or loss of consciousness?", critical: false,
        keywords: ["fit", "fits", "seizure", "convulsion", "faint", "unconscious", "collapse"],
        reply: "No, nothing like that." },
      { id: "swelling", chip: "Any swelling?", critical: false,
        keywords: ["swelling", "swollen", "oedema", "edema", "puffy", "ring"],
        reply: "My face and hands have been swollen for three days. My ring is too tight now." },
      { id: "breathing", chip: "Any difficulty breathing?", critical: false,
        keywords: ["breath", "breathing", "breathless", "chest", "cough"],
        reply: "No, my breathing is fine." },
      { id: "urine", chip: "How is your urine?", critical: false,
        keywords: ["urine", "wee", "passing water", "toilet", "urinating"],
        reply: "I'm passing less than normal today." },
      { id: "antenatal", chip: "How were your clinic visits?", critical: false,
        keywords: ["clinic", "antenatal", "visit", "check-up", "checkup", "blood pressure before", "last visit"],
        reply: "Two weeks ago the sister said my BP was a bit high, 142 over 94. She said come back in a week, but I had no money for the taxi." },
      { id: "previous", chip: "How was your first pregnancy?", critical: false,
        keywords: ["first pregnancy", "previous", "last pregnancy", "first baby", "before"],
        reply: "My BP was a bit high at the end. My son was born at 38 weeks, normal delivery." }
    ],
    fallback: "Sorry, sisi, I don't understand. Can you ask me differently?"
  },

  exam: [
    { id: "repeat_bp", label: "Repeat blood pressure after 15 minutes", essential: true, finding: "170/114 mmHg. Still severely raised." },
    { id: "reflexes", label: "Knee reflexes and clonus", essential: true, finding: "Brisk reflexes (3+) with 2 beats of ankle clonus. Record this as the baseline before magnesium sulphate." },
    { id: "fetal_heart", label: "Fetal heart rate", essential: true, finding: "142 beats per minute, regular." },
    { id: "abdomen", label: "Palpate the abdomen", essential: true, finding: "Tender in the epigastrium and right upper quadrant. Uterus soft and not tender." },
    { id: "chest", label: "Listen to the chest", essential: false, finding: "Clear. No crackles." },
    { id: "oedema", label: "Check for oedema", essential: false, finding: "Facial and hand oedema. Pitting oedema to mid-shin." },
    { id: "fundal", label: "Measure fundal height", essential: false, finding: "31 cm." },
    { id: "fundoscopy", label: "Look at the eyes (fundoscopy)", essential: false, finding: "No papilloedema seen." }
  ],

  tests: [
    { id: "fbc", label: "Full blood count", group: "Blood", essential: true },
    { id: "ue", label: "Urea, creatinine and electrolytes", group: "Blood", essential: true },
    { id: "lft", label: "Liver function tests", group: "Blood", essential: true },
    { id: "ldh", label: "Lactate dehydrogenase (LDH)", group: "Blood", essential: false, appropriate: true },
    { id: "inr", label: "INR", group: "Blood", essential: false, appropriate: true },
    { id: "group", label: "Blood group and antibody screen", group: "Blood", essential: false, appropriate: true },
    { id: "upcr", label: "Urine protein:creatinine ratio", group: "Urine", essential: false, appropriate: true },
    { id: "ctg", label: "Cardiotocograph (CTG)", group: "Fetal", essential: true },
    { id: "ultrasound", label: "Obstetric ultrasound", group: "Fetal", essential: false, appropriate: true },
    { id: "cxr", label: "Chest X-ray", group: "Imaging", essential: false, appropriate: false, why: "Her chest is clear and her oxygen saturation is normal." },
    { id: "ct_brain", label: "CT brain", group: "Imaging", essential: false, appropriate: false, why: "Not indicated without a seizure or focal neurological signs. Waiting for it delays treatment." },
    { id: "ddimer", label: "D-dimer", group: "Blood", essential: false, appropriate: false, why: "Raised in normal pregnancy and does not change management here." }
  ],

  results: {
    turnaround: "Results returned 45 minutes later (simulated).",
    reports: {
      fbc: { title: "Full blood count", rows: [
        { analyte: "Haemoglobin", value: "11.4", unit: "g/dL", range: "12.0–15.0", flag: "L", key: "hb" },
        { analyte: "White cell count", value: "9.8", unit: "×10⁹/L", range: "4.0–11.0", flag: "" },
        { analyte: "Platelets", value: "92", unit: "×10⁹/L", range: "150–400", flag: "L", critical: true, key: "plt" }
      ]},
      ue: { title: "Urea, creatinine and electrolytes", rows: [
        { analyte: "Sodium", value: "137", unit: "mmol/L", range: "136–145", flag: "" },
        { analyte: "Potassium", value: "4.1", unit: "mmol/L", range: "3.5–5.1", flag: "" },
        { analyte: "Urea", value: "6.8", unit: "mmol/L", range: "2.1–7.1", flag: "", key: "urea" },
        { analyte: "Creatinine", value: "96", unit: "µmol/L", range: "49–90", flag: "H", key: "creat" }
      ]},
      lft: { title: "Liver function tests", rows: [
        { analyte: "ALT", value: "112", unit: "U/L", range: "7–35", flag: "H", key: "alt" },
        { analyte: "AST", value: "128", unit: "U/L", range: "13–35", flag: "H", key: "ast" },
        { analyte: "Total bilirubin", value: "14", unit: "µmol/L", range: "5–21", flag: "" }
      ]},
      ldh: { title: "Lactate dehydrogenase", rows: [
        { analyte: "LDH", value: "610", unit: "U/L", range: "120–246", flag: "H", key: "ldh" }
      ]},
      inr: { title: "Coagulation", rows: [
        { analyte: "INR", value: "1.0", unit: "", range: "0.8–1.2", flag: "" }
      ]},
      group: { title: "Blood bank", rows: [
        { analyte: "Blood group", value: "O RhD positive", unit: "", range: "", flag: "" },
        { analyte: "Antibody screen", value: "Negative", unit: "", range: "", flag: "" }
      ]},
      upcr: { title: "Urine chemistry", rows: [
        { analyte: "Protein:creatinine ratio", value: "152", unit: "mg/mmol", range: "< 30", flag: "H", key: "upcr" }
      ]},
      ctg: { title: "Cardiotocograph", text: "Baseline 140 bpm. Variability 5–15 bpm. Accelerations present. No decelerations. Normal trace." },
      ultrasound: { title: "Obstetric ultrasound", text: "Single live fetus, cephalic. Estimated fetal weight 2.1 kg (around the 10th centile). Amniotic fluid low-normal." },
      cxr: { title: "Chest X-ray", text: "Clear lung fields. Normal heart size." },
      ct_brain: { title: "CT brain", text: "No acute intracranial abnormality. (The scan took 2 hours to arrange.)" },
      ddimer: { title: "D-dimer", rows: [
        { analyte: "D-dimer", value: "1.9", unit: "mg/L FEU", range: "< 0.5 (non-pregnant)", flag: "H" }
      ]}
    },
    significant: ["plt", "alt", "ast", "ldh", "creat", "upcr"],
    criticalNote: "Laboratory phoned: platelets 92 ×10⁹/L."
  },

  diagnosis: {
    options: [
      { id: "pe_hellp", label: "Severe pre-eclampsia with features of HELLP syndrome", score: 100 },
      { id: "pe_severe", label: "Severe pre-eclampsia without organ involvement", score: 60 },
      { id: "eclampsia", label: "Eclampsia", score: 0 },
      { id: "gest_htn", label: "Gestational hypertension", score: 0 },
      { id: "migraine", label: "Migraine in pregnancy", score: 0 },
      { id: "aflp", label: "Acute fatty liver of pregnancy", score: 10 }
    ],
    explain: "Severe hypertension, proteinuria and symptoms, with low platelets and raised ALT, AST and LDH, point to severe pre-eclampsia with HELLP features. There has been no seizure, so this is not yet eclampsia. Normal glucose and INR make acute fatty liver unlikely."
  },

  medicationChart: {
    intro: "The admitting doctor wrote this chart. Check every line before anything is given.",
    lines: [
      { id: "mg", drug: "Magnesium sulphate", order: "Loading dose given at the clinic at 10:05; continue 1 g per hour by IV infusion", error: false },
      { id: "nif", drug: "Nifedipine", order: "10 mg sublingual, repeat after 30 minutes if BP ≥ 160/110", error: true,
        why: "Nifedipine should be swallowed, not given sublingually. Sublingual use can drop the blood pressure too fast and harm the baby." },
      { id: "rl", drug: "Ringer's lactate", order: "1000 mL IV over 1 hour", error: true,
        why: "Women with severe pre-eclampsia are at risk of pulmonary oedema. Fluids should be restricted and a fluid balance kept, not given as a bolus." },
      { id: "pcm", drug: "Paracetamol", order: "1 g oral, 6-hourly as needed for headache", error: false },
      { id: "cag", drug: "Calcium gluconate 10%", order: "10 mL at the bedside (antidote for magnesium toxicity)", error: false }
    ]
  },

  management: {
    options: [
      { id: "mgso4", label: "Continue magnesium sulphate (maintenance after the clinic loading dose)", kind: "critical" },
      { id: "antihtn", label: "Give oral nifedipine to bring blood pressure below 160/110", kind: "critical" },
      { id: "monitor", label: "Hourly BP, respiratory rate, reflexes and urine output via catheter", kind: "essential" },
      { id: "fluids", label: "Restrict IV fluids and keep a fluid balance chart", kind: "essential" },
      { id: "senior", label: "Call the doctor or obstetrician and plan delivery once she is stable", kind: "essential" },
      { id: "neonatal", label: "Tell the neonatal team a 34-week baby may be delivered", kind: "essential" },
      { id: "send_home", label: "Start methyldopa and review at the clinic in one week", kind: "harmful",
        critical: "Sent home a woman with severe pre-eclampsia and HELLP features." },
      { id: "bolus", label: "Give 2 litres of IV fluid because her urine output is low", kind: "harmful",
        critical: "Gave a fluid bolus in severe pre-eclampsia (risk of pulmonary oedema)." },
      { id: "diazepam", label: "Give diazepam to prevent seizures", kind: "harmful",
        critical: "Used diazepam instead of magnesium sulphate for seizure prevention." },
      { id: "wait_ct", label: "Wait for a CT brain before starting treatment", kind: "harmful",
        critical: "Delayed treatment to wait for imaging that was not indicated." }
    ]
  },

  followup: {
    withMagnesium: {
      time: "Two hours later",
      situation: "Thandeka is drowsy. Respiratory rate 11/min. Knee reflexes absent. Urine output 60 mL over the past 4 hours.",
      options: [
        { id: "stop_mg", label: "Stop the magnesium infusion, give calcium gluconate 1 g (10 mL of 10%) IV slowly, and call the doctor", correct: true },
        { id: "continue", label: "Continue the infusion; she is resting comfortably", correct: false },
        { id: "increase", label: "Increase the magnesium to prevent a seizure", correct: false },
        { id: "naloxone", label: "Give naloxone for the drowsiness", correct: false }
      ],
      explain: "Absent reflexes and a respiratory rate below 12 with low urine output are signs of magnesium toxicity. Stop the infusion, give the antidote and get help."
    },
    withoutMagnesium: {
      time: "Forty minutes later",
      situation: "Thandeka has a generalised tonic-clonic seizure on the bed. Her mother is screaming for help.",
      options: [
        { id: "eclampsia_mx", label: "Call for help, turn her onto her left side, protect the airway, give oxygen and give the magnesium sulphate loading dose", correct: true },
        { id: "diazepam_only", label: "Give diazepam IV and wait for the seizure to stop", correct: false },
        { id: "restrain", label: "Hold her down and put something in her mouth", correct: false },
        { id: "ct_now", label: "Send her for an urgent CT brain", correct: false }
      ],
      explain: "Magnesium sulphate was not started, and she has developed eclampsia. Magnesium sulphate is the drug of choice to stop and prevent eclamptic seizures."
    }
  },

  learningPoints: [
    "BP ≥ 160/110 with headache, visual change or epigastric pain means severe pre-eclampsia until proven otherwise.",
    "Magnesium sulphate prevents eclampsia. Check reflexes, respiratory rate and urine output before every dose.",
    "Low platelets with raised liver enzymes and LDH point to HELLP syndrome.",
    "Nifedipine is swallowed, never given sublingually. Restrict fluids.",
    "Missed follow-up visits are a system failure. Ask why, and plan transport."
  ]
});

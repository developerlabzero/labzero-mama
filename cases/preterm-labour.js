/*
 * LabZero Mama case: "It's too early"
 * Content licence: CC BY 4.0 (see CONTENT_LICENSE.md). Code licence: MIT.
 *
 * FICTIONAL TRAINING CASE. Not for clinical use.
 * Clinical content is pending review by an obstetrician and a neonatologist
 * (antenatal corticosteroids, tocolysis, magnesium neuroprotection, care of the
 * preterm newborn, kangaroo mother care).
 */
window.MAMA_CASES = window.MAMA_CASES || [];
window.MAMA_CASES.push({
  id: "preterm-labour-31w",
  version: "0.1.0",
  status: "Draft: pending clinical validation",
  title: "It's too early",
  family: "Obstetrics and newborn: preterm labour and the small baby",
  why: "Preterm birth is a leading cause of newborn death. Simple, cheap actions save many of these babies: steroids before birth, birth in the right place, warmth, CPAP, breast milk and kangaroo mother care.",
  setting: "Ikhwezi CHC midwife obstetric unit (MOU), then the regional hospital and its neonatal unit",
  patient: { name: "Thembeka Ngcobo", age: 23, obstetric: "First pregnancy, 31 weeks. Booked at 12 weeks", arrival: "Walked into the MOU at 14:10 with contractions" },
  opening: "It's too early. The baby is only due in December.",
  steps: ["vitals", "history", "exam", "triage", "tests", "results", "diagnosis", "meds", "manage", "smallbaby", "kmc", "followup"],
  stepLabels: { vitals: "Vitals", history: "Her story", exam: "Examine", triage: "Where to give birth", smallbaby: "The small baby", kmc: "Kangaroo care", followup: "Day 5" },
  stepSettings: {
    vitals: "Ikhwezi CHC · MOU · 14:10", history: "Ikhwezi CHC · MOU", exam: "Ikhwezi CHC · MOU",
    triage: "Ikhwezi CHC · MOU", tests: "Ikhwezi CHC · MOU", results: "Regional hospital · labour ward",
    diagnosis: "Regional hospital · labour ward", meds: "Ikhwezi CHC · MOU, before transfer",
    manage: "Ikhwezi CHC · MOU, before transfer", smallbaby: "Regional hospital · delivery room · 21:40",
    kmc: "Regional hospital · kangaroo mother care ward, day 3", followup: "Regional hospital · kangaroo mother care ward, day 5"
  },
  sceneDomains: { kmc: "kmc" },
  domains: [
    { id: "vitals", label: "Maternal vitals" }, { id: "history", label: "History taking" },
    { id: "assessment", label: "Examination" }, { id: "prioritisation", label: "Birth in the right place" },
    { id: "investigations", label: "Test selection" }, { id: "interpretation", label: "Result interpretation" },
    { id: "diagnosis", label: "Diagnosis" }, { id: "medication", label: "Medication safety" },
    { id: "management", label: "Management before birth" }, { id: "newborn", label: "First hour of the small baby" },
    { id: "kmc", label: "Kangaroo mother care" }, { id: "monitoring", label: "Monitoring and response" }
  ],

  tuto: {
    vitals: "Look for a cause of the early labour. Fever and the urine are where you start.",
    history: "How many weeks exactly, how often the contractions come, whether the waters have broken, and anything that could have started it.",
    triage: "Where is the best place for a 31-week baby to be born? Inside the mother, on the way to a hospital with a neonatal unit.",
    meds: "Three medicines change outcomes before a very early birth: steroids for the lungs, magnesium for the brain, and a tocolytic to buy time. Check the route and form of each one.",
    smallbaby: "Warmth first: a wet preterm baby loses heat in minutes. Then breathing support, glucose and breast milk.",
    kmc: "Kangaroo mother care is treatment, not a cuddle. Teach it with confidence and kindness."
  },

  monitor: function (s) {
    var baby = ["smallbaby", "kmc", "followup", "debrief"].indexOf(s.stepId) !== -1;
    var r = s.drills && s.drills.smallbaby;
    if (baby) return [
      { k: "Baby weight", v: "1.45", u: "kg", alert: true },
      { k: "Baby temp", v: r ? r.meter.toFixed(1) : "36.6", u: "°C", alert: r ? r.meter < 36.5 : false },
      { k: "Gestation", v: "31+2", u: "weeks", alert: true },
      { k: "SpO₂", v: r && r.done.cpap ? "93" : "88", u: "%", alert: !(r && r.done.cpap) }];
    return [
      { k: "Gestation", v: "31+2", u: "weeks", alert: true },
      { k: "Contractions", v: "3 in 10", u: "min", alert: true },
      { k: "Temp", v: "37.9", u: "°C", alert: true },
      { k: "Fetal HR", v: "152", u: "/min" }];
  },

  scenes: {
    kmc: {
      title: "Day 3: learning kangaroo care",
      lead: "Baby Lwazi is off CPAP, in an incubator. Thembeka sits beside it, afraid to touch him.",
      turns: [
        { speaker: "Thembeka", line: "He's so small. I'm scared I'll hurt him. Isn't he safer in the machine?",
          options: [
            { text: "“Your chest is the best incubator he can have. Skin to skin, upright, between your breasts, with a wrap holding him. Babies in kangaroo care stay warmer, feed better and do better. Let me show you.”", score: 100, reply: "She unbuttons her gown. When Lwazi is on her chest, she starts to cry and laugh at once." },
            { text: "“Yes, leave him in the incubator until he's bigger.”", score: 20, reply: "She visits twice a day and goes back to her bed." },
            { text: "“Hold him for a few minutes if you like.”", score: 40, reply: "She holds him for five minutes, then hands him back." }
          ]},
        { speaker: "Thembeka", line: "I only get a few drops of milk. Maybe formula is better for a small baby?",
          options: [
            { text: "“Those drops are colostrum: perfect medicine for him. Express by hand every 2–3 hours, including at night, and your milk will increase. We'll give it to him by tube or cup until he can suckle.”", score: 100, reply: "She practises hand expression with the nurse and fills a syringe with 2 mL." },
            { text: "“Yes, formula is easier for small babies.”", score: 0, flag: "Advised formula instead of breast milk for a preterm baby.", reply: "Her milk dries up within a week." },
            { text: "“Just try your best.”", score: 30, reply: "She doesn't know how to try." }
          ]},
        { speaker: "Thembeka's mother-in-law (on the phone)", line: "A baby this small means she did something wrong. Or someone bewitched her.",
          options: [
            { text: "(To Thembeka, after the call) “Nothing you did caused this. The infection in your urine probably started the labour, and you came in exactly when you should have. You're doing everything right for him now.”", score: 100, reply: "She wipes her eyes. “Can you tell her that too?” “Yes. Bring her when she visits.”" },
            { text: "Say nothing: it's a family matter.", score: 30, reply: "Thembeka stays quiet for the rest of the day." },
            { text: "“Did you do anything to cause it?”", score: 0, flag: "Implied a mother caused her baby's preterm birth.", reply: "She turns her face to the wall." }
          ]}
      ],
      teach: "Kangaroo mother care: continuous skin-to-skin contact, exclusive breast milk and early discharge with follow-up. It cuts deaths in small babies. Mothers need confidence, practical help and freedom from blame.",
      next: "Day 5"
    }
  },

  vitals: [
    { id: "temp", label: "Temperature", value: "37.9", unit: "°C", abnormal: true, essential: true, line: "I've felt hot since yesterday." },
    { id: "bp", label: "Blood pressure", value: "112/70", unit: "mmHg", abnormal: false, essential: true, line: "" },
    { id: "pulse", label: "Pulse", value: "104", unit: "/min", abnormal: true, essential: true, line: "" },
    { id: "urine", label: "Urine dipstick", value: "Leucocytes 2+, nitrites positive, no protein", unit: "", abnormal: true, essential: true, line: "It's been burning when I wee." },
    { id: "ctx", label: "Contractions in 10 minutes", value: "3, each lasting 40 seconds", unit: "", abnormal: true, essential: true, line: "Here comes another one…" },
    { id: "fhr", label: "Fetal heart rate", value: "152", unit: "/min", abnormal: false, essential: true, line: "Is he okay?" },
    { id: "glucose", label: "Finger-prick glucose", value: "5.2", unit: "mmol/L", abnormal: false, essential: false, line: "" }
  ],

  history: {
    speaker: "Thembeka", speakerRole: "the patient", title: "Her story",
    prompt: "Between contractions. She answers only from her approved case script.",
    intents: [
      { id: "weeks", chip: "How many weeks are you, and how sure are you of the dates?", critical: true,
        keywords: ["weeks", "dates", "due", "gestation", "scan", "how far"], reply: "31 weeks. They did a scan when I booked at 12 weeks." },
      { id: "pains", chip: "When did the pains start and how often are they?", critical: true,
        keywords: ["pain", "contractions", "start", "often", "tight"], reply: "Since this morning. Now every three or four minutes." },
      { id: "waters", chip: "Have your waters broken or are you leaking fluid?", critical: true,
        keywords: ["waters", "leaking", "fluid", "broken", "wet"], reply: "No. Just a bit of pink mucus." },
      { id: "urine", chip: "Any burning when you pass urine, or fever?", critical: true,
        keywords: ["urine", "burning", "wee", "fever", "hot", "infection"], reply: "Burning for a week. Since yesterday I feel hot and my back hurts on the right." },
      { id: "moves", chip: "Is the baby moving normally?", critical: false,
        keywords: ["moving", "movements", "kicks"], reply: "Yes, a lot." },
      { id: "bleeding", chip: "Any bleeding?", critical: false,
        keywords: ["bleeding", "blood", "spotting"], reply: "Only the pink mucus." },
      { id: "hiv", chip: "What were your booking blood results?", critical: false,
        keywords: ["hiv", "results", "booking", "bloods", "rpr", "syphilis"], reply: "HIV negative at 12 and 24 weeks. Syphilis negative. Blood group O positive." },
      { id: "prev", chip: "Any previous pregnancies or early births in the family?", critical: false,
        keywords: ["previous", "before", "first", "family", "early"], reply: "This is my first. My sister had her baby at 34 weeks." }
    ],
    fallback: "Sorry, I didn't understand. Ask me again?"
  },

  examTitle: "Examine her",
  examLead: "With her consent. The finding appears when you perform each examination.",
  exam: [
    { id: "abdo", label: "Abdominal examination and fundal height", essential: true, finding: "Fundal height 30 cm. Cephalic presentation. Contractions palpable. Right renal angle tender." },
    { id: "spec", label: "Sterile speculum examination", essential: true, finding: "No pooling of liquor. Cervix looks open about 3 cm. Pink mucus." },
    { id: "ve", label: "Vaginal examination", essential: true, finding: "Cervix 3 cm dilated, 70% effaced. Membranes intact. Head 3/5 above the brim." },
    { id: "chest", label: "Chest", essential: false, finding: "Clear." }
  ],

  triage: {
    title: "Where should this baby be born?",
    question: "She is in established preterm labour at 31 weeks. The MOU has no neonatal unit. Decide",
    vitals: [
      { label: "Gestation", value: "31+2", unit: "weeks", flag: "high" },
      { label: "Cervix", value: "3 cm, effaced", unit: "", flag: "high" },
      { label: "Temperature", value: "37.9", unit: "°C", flag: "high" },
      { label: "Fetal HR", value: "152", unit: "/min" }
    ],
    look: "Thembeka is gripping the bed rail. “Can't I just have him here? Everyone knows me here.”",
    options: [
      { id: "transfer", label: "In-utero transfer", detail: "Start steroids, magnesium, a tocolytic and antibiotics now; priority transfer to the hospital with a neonatal unit, with a midwife escort", score: 100 },
      { id: "here", label: "Deliver at the MOU", detail: "She is booked here; transfer the baby after the birth if needed", score: 10, critical: "Planned a 31-week birth at a facility with no neonatal unit." },
      { id: "home", label: "Send home", detail: "Probably false labour; return if the pains get worse", score: 0, critical: "Sent home a woman in established preterm labour." },
      { id: "plain", label: "Transfer without treatment", detail: "Call the ambulance; the hospital will start the medicines", score: 40, critical: "Delayed antenatal steroids and magnesium until after transfer." }
    ],
    feedback: "The safest transport for a 31-week baby is inside its mother. Transfer her to a hospital with a neonatal unit, but start the steroids, magnesium for neuroprotection, a tocolytic to buy time, and antibiotics for the infection before she leaves."
  },

  tests: [
    { id: "mcs", label: "Urine microscopy, culture and sensitivity", group: "Urine", essential: true },
    { id: "fbc", label: "Full blood count", group: "Blood", essential: true },
    { id: "ue", label: "Kidney function", group: "Blood", essential: false, appropriate: true },
    { id: "us", label: "Ultrasound: growth, presentation, liquor", group: "Imaging", essential: true },
    { id: "ctg", label: "CTG (fetal heart monitoring)", group: "Monitoring", essential: true },
    { id: "hvs", label: "High vaginal swab", group: "Swabs", essential: false, appropriate: false, why: "Her membranes are intact and the urine explains the infection. It doesn't change today's plan." },
    { id: "xray", label: "Chest X-ray", group: "Imaging", essential: false, appropriate: false, why: "Her chest is clear. Radiation and delay for nothing." }
  ],

  results: {
    turnaround: "Results at the hospital within hours (simulated); urine culture in 48 hours.",
    reports: {
      mcs: { title: "Urine", rows: [
        { analyte: "White cells", value: "> 100", unit: "/µL", range: "< 10", flag: "H", key: "uwbc" },
        { analyte: "Culture", value: "E. coli, sensitive to ceftriaxone", unit: "", range: "No growth", flag: "H", key: "ecoli" } ]},
      fbc: { title: "Full blood count", rows: [
        { analyte: "White cells", value: "14.2", unit: "×10⁹/L", range: "4.0–11.0 (higher in pregnancy)", flag: "H", key: "wcc" },
        { analyte: "Haemoglobin", value: "11.4", unit: "g/dL", range: "≥ 11.0", flag: "" } ]},
      ue: { title: "Kidney function", rows: [ { analyte: "Creatinine", value: "58", unit: "µmol/L", range: "35–70 in pregnancy", flag: "" } ]},
      us: { title: "Ultrasound", rows: [
        { analyte: "Estimated fetal weight", value: "1 480 g", unit: "", range: "Appropriate for 31 weeks", flag: "", key: "efw" },
        { analyte: "Presentation", value: "Cephalic", unit: "", range: "", flag: "" },
        { analyte: "Liquor", value: "Normal", unit: "", range: "Normal", flag: "" } ]},
      ctg: { title: "CTG", text: "Baseline 150, good variability, accelerations present, no decelerations. Regular contractions every 3–4 minutes." },
      hvs: { title: "High vaginal swab", text: "Normal flora. (Result after the baby was born.)" },
      xray: { title: "Chest X-ray", text: "Normal." }
    },
    significant: ["uwbc", "ecoli", "wcc", "efw"],
    criticalNote: ""
  },

  diagnosis: {
    options: [
      { id: "ptl", label: "Established preterm labour at 31 weeks, probably triggered by acute pyelonephritis", score: 100 },
      { id: "false", label: "Braxton Hicks (false labour) with a urine infection", score: 10 },
      { id: "pprom", label: "Preterm prelabour rupture of membranes", score: 10 },
      { id: "abruption", label: "Placental abruption", score: 10 }
    ],
    explain: "Regular painful contractions with a cervix that is 3 cm dilated and effaced at 31 weeks is established preterm labour. Fever, right-sided back pain, a tender renal angle and E. coli in the urine point to pyelonephritis, a common and treatable trigger."
  },

  medicationChart: {
    intro: "Medicines to give at the MOU before transfer. Check every line.",
    lines: [
      { id: "dexa", drug: "Dexamethasone", order: "6 mg orally 12-hourly, 4 doses (fetal lung maturity)", error: true,
        why: "Antenatal dexamethasone for fetal lung maturity is given IM, not orally. Give 6 mg IM 12-hourly for 4 doses (or betamethasone IM per local protocol)." },
      { id: "nif", drug: "Nifedipine", order: "10 mg sublingually, repeat every 15 minutes", error: true,
        why: "Nifedipine must be swallowed, never given sublingually: sublingual nifedipine can drop the blood pressure suddenly and reduce blood flow to the baby." },
      { id: "mg", drug: "Magnesium sulfate", order: "4 g IV over 20 minutes for fetal neuroprotection (under 32 weeks)", error: false },
      { id: "cef", drug: "Ceftriaxone", order: "1 g IV daily (pyelonephritis)", error: false },
      { id: "para", drug: "Paracetamol", order: "1 g orally 6-hourly for fever", error: false }
    ]
  },

  management: {
    options: [
      { id: "steroids", label: "First dose of antenatal corticosteroids before she leaves", kind: "critical" },
      { id: "transfer", label: "Priority in-utero transfer to a hospital with a neonatal unit, with an escort and a written handover", kind: "critical" },
      { id: "abx", label: "Treat the pyelonephritis with IV antibiotics", kind: "critical" },
      { id: "mg", label: "Magnesium sulfate for fetal neuroprotection (under 32 weeks)", kind: "essential" },
      { id: "toco", label: "A tocolytic (oral nifedipine) to allow time for the steroids and the transfer", kind: "essential" },
      { id: "neo", label: "Phone the neonatal team so they are ready at the birth", kind: "essential" },
      { id: "explain", label: "Explain to her what will happen to the baby: warmth, breathing support, kangaroo care, breast milk", kind: "essential" },
      { id: "here", label: "Keep her at the MOU and see if labour stops", kind: "harmful", critical: "Kept a woman in preterm labour at a facility with no neonatal unit." },
      { id: "long", label: "Continue tocolysis for a week to keep her pregnant longer", kind: "harmful", critical: "Used prolonged tocolysis, which has no benefit and adds risk." },
      { id: "home", label: "Send her home on oral antibiotics if the contractions settle", kind: "harmful", critical: "Sent home a woman with pyelonephritis in preterm labour." }
    ]
  },

  drills: {
    smallbaby: {
      domain: "newborn",
      title: "The first hour of a small baby",
      intro: "Despite the medicines, labour continued. Lwazi is born at the hospital at 21:40, 1.45 kg, crying weakly, with a grunt on every breath. He is wet on his mother's abdomen. The room is 24 °C.",
      opening: "Born at 31 weeks, wet, grunting.",
      clockStart: 0,
      meter: { label: "Baby's temperature", unit: "°C", start: 36.6, rate: -0.006, fmt: function (v) { return v.toFixed(1); } },
      alarm: function (r) { return r.meter < 36.5; },
      status: function (r, did) { return did(r, "cpap") ? "On CPAP · breathing easier" : "Grunting and indrawing"; },
      hint1: "A wet preterm baby loses heat fast. Warmth first, then breathing.",
      actions: [
        { id: "wrap", group: "Warmth", label: "Dry the head only; put the body, still wet, into a plastic bag up to the neck; hat on; radiant warmer", cost: 15, rate: 0.001, text: "Lwazi is in a plastic wrap with a hat, under the warmer." },
        { id: "cord", group: "Warmth", label: "Delay cord clamping for 60 seconds while he breathes", cost: 60, text: "The cord is clamped after a minute." },
        { id: "bath", group: "Warmth", label: "Bathe and weigh him first", cost: 60, rate: -0.02, harmful: "Bathed a preterm baby in the first hour, causing heat loss.", text: "He is cold and blue at the edges after the bath." },
        { id: "assess", group: "Breathing", label: "Assess breathing: rate, grunting, chest indrawing, SpO₂", cost: 15, text: "Breathing 68 a minute, grunting, mild chest indrawing. SpO₂ 88%." },
        { id: "cpap", group: "Breathing", label: "Start CPAP at 5–6 cm H₂O", cost: 30, text: "The grunting eases. SpO₂ 93% in 30% oxygen." },
        { id: "suction", group: "Breathing", label: "Suction deeply and repeatedly", cost: 20, harmful: "Suctioned a breathing preterm baby repeatedly.", text: "His heart rate drops while you suction." },
        { id: "temp", group: "Checks", label: "Check his temperature", cost: 10, text: function (r) { return "Temperature " + r.meter.toFixed(1) + " °C." + (r.meter < 36.5 ? " He is getting cold." : ""); } },
        { id: "gluc", group: "Checks", label: "Check his blood glucose", cost: 30, text: "Glucose 2.9 mmol/L." },
        { id: "vitk", group: "Checks", label: "Vitamin K IM (preterm dose)", cost: 10, text: "Vitamin K given." },
        { id: "milk", group: "Feeding", label: "Help his mother hand-express colostrum in the first hour; give it by tube", cost: 30, text: "Thembeka expresses 1 mL of colostrum. It goes down his tube." },
        { id: "incubator", group: "Feeding", label: "Move to a warm incubator in the neonatal unit; skin-to-skin as soon as he is stable", cost: 20, rate: 0.002, text: "In a warm incubator. Thembeka is told she can start skin-to-skin once he is stable." },
        { id: "handover", group: "Hand over", label: "Hand over to the neonatal team", cost: 0, end: true, text: "Handover given." }
      ],
      events: [
        { t: 60, when: function (r) { return !r.done.wrap; }, text: "He is wet and cooling under the air-conditioner." }
      ],
      rules: {
        essential: [
          { id: "wrap", by: 30, critical: "Did not keep a preterm baby warm at birth.", late: "Thermal care was late" },
          { id: "assess" },
          { id: "cpap", by: 300, critical: "Did not start CPAP for a preterm baby in respiratory distress." },
          { id: "temp" }, { id: "gluc" }, { id: "vitk" },
          { id: "milk", critical: "Did not start early breast milk for a preterm baby." },
          { id: "incubator" }
        ]
      },
      meterNote: function (r) { return r.meter < 36.5 ? "Lwazi's temperature fell to " + r.meter.toFixed(1) + " °C. Hypothermia raises the risk of death in small babies; keep him above 36.5 °C." : ""; },
      outcome: function (r) { return "Lwazi is in the neonatal unit on CPAP, temperature " + r.meter.toFixed(1) + " °C."; },
      demo: ["wrap", "cord", "assess", "cpap", "temp", "gluc", "vitk", "milk", "incubator", "handover"],
      teach: "The small baby in the first hour: warmth (plastic wrap, hat, warmer, no bath), CPAP for grunting and indrawing, glucose, vitamin K, and colostrum within the hour. Then kangaroo mother care as soon as he is stable.",
      next: "Day 3"
    }
  },

  followupPick: function () { return this.followup; },
  followup: {
    time: "Day 5, in the kangaroo care ward",
    situation: "The nurse calls you: Lwazi stopped breathing twice in the last hour and needed stimulation. He is pale, his temperature is 35.9 °C, and he hasn't wanted his feeds since this morning.",
    options: [
      { id: "sepsis", label: "Possible neonatal sepsis: stimulate and support breathing, warm him, check glucose, take a blood culture, start IV antibiotics, and call the doctor", correct: true },
      { id: "normal", label: "Apnoea is normal in preterm babies; keep feeding him", correct: false },
      { id: "formula", label: "Switch to formula: he isn't tolerating breast milk", correct: false },
      { id: "warm", label: "Just warm him up and recheck tomorrow", correct: false }
    ],
    explain: "New apnoea, temperature instability and poor feeding in a preterm baby are sepsis until proven otherwise. Treat promptly: support, warmth, glucose, a blood culture and antibiotics."
  },

  extraFeedback: function () { return []; },
  exampleErrors: ["Planned a 31-week birth at a facility with no neonatal unit.", "Missed a prescribing error: Nifedipine, 10 mg sublingually, repeat every 15 minutes.", "Did not keep a preterm baby warm at birth."],

  learningPoints: [
    "Look for a cause of preterm labour: a urine infection is common and treatable.",
    "The best transport for a preterm baby is inside the mother: in-utero transfer to a hospital with a neonatal unit.",
    "Before transfer: antenatal steroids (IM), magnesium under 32 weeks, oral nifedipine to buy time, and antibiotics for infection.",
    "Never give nifedipine sublingually.",
    "First hour of the small baby: warmth, CPAP, glucose, vitamin K, colostrum. No bath.",
    "Kangaroo mother care and breast milk save small babies. Remove blame from the mother.",
    "Apnoea, temperature instability and poor feeding in a preterm baby: think sepsis."
  ]
});

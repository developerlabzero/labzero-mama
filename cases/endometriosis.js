/*
 * LabZero Mama case: "Fifth time for the same pain"
 * Content licence: CC BY 4.0 (see CONTENT_LICENSE.md). Code licence: MIT.
 *
 * FICTIONAL TRAINING CASE. Not for clinical use.
 * Clinical content is pending review by a qualified gynaecologist.
 */
window.MAMA_CASES = window.MAMA_CASES || [];
window.MAMA_CASES.push({
  id: "endometriosis-27",
  version: "0.1.0",
  status: "Draft: pending clinical validation",
  title: "Fifth time for the same pain",
  family: "Gynaecology: endometriosis",
  why: "Endometriosis affects many women of reproductive age and is often dismissed as normal period pain, so diagnosis can take years. Taking pain seriously at clinic level shortens that delay and protects fertility.",
  setting: "Ikhwezi Community Health Centre, then the regional hospital gynaecology clinic",
  patient: { name: "Ayanda Ndlovu", age: 27, obstetric: "Admin clerk. Trying to conceive for 2 years", arrival: "Ticket 019 · in the queue since 06:40" },
  opening: "Period pain again. I know they'll just give me Panado.",
  steps: ["records", "vitals", "history", "exam", "triage", "tests", "results", "diagnosis", "meds", "manage", "followup"],
  stepLabels: { records: "File room", vitals: "Vitals", history: "Doctor", exam: "Examine", triage: "Decision" },
  stepSettings: {
    records: "Ikhwezi CHC · file room", vitals: "Ikhwezi CHC · nurse's vitals station",
    history: "Ikhwezi CHC · doctor's consulting room", exam: "Ikhwezi CHC · doctor's consulting room",
    triage: "Ikhwezi CHC · deciding what happens next",
    tests: "Regional hospital · gynaecology clinic, six weeks later", results: "Regional hospital · gynaecology clinic",
    diagnosis: "Regional hospital · gynaecology clinic", meds: "Regional hospital · gynaecology clinic",
    manage: "Regional hospital · gynaecology clinic", followup: "Back at Ikhwezi CHC · while waiting for surgery"
  },
  domains: [
    { id: "experience", label: "Patient experience" }, { id: "vitals", label: "Nurse vitals" },
    { id: "history", label: "History taking" }, { id: "assessment", label: "Examination" },
    { id: "prioritisation", label: "Clinic decision" }, { id: "investigations", label: "Test selection" },
    { id: "interpretation", label: "Result interpretation" }, { id: "diagnosis", label: "Diagnosis" },
    { id: "medication", label: "Medication safety" }, { id: "management", label: "Management" },
    { id: "monitoring", label: "Monitoring and response" }
  ],

  monitor: function (s) {
    var fu = s.stepId === "followup" || s.stepId === "debrief";
    return [
      { k: "Pain", v: fu ? "9/10" : "8/10", u: "score", alert: true },
      { k: "Hb", v: "10.9", u: "g/dL", alert: true },
      { k: "HR", v: fu ? "112" : "88", u: "/min", alert: fu },
      { k: "BP", v: fu ? "96/60" : "118/76", u: "mmHg", alert: fu }
    ];
  },

  file: {
    title: "Clinic folder (five previous visits)",
    entries: [
      "2023-03: Period pain. Paracetamol.",
      "2024-01: Period pain, missed work. Ibuprofen.",
      "2024-11: Lower abdominal pain. “PID?” Doxycycline and metronidazole. No tests done.",
      "2025-08: Severe period pain. Ibuprofen. “Reassured.”",
      "2026-06: Pain, asked for a referral. “Return if worse.”"
    ]
  },

  scenes: {
    records: {
      title: "The file room",
      lead: "Ayanda's folder is easy to find. It is the thickest on the shelf.",
      turns: [
        { speaker: "Mrs Dube (clerk)", line: "Ndlovu, here. Same thing every time, period pain. Quick Panado and she's done.",
          options: [
            { text: "Let's read it first. Five visits for the same pain is a pattern the doctor must see.", score: 100, reply: "Mrs Dube raises an eyebrow and hands over the folder." },
            { text: "Put the old visits aside; just today's page.", score: 20, reply: "The history goes into a drawer." },
            { text: "She's a regular. Quick Panado.", score: 0, flag: "Dismissed recurrent pelvic pain as routine.", reply: "Ayanda hears this from the bench." }
          ]},
        { speaker: "Ayanda", line: "Every time they say it's normal. I miss work. My boyfriend's family says I'm barren.",
          options: [
            { text: "Pain that stops you working is not normal. We'll look into it properly today.", score: 100, reply: "Her eyes fill with tears. “Thank you.”" },
            { text: "Let's not talk about family matters here.", score: 20, reply: "She goes quiet." },
            { text: "Every woman has pain, sisi.", score: 0, flag: "Told a woman her severe pain was normal.", reply: "She looks at the floor." }
          ]}
      ]
    }
  },

  vitals: [
    { id: "bp", label: "Blood pressure", value: "118/76", unit: "mmHg", abnormal: false, essential: true, line: "At least that's normal." },
    { id: "pulse", label: "Pulse", value: "88", unit: "/min", abnormal: false, essential: false, line: "It's the pain making my heart go." },
    { id: "temp", label: "Temperature", value: "36.6", unit: "°C", abnormal: false, essential: true, line: "No fever. It's never a fever." },
    { id: "weight", label: "Weight", value: "64", unit: "kg (BMI 24.4)", abnormal: false, essential: false, line: "Don't tell me to lose weight, please." },
    { id: "glucose", label: "Finger-prick glucose", value: "5.1", unit: "mmol/L", abnormal: false, essential: false, line: "Okay." },
    { id: "urine", label: "Urine dipstick", value: "Normal", unit: "", abnormal: false, essential: false, line: "It burns a bit when I wee during my period." },
    { id: "preg", label: "Urine pregnancy test", value: "Negative", unit: "", abnormal: false, essential: true, line: "Negative again. Two years of negative." },
    { id: "hb", label: "Haemoglobin (finger prick)", value: "10.9", unit: "g/dL", abnormal: true, essential: true, line: "My periods are so heavy. I use eight pads a day." }
  ],

  history: {
    speaker: "Ayanda", speakerRole: "the patient", title: "The doctor's consultation",
    prompt: "You are the clinic doctor. Ask in your own words. She answers only from her approved case script.",
    intents: [
      { id: "pain", chip: "Tell me about the pain.", critical: true,
        keywords: ["pain", "hurt", "cramps", "where", "describe", "how bad", "severity"],
        reply: "Low in my belly and my back. It starts two days before my period and lasts the whole week. It's 8 out of 10. Some months I faint." },
      { id: "sex", chip: "Is sex painful?", critical: true,
        keywords: ["sex", "intercourse", "deep", "partner", "boyfriend", "dyspareunia"],
        reply: "Yes, deep inside. I avoid it now, and he thinks I don't love him." },
      { id: "fertility", chip: "Are you trying to fall pregnant?", critical: true,
        keywords: ["pregnant", "pregnancy", "baby", "children", "conceive", "fertility", "trying"],
        reply: "For two years. Nothing. His family says I'm barren." },
      { id: "periods", chip: "How heavy are your periods?", critical: true,
        keywords: ["periods", "bleeding", "heavy", "pads", "flow", "menstruation", "cycle"],
        reply: "Very heavy. Eight pads a day for the first three days, with clots." },
      { id: "bowel", chip: "Any pain with your bowels or bladder?", critical: false,
        keywords: ["bowel", "toilet", "stool", "poo", "bladder", "wee", "urine", "constipation"],
        reply: "It hurts to open my bowels during my period. Sometimes it burns when I wee then too." },
      { id: "onset", chip: "When did the pain start?", critical: false,
        keywords: ["start", "began", "when", "how long", "since"], reply: "Since I was about 15. But it's much worse in the last three years." },
      { id: "treatment", chip: "What has helped so far?", critical: false,
        keywords: ["helped", "tried", "tablets", "panado", "ibuprofen", "treatment", "medicine"],
        reply: "Ibuprofen helps a little. Panado does nothing. Once they gave me antibiotics for an infection, but it didn't change anything." },
      { id: "family", chip: "Does anyone in your family have similar pain?", critical: false,
        keywords: ["family", "mother", "sister", "aunt", "runs in"], reply: "My mother had terrible periods. She had a hysterectomy at 38." },
      { id: "sti", chip: "Any discharge or sexually transmitted infections?", critical: false,
        keywords: ["discharge", "sti", "std", "infection", "smell"], reply: "No discharge. I tested negative for HIV and STIs at the last campaign." },
      { id: "work", chip: "How does this affect your life?", critical: false,
        keywords: ["work", "life", "affect", "job", "miss", "days off"], reply: "I miss three days of work every month. My manager gave me a warning." }
    ],
    fallback: "Sorry, I don't understand. Ask me another way."
  },

  examTitle: "Examine her",
  examLead: "With her consent and a chaperone present. The finding appears when you perform each examination.",
  exam: [
    { id: "abdomen", label: "Abdominal examination", essential: true, finding: "Tender in both iliac fossae. No guarding. No palpable mass above the pelvis." },
    { id: "speculum", label: "Speculum examination", essential: true, finding: "Cervix looks healthy. No discharge. Blue-black spots in the posterior fornix." },
    { id: "bimanual", label: "Bimanual examination", essential: true, finding: "Fixed, tender retroverted uterus. Tender nodules behind the cervix. Tender left adnexal mass about 5 cm." },
    { id: "pallor", label: "Check for pallor", essential: false, finding: "Mild conjunctival pallor." },
    { id: "breast", label: "Breast examination", essential: false, finding: "Normal." }
  ],

  triage: {
    title: "What happens next?",
    question: "You are the clinic doctor. Decide her next step",
    vitals: [
      { label: "Pain", value: "8/10, cyclical", unit: "", flag: "high" },
      { label: "Hb", value: "10.9", unit: "g/dL", flag: "high" },
      { label: "Pelvic mass", value: "Left, ~5 cm", unit: "", flag: "high" },
      { label: "Infertility", value: "2 years", unit: "" }
    ],
    look: "Ayanda is dressed again and waiting. “Please don't send me home with Panado again.”",
    options: [
      { id: "refer", label: "Refer to gynaecology", detail: "Referral letter to the hospital gynaecology clinic describing the pattern, the mass and infertility; start an anti-inflammatory and iron today", score: 100 },
      { id: "casualty", label: "Ambulance to casualty", detail: "Send her to the hospital emergency unit now", score: 30 },
      { id: "pid", label: "Treat as PID again", detail: "Doxycycline and metronidazole, review in two weeks", score: 10, critical: "Treated presumptively for PID again without testing, delaying the real diagnosis." },
      { id: "reassure", label: "Reassure", detail: "Explain that period pain is normal and give paracetamol", score: 0, critical: "Dismissed probable endometriosis with a pelvic mass as normal period pain." }
    ],
    feedback: "Cyclical pelvic pain, deep pain during sex, painful bowel movements during periods, infertility, a fixed uterus with nodules and an adnexal mass strongly suggest endometriosis with an ovarian endometrioma. She is stable, so a well-written referral to gynaecology, plus pain relief and iron, is right."
  },

  tests: [
    { id: "tvus", label: "Transvaginal ultrasound", group: "Imaging", essential: true },
    { id: "fbc", label: "Full blood count and iron studies", group: "Blood", essential: true },
    { id: "bhcg", label: "Serum beta-hCG", group: "Blood", essential: false, appropriate: true },
    { id: "sti", label: "Chlamydia and gonorrhoea test (NAAT)", group: "Swabs", essential: false, appropriate: true },
    { id: "ca125", label: "CA-125", group: "Blood", essential: false, appropriate: false, why: "It is often raised in endometriosis, so it does not confirm or exclude it and does not change management here." },
    { id: "mri", label: "MRI pelvis", group: "Imaging", essential: false, appropriate: false, why: "Not first-line; ultrasound and laparoscopy answer the question." },
    { id: "ct", label: "CT abdomen", group: "Imaging", essential: false, appropriate: false, why: "Poor for pelvic organs and adds radiation." }
  ],

  results: {
    turnaround: "Ultrasound done in the clinic; blood results the same day (simulated).",
    reports: {
      tvus: { title: "Transvaginal ultrasound", rows: [
        { analyte: "Left ovary", value: "52 mm cyst, ground-glass echoes", unit: "", range: "No cyst", flag: "H", key: "cyst" },
        { analyte: "Uterus", value: "Retroverted, fixed, normal size", unit: "", range: "Mobile", flag: "H", key: "fixed" },
        { analyte: "Right ovary", value: "Normal", unit: "", range: "Normal", flag: "" } ]},
      fbc: { title: "Full blood count and iron studies", rows: [
        { analyte: "Haemoglobin", value: "10.8", unit: "g/dL", range: "12.0–15.0", flag: "L", key: "hb" },
        { analyte: "MCV", value: "74", unit: "fL", range: "80–100", flag: "L", key: "mcv" },
        { analyte: "Ferritin", value: "8", unit: "µg/L", range: "15–150", flag: "L", key: "ferr" },
        { analyte: "Platelets", value: "312", unit: "×10⁹/L", range: "150–400", flag: "" } ]},
      bhcg: { title: "Beta-hCG", rows: [ { analyte: "Beta-hCG", value: "< 5", unit: "IU/L", range: "< 5 (not pregnant)", flag: "" } ]},
      sti: { title: "STI test", rows: [ { analyte: "Chlamydia and gonorrhoea", value: "Not detected", unit: "", range: "Not detected", flag: "", key: "stineg" } ]},
      ca125: { title: "CA-125", rows: [ { analyte: "CA-125", value: "62", unit: "U/mL", range: "< 35", flag: "H" } ]},
      mri: { title: "MRI pelvis", text: "Left ovarian endometrioma. Posterior deep endometriosis. (Waited 4 months for a slot.)" },
      ct: { title: "CT abdomen", text: "Left adnexal cyst. Otherwise unremarkable." }
    },
    significant: ["cyst", "fixed", "hb", "mcv", "ferr"],
    criticalNote: ""
  },

  diagnosis: {
    options: [
      { id: "endo", label: "Endometriosis with a left ovarian endometrioma, with iron-deficiency anaemia", score: 100 },
      { id: "fibroids", label: "Uterine fibroids", score: 20 },
      { id: "pid", label: "Chronic pelvic inflammatory disease", score: 20 },
      { id: "ovca", label: "Ovarian cancer", score: 10 },
      { id: "ibs", label: "Irritable bowel syndrome", score: 0 },
      { id: "primary", label: "Primary dysmenorrhoea; nothing abnormal", score: 0 }
    ],
    explain: "Cyclical pain since adolescence that is getting worse, deep pain during sex, painful bowel movements during periods, infertility, a fixed retroverted uterus with nodules, and an ovarian cyst with ground-glass echoes are typical of endometriosis with an endometrioma. Heavy bleeding has caused iron-deficiency anaemia. A negative STI test makes PID unlikely. Laparoscopy confirms the diagnosis and allows treatment."
  },

  medicationChart: {
    intro: "Gynaecology clinic prescription. Check every line.",
    lines: [
      { id: "ibu", drug: "Ibuprofen", order: "400 mg three times a day with meals, during periods", error: false },
      { id: "iron", drug: "Ferrous sulphate", order: "200 mg once daily", error: false },
      { id: "tram", drug: "Tramadol", order: "100 mg four times a day for 3 months", error: true,
        why: "Long-term opioids are not recommended for endometriosis pain; they cause dependence and do not treat the disease." },
      { id: "dox", drug: "Doxycycline and metronidazole", order: "14-day course for PID", error: true,
        why: "Her STI test is negative and there is no evidence of PID. Repeated antibiotic courses delay the real treatment." }
    ]
  },

  management: {
    options: [
      { id: "validate", label: "Believe her pain and explain endometriosis to her in plain language", kind: "critical" },
      { id: "laparoscopy", label: "Book a laparoscopy to confirm the diagnosis and remove the endometrioma, planned around her wish to conceive", kind: "critical" },
      { id: "treat", label: "Treat the pain and the anaemia (anti-inflammatory, iron)", kind: "critical" },
      { id: "fertility", label: "Refer to the fertility clinic if she is not pregnant 6–12 months after surgery", kind: "essential" },
      { id: "letter", label: "Give her a letter for her employer explaining her condition", kind: "essential" },
      { id: "support", label: "Offer counselling for her and her partner", kind: "essential" },
      { id: "hysterectomy", label: "Recommend a hysterectomy now", kind: "harmful", critical: "Recommended a hysterectomy to a 27-year-old who wants children." },
      { id: "tough", label: "Tell her to be strong; all women have pain", kind: "harmful", critical: "Dismissed her pain after the diagnosis was made." },
      { id: "opioids", label: "Long-term opioids for the pain", kind: "harmful", critical: "Started long-term opioids for endometriosis pain." },
      { id: "nothing", label: "No follow-up needed until she falls pregnant", kind: "harmful", critical: "Left an ovarian endometrioma without a plan." }
    ]
  },

  followupPick: function () { return this.followup; },
  followup: {
    time: "Five weeks later, still waiting for surgery",
    situation: "Ayanda comes back to the clinic doubled over. The pain started suddenly an hour ago on the left, with vomiting. Pulse 112. BP 96/60. Her abdomen is tender and guarded on the left.",
    options: [
      { id: "emergency", label: "Emergency: IV access and fluids, pain relief, call the gynaecology registrar, and transfer by ambulance (possible ovarian torsion or cyst rupture)", correct: true },
      { id: "wait", label: "Give pain relief and tell her to wait for her booked surgery date", correct: false },
      { id: "period", label: "Explain this is probably a bad period", correct: false },
      { id: "antibiotics", label: "Start antibiotics for PID and review tomorrow", correct: false }
    ],
    explain: "Sudden severe one-sided pain with vomiting, tachycardia and low blood pressure in a woman with a known ovarian cyst may be torsion or rupture. Both are surgical emergencies; torsion can cost her the ovary within hours."
  },

  extraFeedback: function () { return []; },
  exampleErrors: ["Dismissed recurrent pelvic pain as routine.", "Treated presumptively for PID again without testing, delaying the real diagnosis."],

  learningPoints: [
    "Period pain that stops a woman working, with deep pain during sex or painful bowel movements, is not normal. Think endometriosis.",
    "Read the folder: repeated visits for the same pain are a diagnosis waiting to be made.",
    "Do not keep treating for PID without testing.",
    "Plan treatment around the woman's fertility goals.",
    "Sudden one-sided pain with a known ovarian cyst is an emergency (torsion or rupture)."
  ]
});

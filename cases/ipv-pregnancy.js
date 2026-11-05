/*
 * LabZero Mama case: "Just headaches"
 * Content licence: CC BY 4.0 (see CONTENT_LICENSE.md). Code licence: MIT.
 *
 * FICTIONAL TRAINING CASE. Not for clinical use.
 * Clinical and legal content is pending review by a clinician experienced in
 * gender-based violence care, and must be checked against current South African
 * guidelines and legislation. The case teaches recognition, safe disclosure,
 * danger assessment and safety planning. It contains no graphic detail.
 */
window.MAMA_CASES = window.MAMA_CASES || [];
window.MAMA_CASES.push({
  id: "ipv-pregnancy",
  version: "0.1.0",
  status: "Draft: pending clinical validation",
  title: "Just headaches",
  family: "Safety and protection: intimate partner violence",
  why: "Gender-based violence is widespread in South Africa, and pregnancy can increase the risk. Women rarely disclose unless a health worker asks privately and safely. Strangulation is a strong warning sign of serious harm.",
  support: "If this case raises something for you, talk to someone you trust. In South Africa, the GBV Command Centre is 0800 428 428.",
  setting: "Ikhwezi Community Health Centre, then the district hospital",
  patient: { name: "Zanele Mahlangu", age: 29, obstetric: "Cashier at a supermarket. Lives with her partner", arrival: "Ticket 027 · in the queue since 07:05" },
  opening: "Just headaches. And I can't sleep. I need something so I can get back to work.",
  steps: ["records", "vitals", "history", "exam", "tests", "results", "triage", "diagnosis", "meds", "manage", "followup"],
  stepLabels: { records: "File room", vitals: "Vitals", history: "Doctor", exam: "Examine", tests: "Assess", results: "Findings", triage: "Decision" },
  stepSettings: {
    records: "Ikhwezi CHC · file room", vitals: "Ikhwezi CHC · nurse's vitals station",
    history: "Ikhwezi CHC · doctor's consulting room, door closed", exam: "Ikhwezi CHC · doctor's consulting room",
    tests: "Ikhwezi CHC · same consultation", results: "Ikhwezi CHC · same consultation",
    triage: "Ikhwezi CHC · deciding what happens next with her",
    diagnosis: "District hospital · same day", meds: "District hospital · same day",
    manage: "District hospital · with the social worker", followup: "Ikhwezi CHC · two weeks later"
  },
  domains: [
    { id: "experience", label: "Patient experience" }, { id: "vitals", label: "Nurse vitals" },
    { id: "history", label: "Safe enquiry" }, { id: "assessment", label: "Examination and documentation" },
    { id: "investigations", label: "Assessment choices" }, { id: "interpretation", label: "Interpreting findings" },
    { id: "prioritisation", label: "Danger and next steps" }, { id: "diagnosis", label: "Diagnosis" },
    { id: "medication", label: "Medication safety" }, { id: "management", label: "Safety plan and care" },
    { id: "monitoring", label: "Follow-up response" }
  ],

  monitor: function (s) {
    var idx = this.steps.indexOf(s.stepId);
    var tested = s.vitalsTaken.indexOf("preg") !== -1;
    return [
      { k: "HR", v: "104", u: "/min", alert: true },
      { k: "BP", v: "132/86", u: "mmHg", alert: false },
      { k: "Pregnant", v: tested ? "Yes" : "?", u: tested ? "~6 weeks" : "", alert: tested },
      { k: "Danger", v: idx > this.steps.indexOf("results") || s.stepId === "debrief" ? "High" : "?", u: "", alert: idx > this.steps.indexOf("results") }
    ];
  },

  file: {
    title: "Clinic folder",
    entries: [
      "2025-09: “Fell down the stairs.” Bruised ribs. Paracetamol.",
      "2026-02: “Walked into a cupboard door.” Cut eyebrow, sutured.",
      "2026-07: Headache. Paracetamol.",
      "No one has documented asking about safety at home."
    ]
  },

  scenes: {
    records: {
      title: "The file room",
      lead: "Mrs Dube finds the folder quickly. She has something to say.",
      turns: [
        { speaker: "Mrs Dube (clerk)", line: "Mahlangu? Her boyfriend phoned the clinic this morning asking if she's here. I told him yes, she's in the queue.",
          options: [
            { text: "Please never confirm a patient's visit to anyone. I'll tell the nurse quietly so she can be seen safely.", score: 100, reply: "Mrs Dube looks uncomfortable. “Sorry. I didn't think.”" },
            { text: "Never mind, it's done.", score: 20, reply: "The folder is passed on without a word about it." },
            { text: "That's fine; he's her partner.", score: 0, flag: "Accepted the disclosure of a patient's visit to her partner.", reply: "Mrs Dube nods and moves on." }
          ]},
        { speaker: "Zanele", line: "He phoned? I must go. I must go now.",
          options: [
            { text: "You're safe here. Let's go to a private room and talk. You can leave whenever you choose.", score: 100, reply: "She hesitates, then follows you." },
            { text: "Why are you scared of your boyfriend?", score: 20, reply: "People on the bench turn to look. She freezes." },
            { text: "Then go, and come back another day.", score: 0, flag: "Let a frightened woman leave without assessing her safety.", reply: "She leaves. She comes back the next morning." }
          ]}
      ]
    }
  },

  vitals: [
    { id: "bp", label: "Blood pressure", value: "132/86", unit: "mmHg", abnormal: false, essential: true,
      line: "(As you push up her sleeve for the cuff, you see bruises of different colours on her forearm. She pulls the sleeve down quickly.) “I bump into things at work.”" },
    { id: "pulse", label: "Pulse", value: "104", unit: "/min", abnormal: true, essential: true, line: "I'm just stressed." },
    { id: "temp", label: "Temperature", value: "36.7", unit: "°C", abnormal: false, essential: false, line: "No fever." },
    { id: "weight", label: "Weight", value: "58", unit: "kg", abnormal: false, essential: false, line: "Fine." },
    { id: "glucose", label: "Finger-prick glucose", value: "5.0", unit: "mmol/L", abnormal: false, essential: false, line: "I had tea." },
    { id: "urine", label: "Urine dipstick", value: "Normal", unit: "", abnormal: false, essential: false, line: "Okay." },
    { id: "preg", label: "Urine pregnancy test", value: "Positive", unit: "", abnormal: true, essential: true, line: "Positive? Oh no. He can't know yet." },
    { id: "hb", label: "Haemoglobin (finger prick)", value: "12.1", unit: "g/dL", abnormal: false, essential: false, line: "Okay." }
  ],

  history: {
    speaker: "Zanele", speakerRole: "the patient", title: "The doctor's consultation",
    prompt: "You are the clinic doctor. She is alone with you and the door is closed. Ask gently and directly. She answers only from her approved case script.",
    intents: [
      { id: "safety", chip: "Do you feel safe at home?", critical: true,
        keywords: ["safe", "safety", "home", "hurt you", "hit", "hits", "violence", "abuse", "afraid", "scared"],
        reply: "…No. He hits me when he drinks. Sometimes when he doesn't. I tell people I fall." },
      { id: "neck", chip: "Has he ever put his hands around your neck?", critical: true,
        keywords: ["neck", "choke", "choked", "strangle", "strangled", "throat", "grabbed"],
        reply: "Last week. He held my neck against the wall until everything went dark for a moment. Since then the headaches haven't stopped." },
      { id: "weapon", chip: "Has he threatened you with a weapon?", critical: true,
        keywords: ["weapon", "knife", "gun", "threaten", "threatened", "kill"],
        reply: "He keeps a knife in the car. He said if I ever leave, he'll find me." },
      { id: "children", chip: "Are there children at home?", critical: false,
        keywords: ["children", "kids", "child", "son", "daughter"], reply: "No. Not yet." },
      { id: "headache", chip: "Tell me about the headaches.", critical: true,
        keywords: ["headache", "head", "pain", "dizzy", "vision", "vomit"],
        reply: "Every day since last week. No vomiting. Sometimes my voice sounds hoarse." },
      { id: "frequency", chip: "Is it getting worse or more often?", critical: false,
        keywords: ["worse", "often", "more", "escalat", "frequent", "every"], reply: "Yes. It used to be once a month. Now it's every week." },
      { id: "sexual", chip: "Has he forced you to have sex?", critical: false,
        keywords: ["sex", "forced", "rape", "sexual"], reply: "Sometimes I just let him, so he doesn't get angry. Not in the last few days." },
      { id: "support", chip: "Is there anyone safe you could go to?", critical: false,
        keywords: ["family", "friend", "go to", "stay", "support", "someone", "sister", "mother"], reply: "My sister in Soshanguve. He doesn't know where she lives now." },
      { id: "pregnancy", chip: "How do you feel about the pregnancy?", critical: false,
        keywords: ["pregnancy", "pregnant", "baby", "feel about"], reply: "Scared. He says a baby will make me his forever." },
      { id: "police", chip: "Have you ever reported him?", critical: false,
        keywords: ["police", "report", "case", "charge", "protection order"], reply: "Once. They told me to go home and sort it out with him." },
      { id: "mood", chip: "How have you been feeling in yourself?", critical: false,
        keywords: ["mood", "feel", "depressed", "sleep", "low", "suicide"], reply: "I don't sleep. I jump at every sound. I don't want to die. I want it to stop." }
    ],
    fallback: "I don't understand. Please ask me another way."
  },

  examTitle: "Examine and document",
  examLead: "Ask her permission for each part. Document injuries carefully: they may matter later if she chooses to act.",
  exam: [
    { id: "neck", label: "Examine the neck", essential: true, finding: "Faint fingertip-shaped bruises on both sides of the neck. Mild tenderness. No swelling or noisy breathing." },
    { id: "eyes", label: "Look at the eyes and face", essential: true, finding: "Tiny red spots (petechiae) on the inner eyelids. A healing cut on the left eyebrow." },
    { id: "arms", label: "Examine the arms", essential: true, finding: "Bruises of different ages on both forearms, consistent with defending herself." },
    { id: "neuro", label: "Neurological examination", essential: true, finding: "Alert and oriented. No focal signs. Pupils equal and reactive." },
    { id: "document", label: "Document the injuries on a body map, with her consent", essential: true, finding: "Injuries recorded with sizes, colours and positions. She agrees to photographs for her file." },
    { id: "abdomen", label: "Examine the abdomen", essential: false, finding: "Soft, not tender." }
  ],

  tests: [
    { id: "danger", label: "Danger assessment questions (short form)", group: "Clinic assessment", essential: true },
    { id: "mental", label: "Depression and anxiety screen", group: "Clinic assessment", essential: false, appropriate: true },
    { id: "booking", label: "Antenatal booking bloods (HIV, syphilis, blood group, Hb)", group: "Blood", essential: true },
    { id: "us", label: "Pregnancy ultrasound (dating)", group: "Imaging", essential: false, appropriate: true },
    { id: "ct", label: "CT brain", group: "Imaging", essential: false, appropriate: false, why: "No loss of consciousness now, no vomiting and a normal neurological examination; she is pregnant. The hospital team will decide on imaging of the neck vessels after strangulation." },
    { id: "skull", label: "Skull X-ray", group: "Imaging", essential: false, appropriate: false, why: "It does not help in this situation." },
    { id: "tox", label: "Urine drug screen", group: "Other", essential: false, appropriate: false, why: "Not indicated; it suggests she is to blame." }
  ],

  results: {
    turnaround: "Clinic assessments are scored in the consultation; booking bloods return in 2 days (simulated).",
    reports: {
      danger: { title: "Danger assessment (short form)", rows: [
        { analyte: "Strangulation", value: "Yes, last week", unit: "", range: "No", flag: "H", key: "strang", critical: true },
        { analyte: "Threats to kill or with a weapon", value: "Yes", unit: "", range: "No", flag: "H", key: "threat" },
        { analyte: "Violence more frequent or severe", value: "Yes", unit: "", range: "No", flag: "H", key: "escal" },
        { analyte: "Pregnant", value: "Yes", unit: "", range: "", flag: "H", key: "preg" },
        { analyte: "Overall danger", value: "High", unit: "", range: "", flag: "H", key: "high" } ]},
      mental: { title: "Depression and anxiety screen", rows: [
        { analyte: "Depression (PHQ-9)", value: "14", unit: "/27", range: "0–4 minimal", flag: "H", key: "phq" },
        { analyte: "Suicidal thoughts", value: "None", unit: "", range: "None", flag: "", key: "si" } ]},
      booking: { title: "Antenatal booking bloods", rows: [
        { analyte: "HIV rapid test", value: "Negative", unit: "", range: "", flag: "" },
        { analyte: "Syphilis (RPR)", value: "Negative", unit: "", range: "", flag: "" },
        { analyte: "Blood group", value: "B RhD positive", unit: "", range: "", flag: "" },
        { analyte: "Haemoglobin", value: "12.0", unit: "g/dL", range: "≥ 11.0 in pregnancy", flag: "" } ]},
      us: { title: "Pregnancy ultrasound", text: "Single live intrauterine pregnancy, 6 weeks and 2 days." },
      ct: { title: "CT brain", text: "Normal. (She was exposed to radiation and waited 5 hours.)" },
      skull: { title: "Skull X-ray", text: "Normal." },
      tox: { title: "Urine drug screen", text: "Negative. She asked why she was being tested." }
    },
    significant: ["strang", "threat", "escal", "preg", "high", "phq"],
    criticalNote: "Strangulation with loss of awareness in the past week: a strong predictor of serious harm. She needs same-day safety planning."
  },

  triage: {
    title: "What happens next?",
    question: "Decide the next steps together with her",
    vitals: [
      { label: "Danger level", value: "High", unit: "", flag: "high" },
      { label: "Strangulation", value: "Last week", unit: "", flag: "high" },
      { label: "Pregnant", value: "~6 weeks", unit: "", flag: "high" },
      { label: "Safe place", value: "Sister", unit: "" }
    ],
    look: "Zanele checks her phone. Three missed calls. “If I'm not back by twelve, he'll know something's wrong.”",
    options: [
      { id: "same_day", label: "Same-day care and safety", detail: "With her agreement: same-day hospital review of the strangulation injury, the social worker and GBV services, a safety plan, and a safe place tonight (her sister or a shelter)", score: 100 },
      { id: "police", label: "Insist on the police", detail: "Tell her she must open a case today or you can't help her", score: 30, critical: "Made help conditional on reporting to the police." },
      { id: "partner", label: "Call the partner", detail: "Ask her partner to come in so you can talk to them together", score: 0, critical: "Involved the abuser, putting her in danger." },
      { id: "home", label: "Paracetamol and review", detail: "Treat the headache and review in a month", score: 0, critical: "Sent home a woman at high risk after strangulation without a safety plan." }
    ],
    feedback: "Strangulation, threats with a weapon, escalating violence and pregnancy mean high danger. Strangulation can injure the blood vessels in the neck even when the outside looks minor. She decides what to do; your job is to give her safe options today, without conditions."
  },

  diagnosis: {
    options: [
      { id: "ipv", label: "Intimate partner violence with non-fatal strangulation (high danger), in early pregnancy, with depressive symptoms", score: 100 },
      { id: "depression", label: "Depression only", score: 20 },
      { id: "tension", label: "Tension headache", score: 0 },
      { id: "migraine", label: "Migraine", score: 0 },
      { id: "accident", label: "Accidental injuries at work", score: 0 }
    ],
    explain: "Repeated injuries with changing explanations, bruises of different ages, fingertip bruises on the neck with petechiae after strangulation, and her own disclosure confirm intimate partner violence. The danger assessment is high. The headaches and hoarse voice may come from the strangulation and need hospital review."
  },

  medicationChart: {
    intro: "Prescription written at the hospital. She is about 6 weeks pregnant. Check every line.",
    lines: [
      { id: "pcm", drug: "Paracetamol", order: "1 g every 6 hours when needed (maximum 4 g a day)", error: false },
      { id: "ibu", drug: "Ibuprofen", order: "400 mg every 8 hours for the headache", error: true,
        why: "Anti-inflammatories such as ibuprofen are generally avoided in pregnancy. Paracetamol is the safer choice." },
      { id: "loraz", drug: "Lorazepam", order: "2 mg at night for one month to help her sleep", error: true,
        why: "Benzodiazepines are not a first-line treatment in pregnancy, and sedation can make it harder for her to stay alert to danger. Address safety, sleep and mood with support and counselling first." },
      { id: "anc", drug: "Antenatal supplements", order: "As per the antenatal care guidelines at booking", error: false }
    ]
  },

  management: {
    options: [
      { id: "believe", label: "Believe her, tell her it is not her fault, and respect her decisions", kind: "critical" },
      { id: "plan", label: "Make a safety plan with her: a safe place tonight, important documents, an emergency signal, and safe numbers saved under another name", kind: "critical" },
      { id: "strangulation", label: "Explain the warning signs after strangulation (worsening headache, voice change, difficulty breathing or swallowing) and arrange review", kind: "critical" },
      { id: "j88", label: "Document injuries on the medico-legal form (J88) with her consent, so she can use it if she chooses", kind: "essential" },
      { id: "options", label: "Explain protection orders under the Domestic Violence Act and how to open a case, if and when she chooses", kind: "essential" },
      { id: "refer", label: "Refer to the social worker, a shelter if she wants one, and antenatal care; give her the GBV Command Centre number", kind: "essential" },
      { id: "invite", label: "Invite her partner to the next antenatal visit", kind: "harmful", critical: "Invited the abuser into her care." },
      { id: "pray", label: "Tell her to go home and pray for her relationship", kind: "harmful", critical: "Encouraged her to return to danger." },
      { id: "condition", label: "Tell her you can only help if she leaves him today", kind: "harmful", critical: "Made support conditional, which pushes women away from care." },
      { id: "vague", label: "Write “domestic issue” in the folder with no details", kind: "harmful", critical: "Failed to document injuries she may need for legal protection." }
    ]
  },

  followupPick: function () { return this.followup; },
  followup: {
    time: "Two weeks later",
    situation: "Zanele comes back to the clinic. She went back to her partner. He found the pamphlet with the GBV number and tore it up. She has a new bruise on her cheek and says, “I know you'll be disappointed in me.”",
    options: [
      { id: "door", label: "Tell her you're glad she came back and that leaving is a process, not a single event; reassess the danger, update the safety plan, and offer shelter today", correct: true },
      { id: "warn", label: "Remind her she was warned, and that you can't keep helping if she goes back", correct: false },
      { id: "police_now", label: "Phone the police yourself now without asking her", correct: false },
      { id: "panado", label: "Treat the bruise and let her go", correct: false }
    ],
    explain: "Many women return to an abusive partner several times before leaving safely, and the time of leaving can be the most dangerous. Keep the door open without judgement, reassess danger and update her plan."
  },

  extraFeedback: function (s) {
    var out = [];
    if (s.asked.indexOf("neck") === -1) out.push("Always ask directly about strangulation. Women often don't mention it, and it is one of the strongest warning signs of serious harm.");
    return out;
  },
  exampleErrors: ["Accepted the disclosure of a patient's visit to her partner.", "Sent home a woman at high risk after strangulation without a safety plan."],

  learningPoints: [
    "Repeated injuries with changing stories, and sleeves in hot weather, are signs to ask about safety, privately.",
    "Ask directly about strangulation; it is a strong warning sign of serious harm.",
    "Never confirm a patient's visit to anyone, including her partner.",
    "Believe her, document carefully, and offer options without conditions. She decides.",
    "Leaving is a process. Keep the door open and update the safety plan each time."
  ]
});

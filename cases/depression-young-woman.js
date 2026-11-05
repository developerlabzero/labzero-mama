/*
 * LabZero Mama case: "Not the life I chose"
 * Content licence: CC BY 4.0 (see CONTENT_LICENSE.md). Code licence: MIT.
 *
 * FICTIONAL TRAINING CASE. Not for clinical use.
 * Clinical content is pending review by a qualified psychiatrist and clinical
 * psychologist, and must be checked against the guidelines and mental health
 * legislation the training institution teaches.
 * The case discusses suicidal thoughts for the purpose of teaching risk assessment.
 * It deliberately contains no information about methods.
 */
window.MAMA_CASES = window.MAMA_CASES || [];
window.MAMA_CASES.push({
  id: "depression-medical-student",
  version: "0.1.0",
  status: "Draft: pending clinical validation",
  title: "Not the life I chose",
  family: "Women's mental health: depression",
  why: "Young women in South Africa often carry depression in silence because of stigma, and families may see it as weakness or a spiritual problem. Health workers who ask directly, assess risk well and work with families can save lives.",
  setting: "Ikhwezi Community Health Centre, then a psychiatric hospital",
  support: "If this case raises something for you, talk to someone you trust. In South Africa, the SADAG Suicide Crisis Helpline is 0800 567 567.",
  patient: {
    name: "Naledi Khumalo",
    age: 22,
    obstetric: "Second-year medical student, lives in residence",
    arrival: "Ticket 041 · in the queue since 08:15"
  },
  opening: "I don't even know why I'm here. Zinhle told me to come. I'm just tired, that's all.",
  steps: ["records", "vitals", "history", "tests", "results", "triage", "exam", "diagnosis", "meds", "manage", "family", "followup"],
  stepLabels: { records: "File room", vitals: "Vitals", history: "Doctor", tests: "Screening", results: "Scores", triage: "Risk", exam: "Team assessment", family: "Family meeting" },
  stepSettings: {
    records: "Ikhwezi CHC · file room",
    vitals: "Ikhwezi CHC · nurse's vitals station",
    history: "Ikhwezi CHC · doctor's consulting room",
    tests: "Ikhwezi CHC · same consultation",
    results: "Ikhwezi CHC · same consultation",
    triage: "Ikhwezi CHC · deciding what happens next",
    exam: "Psychiatric hospital, ward 4 · day 1 of voluntary admission",
    diagnosis: "Ward round · day 2",
    meds: "Ward round · day 2",
    manage: "Ward round · day 2",
    family: "Family meeting room · day 5",
    followup: "Ward 4 · day 14"
  },
  domains: [
    { id: "experience", label: "Patient experience" },
    { id: "vitals", label: "Nurse vitals" },
    { id: "history", label: "Engagement and history" },
    { id: "investigations", label: "Screening choices" },
    { id: "interpretation", label: "Interpreting scores" },
    { id: "prioritisation", label: "Risk assessment" },
    { id: "assessment", label: "Team assessment" },
    { id: "diagnosis", label: "Diagnosis" },
    { id: "medication", label: "Medication safety" },
    { id: "management", label: "Care plan" },
    { id: "family", label: "Family intervention" },
    { id: "monitoring", label: "Monitoring and response" }
  ],

  monitor: function (s) {
    var idx = this.steps.indexOf(s.stepId);
    var screened = s.tests.indexOf("phq9") !== -1 && idx >= this.steps.indexOf("results");
    var admitted = idx >= this.steps.indexOf("exam") || s.stepId === "debrief";
    var fu = s.stepId === "followup" || s.stepId === "debrief";
    return [
      { k: "Mood", v: fu ? "4/10" : "2/10", u: "self-rated", alert: !fu },
      { k: "Sleep", v: admitted ? "6 h" : "3 h", u: "per night", alert: !admitted },
      { k: "PHQ-9", v: screened ? "22" : "–", u: "/27", alert: screened },
      { k: "Setting", v: admitted ? "Ward" : "Campus", u: "", alert: false }
    ];
  },

  history: {
    speaker: "Naledi",
    speakerRole: "the patient",
    title: "The doctor's consultation",
    prompt: "You are the clinic doctor. Build trust, then ask in your own words. Asking directly about suicide does not put the idea in her head. She answers only from her approved case script.",
    intents: [
      { id: "mood", chip: "How has your mood been?", critical: true,
        keywords: ["mood", "feel", "feeling", "sad", "down", "low", "depressed", "empty", "happy"],
        reply: "Empty. Nothing feels good any more, not even music. It's been like this since about March." },
      { id: "suicide", chip: "Have you had thoughts of ending your life?", critical: true,
        keywords: ["suicide", "kill yourself", "end your life", "ending your life", "hurt yourself", "harm yourself", "self-harm", "die", "dead", "better off", "not wake up"],
        reply: "…Sometimes I think everyone would be better off without me. I've written letters to my sister and my mother. I've thought about how, and when. I haven't told anyone that." },
      { id: "mania", chip: "Have you ever felt extremely high or full of energy for days?", critical: true,
        keywords: ["high", "energy", "racing", "mania", "manic", "euphoric", "no sleep but", "on top of the world"],
        reply: "No, never. I just feel low and tired all the time." },
      { id: "support", chip: "Who do you have in your corner?", critical: true,
        keywords: ["support", "friends", "who can you talk", "someone", "close to", "sister", "help you", "corner"],
        reply: "My sister Lindiwe. Zinhle. My dance group, but I stopped going in April." },
      { id: "sleep", chip: "How are you sleeping?", critical: false,
        keywords: ["sleep", "sleeping", "night", "awake", "insomnia", "tired"],
        reply: "I lie awake until three or four. Then I can't get up for lectures." },
      { id: "appetite", chip: "How is your appetite?", critical: false,
        keywords: ["appetite", "eat", "eating", "food", "weight"],
        reply: "I've lost about six kilos. I forget to eat." },
      { id: "studies", chip: "How are your studies going?", critical: false,
        keywords: ["studies", "study", "university", "varsity", "marks", "exams", "lectures", "failing", "concentrate", "concentration"],
        reply: "I read the same page of pharmacology ten times and nothing goes in. I failed two blocks this semester." },
      { id: "career", chip: "Did you choose to study medicine?", critical: false,
        keywords: ["choose", "chose", "medicine", "career", "want to be", "dream", "doctor", "why medicine"],
        reply: "No. I wanted to study performing arts. I've danced and acted since I was eight. My parents said acting is not a career. My father tells everyone at church his daughter will be a doctor." },
      { id: "family", chip: "What do your parents know about how you feel?", critical: false,
        keywords: ["parents", "family", "father", "mother", "home", "dad", "mom", "mum", "baba", "mama"],
        reply: "Nothing. My father says depression is for weak people. My mother says I must pray more. I can't tell them I'm failing." },
      { id: "stigma", chip: "Does anyone else know?", critical: false,
        keywords: ["anyone else", "know", "told", "tell", "stigma", "res", "residence", "ashamed", "shame"],
        reply: "No. If people at res find out, they'll say I'm mad. Uyahlanya. That's what they'd say." },
      { id: "substances", chip: "Do you drink alcohol or use any drugs?", critical: false,
        keywords: ["alcohol", "drink", "drinking", "drugs", "dagga", "weed", "substances", "smoke"],
        reply: "Two ciders on some weekends. No drugs." },
      { id: "psychosis", chip: "Do you hear or see things others don't?", critical: false,
        keywords: ["voices", "hear things", "see things", "hallucinations", "paranoid", "strange"],
        reply: "No, nothing like that." },
      { id: "money", chip: "How are you managing financially?", critical: false,
        keywords: ["money", "financial", "bursary", "fees", "funding", "pay"],
        reply: "My bursary only pays if I pass. If I fail, my parents must pay back money they don't have." },
      { id: "medical", chip: "Any medical problems or medicines?", critical: false,
        keywords: ["medical", "illness", "medication", "medicines", "pills", "contraception", "chronic"],
        reply: "No illnesses. I only take the pill." }
    ],
    fallback: "I'm not sure what you mean."
  },

  tests: [
    { id: "phq9", label: "PHQ-9 depression questionnaire", group: "Screening tools", essential: true },
    { id: "cssrs", label: "Columbia suicide severity screen", group: "Screening tools", essential: true },
    { id: "gad7", label: "GAD-7 anxiety questionnaire", group: "Screening tools", essential: false, appropriate: true },
    { id: "audit", label: "AUDIT alcohol questionnaire", group: "Screening tools", essential: false, appropriate: true },
    { id: "mdq", label: "Mood disorder questionnaire (bipolar screen)", group: "Screening tools", essential: false, appropriate: true },
    { id: "tsh", label: "Thyroid function (TSH)", group: "Blood tests", essential: false, appropriate: true },
    { id: "fbc", label: "Full blood count", group: "Blood tests", essential: false, appropriate: true },
    { id: "ct", label: "CT brain", group: "Imaging", essential: false, appropriate: false, why: "No neurological signs, head injury or atypical features." },
    { id: "eeg", label: "EEG", group: "Other", essential: false, appropriate: false, why: "No history suggesting seizures." }
  ],

  results: {
    turnaround: "Questionnaires are scored in the session; blood results return the next day.",
    reports: {
      phq9: { title: "PHQ-9", rows: [
        { analyte: "Total score", value: "22", unit: "/27", range: "0–4 minimal; 20–27 severe", flag: "H", key: "phq" },
        { analyte: "Item 9: better off dead or self-harm", value: "3", unit: "nearly every day", range: "0", flag: "H", key: "item9" } ]},
      cssrs: { title: "Columbia suicide severity screen", rows: [
        { analyte: "Suicidal thoughts, past month", value: "Active, with intent and a plan", unit: "", range: "None", flag: "H", critical: true, key: "ssi" },
        { analyte: "Preparatory behaviour", value: "Yes: goodbye letters", unit: "", range: "None", flag: "H", key: "prep" } ]},
      gad7: { title: "GAD-7", rows: [
        { analyte: "Total score", value: "15", unit: "/21", range: "0–4 minimal; 15–21 severe", flag: "H", key: "gad" } ]},
      audit: { title: "AUDIT", rows: [
        { analyte: "Total score", value: "3", unit: "/40", range: "0–7 low risk", flag: "", key: "aud" } ]},
      mdq: { title: "Mood disorder questionnaire", rows: [
        { analyte: "Result", value: "Negative", unit: "", range: "Negative", flag: "", key: "mdq" } ]},
      tsh: { title: "Thyroid function", rows: [
        { analyte: "TSH", value: "1.8", unit: "mIU/L", range: "0.4–4.0", flag: "", key: "tshv" } ]},
      fbc: { title: "Full blood count", rows: [
        { analyte: "Haemoglobin", value: "13.1", unit: "g/dL", range: "12.0–15.0", flag: "", key: "hb" },
        { analyte: "White cell count", value: "6.2", unit: "×10⁹/L", range: "4.0–11.0", flag: "" } ]},
      ct: { title: "CT brain", text: "Normal. (The scan took two weeks to book.)" },
      eeg: { title: "EEG", text: "Normal." }
    },
    significant: ["phq", "item9", "ssi", "prep", "gad"],
    criticalNote: "Columbia screen: active suicidal thoughts with intent and a plan. She needs a same-day risk decision."
  },

  triage: {
    title: "What happens next?",
    question: "Decide how urgently she needs psychiatric care",
    vitals: [
      { label: "PHQ-9", value: "22", unit: "/27", flag: "high" },
      { label: "Suicidal thoughts", value: "Plan and intent", unit: "", flag: "high" },
      { label: "Preparation", value: "Letters", unit: "", flag: "high" },
      { label: "Supports", value: "Sister, friend", unit: "" }
    ],
    look: "Naledi is quiet and looks at the floor. She asks you not to tell her parents. She agrees to see the psychiatrist today.",
    options: [
      { id: "same_day", label: "Emergency", detail: "Same-day referral to the psychiatric hospital; a staff member stays with her and safe transport is arranged", score: 100 },
      { id: "this_week", label: "Urgent", detail: "Psychiatry appointment this week", score: 30, critical: "Did not arrange same-day care for active suicidal thoughts with a plan." },
      { id: "gp", label: "Refer to GP", detail: "Ask a GP to start an antidepressant", score: 10, critical: "Referred to a GP without managing immediate suicide risk." },
      { id: "routine", label: "Routine", detail: "Refer to the clinic psychologist in two weeks", score: 0, critical: "Sent home with a routine follow-up despite high suicide risk." }
    ],
    feedback: "Active suicidal thoughts with intent, a plan and preparation mean high immediate risk. She should not be left alone and needs a psychiatric assessment today. Naledi agrees to go; she is 22 and consents to voluntary admission."
  },

  afterTriage: function (s) {
    return s.triage === "same_day" ? null :
      "Two days after your decision, Naledi's sister found her in her room in crisis and brought her to the emergency unit. She survived and has now been admitted. The delay put her life at risk.";
  },
  examTitle: "Team assessment on the ward",
  examLead: "Naledi has been admitted voluntarily. Ask each member of the team for their assessment.",
  exam: [
    { id: "psychiatrist", label: "Psychiatrist: mental state examination", essential: true,
      finding: "Low mood, flat affect, slowed speech. No psychotic features. Active suicidal thoughts, less intense since admission. Partial insight. Consents to treatment." },
    { id: "nurse", label: "Ward nurse: admission checks and observation", essential: true,
      finding: "Vital signs normal. Belongings checked for safety. Close observation every 15 minutes for the first 72 hours." },
    { id: "psychologist", label: "Clinical psychologist: formulation", essential: true,
      finding: "Years of putting her own goals aside to meet family expectations. Perfectionism and shame about failing. Loss of her identity as a performer. Suitable for cognitive behavioural therapy, then family work." },
    { id: "social", label: "Social worker: family and social assessment", essential: true,
      finding: "Bursary tied to passing medicine; family in debt. Father is a church elder who values the family's reputation. Naledi agrees to a family meeting if the team leads it." },
    { id: "ot", label: "Occupational therapist: routine and function", essential: false,
      finding: "Sleep pattern reversed. Stopped dance and social activities. Graded activity plan agreed, including movement sessions." },
    { id: "physical", label: "Medical officer: physical examination", essential: false,
      finding: "BMI 18.4. Otherwise normal." }
  ],

  diagnosis: {
    options: [
      { id: "mdd", label: "Major depressive disorder, single episode, severe, without psychotic features, with high suicide risk", score: 100 },
      { id: "adjustment", label: "Adjustment disorder with depressed mood", score: 30 },
      { id: "bipolar", label: "Bipolar disorder, current episode depressed", score: 10 },
      { id: "burnout", label: "Academic burnout; no mental disorder", score: 0 },
      { id: "substance", label: "Alcohol-induced depressive disorder", score: 0 },
      { id: "weak", label: "Not an illness: she needs to be stronger", score: 0 }
    ],
    explain: "Low mood and loss of pleasure for over two weeks (here since March), with poor sleep, weight loss, poor concentration, worthlessness and suicidal thoughts, a PHQ-9 of 22, and no history of mania, psychosis or significant alcohol use, meet the criteria for severe major depressive disorder. Normal thyroid function makes a medical cause unlikely."
  },

  medicationChart: {
    intro: "Ward chart, day 2. Check every line before anything is given or dispensed.",
    lines: [
      { id: "fluox", drug: "Fluoxetine", order: "20 mg orally every morning; review in 2 weeks", error: false },
      { id: "ami", drug: "Amitriptyline", order: "75 mg at night; dispense 28 tablets to take home on weekend leave", error: true,
        why: "Tricyclic antidepressants are very dangerous in overdose and should not be supplied in quantity to someone at risk of suicide. She is already on an SSRI." },
      { id: "loraz", drug: "Lorazepam", order: "2 mg three times a day for 3 months", error: true,
        why: "Benzodiazepines are for short-term use only, because of dependence and sedation. Three months is unsafe." },
      { id: "zop", drug: "Zopiclone", order: "7.5 mg at night as needed, for up to 7 nights", error: false }
    ]
  },

  management: {
    options: [
      { id: "voluntary", label: "Continue voluntary admission with her informed consent", kind: "critical" },
      { id: "safety", label: "Make a safety plan with her and keep close observation", kind: "critical" },
      { id: "treat", label: "Start fluoxetine together with psychotherapy (CBT), and review weekly", kind: "critical" },
      { id: "consent", label: "Ask her permission before sharing information with her parents", kind: "essential" },
      { id: "academic", label: "Social worker to help with a leave of absence and bursary options, with her consent", kind: "essential" },
      { id: "meeting", label: "Plan a family meeting led by the team, if she agrees", kind: "essential" },
      { id: "tell_all", label: "Phone her parents and tell them everything now; she is their child", kind: "harmful",
        critical: "Shared an adult patient's information with her family without her consent." },
      { id: "pray", label: "Tell her to be strong and pray it away", kind: "harmful",
        critical: "Dismissed a mental illness as weakness." },
      { id: "discharge", label: "Discharge her home today with sleeping tablets", kind: "harmful",
        critical: "Discharged a woman at high suicide risk." },
      { id: "finish", label: "Tell her she must finish medicine because of the bursary", kind: "harmful",
        critical: "Pressured her about the career conflict at the heart of her illness." }
    ]
  },

  file: {
    title: "Clinic folder",
    entries: ["New folder opened today. Student, 22. No previous visits at this clinic."]
  },

  vitals: [
    { id: "bp", label: "Blood pressure", value: "112/70", unit: "mmHg", abnormal: false, essential: true, line: "It's probably fine. Everything is fine." },
    { id: "pulse", label: "Pulse", value: "92", unit: "/min", abnormal: false, essential: false, line: "(She doesn't look up.)" },
    { id: "temp", label: "Temperature", value: "36.5", unit: "\u00b0C", abnormal: false, essential: false, line: "I'm not sick like that." },
    { id: "weight", label: "Weight", value: "49", unit: "kg (BMI 18.4; 6 kg lost)", abnormal: true, essential: true, line: "I just forget to eat. There's no time." },
    { id: "glucose", label: "Finger-prick glucose", value: "4.6", unit: "mmol/L", abnormal: false, essential: false, line: "I haven't eaten since yesterday." },
    { id: "urine", label: "Urine dipstick", value: "Normal", unit: "", abnormal: false, essential: false, line: "Okay." },
    { id: "preg", label: "Urine pregnancy test", value: "Negative", unit: "", abnormal: false, essential: true, line: "I'm on the pill. But fine, test." },
    { id: "hb", label: "Haemoglobin (finger prick)", value: "12.8", unit: "g/dL", abnormal: false, essential: false, line: "Another needle?" }
  ],

  scenes: {
   records: {
    title: "The file room",
    lead: "Naledi has no folder at this clinic. She studies nearby and lives in residence.",
    turns: [
      { speaker: "Mr Sithole (clerk)", line: "No ID copy, no proof of residence, no folder. I can't help her.",
        options: [
          { text: "Please register her as a new patient now. She shouldn't be turned away for missing documents.", score: 100,
            reply: "Mr Sithole sighs and pulls out a new folder." },
          { text: "She should go to the clinic near her parents' home.", score: 10,
            reply: "Naledi turns towards the door." },
          { text: "Come back with your ID.", score: 0, flag: "Turned a distressed young woman away over documents.",
            reply: "Naledi puts her earphones back in." }
        ]},
      { speaker: "Naledi", line: "Forget it. I'll just go.",
        options: [
          { text: "Please stay. You're already here, and I'll make sure you're seen today.", score: 100, reply: "She hesitates, then sits back down." },
          { text: "Okay, come back when you're ready.", score: 0, flag: "Let a withdrawn young woman leave without assessment.", reply: "She leaves. A friend brings her back an hour later." },
          { text: "Suit yourself.", score: 0, flag: "Responded dismissively to a distressed patient.", reply: "She walks out. A friend brings her back an hour later." }
        ]}
    ]
   },
   family: {
    title: "Family meeting",
    lead: "Present: Naledi, her parents Mr and Mrs Khumalo, the psychologist, the social worker and you. Naledi asked the team to lead. Choose what you say.",
    turns: [
      { speaker: "Mr Khumalo", line: "We are busy people. Why are we here? My daughter is not mad. In our family we don't have this depression. She must just be strong.",
        options: [
          { text: "Thank you for coming. I can hear how worried you are. Naledi asked us to meet so we can explain what she is going through and how you can help her.", score: 100,
            reply: "Mr Khumalo sits back. \"Fine. Explain.\"" },
          { text: "With respect, sir, that is a myth. Depression affects everyone.", score: 40,
            reply: "Mr Khumalo folds his arms. \"So now I am ignorant?\"" },
          { text: "If you keep saying that, you are part of the problem.", score: 0, flag: "Blamed the family at the start of the meeting.",
            reply: "Mr Khumalo stands up to leave. The social worker calms the room." },
          { text: "You may be right. She probably just needs some rest at home.", score: 0, flag: "Agreed that her illness was weakness.",
            reply: "Naledi looks down and stops talking." }
        ]},
      { speaker: "Mrs Khumalo", line: "We pray for her every day. Is this an evil spirit? My sister says we should take her to a prophet.",
        options: [
          { text: "Prayer can be a real support, and you can keep praying with her. Depression is also an illness that affects the brain and mood, the way diabetes affects the body, and it gets better with treatment.", score: 100,
            reply: "Mrs Khumalo nods slowly. \"So it is an illness. Like sugar diabetes.\"" },
          { text: "We don't discuss religion here.", score: 20,
            reply: "Mrs Khumalo goes quiet and grips her handbag." },
          { text: "Prophets can't help. That's superstition.", score: 10,
            reply: "Mrs Khumalo looks hurt. \"You people don't respect our beliefs.\"" },
          { text: "Yes, take her to the prophet instead of treatment.", score: 0, flag: "Advised stopping medical treatment.",
            reply: "The psychologist steps in to correct this." }
        ]},
      { speaker: "Mr Khumalo", line: "Then what did we do wrong? We gave her everything. Medicine is a good career. Is she saying we did this?",
        options: [
          { text: "No one is blaming you. Depression usually has many causes together. Naledi, would you like to tell your parents what you told us about medicine?", score: 100,
            reply: "Naledi takes a breath." },
          { text: "Let's not talk about her career. Let's focus on her medication.", score: 30,
            reply: "Naledi stays silent. The real issue is left unspoken." },
          { text: "Yes. Pushing her into medicine caused this.", score: 10, flag: "Blamed the parents for her illness.",
            reply: "Mr Khumalo's face hardens. Mrs Khumalo starts to cry." },
          { text: "She will be fine once she passes her exams.", score: 0,
            reply: "Naledi shakes her head." }
        ]},
      { speaker: "Naledi", line: "Baba… I don't want to be a doctor. I want to perform. I've been too scared to tell you for three years.",
        options: [
          { text: "That was brave, Naledi. Mr and Mrs Khumalo, this is hard to hear, and you don't have to decide anything about her studies today. The social worker can explain options such as a leave of absence and the bursary. Can we agree on how you'll support her while she recovers?", score: 100,
            reply: "After a long silence, Mr Khumalo says: \"I did not know you were carrying this. We will talk. First you must get well.\"" },
          { text: "Mr Khumalo, you must accept her choice today.", score: 30,
            reply: "Mr Khumalo says nothing. The pressure has moved to him." },
          { text: "Let's end the meeting; emotions are too high.", score: 20,
            reply: "The family leaves without a plan." },
          { text: "Naledi, you should apologise to your father.", score: 0, flag: "Silenced the patient in the family meeting.",
            reply: "Naledi starts crying and leaves the room." }
        ]},
      { speaker: "Mrs Khumalo", line: "What should we do when she comes home?",
        options: [
          { text: "Know the warning signs, keep medicines locked away, keep talking with her without judging, and phone the clinic or a crisis line if you are worried. We'll give you a written plan.", score: 100,
            reply: "Mrs Khumalo writes it down. \"Thank you. We did not know.\"" },
          { text: "Watch her all the time and don't let her go out alone.", score: 30,
            reply: "Naledi looks worried about losing all her freedom." },
          { text: "Nothing. The hospital will handle everything.", score: 10,
            reply: "The family leaves unsure how to help." },
          { text: "Make sure she studies hard so she doesn't fall behind.", score: 0, flag: "Added academic pressure to the discharge advice.",
            reply: "Naledi's shoulders drop." }
        ]}
    ]
   }
  },

  followupPick: function () { return this.followup; },
  followup: {
    time: "Day 14 of admission",
    situation: "Naledi tells the night nurse she has more energy. She also says the thoughts of ending her life are stronger today, and she asks for weekend leave.",
    options: [
      { id: "reassess", label: "Reassess suicide risk now, increase observation, inform the psychiatrist, and postpone leave until risk is reviewed", correct: true },
      { id: "leave", label: "Grant the leave; more energy means she is improving", correct: false },
      { id: "stop", label: "Stop the fluoxetine immediately", correct: false },
      { id: "normal", label: "Reassure her that this is normal and take no action", correct: false }
    ],
    explain: "In young adults, the first weeks of antidepressant treatment can bring more energy before the mood lifts, and suicide risk can rise. Reassess, keep her safe and involve the psychiatrist."
  },

  extraFeedback: function (s) {
    var out = [];
    if (s.asked.indexOf("suicide") === -1) out.push("Always ask directly about suicide. Asking does not increase risk, and it may be the first time anyone has.");
    return out;
  },

  exampleErrors: ["Did not arrange same-day care for active suicidal thoughts with a plan.", "Shared an adult patient's information with her family without her consent.", "Blamed the family at the start of the meeting."],

  learningPoints: [
    "Ask directly about suicidal thoughts, intent, plans and preparation. Asking does not plant the idea.",
    "Active thoughts with a plan and preparation need same-day psychiatric care; do not leave her alone.",
    "She is an adult: share information with her family only with her consent, except where the law allows you to act to protect her life.",
    "Meet families with respect for their beliefs. Explain depression as an illness that responds to treatment, without blame.",
    "Watch closely in the first weeks of an antidepressant. Avoid supplying medicines that are dangerous in overdose, and use benzodiazepines short-term only."
  ]
});

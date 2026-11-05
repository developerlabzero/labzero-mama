/*
 * LabZero Mama case: "Sugar in the urine is normal in pregnancy, isn't it?"
 * Content licence: CC BY 4.0 (see CONTENT_LICENSE.md). Code licence: MIT.
 *
 * FICTIONAL TRAINING CASE. Not for clinical use.
 * Clinical content is pending review by an obstetric physician or endocrinologist
 * and a dietitian (diagnostic thresholds and glucose targets vary by guideline).
 */
window.MAMA_CASES = window.MAMA_CASES || [];
window.MAMA_CASES.push({
  id: "gestational-diabetes",
  version: "0.1.0",
  status: "Draft: pending clinical validation",
  title: "Sugar in the urine is normal in pregnancy, isn't it?",
  family: "Obstetrics: gestational diabetes",
  why: "Diabetes is rising fast in South Africa, and gestational diabetes is often missed at primary care. Untreated, it causes big babies, difficult births, stillbirth and newborn hypoglycaemia, and it marks a woman at high risk of type 2 diabetes for life.",
  setting: "Ikhwezi Community Health Centre antenatal clinic, then the hospital high-risk antenatal clinic",
  patient: { name: "Shireen Naidoo", age: 36, obstetric: "Third pregnancy, 28 weeks. Last baby weighed 4.3 kg", arrival: "Ticket 058 · in the queue since 09:20, for her antenatal visit" },
  opening: "My urine always shows sugar in pregnancy. That's normal, isn't it?",
  steps: ["records", "vitals", "history", "exam", "triage", "tests", "results", "diagnosis", "meds", "manage", "family", "followup"],
  stepLabels: { records: "File room", vitals: "Antenatal checks", history: "Her story", exam: "Examine", triage: "Next step", family: "Food and family" },
  stepSettings: {
    records: "Ikhwezi CHC · file room", vitals: "Ikhwezi CHC · antenatal clinic",
    history: "Ikhwezi CHC · antenatal clinic", exam: "Ikhwezi CHC · antenatal clinic",
    triage: "Ikhwezi CHC · antenatal clinic", tests: "Ikhwezi CHC, next morning (fasting)",
    results: "Hospital high-risk antenatal clinic", diagnosis: "Hospital high-risk antenatal clinic",
    meds: "Hospital high-risk antenatal clinic", manage: "Hospital high-risk antenatal clinic",
    family: "Ikhwezi CHC · with the dietitian", followup: "Hospital · postnatal ward, the day of the birth"
  },
  domains: [
    { id: "experience", label: "Patient experience" }, { id: "vitals", label: "Antenatal checks" },
    { id: "history", label: "Risk factors" }, { id: "assessment", label: "Examination" },
    { id: "prioritisation", label: "Screening decision" }, { id: "investigations", label: "Test selection" },
    { id: "interpretation", label: "Result interpretation" }, { id: "diagnosis", label: "Diagnosis" },
    { id: "medication", label: "Medication safety" }, { id: "management", label: "Management" },
    { id: "family", label: "Diet and culture" }, { id: "monitoring", label: "Newborn response" }
  ],

  tuto: {
    records: "Read the folder like a detective: big babies, family history and weight are clues.",
    vitals: "Glucose in the urine is a prompt, not a diagnosis. And a uterus bigger than the dates needs explaining.",
    history: "Ask about the risk factors for diabetes in pregnancy: previous big baby, family history, weight, previous gestational diabetes or stillbirth.",
    triage: "A woman with risk factors and glucose in her urine needs a proper diagnostic test, not reassurance and not guesswork.",
    meds: "Pregnancy changes the rules: some common chronic-disease medicines are unsafe for the baby, and treatment without monitoring is blind.",
    family: "Food is culture and love. Work with her family's food and festivals, not against them."
  },

  monitor: function (s) {
    var res = ["results", "diagnosis", "meds", "manage", "family", "followup", "debrief"].indexOf(s.stepId) !== -1;
    return [
      { k: "Weeks", v: "28", u: "", alert: false },
      { k: "Urine glucose", v: s.vitalsTaken.indexOf("urine") !== -1 ? "2+" : "?", u: "", alert: s.vitalsTaken.indexOf("urine") !== -1 },
      { k: "Fundal height", v: s.vitalsTaken.indexOf("sfh") !== -1 ? "32" : "?", u: "cm", alert: s.vitalsTaken.indexOf("sfh") !== -1 },
      { k: "OGTT fasting", v: res ? "5.8" : "?", u: "mmol/L", alert: res }
    ];
  },

  file: {
    title: "Antenatal card and folder",
    entries: [
      "Booking at 12 weeks: BMI 34. BP 124/78. HIV negative. Urine NAD.",
      "2018: Son, 3.9 kg, normal birth.",
      "2022: Daughter, 4.3 kg, “difficult birth, shoulders stuck”. Baby to the neonatal unit with low sugar.",
      "20 weeks: urine glucose 1+. “Normal in pregnancy.”",
      "24 weeks: urine glucose 1+. No action recorded."
    ]
  },

  scenes: {
    records: {
      title: "The file room",
      lead: "Shireen's antenatal card is clipped to her folder. Two previous visits note sugar in the urine.",
      turns: [
        { speaker: "Mrs Dube (clerk)", line: "Antenatal, 28 weeks, routine. Card only, the folder's not needed.",
          options: [
            { text: "“Let's take the folder too. Her last birth note might matter.”", score: 100, reply: "The folder says: “4.3 kg, shoulders stuck, baby to the neonatal unit with low sugar.”" },
            { text: "“Card only is fine.”", score: 30, reply: "The 2022 birth note stays on the shelf." },
            { text: "“Just a quick BP and urine and she can go.”", score: 10, reply: "Another visit where nobody asks why the sugar is there." }
          ]},
        { speaker: "Shireen", line: "Every time they check, there's sugar. They said it's normal in pregnancy, so I don't worry.",
          options: [
            { text: "“Sometimes it is, but it can also be a sign of diabetes in pregnancy. With your last big baby, I'd like to check properly today.”", score: 100, reply: "She frowns. “My mother has sugar diabetes. Is that the same?”" },
            { text: "“Yes, it's normal. Don't worry.”", score: 0, flag: "Dismissed recurrent glycosuria in a woman with diabetes risk factors.", reply: "She relaxes, and the diagnosis is missed again." },
            { text: "“You must stop eating sugar.”", score: 20, reply: "She looks embarrassed. “I hardly eat sweets.”" }
          ]}
      ]
    },

    family: {
      title: "Food and family",
      lead: "Shireen comes with her mother-in-law, who does the cooking. Diwali is coming.",
      turns: [
        { speaker: "Mrs Naidoo senior", line: "So now she must eat only salad? In our house we eat rice and roti every day. And Diwali is coming: the sweetmeats!",
          options: [
            { text: "“She can still eat your food. Smaller portions of rice and roti, half the plate vegetables, a quarter protein like dhal, chicken or fish, and a short walk after meals. For Diwali, a small piece of sweetmeat after a meal rather than on its own, and check her sugar afterwards.”", score: 100, reply: "Mrs Naidoo nods slowly. “Brown rice? My son won't eat it. But smaller portions, yes.”" },
            { text: "“No rice, no roti, no sweets at all until the baby is born.”", score: 20, reply: "Shireen skips meals for two days and feels faint." },
            { text: "“Just take the tablets and eat what you like.”", score: 0, flag: "Advised that medication replaces diet in gestational diabetes.", reply: "Her sugars stay high." }
          ]},
        { speaker: "Shireen", line: "Will the baby be born with diabetes? And will I have it forever?",
          options: [
            { text: "“The baby won't be born with diabetes, but high sugars can make the baby big and give the baby low sugar after birth, which we'll watch for. Your diabetes usually goes after the birth, but you have a high chance of type 2 diabetes later, so we'll test you 6–12 weeks after the birth and then regularly.”", score: 100, reply: "“So this is a warning for me too.” “Exactly.”" },
            { text: "“Yes, you'll both be diabetic now.”", score: 0, flag: "Gave inaccurate information about gestational diabetes.", reply: "She is frightened for days." },
            { text: "“It all goes away after the birth. Don't worry about later.”", score: 20, reply: "She never comes for the postnatal test." }
          ]}
      ],
      teach: "Medical nutrition therapy works best when it fits the family's food: portion sizes, plate balance, walking after meals, planning for festivals. Explain the lifelong type 2 diabetes risk and the postnatal test."
    }
  },

  vitals: [
    { id: "urine", label: "Urine dipstick", value: "Glucose 2+, no protein, no ketones", unit: "", abnormal: true, essential: true, line: "See? Sugar again." },
    { id: "bp", label: "Blood pressure", value: "128/82", unit: "mmHg", abnormal: false, essential: true, line: "" },
    { id: "weight", label: "Weight and BMI", value: "96 kg (booking BMI 34)", unit: "", abnormal: true, essential: true, line: "I've always been big." },
    { id: "sfh", label: "Symphysis–fundal height", value: "32 cm at 28 weeks", unit: "", abnormal: true, essential: true, line: "Everyone says I look further along." },
    { id: "fhr", label: "Fetal heart rate", value: "144", unit: "/min", abnormal: false, essential: true, line: "" },
    { id: "rbg", label: "Random finger-prick glucose", value: "9.6", unit: "mmol/L (2 h after breakfast)", abnormal: true, essential: false, line: "I had toast and tea with two sugars." }
  ],

  history: {
    speaker: "Shireen", speakerRole: "the patient", title: "Her story",
    prompt: "Ask in your own words. She answers only from her approved case script.",
    intents: [
      { id: "prevbaby", chip: "Tell me about your previous babies' birth weights and births.", critical: true,
        keywords: ["previous", "babies", "weight", "big", "birth", "last baby", "kg"],
        reply: "My daughter was 4.3 kg. Her shoulders got stuck and she needed sugar drips in the nursery." },
      { id: "famhx", chip: "Does anyone in your family have diabetes?", critical: true,
        keywords: ["family", "mother", "father", "diabetes", "sugar"], reply: "My mother and two aunts. My mother is on insulin." },
      { id: "prevgdm", chip: "Were you ever told you had diabetes in a previous pregnancy?", critical: true,
        keywords: ["told", "diabetes", "previous pregnancy", "gdm", "sugar test"], reply: "No. Nobody tested me. They just said sugar in the urine is normal." },
      { id: "symptoms", chip: "Are you very thirsty or passing a lot of urine?", critical: false,
        keywords: ["thirsty", "thirst", "urine", "toilet", "wee", "drinking"], reply: "Thirsty, yes. But I thought that was the heat." },
      { id: "diet", chip: "What do you usually eat in a day?", critical: false,
        keywords: ["eat", "food", "diet", "meals", "breakfast", "lunch"], reply: "Toast and sweet tea, rice and curry for lunch, roti and curry at night. Cool drink in the afternoon." },
      { id: "exercise", chip: "How active are you?", critical: false,
        keywords: ["exercise", "walk", "active", "activity"], reply: "I work at a till all day. I sit." },
      { id: "moves", chip: "Is the baby moving well?", critical: false,
        keywords: ["moving", "movements", "kicks"], reply: "Very busy." },
      { id: "stillbirth", chip: "Any stillbirths or miscarriages?", critical: false,
        keywords: ["stillbirth", "miscarriage", "lost"], reply: "No." }
    ],
    fallback: "Sorry, I didn't follow. Ask me again?"
  },

  examTitle: "Examine her",
  examLead: "With her consent. The finding appears when you perform each examination.",
  exam: [
    { id: "abdo", label: "Abdominal palpation", essential: true, finding: "Uterus large for dates. Cephalic. Liquor feels slightly increased." },
    { id: "skin", label: "Skin (acanthosis nigricans, infections)", essential: false, finding: "Dark, velvety skin at the back of the neck (acanthosis nigricans): a sign of insulin resistance." },
    { id: "oedema", label: "Oedema", essential: false, finding: "Mild ankle oedema." },
    { id: "thyroid", label: "Thyroid", essential: false, finding: "Normal." }
  ],

  triage: {
    title: "What next?",
    question: "Decide her next step",
    vitals: [
      { label: "Urine glucose", value: "2+ (third visit)", unit: "", flag: "high" },
      { label: "Previous baby", value: "4.3 kg, shoulder dystocia", unit: "", flag: "high" },
      { label: "BMI", value: "34", unit: "", flag: "high" },
      { label: "Fundal height", value: "32 cm at 28 weeks", unit: "", flag: "high" }
    ],
    look: "Shireen checks her watch. “I must be at work by twelve.”",
    options: [
      { id: "ogtt", label: "Diagnostic test", detail: "Book a 75 g oral glucose tolerance test after an overnight fast this week, plus an HbA1c and a growth scan", score: 100 },
      { id: "reassure", label: "Reassure", detail: "Sugar in the urine is common in pregnancy; recheck at the next visit", score: 0, critical: "Reassured a high-risk woman with recurrent glycosuria without testing." },
      { id: "metformin", label: "Start metformin now", detail: "Treat as diabetes without a diagnostic test", score: 30, critical: "Started treatment without a diagnosis." },
      { id: "diet", label: "Diet sheet only", detail: "Give her a diet sheet and review in 4 weeks", score: 20, critical: "Delayed diagnosis of probable gestational diabetes." }
    ],
    feedback: "Recurrent glucose in the urine, a previous 4.3 kg baby with shoulder dystocia, obesity, a strong family history and a large-for-dates uterus all point to diabetes in pregnancy. The diagnosis is made with a 75 g oral glucose tolerance test; an HbA1c helps tell gestational diabetes from type 2 diabetes that was there before pregnancy."
  },

  tests: [
    { id: "ogtt", label: "75 g oral glucose tolerance test (fasting, 1 h, 2 h)", group: "Blood", essential: true },
    { id: "hba1c", label: "HbA1c", group: "Blood", essential: true },
    { id: "us", label: "Growth ultrasound (fetal weight and liquor)", group: "Imaging", essential: true },
    { id: "urinemcs", label: "Urine culture", group: "Urine", essential: false, appropriate: true },
    { id: "ue", label: "Kidney function", group: "Blood", essential: false, appropriate: true },
    { id: "insulin", label: "Fasting insulin level", group: "Blood", essential: false, appropriate: false, why: "It doesn't diagnose gestational diabetes or change treatment." },
    { id: "ct", label: "CT abdomen", group: "Imaging", essential: false, appropriate: false, why: "Radiation in pregnancy, and no question it would answer." }
  ],

  results: {
    turnaround: "OGTT done the next morning; results with the growth scan at the hospital clinic.",
    reports: {
      ogtt: { title: "75 g oral glucose tolerance test", rows: [
        { analyte: "Fasting", value: "5.8", unit: "mmol/L", range: "< 5.1", flag: "H", key: "fast" },
        { analyte: "1 hour", value: "10.9", unit: "mmol/L", range: "< 10.0", flag: "H", key: "one" },
        { analyte: "2 hours", value: "9.1", unit: "mmol/L", range: "< 8.5", flag: "H", key: "two" } ]},
      hba1c: { title: "HbA1c", rows: [ { analyte: "HbA1c", value: "5.9", unit: "%", range: "< 6.5 (diabetes threshold)", flag: "", key: "a1c" } ]},
      us: { title: "Growth ultrasound", rows: [
        { analyte: "Estimated fetal weight", value: "Above the 90th centile", unit: "", range: "10th–90th", flag: "H", key: "lga" },
        { analyte: "Liquor", value: "Mildly increased", unit: "", range: "Normal", flag: "H", key: "poly" } ]},
      urinemcs: { title: "Urine culture", rows: [ { analyte: "Culture", value: "No growth", unit: "", range: "No growth", flag: "" } ]},
      ue: { title: "Kidney function", rows: [ { analyte: "Creatinine", value: "54", unit: "µmol/L", range: "35–70 in pregnancy", flag: "" } ]},
      insulin: { title: "Fasting insulin", text: "Raised. (It changes nothing.)" },
      ct: { title: "CT", text: "Not performed: the radiologist declined the request." }
    },
    significant: ["fast", "one", "two", "a1c", "lga", "poly"],
    criticalNote: ""
  },

  diagnosis: {
    options: [
      { id: "gdm", label: "Gestational diabetes, with a large-for-dates baby and mild polyhydramnios", score: 100 },
      { id: "t2", label: "Type 2 diabetes that was there before pregnancy", score: 30 },
      { id: "normal", label: "Normal glucose tolerance; glucose in urine is normal in pregnancy", score: 0 },
      { id: "renal", label: "Renal glycosuria only", score: 10 }
    ],
    explain: "All three OGTT values are above the diagnostic thresholds used by many guidelines (one is enough), so she has diabetes in pregnancy. An HbA1c below 6.5% makes pre-existing type 2 diabetes less likely, so this is gestational diabetes. The growth scan shows its effect: a large baby and extra fluid. Thresholds differ between guidelines; follow your local protocol."
  },

  medicationChart: {
    intro: "Hospital high-risk clinic prescription. Check every line.",
    lines: [
      { id: "met", drug: "Metformin", order: "500 mg twice a day with meals, increase as needed if targets are not met with diet", error: false },
      { id: "mon", drug: "Glucose monitoring", order: "Not needed while on metformin", error: true,
        why: "She needs a glucometer and a record of fasting and after-meal glucose to see whether treatment is working and when to add insulin." },
      { id: "enal", drug: "Enalapril", order: "5 mg daily to protect the kidneys", error: true,
        why: "ACE inhibitors are contraindicated in pregnancy: they can damage the baby's kidneys and cause oligohydramnios. Her BP is normal and her kidneys are normal anyway." },
      { id: "fol", drug: "Folic acid and iron", order: "Continue antenatal supplements", error: false },
      { id: "ins", drug: "Insulin", order: "Add if glucose targets are not met on diet and metformin (dose by the high-risk team)", error: false }
    ]
  },

  management: {
    options: [
      { id: "mnt", label: "Diet and activity advice that fits her food and work (dietitian), as the first treatment", kind: "critical" },
      { id: "smbg", label: "Glucometer, with fasting and after-meal targets and a written record", kind: "critical" },
      { id: "hrc", label: "Follow-up at the high-risk antenatal clinic, with growth scans", kind: "critical" },
      { id: "birth", label: "Plan the birth in hospital (large baby, previous shoulder dystocia), with a team ready for shoulder dystocia", kind: "essential" },
      { id: "neo", label: "Plan newborn glucose checks and early feeding after birth", kind: "essential" },
      { id: "pn", label: "75 g OGTT 6–12 weeks after the birth, then regular diabetes screening for life", kind: "essential" },
      { id: "bf", label: "Encourage breastfeeding: it lowers her and the baby's later diabetes risk", kind: "essential" },
      { id: "starve", label: "Tell her to cut out all carbohydrates", kind: "harmful", critical: "Advised carbohydrate starvation in pregnancy (risk of ketosis and poor fetal growth)." },
      { id: "nomon", label: "Insulin with no glucose monitoring", kind: "harmful", critical: "Started insulin without glucose monitoring." },
      { id: "early", label: "Book an elective induction at 34 weeks because of the diabetes", kind: "harmful", critical: "Planned an unnecessary preterm birth." }
    ]
  },

  followupPick: function () { return this.followup; },
  followup: {
    time: "The day of the birth, one hour after delivery",
    situation: "Shireen's son was born at 39 weeks, 4.2 kg, after a planned induction. At one hour he is jittery and not interested in the breast. Heel-prick glucose 1.8 mmol/L.",
    options: [
      { id: "feed", label: "Neonatal hypoglycaemia: feed now (breast or expressed colostrum), keep him skin-to-skin, recheck in 30–60 minutes; if still low or he has symptoms, IV dextrose and the neonatal team", correct: true },
      { id: "water", label: "Give sugar water by bottle and recheck tomorrow", correct: false },
      { id: "normal", label: "Jitteriness is normal in big babies", correct: false },
      { id: "formula", label: "Switch to formula only and stop breastfeeding", correct: false }
    ],
    explain: "Babies of mothers with diabetes make extra insulin and can drop their glucose after birth. A jittery baby with glucose 1.8 mmol/L has symptomatic hypoglycaemia: feed and recheck quickly, and escalate to IV dextrose if it stays low or symptoms persist. Low glucose can damage the brain."
  },

  extraFeedback: function (s) {
    var out = [];
    if (s.asked.indexOf("prevbaby") === -1) out.push("You did not ask about her previous babies. A previous baby over 4 kg is one of the strongest risk factors.");
    return out;
  },
  exampleErrors: ["Reassured a high-risk woman with recurrent glycosuria without testing.", "Missed a prescribing error: Enalapril, 5 mg daily to protect the kidneys."],

  learningPoints: [
    "Recurrent glucose in the urine is not ‘normal in pregnancy’ in a woman with risk factors. Test properly.",
    "Risk factors: previous baby over 4 kg, family history, obesity, previous gestational diabetes or unexplained stillbirth.",
    "Diagnose with a 75 g OGTT; an HbA1c helps separate pre-existing diabetes.",
    "Diet and activity first, fitted to her culture; metformin, then insulin, if targets aren't met. Always with glucose monitoring.",
    "ACE inhibitors are contraindicated in pregnancy.",
    "Watch the baby's glucose after birth. Test the mother 6–12 weeks after birth and for life."
  ]
});

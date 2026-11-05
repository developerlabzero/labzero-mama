/*
 * LabZero Mama case: "I'm only here for the baby's injections"
 * Content licence: CC BY 4.0 (see CONTENT_LICENSE.md). Code licence: MIT.
 *
 * FICTIONAL TRAINING CASE. Not for clinical use.
 * Clinical content is pending review by a psychiatrist or perinatal mental
 * health clinician and a pharmacist (antidepressants in breastfeeding).
 */
window.MAMA_CASES = window.MAMA_CASES || [];
window.MAMA_CASES.push({
  id: "postnatal-depression",
  version: "0.1.0",
  status: "Draft: pending clinical validation",
  title: "I'm only here for the baby's injections",
  family: "Perinatal mental health: postnatal depression",
  why: "Depression during pregnancy and after birth is common in South Africa, and most of it is never detected. Mothers come to clinics for their babies, not for themselves. Asking at the baby's visit finds them, and treatment helps both mother and baby.",
  setting: "Ikhwezi Community Health Centre, baby clinic",
  patient: { name: "Ntombi Mahlaba", age: 28, obstetric: "Para 2. Baby Amahle is 6 weeks old", arrival: "Ticket 052 · in the queue since 09:05, with her baby on her back" },
  opening: "I'm only here for the baby's injections.",
  steps: ["records", "vitals", "history", "triage", "tests", "results", "diagnosis", "meds", "manage", "family", "followup"],
  stepLabels: { records: "File room", vitals: "Mother and baby", history: "Talking to Ntombi", triage: "Risk decision", family: "Her support" },
  stepSettings: {
    records: "Ikhwezi CHC · file room", vitals: "Ikhwezi CHC · baby clinic",
    history: "Ikhwezi CHC · baby clinic, door closed", triage: "Ikhwezi CHC · baby clinic",
    tests: "Ikhwezi CHC", results: "Ikhwezi CHC", diagnosis: "Ikhwezi CHC", meds: "Ikhwezi CHC",
    manage: "Ikhwezi CHC", family: "Ikhwezi CHC · on the phone, then in person", followup: "Ikhwezi CHC · two weeks later"
  },
  domains: [
    { id: "experience", label: "Seeing the mother" }, { id: "vitals", label: "Mother and baby checks" },
    { id: "history", label: "Mental health history" }, { id: "prioritisation", label: "Risk decision" },
    { id: "investigations", label: "Test selection" }, { id: "interpretation", label: "Result interpretation" },
    { id: "diagnosis", label: "Diagnosis" }, { id: "medication", label: "Medication safety" },
    { id: "management", label: "Management" }, { id: "family", label: "Family support" },
    { id: "monitoring", label: "Follow-up" }
  ],

  tuto: {
    records: "The baby's booklet is in your hand, but the mother is the patient you might miss. Look at her too.",
    vitals: "Check the baby, and screen the mother. A validated questionnaire finds what a quick ‘how are you?’ misses.",
    history: "Ask about sleep, appetite, joy, guilt, thoughts about the baby, and directly about self-harm. Asking about suicide does not put the idea in her head.",
    triage: "Match the response to the risk: thoughts without a plan, with protective factors, need same-day care and a safety plan; a plan or intent needs emergency care.",
    meds: "Is it safe in breastfeeding, and safe if she took the whole supply at once?",
    family: "With her permission, bring in someone who can help at home. Turn ‘she's lazy’ into ‘she's ill and getting better’."
  },

  monitor: function (s) {
    var screened = s.vitalsTaken.indexOf("epds") !== -1;
    return [
      { k: "EPDS", v: screened ? "19" : "?", u: "/30", alert: screened },
      { k: "Baby weight", v: s.vitalsTaken.indexOf("bweight") !== -1 ? "4.1" : "?", u: "kg", alert: s.vitalsTaken.indexOf("bweight") !== -1 },
      { k: "Sleep", v: "3", u: "h/night", alert: true },
      { k: "Mother Hb", v: s.vitalsTaken.indexOf("hb") !== -1 ? "10.2" : "?", u: "g/dL", alert: s.vitalsTaken.indexOf("hb") !== -1 }
    ];
  },

  file: {
    title: "Mother's folder and baby's Road to Health booklet",
    entries: [
      "Antenatal: booked at 14 weeks. HIV negative ×3. Normal birth at 39 weeks, 3.4 kg.",
      "Postnatal day 3 visit: “Mother tearful.” No follow-up recorded.",
      "Baby: birth weight 3.4 kg. Immunisations up to date until today.",
      "Previous pregnancy (2021): “Low mood after birth, resolved.” No treatment."
    ]
  },

  scenes: {
    records: {
      title: "The file room",
      lead: "Mrs Dube finds the baby's Road to Health booklet in seconds. The mother's folder is in a different pile.",
      turns: [
        { speaker: "Mrs Dube (clerk)", line: "Baby clinic, 6-week injections. Just the booklet. We don't need the mother's file for this.",
          options: [
            { text: "“Please fetch her file too. The 6-week visit is for the mother as well as the baby.”", score: 100, reply: "Mrs Dube sighs and goes to the other pile. A note says: “Mother tearful, day 3.”" },
            { text: "“Fine, the booklet is enough.”", score: 20, reply: "The note from day 3 stays in the drawer." },
            { text: "“Let's be quick; the queue is long.”", score: 10, reply: "Ntombi looks at the floor." }
          ]},
        { speaker: "Ntombi", line: "Sorry for wasting your time. I know there are sick people here.",
          options: [
            { text: "“You're not wasting anyone's time. How are you doing, since the birth?”", score: 100, reply: "She pauses for a long time. “Tired. Just tired.” Her eyes fill." },
            { text: "“No problem. The baby looks well.”", score: 30, reply: "“Yes,” she says. “Everyone says the baby looks well.”" },
            { text: "“The injections are quick, don't worry.”", score: 20, reply: "She nods and says nothing more." }
          ]}
      ]
    },

    family: {
      title: "Her support at home",
      lead: "Ntombi agrees that you can speak to her sister Zanele, who lives nearby. Her husband works on the mines in Rustenburg and phones in.",
      turns: [
        { speaker: "Her husband, Mandla (on speaker phone)", line: "My mother says she just sits and cries and doesn't cook. In our family, new mothers don't complain.",
          options: [
            { text: "“Ntombi has postnatal depression. It's a real illness, common after birth, and it's not laziness or weakness. With treatment and support she'll get better. She needs help at home and someone to share the night feeds.”", score: 100, reply: "A long silence. “I didn't know it was a sickness. I'll ask for leave at month-end.”" },
            { text: "“She needs to try harder for the children.”", score: 0, flag: "Reinforced the stigma that depression is a lack of effort.", reply: "Ntombi starts crying again." },
            { text: "“That's between you and your mother.”", score: 20, reply: "He hangs up, confused." }
          ]},
        { speaker: "Zanele, her sister", line: "What can I do? I can't be there every day.",
          options: [
            { text: "“Come by when you can, take the baby for a few hours so she can sleep, and call me if she talks about not wanting to be alive. Here's the clinic number and the SADAG helpline.”", score: 100, reply: "Zanele writes the numbers on her hand. “I'll come every afternoon this week.”" },
            { text: "“Just make sure she takes her pills.”", score: 40, reply: "Zanele nods, but doesn't know what else to watch for." },
            { text: "“Nothing really. It's up to the doctors.”", score: 10, reply: "Zanele leaves feeling helpless." }
          ]}
      ],
      teach: "Involve family only with her consent. Name the illness, remove blame, give practical tasks (sleep, night feeds, company) and tell them which warning signs mean ‘call now’."
    }
  },

  vitals: [
    { id: "epds", label: "Edinburgh Postnatal Depression Scale (EPDS)", value: "19 / 30; item 10 (self-harm): ‘sometimes’", unit: "", abnormal: true, essential: true, line: "(She hesitates over the last question for a long time.)" },
    { id: "bweight", label: "Baby's weight (plot on the growth chart)", value: "4.1 kg (birth 3.4 kg); crossing down a centile", unit: "", abnormal: true, essential: true, line: "She doesn't finish her feeds. Or maybe I don't have enough milk." },
    { id: "bp", label: "Mother's blood pressure", value: "116/74", unit: "mmHg", abnormal: false, essential: true, line: "" },
    { id: "hb", label: "Mother's haemoglobin (finger prick)", value: "10.2", unit: "g/dL", abnormal: true, essential: false, line: "I'm always dizzy." },
    { id: "mweight", label: "Mother's weight", value: "54 kg (68 kg at booking)", unit: "", abnormal: true, essential: false, line: "I'm not hungry." },
    { id: "imm", label: "Baby's 6-week immunisations", value: "Given", unit: "", abnormal: false, essential: true, line: "Amahle screams. Ntombi doesn't react." }
  ],

  history: {
    speaker: "Ntombi", speakerRole: "the patient", title: "Talking to Ntombi",
    prompt: "In private, with Amahle asleep. Ask in your own words. She answers only from her approved case script.",
    intents: [
      { id: "mood", chip: "How has your mood been since the birth?", critical: true,
        keywords: ["mood", "feeling", "sad", "low", "depressed", "how are you", "cry"], reply: "Heavy. Every day. I cry when nobody is watching." },
      { id: "joy", chip: "Do you still enjoy anything, even with the baby?", critical: true,
        keywords: ["enjoy", "happy", "joy", "pleasure", "interest", "fun"], reply: "Nothing. I know I should be happy with her. I feel nothing. That makes me a bad mother." },
      { id: "sleep", chip: "How are you sleeping and eating?", critical: true,
        keywords: ["sleep", "eat", "appetite", "food", "night", "tired"], reply: "Three hours, even when she sleeps. I lie awake. I'm not hungry." },
      { id: "harm", chip: "Have you had thoughts of harming yourself or that you'd be better off dead?", critical: true,
        keywords: ["harm", "suicide", "kill", "dead", "die", "end", "alive", "hurt yourself"],
        reply: "Sometimes I think they'd be better off without me. I wouldn't do anything. I couldn't leave my children. But the thoughts come." },
      { id: "plan", chip: "Have you made any plans, or got anything ready?", critical: true,
        keywords: ["plan", "how", "pills", "ready", "method", "way"], reply: "No. No plan. I just wish I could sleep and not wake up." },
      { id: "baby", chip: "Have you had any thoughts of harming the baby?", critical: true,
        keywords: ["baby", "amahle", "hurt her", "harm the baby", "shake"], reply: "No! Never. I'm scared I'm not looking after her properly, that's all." },
      { id: "psych", chip: "Have you heard voices or seen things others don't?", critical: false,
        keywords: ["voices", "hear", "see things", "strange"], reply: "No. Nothing like that." },
      { id: "past", chip: "Have you felt like this before?", critical: false,
        keywords: ["before", "past", "previous", "last time"], reply: "After my son was born, a bit. It went away after some months. I never told anyone." },
      { id: "support", chip: "Who helps you at home?", critical: false,
        keywords: ["help", "support", "husband", "family", "home", "alone"], reply: "My husband works on the mines. His mother lives with us; she says I'm lazy. My sister Zanele is nearby." },
      { id: "feeding", chip: "How is breastfeeding going?", critical: false,
        keywords: ["breastfeed", "feeding", "milk", "breast"], reply: "She's breastfed. She doesn't finish. I don't know if I have enough milk." },
      { id: "alcohol", chip: "Do you drink alcohol or use anything to cope?", critical: false,
        keywords: ["alcohol", "drink", "drugs", "cope"], reply: "No." },
      { id: "violence", chip: "Do you feel safe at home?", critical: false,
        keywords: ["safe", "violence", "hit", "abuse", "hurt you"], reply: "Yes. It's just the words from his mother." }
    ],
    fallback: "Sorry, I don't understand. Ask me another way."
  },

  triage: {
    title: "How urgent is this?",
    question: "Decide her level of care",
    vitals: [
      { label: "EPDS", value: "19 / 30", unit: "", flag: "high" },
      { label: "Self-harm thoughts", value: "Passive, no plan", unit: "", flag: "high" },
      { label: "Protective factors", value: "Her children; her sister", unit: "" },
      { label: "Baby", value: "Poor weight gain", unit: "", flag: "high" }
    ],
    look: "Ntombi is holding Amahle tightly. “Are you going to take her away from me?”",
    options: [
      { id: "same", label: "Same-day treatment and safety plan", detail: "Doctor assessment today, start treatment, a safety plan with her sister, counselling referral, review within 1–2 weeks", score: 100 },
      { id: "emerg", label: "Emergency psychiatric admission", detail: "Admit her involuntarily today", score: 30, critical: "Escalated to involuntary admission without the risk to justify it." },
      { id: "blues", label: "Reassure: baby blues", detail: "It will pass; come back if it gets worse", score: 0, critical: "Dismissed postnatal depression with thoughts of self-harm as baby blues." },
      { id: "routine", label: "Routine referral", detail: "Refer to the psychologist; the waiting list is 3 months", score: 20, critical: "Left a mother with depression and self-harm thoughts without treatment for months." }
    ],
    feedback: "An EPDS of 19 with passive thoughts of death, no plan, no psychosis and strong protective factors means moderate to severe postnatal depression that needs treatment today, a safety plan and close follow-up. It does not need involuntary admission. If a plan or intent appears, that changes."
  },

  tests: [
    { id: "tsh", label: "Thyroid function (TSH)", group: "Blood", essential: true },
    { id: "fbc", label: "Full blood count", group: "Blood", essential: true },
    { id: "hiv", label: "HIV test (postnatal repeat)", group: "Blood", essential: true },
    { id: "ct", label: "CT scan of the head", group: "Imaging", essential: false, appropriate: false, why: "No neurological signs or psychosis. It adds nothing." },
    { id: "uds", label: "Urine drug screen", group: "Urine", essential: false, appropriate: false, why: "No history or signs of substance use. A routine drug screen damages trust here." }
  ],

  results: {
    turnaround: "Results in 2 days (simulated).",
    reports: {
      tsh: { title: "Thyroid", rows: [ { analyte: "TSH", value: "2.1", unit: "mIU/L", range: "0.4–4.0", flag: "", key: "tshok" } ]},
      fbc: { title: "Full blood count", rows: [
        { analyte: "Haemoglobin", value: "10.1", unit: "g/dL", range: "12.0–15.0", flag: "L", key: "hb" },
        { analyte: "MCV", value: "76", unit: "fL", range: "80–100", flag: "L", key: "mcv" } ]},
      hiv: { title: "HIV", rows: [ { analyte: "HIV rapid test", value: "Negative", unit: "", range: "Negative", flag: "" } ]},
      ct: { title: "CT head", text: "Normal." },
      uds: { title: "Urine drug screen", text: "Negative. Ntombi asks why you thought she used drugs." }
    },
    significant: ["tshok", "hb", "mcv"],
    criticalNote: ""
  },

  diagnosis: {
    options: [
      { id: "pnd", label: "Postnatal depression (moderate to severe) with passive suicidal thoughts, and iron-deficiency anaemia", score: 100 },
      { id: "blues", label: "Baby blues", score: 0 },
      { id: "psychosis", label: "Postpartum psychosis", score: 10 },
      { id: "thyroid", label: "Postpartum thyroiditis", score: 10 },
      { id: "anaemia", label: "Anaemia only", score: 20 }
    ],
    explain: "Low mood, loss of joy, guilt, poor sleep and appetite and passive thoughts of death for most of the six weeks since birth, with an EPDS of 19, is postnatal depression. Baby blues settle within about two weeks. There is no psychosis, and her thyroid is normal. Anaemia adds to her tiredness and should be treated, but doesn't explain the depression. Her previous episode after her son's birth raises the risk."
  },

  medicationChart: {
    intro: "The doctor's prescription. Check every line.",
    lines: [
      { id: "flu", drug: "Fluoxetine", order: "20 mg daily; continue breastfeeding and watch the baby's feeding and sleep", error: false },
      { id: "ami", drug: "Amitriptyline", order: "75 mg at night for sleep; 3 months' supply", error: true,
        why: "Tricyclics are dangerous in overdose, and she has thoughts of death. Avoid them, and give small supplies of any medicine with frequent review." },
      { id: "stopbf", drug: "Breastfeeding advice", order: "Stop breastfeeding while taking the antidepressant", error: true,
        why: "Many antidepressants, including fluoxetine and sertraline, are compatible with breastfeeding. Stopping isn't needed and would harm the baby's feeding and her confidence." },
      { id: "iron", drug: "Ferrous sulphate", order: "200 mg daily", error: false }
    ]
  },

  management: {
    options: [
      { id: "safety", label: "Write a safety plan with her: warning signs, who to call, and keeping medicines out of reach", kind: "critical" },
      { id: "review", label: "Review her within 1–2 weeks, sooner if things get worse", kind: "critical" },
      { id: "therapy", label: "Refer for talking therapy (counsellor or psychologist), alongside medication", kind: "critical" },
      { id: "baby", label: "Support feeding and recheck the baby's weight in a week", kind: "essential" },
      { id: "family", label: "With her consent, involve her sister for practical help", kind: "essential" },
      { id: "contra", label: "Offer contraception", kind: "essential" },
      { id: "iron", label: "Treat the anaemia", kind: "essential" },
      { id: "pray", label: "Tell her to pray and be strong for her children", kind: "harmful", critical: "Dismissed depression as a lack of faith or strength." },
      { id: "remove", label: "Ask the mother-in-law to take over the baby's care", kind: "harmful", critical: "Separated a depressed mother from her baby without cause." },
      { id: "lots", label: "Give three months of medicine so she doesn't have to queue again", kind: "harmful", critical: "Gave a large supply of medication to a patient with thoughts of death." }
    ]
  },

  followupPick: function () { return this.followup; },
  followup: {
    time: "Two weeks later",
    situation: "Ntombi comes back with her sister. She stopped the fluoxetine after four days because it made her nauseous and more anxious. She says the thoughts of death have not got worse; she has no plan. Amahle has gained 250 g.",
    options: [
      { id: "restart", label: "Explain that early side effects usually settle in 1–2 weeks and the benefit takes 4–6 weeks; restart (or switch), take it with food, review in a week, and keep the safety plan", correct: true },
      { id: "stop", label: "Agree that tablets don't suit her and stop treatment", correct: false },
      { id: "double", label: "Double the dose to make it work faster", correct: false },
      { id: "admit", label: "Admit her: she didn't take her medicine", correct: false }
    ],
    explain: "Early side effects are the commonest reason antidepressants are stopped. Warn about them at the start, explain that improvement takes weeks, and support adherence with close follow-up. Increase the dose only after an adequate trial."
  },

  extraFeedback: function (s) {
    var out = [];
    if (s.asked.indexOf("harm") === -1) out.push("You did not ask directly about self-harm. With an EPDS item 10 answer of ‘sometimes’, you must.");
    return out;
  },
  exampleErrors: ["Dismissed postnatal depression with thoughts of self-harm as baby blues.", "Missed a prescribing error: Amitriptyline, 75 mg at night for sleep; 3 months' supply."],

  learningPoints: [
    "The baby's visit is the mother's visit too. Screen every mother (EPDS or similar).",
    "Ask directly about self-harm. It doesn't put the idea in her head.",
    "Baby blues settle within two weeks. Six weeks of low mood is depression.",
    "Same-day treatment, a safety plan and close follow-up for thoughts without a plan; emergency care for a plan or intent.",
    "Choose antidepressants that are safe in breastfeeding and in overdose. Small supplies, frequent review.",
    "Poor weight gain in the baby can be a sign the mother is unwell."
  ],

  support: "SADAG: 0800 567 567 (check numbers before use)."
});

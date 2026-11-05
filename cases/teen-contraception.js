/*
 * LabZero Mama case: "I just need the injection"
 * Content licence: CC BY 4.0 (see CONTENT_LICENSE.md). Code licence: MIT.
 *
 * FICTIONAL TRAINING CASE. Not for clinical use.
 * Clinical and legal content (Children's Act 38 of 2005; Criminal Law (Sexual
 * Offences and Related Matters) Amendment Act 32 of 2007) is pending review by
 * a family planning clinician and a child protection specialist.
 */
window.MAMA_CASES = window.MAMA_CASES || [];
window.MAMA_CASES.push({
  id: "teen-contraception",
  version: "0.1.0",
  status: "Draft: pending clinical and legal validation",
  title: "I just need the injection",
  family: "Adolescent sexual and reproductive health: contraception and safeguarding",
  why: "Adolescent pregnancy ends schooling and carries higher risks for mother and baby. South African law lets a child of 12 or older get contraception confidentially, but many girls are turned away or told to bring a parent. Some are in relationships with much older men, which the law treats as a sexual offence against a child.",
  setting: "Ikhwezi Community Health Centre, youth-friendly corner",
  patient: { name: "Lebohang (Lebo) Sithole", age: 15, obstetric: "Grade 10 learner. Never been pregnant", arrival: "Ticket 045 · in the queue since 08:50, in school uniform" },
  opening: "I just need the injection. Please, can you be quick?",
  steps: ["records", "vitals", "history", "triage", "tests", "results", "diagnosis", "meds", "manage", "disclose", "followup"],
  stepLabels: { records: "File room", vitals: "Checks", history: "Her story", triage: "Her method", diagnosis: "Safeguarding", disclose: "Telling her", manage: "Plan" },
  stepSettings: {
    records: "Ikhwezi CHC · file room", vitals: "Ikhwezi CHC · youth corner",
    history: "Ikhwezi CHC · youth corner, door closed", triage: "Ikhwezi CHC · youth corner",
    tests: "Ikhwezi CHC · youth corner", results: "Ikhwezi CHC · youth corner",
    diagnosis: "Ikhwezi CHC · youth corner", meds: "Ikhwezi CHC · youth corner",
    manage: "Ikhwezi CHC · youth corner", disclose: "Ikhwezi CHC · youth corner, door closed",
    followup: "Ikhwezi CHC · three months later"
  },
  sceneDomains: { disclose: "disclosure" },
  domains: [
    { id: "experience", label: "Youth-friendly access" }, { id: "vitals", label: "Checks before contraception" },
    { id: "history", label: "Confidential history" }, { id: "prioritisation", label: "Method choice" },
    { id: "investigations", label: "Test selection" }, { id: "interpretation", label: "Result interpretation" },
    { id: "diagnosis", label: "Recognising abuse" }, { id: "medication", label: "Medication safety" },
    { id: "management", label: "Plan and protection" }, { id: "disclosure", label: "Honest disclosure" },
    { id: "monitoring", label: "Follow-up" }
  ],

  tuto: {
    records: "A 15-year-old has the right to contraception without a parent. Protect her privacy from the first minute, or she won't come back.",
    vitals: "Only check what a method needs: a pregnancy test, and blood pressure if she might want a combined method. No pelvic examination is needed for contraception.",
    history: "Ask every adolescent in private: how old is your partner? Do you feel pressured? Does he give you money? When did you last have unprotected sex?",
    triage: "Her body, her choice, after you've explained every method. Long-acting methods suit young people well, and condoms protect against HIV.",
    diagnosis: "The law looks at both ages. Ask yourself: is this a relationship between two young people, or an adult with a child?",
    disclose: "Never report behind her back. Tell her before you act, why you must, what will happen, and that her contraception is not in question."
  },

  monitor: function (s) {
    var asked = function (id) { return s.asked.indexOf(id) !== -1; };
    return [
      { k: "Age", v: "15", u: "years" },
      { k: "Partner age", v: asked("partner") ? "23" : "?", u: asked("partner") ? "years" : "", alert: asked("partner") },
      { k: "Unprotected sex", v: asked("lastsex") ? "2" : "?", u: asked("lastsex") ? "days ago" : "", alert: asked("lastsex") },
      { k: "Pregnancy test", v: s.vitalsTaken.indexOf("preg") !== -1 ? "Neg" : "?", u: "" }
    ];
  },

  file: {
    title: "Clinic folder",
    entries: [
      "2019: Immunisations up to date (school health).",
      "2024-05: Sore throat. Treated.",
      "No previous family planning visits."
    ]
  },

  scenes: {
    records: {
      title: "The file room",
      lead: "Lebo's folder lists her mother's cell number as the contact.",
      turns: [
        { speaker: "Mrs Dube (clerk)", line: "A child of fifteen wanting family planning? Her mother's number is right here. I'll phone her.",
          options: [
            { text: "“Please don't. From 12, a child can get contraception confidentially. Her visit is private.”", score: 100, reply: "Mrs Dube puts the phone down, muttering." },
            { text: "“Let's wait and see what the nurse says.”", score: 30, reply: "Lebo heard the word ‘mother’ and is edging towards the door." },
            { text: "“Yes, the mother must know.”", score: 0, flag: "Breached an adolescent's right to confidential contraception.", reply: "Lebo walks out. She doesn't come back for six months." }
          ]},
        { speaker: "Lebo", line: "Please, if my mother finds out she'll kick me out. Everyone at church will know.",
          options: [
            { text: "“What you tell us stays private. There are a few safety situations where I'd have to involve someone else, and if that happens I'll always tell you first.”", score: 100, reply: "She nods slowly and sits down again." },
            { text: "“You should talk to your mother about these things.”", score: 20, reply: "She looks at the floor." },
            { text: "“Nothing you say will ever be shared with anyone.”", score: 40, reply: "She relaxes. It's a promise you may not be able to keep." }
          ]}
      ]
    },

    disclose: {
      title: "Telling her about the report",
      lead: "Lebo has her implant and condoms. Now you have to tell her what the law requires you to do.",
      turns: [
        { speaker: "Lebo", line: "Thank you, sisi. Can I go now? I'm missing maths.",
          options: [
            { text: "“Before you go, I need to talk to you about Sizwe. I promised I'd tell you first if I had to involve anyone. Can we talk for five minutes?”", score: 100, reply: "She sits down, worried. “Is something wrong?”" },
            { text: "Let her go, then make the report quietly afterwards.", score: 0, flag: "Reported without telling the adolescent first.", reply: "A social worker visits her home a week later. She never trusts the clinic again." },
            { text: "“Yes, go. And stop seeing that man.”", score: 10, reply: "She leaves, angry and confused." }
          ]},
        { speaker: "Lebo", line: "But I love him. He's not hurting me. He buys me data and takes me to school.",
          options: [
            { text: "“I hear that you care about him. But the law says an adult of 23 may not have a sexual relationship with a 15-year-old, because the age and money gap makes it hard for you to say no. That's his responsibility, not yours. You haven't done anything wrong.”", score: 100, reply: "She's quiet for a long time. “He did say I mustn't tell anyone his age.”" },
            { text: "“He's using you. Can't you see that?”", score: 20, reply: "She folds her arms. “You don't know him.”" },
            { text: "“If you love him, then it's fine.”", score: 0, flag: "Dismissed a sexual offence against a child as a normal relationship.", reply: "Nothing changes." }
          ]},
        { speaker: "Lebo", line: "What's going to happen? Will they tell my mother? Will Sizwe go to jail?",
          options: [
            { text: "“I must report to a social worker, and they will involve the police. The social worker's job is to keep you safe; they'll talk to you about who else needs to know. Your implant stays, your clinic visits stay private, and you can come back to me any time.”", score: 100, reply: "She takes the social worker's card and puts it in her school bag." },
            { text: "“I don't know. That's out of my hands.”", score: 30, reply: "She leaves frightened, with no idea what comes next." },
            { text: "“Your mother will be told everything today.”", score: 10, reply: "She panics and asks to have the implant removed." }
          ]}
      ],
      teach: "Mandatory reporting is not a betrayal if you do it honestly. Tell her first, explain why, make clear she is not to blame, say what happens next, and keep her contraception and care going.",
      next: "Plan her follow-up"
    }
  },

  vitals: [
    { id: "preg", label: "Urine pregnancy test", value: "Negative", unit: "", abnormal: false, essential: true, line: "Thank God." },
    { id: "bp", label: "Blood pressure", value: "108/68", unit: "mmHg", abnormal: false, essential: true, line: "Is that okay?" },
    { id: "weight", label: "Weight and height", value: "52 kg, 1.58 m (BMI 20.8)", unit: "", abnormal: false, essential: false, line: "The injection makes you fat, my friends say." },
    { id: "pelvic", label: "Pelvic examination", value: "Not needed for contraception", unit: "", abnormal: false, essential: false, line: "(She looks terrified.) Do you have to?" },
    { id: "hb", label: "Haemoglobin (finger prick)", value: "12.8", unit: "g/dL", abnormal: false, essential: false, line: "" }
  ],

  history: {
    speaker: "Lebo", speakerRole: "the patient", title: "Her story, in private",
    prompt: "Door closed, no one else in the room. Ask in your own words. She answers only from her approved case script.",
    intents: [
      { id: "partner", chip: "How old is your boyfriend?", critical: true,
        keywords: ["old", "age", "boyfriend", "partner", "how old", "older"],
        reply: "Sizwe? He's… 23. He works at the taxi rank. He says age doesn't matter." },
      { id: "money", chip: "Does he give you money, gifts or lifts?", critical: true,
        keywords: ["money", "gifts", "buy", "pay", "data", "lift", "gives"],
        reply: "He buys me airtime and data, and he drives me to school. My mother can't afford those things." },
      { id: "pressure", chip: "Have you ever felt pressured or forced to do anything you didn't want to?", critical: true,
        keywords: ["pressure", "forced", "force", "want", "say no", "safe", "hurt", "violent"],
        reply: "Not forced… but he gets cross if I say no. He says I owe him." },
      { id: "lastsex", chip: "When did you last have sex without a condom?", critical: true,
        keywords: ["last", "condom", "unprotected", "when", "sex"],
        reply: "Saturday. Two days ago. He doesn't like condoms." },
      { id: "period", chip: "When was your last period?", critical: true,
        keywords: ["period", "menstruation", "lmp", "cycle", "bleed"], reply: "Three weeks ago. It's regular." },
      { id: "methods", chip: "Which methods have you heard about?", critical: false,
        keywords: ["methods", "options", "heard", "know", "choice", "implant", "injection", "pill"],
        reply: "Only the injection. My friend has it. What's an implant?" },
      { id: "hiv", chip: "Have you ever had an HIV test?", critical: false,
        keywords: ["hiv", "test", "tested", "status"], reply: "No. I'm scared to know." },
      { id: "sti", chip: "Any discharge, sores or pain?", critical: false,
        keywords: ["discharge", "sore", "itch", "pain", "burn", "sti", "infection"], reply: "No. Nothing like that." },
      { id: "school", chip: "How is school going?", critical: false,
        keywords: ["school", "grade", "marks", "learner", "study"], reply: "Okay. I want to be a pharmacist one day." },
      { id: "alcohol", chip: "Do you drink alcohol or use drugs?", critical: false,
        keywords: ["alcohol", "drink", "drugs", "dagga", "party"], reply: "Sometimes at the tavern with Sizwe. He buys." },
      { id: "home", chip: "Who do you live with?", critical: false,
        keywords: ["live", "home", "mother", "family", "who"], reply: "My mother and two little brothers. My father passed away." }
    ],
    fallback: "Sorry, I don't understand. Ask me another way."
  },

  triage: {
    title: "Which method?",
    question: "After counselling her on every method, what does she leave with today",
    vitals: [
      { label: "Last unprotected sex", value: "2 days ago", unit: "", flag: "high" },
      { label: "Pregnancy test", value: "Negative", unit: "" },
      { label: "Partner", value: "Dislikes condoms", unit: "", flag: "high" },
      { label: "Her choice", value: "Implant, after counselling", unit: "" }
    ],
    look: "You have shown her the implant, the injections, the pill, the copper IUD and condoms. She chooses the implant: “Three years? And nobody can see it?”",
    options: [
      { id: "dual", label: "Her choice, plus protection", detail: "The implant today, plus condoms every time, plus emergency contraception today for Saturday", score: 100 },
      { id: "inject", label: "Injection only", detail: "Give the injection anyway; it's what she asked for at the door", score: 50 },
      { id: "condoms", label: "Condoms only", detail: "She's young; condoms are enough", score: 20, critical: "Withheld effective contraception from an adolescent who chose it." },
      { id: "none", label: "Nothing today", detail: "Come back with a parent or guardian", score: 0, critical: "Withheld contraception from an adolescent entitled to it." }
    ],
    feedback: "From 12 she can consent to contraception. She has chosen an implant after counselling: give it. It doesn't protect against HIV, and her partner refuses condoms, so give condoms and talk about PrEP. She had unprotected sex two days ago, so she also needs emergency contraception today."
  },

  tests: [
    { id: "hiv", label: "HIV test (with her consent)", group: "Blood", essential: true },
    { id: "rpr", label: "Syphilis (RPR)", group: "Blood", essential: false, appropriate: true },
    { id: "sti", label: "STI screen (urine)", group: "Urine", essential: false, appropriate: true },
    { id: "pap", label: "Pap smear", group: "Other", essential: false, appropriate: false, why: "Cervical screening isn't done at 15. It starts later in adulthood (earlier for women living with HIV)." },
    { id: "us", label: "Pelvic ultrasound", group: "Imaging", essential: false, appropriate: false, why: "Not needed before contraception. It adds cost and fear." },
    { id: "fbc", label: "Full blood count", group: "Blood", essential: false, appropriate: false, why: "Nothing in her history or examination needs it before contraception." }
  ],

  results: {
    turnaround: "Rapid tests, 15 minutes.",
    reports: {
      hiv: { title: "HIV", rows: [ { analyte: "HIV rapid test", value: "Negative", unit: "", range: "Negative", flag: "", key: "hivneg" } ]},
      rpr: { title: "Syphilis", rows: [ { analyte: "RPR", value: "Non-reactive", unit: "", range: "Non-reactive", flag: "" } ]},
      sti: { title: "STI screen", rows: [ { analyte: "Chlamydia and gonorrhoea", value: "Results in 1 week", unit: "", range: "", flag: "" } ]},
      pap: { title: "Pap smear", text: "Not processed: outside the screening age." },
      us: { title: "Pelvic ultrasound", text: "Normal. (She waited 3 hours and missed her exam.)" },
      fbc: { title: "Full blood count", text: "Normal." }
    },
    significant: ["hivneg"],
    criticalNote: ""
  },

  diagnosis: {
    options: [
      { id: "offence", label: "A sexual offence against a child (a 23-year-old with a 15-year-old), with signs of coercion: report it", score: 100 },
      { id: "consensual", label: "A consensual relationship; she agreed, so no report is needed", score: 0 },
      { id: "teen", label: "Normal teenage sexual activity; give contraception and no further action", score: 0 },
      { id: "parent", label: "A family matter: her mother must decide", score: 10 }
    ],
    explain: "South African law allows consensual sexual activity between children aged 12 to 15, and between a 12–15-year-old and a 16–17-year-old who is no more than two years older. A 23-year-old with a 15-year-old is a sexual offence, whatever she says about consent. The gifts, the anger when she says no and ‘you owe me’ are signs of coercion. Health workers who know of a sexual offence against a child must report it."
  },

  medicationChart: {
    intro: "Today's prescription. Check every line.",
    lines: [
      { id: "implant", drug: "Etonogestrel implant", order: "68 mg, subdermal, inner upper arm; replace in 3 years", error: false },
      { id: "lng", drug: "Levonorgestrel (emergency contraception)", order: "1.5 mg orally, once, today", error: false },
      { id: "condoms", drug: "Male condoms", order: "Supply of 30, with lubricant", error: false },
      { id: "net", drug: "Norethisterone enanthate", order: "200 mg IM every 12 weeks (if she switches to an injection later)", error: true,
        why: "Norethisterone enanthate (Nur-Isterate) is given every 8 weeks. Medroxyprogesterone acetate (Depo-Provera) is the 12-weekly injection. Mixing them up leaves her unprotected." },
      { id: "doxy", drug: "Doxycycline", order: "100 mg twice a day for 7 days, to prevent STIs", error: true,
        why: "She has no symptoms and no diagnosis. Antibiotics don't prevent STIs this way; condoms do." }
    ]
  },

  management: {
    options: [
      { id: "report", label: "Report the sexual offence to a designated social worker (who involves the police), and record it", kind: "critical" },
      { id: "keep", label: "Keep her contraception and care going whatever happens with the report", kind: "critical" },
      { id: "tellfirst", label: "Tell her about the report before you make it", kind: "critical" },
      { id: "prep", label: "Offer HIV PrEP, given an older partner who refuses condoms", kind: "essential" },
      { id: "safety", label: "Make a safety plan with her: who she can call, where she can go", kind: "essential" },
      { id: "fu", label: "Book a follow-up in 4–6 weeks (STI results, PrEP, implant check)", kind: "essential" },
      { id: "youth", label: "Link her to the school health or youth-zone programme", kind: "essential" },
      { id: "refuse", label: "Refuse contraception until she ends the relationship", kind: "harmful", critical: "Made contraception conditional on ending a relationship." },
      { id: "warn", label: "Phone Sizwe to warn him to stay away from her", kind: "harmful", critical: "Contacted the alleged offender, putting the child at risk." },
      { id: "mother", label: "Phone her mother yourself to tell her everything", kind: "harmful", critical: "Disclosed an adolescent's sexual health care to a parent without her consent or a safeguarding process." }
    ]
  },

  followupPick: function () { return this.followup; },
  followup: {
    time: "Three months later",
    situation: "Lebo comes back. The social worker has been involved; Sizwe has stopped contacting her. She is doing well at school, but she has been spotting on and off since the implant and wants it out: “It's embarrassing.”",
    options: [
      { id: "options", label: "Explain that irregular bleeding is common and often settles; offer treatment for the bleeding, and remove it today if she still wants, with another method of her choice", correct: true },
      { id: "refuse", label: "Refuse removal: she'll fall pregnant", correct: false },
      { id: "remove", label: "Remove it and send her home with nothing", correct: false },
      { id: "dangerous", label: "Tell her the bleeding means something is wrong and remove it", correct: false }
    ],
    explain: "Irregular bleeding is the most common reason young women stop the implant. Explain it honestly and offer treatment, but it is her body: if she wants it out, remove it and help her choose another method so she isn't left unprotected."
  },

  extraFeedback: function (s) {
    var out = [];
    if (s.asked.indexOf("partner") === -1) out.push("You never asked how old her partner is. Ask every adolescent: it is how abuse is found.");
    return out;
  },
  exampleErrors: ["Breached an adolescent's right to confidential contraception.", "Withheld contraception from an adolescent entitled to it.", "Reported without telling the adolescent first."],

  learningPoints: [
    "From 12, a child can get contraception and an HIV test confidentially. No parent is needed.",
    "Ask every adolescent their partner's age. A large age gap is a safeguarding question, not a moral one.",
    "A 23-year-old with a 15-year-old is a sexual offence and must be reported, however the relationship is described.",
    "Tell her before you report. Explain, don't blame, and keep her care going.",
    "Her choice after full counselling. Long-acting methods suit adolescents well; add condoms, PrEP if needed, and emergency contraception after recent unprotected sex.",
    "No pelvic examination is needed to start contraception."
  ],

  support: "Childline South Africa: 116 (check numbers before use)."
});

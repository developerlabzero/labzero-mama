/*
 * LabZero Mama case: "Safe quick abortion, same day, no pain"
 * Content licence: CC BY 4.0 (see CONTENT_LICENSE.md). Code licence: MIT.
 *
 * FICTIONAL TRAINING CASE. Not for clinical use.
 * Clinical and legal content is pending review by an obstetrician-gynaecologist
 * experienced in post-abortion care.
 */
window.MAMA_CASES = window.MAMA_CASES || [];
window.MAMA_CASES.push({
  id: "septic-unsafe-abortion",
  version: "0.1.0",
  status: "Draft: pending clinical validation",
  title: "Safe quick abortion, same day, no pain",
  family: "Obstetrics: septic incomplete abortion after an unsafe abortion",
  why: "Legal termination of pregnancy is available in South Africa, but stigma, cost and not knowing where to go still push young women to street-pole ‘abortion doctors’. Unsafe abortion causes preventable maternal deaths. How she is received decides whether she trusts the clinic again.",
  setting: "Ikhwezi Community Health Centre emergency room, then the regional hospital gynaecology ward",
  patient: { name: "Palesa Molefe", age: 19, obstetric: "First-year student. First pregnancy, about 14 weeks", arrival: "Brought by her roommate in a minibus taxi at 12:25" },
  opening: "Please help me! I'm dying! Don't call the police!",
  steps: ["arrival", "vitals", "history", "exam", "triage", "tests", "results", "diagnosis", "meds", "manage", "followup", "counsel"],
  stepLabels: { arrival: "At the door", vitals: "Vitals", history: "Her story", exam: "Examine", triage: "Decision", counsel: "Afterwards" },
  stepSettings: {
    arrival: "Ikhwezi CHC · taxi at the front door · 12:25", vitals: "Ikhwezi CHC · emergency room",
    history: "Ikhwezi CHC · emergency room, curtains closed", exam: "Ikhwezi CHC · emergency room, with a chaperone",
    triage: "Ikhwezi CHC · deciding what happens next", tests: "Ikhwezi CHC, then the regional hospital",
    results: "Regional hospital · gynaecology admissions", diagnosis: "Regional hospital · gynaecology admissions",
    meds: "Regional hospital · gynaecology admissions", manage: "Regional hospital · gynaecology admissions",
    counsel: "Regional hospital · gynaecology ward, four days later", followup: "Regional hospital · gynaecology ward, the first night"
  },
  sceneDomains: { arrival: "dignity", counsel: "counselling" },
  domains: [
    { id: "dignity", label: "Care without judgement" }, { id: "vitals", label: "Recognising sepsis" },
    { id: "history", label: "History taking" }, { id: "assessment", label: "Examination" },
    { id: "prioritisation", label: "Clinic decision" }, { id: "investigations", label: "Test selection" },
    { id: "interpretation", label: "Result interpretation" }, { id: "diagnosis", label: "Diagnosis" },
    { id: "medication", label: "Medication safety" }, { id: "management", label: "Management" },
    { id: "counselling", label: "Post-abortion care" }, { id: "monitoring", label: "Monitoring and response" }
  ],

  tuto: {
    arrival: "Your face and your first sentence decide whether she tells you the truth. Care first. Judgement never, from you or from your colleagues.",
    vitals: "Fever, a fast pulse, low blood pressure and fast breathing after a pregnancy: think sepsis. And count the blood on the pads.",
    history: "You need the facts that change treatment: when, what was done, how many weeks, fever, allergies. Ask plainly and kindly.",
    exam: "The speculum examination is treatment as well as assessment: tissue stuck in the cervix keeps it bleeding.",
    triage: "Sepsis kills in hours. Antibiotics and fluids start here, before the ambulance, not after.",
    tests: "You need to know: how sick (lactate, kidneys, platelets), how much blood (Hb, crossmatch, Rh group), and what is left in the uterus (ultrasound).",
    counsel: "Confidential, practical and kind: her future fertility, contraception, and where to go for safe, legal care next time."
  },

  monitor: function (s) {
    var later = ["results", "diagnosis", "meds", "manage", "counsel", "followup", "debrief"].indexOf(s.stepId) !== -1;
    return [
      { k: "Temp", v: "39.2", u: "°C", alert: true },
      { k: "HR", v: s.stepId === "followup" ? "138" : "124", u: "/min", alert: true },
      { k: "BP", v: s.stepId === "followup" ? "80/44" : "88/52", u: "mmHg", alert: true },
      { k: "Lactate", v: later ? "4.6" : "?", u: "mmol/L", alert: later }
    ];
  },

  scenes: {
    arrival: {
      title: "In the taxi",
      lead: "Palesa is curled up on the back seat, screaming. Her skirt is soaked with blood and there is a strong, rotten smell. Her roommate Kgomotso is holding her hand.",
      turns: [
        { speaker: "Palesa", line: "Please help me! I'm dying! Don't call the police! Don't tell my mother!",
          options: [
            { text: "“Palesa, I'm a nurse. You're safe. We're here to help you, not to judge you. Let's get you inside now.”", score: 100, reply: "She grabs your arm and lets you help her onto the trolley." },
            { text: "“What did you do?!”", score: 0, flag: "Opened with blame when a young woman arrived bleeding after an unsafe abortion.", reply: "She turns her face away and stops answering." },
            { text: "“Calm down first, then we'll help you.”", score: 20, reply: "She screams louder. She can't calm down; she is in agony." }
          ]},
        { speaker: "Staff Nurse Khoza", line: "Another one who killed her baby. Let her wait. She did this to herself.",
          options: [
            { text: "“Not now, Sister. She's septic and bleeding, and she gets the same urgent care as anyone else. Please bring the trolley and the IV tray.”", score: 100, reply: "Sister Khoza hesitates, then goes for the trolley." },
            { text: "Say nothing and carry on.", score: 30, reply: "Palesa heard every word. She stops telling you anything." },
            { text: "“You're right, but we still have to see her.”", score: 0, flag: "Agreed with a colleague's judgement of a patient seeking post-abortion care.", reply: "Palesa starts to cry silently." }
          ]},
        { speaker: "Kgomotso, her roommate", line: "It was a man from a pamphlet on the traffic light. R500. Please, nobody must know.",
          options: [
            { text: "“Thank you for bringing her, and for telling me. It helps us treat her. What she tells us stays confidential.”", score: 100, reply: "Kgomotso hands you the pamphlet: “Safe quick abortion, same day, no pain.”" },
            { text: "“You should both be arrested.”", score: 0, flag: "Threatened a patient and her friend with the police.", reply: "Kgomotso runs out of the room." },
            { text: "“That's not my business. Wait outside.”", score: 30, reply: "She leaves with the information you needed." }
          ]}
      ],
      teach: "Women who have had an unsafe abortion often delay care because they fear judgement or arrest. Receive her kindly, stop stigma from colleagues, and keep her information confidential.",
      next: "Take her vital signs"
    },

    counsel: {
      title: "Four days later",
      lead: "Palesa is back on the ward after her operation and two nights in ICU. Her fever has gone and she is drinking tea. She asks to speak to you alone.",
      turns: [
        { speaker: "Palesa", line: "Did you tell the police? Does my mother know?",
          options: [
            { text: "“No. Your care is confidential. Nobody has been told without your permission. If you'd like help talking to your mother one day, we can do that together.”", score: 100, reply: "Her shoulders drop. “Thank you.”" },
            { text: "“The hospital has to report these things.”", score: 0, flag: "Gave false information that her abortion would be reported.", reply: "She asks to sign herself out." },
            { text: "“Your mother has a right to know.”", score: 10, flag: "Pressured an adult patient to disclose her care to a parent.", reply: "She looks away." }
          ]},
        { speaker: "Palesa", line: "Will I still be able to have children one day?",
          options: [
            { text: "“The surgeons repaired the small hole in your womb, and they expect it to heal. Many women go on to have children after this. Infection can sometimes affect fertility, so if you have trouble falling pregnant later, tell your doctor about this admission.”", score: 100, reply: "She nods slowly. “I want children. Just not now.”" },
            { text: "“After what you did, maybe not.”", score: 0, flag: "Used fertility as punishment.", reply: "She starts sobbing." },
            { text: "“Don't worry about that now.”", score: 30, reply: "She keeps worrying, alone." }
          ]},
        { speaker: "Palesa", line: "I didn't know where to go. The clinic sister said they don't do that there.",
          options: [
            { text: "“In South Africa you can have a legal, safe termination at a designated facility: on request up to 12 weeks, and from 13 to 20 weeks under certain conditions. Here's where to go. And before you leave today, let's choose a contraceptive that suits you.”", score: 100, reply: "She chooses an implant and keeps the information sheet." },
            { text: "“Just don't get pregnant again.”", score: 10, reply: "She leaves with no contraception." },
            { text: "“Abortion is wrong, so I can't help you with that.”", score: 0, flag: "Withheld information about legal termination and contraception.", reply: "She leaves with no information at all." }
          ]}
      ],
      teach: "Post-abortion care includes confidentiality, honest information about fertility, contraception before she leaves, and information on where to get a legal, safe termination. Personal beliefs must not block a patient from information."
    }
  },

  vitals: [
    { id: "temp", label: "Temperature", value: "39.2", unit: "°C", abnormal: true, essential: true, line: "I'm so cold. I can't stop shaking." },
    { id: "pulse", label: "Pulse", value: "124", unit: "/min", abnormal: true, essential: true, line: "My heart is pounding." },
    { id: "bp", label: "Blood pressure", value: "88/52", unit: "mmHg", abnormal: true, essential: true, line: "I feel like I'm going to faint." },
    { id: "rr", label: "Breathing rate", value: "26", unit: "/min", abnormal: true, essential: true, line: "(panting with the pain)" },
    { id: "spo2", label: "Oxygen saturation", value: "95", unit: "%", abnormal: false, essential: false, line: "" },
    { id: "pads", label: "Pad check", value: "Pad soaked through in 30 minutes; clots; foul smell", unit: "", abnormal: true, essential: true, line: "It hasn't stopped since Friday." },
    { id: "hb", label: "Haemoglobin (finger prick)", value: "8.1", unit: "g/dL", abnormal: true, essential: true, line: "Everything is spinning." },
    { id: "glucose", label: "Finger-prick glucose", value: "6.8", unit: "mmol/L", abnormal: false, essential: false, line: "" }
  ],

  history: {
    speaker: "Palesa", speakerRole: "the patient", title: "Her story",
    prompt: "Behind closed curtains. She is in severe pain; keep questions short. She answers only from her approved case script.",
    intents: [
      { id: "what", chip: "Can you tell me what happened?", critical: true,
        keywords: ["what happened", "what did", "abortion", "tell me", "happened", "done"],
        reply: "I went to a man from a pamphlet. I didn't want anyone to know I was pregnant." },
      { id: "when", chip: "When was this?", critical: true,
        keywords: ["when", "how long", "days", "friday", "since"], reply: "Friday. Three days ago." },
      { id: "method", chip: "What did he do or give you?", critical: true,
        keywords: ["method", "do", "give", "pills", "pipe", "insert", "inside", "tablets", "instrument"],
        reply: "He pushed a thin pipe inside me. It hurt so much. Then he gave me four pills to drink and said it would come out at home." },
      { id: "weeks", chip: "How many weeks pregnant were you?", critical: true,
        keywords: ["weeks", "months", "last period", "lmp", "far", "pregnant"],
        reply: "My last period was in July. About three and a half months, I think." },
      { id: "fever", chip: "Have you had fever or a bad-smelling discharge?", critical: true,
        keywords: ["fever", "hot", "smell", "discharge", "shaking", "chills", "infection"],
        reply: "Since yesterday I'm burning and shaking. It smells rotten. I'm so ashamed." },
      { id: "allergy", chip: "Are you allergic to any medicines?", critical: true,
        keywords: ["allergic", "allergy", "allergies", "penicillin", "reaction"], reply: "No. Not that I know." },
      { id: "passed", chip: "Has anything come out, like tissue or the pregnancy?", critical: false,
        keywords: ["tissue", "come out", "passed", "baby", "clots", "lumps"],
        reply: "Big clots and something like liver. I don't know if the baby came out. I'm scared it's still inside." },
      { id: "pain", chip: "Where is the pain?", critical: false,
        keywords: ["pain", "where", "hurt", "cramps", "belly"], reply: "Low down, all across. Like the worst period, but it never stops." },
      { id: "hiv", chip: "Do you know your HIV status?", critical: false,
        keywords: ["hiv", "status", "tested"], reply: "Negative, in March." },
      { id: "support", chip: "Who knows you're here?", critical: false,
        keywords: ["who knows", "family", "mother", "support", "boyfriend", "partner"],
        reply: "Only Kgomotso. My boyfriend stopped answering when I told him. My mother will kill me." },
      { id: "prev", chip: "Any previous pregnancies?", critical: false,
        keywords: ["previous", "before", "first", "children"], reply: "No. This was the first." },
      { id: "contra", chip: "Were you using contraception?", critical: false,
        keywords: ["contraception", "family planning", "injection", "pill", "condom", "prevent"],
        reply: "The injection, but I missed my date because the clinic was closed for the strike." }
    ],
    fallback: "(groaning) I don't understand. Please ask me again."
  },

  examTitle: "Examine her",
  examLead: "With her consent and a female chaperone. The finding appears when you perform each examination.",
  exam: [
    { id: "perfusion", label: "Skin and perfusion", essential: true, finding: "Pale, clammy, cold hands. Capillary refill 4 seconds." },
    { id: "abdomen", label: "Abdominal examination", essential: true, finding: "Lower abdomen tender with mild guarding just above the pubic bone. Not rigid. Uterus felt just above the pubic bone." },
    { id: "speculum", label: "Speculum examination", essential: true, finding: "Foul brown-red discharge. The cervix is open with tissue in it; you remove it with sponge forceps and the bleeding slows. A small tear on the front of the cervix. No foreign body seen." },
    { id: "bimanual", label: "Bimanual examination", essential: true, finding: "Uterus about 12-week size, soft and very tender. Pain when the cervix is moved. No mass beside the uterus." },
    { id: "chest", label: "Chest", essential: false, finding: "Clear. Breathing fast." },
    { id: "breasts", label: "Breast examination", essential: false, finding: "Normal." }
  ],

  triage: {
    title: "What happens next?",
    question: "You are the clinic doctor. Decide",
    vitals: [
      { label: "Temperature", value: "39.2", unit: "°C", flag: "high" },
      { label: "BP", value: "88/52", unit: "mmHg", flag: "high" },
      { label: "Pulse", value: "124", unit: "/min", flag: "high" },
      { label: "Bleeding", value: "Pad in 30 min, foul", unit: "", flag: "high" }
    ],
    look: "Palesa is shaking with fever and clutching her belly. Kgomotso asks: “Can she just get pills and go home?”",
    options: [
      { id: "red", label: "Emergency: treat and transfer", detail: "Two IV lines and fluids, first doses of IV antibiotics now, then a priority 1 transfer to hospital gynaecology for evacuation of the uterus", score: 100 },
      { id: "transfer", label: "Transfer only", detail: "Call an ambulance; the hospital will start treatment", score: 30, critical: "Delayed antibiotics and fluids in septic shock until after transfer." },
      { id: "oral", label: "Oral antibiotics", detail: "Oral antibiotics and pain tablets; review tomorrow", score: 0, critical: "Sent home a woman in septic shock after an unsafe abortion." },
      { id: "police", label: "Wait for the police", detail: "Report the abortion and wait for SAPS before treating", score: 0, critical: "Delayed emergency care to involve the police." }
    ],
    feedback: "Fever, a fast pulse, low blood pressure and fast breathing after an unsafe abortion mean sepsis, probably septic shock. Antibiotics and fluids must start at the clinic within the hour. The source, infected tissue in the uterus, must be removed at the hospital as soon as possible."
  },

  tests: [
    { id: "fbc", label: "Full blood count", group: "Blood", essential: true },
    { id: "ue", label: "Kidney function and electrolytes", group: "Blood", essential: true },
    { id: "lactate", label: "Lactate", group: "Blood", essential: true },
    { id: "cultures", label: "Blood cultures (before antibiotics if no delay)", group: "Blood", essential: true },
    { id: "xm", label: "Blood group (including Rh) and crossmatch", group: "Blood", essential: true },
    { id: "us", label: "Pelvic ultrasound", group: "Imaging", essential: true },
    { id: "clot", label: "Clotting (INR)", group: "Blood", essential: false, appropriate: true },
    { id: "hiv", label: "HIV test", group: "Blood", essential: false, appropriate: true },
    { id: "bhcg", label: "Serum beta-hCG level", group: "Blood", essential: false, appropriate: false, why: "We already know she was pregnant. The ultrasound tells you what is left in the uterus; the hCG number doesn't change what you do today." },
    { id: "ct", label: "CT abdomen and pelvis", group: "Imaging", essential: false, appropriate: false, why: "Not first-line. Ultrasound and examination answer the question; a CT adds delay. Use it only if you suspect an abscess or bowel injury that ultrasound can't show." }
  ],

  results: {
    turnaround: "Hospital results within the hour (simulated). Ultrasound at the bedside.",
    reports: {
      fbc: { title: "Full blood count", rows: [
        { analyte: "Haemoglobin", value: "7.9", unit: "g/dL", range: "12.0–15.0", flag: "L", key: "hb" },
        { analyte: "White cells", value: "21.4", unit: "×10⁹/L", range: "4.0–11.0", flag: "H", key: "wcc" },
        { analyte: "Platelets", value: "96", unit: "×10⁹/L", range: "150–400", flag: "L", key: "plt" } ]},
      ue: { title: "Kidney function", rows: [
        { analyte: "Creatinine", value: "148", unit: "µmol/L", range: "49–90", flag: "H", key: "creat" },
        { analyte: "Potassium", value: "4.6", unit: "mmol/L", range: "3.5–5.1", flag: "" } ]},
      lactate: { title: "Lactate", rows: [
        { analyte: "Lactate", value: "4.6", unit: "mmol/L", range: "< 2.0", flag: "H", critical: true, key: "lac" } ]},
      cultures: { title: "Blood cultures", text: "Taken. Results in 48 hours." },
      xm: { title: "Blood group", rows: [
        { analyte: "ABO and Rh group", value: "O, RhD negative", unit: "", range: "", flag: "", key: "rhneg" },
        { analyte: "Crossmatch", value: "2 units ready", unit: "", range: "", flag: "" } ]},
      us: { title: "Pelvic ultrasound: fetal parts and placenta still in the uterus", rows: [
        { analyte: "Uterine contents", value: "Retained tissue, 38 mm", unit: "", range: "Empty", flag: "H", key: "retained" },
        { analyte: "Fetal heart", value: "Absent", unit: "", range: "", flag: "", key: "nofh" },
        { analyte: "Free fluid", value: "Small, behind uterus", unit: "", range: "None", flag: "H", key: "fluid" } ]},
      clot: { title: "Clotting", rows: [ { analyte: "INR", value: "1.4", unit: "", range: "0.8–1.2", flag: "H" } ]},
      hiv: { title: "HIV", rows: [ { analyte: "HIV rapid test", value: "Negative", unit: "", range: "Negative", flag: "" } ]},
      bhcg: { title: "Serum beta-hCG", rows: [ { analyte: "Beta-hCG", value: "18 400", unit: "IU/L", range: "", flag: "" } ]},
      ct: { title: "CT abdomen and pelvis", text: "Retained products. Small pelvic fluid. No abscess. (Waited 3 hours.)" }
    },
    significant: ["hb", "wcc", "plt", "creat", "lac", "rhneg", "retained", "nofh", "fluid"],
    criticalNote: "Lactate 4.6 mmol/L with low blood pressure: septic shock. Antibiotics within the hour, fluids, and urgent removal of the infected tissue."
  },

  diagnosis: {
    options: [
      { id: "septic", label: "Septic incomplete abortion (unsafe abortion) with septic shock and acute kidney injury", score: 100 },
      { id: "threat", label: "Threatened miscarriage; the pregnancy is continuing", score: 0 },
      { id: "complete", label: "Complete miscarriage", score: 10 },
      { id: "ectopic", label: "Ectopic pregnancy", score: 10 },
      { id: "pid", label: "Pelvic inflammatory disease", score: 10 },
      { id: "normal", label: "Normal bleeding after an abortion", score: 0 }
    ],
    explain: "The ultrasound answers the question everyone was asking: there is no fetal heartbeat, and fetal parts and placenta are still in the uterus. The pregnancy has ended but the abortion is incomplete, and the retained tissue is infected. Fever, low blood pressure, a high lactate, raised white cells, low platelets and a rising creatinine mean septic shock with kidney injury. The small amount of free fluid and the guarding mean you must keep a perforated uterus in mind."
  },

  medicationChart: {
    intro: "Admission chart, gynaecology ward. Check every line.",
    lines: [
      { id: "amp", drug: "Ampicillin", order: "2 g IV 6-hourly", error: false },
      { id: "gent", drug: "Gentamicin", order: "5 mg/kg IV once daily; check kidney function and levels", error: false },
      { id: "metro", drug: "Metronidazole", order: "500 mg IV 8-hourly", error: false },
      { id: "antid", drug: "Anti-D immunoglobulin", order: "Not needed: pregnancy under 20 weeks", error: true,
        why: "She is RhD negative. Anti-D is needed after an abortion or miscarriage, given within 72 hours, to protect future pregnancies." },
      { id: "ibu", drug: "Ibuprofen", order: "400 mg 8-hourly for pain", error: true,
        why: "NSAIDs can worsen kidney injury in sepsis and impair clotting when platelets are low and she is bleeding. Use paracetamol and titrated opioids." },
      { id: "td", drug: "Tetanus and diphtheria vaccine (Td)", order: "0.5 mL IM", error: false },
      { id: "oxy", drug: "Oxytocin", order: "20 units in 1 L Ringer's lactate IV, to reduce bleeding before evacuation", error: false }
    ]
  },

  management: {
    options: [
      { id: "abx", label: "Give IV antibiotics within the first hour and continue them", kind: "critical" },
      { id: "evac", label: "Evacuate the uterus (manual vacuum aspiration or in theatre) as soon as antibiotics are running", kind: "critical" },
      { id: "fluids", label: "Give fluid boluses and reassess; give blood; catheterise and measure urine output", kind: "critical" },
      { id: "confid", label: "Keep her care confidential", kind: "critical" },
      { id: "antid", label: "Give anti-D within 72 hours (she is RhD negative)", kind: "essential" },
      { id: "senior", label: "Involve a senior doctor and consider high care; watch for signs of uterine perforation", kind: "essential" },
      { id: "contra", label: "Offer contraception before discharge", kind: "essential" },
      { id: "counsel", label: "Offer counselling and follow-up", kind: "essential" },
      { id: "police", label: "Report her to the police for having an illegal abortion", kind: "harmful", critical: "Breached confidentiality and reported a patient seeking post-abortion care." },
      { id: "name", label: "Make her name the person who did it before you treat her", kind: "harmful", critical: "Made treatment conditional on information." },
      { id: "mother", label: "Phone her mother to come and fetch her", kind: "harmful", critical: "Disclosed an adult patient's care without her consent." }
    ]
  },

  followupPick: function () { return this.followup; },
  followup: {
    time: "The first night on the ward, four hours after the evacuation",
    situation: "Palesa's blood pressure has fallen to 80/44 despite 2 litres of fluid and antibiotics. Pulse 138. She has passed 40 mL of urine in four hours. Her abdomen is now rigid all over and very tender.",
    options: [
      { id: "escalate", label: "Call the senior doctor and surgeon now: suspected uterine perforation with peritonitis. Prepare for a laparotomy, contact ICU, and continue resuscitation", correct: true },
      { id: "fluid", label: "Another litre of fluid and reassess in the morning", correct: false },
      { id: "abx", label: "Change the antibiotics and wait", correct: false },
      { id: "pain", label: "Give morphine for the pain and let her sleep", correct: false }
    ],
    explain: "Worsening shock and a rigid abdomen after evacuation, with free fluid on the first scan, point to a perforated uterus with peritonitis: the instrument used in the backstreet abortion may have gone through the uterine wall. Antibiotics cannot fix this. She needs source control in theatre and intensive care, now."
  },

  extraFeedback: function () { return []; },
  exampleErrors: ["Opened with blame when a young woman arrived bleeding after an unsafe abortion.", "Delayed antibiotics and fluids in septic shock until after transfer.", "Missed a prescribing error: Anti-D immunoglobulin, Not needed: pregnancy under 20 weeks."],

  learningPoints: [
    "Fever, a fast pulse and low blood pressure after an abortion is septic shock until proven otherwise.",
    "Antibiotics within the hour and fluids at the clinic; evacuation of the infected tissue as soon as possible.",
    "Remove tissue from the cervix during the speculum examination: it reduces bleeding.",
    "Ultrasound answers ‘is the pregnancy still there?’ and shows retained tissue.",
    "Rh-negative women need anti-D after an abortion or miscarriage.",
    "A rigid abdomen and worsening shock after an unsafe abortion suggest perforation: call the surgeon.",
    "Care without judgement, confidentiality, contraception, and information about legal termination prevent the next unsafe abortion."
  ],

  support: "Termination of pregnancy is legal in South Africa at designated public facilities. Any clinic can tell a woman where her nearest designated facility is."
});

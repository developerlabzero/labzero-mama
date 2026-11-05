/*
 * LabZero Mama case: "She's coughing all over us"
 * Content licence: CC BY 4.0 (see CONTENT_LICENSE.md). Code licence: MIT.
 *
 * FICTIONAL TRAINING CASE. Not for clinical use.
 * Clinical content is pending review by a TB/HIV clinician and a pharmacist
 * (TB treatment in pregnancy, ART timing, rifampicin–dolutegravir interaction).
 */
window.MAMA_CASES = window.MAMA_CASES || [];
window.MAMA_CASES.push({
  id: "tb-hiv-pregnancy",
  version: "0.1.0",
  status: "Draft: pending clinical validation",
  title: "She's coughing all over us",
  family: "Infectious disease in pregnancy: TB with newly diagnosed HIV",
  why: "TB and HIV together are among the leading causes of maternal death in South Africa. A cough in a crowded waiting room is also an infection-control emergency. Finding TB, testing for HIV again in pregnancy, and starting both treatments safely protects the mother, the baby and everyone on the bench.",
  setting: "Ikhwezi Community Health Centre",
  patient: { name: "Nosipho Cele", age: 30, obstetric: "Second pregnancy, 24 weeks. Booked at 16 weeks", arrival: "Ticket 063 · in the queue since 09:30, coughing" },
  opening: "Sorry, sorry. I can't stop coughing.",
  steps: ["records", "vitals", "history", "exam", "triage", "tests", "results", "diagnosis", "meds", "manage", "counsel", "followup"],
  stepLabels: { records: "The bench", vitals: "Vitals", history: "Her story", exam: "Examine", triage: "Next step", counsel: "HIV result", followup: "Week 3" },
  stepSettings: {
    records: "Ikhwezi CHC · waiting area, then the file room", vitals: "Ikhwezi CHC · cough triage area (outside, ventilated)",
    history: "Ikhwezi CHC · consulting room, window open", exam: "Ikhwezi CHC · consulting room, window open",
    triage: "Ikhwezi CHC", tests: "Ikhwezi CHC", results: "Ikhwezi CHC · two days later",
    diagnosis: "Ikhwezi CHC", meds: "Ikhwezi CHC", manage: "Ikhwezi CHC",
    counsel: "Ikhwezi CHC · counselling room", followup: "Ikhwezi CHC · three weeks into treatment"
  },
  sceneDomains: { counsel: "counselling" },
  domains: [
    { id: "experience", label: "Infection control and dignity" }, { id: "vitals", label: "Vitals" },
    { id: "history", label: "TB and HIV history" }, { id: "assessment", label: "Examination" },
    { id: "prioritisation", label: "Next step" }, { id: "investigations", label: "Test selection" },
    { id: "interpretation", label: "Result interpretation" }, { id: "diagnosis", label: "Diagnosis" },
    { id: "medication", label: "Medication safety" }, { id: "management", label: "Management" },
    { id: "counselling", label: "HIV post-test counselling" }, { id: "monitoring", label: "Monitoring and response" }
  ],

  tuto: {
    records: "Protect everyone on the bench without shaming her: a mask, fresh air and a fast track are infection control. Pushing her outside alone is stigma.",
    vitals: "Weight is a TB vital sign. Compare it with her booking weight.",
    history: "TB symptom screen: cough, fever, night sweats, weight loss. Then contacts at home, and her HIV testing history in this pregnancy.",
    tests: "In South Africa, a molecular sputum test (Xpert) is the first test for TB, and every pregnant woman needs repeat HIV testing. If she's HIV positive, a CD4 count and baseline liver and kidney tests come before treatment.",
    meds: "TB medicines and ART interact. Check the weight band, check what's unsafe in pregnancy, and check whether rifampicin changes the ART dose.",
    counsel: "Post-test counselling: give the result clearly, without blame; answer her fears about the baby and her partner; disclosure is her choice."
  },

  monitor: function (s) {
    var res = ["results", "diagnosis", "meds", "manage", "counsel", "followup", "debrief"].indexOf(s.stepId) !== -1;
    return [
      { k: "Cough", v: "5", u: "weeks", alert: true },
      { k: "SpO₂", v: "94", u: "%", alert: true },
      { k: "Weight", v: s.vitalsTaken.indexOf("weight") !== -1 ? "52" : "?", u: s.vitalsTaken.indexOf("weight") !== -1 ? "kg (−8)" : "kg", alert: s.vitalsTaken.indexOf("weight") !== -1 },
      { k: "HIV", v: res ? "Positive" : "?", u: res ? "CD4 180" : "", alert: res }
    ];
  },

  file: {
    title: "Antenatal card and folder",
    entries: [
      "Booking at 16 weeks: weight 60 kg. HIV negative. RPR negative. Hb 11.8.",
      "20 weeks: repeat HIV test due. “Test kits out of stock.” Not done.",
      "Previous pregnancy (2023): son, normal birth.",
      "Household: husband treated for TB in 2025, “defaulted after 2 months”."
    ]
  },

  scenes: {
    records: {
      title: "The bench",
      lead: "Nosipho coughs into her scarf every few seconds. The people on either side have moved away.",
      turns: [
        { speaker: "A man on the next bench", line: "Nurse! That woman is coughing all over us! Put her outside! We'll all get it!",
          options: [
            { text: "“You're right to be careful. I'm giving her a mask and taking her to the cough area where there's fresh air, and she'll be seen first. Let's open the windows here too.”", score: 100, reply: "The man sits back, satisfied. Nosipho puts on the mask and follows you." },
            { text: "“Ma'am, please go and wait outside in the sun.”", score: 30, reply: "She waits outside alone, with no mask and no idea when she'll be called." },
            { text: "Ignore him. Everyone must wait their turn.", score: 0, flag: "Left a coughing patient in a crowded waiting room without infection control.", reply: "She coughs for another two hours on a full bench." }
          ]},
        { speaker: "Nosipho", line: "Everybody's staring. They think I have the ‘three letters’. I'm pregnant, I just have a bad cough.",
          options: [
            { text: "“Nobody is judging you here. We do this for everyone with a long cough, to protect you and the people around you. Let's find out what's causing it.”", score: 100, reply: "She nods and adjusts the mask." },
            { text: "“Well, you probably do have TB.”", score: 0, flag: "Labelled a patient with a diagnosis in public before testing.", reply: "The bench goes silent. She looks at the floor." },
            { text: "Say nothing.", score: 40, reply: "She feels ashamed all the way to the cough area." }
          ]}
      ]
    },

    counsel: {
      title: "Her HIV result",
      lead: "In the counselling room, with the door closed. Her husband is at work.",
      turns: [
        { speaker: "Nosipho", line: "Positive? But I was negative when I booked! How can it change in two months?",
          options: [
            { text: "“That's why we test again during pregnancy. The infection was probably very recent. That's nobody's fault, and it's important we found it now, because treatment protects you and the baby.”", score: 100, reply: "She cries quietly. “So my husband…” She doesn't finish." },
            { text: "“Someone has been unfaithful.”", score: 0, flag: "Blamed and speculated during HIV post-test counselling.", reply: "She stops listening." },
            { text: "“The test at booking must have been wrong.”", score: 20, reply: "She now doubts both results." }
          ]},
        { speaker: "Nosipho", line: "If I tell my husband, he'll leave me. Or worse.",
          options: [
            { text: "“Telling him is your choice, in your time. I can help you plan how, or we can tell him together. Are you safe at home? And he needs to be tested and treated too, for HIV and for his TB.”", score: 100, reply: "“He's not violent. Just proud.” She agrees to come back with him next week." },
            { text: "“You must tell him today. It's the law.”", score: 10, flag: "Pressured a patient to disclose her HIV status.", reply: "She decides not to come back." },
            { text: "“I'll phone him and tell him for you.”", score: 0, flag: "Planned to disclose a patient's HIV status without her consent.", reply: "She grabs her bag and leaves." }
          ]},
        { speaker: "Nosipho", line: "Will my baby be born with HIV? Can I still breastfeed?",
          options: [
            { text: "“If you take your treatment every day and your viral load becomes undetectable, the chance of passing HIV to your baby is very low. The baby gets medicine at birth and is tested, and yes, you can breastfeed while on treatment.”", score: 100, reply: "She lets out a long breath. “Then I'll take it every day.”" },
            { text: "“Probably. Most babies of positive mothers get it.”", score: 0, flag: "Gave false information about mother-to-child transmission.", reply: "She feels hopeless." },
            { text: "“Don't breastfeed at all.”", score: 20, reply: "Formula without clean water or money is a risk of its own." }
          ]}
      ],
      teach: "Post-test counselling: a clear result, no blame, hope based on facts (very low transmission with suppressed viral load), disclosure as her choice with support, safety screening, and partner testing.",
      next: "Three weeks later"
    }
  },

  vitals: [
    { id: "temp", label: "Temperature", value: "37.8", unit: "°C", abnormal: true, essential: true, line: "I'm wet with sweat every night." },
    { id: "pulse", label: "Pulse", value: "108", unit: "/min", abnormal: true, essential: true, line: "" },
    { id: "rr", label: "Breathing rate", value: "24", unit: "/min", abnormal: true, essential: true, line: "(coughing)" },
    { id: "spo2", label: "Oxygen saturation", value: "94", unit: "%", abnormal: true, essential: true, line: "" },
    { id: "weight", label: "Weight (compare with booking)", value: "52 kg (60 kg at 16 weeks)", unit: "", abnormal: true, essential: true, line: "My clothes are falling off, even with the baby." },
    { id: "bp", label: "Blood pressure", value: "104/66", unit: "mmHg", abnormal: false, essential: true, line: "" },
    { id: "fhr", label: "Fetal heart rate", value: "148", unit: "/min", abnormal: false, essential: true, line: "" }
  ],

  history: {
    speaker: "Nosipho", speakerRole: "the patient", title: "Her story",
    prompt: "Window open, both of you masked. Ask in your own words. She answers only from her approved case script.",
    intents: [
      { id: "cough", chip: "How long have you been coughing? Is anything coming up?", critical: true,
        keywords: ["cough", "how long", "sputum", "phlegm", "weeks"], reply: "Five weeks. Yellow phlegm. Once a little blood." },
      { id: "sweats", chip: "Any fever, night sweats or weight loss?", critical: true,
        keywords: ["fever", "sweats", "night", "weight", "thin", "lost"], reply: "Sweats every night. I've lost weight, even though I'm pregnant." },
      { id: "contacts", chip: "Has anyone at home had TB or a long cough?", critical: true,
        keywords: ["home", "contact", "anyone", "tb", "husband", "family", "cough"], reply: "My husband had TB last year. He stopped the tablets after two months; he said he felt better. He still coughs." },
      { id: "hivtest", chip: "When were you last tested for HIV?", critical: true,
        keywords: ["hiv", "test", "tested", "status", "last"], reply: "At booking, at 16 weeks. Negative. They were supposed to test again but there were no kits." },
      { id: "children", chip: "Who lives with you, especially children?", critical: true,
        keywords: ["children", "child", "son", "who lives", "kids", "baby at home"], reply: "My husband and our son, Lwandle. He's three." },
      { id: "prevtb", chip: "Have you had TB before?", critical: false,
        keywords: ["before", "previous", "ever", "had tb"], reply: "Never." },
      { id: "moves", chip: "Is the baby moving well?", critical: false,
        keywords: ["moving", "kicks", "movements"], reply: "Yes, but less than with my son." },
      { id: "chest", chip: "Any chest pain or shortness of breath?", critical: false,
        keywords: ["chest", "pain", "breath", "breathless", "short"], reply: "A pain on the right when I cough. I get tired walking up the hill." },
      { id: "alcohol", chip: "Do you drink alcohol or smoke?", critical: false,
        keywords: ["alcohol", "drink", "smoke", "cigarettes"], reply: "No." },
      { id: "meds", chip: "Are you taking any medicines?", critical: false,
        keywords: ["medicine", "tablets", "taking", "pills"], reply: "Only the pregnancy vitamins. And cough mixture from the shop." }
    ],
    fallback: "(coughing) Sorry, say again?"
  },

  examTitle: "Examine her",
  examLead: "With her consent, both of you masked, window open. The finding appears when you perform each examination.",
  exam: [
    { id: "chest", label: "Chest examination", essential: true, finding: "Crackles and bronchial breathing in the right upper zone." },
    { id: "nodes", label: "Lymph nodes", essential: true, finding: "Small firm nodes in the neck, both sides." },
    { id: "mouth", label: "Mouth", essential: true, finding: "White plaques on the tongue and palate that scrape off (oral thrush)." },
    { id: "fundus", label: "Fundal height", essential: true, finding: "21 cm at 24 weeks: a little small for dates." },
    { id: "abdo", label: "Abdomen (liver, spleen)", essential: false, finding: "No enlarged liver or spleen." }
  ],

  triage: {
    title: "What next?",
    question: "She is stable (SpO₂ 94%, talking in full sentences). Decide",
    vitals: [
      { label: "Cough", value: "5 weeks, blood once", unit: "", flag: "high" },
      { label: "Weight", value: "−8 kg in pregnancy", unit: "", flag: "high" },
      { label: "Contact", value: "Husband, untreated TB", unit: "", flag: "high" },
      { label: "Oral thrush", value: "Present", unit: "", flag: "high" }
    ],
    look: "Nosipho asks: “Can't you just give me a stronger cough mixture?”",
    options: [
      { id: "test", label: "Test today", detail: "Sputum for Xpert today, an HIV test today, CD4 and baseline bloods if positive, and keep the mask on; review with results in 2 days", score: 100 },
      { id: "abx", label: "Antibiotics and review", detail: "Amoxicillin for a chest infection; review in 2 weeks if not better", score: 10, critical: "Treated a 5-week cough with weight loss as a chest infection without testing for TB." },
      { id: "empiric", label: "Start TB treatment now", detail: "Start TB treatment today without a sputum test", score: 40, critical: "Started TB treatment without trying to confirm the diagnosis." },
      { id: "after", label: "Wait until after the birth", detail: "Investigate after delivery to protect the baby", score: 0, critical: "Delayed TB investigation until after pregnancy." }
    ],
    feedback: "Five weeks of cough, night sweats, weight loss in pregnancy, a household contact with untreated TB and oral thrush (a sign of HIV) make TB very likely. Test today: a sputum Xpert, and a repeat HIV test that was missed at 20 weeks. She is stable, so she can be managed as an outpatient while results come back."
  },

  tests: [
    { id: "xpert", label: "Sputum Xpert MTB/RIF Ultra", group: "TB", essential: true },
    { id: "hiv", label: "HIV rapid test (repeat in pregnancy)", group: "HIV", essential: true },
    { id: "cd4", label: "CD4 count (if HIV positive)", group: "HIV", essential: true },
    { id: "lft", label: "Liver function (baseline before TB treatment)", group: "Blood", essential: true },
    { id: "creat", label: "Creatinine (baseline before tenofovir)", group: "Blood", essential: true },
    { id: "hbsag", label: "Hepatitis B surface antigen", group: "Blood", essential: false, appropriate: true },
    { id: "lam", label: "Urine TB-LAM", group: "TB", essential: false, appropriate: true },
    { id: "cxr", label: "Chest X-ray (with abdominal shielding)", group: "Imaging", essential: false, appropriate: true },
    { id: "culture", label: "Sputum culture only; wait 6 weeks for the result before treating", group: "TB", essential: false, appropriate: false, why: "Xpert gives a result in hours to days. Waiting six weeks for culture leaves her infectious and untreated." },
    { id: "ct", label: "CT chest", group: "Imaging", essential: false, appropriate: false, why: "High radiation in pregnancy and it adds nothing to an Xpert result." }
  ],

  results: {
    turnaround: "Results two days later (simulated).",
    reports: {
      xpert: { title: "Sputum Xpert MTB/RIF Ultra", rows: [
        { analyte: "M. tuberculosis", value: "Detected (medium)", unit: "", range: "Not detected", flag: "H", key: "tb" },
        { analyte: "Rifampicin resistance", value: "Not detected", unit: "", range: "", flag: "", key: "rifs" } ]},
      hiv: { title: "HIV", rows: [
        { analyte: "Screening test", value: "Reactive", unit: "", range: "Non-reactive", flag: "H", critical: true, key: "hivpos" },
        { analyte: "Confirmatory test", value: "Reactive", unit: "", range: "Non-reactive", flag: "H", key: "hivconf" } ]},
      cd4: { title: "CD4", rows: [ { analyte: "CD4 count", value: "180", unit: "cells/µL", range: "> 500", flag: "L", key: "cd4" } ]},
      lft: { title: "Liver function", rows: [ { analyte: "ALT", value: "24", unit: "U/L", range: "7–35", flag: "", key: "altok" } ]},
      creat: { title: "Kidney function", rows: [ { analyte: "Creatinine", value: "52", unit: "µmol/L", range: "35–70 in pregnancy", flag: "", key: "crok" } ]},
      hbsag: { title: "Hepatitis B", rows: [ { analyte: "HBsAg", value: "Negative", unit: "", range: "Negative", flag: "" } ]},
      lam: { title: "Urine TB-LAM", rows: [ { analyte: "TB-LAM", value: "Positive", unit: "", range: "Negative", flag: "H" } ]},
      cxr: { title: "Chest X-ray", text: "Right upper lobe consolidation with a small cavity. Hilar lymph nodes." },
      culture: { title: "Sputum culture", text: "Pending: result expected in six weeks." },
      ct: { title: "CT chest", text: "Not done: the radiologist declined the request in pregnancy." }
    },
    significant: ["tb", "rifs", "hivpos", "hivconf", "cd4", "altok", "crok"],
    criticalNote: "Newly diagnosed HIV in pregnancy with active TB: start TB treatment now and ART within two weeks. The baby is at high risk."
  },

  diagnosis: {
    options: [
      { id: "tbhiv", label: "Drug-sensitive pulmonary TB with newly diagnosed HIV (CD4 180) at 24 weeks of pregnancy", score: 100 },
      { id: "mdr", label: "Drug-resistant TB", score: 20 },
      { id: "pneumonia", label: "Community-acquired pneumonia", score: 10 },
      { id: "pcp", label: "Pneumocystis pneumonia", score: 10 },
      { id: "preg", label: "A pregnancy cough", score: 0 }
    ],
    explain: "Xpert detected TB with no rifampicin resistance, so this is drug-sensitive pulmonary TB. Two reactive HIV tests confirm HIV, acquired after a negative booking test, and a CD4 of 180 means significant immune suppression. Her husband's incompletely treated TB is the likely source. Normal liver and kidney tests mean treatment can start."
  },

  medicationChart: {
    intro: "TB and HIV prescription. She weighs 52 kg. Check every line.",
    lines: [
      { id: "rhze", drug: "Rifampicin / isoniazid / pyrazinamide / ethambutol (fixed-dose combination)", order: "3 tablets daily (weight band 38–54 kg), intensive phase 2 months", error: false },
      { id: "pyr", drug: "Pyridoxine", order: "25 mg daily", error: false },
      { id: "strep", drug: "Streptomycin", order: "15 mg/kg IM daily for 2 months, to strengthen the regimen", error: true,
        why: "Streptomycin can cause permanent deafness in the baby and is avoided in pregnancy. It isn't part of first-line treatment for drug-sensitive TB." },
      { id: "tld", drug: "Tenofovir / lamivudine / dolutegravir (TLD)", order: "One tablet daily, start within 2 weeks of TB treatment", error: true,
        why: "Rifampicin lowers dolutegravir levels. While she takes rifampicin (and for 2 weeks after), she needs an extra dolutegravir 50 mg tablet 12 hours after the TLD, i.e. dolutegravir twice daily." },
      { id: "ctx", drug: "Cotrimoxazole", order: "960 mg daily (CD4 below 200)", error: false }
    ]
  },

  management: {
    options: [
      { id: "tbnow", label: "Start TB treatment now", kind: "critical" },
      { id: "art", label: "Start ART within 2 weeks of TB treatment, with the dolutegravir dose adjusted for rifampicin", kind: "critical" },
      { id: "contacts", label: "Trace contacts: screen her son and husband for TB; TB preventive therapy for her son if he doesn't have TB; HIV testing and TB retreatment for her husband", kind: "critical" },
      { id: "ipc", label: "Mask and cough etiquette, a ventilated room at home, and the TB room at the clinic until she's no longer infectious", kind: "critical" },
      { id: "notify", label: "Notify TB to the health authorities (notifiable disease)", kind: "essential" },
      { id: "adherence", label: "Adherence support: a treatment supporter, enough tablets, clear follow-up dates", kind: "essential" },
      { id: "vl", label: "Viral load monitoring in pregnancy, and a plan for the baby at birth (HIV prophylaxis, PCR test; TB preventive therapy if she is still infectious)", kind: "essential" },
      { id: "nutrition", label: "Nutritional support", kind: "essential" },
      { id: "delaytb", label: "Postpone TB treatment until after the birth to protect the baby", kind: "harmful", critical: "Delayed TB treatment in pregnancy." },
      { id: "delayart", label: "Postpone ART until after the birth", kind: "harmful", critical: "Delayed ART in pregnancy." },
      { id: "admit", label: "Admit her to the TB hospital for six months, away from her family", kind: "harmful", critical: "Admitted a stable patient with drug-sensitive TB for months unnecessarily." }
    ]
  },

  followupPick: function () { return this.followup; },
  followup: {
    time: "Three weeks into TB treatment",
    situation: "Nosipho's cough is better and she started ART last week. Today she has been vomiting for two days, her eyes are yellow, and she has pain under her right ribs. ALT 320 U/L, bilirubin raised.",
    options: [
      { id: "dili", label: "Drug-induced liver injury: stop the TB medicines and cotrimoxazole, check hepatitis serology, and refer to hospital today for supervised reintroduction", correct: true },
      { id: "continue", label: "Continue everything; nausea is normal in pregnancy", correct: false },
      { id: "art", label: "Stop only the ART; the TB medicines are more important", correct: false },
      { id: "antiemetic", label: "Give metoclopramide and review in two weeks", correct: false }
    ],
    explain: "Jaundice, vomiting and an ALT over 3 times normal with symptoms on TB treatment is drug-induced liver injury, most often from isoniazid, rifampicin or pyrazinamide. Stop the hepatotoxic medicines, look for other causes, and reintroduce them one at a time under supervision. In pregnancy, also check for pregnancy-related liver disease."
  },

  extraFeedback: function (s) {
    var out = [];
    if (s.asked.indexOf("hivtest") === -1) out.push("You did not ask when she was last tested for HIV. Every pregnant woman needs repeat testing.");
    if (s.asked.indexOf("children") === -1) out.push("You did not ask who lives with her. A 3-year-old contact needs screening and TB preventive therapy.");
    return out;
  },
  exampleErrors: ["Left a coughing patient in a crowded waiting room without infection control.", "Treated a 5-week cough with weight loss as a chest infection without testing for TB.", "Missed a prescribing error: Tenofovir / lamivudine / dolutegravir (TLD), One tablet daily, start within 2 weeks of TB treatment."],

  learningPoints: [
    "Cough triage: a mask, fresh air and a fast track protect the waiting room without shaming the patient.",
    "Weight loss in pregnancy is a red flag. Screen every pregnant woman for TB symptoms.",
    "Repeat HIV testing in pregnancy. A negative booking test doesn't rule out a new infection.",
    "Xpert first. Drug-sensitive TB is treated in pregnancy; don't wait for the birth.",
    "Start ART within 2 weeks of TB treatment, and double the dolutegravir while on rifampicin.",
    "Avoid streptomycin in pregnancy.",
    "Trace contacts: young children need TB preventive therapy; the partner needs testing and treatment.",
    "Jaundice on TB treatment: stop the hepatotoxic drugs and refer."
  ]
});

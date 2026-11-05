/*
 * LabZero Mama case: "Bleeding when it's not my time"
 * Content licence: CC BY 4.0 (see CONTENT_LICENSE.md). Code licence: MIT.
 *
 * FICTIONAL TRAINING CASE. Not for clinical use.
 * Clinical content is pending review by a qualified gynaecological oncologist.
 */
window.MAMA_CASES = window.MAMA_CASES || [];
window.MAMA_CASES.push({
  id: "cervical-cancer-hiv",
  version: "0.2.0",
  status: "Draft: pending clinical validation",
  title: "Bleeding when it's not my time",
  family: "Gynaecological cancer: cervix",
  why: "Cervical cancer is one of the most common cancers in South African women, and women living with HIV are at higher risk. Regular screening finds it early; a missed symptom at the clinic can mean it is found too late.",
  setting: "Ikhwezi Community Health Centre, then the tertiary hospital gynaecology and oncology units",
  patient: { name: "Nomvula Sithole", age: 41, obstetric: "Domestic worker. Living with HIV since 2015, on ART", arrival: "Ticket 004 · in the queue since 05:30" },
  opening: "The blood keeps coming when it's not my time. And it smells.",
  steps: ["records", "vitals", "history", "exam", "triage", "tests", "results", "diagnosis", "badnews", "meds", "manage", "followup"],
  stepLabels: { records: "File room", vitals: "Vitals", history: "Doctor", exam: "Examine", triage: "Decision", badnews: "Breaking the news" },
  stepSettings: {
    records: "Ikhwezi CHC · file room", vitals: "Ikhwezi CHC · nurse's vitals station",
    history: "Ikhwezi CHC · doctor's consulting room", exam: "Ikhwezi CHC · doctor's consulting room",
    triage: "Ikhwezi CHC · deciding what happens next",
    tests: "Tertiary hospital · colposcopy clinic, 10 days later", results: "Tertiary hospital · gynaecology oncology clinic",
    diagnosis: "Tertiary hospital · gynaecology oncology clinic", meds: "Tertiary hospital · gynaecology oncology clinic",
    badnews: "Tertiary hospital · a quiet room, results day",
    manage: "Tertiary hospital · multidisciplinary meeting", followup: "Home, then the hospital emergency unit"
  },
  domains: [
    { id: "experience", label: "Patient experience" }, { id: "vitals", label: "Nurse vitals" },
    { id: "history", label: "History taking" }, { id: "assessment", label: "Examination" },
    { id: "prioritisation", label: "Clinic decision" }, { id: "investigations", label: "Test selection" },
    { id: "interpretation", label: "Result interpretation" }, { id: "diagnosis", label: "Diagnosis" },
    { id: "communication", label: "Breaking bad news" },
    { id: "medication", label: "Medication safety" }, { id: "management", label: "Management" },
    { id: "monitoring", label: "Monitoring and response" }
  ],

  monitor: function (s) {
    var fu = s.stepId === "followup" || s.stepId === "debrief";
    return [
      { k: "Hb", v: fu ? "7.1" : "9.2", u: "g/dL", alert: true },
      { k: "Weight", v: "52", u: "kg (−7)", alert: true },
      { k: "HR", v: fu ? "118" : "96", u: "/min", alert: fu },
      { k: "BP", v: fu ? "90/58" : "124/80", u: "mmHg", alert: fu }
    ];
  },

  file: {
    title: "Clinic folder and ART file",
    entries: [
      "2015: HIV diagnosed. Started ART.",
      "2017: Pap smear taken. Result not filed.",
      "2021: Switched to TLD (tenofovir, lamivudine, dolutegravir).",
      "2026-02: Viral load < 50 copies/mL. CD4 not done.",
      "Cervical screening: no record since 2017."
    ]
  },

  sceneDomains: { badnews: "communication" },

  scenes: {
    badnews: {
      title: "Telling Nomvula",
      lead: "You are the gynaecology doctor. The biopsy and MRI results are in front of you. Nomvula has come back for them, with her sister Thandi.",
      turns: [
        { speaker: "Nomvula", line: "Sister said the results are back. My sister is outside. Is it bad?",
          options: [
            { text: "“Would you like Thandi to come in for this? Let's sit down in here. I have your results, and I'm not in a hurry.”", score: 100, reply: "She nods. Thandi comes in and holds her hand. You close the door." },
            { text: "“Let's do this quickly here in the corridor; the clinic is full today.”", score: 0, flag: "Gave a cancer diagnosis in a corridor.", reply: "People in the queue turn to listen." },
            { text: "“Let me speak to your sister first.”", score: 0, flag: "Planned to tell a relative before the patient (confidentiality).", reply: "Nomvula looks hurt. “It's my body.”" }
          ]},
        { speaker: "Nomvula", line: "The other doctor said something about a sore on my womb.",
          options: [
            { text: "“Before I explain the results, can you tell me what you understand about why we took the biopsy?”", score: 100, reply: "“They were worried about cancer,” she says quietly. “Because of the bleeding.”" },
            { text: "“Your histology shows invasive squamous cell carcinoma, FIGO stage IB2.”", score: 10, reply: "She stares at you. She hasn't understood a word." },
            { text: "“Don't worry, it's nothing serious.”", score: 0, flag: "Gave false reassurance before a cancer diagnosis.", reply: "She relaxes, and you now have to take that back." }
          ]},
        { speaker: "Nomvula", line: "I think it might be cancer. Please, just tell me straight.",
          options: [
            { text: "“I'm afraid it isn't good news. The biopsy shows cancer of the cervix. But the scan shows it hasn't spread, so we can treat it with the aim of curing it.”", score: 100, reply: "She closes her eyes. Thandi squeezes her hand." },
            { text: "“We found some abnormal cells that are a bit concerning. We'll see.”", score: 30, reply: "“Is it cancer or not?” she asks. You still haven't said." },
            { text: "“Yes, it's cancer. The oncology booking desk is down the passage.”", score: 20, reply: "She walks out without her referral letter." }
          ]},
        { speaker: "Nomvula", line: "(silence, then tears) I'm going to die. Who will look after my children?",
          options: [
            { text: "Pause and offer tissues. “This is a lot to take in. It's natural to be frightened. Many women whose cancer is found at this stage are cured. Shall I tell you what happens next, or do you need a moment?”", score: 100, reply: "After a while she wipes her eyes. “Tell me what happens next.”" },
            { text: "“Please don't cry. Crying won't help.”", score: 0, flag: "Dismissed her emotional response to a cancer diagnosis.", reply: "She stops talking." },
            { text: "Go straight on to the treatment options.", score: 30, reply: "She isn't hearing anything you say." }
          ]},
        { speaker: "Thandi, her sister", line: "What happens now? Does the HIV mean she can't be treated?",
          options: [
            { text: "“Her HIV is well controlled, so she can have the same treatment as anyone else. The team meets this week to plan surgery or radiotherapy. Here is a written summary and a number to call. We'll see you on Thursday.”", score: 100, reply: "Thandi writes down the number. Nomvula says: “Thursday. I'll be here.”" },
            { text: "“The doctors will decide. Just come when you're called.”", score: 20, reply: "They leave unsure when, or whether, to come back." },
            { text: "“With HIV, her options are limited.”", score: 0, flag: "Gave wrong information that HIV prevents cancer treatment.", reply: "Nomvula covers her face." }
          ]}
      ],
      teach: "SPIKES: Setting (private, seated, her chosen person), Perception (what does she understand?), Invitation (how much does she want to know?), Knowledge (a warning shot, then plain words: ‘cancer’), Emotions (pause, acknowledge), Strategy and Summary (a clear plan, in writing, with a date).",
      next: "On to her treatment plan"
    },

    records: {
      title: "The file room",
      lead: "Nomvula's general folder is in the file room. Her HIV records are kept separately in the ART room.",
      turns: [
        { speaker: "Mrs Dube (clerk)", line: "Her folder is here, but her HIV file is in the ART room. She can only see one service today.",
          options: [
            { text: "Please bring both files. The doctor needs her full record to treat her properly.", score: 100, reply: "Mrs Dube sends the runner to the ART room." },
            { text: "Ask her to queue again at the ART room afterwards.", score: 10, reply: "Nomvula looks at the clock. She will lose a day's pay." },
            { text: "One service a day, those are the rules.", score: 0, flag: "Split a patient's care between separate files.", reply: "Nomvula sighs and sits down." }
          ]},
        { speaker: "Nomvula", line: "Will they notice the smell? I'm so ashamed. My employer thinks I'm dirty.",
          options: [
            { text: "You have nothing to be ashamed of. Telling us helps us help you, and we'll see you in a private room.", score: 100, reply: "She wipes her eyes. “Thank you, sisi.”" },
            { text: "Everyone smells in this heat.", score: 10, reply: "She doesn't laugh." },
            { text: "You should wash more often.", score: 0, flag: "Shamed a patient about her symptoms.", reply: "She pulls the blanket over her face." }
          ]}
      ]
    }
  },

  vitals: [
    { id: "bp", label: "Blood pressure", value: "124/80", unit: "mmHg", abnormal: false, essential: true, line: "My pressure is usually fine." },
    { id: "pulse", label: "Pulse", value: "96", unit: "/min", abnormal: false, essential: false, line: "I get tired walking up the hill." },
    { id: "temp", label: "Temperature", value: "36.9", unit: "°C", abnormal: false, essential: false, line: "No fever." },
    { id: "weight", label: "Weight", value: "52", unit: "kg (−7 kg since February)", abnormal: true, essential: true, line: "My clothes are loose. I thought it was the ARVs." },
    { id: "glucose", label: "Finger-prick glucose", value: "4.8", unit: "mmol/L", abnormal: false, essential: false, line: "Fine." },
    { id: "urine", label: "Urine dipstick", value: "Blood 1+", unit: "(contaminated by vaginal bleeding)", abnormal: false, essential: false, line: "There's always blood these days." },
    { id: "preg", label: "Urine pregnancy test", value: "Negative", unit: "", abnormal: false, essential: true, line: "I'm not pregnant. Test if you must." },
    { id: "hb", label: "Haemoglobin (finger prick)", value: "9.2", unit: "g/dL", abnormal: true, essential: true, line: "I feel dizzy when I stand up quickly." }
  ],

  history: {
    speaker: "Nomvula", speakerRole: "the patient", title: "The doctor's consultation",
    prompt: "You are the clinic doctor. Ask in your own words. She answers only from her approved case script.",
    intents: [
      { id: "bleeding", chip: "Tell me about the bleeding.", critical: true,
        keywords: ["bleeding", "blood", "spotting", "between periods", "after sex", "bleed"],
        reply: "It comes between my periods and after sex. For six months now. Sometimes it's a lot." },
      { id: "screening", chip: "When were you last screened for cervical cancer?", critical: true,
        keywords: ["pap", "smear", "screening", "screened", "cervical", "test for cancer"],
        reply: "A Pap smear in 2017. Nobody ever told me the result, so I thought it was fine." },
      { id: "hiv", chip: "How is your HIV treatment going?", critical: true,
        keywords: ["hiv", "arv", "art", "viral load", "cd4", "treatment"],
        reply: "I take TLD every morning. My viral load was undetectable in February." },
      { id: "discharge", chip: "Do you have any discharge?", critical: true,
        keywords: ["discharge", "smell", "odour", "watery"], reply: "Yes, watery and smelly, sometimes with blood. I wear pads every day." },
      { id: "weight", chip: "Have you lost weight?", critical: false,
        keywords: ["weight", "thin", "appetite", "eating"], reply: "About seven kilos since February. I'm not hungry." },
      { id: "pain", chip: "Do you have any pain?", critical: false,
        keywords: ["pain", "hurt", "back", "legs", "pelvis"], reply: "A dull ache low down. Sometimes in my back." },
      { id: "urinary", chip: "Any problems passing urine or stool?", critical: false,
        keywords: ["urine", "wee", "stool", "bowel", "toilet", "passing"], reply: "No, that's fine." },
      { id: "periods", chip: "Are your periods still regular?", critical: false,
        keywords: ["periods", "cycle", "menopause", "last period"], reply: "Yes, every month, but the bleeding in between is the problem." },
      { id: "family", chip: "Who do you live with?", critical: false,
        keywords: ["family", "children", "live", "home", "daughter", "husband"], reply: "My two daughters, 10 and 15. My husband passed away in 2019." },
      { id: "smoking", chip: "Do you smoke?", critical: false,
        keywords: ["smoke", "smoking", "cigarettes", "tobacco"], reply: "No." }
    ],
    fallback: "Sorry, sisi, I don't understand."
  },

  examTitle: "Examine her",
  examLead: "With her consent and a chaperone present. The finding appears when you perform each examination.",
  exam: [
    { id: "abdomen", label: "Abdominal examination", essential: true, finding: "Soft. No masses. No enlarged liver." },
    { id: "speculum", label: "Speculum examination", essential: true, finding: "An irregular, friable growth about 3 cm on the cervix that bleeds when touched. Watery, blood-stained, offensive discharge." },
    { id: "bimanual", label: "Bimanual examination", essential: true, finding: "Hard, enlarged cervix. The tissue beside the cervix feels free on both sides." },
    { id: "nodes", label: "Lymph nodes (groin and neck)", essential: false, finding: "No enlarged nodes." },
    { id: "pallor", label: "Check for pallor", essential: false, finding: "Pale conjunctivae." }
  ],

  triage: {
    title: "What happens next?",
    question: "You are the clinic doctor. Decide her next step",
    vitals: [
      { label: "Cervix", value: "Friable 3 cm growth", unit: "", flag: "high" },
      { label: "Hb", value: "9.2", unit: "g/dL", flag: "high" },
      { label: "Weight loss", value: "7 kg", unit: "", flag: "high" },
      { label: "HIV", value: "Suppressed on TLD", unit: "" }
    ],
    look: "Nomvula is sitting up, holding her bag. “Is it bad, doctor?”",
    options: [
      { id: "urgent", label: "Urgent referral", detail: "Phone and write an urgent referral to the hospital colposcopy or gynaecology clinic for biopsy within two weeks (suspected cancer); start iron", score: 100 },
      { id: "pap", label: "Pap smear and wait", detail: "Take a Pap smear today and review the result in six weeks", score: 20, critical: "Took a Pap smear of a visible lesion instead of referring urgently for biopsy." },
      { id: "sti", label: "Treat as an STI", detail: "Syndromic treatment for vaginal discharge and review in two weeks", score: 10, critical: "Treated a visible cervical growth as an STI, delaying a cancer diagnosis." },
      { id: "routine", label: "Routine referral", detail: "Routine gynaecology appointment in about three months", score: 30, critical: "Referred suspected cervical cancer routinely instead of urgently." }
    ],
    feedback: "A visible, bleeding growth on the cervix is suspicious for cancer. A Pap smear is a screening test for women without symptoms; this needs an urgent biopsy. Her anaemia needs treatment now."
  },

  tests: [
    { id: "biopsy", label: "Cervical punch biopsy (colposcopy)", group: "Tissue", essential: true },
    { id: "fbc", label: "Full blood count", group: "Blood", essential: true },
    { id: "ue", label: "Urea, creatinine and electrolytes", group: "Blood", essential: true },
    { id: "cd4", label: "CD4 count and viral load", group: "Blood", essential: false, appropriate: true },
    { id: "mri", label: "MRI pelvis (staging)", group: "Imaging", essential: false, appropriate: true },
    { id: "cxr", label: "Chest X-ray (staging)", group: "Imaging", essential: false, appropriate: true },
    { id: "ca125", label: "CA-125", group: "Blood", essential: false, appropriate: false, why: "Not a marker for cervical cancer." },
    { id: "mammo", label: "Mammogram", group: "Imaging", essential: false, appropriate: false, why: "Unrelated to her presenting problem; offer breast screening separately according to guidelines." }
  ],

  results: {
    turnaround: "Biopsy result returned after 10 days; blood results the same day (simulated).",
    reports: {
      biopsy: { title: "Histology: cervical biopsy", rows: [
        { analyte: "Diagnosis", value: "Invasive squamous cell carcinoma", unit: "", range: "No malignancy", flag: "H", critical: true, key: "scc" },
        { analyte: "Grade", value: "Moderately differentiated", unit: "", range: "", flag: "" } ]},
      fbc: { title: "Full blood count", rows: [
        { analyte: "Haemoglobin", value: "9.0", unit: "g/dL", range: "12.0–15.0", flag: "L", key: "hb" },
        { analyte: "MCV", value: "76", unit: "fL", range: "80–100", flag: "L", key: "mcv" },
        { analyte: "Platelets", value: "355", unit: "×10⁹/L", range: "150–400", flag: "" } ]},
      ue: { title: "Kidney function", rows: [
        { analyte: "Creatinine", value: "78", unit: "µmol/L", range: "49–90", flag: "", key: "creat" },
        { analyte: "Urea", value: "4.9", unit: "mmol/L", range: "2.1–7.1", flag: "" } ]},
      cd4: { title: "HIV monitoring", rows: [
        { analyte: "CD4 count", value: "410", unit: "cells/µL", range: "500–1500", flag: "L", key: "cd4v" },
        { analyte: "Viral load", value: "< 50", unit: "copies/mL", range: "< 50", flag: "", key: "vl" } ]},
      mri: { title: "MRI pelvis", rows: [
        { analyte: "Tumour size", value: "35 mm, confined to the cervix", unit: "", range: "", flag: "H", key: "size" },
        { analyte: "Parametrial invasion", value: "None", unit: "", range: "None", flag: "", key: "param" },
        { analyte: "Pelvic lymph nodes", value: "Not enlarged", unit: "", range: "", flag: "" } ]},
      cxr: { title: "Chest X-ray", text: "Clear lungs. No metastases seen." },
      ca125: { title: "CA-125", rows: [ { analyte: "CA-125", value: "28", unit: "U/mL", range: "< 35", flag: "" } ]},
      mammo: { title: "Mammogram", text: "Normal (BI-RADS 1)." }
    },
    significant: ["scc", "hb", "mcv", "size"],
    criticalNote: "Histology: invasive squamous cell carcinoma of the cervix. She must be told in person and booked for the oncology meeting."
  },

  diagnosis: {
    options: [
      { id: "scc", label: "Invasive squamous cell carcinoma of the cervix, early stage (tumour 3.5 cm confined to the cervix), in a woman with well-controlled HIV, with iron-deficiency anaemia", score: 100 },
      { id: "cin", label: "Pre-cancerous change (CIN 3) only", score: 30 },
      { id: "endometrial", label: "Endometrial cancer", score: 20 },
      { id: "polyp", label: "Cervical polyp", score: 10 },
      { id: "cervicitis", label: "Cervicitis from an STI", score: 10 },
      { id: "advanced", label: "Advanced cancer; only palliative care is possible", score: 10 }
    ],
    explain: "The biopsy shows invasive squamous cell carcinoma. MRI shows a 35 mm tumour confined to the cervix with no spread to the surrounding tissue or nodes, and the chest X-ray and kidney function are normal, so this is early-stage disease that can be treated with curative intent. Well-controlled HIV does not change that."
  },

  medicationChart: {
    intro: "Discharge prescription after the oncology meeting. Check every line.",
    lines: [
      { id: "tld", drug: "TLD (tenofovir, lamivudine, dolutegravir)", order: "1 tablet every morning", error: false },
      { id: "iron", drug: "Ferrous sulphate", order: "200 mg daily, taken at the same time as TLD", error: true,
        why: "Iron reduces the absorption of dolutegravir. Take TLD at least 2 hours before or 6 hours after iron, or take both with a meal." },
      { id: "stopart", drug: "ART", order: "Stop all ART until cancer treatment is complete", error: true,
        why: "ART must continue throughout cancer treatment. Stopping it risks viral rebound and resistance." },
      { id: "pcm", drug: "Paracetamol", order: "1 g every 6 hours when needed (maximum 4 g a day)", error: false }
    ]
  },

  management: {
    options: [
      { id: "tell", label: "Tell her the diagnosis honestly and kindly, in private, with someone she chooses present", kind: "critical" },
      { id: "mdt", label: "Present her at the gynaecology oncology meeting for curative treatment (surgery or chemoradiation)", kind: "critical" },
      { id: "art", label: "Continue ART and coordinate with her HIV clinic", kind: "critical" },
      { id: "anaemia", label: "Treat the anaemia", kind: "essential" },
      { id: "social", label: "Social worker: transport to treatment, sick note, grant eligibility, care of her daughters", kind: "essential" },
      { id: "hpv", label: "Advise HPV vaccination for her 10-year-old through the school programme, and screening for her 15-year-old when she is old enough", kind: "essential" },
      { id: "hide", label: "Don't use the word cancer so she doesn't get upset", kind: "harmful", critical: "Withheld a cancer diagnosis from the patient." },
      { id: "pap3", label: "Refer back to the clinic for a Pap smear in three years", kind: "harmful", critical: "Sent a woman with invasive cancer back for screening instead of treatment." },
      { id: "traditional", label: "Suggest traditional medicine instead of hospital treatment", kind: "harmful", critical: "Advised against curative cancer treatment." },
      { id: "palliative", label: "Offer palliative care only", kind: "harmful", critical: "Offered only palliative care for early, curable cervical cancer." }
    ]
  },

  followupPick: function () { return this.followup; },
  followup: {
    time: "Three weeks later, before treatment starts",
    situation: "Nomvula is brought to the emergency unit by her daughter. She has soaked six pads in two hours and fainted at home. Pulse 118. BP 90/58. Pale and clammy.",
    options: [
      { id: "resus", label: "Two large IV lines, fluids, cross-match and transfuse, vaginal packing to control bleeding, and call the gynaecology oncology team (urgent radiotherapy can stop tumour bleeding)", correct: true },
      { id: "iron", label: "Increase her oral iron and send her home", correct: false },
      { id: "tranex", label: "Give tranexamic acid tablets and review at her oncology appointment", correct: false },
      { id: "wait", label: "Observe her in casualty and wait for the bleeding to stop", correct: false }
    ],
    explain: "Heavy bleeding from a cervical tumour with signs of shock is an emergency. Resuscitate, pack the vagina to tamponade the bleeding, transfuse and involve oncology; radiotherapy can control tumour bleeding."
  },

  extraFeedback: function () { return []; },
  exampleErrors: ["Took a Pap smear of a visible lesion instead of referring urgently for biopsy.", "Split a patient's care between separate files."],

  learningPoints: [
    "Bleeding between periods or after sex in a woman over 30, especially with HIV, needs a speculum examination.",
    "A visible growth on the cervix needs an urgent biopsy, not a Pap smear.",
    "Women living with HIV need regular cervical screening; follow up every result.",
    "Continue ART through cancer treatment, and separate dolutegravir from iron.",
    "HPV vaccination of girls prevents most cervical cancer."
  ]
});

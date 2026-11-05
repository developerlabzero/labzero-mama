/*
 * LabZero Mama case: "She hid it under her school jersey"
 * Content licence: CC BY 4.0 (see CONTENT_LICENSE.md). Code licence: MIT.
 *
 * FICTIONAL TRAINING CASE. Not for clinical use.
 * Clinical content is pending review by an advanced midwife or obstetrician
 * (assisted breech birth, PMTCT) and a neonatologist.
 */
window.MAMA_CASES = window.MAMA_CASES || [];
window.MAMA_CASES.push({
  id: "teen-breech-labour",
  version: "0.1.0",
  status: "Draft: pending clinical validation",
  title: "She hid it under her school jersey",
  family: "Obstetrics: unbooked adolescent in labour with a breech baby",
  why: "Adolescents often hide pregnancies and arrive in labour without antenatal care, so problems that booking would have found (breech, pre-eclampsia, HIV, anaemia) are discovered at the last minute. A breech birth that can't be transferred in time must be assisted safely at the clinic.",
  setting: "Ikhwezi CHC midwife obstetric unit (MOU), then the regional hospital",
  patient: { name: "Zinhle Mthethwa", age: 16, obstetric: "Grade 11 learner. First pregnancy, no antenatal visits", arrival: "Brought by her grandmother at 12:50, in strong labour" },
  opening: "It's coming! Gogo, it's coming!",
  steps: ["arrival", "vitals", "history", "exam", "triage", "birth", "resus", "tests", "results", "diagnosis", "meds", "manage", "family", "followup"],
  stepLabels: { arrival: "At the door", vitals: "Vitals", history: "Her story", exam: "Examine", triage: "Decision", birth: "Breech birth", resus: "The baby", diagnosis: "Diagnosis", family: "Gogo" },
  stepSettings: {
    arrival: "Ikhwezi CHC · MOU entrance · 12:50", vitals: "Ikhwezi CHC · MOU delivery room",
    history: "Ikhwezi CHC · MOU delivery room, between contractions", exam: "Ikhwezi CHC · MOU delivery room",
    triage: "Ikhwezi CHC · MOU · deciding where she gives birth", birth: "Ikhwezi CHC · MOU delivery room · 13:05",
    resus: "Ikhwezi CHC · MOU resuscitation table", tests: "Ikhwezi CHC · MOU, after the birth",
    results: "Ikhwezi CHC · MOU", diagnosis: "Ikhwezi CHC · MOU", meds: "Ikhwezi CHC · MOU",
    manage: "Ikhwezi CHC · MOU", family: "Ikhwezi CHC · MOU family room", followup: "Regional hospital · postnatal ward, 6 hours later"
  },
  sceneDomains: { arrival: "dignity", family: "family" },
  domains: [
    { id: "dignity", label: "Respectful care" }, { id: "vitals", label: "Maternal vitals" },
    { id: "history", label: "History taking" }, { id: "assessment", label: "Examination" },
    { id: "prioritisation", label: "Birth decision" }, { id: "breech", label: "Assisted breech birth" },
    { id: "resuscitation", label: "Newborn resuscitation" }, { id: "investigations", label: "Unbooked bloods" },
    { id: "interpretation", label: "Result interpretation" }, { id: "diagnosis", label: "Diagnosis" },
    { id: "medication", label: "Medication safety" }, { id: "management", label: "Management (PMTCT)" },
    { id: "family", label: "Family and confidentiality" }, { id: "monitoring", label: "Monitoring and response" }
  ],

  tuto: {
    arrival: "She is a frightened child in labour. Scolding now costs you her cooperation at the moment you need it most.",
    vitals: "Unbooked means unknown. Blood pressure and urine protein are the checks most likely to change today.",
    history: "Between contractions, keep it short: how many weeks, any danger signs, any antenatal care, and who the father is (and how old).",
    exam: "Feel where the head is. A hard round head at the top of the uterus means breech. Then a vaginal examination: how far, and what is coming first?",
    triage: "Is the birth imminent? If the breech is at the perineum, an ambulance birth is more dangerous than an assisted birth here.",
    birth: "Hands off the breech. Let her push the baby to the umbilicus. Back up, hold the hips, free the arms, flex the head. Never pull.",
    tests: "She has had no antenatal bloods. Do them now: HIV, syphilis, Hb, blood group. Each one can change the baby's first day.",
    family: "Gogo's anger is fear and shame. Calm her, protect Zinhle's confidentiality, and talk about school."
  },

  monitor: function (s) {
    var later = ["tests", "results", "diagnosis", "meds", "manage", "family", "followup", "debrief"].indexOf(s.stepId) !== -1;
    return [
      { k: "BP", v: s.stepId === "followup" ? "168/112" : "148/96", u: "mmHg", alert: true },
      { k: "Urine protein", v: "2+", u: "", alert: true },
      { k: "Fetal HR", v: later ? "baby born" : "142", u: later ? "" : "/min" },
      { k: "HIV", v: ["meds", "manage", "family", "followup", "debrief"].indexOf(s.stepId) !== -1 ? "Positive" : "Unknown", u: "", alert: true }
    ];
  },

  scenes: {
    arrival: {
      title: "At the door",
      lead: "Zinhle is bent over the door frame in her school jersey, gasping. Her grandmother is shouting. Nobody at home knew she was pregnant until this morning.",
      turns: [
        { speaker: "Gogo MaMthethwa", line: "Look at her! Sixteen! She lied to me for nine months! Shame on this child!",
          options: [
            { text: "“Gogo, I can see this is a terrible shock. Right now she needs both of us. Please help me get her onto the bed.”", score: 100, reply: "Gogo stops shouting and takes Zinhle's other arm." },
            { text: "“You should have watched her more carefully, Gogo.”", score: 0, flag: "Blamed the family at the moment of an emergency.", reply: "Gogo turns on you instead. Zinhle sinks to the floor." },
            { text: "Ignore Gogo and get on with it.", score: 40, reply: "Gogo keeps shouting through the whole examination." }
          ]},
        { speaker: "Zinhle", line: "I'm sorry, I'm sorry! Is it going to kill me? It hurts so much!",
          options: [
            { text: "“You're not in trouble with me. You're safe and we're going to help you. Breathe with me through this one.”", score: 100, reply: "She grips your hand and breathes with you." },
            { text: "“You should have thought about the pain before.”", score: 0, flag: "Shamed an adolescent in labour.", reply: "She stops speaking. She won't let you examine her." },
            { text: "“Stop screaming, you'll frighten the other mothers.”", score: 10, reply: "She bites her lip until it bleeds." }
          ]}
      ],
      teach: "Respectful maternity care is a right, and it matters most for frightened adolescents. Blame and shaming make women avoid clinics in the future.",
      next: "Take her vital signs"
    },

    family: {
      title: "Talking to Gogo",
      lead: "Mother and baby are stable and waiting for the ambulance. Gogo wants to talk. Zinhle has asked you privately not to tell Gogo about the HIV result.",
      turns: [
        { speaker: "Gogo MaMthethwa", line: "What did the blood tests say? I'm her grandmother. I have a right to know.",
          options: [
            { text: "“Zinhle's results belong to her. She's 16 and the law protects her privacy. I'll help her talk to you when she's ready. What I can say is that she and the baby are getting all the treatment they need.”", score: 100, reply: "Gogo frowns, but nods. “She was always a private child.”" },
            { text: "“She's HIV positive. She must have got it from that boy.”", score: 0, flag: "Disclosed an adolescent's HIV status without her consent.", reply: "Zinhle, behind the curtain, starts to sob." },
            { text: "“I can't say. Ask the hospital.”", score: 40, reply: "Gogo is suspicious and angry." }
          ]},
        { speaker: "Gogo MaMthethwa", line: "She's finished with school now. Who will look after this baby?",
          options: [
            { text: "“Learners who have babies are allowed back at school. Many go on to finish matric. Let's plan childcare together, and I'll link you to the social worker for the child support grant.”", score: 100, reply: "Gogo sighs. “Her mother finished matric with a baby too. Maybe.”" },
            { text: "“Yes, she'll have to stay home now.”", score: 0, flag: "Told an adolescent mother she could not return to school.", reply: "Zinhle hears this and turns to the wall." },
            { text: "“That's your family's business.”", score: 20, reply: "Gogo leaves the room without a plan." }
          ]},
        { speaker: "Zinhle", line: "(quietly) I don't want this to happen again. Not until I'm finished school.",
          options: [
            { text: "“That's a good plan. Before you leave hospital we'll talk through the options, like an implant, which you can have even while breastfeeding. You choose.”", score: 100, reply: "For the first time today, she smiles." },
            { text: "“Then stop seeing boys.”", score: 10, reply: "She doesn't ask again." },
            { text: "“We'll discuss that at your 6-week visit.”", score: 40, reply: "Many young mothers don't return at 6 weeks." }
          ]}
      ],
      teach: "An adolescent's HIV result is hers to share. Pregnant and parenting learners may return to school. Offer contraception before discharge, not later."
    }
  },

  vitals: [
    { id: "bp", label: "Blood pressure", value: "148/96", unit: "mmHg", abnormal: true, essential: true, line: "My head is a bit sore, but everything hurts." },
    { id: "urine", label: "Urine dipstick", value: "Protein 2+", unit: "", abnormal: true, essential: true, line: "(She manages to give a sample between contractions.)" },
    { id: "pulse", label: "Pulse", value: "96", unit: "/min", abnormal: false, essential: true, line: "" },
    { id: "temp", label: "Temperature", value: "36.9", unit: "°C", abnormal: false, essential: true, line: "" },
    { id: "fhr", label: "Fetal heart rate (after a contraction)", value: "142", unit: "/min", abnormal: false, essential: true, line: "Is the baby alive?" },
    { id: "hb", label: "Haemoglobin (finger prick)", value: "9.4", unit: "g/dL", abnormal: true, essential: false, line: "" },
    { id: "weight", label: "Weight", value: "Not now", unit: "", abnormal: false, essential: false, line: "She can't stand on a scale." }
  ],

  history: {
    speaker: "Zinhle", speakerRole: "the patient", title: "Her story, between contractions",
    prompt: "Keep questions short. She answers only from her approved case script.",
    intents: [
      { id: "weeks", chip: "When was your last period?", critical: true,
        keywords: ["period", "last", "weeks", "months", "due", "lmp"], reply: "February, I think. Nine months? I don't know." },
      { id: "anc", chip: "Did you go to the clinic at all while pregnant?", critical: true,
        keywords: ["clinic", "antenatal", "anc", "booked", "check", "visit"], reply: "No. I was scared they'd tell Gogo." },
      { id: "danger", chip: "Any headache, blurred vision or swelling?", critical: true,
        keywords: ["headache", "vision", "eyes", "swelling", "swollen", "fits"], reply: "My head has been sore since last night. My feet are swollen." },
      { id: "waters", chip: "Have your waters broken?", critical: true,
        keywords: ["waters", "broken", "leaking", "fluid", "membranes"], reply: "At ten o'clock. It was green-brown." },
      { id: "moves", chip: "Is the baby moving?", critical: false,
        keywords: ["moving", "movements", "kicking", "kicks"], reply: "Yes, it kicks me low down, near my bladder." },
      { id: "hiv", chip: "Have you ever had an HIV test?", critical: true,
        keywords: ["hiv", "test", "status", "tested"], reply: "Never." },
      { id: "father", chip: "Who is the baby's father, and how old is he?", critical: true,
        keywords: ["father", "boyfriend", "partner", "how old", "age"], reply: "Thabo. He's 17, in my class. He doesn't know." },
      { id: "pain", chip: "When did the pains start?", critical: false,
        keywords: ["pain", "contractions", "start", "began", "labour"], reply: "Last night. Since morning they're very strong." },
      { id: "push", chip: "Do you feel like pushing?", critical: false,
        keywords: ["push", "pushing", "bear down", "pressure"], reply: "Yes! I can't stop it!" }
    ],
    fallback: "(through a contraction) What? I don't understand."
  },

  examTitle: "Examine her",
  examLead: "With her consent, quickly, between contractions. The finding appears when you perform each examination.",
  exam: [
    { id: "palp", label: "Abdominal palpation", essential: true, finding: "Term-sized uterus. A hard, round, movable mass at the top of the uterus (the head). Soft, broad part low down. Breech presentation." },
    { id: "ve", label: "Vaginal examination", essential: true, finding: "Fully dilated. Buttocks and one foot at the perineum. Thick meconium (normal in a breech). No cord felt." },
    { id: "fhr", label: "Listen to the fetal heart after a contraction", essential: true, finding: "142 per minute, recovering well." },
    { id: "oedema", label: "Check for oedema and reflexes", essential: false, finding: "Swollen ankles. Brisk reflexes, no clonus." }
  ],

  triage: {
    title: "Where is this baby born?",
    question: "The breech is at the perineum. The nearest hospital is 40 minutes away. Decide",
    vitals: [
      { label: "Cervix", value: "Fully dilated", unit: "", flag: "high" },
      { label: "Presentation", value: "Breech, at the perineum", unit: "", flag: "high" },
      { label: "BP", value: "148/96", unit: "mmHg", flag: "high" },
      { label: "Fetal HR", value: "142", unit: "/min" }
    ],
    look: "She has an urge to push with every contraction. The buttocks are visible.",
    options: [
      { id: "here", label: "Assist the birth here", detail: "Birth is imminent: call for help, prepare newborn resuscitation, assist the breech birth now, and call EMS for transfer afterwards", score: 100 },
      { id: "ambulance", label: "Ambulance now", detail: "Put her in the ambulance and tell her not to push", score: 20, critical: "Tried to transfer a breech birth that was already imminent." },
      { id: "wait", label: "Wait for the doctor", detail: "Ask her to hold back until the doctor arrives from the clinic", score: 10, critical: "Delayed an imminent breech birth." },
      { id: "csection", label: "Caesarean section", detail: "Book her for an urgent caesarean", score: 0, critical: "Planned a caesarean that is not available and not possible in time." }
    ],
    feedback: "When a breech is already at the perineum and the mother is pushing, the birth will happen within minutes. A birth in a moving ambulance is more dangerous than a well-assisted birth here. Call for help, prepare to resuscitate the baby, and assist the birth."
  },

  drills: {
    birth: {
      domain: "breech",
      title: "Assisted breech birth",
      intro: "Zinhle is pushing. The baby's buttocks and one foot are at the perineum. The baby's heart was 142 a minute ago. You are the midwife; the second midwife is on her way.",
      opening: "The buttocks are at the perineum.",
      clockStart: 0,
      meter: { label: "Since the umbilicus was born", unit: "s", start: 0, rate: 0 },
      alarm: function (r) { return r.rate > 0 && r.meter > 180; },
      status: function (r, did) {
        if (did(r, "head")) return "Baby born";
        if (did(r, "handsoff")) return "Body born to the umbilicus · head still inside";
        return "Breech at the perineum";
      },
      hint1: "Hands off the breech. Prepare first, then let her push the baby out to the umbilicus without pulling.",
      actions: [
        { id: "help", group: "Prepare", label: "Call for the second midwife and the doctor; phone EMS", cost: 10, text: "Sister Ndlovu is coming. EMS is 40 minutes away." },
        { id: "resus", group: "Prepare", label: "Prepare the newborn resuscitation area: warm towels, bag and mask, suction", cost: 30, text: "Resuscitation table ready, heater on, bag and mask checked." },
        { id: "position", group: "Prepare", label: "Bring her buttocks to the edge of the bed (or upright on all fours); empty her bladder", cost: 25, text: "She is in position. Bladder emptied." },
        { id: "iv", group: "Prepare", label: "IV line", cost: 40, text: "IV line in her left arm." },
        { id: "handsoff", group: "Birth", label: "Hands off: let her push the baby out to the umbilicus", cost: 60, rate: 1,
          text: "With two pushes the buttocks, legs and body are born to the umbilicus. The baby's back is upwards. The cord is pulsing." },
        { id: "pull", group: "Birth", label: "Pull on the baby's legs to speed things up", cost: 10, harmful: "Pulled on a breech baby, risking extended arms and a trapped head.", text: "The baby's arms fly up beside its head." },
        { id: "back", group: "Birth", label: "Keep the baby's back upwards; hold the baby by the hips (bony pelvis), not the belly", cost: 5,
          can: function (r, did) { return did(r, "handsoff") ? null : "Wait: the body isn't born yet. Hands off."; }, text: "Holding the hips with a warm towel, back upwards." },
        { id: "arms", group: "Birth", label: "Arms are up beside the head: Løvset manoeuvre (rotate to bring each arm down)", cost: 30,
          can: function (r, did) { return did(r, "handsoff") ? null : "The body isn't born yet."; }, text: "You rotate the baby. The left arm comes down, then the right." },
        { id: "head", group: "Birth", label: "Deliver the head: Mauriceau–Smellie–Veit (fingers on the cheekbones, flex the head), while your colleague presses above the pubic bone", cost: 30,
          can: function (r, did) { return !did(r, "arms") ? "The arms are still up beside the head. Free them first." : !did(r, "help") ? "You need a second person to press above the pubic bone." : null; },
          rate: 0, text: "The head is born slowly. The baby is born: a boy, floppy, blue, not breathing." },
        { id: "neck", group: "Birth", label: "Pull the head out by the shoulders", cost: 10, harmful: "Applied traction to the after-coming head.", text: "The neck stretches. This can injure the spinal cord and nerves." },
        { id: "handover", group: "Baby born", label: "Take the baby straight to the resuscitation table", cost: 0, end: true,
          can: function (r, did) { return did(r, "head") ? null : "The baby isn't born yet."; }, text: "Baby on the warm resuscitation table." }
      ],
      events: [
        { t: 200, when: function (r) { return r.rate > 0 && !r.done.head; }, text: "The cord has stopped pulsing. The baby needs to be born now." }
      ],
      rules: {
        essential: [
          { id: "help", by: 30, critical: "Did not call for help for a breech birth." },
          { id: "resus", critical: "Did not prepare newborn resuscitation before a breech birth." },
          { id: "position" },
          { id: "handsoff", critical: "Did not allow the breech to deliver spontaneously to the umbilicus." },
          { id: "back" },
          { id: "arms", critical: "Did not free the extended arms." },
          { id: "head", critical: "The after-coming head was not delivered." }
        ],
        before: [
          { a: "resus", b: "head", note: "Prepare the resuscitation area before the baby is born, not after." }
        ]
      },
      meterNote: function (r) { return r.meter > 300 ? "Umbilicus to head took " + Math.round(r.meter) + " seconds. Aim for under 5 minutes." : ""; },
      outcome: function () { return "Born at 13:09. Now: the Golden Minute."; },
      demo: ["help", "resus", "position", "handsoff", "back", "arms", "head", "handover"],
      teach: "Assisted breech birth: hands off until the umbilicus, then back upwards and hold the hips. Free extended arms (Løvset), deliver the head with flexion (Mauriceau–Smellie–Veit) and suprapubic pressure. Never pull. Prepare newborn resuscitation before the birth.",
      next: "Resuscitate the baby"
    }
  },

  resus: {
    start: { hr: 70 },
    timeLimit: 300,
    intro: "The baby is born floppy and not breathing. The clock is running from birth. Watch the heart rate and the chest.",
    actions: [
      { id: "help", label: "Call for help", cost: 0, group: "Prepare" },
      { id: "dry", label: "Dry thoroughly and remove the wet cloth", cost: 15, group: "Prepare" },
      { id: "stimulate", label: "Rub the back to stimulate", cost: 10, group: "Prepare" },
      { id: "suction", label: "Clear the airway: suction mouth, then nose", cost: 15, group: "Airway" },
      { id: "cord", label: "Clamp and cut the cord; move to the resuscitation area", cost: 10, group: "Airway" },
      { id: "ventilate", label: "Start bag-and-mask ventilation (room air, 40/min)", cost: 5, group: "Breathe" },
      { id: "chest", label: "Check that the chest is rising", cost: 3, group: "Breathe" },
      { id: "reposition", label: "Reposition head and reapply mask", cost: 10, group: "Breathe" },
      { id: "vent30", label: "Ventilate for 30 seconds", cost: 30, group: "Breathe" },
      { id: "hr", label: "Check heart rate (stethoscope)", cost: 6, group: "Assess" },
      { id: "oxygen", label: "Connect 100% oxygen", cost: 5, group: "Assess" },
      { id: "compress", label: "Start chest compressions", cost: 30, group: "Assess" },
      { id: "wait", label: "Wait to see if he breathes on his own", cost: 30, group: "Other" },
      { id: "dangle", label: "Hold upside down and slap the back", cost: 10, group: "Other" },
      { id: "naloxone", label: "Give naloxone", cost: 10, group: "Other" },
      { id: "stop", label: "Breathing well: stop ventilation and hand over", cost: 0, group: "Finish" }
    ],
    messages: {
      late: "Did not start ventilation within 2 minutes of birth.",
      ineffective: "Ventilation was never effective (chest not rising).",
      compress: "Started chest compressions when they were not indicated.",
      wait: "Waited for spontaneous breathing instead of ventilating.",
      dangle: "Held the baby upside down and slapped him.",
      naloxone: "Gave naloxone, which has no place in newborn resuscitation here.",
      stopEarly: "Stopped ventilation before the baby was breathing regularly."
    },
    afterStable: "At 10 minutes the baby is pink, crying and breathing regularly, with a heart rate of 146. Apgar scores 3 at 1 minute, 7 at 5 minutes and 9 at 10 minutes. He weighs 2.9 kg."
  },

  tests: [
    { id: "hiv", label: "HIV rapid test (mother)", group: "Mother", essential: true },
    { id: "rpr", label: "Syphilis (RPR) (mother)", group: "Mother", essential: true },
    { id: "hb", label: "Haemoglobin (mother)", group: "Mother", essential: true },
    { id: "group", label: "Blood group and Rh (mother)", group: "Mother", essential: true },
    { id: "pet", label: "Platelets, kidney and liver function (pre-eclampsia bloods)", group: "Mother", essential: true },
    { id: "gluc", label: "Glucose (baby)", group: "Baby", essential: false, appropriate: true },
    { id: "us", label: "Ultrasound of the mother's abdomen", group: "Other", essential: false, appropriate: false, why: "The baby is born. It answers no question you have now." },
    { id: "xray", label: "X-ray of the baby's hips", group: "Other", essential: false, appropriate: false, why: "Breech babies need a hip check, but by clinical examination now and ultrasound at about 6 weeks, not an X-ray today." }
  ],

  results: {
    turnaround: "Rapid tests in 15 minutes; hospital bloods by phone in 2 hours (simulated).",
    reports: {
      hiv: { title: "HIV rapid test", rows: [
        { analyte: "Screening test", value: "Reactive", unit: "", range: "Non-reactive", flag: "H", critical: true, key: "hivpos" },
        { analyte: "Confirmatory test", value: "Reactive", unit: "", range: "Non-reactive", flag: "H", key: "hivconf" } ]},
      rpr: { title: "Syphilis", rows: [ { analyte: "RPR", value: "Non-reactive", unit: "", range: "Non-reactive", flag: "", key: "rprneg" } ]},
      hb: { title: "Haemoglobin", rows: [ { analyte: "Haemoglobin", value: "9.2", unit: "g/dL", range: "≥ 11.0 in pregnancy", flag: "L", key: "hb" } ]},
      group: { title: "Blood group", rows: [ { analyte: "ABO and Rh", value: "A, RhD positive", unit: "", range: "", flag: "" } ]},
      pet: { title: "Pre-eclampsia bloods", rows: [
        { analyte: "Platelets", value: "182", unit: "×10⁹/L", range: "150–400", flag: "", key: "pltok" },
        { analyte: "Creatinine", value: "71", unit: "µmol/L", range: "49–90", flag: "" },
        { analyte: "ALT", value: "28", unit: "U/L", range: "7–35", flag: "" } ]},
      gluc: { title: "Baby glucose", rows: [ { analyte: "Glucose", value: "3.1", unit: "mmol/L", range: "> 2.6", flag: "" } ]},
      us: { title: "Ultrasound", text: "Post-partum uterus. Nothing else." },
      xray: { title: "X-ray", text: "Not done: the radiographer queried the request." }
    },
    significant: ["hivpos", "hivconf", "hb", "pltok"],
    criticalNote: "Newly diagnosed HIV at delivery, with no antenatal treatment: the baby is at high risk. He needs high-risk infant prophylaxis and a birth HIV PCR, and Zinhle starts ART today."
  },

  diagnosis: {
    options: [
      { id: "full", label: "Unbooked adolescent at term: assisted breech birth, pre-eclampsia without severe features, anaemia and newly diagnosed HIV (high-risk baby)", score: 100 },
      { id: "breech", label: "Breech birth only; otherwise healthy", score: 30 },
      { id: "severe", label: "Eclampsia", score: 20 },
      { id: "chronic", label: "Chronic hypertension", score: 10 }
    ],
    explain: "Blood pressure 148/96 with 2+ protein after 20 weeks and normal platelets, kidney and liver tests is pre-eclampsia without severe features, but it can worsen after birth. She is anaemic. Two reactive HIV tests confirm HIV. Because she had no ART in pregnancy, her baby is at high risk of HIV and needs the high-risk prophylaxis regimen."
  },

  medicationChart: {
    intro: "Mother and baby, the first hour. Check every line.",
    lines: [
      { id: "oxy", drug: "Oxytocin", order: "10 units IM within 1 minute of birth, after excluding a second baby", error: false },
      { id: "ergo", drug: "Ergometrine", order: "0.5 mg IM if the uterus is not well contracted", error: true,
        why: "Ergometrine is contraindicated in hypertension and pre-eclampsia: it can cause a dangerous rise in blood pressure, stroke or fits. Use oxytocin." },
      { id: "art", drug: "Tenofovir / lamivudine / dolutegravir (TLD)", order: "One tablet daily, start today", error: false },
      { id: "infant", drug: "Infant HIV prophylaxis", order: "Start when the mother's viral load result is back", error: true,
        why: "With no maternal ART in pregnancy, the baby is high risk. High-risk prophylaxis (nevirapine and zidovudine) must start as soon as possible after birth, not after a viral load." },
      { id: "vitk", drug: "Vitamin K (baby)", order: "1 mg IM once", error: false },
      { id: "iron", drug: "Ferrous sulphate", order: "200 mg daily", error: false }
    ]
  },

  management: {
    options: [
      { id: "transfer", label: "Transfer mother and baby to hospital (pre-eclampsia, new HIV, a resuscitated breech baby)", kind: "critical" },
      { id: "pmtct", label: "Start ART for her today and high-risk prophylaxis for the baby, with an HIV PCR test at birth", kind: "critical" },
      { id: "bp", label: "Check BP, pulse and urine output every 30 minutes; watch for headache and visual changes", kind: "critical" },
      { id: "feed", label: "Support exclusive breastfeeding with ART", kind: "essential" },
      { id: "hips", label: "Arrange a hip ultrasound for the baby at about 6 weeks (breech)", kind: "essential" },
      { id: "contra", label: "Offer contraception before discharge", kind: "essential" },
      { id: "social", label: "Refer to the social worker (adolescent mother, school, grants)", kind: "essential" },
      { id: "shame", label: "Tell her this is what happens when girls sleep around", kind: "harmful", critical: "Shamed an adolescent mother." },
      { id: "formula", label: "Tell her not to breastfeed because of HIV", kind: "harmful", critical: "Advised against breastfeeding contrary to PMTCT guidance (breastfeeding with ART is recommended)." },
      { id: "gogo", label: "Tell Gogo the HIV result so she can supervise the medicine", kind: "harmful", critical: "Disclosed an adolescent's HIV status without her consent." }
    ]
  },

  followupPick: function () { return this.followup; },
  followup: {
    time: "Six hours after the birth, on the hospital postnatal ward",
    situation: "Zinhle has a severe headache and is seeing flashing lights. BP 168/112. Reflexes very brisk. The baby is breastfeeding beside her.",
    options: [
      { id: "mgso4", label: "Severe pre-eclampsia after birth: magnesium sulfate to prevent fits, a fast-acting antihypertensive (nifedipine), call the doctor, close monitoring", correct: true },
      { id: "panado", label: "Paracetamol for the headache and review in the morning", correct: false },
      { id: "home", label: "The baby is born, so the pre-eclampsia is over: plan discharge", correct: false },
      { id: "diazepam", label: "Diazepam to calm her down", correct: false }
    ],
    explain: "Pre-eclampsia can worsen, and eclampsia can happen, in the days after birth. Severe headache, visual symptoms and BP of 160/110 or more need magnesium sulfate and urgent BP control, exactly as in pregnancy."
  },

  extraFeedback: function (s) {
    var out = [];
    if (s.asked.indexOf("father") === -1) out.push("You did not ask about the baby's father and his age. For an adolescent, this is a safeguarding question. Here he is 17, so no report is needed.");
    return out;
  },
  exampleErrors: ["Tried to transfer a breech birth that was already imminent.", "Pulled on a breech baby, risking extended arms and a trapped head.", "Missed a prescribing error: Ergometrine, 0.5 mg IM if the uterus is not well contracted."],

  learningPoints: [
    "Unbooked adolescents arrive with everything undiscovered: check BP, urine, HIV, syphilis and Hb on arrival.",
    "A head at the top of the uterus means breech. If the breech is at the perineum, assist the birth; don't put her in an ambulance.",
    "Hands off the breech; back upwards; Løvset for the arms; Mauriceau–Smellie–Veit for the head. Never pull.",
    "Prepare newborn resuscitation before every breech birth.",
    "Ergometrine is contraindicated in pre-eclampsia.",
    "HIV diagnosed at delivery: ART for the mother today, high-risk prophylaxis for the baby now, and breastfeeding with ART.",
    "Pre-eclampsia doesn't end at birth. Severe features after delivery need magnesium sulfate.",
    "Her HIV status is hers to share. Pregnant learners may return to school."
  ]
});

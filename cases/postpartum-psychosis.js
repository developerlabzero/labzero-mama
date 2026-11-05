/*
 * LabZero Mama case: "The women in white want my baby"
 * Content licence: CC BY 4.0 (see CONTENT_LICENSE.md). Code licence: MIT.
 *
 * FICTIONAL TRAINING CASE. Not for clinical use.
 * Clinical and legal content is pending review by a psychiatrist and a
 * clinician familiar with the Mental Health Care Act 17 of 2002.
 */
window.MAMA_CASES = window.MAMA_CASES || [];
window.MAMA_CASES.push({
  id: "postpartum-psychosis",
  version: "0.1.0",
  status: "Draft: pending clinical validation",
  title: "The women in white want my baby",
  family: "Mental health: postpartum psychosis",
  inSurge: true,
  why: "Postpartum psychosis is rare but a psychiatric emergency, with risks to mother and baby. In many communities it is first understood as bewitchment, and people arrive tied up. How the first hour is handled decides whether she is safe, treated with dignity, and brought into care.",
  setting: "Ikhwezi Community Health Centre, then the regional hospital psychiatric unit",
  patient: { name: "Lindiwe Zulu", age: 26, obstetric: "Para 1. Baby boy born 18 days ago, normal delivery", arrival: "Carried in by family and neighbours at 11:40, tied with rope" },
  opening: "They're standing behind you! The women in white!",
  steps: ["arrival", "vitals", "history", "exam", "triage", "tests", "results", "diagnosis", "meds", "manage", "family", "followup"],
  stepLabels: { arrival: "At the gate", vitals: "Vitals", history: "Her mother", exam: "Examine", triage: "Decision", family: "Family meeting" },
  stepSettings: {
    arrival: "Ikhwezi CHC · the gate, then the quiet room · 11:40", vitals: "Ikhwezi CHC · the quiet room",
    history: "Ikhwezi CHC · corridor outside the quiet room", exam: "Ikhwezi CHC · the quiet room",
    triage: "Ikhwezi CHC · deciding what happens next", tests: "Ikhwezi CHC · the quiet room",
    results: "Ikhwezi CHC · results back by phone", diagnosis: "Ikhwezi CHC", meds: "Ikhwezi CHC · the quiet room",
    manage: "Ikhwezi CHC", family: "Ikhwezi CHC · the family room", followup: "Ikhwezi CHC · ambulance bay"
  },
  sceneDomains: { arrival: "safety" },
  domains: [
    { id: "experience", label: "Decision at the gate" }, { id: "safety", label: "Safe de-escalation" },
    { id: "vitals", label: "Vitals and injuries" }, { id: "history", label: "Collateral history" },
    { id: "assessment", label: "Examination" }, { id: "prioritisation", label: "Legal and clinical decision" },
    { id: "investigations", label: "Excluding medical causes" }, { id: "interpretation", label: "Result interpretation" },
    { id: "diagnosis", label: "Diagnosis" }, { id: "medication", label: "Medication safety" },
    { id: "management", label: "Management" }, { id: "family", label: "Family and culture" },
    { id: "monitoring", label: "Monitoring and response" }
  ],

  tuto: {
    arrival: "Safety first, dignity always. One calm voice, fewer people, a quiet space, and never approach alone. Ropes hurt people; trained staff keep them safe.",
    vitals: "Psychosis after birth can be caused by medical illness. Blood pressure, temperature and glucose come first, then her hands and feet.",
    history: "She can't tell you her story, so her mother must. Ask the questions that could save two lives: the baby, self-harm, fever, drugs.",
    exam: "Mental state, a neurological check, the injuries from the ropes, and a postnatal check for infection.",
    triage: "Can she decide for herself right now? Is anyone in danger? The law gives you a path when the answer is no and yes.",
    tests: "You are excluding medical causes: infection, thyroid, drugs, HIV, syphilis, salts and sugar.",
    family: "Respect their beliefs, explain the illness, remove blame, and plan for the baby."
  },

  monitor: function (s) {
    var calm = ["meds", "manage", "family", "followup", "debrief"].indexOf(s.stepId) !== -1;
    return [
      { k: "Agitation", v: calm ? "Settled" : "Severe", u: "", alert: !calm },
      { k: "BP", v: "142/92", u: "mmHg", alert: true },
      { k: "HR", v: calm ? "92" : "112", u: "/min", alert: !calm },
      { k: "Sleep", v: "0 h", u: "4 nights", alert: true }
    ];
  },

  scenes: {
    arrival: {
      title: "At the gate",
      lead: "Lindiwe is on a blanket on the ground. Her wrists and ankles are tied with washing line. She is screaming, then crying, then whispering to someone nobody else can see.",
      event: function (s, day) {
        if (day && day.surge === 3) return "She broke free when you told the family to untie her, ran into the road and was dragged back. She has a graze on her forehead and is even more frightened.";
        if (day && day.surge === 0) return "Sister Nkosi and security moved her to the quiet room and kept watch while you dealt with the bleeding. Now it's your turn.";
        return null;
      },
      turns: [
        { speaker: "Her uncle", line: "Keep away from her! She bit her brother! She's possessed!",
          options: [
            { text: "One calm voice: “I'm the nurse. We are going to help her. Please carry her to the quiet room. Two family members stay with her; everyone else please wait outside.”", score: 100, reply: "The crowd thins. Her mother and husband carry the blanket in." },
            { text: "“The clinic doesn't take mental patients. Take her to the hospital.”", score: 0, flag: "Turned away a patient in a psychiatric emergency.", reply: "The family has no transport. They argue at the gate." },
            { text: "“Call the police. This is a police matter.”", score: 20, reply: "The police are 40 minutes away. She is still on the ground." }
          ]},
        { speaker: "Sister Nkosi", line: "Her hands are swollen and dark. She keeps pulling at the ropes.",
          options: [
            { text: "With four trained staff, a clear room and security at the door, remove the ropes now. Check the circulation and skin of her hands and feet. Keep the room quiet and dim.", score: 100, reply: "The ropes come off. She curls up in the corner, sobbing, but doesn't run." },
            { text: "Leave the ropes on. It's safer for everyone.", score: 0, flag: "Left a person tied with rope despite signs of poor circulation.", reply: "Her fingers are turning blue." },
            { text: "Untie her yourself while the family waits outside.", score: 20, flag: "Approached an agitated patient alone.", reply: "She lashes out and scratches your face." }
          ]},
        { speaker: "Lindiwe", line: "They're behind you! The women in white! They want my baby!",
          options: [
            { text: "Speak simply and calmly, at her eye level, at a safe distance: “Lindiwe, I'm a nurse. You're safe here. I can see you're very frightened.” Don't argue about what she sees and don't pretend to see it.", score: 100, reply: "She looks at you for the first time. “Are they gone?” “You're safe with us,” you say." },
            { text: "“There's nobody there. Stop it.”", score: 20, reply: "She screams louder and turns her face to the wall." },
            { text: "“Yes, I see them too. They've gone now.”", score: 30, reply: "She stares past you, more frightened: “Then they're real.”" }
          ]}
      ],
      teach: "De-escalation: one calm voice, fewer people, a quiet space, enough trained staff, never alone. Ropes cause injury and are not a safe form of restraint. Don't argue with hallucinations and don't confirm them; acknowledge the fear.",
      next: "Take her vital signs"
    },

    family: {
      title: "The family meeting",
      lead: "Lindiwe is sedated and calm. Her mother, her uncle and her husband Sbu are waiting in the family room.",
      turns: [
        { speaker: "Uncle Bheki", line: "This is amafufunyana. Someone sent it. We need the prophet, not your injections.",
          options: [
            { text: "“I respect your beliefs, and you can pray with her and involve your church. Right now she has a serious illness that can come after a birth, and medicine helps it. Can we work together, so she gets both?”", score: 100, reply: "He folds his arms, then nods slowly. “The prophet can visit her there?” “Yes.”" },
            { text: "“That's superstition. Science says otherwise.”", score: 20, reply: "He stands up. “Then we will take her home.”" },
            { text: "“Fine. Take her to the prophet.”", score: 0, flag: "Discharged a psychiatric emergency into the care of a faith healer.", reply: "Her mother looks at you in panic." }
          ]},
        { speaker: "Sbu, her husband", line: "Will she be like this forever? Did I do something? Will she hurt our son?",
          options: [
            { text: "“This is a known illness called postpartum psychosis. It is nobody's fault. With treatment most women recover fully. Until she is well, she mustn't be alone with the baby, and we'll help you with feeding him.”", score: 100, reply: "Sbu lets out a long breath. “She's coming back?” “That's what we expect.”" },
            { text: "“It's hard to say. These things are unpredictable.”", score: 30, reply: "He stares at the floor." },
            { text: "“She might never be the same.”", score: 0, flag: "Gave a frightening and inaccurate prognosis.", reply: "Her mother starts to cry." }
          ]},
        { speaker: "MaZulu, her mother", line: "Why did you untie her? And people say mad people get locked up forever.",
          options: [
            { text: "“The ropes were hurting her hands. In hospital, trained staff keep her safe. The law protects her: every admission without consent is reviewed, and she comes home when she is well.”", score: 100, reply: "MaZulu holds your hand. “Thank you for looking after my child.”" },
            { text: "“That's the hospital's problem now.”", score: 0, reply: "She turns away." },
            { text: "“Yes, she might be there a long time.”", score: 20, reply: "Uncle Bheki says: “Then she stays with us.”" }
          ]}
      ],
      teach: "Respect cultural explanations and work alongside them; don't argue or abandon. Explain the illness in plain words, remove blame, give realistic hope, and make a clear plan for the baby."
    }
  },

  vitals: [
    { id: "bp", label: "Blood pressure", value: "142/92", unit: "mmHg", abnormal: true, essential: true, line: "(screams) Don't squeeze me!" },
    { id: "temp", label: "Temperature", value: "37.1", unit: "°C", abnormal: false, essential: true, line: "(whispering) They're cold. Their hands are cold." },
    { id: "pulse", label: "Pulse", value: "112", unit: "/min", abnormal: true, essential: true, line: "My heart is running away." },
    { id: "glucose", label: "Finger-prick glucose", value: "5.4", unit: "mmol/L", abnormal: false, essential: true, line: "Don't take my blood! They want my blood!" },
    { id: "spo2", label: "Oxygen saturation", value: "98", unit: "%", abnormal: false, essential: false, line: "(silent, staring at the ceiling)" },
    { id: "urine", label: "Urine dipstick", value: "No protein, no leucocytes, no nitrites", unit: "", abnormal: false, essential: true, line: "Her mother helps. Lindiwe cries the whole time." },
    { id: "limbs", label: "Hands and feet (after the ropes)", value: "Rope burns on both wrists and ankles; left hand swollen, capillary refill 3 s", unit: "", abnormal: true, essential: true, line: "My hands are burning." },
    { id: "weight", label: "Weight", value: "Not possible", unit: "", abnormal: false, essential: false, line: "She won't stand on the scale." }
  ],

  history: {
    speaker: "MaZulu", speakerRole: "her mother", title: "Collateral history from her mother",
    prompt: "Lindiwe can't give a history. Her mother can. Ask in your own words.",
    intents: [
      { id: "onset", chip: "When did this start, and how?", critical: true,
        keywords: ["start", "began", "when", "how long", "since", "first"],
        reply: "Four days ago she stopped sleeping. Then she started saying the baby isn't hers, that it was swapped at the hospital. Yesterday she started seeing the women." },
      { id: "baby", chip: "Has she said or done anything that could harm the baby?", critical: true,
        keywords: ["baby", "harm", "hurt", "son", "child", "infant", "danger"],
        reply: "Last night she tried to leave with him in the rain, at two in the morning. She said she must hide him. We took him from her. He's with my sister now." },
      { id: "self", chip: "Has she talked about hurting herself or dying?", critical: true,
        keywords: ["suicide", "die", "kill", "herself", "self", "death", "dead"],
        reply: "She said she wants to die so the women will leave the baby alone. That's why we tied her." },
      { id: "voices", chip: "What does she see and hear?", critical: true,
        keywords: ["see", "hear", "voices", "hallucinations", "talking", "seeing", "people"],
        reply: "Women in white clothes behind people. She says they talk to her and tell her the baby is cursed." },
      { id: "drugs", chip: "Does she use alcohol, dagga or other drugs?", critical: true,
        keywords: ["alcohol", "drink", "dagga", "drugs", "tik", "smoke", "substance", "weed"],
        reply: "Never. She teaches Sunday school." },
      { id: "fever", chip: "Any fever, headaches, fits or smelly discharge since the birth?", critical: true,
        keywords: ["fever", "hot", "headache", "fits", "seizure", "discharge", "smell", "infection"],
        reply: "No fever that I know of. No fits. She hasn't complained of a headache." },
      { id: "familyhx", chip: "Has anyone in the family had mental illness?", critical: true,
        keywords: ["family", "relatives", "aunt", "mental", "runs", "before her", "history"],
        reply: "My sister went like this after her first baby, many years ago. They said it was witchcraft too." },
      { id: "birth", chip: "How was the pregnancy and birth?", critical: false,
        keywords: ["birth", "delivery", "pregnancy", "labour", "born", "hospital"],
        reply: "A normal birth at the hospital. They said her blood pressure was a bit high near the end; they gave her tablets for a week." },
      { id: "sleep", chip: "How has she been sleeping?", critical: false,
        keywords: ["sleep", "night", "awake", "rest", "tired"], reply: "Not at all for four nights. She walks around the house." },
      { id: "remedy", chip: "Has she taken any medicine or traditional remedies?", critical: false,
        keywords: ["medicine", "tablets", "traditional", "inyanga", "herbs", "imbiza", "muthi", "remedy"],
        reply: "The inyanga gave her imbiza two days ago. She vomited it out. Nothing since." },
      { id: "before", chip: "Has she ever been like this before?", critical: false,
        keywords: ["before", "ever", "previous", "past", "again"], reply: "Never. She was a happy girl." },
      { id: "feeding", chip: "Is she breastfeeding?", critical: false,
        keywords: ["breastfeed", "breast", "feeding", "milk", "formula"], reply: "She was. Since yesterday we give him formula." },
      { id: "hiv", chip: "Do you know her HIV status?", critical: false,
        keywords: ["hiv", "status", "arv", "test"], reply: "She tested negative when the baby was born." }
    ],
    fallback: "I don't understand, nurse. Ask me another way."
  },

  examTitle: "Examine her",
  examLead: "She is calmer in the quiet room. With her mother present, and enough staff in the room. The finding appears when you perform each examination.",
  exam: [
    { id: "mse", label: "Mental state examination", essential: true,
      finding: "Dishevelled and agitated; cries, then laughs. Talks to unseen people. Believes the baby was swapped and is cursed. Knows where she is and who her mother is; unsure of the date. No insight: “I'm not sick, I'm cursed.”" },
    { id: "neuro", label: "Neurological examination", essential: true,
      finding: "No neck stiffness. Pupils equal and reactive. No weakness. Reflexes normal, no clonus." },
    { id: "postnatal", label: "Postnatal check (abdomen, lochia, breasts)", essential: true,
      finding: "Uterus well involuted and not tender. Lochia normal, not offensive. Breasts full but not red or hot." },
    { id: "injuries", label: "Injury check (rope marks, head)", essential: true,
      finding: "Rope burns on both wrists and ankles. Small graze on the left forearm. No head injury." },
    { id: "chest", label: "Chest", essential: false, finding: "Clear." },
    { id: "thyroid", label: "Thyroid", essential: false, finding: "No goitre." }
  ],

  triage: {
    title: "What happens next?",
    question: "She cannot make this decision for herself right now. Decide",
    vitals: [
      { label: "Psychosis", value: "Acute, 18 days postpartum", unit: "", flag: "high" },
      { label: "Baby", value: "Delusions about him; tried to leave at night", unit: "", flag: "high" },
      { label: "Suicide", value: "Says she wants to die", unit: "", flag: "high" },
      { label: "Insight", value: "None", unit: "" }
    ],
    look: "Lindiwe is curled in the corner, whispering. Her mother asks: “Can she come home tonight?”",
    options: [
      { id: "mhca", label: "Emergency psychiatric care", detail: "Emergency care now; an application for involuntary care under the Mental Health Care Act; transfer to the hospital psychiatric unit for a 72-hour assessment", score: 100 },
      { id: "home", label: "Home with the family", detail: "Sedate her and let the family watch her at home with the baby", score: 0, critical: "Sent home a woman with postpartum psychosis who has delusions about her baby." },
      { id: "police", label: "Hand over to the police", detail: "Ask SAPS to keep her in the cells until she calms down", score: 0, critical: "Treated a psychiatric emergency as a police matter." },
      { id: "routine", label: "Routine appointment", detail: "Psychiatry appointment next week", score: 10, critical: "Delayed care for a psychiatric emergency." }
    ],
    feedback: "Acute psychosis weeks after birth, with delusions about the baby and a wish to die, is an emergency for her and the baby. She cannot consent right now, so care goes ahead under the Mental Health Care Act: emergency care, an application for involuntary care, and a 72-hour assessment in a designated unit, after medical causes have been excluded."
  },

  tests: [
    { id: "fbc", label: "Full blood count", group: "Blood", essential: true },
    { id: "ue", label: "Kidney function, sodium and calcium", group: "Blood", essential: true },
    { id: "tsh", label: "Thyroid function (TSH)", group: "Blood", essential: true },
    { id: "hiv", label: "HIV test", group: "Blood", essential: true },
    { id: "rpr", label: "Syphilis (RPR)", group: "Blood", essential: true },
    { id: "uds", label: "Urine drug screen", group: "Urine", essential: true },
    { id: "lft", label: "Liver function", group: "Blood", essential: false, appropriate: true },
    { id: "ct", label: "CT scan of the head", group: "Imaging", essential: false, appropriate: false, why: "No focal signs, no head injury, no fever and a normal neurological examination. A CT would need heavy sedation and wouldn't change the plan now." },
    { id: "cultures", label: "Blood cultures", group: "Blood", essential: false, appropriate: false, why: "No fever and a normal postnatal check: there is no sign of sepsis." },
    { id: "eeg", label: "EEG", group: "Other", essential: false, appropriate: false, why: "No history of fits; not available or needed at clinic level." }
  ],

  results: {
    turnaround: "Results phoned through from the laboratory at 16:00 (simulated).",
    reports: {
      fbc: { title: "Full blood count", rows: [
        { analyte: "Haemoglobin", value: "11.6", unit: "g/dL", range: "12.0–15.0", flag: "L" },
        { analyte: "White cells", value: "8.2", unit: "×10⁹/L", range: "4.0–11.0", flag: "", key: "wccn" },
        { analyte: "Platelets", value: "268", unit: "×10⁹/L", range: "150–400", flag: "" } ]},
      ue: { title: "Kidney function and electrolytes", rows: [
        { analyte: "Sodium", value: "138", unit: "mmol/L", range: "135–145", flag: "" },
        { analyte: "Creatinine", value: "62", unit: "µmol/L", range: "49–90", flag: "" },
        { analyte: "Calcium (corrected)", value: "2.31", unit: "mmol/L", range: "2.15–2.50", flag: "" } ]},
      tsh: { title: "Thyroid", rows: [ { analyte: "TSH", value: "1.8", unit: "mIU/L", range: "0.4–4.0", flag: "", key: "tshn" } ]},
      hiv: { title: "HIV", rows: [ { analyte: "HIV rapid test", value: "Negative", unit: "", range: "Negative", flag: "", key: "hivn" } ]},
      rpr: { title: "Syphilis", rows: [ { analyte: "RPR", value: "Non-reactive", unit: "", range: "Non-reactive", flag: "", key: "rprn" } ]},
      uds: { title: "Urine drug screen", rows: [
        { analyte: "Cannabis", value: "Negative", unit: "", range: "Negative", flag: "", key: "udsn" },
        { analyte: "Methamphetamine", value: "Negative", unit: "", range: "Negative", flag: "" },
        { analyte: "Methaqualone", value: "Negative", unit: "", range: "Negative", flag: "" } ]},
      lft: { title: "Liver function", rows: [ { analyte: "ALT", value: "22", unit: "U/L", range: "7–35", flag: "" } ]},
      ct: { title: "CT head", text: "Normal. (She needed heavy sedation and an escort for two hours.)" },
      cultures: { title: "Blood cultures", text: "No growth at 48 hours." },
      eeg: { title: "EEG", text: "Not available at this facility." }
    },
    significant: ["wccn", "tshn", "hivn", "rprn", "udsn"],
    criticalNote: ""
  },

  diagnosis: {
    options: [
      { id: "pp", label: "Postpartum (puerperal) psychosis", score: 100 },
      { id: "ppd", label: "Postpartum depression", score: 20 },
      { id: "subs", label: "Substance-induced psychosis", score: 10 },
      { id: "delirium", label: "Delirium from postpartum infection", score: 10 },
      { id: "blues", label: "Baby blues", score: 0 },
      { id: "spirit", label: "Not a medical illness: spirit possession (amafufunyana)", score: 0 }
    ],
    explain: "Sudden hallucinations, delusions about the baby, severe agitation and no sleep, starting within weeks of the birth, in a woman with no psychiatric history and a relative who had a similar episode after childbirth, with medical causes excluded (no fever, normal postnatal check, normal thyroid, no drugs, HIV and syphilis negative), is postpartum psychosis. It is an emergency because of the risk of suicide and of harm to the baby, and it usually responds well to treatment. Her slightly raised blood pressure with no protein in the urine needs re-checking but does not explain the psychosis."
  },

  medicationChart: {
    intro: "The doctor has charted medicines for severe agitation and for the transfer. Check every line.",
    lines: [
      { id: "loraz", drug: "Lorazepam", order: "2 mg IM stat if she cannot be calmed by talking and will not take oral medicine", error: false },
      { id: "halo", drug: "Haloperidol", order: "5 mg IM; may repeat once after 30–60 minutes if still severely agitated", error: false },
      { id: "diaz", drug: "Diazepam", order: "10 mg IM stat", error: true,
        why: "IM diazepam is absorbed slowly and unpredictably. Use IM lorazepam, or give diazepam IV only." },
      { id: "bromo", drug: "Bromocriptine", order: "2.5 mg twice a day to stop the breast milk", error: true,
        why: "Bromocriptine is not recommended for stopping breast milk. It has been linked to postpartum psychosis, high blood pressure, seizures and stroke. If breastfeeding stops, use non-drug measures." },
      { id: "dress", drug: "Silver sulfadiazine cream", order: "Apply to the rope burns twice a day", error: false }
    ]
  },

  management: {
    options: [
      { id: "obs", label: "After sedation, check pulse, blood pressure, breathing, oxygen and level of consciousness every 15 minutes for the first hour", kind: "critical" },
      { id: "baby", label: "Make sure the baby is safe and fed with the grandmother; mother and baby are never alone together until she has been assessed", kind: "critical" },
      { id: "transfer", label: "Transfer by ambulance with a nurse escort, with the Mental Health Care Act forms and a written handover", kind: "critical" },
      { id: "restraint", label: "If restraint is needed again, use proper equipment only, record the reason and the time, and check her often", kind: "essential" },
      { id: "wounds", label: "Clean and dress the rope burns", kind: "essential" },
      { id: "mbu", label: "Ask the psychiatric team about a mother-and-baby unit, and about breastfeeding with her medicines", kind: "essential" },
      { id: "bp", label: "Re-check her blood pressure; note the raised reading in the handover", kind: "essential" },
      { id: "ropes", label: "Let the family tie her again for the ambulance ride", kind: "harmful", critical: "Allowed rope restraint." },
      { id: "cells", label: "Keep her in a police cell until a bed is found", kind: "harmful", critical: "Detained a psychiatric patient in a police cell." },
      { id: "bond", label: "Let her hold and feed the baby alone to help them bond", kind: "harmful", critical: "Left a psychotic mother alone with her baby." }
    ]
  },

  followupPick: function () { return this.followup; },
  followup: {
    time: "In the ambulance bay, 90 minutes after the haloperidol",
    situation: "Lindiwe is calmer, but now her neck is twisted to one side, her eyes are rolled upwards and her jaw is clenched. She is terrified and can't speak clearly. Her breathing is fine.",
    options: [
      { id: "biperiden", label: "Acute dystonia: give biperiden 2 mg IM, reassure her, and tell the receiving team", correct: true },
      { id: "more", label: "More haloperidol: she is agitated again", correct: false },
      { id: "faking", label: "She is putting it on; ignore it", correct: false },
      { id: "tie", label: "Restrain her for the journey", correct: false }
    ],
    explain: "This is an acute dystonic reaction, a common early side effect of haloperidol, especially in young people. An anticholinergic such as biperiden relieves it within minutes. Record it: it guides the choice of antipsychotic later."
  },

  extraFeedback: function (s, day) {
    var out = [];
    if (day && day.surge === 3) out.push("At the gate you had her untied in a crowd without a plan. She ran into the road.");
    if (s.asked.indexOf("baby") === -1) out.push("You did not ask about the baby. In postpartum psychosis, always ask directly about thoughts of harming the baby.");
    return out;
  },
  exampleErrors: ["Left a person tied with rope despite signs of poor circulation.", "Sent home a woman with postpartum psychosis who has delusions about her baby.", "Missed a prescribing error: Diazepam, 10 mg IM stat."],

  learningPoints: [
    "Psychosis in the weeks after birth is postpartum psychosis until proven otherwise: an emergency for mother and baby.",
    "Exclude medical causes: fever, blood pressure, glucose, thyroid, drugs, HIV and syphilis.",
    "De-escalate first: one calm voice, a quiet room, enough trained staff. Remove ropes safely and check the limbs.",
    "When she can't consent and is at risk, the Mental Health Care Act gives a lawful, reviewed path to care.",
    "Respect the family's beliefs and work with them. Remove blame. Plan for the baby.",
    "Haloperidol can cause acute dystonia; an anticholinergic relieves it quickly."
  ],

  support: "Mental health: SADAG 0800 567 567 (check numbers before use)."
});

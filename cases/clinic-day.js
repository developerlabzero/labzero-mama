/*
 * LabZero Mama: the clinic day (shared lobby). Content licence: CC BY 4.0. Code licence: MIT.
 * Fictional clinic and patients. Not for clinical use.
 */
window.MAMA_CLINIC = {
  name: "Ikhwezi Community Health Centre",
  opened: "07:30",
  now: "09:40",
  intro: "It is Monday morning. The clinic opened at 07:30, but the queue started before sunrise. The benches are full, the fan is broken, and the security guard is calling tickets for the file room. You are the nurse doing the morning queue walk.",
  ambient: [
    "Security guard: “Tickets 30 to 45, files! Files only!”",
    "A gogo on the end bench: “Every Monday it's the same. They lose the files and we lose the day.”",
    "A baby cries near the door. Someone opens a window.",
    "Cleaner: “Please don't sit on that bench, it's broken.”"
  ],
  task: "Speak to each woman. Decide whether anyone should skip the queue. Then choose a patient to follow through her whole visit.",
  patients: [
    { caseId: "cervical-cancer-hiv", ticket: "004", arrived: "05:30", waited: "4 h 10 min", mood: 3,
      look: "Thin, wrapped in a blanket, sitting apart from the others.",
      said: "I've been here since half past five. The blood keeps coming when it's not my time. And it smells. I'm ashamed to sit near people.",
      options: [
        { text: "Thank you for telling me. You'll be seen today, and I'll find you a private place and a pad while you wait.", score: 100, reply: "She nods and lets out a long breath." },
        { text: "Everyone has been waiting, mama. Please be patient.", score: 20, reply: "She pulls the blanket tighter and looks away." },
        { text: "Go to the front. I'll make them see you now.", score: 50, reply: "The bench grumbles. She is stable; the queue walk is for emergencies, but her dignity matters." }
      ]},
    { caseId: "severe-preeclampsia-34w", ticket: "012", arrived: "06:10", waited: "3 h 30 min", mood: 2,
      look: "Pregnant, holding her head, squinting at the window.",
      said: "My head is pounding since this morning, sisi, and the lights look funny. I'm 34 weeks.",
      options: [
        { text: "Come with me now. I'm taking your blood pressure straight away; you go ahead of the queue.", score: 100, fastTrack: true, reply: "She stands slowly, one hand on her belly." },
        { text: "Sit tight, the queue is moving.", score: 0, flag: "Left a pregnant woman with headache and visual disturbance in the queue.", reply: "She closes her eyes and leans on the wall." },
        { text: "Go to the maternity unit at the hospital yourself.", score: 20, flag: "Sent a woman with danger signs to find her own way to hospital.", reply: "“How? I have no taxi money,” she says." }
      ]},
    { caseId: "endometriosis-27", ticket: "019", arrived: "06:40", waited: "3 h", mood: 3,
      look: "Doubled over, a hot-water bottle pressed to her lower belly.",
      said: "Period pain again. I know they'll just give me Panado. This is my fifth time.",
      options: [
        { text: "Five visits for the same pain is a lot. Today we'll look properly. I'll make a note for the doctor.", score: 100, reply: "She looks up, surprised. “Really?”" },
        { text: "Period pain is normal, my dear. Every woman has it.", score: 0, flag: "Dismissed severe recurrent pelvic pain as normal.", reply: "“That's what they all say,” she mutters." },
        { text: "Take a Panado from the counter and go home.", score: 0, flag: "Sent a woman with recurrent pain home without assessment.", reply: "She starts to get up, then sits down again in pain." }
      ]},
    { caseId: "ipv-pregnancy", ticket: "027", arrived: "07:05", waited: "2 h 35 min", mood: 4,
      look: "Long sleeves despite the heat. She keeps checking her phone.",
      said: "Just headaches. And I can't sleep. I must be back at work by twelve or he… my manager will shout.",
      options: [
        { text: "I'll make sure you're seen in a private room. Is anyone here with you today?", score: 100, reply: "“No,” she says quietly. “Just me.”" },
        { text: "You should have come earlier then.", score: 0, reply: "She stares at her phone and says nothing." },
        { text: "Headaches? Just take Grandpa powders.", score: 0, flag: "Missed warning signs and dismissed her symptoms.", reply: "She nods and pulls her sleeves down." }
      ]},
    { caseId: "sudden-death-lobby", event: true, ticket: "033", arrived: "05:00", waited: "4 h 40 min", mood: 2,
      look: "An elderly woman in her church uniform, rubbing her left arm. Sweating, although the morning is cold.",
      said: "I'm only here for my BP and sugar tablets, my child. My chest has been heavy since I woke up. It's the cold. I'll wait my turn.",
      options: [
        { text: "Gogo, a heavy chest and a sore arm can be your heart. Come with me now: you need an ECG and the doctor straight away.", score: 100, fastTrack: true, reply: "“But the queue…” she protests, then lets you help her up." },
        { text: "Your tablets will be ready soon, Gogo. Just wait a little.", score: 0, flag: "Left an elderly woman with chest heaviness and arm pain in the queue.", reply: "She smiles politely and keeps rubbing her arm." },
        { text: "Take two Panado for the pain while you wait.", score: 0, flag: "Treated possible cardiac chest pain as a minor ache.", reply: "She swallows two tablets with water from her bottle." }
      ]},
    { caseId: "depression-medical-student", ticket: "041", arrived: "08:15", waited: "1 h 25 min", mood: 1,
      look: "Earphones in, hood up, staring at the floor.",
      said: "I'm just tired. I don't even know why I came.",
      options: [
        { text: "I'm glad you came. Sit with me a minute. How have you been feeling?", score: 100, reply: "She takes out one earphone. “Not good,” she says." },
        { text: "Young people are always tired. Sleep more.", score: 0, flag: "Dismissed a withdrawn young woman's distress.", reply: "She puts her hood back up." },
        { text: "Fill in this form and wait for your number.", score: 30, reply: "She takes the form but doesn't write anything." }
      ]}
,
    { caseId: "teen-contraception", ticket: "045", arrived: "08:50", waited: "50 min", mood: 3,
      look: "School uniform, school bag on her lap. She looks about fifteen and keeps glancing at the door.",
      said: "I just need the injection. Please, can you be quick? I'm missing school.",
      options: [
        { text: "“You did the right thing coming. This is a private service and you'll be seen today. Come and sit in the youth corner.”", score: 100, reply: "She lets out a breath and follows you." },
        { text: "“You're too young for that. Go home and talk to your mother.”", score: 0, flag: "Turned away an adolescent seeking contraception.", reply: "She leaves. She doesn't come back." },
        { text: "“Come back with your mother or a guardian.”", score: 10, flag: "Required parental consent for contraception for a 15-year-old.", reply: "“I can't,” she whispers, and leaves." }
      ]},
    { caseId: "postnatal-depression", ticket: "052", arrived: "09:05", waited: "35 min", mood: 1,
      look: "A baby asleep on her back in a blanket. She stares straight ahead and doesn't touch her phone.",
      said: "I'm only here for the baby's injections. Sorry, is this the right queue?",
      options: [
        { text: "“Yes, it is. And how are you doing, mama, since the birth?”", score: 100, reply: "She opens her mouth, closes it, and her eyes fill. “Tired,” she says." },
        { text: "“Yes. Baby clinic is quick, don't worry.”", score: 30, reply: "She nods and goes back to staring at the wall." },
        { text: "“Next time come earlier; the baby queue fills up.”", score: 0, flag: "Missed a withdrawn postnatal mother.", reply: "“Sorry,” she says again." }
      ]},
    { caseId: "gestational-diabetes", ticket: "058", arrived: "09:20", waited: "20 min", mood: 2,
      look: "Pregnant, fanning herself, drinking a cool drink. Her belly looks bigger than her dates.",
      said: "Just my 28-week check. They always find sugar in my urine, but that's normal in pregnancy, hey?",
      options: [
        { text: "“Not always. Let's look at that properly today, with your file.”", score: 100, reply: "She raises her eyebrows. “Okay… my mother does have sugar diabetes.”" },
        { text: "“Yes, very normal. Nothing to worry about.”", score: 0, flag: "Dismissed recurrent glycosuria in a high-risk pregnancy.", reply: "She finishes her cool drink." },
        { text: "“You should cut out the cool drinks.”", score: 30, reply: "She puts the bottle in her bag, embarrassed." }
      ]},
    { caseId: "tb-hiv-pregnancy", ticket: "063", arrived: "09:30", waited: "10 min", mood: 3,
      look: "Pregnant and thin, coughing into her scarf every few seconds. The people beside her have moved to the other end of the bench.",
      said: "(coughing) Sorry, sorry. It's just a cough. I'm only here for my pregnancy check.",
      options: [
        { text: "“Here's a mask. Come with me to the cough area where there's fresh air; you'll be seen first.”", score: 100, reply: "She puts on the mask. The bench breathes out." },
        { text: "“Please wait your turn like everyone else.”", score: 0, flag: "Left a coughing patient in a crowded waiting room without infection control.", reply: "She coughs on the bench for another two hours." },
        { text: "“Go and wait outside.”", score: 30, reply: "She stands outside alone, ashamed, with no mask." }
      ]}
  ],

  // Emergencies that interrupt the day (unlocked as the trainee progresses)
  collapse: {
    caseId: "sudden-death-lobby", time: "10:52",
    title: "Collapse on bench 3",
    text: "A scream from the benches. Gogo Dlamini, ticket 033, has slumped sideways. Her handbag has fallen open and her tablets are rolling across the floor. Someone shouts: “Nurse! Nurse!”"
  },

  surge: {
    time: "11:40",
    title: "Commotion at the gate",
    text: [
      "A crowd pushes through the gate. Six men and two women carry a young woman on a blanket. Her wrists and ankles are tied with washing line. She is screaming, crying and talking to someone nobody else can see. Her uncle shouts: “She's possessed! She bit her brother! Keep back!”",
      "Right behind them a taxi stops at the entrance. A young woman staggers out holding her thigh, her jeans soaked dark red. Blood drips steadily onto the paving. Her friend screams: “He stabbed her! Help us!”",
      "Two nurses are on duty in the emergency room. Everyone in the waiting area is on their feet."
    ],
    question: "You are the most senior clinician at the door. What do you do first?",
    options: [
      { text: "Go to the bleeding woman first: lie her down, press hard on the wound and shout for the emergency trolley. Ask Sister Nkosi and security to take the restrained woman and two family members to the quiet room, keep her safe and watch her breathing until you come.", score: 100,
        reply: "Sister Nkosi nods and leads the crowd away. You kneel in the blood and press down hard." },
      { text: "Deal with the screaming woman first. She is the most disruptive and is frightening the other patients.", score: 0,
        flag: "Prioritised the loudest patient over life-threatening bleeding.",
        reply: "When you look round, the floor of the taxi is red and the stabbed woman is grey and confused." },
      { text: "Phone the police for both and wait for them at the gate.", score: 0,
        flag: "Delayed emergency care to wait for the police.",
        reply: "The police say they are 40 minutes away. Nobody is treating either woman." },
      { text: "Tell the family to untie her at once so she calms down, then go to the stabbed woman.", score: 30,
        flag: "Ordered an agitated patient to be untied in a crowd without a safety plan.",
        reply: "She breaks free and runs into the road. A car brakes hard. Her brothers drag her back." }
    ],
    cases: [
      { caseId: "stab-wound-thigh", label: "Treat the stabbed woman" },
      { caseId: "postpartum-psychosis", label: "See the woman in ropes" }
    ]
  },

  maternity: [
    { caseId: "teen-breech-labour", time: "12:50", title: "Maternity unit: a schoolgirl in labour",
      text: "A grandmother half-carries a girl in a school jersey through the maternity door. The girl is gasping, bent double: “It's coming! Gogo, it's coming!” Nobody at home knew she was pregnant until this morning.",
      button: "Go to the labour ward" },
    { caseId: "pph-atony", time: "13:30", title: "Maternity unit: “She's just tired”",
      text: "A student midwife puts her head round the door: “Mrs Khumalo in bed 2 had a big baby half an hour ago. She's very pale and sleepy. She's just tired, I think?”",
      button: "Go to bed 2" },
    { caseId: "preterm-labour-31w", time: "14:10", title: "Maternity unit: “It's too early”",
      text: "A young woman walks in holding her belly, stopping every few steps. “I'm only 31 weeks. The pains are coming every few minutes. It's too early!”",
      button: "Go to the admission room" }
  ],

  taxi: {
    caseId: "septic-unsafe-abortion", time: "12:25",
    title: "Screaming in a taxi",
    text: "A minibus taxi stops at the front door. In the back seat a young woman is curled up, screaming, her skirt soaked with blood. There is a rotten smell. Her friend shouts: “She went to the abortion man on Friday! She's burning hot! We don't know if the baby is still inside!”"
  }
};

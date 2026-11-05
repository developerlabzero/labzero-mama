# LabZero Mama

An open-source, browser-based simulation that trains nurses, midwives, doctors,
pharmacists and psychologists to recognise and manage dangerous conditions in
women's health, from pregnancy to mental health.

Trainees meet a fictional patient, triage her by urgency, take a history in their
own words, examine her, order tests, read realistic laboratory reports, make a
diagnosis, check the medication chart for errors, manage her, and then respond
when her condition changes. Every decision is scored, and safety-critical errors
are reported separately.

Built by **Nothile Biolab (Pty) Ltd**, South Africa, as the open-source maternal
and newborn component of the LabZero simulation platform.

## Preterm birth, perinatal mental health and gestational diabetes (v0.9)

- **Thembeka, 23, maternity unit at 14:10.** Preterm labour at 31 weeks triggered by pyelonephritis: in-utero transfer, antenatal steroids (IM), magnesium neuroprotection, oral nifedipine, antibiotics; then the first hour of a 1.45 kg baby on a live temperature clock (plastic wrap, CPAP, glucose, colostrum), kangaroo mother care, and late-onset sepsis on day 5.
- **Ntombi, 28, ticket 052 on the queue walk.** Came for her baby's 6-week injections. EPDS screening, postnatal depression with passive suicidal thoughts, a safety plan, antidepressants safe in breastfeeding and overdose, family support, and adherence at follow-up.
- **Nosipho, 30, ticket 063 on the queue walk.** Coughing on a crowded bench while others complain: cough triage without stigma, a TB symptom screen, sputum Xpert and a repeat HIV test in pregnancy, drug-sensitive TB with newly diagnosed HIV (CD4 180), the rifampicin–dolutegravir interaction and streptomycin to catch, post-test counselling, contact tracing for her 3-year-old, and drug-induced liver injury at week 3.
- **Shireen, 36, ticket 058 on the queue walk.** "Sugar in the urine is normal in pregnancy": risk factors, 75 g OGTT, gestational diabetes, culturally fitted diet advice, metformin with monitoring, an ACE inhibitor to catch, and neonatal hypoglycaemia after birth.

## Maternal and adolescent cases (v0.8)

- **Lebo, 15, ticket 045 on the queue walk.** Wants "the injection". Confidential contraception from age 12, full method counselling (she chooses an implant), emergency contraception and condoms, and discovering that her partner is 23: a sexual offence against a child that must be reported, and how to tell her before reporting.
- **Zinhle, 16, maternity unit at 12:50.** Hid her pregnancy; arrives fully dilated with a breech at the perineum. Assisted breech birth on a live clock, newborn resuscitation, then the unbooked bloods: pre-eclampsia, anaemia and newly diagnosed HIV (same-day ART, high-risk infant prophylaxis), confidentiality of her HIV status from her grandmother, return to school, and postpartum severe pre-eclampsia.
- **Nokuthula, 34, maternity unit at 13:30.** "She's just tired": postpartum haemorrhage measured on a calibrated drape, the first-response bundle (massage, oxytocin, tranexamic acid, fluids, examine, escalate), transfer, transfusion and coagulopathy.

## Emergencies in the clinic day (v0.6)

After the trainee finishes their first patient, the day turns:

- **10:52, collapse on bench 3.** Gogo Dlamini (71), who mentioned a heavy chest during the queue walk, has a cardiac arrest. Recognise it, run adult CPR on a live clock, decide as a team when to stop, protect her dignity and the frightened waiting room, tell her daughter, and carry out the duties after a death. She dies whatever you do; the lesson is triage at the door.
- **11:40, commotion at the gate.** Two arrivals at once: Lindiwe (26), 18 days after giving birth, carried in by family tied with washing line (postpartum psychosis), and Lerato (24), stabbed in the thigh and bleeding heavily. The trainee chooses who comes first; that choice is scored in both cases.
- **12:25, screaming in a taxi.** Palesa (19) had a backstreet abortion three days ago and arrives bleeding, septic and terrified of the police. Receive her without judgement (including a judgemental colleague), recognise septic shock, start antibiotics and fluids at the clinic, use ultrasound to find out whether the pregnancy is still there, catch the missing anti-D, spot a perforated uterus on the ward, and give confidential post-abortion care with information on legal termination.
- **Breaking bad news.** The cervical cancer case now has a full SPIKES conversation in which the doctor tells Nomvula her diagnosis.

New engine pieces: `src/drill.js` (timed emergency actions with a clock and a meter), generic conversation scenes for any step, and a reviewer shortcut in the lobby that unlocks every emergency at once.

## Tuto, the built-in tutor (v0.5)

Learners choose a mode in the lobby:

| Mode | Tuto | Scoring |
|---|---|---|
| **Learn with Tuto** | Briefing at every step; hints on request (nudge → bigger hint → the answer); a review after each step showing what went well and what to fix | Marked "Learning run", never a competence result |
| **Practice** | Briefings and hints | Each hint costs 5 points in that step's domain |
| **Assessment** | Off | The run that counts: 70 or more and no critical errors |

Tuto is rule-based (`src/tuto.js`). It teaches only from the approved case file: the same reasons, explanations and rubric the scoring engine uses, so it cannot invent clinical advice. A case can override any briefing with a `tuto` object keyed by step. The learner record stores `mode` and `hintsUsed`.

## Status

Prototype, version 0.4: **a clinic day**. The simulation opens in the waiting area of a
busy public clinic on a Monday morning. Five women have queued since dawn. The trainee
does the queue walk, decides who cannot wait, and then follows each woman through her
whole visit: the file room, the nurse's vitals station, the clinic doctor, the referral
decision and, where needed, the hospital.

| Patient | Case | Family | Status |
| --- | --- | --- | --- |
| Nomvula, 41 (ticket 004) | `cervical-cancer-hiv` | Cervical cancer in a woman living with HIV | Draft, pending clinical validation |
| Thandeka, 24 (ticket 012) | `severe-preeclampsia-34w` | Severe pre-eclampsia at 34 weeks | Draft, pending clinical validation |
| Ayanda, 27 (ticket 019) | `endometriosis-27` | Endometriosis with an endometrioma | Draft, pending clinical validation |
| Zanele, 29 (ticket 027) | `ipv-pregnancy` | Intimate partner violence in early pregnancy | Draft, pending clinical validation |
| Naledi, 22 (ticket 041) | `depression-medical-student` | Severe depression, psychiatric admission, family meeting | Draft, pending clinical validation |

What happens in the queue matters later: a pregnant woman with danger signs who is not
fast-tracked reaches the nurse five hours later and worse. The file room tests respect,
confidentiality and patient experience, and each folder hides a clue (missed visits,
repeated "accidents", an unfiled Pap smear).

The sensitive cases (suicide risk, intimate partner violence) teach assessment and
safety planning without describing methods or graphic detail.

A newborn resuscitation case (`cases/birth-asphyxia.js`, timed Golden Minute
resuscitation) is also in the repository but not loaded by default.

## Run it

No installation and no internet connection needed.

- Open `dist/labzero-mama.html` in any modern browser, or
- open `src/index.html` from a local copy of this repository.

To rebuild the single-file version after editing: `python3 build.py`.

## How it works

| Part | File | What it does |
| --- | --- | --- |
| Clinic day | `cases/clinic-day.js` | The lobby, queue walk and patient tickets |
| Case content | `cases/*.js` | File room, vitals, patient script, findings, results, chart errors, rubric |
| Dialogue | `src/intent.js` | Matches a typed question to an approved patient reply |
| Rules and records | `src/engine.js` | Scores 11 to 12 competency domains; builds the learner record |
| Resuscitation | `src/resus.js` | Timed newborn resuscitation with a simple, deterministic physiology model |
| Interface | `src/app.js`, `src/styles.css` | The case steps, debrief and dashboard |
| Data format | `data/learner-record.schema.json` | Schema for one completed case |

### The dialogue layer and AI

The patient answers only with lines from her approved script. Typed questions are
matched to a script topic by an offline keyword matcher (with some isiZulu terms).
An optional language model can do the matching instead: enter an
OpenAI-compatible endpoint in **About**. The model returns only a topic id; it never
writes what the patient says. See `SAFETY.md`.

## Learner data

Each completed case creates one JSON record (see the schema). Records stay in the
learner's browser. The **Dashboard** view shows averages by competency and the most
common critical errors, mixed with clearly labelled example sessions.

## Licences

- Code: MIT (`LICENSE`)
- Case content in `cases/`: CC BY 4.0 (`CONTENT_LICENSE.md`)

## Disclaimer

Fictional training material only. Not for clinical use. Clinical content must be
validated against the guidelines your institution teaches.

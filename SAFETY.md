# Safety by design

LabZero Mama trains health workers. It is not a clinical decision tool and must
never be used to manage a real patient.

1. **Fictional patients only.** No real patient data is used or collected.
2. **Approved words only.** The simulated patient can only say lines written in
   the approved case file. The dialogue layer (offline keyword matching, or an
   optional language model) only chooses which approved line answers a question.
   The language model receives the trainee's question and the list of question
   topics; it never sees learner records and never writes clinical content.
3. **Rules, not AI, judge safety.** Every score and critical error comes from
   deterministic rules in `src/engine.js` and the approved case file.
4. **Critical errors stand apart.** A critical omission is reported separately
   and cannot be averaged away by a high overall score.
5. **Learner data stays local.** Records are stored in the learner's own browser.
   Any public dashboard will publish anonymised totals only, in line with POPIA.
6. **Clinical validation before use.** Each case carries a version and a status.
   Cases marked "Draft" must be reviewed by a qualified clinician against the
   guidelines the training institution teaches before learners use them.

Report a safety concern by opening an issue marked `safety`.

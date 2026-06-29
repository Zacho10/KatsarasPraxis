# Katsaras Praxis Roadmap

## Patient history export

- Add a download action inside each patient profile.
- Export only the selected patient's card, history, visits, exams, files list, reviews, and care tasks.
- Support a clean PDF format suitable for printing or sending securely.
- Include patient photo and basic demographics at the top.
- Add export date and doctor/practice name: Antonios Katsaras Praxis.

## Patient health report

- Add a report generator inside the patient profile.
- Summarize the patient's health history from visits, exams, notes, reviews, and task outcomes.
- Highlight the latest visit outcome, pending follow-ups, open reviews, and recent exam results.
- Keep the wording professional and editable before download.
- Support exporting the generated report as PDF.

## Scanned documents and GDPR archive

- Add a dedicated scanned documents section inside each patient profile.
- Support files such as GDPR consent, medical findings, referrals, exam scans, insurance documents, and signed forms.
- Show a clear list of uploaded documents with type, date, notes, and file preview/download.
- Allow tagging documents by category, for example `GDPR`, `Findings`, `Exam`, `Referral`, `Prescription`, `Other`.
- Make it obvious when required consent documents are missing or outdated.

## Editable patient card

- Allow editing every field in a patient profile after creation.
- Support updates for demographics, contact details, insurance details, allergies, diagnoses, notes, status, and assigned care tasks.
- Keep edit actions clear on mobile, with save/cancel behavior that never traps the user in a required field modal.
- Track when the patient card was last updated.

## Prescriptions module

- Add a prescriptions section inside each patient profile.
- Store what was prescribed, dosage, instructions, quantity, date, duration, and doctor notes.
- Show past prescriptions as a timeline so the doctor can quickly see when and what was prescribed.
- Add a `Wiederholen` action for repeat prescriptions, for example renewing medication for the next three months.
- Keep repeated prescriptions editable before saving, so dates, dosage, and notes can be adjusted.
- Treat integration with Greek e-syntagografisi as a future phase, not part of the first implementation.

## Future e-syntagografisi integration research

- Research whether the official electronic prescription platform provides an API, approved integration path, or only browser/manual workflows.
- Confirm legal, authentication, and GDPR requirements before attempting any direct integration.
- Avoid storing platform credentials in the frontend.
- If no official API is available, consider a safe workflow helper that prepares prescription data for manual entry instead of automating the external platform.

## Data and safety notes

- Reports should clearly show that the doctor reviews and approves the text before use.
- Patient exports should be private and protected behind login.
- When Supabase data sync is added, exports should pull from the live patient record, not browser-only local data.
- Medical documents and prescriptions should be stored securely with user authentication and access rules.

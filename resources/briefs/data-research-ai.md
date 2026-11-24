# Data, Research & AI Micro-Utilities

## 56. One-Off CSV Cleaner & Column Mapper

Uploads messy spreadsheets, normalizes dates/phones, and exports clean CSVs.

- Buyer: Operations analyst
- Release wave: 1 (Pilot)
- Proposed access: Personal workspace
- Runtime AI in the brief: No model required

**Build prompt**

Build “One-Off CSV Cleaner & Column Mapper” on NeoApps for an operations analyst. Map input columns, preview date and phone normalization, and export accepted rows alongside a reject report. Keep records private to their owner and make any sharing opt-in. Include a demo with fictional records.

**Acceptance test**

Import two valid dates and one impossible date. Two rows export and the rejected row retains its original value.

## 57. Customer Interview Transcript Tagger

AI-assisted tool that highlights pain points across 15 user interview notes.

- Buyer: Product researcher
- Release wave: 1 (Pilot)
- Proposed access: Team workspace
- Runtime AI in the brief: Model required

**Build prompt**

Build “Customer Interview Transcript Tagger” on NeoApps for a product researcher. Use a configured model to propose pain-point tags with supporting transcript excerpts. Let a researcher accept, rename or reject each tag. Limit records and exported data to the owning team. Include a demo with fictional records. Use a configured model and show when the usage limit is reached.

**Acceptance test**

On a fictional interview, accept one suggestion and reject another. Only the accepted tag appears in the findings export with its source quote.

## 58. Competitor Pricing Change Monitor

Structured table comparing tier features and pricing updates.

- Buyer: Product marketing lead
- Release wave: 3 (Specialist)
- Proposed access: Team workspace
- Runtime AI in the brief: No model required

**Build prompt**

Build “Competitor Pricing Change Monitor” on NeoApps for a product marketing lead. Record dated competitor plan snapshots and show field-level differences. Allow manual entry for the first release. Limit records and exported data to the owning team. Include a demo with fictional records.

**Acceptance test**

Enter $20 and $25 in successive snapshots for one plan. Show a $5 increase with both dates.

## 59. Academic Paper Literature Matrix

Organizes papers by methodology, sample size, and key findings.

- Buyer: Research lead
- Release wave: 2 (Expand)
- Proposed access: Team workspace
- Runtime AI in the brief: No model required

**Build prompt**

Build “Academic Paper Literature Matrix” on NeoApps for a research lead. Index papers by citation, method, sample and finding and filter the comparison matrix. Limit records and exported data to the owning team. Include a demo with fictional records.

**Acceptance test**

Filter a review containing two surveys and one trial to trials. One paper remains with its citation.

## 60. Job Application & Referral Pipeline Tracker

Custom CRM for tracking applications, recruiter calls, and follow-ups.

- Buyer: Job seeker
- Release wave: 2 (Expand)
- Proposed access: Personal workspace
- Runtime AI in the brief: No model required

**Build prompt**

Build “Job Application & Referral Pipeline Tracker” on NeoApps for a job seeker. Track applications, referrals, interview dates and next actions in a personal pipeline. Keep records private to their owner and make any sharing opt-in. Include a demo with fictional records.

**Acceptance test**

Move one application to interview. Its referrer and next follow-up date persist after reload.

## 61. User Testing Script & Observation Logger

Live note-taking grid during usability sessions.

- Buyer: UX researcher
- Release wave: 2 (Expand)
- Proposed access: Team workspace
- Runtime AI in the brief: No model required

**Build prompt**

Build “User Testing Script & Observation Logger” on NeoApps for an ux researcher. Group timestamped observations by participant alias, session and test-script step. Limit records and exported data to the owning team. Include a demo with fictional records.

**Acceptance test**

Attach a note to task 2. Filtering by that task retains the participant alias and timestamp.

## 62. A/B Test Sample Size & Significance Calculator

Tailored calculator built around your exact conversion funnel.

- Buyer: Experiment analyst
- Release wave: 3 (Specialist)
- Proposed access: Personal workspace
- Runtime AI in the brief: No model required

**Build prompt**

Build “A/B Test Sample Size & Significance Calculator” on NeoApps for an experiment analyst. Expose baseline rate, target effect, power, significance level and method. Provide sample planning and observed-result views with assumptions. Keep records private to their owner and make any sharing opt-in. Include a demo with fictional records.

**Acceptance test**

With 50 conversions in each of two groups of 1,000, the two-sided comparison shows zero lift and p = 1. Compare planning output with a documented fixture.

## 63. Survey Data Cross-Tab Explorer

Interactive filter tool for exploring poll results with teammates.

- Buyer: Survey analyst
- Release wave: 2 (Expand)
- Proposed access: Team workspace
- Runtime AI in the brief: No model required

**Build prompt**

Build “Survey Data Cross-Tab Explorer” on NeoApps for a survey analyst. Cross-tab two selected survey fields and show cell counts, row percentages and denominators. Limit records and exported data to the owning team. Include a demo with fictional records.

**Acceptance test**

Three of four respondents in one segment answer Yes. That row displays 3 and 75%.

## 64. AI Prompt Library & Output Evaluator

Shared sandbox where a team tests and rates prompt variations side-by-side.

- Buyer: AI product team lead
- Release wave: 3 (Specialist)
- Proposed access: Team workspace
- Runtime AI in the brief: Model required

**Build prompt**

Build “AI Prompt Library & Output Evaluator” on NeoApps for an ai product team lead. Save prompt and model versions, run the same examples side by side and collect blinded ratings. Limit records and exported data to the owning team. Include a demo with fictional records. Use a configured model and show when the usage limit is reached.

**Acceptance test**

Run two variants on one input. Each output keeps its prompt version, model identifier and reviewer score.

## 65. Changelog & Release Note Generator

Turns raw Git commit lists into customer-friendly release summaries.

- Buyer: Release manager
- Release wave: 3 (Specialist)
- Proposed access: Team workspace
- Runtime AI in the brief: Model required

**Build prompt**

Build “Changelog & Release Note Generator” on NeoApps for a release manager. Draft release notes from pasted commits, preserve commit references and allow editing before export. Limit records and exported data to the owning team. Include a demo with fictional records. Use a configured model and show when the usage limit is reached.

**Acceptance test**

Select two commits for a release. Both references are traceable and the export uses the approved wording.

## 66. Cold Email Personalization Sandbox

Uploads a 50-lead CSV and drafts tailored opening lines for review.

- Buyer: Sales development lead
- Release wave: 3 (Specialist)
- Proposed access: Team workspace
- Runtime AI in the brief: Model required

**Build prompt**

Build “Cold Email Personalization Sandbox” on NeoApps for a sales development lead. Import a prospect CSV and draft personalized opening lines from supplied facts with human review. Limit records and exported data to the owning team. Include a demo with fictional records. Use a configured model and show when the usage limit is reached.

**Acceptance test**

Import three fictional leads. Each draft cites its input detail and stays in review until a rep accepts it.

## 67. Meeting Transcript Action-Item Extractor

Pastes raw call notes and assigns tasks with due dates.

- Buyer: Project manager
- Release wave: 3 (Specialist)
- Proposed access: Team workspace
- Runtime AI in the brief: Model required

**Build prompt**

Build “Meeting Transcript Action-Item Extractor” on NeoApps for a project manager. Extract proposed actions from meeting notes, show the supporting sentence and ask a reviewer to confirm owners and dates. Limit records and exported data to the owning team. Include a demo with fictional records. Use a configured model and show when the usage limit is reached.

**Acceptance test**

For “Jo will send the brief Friday,” suggest Jo and the action. A task enters the board only after confirmation.

## 68. Localization & Translation Review Table

Side-by-side string editor for native speakers reviewing app copy.

- Buyer: Localization lead
- Release wave: 2 (Expand)
- Proposed access: Team workspace
- Runtime AI in the brief: No model required

**Build prompt**

Build “Localization & Translation Review Table” on NeoApps for a localization lead. Display source strings and translations side by side with language, reviewer and status. Limit records and exported data to the owning team. Include a demo with fictional records.

**Acceptance test**

Approve a French string, then revise its source. The French translation is flagged for another review.

## 69. SQL Query Snippet & Schema Explorer

Searchable cheat sheet of common analytics queries for non-engineers.

- Buyer: Analytics lead
- Release wave: 3 (Specialist)
- Proposed access: Team workspace
- Runtime AI in the brief: No model required

**Build prompt**

Build “SQL Query Snippet & Schema Explorer” on NeoApps for an analytics lead. Catalog saved SQL snippets and schema descriptions and search by business question or table name. Limit records and exported data to the owning team. Include a demo with fictional records.

**Acceptance test**

Search “monthly sales.” The matching saved snippet and described tables are displayed for copying.

## 70. Grant Application Eligibility & Deadline Matcher

Filters startup or research grants by region and sector.

- Buyer: Grants coordinator
- Release wave: 3 (Specialist)
- Proposed access: Team workspace
- Runtime AI in the brief: No model required

**Build prompt**

Build “Grant Application Eligibility & Deadline Matcher” on NeoApps for a grants coordinator. Maintain dated grant records with source links, region, sector and deadline filters. Limit records and exported data to the owning team. Include a demo with fictional records.

**Acceptance test**

Choose NB and a future cutoff date. Expired and out-of-region records leave the filtered list.

## 71. Podcast Guest Research Dossier Builder

Organizes bio notes, past interviews, and suggested questions.

- Buyer: Podcast researcher
- Release wave: 2 (Expand)
- Proposed access: Team workspace
- Runtime AI in the brief: No model required

**Build prompt**

Build “Podcast Guest Research Dossier Builder” on NeoApps for a podcast researcher. Build guest dossiers from supplied bios, previous interview links and a question shortlist. Limit records and exported data to the owning team. Include a demo with fictional records.

**Acceptance test**

Save two source links and three questions. The host’s brief displays all five items against the correct guest.

## 72. Product Naming & Domain Brainstorm Voter

Lists name candidates with availability notes and team votes.

- Buyer: Founder or brand lead
- Release wave: 2 (Expand)
- Proposed access: Team workspace
- Runtime AI in the brief: No model required

**Build prompt**

Build “Product Naming & Domain Brainstorm Voter” on NeoApps for a founder or brand lead. Collect candidate names, dated domain availability notes and one vote per teammate per name. Limit records and exported data to the owning team. Include a demo with fictional records.

**Acceptance test**

One person votes twice for the same name. Its tally increases by one and the date of the availability note remains visible.

## 73. Support Ticket Root-Cause Categorizer

AI classifier for tagging a batch of 200 exported support tickets.

- Buyer: Support operations lead
- Release wave: 3 (Specialist)
- Proposed access: Team workspace
- Runtime AI in the brief: Model required

**Build prompt**

Build “Support Ticket Root-Cause Categorizer” on NeoApps for a support operations lead. Classify an exported ticket batch using a controlled taxonomy, surface evidence and allow human overrides. Limit records and exported data to the owning team. Include a demo with fictional records. Use a configured model and show when the usage limit is reached.

**Acceptance test**

Change one ticket from Billing to Login. Category totals shift by one in each direction and the reviewed CSV reflects the edit.

## 74. API Webhook Payload Inspector

Temporary endpoint for testing and viewing incoming JSON payloads.

- Buyer: Integration developer
- Release wave: 3 (Specialist)
- Proposed access: Team workspace
- Runtime AI in the brief: No model required

**Build prompt**

Build “API Webhook Payload Inspector” on NeoApps for an integration developer. Capture sample JSON sent by a configured test integration at an expiring endpoint. Redact sensitive headers and show recent payloads to its owner. Limit records and exported data to the owning team. Include a demo with fictional records.

**Acceptance test**

Send one sample event, confirm that the authorization header is hidden, then expire the endpoint and verify collection stops.

## 75. JSON-to-Invoice PDF Renderer

Turns structured order data into branded downloadable receipts.

- Buyer: Billing operations lead
- Release wave: 2 (Expand)
- Proposed access: Personal workspace
- Runtime AI in the brief: No model required

**Build prompt**

Build “JSON-to-Invoice PDF Renderer” on NeoApps for a billing operations lead. Validate order JSON, calculate line totals and render a branded invoice PDF for download. Keep records private to their owner and make any sharing opt-in. Include a demo with fictional records.

**Acceptance test**

Render two $30 units and a $10 fee. The PDF lists both lines and a $70 subtotal.

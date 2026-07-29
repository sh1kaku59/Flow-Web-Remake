# FLOW — CONCEPT OF OPERATIONS IMPLEMENTATION PROMPT

## 0. Prompt purpose

Use this file as the authoritative operational-context prompt for the Flow project.
It is derived from `Flow_ConceptofOperations_v1.0.pdf` and preserves the intent,
scope, actors, workflows, policies, operational scenarios, impacts, benefits, and
risks defined in that document.

This prompt governs **what Flow is expected to achieve operationally**. It does
not independently define the final software architecture, database schema,
low-level UI design, algorithm implementation, or test specification. When a
task requires those details, consult the corresponding Flow SRS, SAD,
Architectural Drivers, Design System, Detailed Design, Database Design, Software
Design Specification, and User Stories. Never silently resolve a conflict between
documents; identify the conflict and request or record a decision.

## 1. Mandatory working contract

When analyzing, designing, coding, testing, or reviewing Flow:

1. Treat the operational model in this file as a mandatory baseline.
2. Preserve traceability from every derived result to its original meeting audio.
3. Preserve anonymous-workspace isolation and confidentiality of
   meeting-derived data. No account is required, but no workspace is public.
4. Preserve Flow as a **post-meeting, batch-processing system**. Do not turn it
   into a live meeting or video-conferencing platform.
5. Preserve the human-in-the-loop model. AI assists the Meeting Assistant; it
   does not replace human judgment.
6. Do not invent requirements, metrics, actors, workflows, integrations, or
   permissions not supported by the project documents.
7. Distinguish operational intent from implementation choice. Terms such as
   queue, Supabase, ReactJS, FastAPI, Docker, Whisper, Pyannote, and pgvector are
   recorded here because they appear in the ConOps, but detailed implementation
   must still be checked against the architecture and design documents.
8. For every proposal, state which operational objective, scenario, policy,
   risk, or benefit it supports.
9. When proposing acceptance criteria or tests, cover the normal flow, invalid
   input, processing failure, missing/invalid workspace capability, rate-limit
   behavior, privacy boundary, recovery, retention expiry, and AI-verification
   behavior.
10. Do not describe synchronized audio/text playback or real-time status updates
    as live meeting processing. Live audio ingestion and real-time conferencing
    are outside the system scope.

### 1.1 Approved product change — anonymous public-entry operation

The Product Owner has superseded the account-based entry model in the source
ConOps. The active product model is:

- no registration, login, logout, password, OTP, OAuth, profile, avatar, or
  account-management experience;
- a public landing page followed by **Start**, which creates or resumes an
  isolated anonymous workspace;
- an opaque, high-entropy workspace capability held in an `HttpOnly`, `Secure`,
  `SameSite` cookie; it is not a user identity and must not be exposed to
  JavaScript or placed in URLs;
- all meetings, audio, jobs, voice samples, transcripts, indexes, summaries,
  analytics, and activity events are scoped to that workspace;
- Diary is temporary workspace history, not a permanent cross-device account
  archive;
- clearing the workspace cookie, changing browser/device, or retention expiry
  can make prior workspace data unavailable;
- Settings contains only application preferences such as Vietnamese/English and
  light/dark theme and may be stored locally in the browser;
- voice-sample enrollment remains necessary for known-speaker recognition and is
  placed directly in the Upload flow, with reusable samples scoped to the
  anonymous workspace;
- public entry never means public data or unrestricted APIs. Server-side scope
  validation, abuse protection, protected storage, and expiry cleanup remain
  mandatory.

This approved change has priority over legacy account/authentication language in
the original ConOps. Architecture and design prompts must realize it without
weakening data isolation.

---

## 2. Concept and operational vision

### 2.1 Purpose

Flow is an AI-assisted digital knowledge-management and structured-transcription
system that transforms unstructured meeting audio into organized, searchable,
analyzable, and reusable information.

The system must establish a shared operational vision covering:

- how users interact with Flow;
- the operating characteristics of the system;
- the responsibilities of users and stakeholders;
- the conversion of raw audio into structured knowledge;
- operational assumptions, constraints, policies, and principles;
- expected benefits, impacts, risks, and mitigations; and
- alignment between business expectations and system capabilities.

### 2.2 Scope of the ConOps

The ConOps covers the following operational phases:

- audio ingestion;
- voice separation and speaker recognition;
- speech-to-text transcription;
- timestamp and semantic-time alignment;
- content, topic, summary, and speaker-behavior analysis;
- structured and semantic search;
- contextual audio playback;
- activity history and traceability; and
- secure review of meeting-derived information.

The ConOps does not define:

- final software architecture;
- database schema design;
- model-training methodology;
- low-level interface design; or
- testing specifications.

### 2.3 Operational definition

Flow integrates speaker diarization, speaker recognition, speech-to-text,
content analysis, summarization, structured search, semantic search, and
contextual playback into one post-meeting workflow.

Flow does not treat transcription as a standalone static document. A transcript
is represented as structured operational objects containing content, speaker
identity, timestamps, semantic context, and searchable metadata. These objects
must remain traceable to the original audio source.

Flow complements recording and conferencing tools such as Zoom, Microsoft
Teams, and Google Meet. It does not replace them. Operationally, Flow is a
post-processing and knowledge-retrieval layer for staff acting as Meeting
Assistants or Meeting Managers.

### 2.4 System objectives

Flow must:

- automate manual transcription and reduce repeated listening;
- answer “who said what, and when” through speaker-aware transcription;
- retrieve meeting information by speaker, keyword/content, topic, meaning, and
  time;
- support analysis of participation and discussion behavior;
- convert recordings into structured, reusable knowledge assets;
- keep derived information linked to its original source;
- operate transparently rather than as an unverifiable black box; and
- protect the security and privacy of confidential meeting data.

### 2.5 Primary operational context

Flow operates after meetings, discussions, interviews, lectures, or similar
recorded sessions have ended. Audio recordings are the primary source input.

The current process requires the assistant to listen, pause, type, rewind,
identify speakers from memory, summarize, and format the result. This commonly
takes three to four hours for every one hour of audio.

The target process is:

`Upload → AI Processing → Review/Verification → Search/Analysis → Report`

The user uploads the recording, Flow processes it asynchronously, and the user
reviews structured results, verifies important passages against the original
audio, retrieves information, and uses the verified output as reference material
for creating formal minutes or reports in external office tools.

---

## 3. Actors, stakeholders, and responsibilities

### 3.1 Process actors

| Actor                                                            | Operational responsibility                                                                                                                                                                                                                                   |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Product Owner/Mentor                                             | Direct product vision, define and approve high-level business needs, and evaluate operational and academic feasibility.                                                                                                                                      |
| Development Team                                                 | Design, implement, test, deploy, maintain, and support the system according to the agreed operating concept. Maintain AI accuracy and stable operation.                                                                                                      |
| Academic Supervisors                                             | Evaluate novelty, technical complexity, scientific rigor, practicality, and improvement over the current manual process.                                                                                                                                     |
| Target/End User — Anonymous Meeting Assistant or Meeting Manager | Enter from Landing, start/resume an isolated workspace, provide voice samples in Upload, upload meeting audio, monitor processing, review results, verify source audio, search, analyze, manage temporary Diary history, and configure local language/theme. |

### 3.2 Primary user role

The primary operational user is the Meeting Assistant or Meeting Manager. The
user must be able to:

- upload meeting recordings and metadata;
- add and manage a reusable workspace-scoped collection of speaker voice samples
  directly in the Upload experience;
- review and verify AI-generated outputs;
- identify or confirm speaker-related information;
- search and explore meeting-derived knowledge;
- play original audio in context;
- examine summaries and participation analytics; and
- review processing and activity history.

Flow changes the user’s role from a passive scribe into an active knowledge
manager. The user remains responsible for deciding whether AI-generated content
is reliable enough to use in formal records.

---

## 4. Current situation and operational problem

### 4.1 Current manual process

1. Receive the recording from a device or cloud source.
2. Open it in a conventional audio player.
3. Listen to a short passage, commonly three to five seconds.
4. Pause playback and type the perceived content.
5. Rewind and replay the passage to verify it.
6. Identify speakers from memory or familiarity with their voices.
7. Repeat until the entire meeting has been transcribed.
8. Read the completed notes, identify topics, summarize the discussion, and
   format a report.

### 4.2 Limitations

- **Linear retrieval:** Users must scrub, rewind, or listen from the beginning to
  find information.
- **Distributed data:** Audio and notes are stored separately with no synchronized
  link.
- **Speaker dependence:** Identification depends on personal familiarity and is
  unreliable for new, large, or complex meetings.
- **Dead-data archives:** Recordings are stored but rarely reused because their
  content is not searchable.
- **Manual inefficiency:** Transcription commonly consumes three to four times
  the source-audio duration.
- **Data-integrity risk:** Fatigue and inattention can omit or distort critical
  information.
- **No semantic retrieval:** Conventional search cannot answer meaning-based
  questions about raw audio.
- **Limited scalability:** Growing meeting volume produces an unavoidable human
  processing backlog.

---

## 5. Operational needs and justification

### 5.1 Operational needs

Flow must provide:

1. **Automated conversion:** Speech-to-text, speaker diarization, and speaker
   recognition that reduce dependency on manual transcription.
2. **Non-linear retrieval:** Indexed and semantically tagged content that allows
   users to navigate directly to relevant moments.
3. **Standardized output:** Structured `speaker + timeline + content` objects
   suitable for storage, reporting, reuse, analysis, and knowledge extraction.
4. **Internal data security:** Strict control over processing, storage, access,
   streaming, and retrieval of confidential recordings and text.
5. **Operational flexibility:** Search, filtering, playback, history management,
   and analysis workflows that allow users to exploit meeting data efficiently.

### 5.2 Justification

The system is justified because:

- meeting recordings contain valuable but underused knowledge;
- manual transcription and note-taking do not scale cost-effectively;
- conventional transcription tools produce static text rather than interactive,
  traceable knowledge objects;
- organizations need searchable and analyzable records of discussions and
  decisions; and
- advances in speech processing, digital signal processing, NLP, and large
  language models make the proposed workflow technically feasible.

Flow must support human judgment, not replace it.

### 5.3 Expected operational improvements

- Approximately sevenfold reduction in the time required to draft meeting
  minutes compared with the manual process.
- Approximately 70–80% reduction in post-meeting correction/production effort.
- Keyword and semantic retrieval targeted at less than one second in the ConOps
  operating vision.
- Replacement of `Listen → Stop → Type` with `Upload → Review → Report`.
- Centralized, structured, date-aware archival and reuse of meeting knowledge.

These are ConOps targets. Before turning them into binding test thresholds,
reconcile them with the measurable NFRs in the SRS.

### 5.4 Priority of proposed changes

| No. | Proposed change                       | Priority |
| --: | ------------------------------------- | -------- |
|   1 | Automated Audio Processing Pipeline   | High     |
|   2 | Structured and Searchable Output      | High     |
|   3 | Context-Aware Navigation              | High     |
|   4 | Speaker Identity Management           | Low      |
|   5 | Semantic Analysis Display             | Medium   |
|   6 | Multi-Dimensional and Semantic Search | High     |
|   7 | Secure On-Screen Visualization        | Low      |

---

## 6. Proposed operational system

### 6.1 Canonical end-to-end flow

1. A visitor opens Landing and selects **Start**.
2. Flow creates or resumes an isolated anonymous workspace through a protected
   browser cookie.
3. The Upload tab lets the visitor add/reuse required known-speaker voice
   samples and select an MP3, WAV, or M4A meeting recording with basic metadata.
4. The interface validates sample readiness, file format, size/duration policy,
   and quality.
5. Invalid input is rejected with guidance to correct the sample or upload.
6. Valid input is scoped to the workspace, stored securely, and a background
   processing job is triggered.
7. The processing pipeline performs, in operational order:
   - speaker diarization and recognition;
   - speech-to-text conversion;
   - timestamp alignment;
   - semantic and topic analysis;
   - semantic-time segmentation;
   - speaker-behavior analysis;
   - meeting summarization; and
   - preparation/indexing for semantic retrieval.
8. Flow stores structured results, including transcript segments, timestamps,
   speaker identity/labels, and derived analytical information.
9. Flow exposes honest status and notifies the visitor in the active workspace
   when results are ready.
10. The visitor opens the temporary Diary or meeting-detail view, searches and reviews the
    result, uses contextual playback to verify important information, examines
    charts, and drafts formal minutes externally.

Semantic search queries are user-initiated during retrieval. The processing
pipeline may create the embeddings/indexes required to support those queries;
do not model “semantic search” itself as a one-time batch output.

### 6.2 In scope

- Uploading supported meeting-audio files.
- File validation and processing-status tracking.
- Speaker diarization and recognition using enrolled voice samples.
- Speech-to-text transcription.
- Timestamping and semantic-time marking.
- Topic, content, summary, and speaker-behavior analysis.
- Multi-dimensional search by content, speaker, topic, and time.
- Semantic search using natural-language meaning.
- Context-aware playback linked to transcript/search segments.
- Structured storage of meeting metadata and derived results.
- Processing logs, activity history, traceability, and secure review.

### 6.3 Out of scope

- Building an online meeting or video-conferencing platform.
- Processing a live meeting audio stream.
- Replacing Zoom, Google Meet, Microsoft Teams, or equivalent platforms.
- Deep source-code/API integration into third-party meeting platforms.
- Treating synchronized playback of stored audio as live meeting processing.

### 6.4 Operational objectives

- Transform raw audio into structured, searchable information.
- Minimize manual reviewing and transcription effort.
- Provide speaker-aware interaction.
- Trace every displayed/derived output to original audio.
- Make AI processing transparent to the user.
- Maintain steady and consistent interaction patterns across system modules.
- Prioritize clarity and verifiability over opaque automation.

---

## 7. Assumptions, constraints, policies, and principles

### 7.1 Assumptions

- Uploaded recordings have sufficient quality for speech processing and do not
  contain excessive background noise.
- Voice samples are available before known-speaker recognition is expected.
- Voice enrollment may be optional for basic use, but a speaker cannot be
  reliably mapped to a known identity without a usable reference sample.
- Users have stable internet connectivity for large uploads and streamed audio
  playback.
- Required AI-processing and storage services are available.

### 7.2 Constraints

- **Security:** Meeting content is handled in a controlled, view-only operating
  environment. Download, print, copy/paste, and right-click behaviors are to be
  restricted where required by policy. Server-side workspace-scope validation remains
  mandatory; client-side restrictions alone are not a security boundary.
- **Latency:** AI processing is not instantaneous. Completion depends on audio
  duration, queue load, and available CPU/GPU resources.
- **Language:** The current version is primarily optimized for Vietnamese,
  including common Vietnamese dialects.
- **Batch operation:** The system accepts completed recordings; it does not
  ingest live meeting streams.

### 7.3 Policies

- **No-Trace on Client:** Meeting audio and text are streamed for temporary
  session display and must not be exposed as retrievable files on the client
  workstation.
- **Workspace Isolation and Traceability:** Upload, access, playback, search, and
  review activity must be associated with the responsible anonymous workspace
  and be available for temporary history/audit review.
- **Data Lifecycle and Retention:** Original audio and derived text are stored in
  encrypted/controlled storage and retained or removed according to configurable
  organizational policy.
- **No-Download/View-Only:** Original audio and text resources must not be
  exposed through unrestricted download APIs.

### 7.4 Principles

- **Human in the loop:** AI proposes and structures information; the user
  verifies important content before formal use.
- **Ease of verification:** Every relevant text/search/analysis result must link
  to the correct original audio context through click-to-play behavior.
- **Privacy by design:** Workspace isolation, capability validation,
  confidentiality, storage
  protection, and auditability must be designed in from the beginning.
- **Operational transparency:** Processing status and AI uncertainty must be
  communicated honestly; incomplete or failed work must never appear complete.

---

## 8. High-level operational environment

### 8.1 Client side

- Browser-based access from a personal computer or office laptop.
- Support for modern browsers such as Chrome, Edge, and Safari.
- No complex local installation.
- No account gate; protected operations require a valid anonymous-workspace
  capability established by **Start**.
- Temporary, controlled display/streaming of meeting content.

### 8.2 Server side

- Central coordination of audio processing, STT, NLP, summarization, storage,
  indexing, and retrieval.
- Asynchronous background execution for long-running AI work.
- Encrypted/controlled storage of workspace, meeting, transcript, and analysis
  data.
- HTTPS communication between client and server.

### 8.3 Technology stack recorded by the ConOps

| Component                     | Technology                                     | Operational purpose                                                                                                                          |
| ----------------------------- | ---------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Frontend                      | ReactJS (React 18 + TypeScript + Vite)         | Interactive glassmorphic browser UI, bilingual i18n, light/dark mode visualization, and controlled on-screen access.                         |
| Backend API                   | Python, FastAPI                                | High-performance APIs, SQLAlchemy ORM, ReportLab PDF export, and coordination of processing flows.                                          |
| AI Core — STT and diarization | PyTorch, OpenAI Whisper, Pyannote.audio        | Speech separation, speaker diarization, voice sample matching, and speech-to-text.                                                          |
| AI Core — LLM & Embeddings    | Google Gemini 3.5 Flash & Gemini Embedding 001 | 5-section summarization, multi-model fallback chain, speaker behavior analysis, topic extraction, and 3072-dimensional vector embedding.     |
| Database and Services         | Supabase PostgreSQL                            | Relational storage, pgvector (3072 dims), workspace-scoped data, and secure file storage.                                                   |
| Infrastructure                | Docker / Cloud Platform                        | Consistent containerized development/deployment and expansion of processing components.                                                      |

Do not assume every technology-to-function mapping in this ConOps table is the
final implementable design. Validate it against the architectural and detailed
design documents before coding.

---

## 9. Required operational scenarios

### Scenario 1 — Start anonymous workspace and prepare voice samples

**Context:** A visitor begins using Flow without creating an account.

**Flow:**

1. Open Landing and select **Start**.
2. Create or resume a protected anonymous workspace and enter the Upload tab.
3. Add a prerecorded voice sample and speaker label when known-speaker
   recognition is desired/required by the active upload policy.
4. Validate and process the sample, then store its reference/embedding inside
   the current workspace only.
5. Show readiness, failure, retry, rename, play, and delete controls in Upload.

**Related components:** Anonymous Workspace Service, Voice Sample Management,
Audio Processing, protected object/vector storage.

**Result:** An isolated workspace exists, and an enrolled voice sample can
support speaker recognition for uploads in that workspace.

**Output:** Workspace reference, Voice Sample reference, and Voiceprint Vector ID.

**Operational purpose:** Establish an isolation boundary, improve recognition
accuracy, and associate future transcript segments with labeled speakers
without collecting account credentials.

### Scenario 2 — Anonymous meeting-audio upload

**Context:** A visitor with a valid anonymous workspace wants to process a
recorded meeting.

**Flow:**

1. Validate or create the anonymous workspace capability.
2. Confirm voice-sample readiness in the Upload tab.
3. Select a meeting recording and provide metadata such as name and date.
4. Validate format/quality and abuse/quota policy, scope and securely store the
   file, and create a queued job.
5. Set and expose an honest processing state.
6. Allow the visitor to navigate within the app while processing.
7. Expose completion/failure in the workspace Diary.

**Related components:** Anonymous Workspace, Upload Service, Cloud Storage, Audio
Processing Pipeline, Task Queue.

**Result:** Valid audio is stored and asynchronous processing begins.

**Output:** Stored Audio Reference and Processing Job ID.

**Operational purpose:** Produce structured, timestamped, speaker-linked meeting
content without blocking user interaction.

### Scenario 3 — Post-processing verification and speaker labeling

**Context:** Processing is complete and the user reviews the result.

**Flow:**

1. Notify the user that results are ready.
2. Match meeting speakers against enrolled voiceprints where possible.
3. Display transcript content with speaker labels, timestamps, and explicit
   unidentified state where recognition is unavailable.
4. Let the user select a segment or highlighted timeline position to hear the
   corresponding original audio.
5. Use Flow as the verified reference source for drafting formal minutes in an
   external editor.

**Related components:** Processing Pipeline, Speaker Identification, Voiceprint
Store, Frontend.

**Result:** Automatically labeled results are available for human verification
and information exploitation.

**Output:** Auto-Labeled Transcript and Identified Speaker Metadata.

**Operational purpose:** Keep AI output transparent, verifiable, and grounded in
the original source.

### Scenario 4 — Structured and semantic search

**Context:** A user needs information from one or more processed recordings.

**Flow:**

1. Accept keywords, natural-language questions, or filters for speaker, time,
   topic, and content.
2. For semantic queries, create a query vector and compare it with indexed
   transcript representations.
3. For structured queries, filter by normalized metadata and processed entities.
4. Rank and return relevant results.
5. Include the transcript passage, speaker, and timestamp with each result.

**Related components:** Search Module, Vector Database/pgvector, NLP Engine.

**Result:** Users locate relevant information without replaying the full meeting.

**Output:** Ranked Transcript Segments containing Speaker + Content + Time.

**Operational purpose:** Enable rapid retrieval while preserving source linkage
and preventing content fragmentation.

### Scenario 5 — Contextual playback and chart analysis

**Context:** A user verifies a passage or examines conversation dynamics.

**Flow:**

1. Select a search result, transcript segment, or highlighted timeline position.
2. Seek the player to the exact associated timestamp.
3. Play audio while synchronously highlighting the matching text.
4. Allow switching to analytical charts such as participation rate and active
   discussion frequency.

**Related components:** Media Player, Stream Service, Analytics Service,
Visualization Engine.

**Result:** The user verifies content from the original audio and reviews a
meeting-level analytical overview.

**Output:** Synchronized Audio–Text Stream and Analytics Charts.

**Operational purpose:** Support contextual understanding, verification, and
analysis. Charts must be derived from structured transcript/speaker data.

### Scenario 6 — Activity logging and history review

**Context:** A user reviews previous work and processing activity.

**Flow:**

1. Open the Diary section.
2. Display current workspace’s non-expired meeting history with file/meeting name, processing time or
   date, and status: Pending, Processing, Completed, or Failed.
3. Include relevant search/review activity where recorded by the operational
   audit model.
4. Filter by date or project/meeting name.
5. Sort by processing time and meeting/file name.

**Related components:** Diary Service and Diary/Activity storage.

**Result:** The user can trace and manage previous processing activity.

**Output:** Audio Processing Activity History.

**Operational purpose:** Ensure traceability, accountability, transparency, and
long-term knowledge management.

---

## 10. Operational impacts and benefits

### 10.1 User impacts

- Role shifts from passive transcription to active knowledge management.
- Cognitive load decreases because speaker, time, and content relationships are
  displayed structurally.
- Retrieval habits change from linear playback to structured/semantic search and
  contextual navigation.

### 10.2 Operational impacts

- Replace manual `Open → Listen → Stop → Type` chains with
  `Upload → AI Processing → View/Verify`.
- Standardize audio and transcript information as synchronized digital assets.
- Keep information exploitation in a controlled, view-only environment.

### 10.3 Organizational impacts

The ConOps anticipates four collaborating capability groups:

- **AI and Software Development:** Features, architecture, STT/diarization model
  improvement, and maintenance.
- **Infrastructure and Security:** Docker/Supabase operations, certificates,
  backup, continuity, access control, and policy compliance.
- **User Operations and Support:** User feedback, voice-enrollment support, and
  operational assistance.
- **Data Quality and Analytics:** Processing-log analysis, AI-quality evaluation,
  workload analysis, and optimization reporting.

### 10.4 Development impacts

- Modular-monolithic organization with clear logical boundaries.
- Asynchronous queues/background work for large AI workloads.
- Separation of the user-facing request/response cycle from long-running
  processing.
- Containerized environment for consistency and flexible expansion.

### 10.5 Operational benefits

- Reduced post-meeting production effort and faster review.
- Click-to-play verification instead of manual seek/rewind.
- Near-real-time processing-status updates without manual refresh in the ConOps
  vision.
- Central reference store for original and derived meeting knowledge.
- Objective speaker-participation and active-discussion analytics.
- Reusable voiceprint management.
- Semantic retrieval through pgvector-backed embeddings.
- Workspace-scope enforcement through Backend checks and Row Level Security
  where applicable.
- Secure storage with short-lived signed URLs.
- ACID-backed relational data integrity.
- Flexible scaling of frontend, backend, and AI worker workloads.

### 10.6 Scalability features recorded by the ConOps

| Feature                 | Implementation named in ConOps           | Intended benefit                                                            |
| ----------------------- | ---------------------------------------- | --------------------------------------------------------------------------- |
| Asynchronous processing | Task Queue — Celery/BullMQ               | Process multiple large files without blocking the main interface.           |
| Vector indexing         | Supabase pgvector with HNSW              | Maintain fast semantic similarity search as transcript volume grows.        |
| Modular AI pipeline     | Docker containers                        | Upgrade or replace AI models with limited impact on the rest of the system. |
| Storage optimization    | Supabase Storage, S3-compatible behavior | Distributed storage and controlled cleanup of large audio objects.          |
| Real-time updates       | Supabase Realtime/WebSocket              | Notify users of processing-status changes without manual refresh.           |

Treat Celery/BullMQ and WebSocket as ConOps-level options/expectations until the
detailed architecture selects the final queue and status-update mechanism.

---

## 11. Risks and mandatory mitigation behavior

### 11.1 AI accuracy and hallucination

**Risks:**

- STT errors for specialized terms, names, accents, dialects, or noisy audio.
- Speaker confusion during overlapping speech or for similar voices.
- LLM-generated summaries that introduce unsupported information.

**Mitigations:**

- Contextual playback for source verification.
- Confidence scores for AI-produced segments where supported.
- Clear highlighting or treatment of low-confidence content.
- Summary prompts that prohibit unsupported claims and require grounding in the
  transcript.
- Human confirmation before high-impact information is used formally.

### 11.2 Performance and latency

**Risks:**

- One-to-two-hour recordings require substantial CPU/GPU resources.
- Concurrent uploads can overload processing resources.
- Long-running AI tasks can exceed HTTP timeouts.

**Mitigations:**

- Asynchronous task queues separated from request handling.
- Job status and notification mechanisms.
- Chunking strategy, with the ConOps giving approximately 30-second chunks as
  an example for parallel processing.
- Capacity-aware concurrency and failure handling.

### 11.3 Data privacy and security

**Risks:**

- Legitimate users can still capture sensitive content through screenshots,
  photography, or screen recording.
- Signed URLs can leak or remain valid too long.
- A guessed, leaked, forged, or incorrectly scoped workspace capability can
  expose one visitor’s meetings to another visitor.
- Unauthenticated public entry can increase automated abuse and AI/storage cost.

**Mitigations:**

- Server-side workspace-scope checks on every resource path and, when used,
  database Row Level Security keyed by workspace identity.
- High-entropy opaque capabilities in protected cookies, rotation/expiry where
  applicable, IP/workspace rate limits, upload quotas, and CAPTCHA only when
  abuse thresholds require it.
- Short-lived signed URLs, with approximately five minutes given as a ConOps
  example rather than an unconditional constant.
- No unrestricted original-audio or transcript download endpoints.
- Client-side deterrents such as disabled right-click/text selection and visible
  watermarks where policy requires them.
- HTTPS and controlled storage access.
- Audit logging of access and playback activity.

Client-side blocking is only a deterrent and must never replace workspace-scope
validation, RLS where applicable, expiring access, auditability, and secure
storage.

### 11.4 Data retention

- Retention duration must be configurable according to organizational policy.
- Until the Product Owner approves an exact duration, implementations must use a
  named configuration value and must not hard-code or claim a retention period.
- Cleanup must preserve referential integrity and audit requirements.
- Expired data must not remain reachable through old signed URLs or indexes.
- Retention behavior must be explicitly tested once detailed retention rules are
  approved.

---

## 12. Operational invariants for code and tests

Every implementation or test plan derived from this prompt must preserve these
invariants:

1. No operation requires account registration or login.
2. A protected operation requires a valid anonymous-workspace capability.
3. A workspace can access only meetings and derived resources scoped to it;
   identifiers alone never grant access.
4. An accepted audio upload creates a traceable meeting/audio reference and a
   processing job.
5. Invalid files are rejected before AI processing starts.
6. Long-running processing does not block the primary HTTP interaction.
7. Processing state reflects reality and supports at least Pending, Processing,
   Completed, and Failed.
8. Transcript segments retain speaker/label, content, start time, end time, and
   source-meeting linkage.
9. Search results retain speaker, content, timestamp, meeting, relevance/context,
   and workspace boundaries.
10. Contextual playback seeks to the timestamp associated with the selected
    transcript or search segment.
11. Analytical results are derived from stored structured meeting data.
12. AI results are never represented as infallible.
13. Important information can be verified against original audio.
14. Original audio and meeting text are not exposed through unrestricted public
    URLs or downloads.
15. Signed access is short-lived and workspace-scoped.
16. Significant upload, processing, search, access, playback, and failure events
    are traceable.
17. Data lifecycle actions also remove or invalidate dependent storage/index
    access according to approved retention rules.
18. Clearing the workspace cookie or retention expiry does not create a recovery
    promise; prior data may become unavailable.
19. Language and theme settings remain usable without a server account.
20. Live conferencing and live audio ingestion remain outside scope.

---

## 13. Required response format for future tasks

For any Flow task performed with this prompt, produce:

1. **Task interpretation** — what operational capability is being addressed.
2. **Source traceability** — applicable ConOps section, scenario, policy,
   principle, risk, or invariant.
3. **Assumptions** — only assumptions necessary to proceed.
4. **Proposed change or design** — scoped to the request.
5. **Operational flow** — actors, preconditions, steps, states, outputs, and
   failure paths.
6. **Security and workspace controls** — capability validation, scope, storage,
   streaming, audit, and retention implications.
7. **AI verification behavior** — confidence, grounding, human review, and
   failure/uncertainty handling when AI is involved.
8. **Acceptance criteria and tests** — positive, negative, boundary,
   cross-workspace, retention, asynchronous, recovery, and traceability cases.
9. **Conflicts or unresolved decisions** — discrepancies with other Flow
   documents that require explicit resolution.

Do not return a generic implementation disconnected from the Flow operating
model. Do not claim full compliance unless every relevant invariant has been
addressed or explicitly marked not applicable.

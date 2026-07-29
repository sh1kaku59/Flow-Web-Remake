# FLOW — SOFTWARE REQUIREMENTS IMPLEMENTATION AND TESTING PROMPT

## 0. Purpose and authoritative sources

Use this file as the requirements baseline for analysis, implementation, review,
and testing of Flow. It is grounded in exactly two sources:

1. `Flow_SoftwareRequirementsSpecification_v2.0.pdf` — system requirements,
   use cases, logical data requirements, business rules, and evolution scope.
2. `Flow_UserStories_v1.0.xlsx` — 31 user stories and their acceptance criteria.

This prompt defines **what the system shall do**. It must not independently
invent architecture, API paths, database column types, UI styling, AI models, or
deployment topology. Those belong to later design documents.

## 1. Requirements working contract

For every Flow task:

1. Preserve requirement identifiers exactly: `US`, `FR`, `SF`, `NFR`, `UC`, and
   `BR` identifiers must never be renumbered or silently repurposed.
2. Treat explicit acceptance criteria in the User Stories workbook as testable
   obligations.
3. Treat explicit SRS functional, non-functional, data, and business rules as
   mandatory constraints.
4. When the two sources overlap, implement the union of compatible obligations.
5. When they conflict or leave a value unspecified, do not guess. Record the
   issue in the Requirements Decision Log and use a configurable placeholder.
6. Derived traceability mappings in this prompt are aids, not replacements for
   source requirements.
7. Every implementation proposal must identify the affected requirements and
   provide acceptance tests for success, validation failure, missing/invalid
   workspace capability, cross-workspace isolation, dependency failure,
   retention expiry, rate limits, and state transition behavior.
8. Anonymous-workspace scope checks are required at the server/data-access
   boundary; hiding UI controls is never sufficient protection.
9. Long-running meeting processing must not block normal user interaction.
10. AI-generated results must remain associated with their meeting, transcript,
    speaker/timestamps, and processing status.
11. Never claim compliance when a numeric threshold or policy is still undefined.
12. Future enhancements in Chapter V are not current-scope requirements unless
    explicitly promoted through a change request.

### 1.1 Approved change request CR-ANON-01 — Anonymous Workspace baseline

The Product Owner has approved a product simplification that supersedes all
account-centric requirements inherited from the two source documents:

| Decision              | Active requirement                                                                                                                                                             |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Entry                 | Anyone may open Landing and press **Start**; no registration or login.                                                                                                         |
| Isolation             | **Start** creates or resumes an isolated anonymous workspace using an opaque, high-entropy capability in an `HttpOnly`, `Secure`, `SameSite` cookie.                           |
| Ownership replacement | Every server-side query/mutation is scoped by `workspace_id`; a resource ID alone grants no access.                                                                            |
| History               | Diary is temporary history for the current workspace, not a permanent account archive and not cross-device.                                                                    |
| Voice setup           | Voice samples remain workspace-scoped and reusable, but their add/play/rename/delete/readiness UI is embedded in Upload.                                                       |
| Settings              | Only Vietnamese/English and light/dark preferences remain required; store locally unless a later approved requirement needs server sync.                                       |
| Removed scope         | Registration, email/password login, Google OAuth, logout, password hashing/change/reset, OTP/email verification, Profile, avatar, account notifications, and account recovery. |
| Retention             | Workspace data expires under configurable retention and referential cleanup. Exact duration remains an approved-configuration decision; do not invent one.                     |
| Abuse control         | Rate-limit and quota public upload/processing by workspace and network signal; introduce CAPTCHA only when configured abuse thresholds require it.                             |

Identifiers are preserved for traceability. Legacy account features (registration, email/OAuth login, logout, password reset, profile, avatar, account notifications) have been completely removed under `CR-ANON-01`.
`US-01`/`FR-01` are redefined below as anonymous workspace entry; `FR-03` is
redefined as anonymous workspace lifecycle rather than sign-up.

---

## 2. System intent and boundary

Flow is a standalone, web-based post-meeting processing and information-retrieval
system. It converts recorded meeting audio into structured meeting knowledge:

- transcript segments;
- speaker labels or identified speakers;
- timestamps;
- topics and semantic timeline segments;
- meeting summary;
- speaker behavior statistics;
- search indexes and ranked search results; and
- meeting/processing history.

The external operational actor is the User, primarily a Meeting Assistant or
Meeting Manager. Internal speech processing, semantic analysis, storage, search,
and background processing belong inside the Flow system boundary.

Flow is post-processing software, not a live meeting platform. It receives
completed audio recordings and returns structured, searchable results.

### 2.1 SRS purpose, scope, objectives, and stakeholders

The SRS is the common reference for Product Owner/Mentor, Project Manager,
System Architect, Business Analyst, Developer, Tester, academic evaluators, and
the end user. It defines behavior and quality expectations, not final algorithms
or deployment choices.

The system objectives are to:

- automate conversion of recorded audio into accurately structured text;
- separate and identify participants from audio;
- synchronize audio and transcript through timestamps;
- identify topics, semantic structure, and meeting summaries;
- retrieve information by content, speaker, time, and semantic intent;
- provide contextual playback and analytical information; and
- maintain a complete, traceable baseline for design, development, validation,
  and testing.

Key stakeholder groups are:

- project stakeholders who plan, analyze, architect, implement, and test Flow;
- academic stakeholders who evaluate completeness and rigor; and
- the Meeting Assistant who uploads, reviews, searches, plays, and manages
  meeting-derived content.

Operating assumptions include supported recorded-audio input, sufficient source
quality, stable Internet access, and available speech/semantic dependencies.
Constraints include applicable personal-data protection, infrastructure-defined
file/duration/processing limits, and AI accuracy that varies with input quality.

### 2.2 Primary inputs

- Anonymous workspace start/resume capability state; raw capability is never an
  application payload or log field.
- Browser-local language/theme preferences.
- Voice-sample audio and speaker identity metadata.
- Meeting-audio files and meeting metadata.
- Diary search/sort/filter/rename commands.
- Keyword, multi-dimensional, and semantic queries.
- Playback commands tied to transcript/timeline positions.

### 2.3 Primary outputs

- Workspace start/resume/expiry state and validation feedback.
- Upload acknowledgement and progress.
- Processing state: `Pending`, `Processing`, `Completed`, or `Failed`.
- Structured transcripts with speaker and time alignment.
- Semantic timeline, topic, summary, and speaker analytics.
- Ranked and filtered search results.
- Synchronized contextual audio playback.
- Workspace-scoped temporary Diary/history and voice samples; local settings.
- Security, workspace, activity, processing, search, cleanup, and abuse-control logs.

### 2.4 Environment and operating constraints

- Browser-based access on Windows, macOS, and Linux.
- Modern browser support includes Chrome, Edge, Firefox, and Safari; NFR-08
  explicitly names Chrome, Edge, and Safari.
- End users need standard audio input/output capability and stable broadband.
- Common meeting-audio formats include WAV, MP3, and M4A at the SRS environment
  level, subject to the format inconsistency recorded later in this prompt.
- Client/server communication uses secure Internet protocols, including HTTPS.
- The system supports synchronous requests for interactive operations and
  asynchronous completion for long-running audio processing.
- Speech-processing and semantic-analysis dependencies must be available and
  configured.

---

## 3. User-story acceptance baseline

The following 31 stories are source requirements from
`Flow_UserStories_v1.0.xlsx`. Wording is normalized only for readability; no
acceptance obligation may be dropped.

### US-01 — Start or resume anonymous workspace (REBASELINED)

**Story:** As a visitor, I want to press **Start** without creating an account so
that I can use Flow immediately inside a private temporary workspace.

**Active acceptance criteria:**

- Landing is publicly reachable and presents a clear Start action.
- Start creates a new high-entropy workspace capability when none is valid and
  resumes the current workspace when a valid protected cookie exists.
- The capability is never returned in a URL, rendered in UI, or readable by
  frontend JavaScript.
- Successful entry opens Upload; failure provides retryable, non-sensitive
  feedback.
- No email, password, Google identity, profile, or account record is requested.
- Invalid/expired capabilities do not expose an earlier workspace and may create
  a clean new workspace according to the approved expiry policy.
- Creation/resume is rate-limited and logged without storing the raw capability.

**Superseded source wording below:** historical only; do not implement.

**Story:** As a user, I want to log in using email and password so that I can
access my account.

**Acceptance obligations:**

- Allow only registered users to log in with email and password.
- Require non-empty email and password fields.
- Verify that the email exists and that the password matches the stored hash.
- Reject incorrect credentials with a generic error that does not disclose which
  credential was wrong.
- Create a secure authenticated session and redirect to Dashboard on success.
- Enforce a configurable failed-attempt account-lockout policy.
- Log successful and failed attempts.
- Protect credentials in transit with HTTPS.
- Automatically log out after a configurable inactivity timeout.

**Derived mapping:** `FR-01`, `NFR-02`, `NFR-11`, `BR-03`, `BR-06`, `UC-02`.
### US-05 — Initial voice-sample upload

**Story:** As a visitor, I want to prepare reusable voice samples inside Upload
so that speakers can be recognized without account onboarding.

**Acceptance obligations:**

- Accept an existing voice-sample audio file.
- Accept supported formats including WAV, MP3, and M4A.
- Enforce configurable maximum file size, minimum duration, and maximum duration.
- Validate type and duration and detect corruption before processing/storage.
- Reject corrupt or invalid audio with an appropriate error.
- Allow multiple voice samples for different speaker identities.
- Associate each sample with its speaker label and current workspace.
- Store the sample securely.
- Show success confirmation or upload failure feedback.
- Log voice-sample upload activity.
- Show sample readiness in Upload. If known-speaker recognition is required for
  the selected processing mode, prevent meeting submission until at least one
  usable sample exists. Basic unidentified-speaker diarization may proceed only
  when that mode is explicitly supported.

**Derived mapping:** `FR-03`, `FR-04`, `NFR-02`, `NFR-09`, `UC-01`.

### US-06 — Meeting-audio upload

**Story:** As a Meeting Assistant or Meeting Manager, I want to upload a meeting
audio file so that the system can analyze it.

**Acceptance obligations:**

- Require a valid anonymous workspace.
- Accept supported meeting formats; the workbook explicitly gives WAV and MP3.
- Enforce configurable maximum size and minimum duration.
- Validate format and detect corruption before accepting the file.
- Reject corrupt/unreadable files.
- Display upload progress and permit cancellation before completion.
- Store accepted audio securely and associate it with the current workspace.
- Create/save a diary entry with initial status `Pending`.
- Display an appropriate upload failure message.

**Derived mapping:** `FR-05`, `NFR-02`, `NFR-09`, `BR-03`, `BR-08`, `UC-03`.

### US-07 — Automatic meeting processing and retry

**Story:** As a Meeting Assistant or Meeting Manager, I want uploaded audio to
be processed automatically so that I receive structured insights.

**Acceptance obligations:**

- Process only successfully uploaded/archived audio.
- Transition `Pending → Processing` when work begins.
- Execute speech separation, voice-sample-based recognition, STT, per-segment
  timestamps, semantic timeline, topic identification, and speaker behavior
  analysis.
- Use a clear default label such as `Speaker A` when identification fails and
  visibly mark unidentified speakers.
- Allow the user to navigate elsewhere while work continues.
- Transition to `Completed` on success and `Failed` on unrecoverable failure.
- Store generated transcript and extracted content.
- Update in-app processing status on completion/failure; no email/account
  notification preference is required.
- Prevent duplicate processing unless explicitly reprocessing.
- Log processing events and errors.
- Isolate processing data/tasks by authorized user context and prevent cross-user
  exposure.
- Before retry, verify workspace scope and the continued existence of the source audio.
- Clear incomplete prior outputs before retrying.
- Store results in structured, indexable, searchable, retrievable form.

**Derived mapping:** `FR-06`–`FR-12`, `SF-02`, `NFR-01`, `NFR-03`, `NFR-04`,
`NFR-09`, `NFR-11`, `BR-07`–`BR-13`, `UC-03`.

### US-08 — View diary history

**Story:** As a Meeting Assistant or Meeting Manager, I want to view previous
meeting diaries so that I can review past discussions.

**Acceptance obligations:**

- Require a valid workspace and return only its non-expired Diary entries.
- Display meeting title/file name, upload date, and processing status.
- Support pagination or scrolling for large collections.
- Load within the applicable performance threshold.
- Display a meaningful empty state.
- Update the list after a new upload without duplicating entries.

**Derived mapping:** `FR-18`, `NFR-01`, `NFR-09`, `BR-03`, `BR-04`, `UC-04`.

### US-09 — Search diaries

**Story:** As a Meeting Assistant or Meeting Manager, I want to search diaries by
keyword so that I can quickly find a discussion.

**Acceptance obligations:**

- Provide a diary search field.
- Search by meeting topic and file name.
- Show matches dynamically or after submission.
- Return only the current workspace’s non-expired Diary entries.
- Support partial, case-insensitive matching.
- Show `No results found` when appropriate.
- Maintain acceptable performance for large data sets.

**Derived mapping:** `FR-18`, `SF-03`, `NFR-01`, `NFR-09`, `BR-04`, `UC-04`.

### US-10 — Sort and organize diaries

**Story:** As a Meeting Assistant or Meeting Manager, I want to sort diaries by
time or name so that I can manage them efficiently.

**Acceptance obligations:**

- Sort by upload date, processing status, and meeting name.
- Apply sorting/filtering without mutating stored diary data.
- Update the displayed list immediately.
- Preserve the selected sort/filter during the session.
- Never include or operate on another user’s diaries.
- Remain within applicable performance thresholds.

**Derived mapping:** `FR-18`, `SF-04`, `NFR-01`, `NFR-09`, `BR-04`, `UC-04`.

### US-11 — Refresh diary status

**Story:** As a Meeting Assistant or Meeting Manager, I want the newest diary
updates so that I know I am viewing current information.

**Acceptance obligations:**

- Provide an explicit refresh action.
- Retrieve the latest diary data from persistence.
- Update processing states in real time or near real time.
- Do not duplicate diary entries.
- Preserve the current sort/filter state after refresh.
- Handle refresh failures gracefully.

**Derived mapping:** `FR-18`, `SF-05`, `NFR-01`, `NFR-04`, `UC-04`.

### US-12 — Rename diary

**Story:** As a Meeting Assistant or Meeting Manager, I want to rename an
existing diary so that it is easier to organize and identify.

**Acceptance obligations:**

- Provide a rename action and editable name field.
- Validate required value, configurable length, and restricted characters.
- Prevent duplicate names only if a uniqueness rule is approved.
- Save only after user confirmation.
- Immediately display the saved name and a success message.
- Preserve current sort/filter settings.
- On failure, keep the prior value and display an appropriate error.

**Derived mapping:** `FR-18`, `SF-06`, `NFR-04`, `NFR-09`, `BR-04`, `UC-04`.

### US-13 — Diary details

**Story:** As a Meeting Assistant or Meeting Manager, I want to open a diary and
view its transcript and analytics so that I can analyze the meeting.

**Acceptance obligations:**

- Allow access only to a selected Diary in the current workspace.
- Display meeting name/title, topic, full transcript, presenter/speaker list, and
  a segment-by-segment timeline.
- If incomplete, show the processing status instead of pretending results exist.
- If failed, show appropriate failure/error details.
- Support navigation back to the diary list.
- Keep transcript and extracted content read-only.
- Load within applicable response-time limits.

**Derived mapping:** `FR-18`, `SF-07`, `FR-09`–`FR-17`, `NFR-01`, `NFR-09`,
`BR-04`, `UC-04`.

### US-14 — Automatic meeting summary

**Story:** As a Meeting Assistant or Meeting Manager, I want an automatic summary
so that I can quickly understand key points.

**Acceptance obligations:**

- Generate only after meeting processing succeeds and transcript data exists.
- Base the summary on the full transcript.
- Associate and store it with the correct diary/meeting.
- Reflect the main discussion points.
- Report generation failure appropriately.
- Present the generated summary read-only and prohibit manual modification.
- Log summary generation.
- Do not block unrelated system operations during generation.

**Derived mapping:** `FR-13`, `NFR-01`, `NFR-04`, `NFR-11`, `BR-07`, `UC-03`,
`UC-04`.

### US-15 — Multi-dimensional transcript search

**Story:** As a Meeting Assistant or Meeting Manager, I want to search/filter by
content, speaker, timestamp, or topic so that I can find an exact transcript
passage.

**Acceptance obligations:**

- Filter/search by content keyword, identified speaker, and timestamp range.
- Allow multiple dimensions to be combined.
- Limit results to the selected authorized meeting.
- Highlight matching keywords in transcript segments.
- Include speaker label, content, and exact timestamp/timeline in each result.
- Show a no-results state when appropriate.
- Complete within the applicable search-performance threshold.
- Prevent cross-user exposure.
- Handle unsupported or invalid filter combinations gracefully.

**Derived mapping:** `FR-14`, `NFR-01`, `NFR-09`, `BR-05`, `UC-04`.

### US-16 — Semantic conversation search

**Story:** As a Meeting Assistant or Meeting Manager, I want to search by meaning
so that I can find relevant discussions without exact keyword matches.

**Acceptance obligations:**

- Accept non-empty, well-formed natural-language queries.
- Perform semantic similarity matching against transcript content.
- Retrieve semantically relevant segments without exact word matches.
- Rank results by relevance score.
- Include meeting/segment context, speaker, content, and timestamp.
- Search only within the selected meeting or another explicitly authorized data
  set.
- Never expose another user’s meeting data.
- Show `No relevant results found` when applicable.
- Maintain applicable semantic-search response time.
- Log semantic searches.
- Never mutate transcript content as a side effect of searching.
- Handle malformed or empty queries appropriately.
- Automatically create an index after transcript generation and only when the
  meeting reaches `Completed`.
- Prevent duplicate index creation for a transcript segment.

**Derived mapping:** `FR-15`, `NFR-01`, `NFR-09`, `NFR-11`, `BR-05`, `BR-15`,
`UC-04`.

### US-17 — Contextual conversation playback

**Story:** As a Meeting Assistant or Meeting Manager, I want synchronized audio
and highlighted transcript playback so that I can follow a specific discussion.

**Acceptance obligations:**

- Start playback from a transcript/search-result timestamp.
- Synchronize transcript text and displayed search-result segments with audio.
- Highlight the segment currently being spoken.
- Clicking transcript text seeks to its audio timestamp.
- Clicking a highlighted audio-timeline segment navigates to the corresponding
  transcript segment.
- Require a valid workspace and meeting scope.
- Support play, pause, and seek.
- Prevent playback when source audio is missing or corrupt and show an error.
- Playback must not mutate stored meeting data.
- Maintain synchronization within an approved tolerance.

**Derived mapping:** `FR-16`, `NFR-01`, `NFR-04`, `NFR-09`, `BR-04`, `BR-15`,
`UC-04`.

### US-18 — Speaker behavior statistics

**Story:** As a Meeting Assistant or Meeting Manager, I want individual and group
discussion statistics so that I can assess engagement.

**Acceptance obligations:**

- Compute statistics after speaker identification/labeling is available.
- At minimum, calculate speaker contribution rate and the number of active
  multi-speaker discussion periods.
- Display results visually or in a table.
- Associate statistics only with the relevant meeting.
- Derive them from processed transcript and speaker labels.
- Restrict access to the meeting’s workspace.
- Recompute/update statistics when the meeting is reprocessed.
- Meet an approved calculation-accuracy threshold.
- Handle missing speaker recognition and insufficient data gracefully.
- Keep generated statistics read-only.
- Log analytics generation.

**Derived mapping:** `FR-11`, `FR-17`, `NFR-04`, `NFR-09`, `NFR-11`, `UC-04`.
### US-24 — View and play voice-sample collection

**Story:** As a Meeting Assistant or Meeting Manager, I want to manage my voice
samples so that Flow can recognize speakers across meetings.

**Acceptance obligations:**

- Require a valid workspace and show only its non-expired samples.
- Display sample name, avatar, identifier, and audio duration.
- Support multiple samples and use all stored samples as the future recognition
  pool.
- Show a meaningful empty state and load within applicable performance limits.
- Support owned-sample playback with play and pause.
- Prevent playback when a file is missing/corrupt and prevent playback of
  another workspace’s sample.

**Derived mapping:** `FR-21`, `NFR-01`, `NFR-09`, `BR-04`, `UC-05`.

### US-25 — Add voice sample

**Story:** As a Meeting Assistant or Meeting Manager, I want to add a new voice
sample so that speakers can be recognized.

**Acceptance obligations:**

- Require a valid workspace and provide add/upload inside Upload.
- Accept supported formats including WAV, MP3, and M4A.
- Enforce configurable maximum size, minimum duration, maximum duration, and
  maximum sample-count limits.
- Validate type and reject corrupt/unreadable audio.
- Accept a sample name/label.
- Associate the sample with the current workspace and add it to that
  workspace’s collection/recognition pool.
- Display upload progress and permit cancellation before completion.
- Show success or appropriate failure feedback.
- Log sample creation.

**Derived mapping:** `FR-21`, `SF-11`, `NFR-02`, `NFR-09`, `NFR-11`, `UC-05`.

### US-26 — Rename voice sample

**Story:** As a Meeting Assistant or Meeting Manager, I want to rename a voice
sample so that it is easier to identify.

**Acceptance obligations:**

- Provide a rename action.
- Permit changing only the name; audio content remains unchanged.
- Validate required value, configurable length, and restricted characters.
- Save only after confirmation and immediately reflect the new name.
- Preserve workspace association.
- Handle failure gracefully and log the rename.

**Derived mapping:** `FR-21`, `SF-12`, `NFR-09`, `NFR-11`, `UC-05`.

### US-27 — Delete voice sample

**Story:** As a Meeting Assistant or Meeting Manager, I want to delete an
outdated voice sample.

**Acceptance obligations:**

- Allow deletion only for a sample scoped to the current workspace.
- Require explicit confirmation.
- Remove it from the collection and immediately update the UI.
- Ensure it is no longer used for future speaker recognition.
- Handle deletion failure without falsely removing the UI item.
- Show success feedback and log deletion.

**Derived mapping:** `FR-21`, `SF-13`, `NFR-09`, `NFR-11`, `BR-04`, `UC-05`.

### US-28 — View settings

**Story:** As a user, I want to access Settings and view my options so that I can
manage preferences.

**Acceptance obligations:**

- Require no account; expose Settings through application navigation.
- Display current language and theme only.
- Store preferences locally and preserve them even when the anonymous workspace
  expires.
- If local settings cannot be loaded, use safe defaults and show non-blocking
  feedback; never redirect to Login.

**Derived mapping:** `FR-22`, `NFR-02`, `NFR-09`, `UC-05`.

### US-29 — Change language

**Story:** As a user, I want to change the system language so that I can use my
preferred language.

**Acceptance obligations:**

- Display all supported languages and clearly identify the active one.
- Permit exactly one selected language.
- Require confirmation before applying.
- Update all UI labels, buttons, menus, and notifications.
- Persist the value locally and apply it on subsequent visits in that browser.
- Do not alter unrelated user data or configuration.
- Reject unsupported values and report persistence failure.
- Update the active interface without a workspace restart.

**Derived mapping:** `FR-22`, `SF-14`, `NFR-04`, `UC-05`.

### US-30 — Theme mode

**Story:** As a user, I want Light or Dark mode so that I can
improve visual comfort.

**Acceptance obligations:**

- Provide Light and Dark and show the active choice.
- Apply the confirmed selection immediately and consistently across components.
- Persist and restore the selection on future visits in that browser.
- Do not require an account or workspace restart.
- Do not modify meeting or transcript data.
- Report persistence failure.
- Preserve readable contrast/accessibility.

**Derived mapping:** `FR-22`, `SF-15`, `NFR-07`, `UC-05`.

---

## 4. Functional requirements baseline

### 4.1 Priority and complexity scales

- Priority 1: Must do.
- Priority 2: Should be.
- Priority 3: Depends on.
- Priority 4: Should not.
- Complexity 1: Extremely complicated.
- Complexity 2: Complex.
- Complexity 3: Normal.
- Complexity 4: Easy.
- Complexity 5: Extremely easy.

### 4.2 Functional requirements

| ID    | Requirement                                | Source description                                                                              | Priority | Complexity |
| ----- | ------------------------------------------ | ----------------------------------------------------------------------------------------------- | -------: | ---------: |
| FR-01 | Start Anonymous Workspace                  | Enter from Landing without an account; securely create/resume a workspace and route to Upload.  |        1 |          4 |
| FR-03 | Anonymous Workspace Lifecycle              | Create, validate, expire, and clean up temporary workspace scope without credentials.           |        1 |          3 |
| FR-04 | Upload Voice Sample                        | Upload/manage original voice-sample audio inside Upload and scope it to the workspace.          |        1 |          3 |
| FR-05 | Upload Meeting Audio                       | Upload meeting audio for processing.                                                            |        1 |          3 |
| FR-06 | Speech Separation and Recognition          | Separate voices and identify speakers using prior samples.                                      |        1 |          2 |
| FR-07 | Speech-to-Text                             | Convert spoken audio into transcript text.                                                      |        1 |          2 |
| FR-08 | Assign Timestamps                          | Time-align dialogue/transcript segments to audio.                                               |        1 |          1 |
| FR-09 | Semantic Timeline                          | Highlight meaningful points over the meeting timeline for contextual playback.                  |        1 |          1 |
| FR-10 | Semantic Analysis and Topic Identification | Analyze the whole conversation and identify meeting topics.                                     |        1 |          1 |
| FR-11 | Speaker Behavior Analysis                  | Derive speaker participation/interaction metrics for visual presentation.                       |        1 |          1 |
| FR-12 | Structured Conversation Data Storage       | Persist structured conversation data for search, retrieval, and analysis.                       |        1 |          1 |
| FR-13 | Conversation Summary                       | Generate a meeting summary from processed transcript/conversation data.                         |        1 |          1 |
| FR-14 | Multi-Dimensional Conversation Metrics     | Search by structured criteria including speaker, content, and time.                             |        1 |          2 |
| FR-15 | Semantic Conversational Search             | Return meaning-based results for semantically vague queries.                                    |        1 |          1 |
| FR-16 | Contextual Conversation Playback           | Jump to the audio timestamp associated with a relevant dialogue/result.                         |        1 |          1 |
| FR-17 | Speaker Behavior Statistics                | Record selected higher-level behavior metrics.                                                  |        2 |          3 |
| FR-18 | Temporary Diary Management                 | Review non-expired processing history and activity details for the current workspace.           |        2 |          3 |
| FR-21 | Voice Sample Management in Upload          | List, add, rename, delete, play, and organize workspace-scoped voice samples in the Upload tab. |        1 |          3 |
| FR-22 | Local Settings                             | Configure Vietnamese/English and light/dark appearance without an account.                      |        2 |          4 |

### 4.3 Functional mapping by service

| SRS service                         | Requirement coverage               |
| ----------------------------------- | ---------------------------------- |
| Anonymous Workspace Service         | `FR-01`, `FR-03`                   |
| Upload and Voice Sample Service     | `FR-04`, `FR-21`                   |
| Client Settings                     | `FR-22`                            |
| Meeting Audio Processing Service    | `FR-05`, `FR-06`, `FR-07`, `FR-08` |
| Meeting Intelligence Service        | `FR-09`, `FR-10`, `FR-11`, `FR-13` |
| Structured Data Management Service  | `FR-12`                            |
| Search and Retrieval Service        | `FR-14`, `FR-15`                   |
| Contextual Playback Service         | `FR-16`                            |
| Analytics and Visualization Service | `FR-17`                            |
| Activity Monitoring Service         | `FR-18`                            |

### 4.4 Sub-functions

| ID    | Parent area             | Sub-function                                                 | CRUD intent |
| ----- | ----------------------- | ------------------------------------------------------------ | ----------- |
| SF-01 | Anonymous Entry         | Create/resume protected workspace and open Upload            | Create/Read |
| SF-02 | Upload Meeting Audio    | Process meeting audio into transcript/analysis/diary results | Create      |
| SF-03 | Diary Management        | Search diary                                                 | Read        |
| SF-04 | Diary Management        | Organize/sort diary                                          | Update      |
| SF-05 | Diary Management        | Refresh diary                                                | Read        |
| SF-06 | Diary Management        | Rename diary                                                 | Update      |
| SF-07 | Diary Management        | View diary details                                           | Read        |
| SF-11 | Voice Sample Management | Add voice sample                                             | Create      |
| SF-12 | Voice Sample Management | Edit/rename voice sample information                         | Update      |
| SF-13 | Voice Sample Management | Delete voice sample                                          | Delete      |
| SF-14 | Settings                | Change language                                              | Update      |
| SF-15 | Settings                | Change theme mode                                            | Update      |

---

## 5. Non-functional requirements and measurable constraints

| ID     | Attribute                    | Mandatory requirement                                                                                                                                          | Priority |
| ------ | ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------: |
| NFR-01 | Performance                  | Process/transcribe audio up to 60 minutes within no more than 2× audio duration under average load.                                                            |        1 |
| NFR-02 | Security                     | Protect workspace/audio data with high-entropy protected capabilities, server-side workspace separation, HTTPS, rate limits, quotas, and secret/log redaction. |        1 |
| NFR-03 | Scalability                  | Handle multiple uploads and processing requests concurrently without significant degradation.                                                                  |        2 |
| NFR-04 | Reliability                  | Preserve transcript and analysis integrity through processing.                                                                                                 |        1 |
| NFR-05 | Maintainability              | Keep source and system structure modular for maintenance and upgrades.                                                                                         |        2 |
| NFR-06 | Availability                 | Achieve at least 95% operating availability under normal conditions.                                                                                           |        2 |
| NFR-07 | Usability                    | Provide a clear UI and allow the main operation within no more than three steps in the NFR table.                                                              |        1 |
| NFR-08 | Compatibility                | Operate on Chrome, Edge, and Safari; the SRS environment also lists Firefox.                                                                                   |        2 |
| NFR-09 | Data Compliance and Security | Conversation data is accessible only inside its valid workspace scope, expires under retention policy, and follows personal/voice-data protection principles.  |        1 |
| NFR-10 | Recoverability               | Back up and restore data after system failure.                                                                                                                 |        2 |
| NFR-11 | Observability                | Record important workspace creation/resume/expiry, upload, processing, cleanup, abuse-control, and query events without raw capabilities.                      |        2 |
| NFR-12 | Future Extensibility         | Add new analytical modules without disrupting the existing structure.                                                                                          |        3 |

### 5.1 Additional quantified constraints from the SRS narrative

- Normal interactive operations such as workspace start/resume, initial interface load, diary
  list, and diary detail should respond within **3–5 seconds**.
- Keyword, multi-criteria, and semantic search results should return within
  **5 seconds**.
- A recording up to 60 minutes must complete heavy processing within at most
  **120 minutes** under average load.
- The system must handle at least **5 simultaneous audio uploads** without
  errors, deadlocks, or data loss.
- The scalable target is at least **100 concurrent users** under normal
  conditions without major performance impact.
- Availability target is at least **95%**.
- Main tasks are described elsewhere in the SRS as requiring **3–5 actions**;
  this conflicts with the stricter NFR-07 table value of no more than 3 steps and
  is recorded in the decision log.

### 5.2 Mandatory quality test categories

- Processing-duration test at the 60-minute boundary.
- Interactive-response and search-response tests under normal load.
- Five-simultaneous-upload concurrency test.
- One-hundred-user workload test with an approved degradation budget.
- Cross-browser tests for Chrome, Edge, Safari, and, according to environment
  constraints, Firefox.
- Workspace capability/scope isolation and direct-object-reference tests.
- Backup/restore and failed-job retry tests.
- Event/log completeness tests with sensitive-data redaction.
- Usability-step-count validation after resolving the 3 versus 3–5 discrepancy.

---

## 6. Use-case contracts

The SRS defines five system-level use cases. User-story acceptance criteria are
the detailed behavior baseline; these contracts organize them into end-to-end
flows.

### UC-01 — Start Anonymous Workspace

- **Primary actor:** Visitor.
- **Purpose:** Enter Flow immediately and establish an isolated temporary
  workspace without identity registration.
- **Preconditions:** Landing and workspace service are available.
- **Success:** A protected opaque capability is issued/resumed in a secure
  cookie and Upload opens with workspace-scoped voice-sample readiness.
- **Minimum guarantee:** Failure creates no exposed/guessable capability and
  reveals no data from another or expired workspace.
- **Coverage:** `US-01`, `US-05`, `FR-01`, `FR-03`, `FR-04`, `BR-01`–`BR-06`.

### UC-02 — Resume or Recreate Workspace

- **Primary actor:** Returning visitor.
- **Purpose:** Resume a valid browser workspace or begin cleanly after
  expiry/missing state.
- **Preconditions:** Browser may present a workspace cookie.
- **Success:** A valid non-expired workspace is resumed; otherwise Flow creates
  a new isolated workspace without implying recovery of old data.
- **Minimum guarantee:** Forged/expired capabilities never access prior data;
  raw capabilities are not logged.
- **Coverage:** `US-01`, `FR-01`, `FR-03`, `SF-01`, `NFR-02`, `NFR-09`.

### UC-03 — Upload and Process Meeting Audio

- **Primary actor:** Visitor in a valid workspace.
- **Purpose:** Validate/store workspace-scoped audio, create a diary/job, process it, and
  persist structured results.
- **State model:** `Pending → Processing → Completed | Failed`; retry is an
  explicit scoped action, not an accidental duplicate.
- **Success:** Transcript, speaker/time alignment, semantic/topic results,
  structured storage, summary/analytics/index where applicable, and logs are
  associated with the correct meeting.
- **Minimum guarantee:** Invalid input creates no processing job; failure remains
  observable and does not expose another workspace’s data.
- **Coverage:** `US-06`, `US-07`, `US-14`, `FR-05`–`FR-13`, `SF-02`,
  `BR-07`–`BR-13`.

### UC-04 — Diary Management and Meeting Exploration

- **Primary actor:** Visitor in a valid workspace.
- **Purpose:** List/search/sort/refresh/rename non-expired workspace diaries; open details;
  search transcript content; play audio context; view analytics.
- **Success:** Operations retain workspace scope, context, current UI state,
  and source timestamps.
- **Minimum guarantee:** Cross-workspace/missing/failed resources reveal no protected
  data and do not mutate stored transcript/analysis content.
- **Coverage:** `US-08`–`US-18`, `FR-14`–`FR-18`, `SF-03`–`SF-07`, `BR-04`,
  `BR-05`, `BR-15`.

### UC-05 — Upload Voice Samples and Local Settings

- **Primary actor:** Visitor in a valid workspace.
- **Purpose:** Manage reusable workspace voice samples inside Upload and change
  local language/theme settings.
- **Success:** Valid sample changes remain within the workspace; language/theme
  apply and persist locally without touching meeting data.
- **Minimum guarantee:** Cancelled/failed operations do not partially mutate
  stored samples, and local preference failure does not expose workspace data.
- **Coverage:** `US-05`, `US-24`–`US-30`, `FR-04`, `FR-21`, `FR-22`,
  `SF-11`–`SF-15`, `BR-04`, `BR-05`.

---

## 7. Logical data requirements

### 7.1 Required entities and fields

| Entity             | Required logical fields                                                                                     |
| ------------------ | ----------------------------------------------------------------------------------------------------------- |
| AnonymousWorkspace | `id`, `capability_digest`, `status`, `created_at`, `last_seen_at`, `expires_at`, `deleted_at`               |
| VoiceSample        | `id`, `workspace_id`, `speaker_label`, `file_url`, `duration`, `created_at`, `embedding_vector`             |
| Speaker            | `id`, `meeting_id`, `voice_sample_id`, `speakers_name`, `is_identified`, `avatar_url`                       |
| Meeting            | `id`, `workspace_id`, `title`, `topic`, `status`, `created_at`, `expires_at`                                |
| AudioFile          | `id`, `meeting_id`, `file_url`, `duration`, `file_size`, `format`, `created_at`                             |
| ProcessingJob      | `id`, `meeting_id`, `status`, `job_type`, `progress_percent`, `started_at`, `completed_at`, `error_message` |
| ProcessingStep     | `id`, `job_id`, `step_name`, `step_order`, `status`, `started_at`, `completed_at`, `error_message`          |
| TranscriptSegment  | `id`, `meeting_id`, `speaker_id`, `content`, `start_time`, `end_time`                                       |
| ClientSetting      | Browser-local `theme`, `language`; no server account relationship required                                  |
| MeetingSummary     | `id`, `meeting_id`, `summary`, `created_at`                                                                 |
| SemanticSegment    | `id`, `meeting_id`, `content`, `start_time`, `end_time`                                                     |
| SpeakerStatistic   | `id`, `meeting_id`, `speaker_id`, `lively_discussion`, `number_of_speech`                                   |
| SearchIndex        | `id`, `meeting_id`, `transcript_segment_id`, `embedding_vector`, `created_at`                               |

### 7.2 Required relationships and integrity

- AnonymousWorkspace scopes Meetings and VoiceSamples. Client settings are
  browser-local and independent of workspace retention.
- Meeting is the scope/processing root for AudioFile, Speaker,
  TranscriptSegment, ProcessingJob, MeetingSummary, SemanticSegment,
  SpeakerStatistic, and SearchIndex records.
- ProcessingJob contains ordered ProcessingSteps.
- TranscriptSegment belongs to a valid Meeting and Speaker.
- SearchIndex belongs to a valid Meeting and TranscriptSegment.
- All derived data remains traceable to its source Meeting and workspace.
- Workspace filtering is applied to every query path, not only top-level lists.
- Deleting or reprocessing data must preserve referential integrity and prevent
  stale indexes/results.

### 7.3 Logical data-flow stages

1. **Anonymous entry:** create/resume/validate workspace; load local settings and
   workspace voice-sample readiness.
2. **Audio submission:** store meeting audio or voice sample and return
   acknowledgement.
3. **Audio processing:** diarization/recognition, STT, timestamps, structured
   transcript, and processing status.
4. **Meeting intelligence:** topic, semantic timeline, summary, and behavior
   analysis; update search index.
5. **Search/playback:** query authorized indexes and processed data, then return
   ranked segments or timestamp-aligned playback.
6. **Diary/history:** record significant actions and return non-expired
   workspace-scoped history.
7. **Expiry cleanup:** mark expired workspaces and remove/invalidate dependent
   objects, indexes, signed access, and retrievable metadata with referential
   integrity.

---

## 8. Business rules

| ID    | Mandatory rule                                                                                                                                                                                                                                    |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| BR-01 | Landing is public; protected operations require a valid anonymous workspace, never an account.                                                                                                                                                    |
| BR-02 | Workspace capabilities must be opaque, high entropy, cookie-protected, non-enumerable, and stored server-side only as a digest/equivalent verifier.                                                                                               |
| BR-03 | Every upload, Diary, search, playback, analysis, sample, job, and cleanup operation is server-scoped to `workspace_id`.                                                                                                                           |
| BR-04 | A workspace can access and operate only on meetings and voice samples scoped to it.                                                                                                                                                               |
| BR-05 | Search/playback data is returned only with valid workspace access to the relevant meeting.                                                                                                                                                        |
| BR-06 | Flow stores no account password, OAuth token, OTP, profile, or avatar; raw workspace capabilities and secrets must never be stored in logs.                                                                                                       |
| BR-07 | Intelligent analysis cannot run before STT completes.                                                                                                                                                                                             |
| BR-08 | Analysis can begin only after audio is successfully archived/stored.                                                                                                                                                                              |
| BR-09 | Meeting status must reflect actual `Pending`, `Processing`, `Completed`, or `Failed` progress.                                                                                                                                                    |
| BR-10 | Every Meeting is associated with exactly one AnonymousWorkspace.                                                                                                                                                                                  |
| BR-11 | Every transcript is associated with a valid Meeting.                                                                                                                                                                                              |
| BR-12 | Referential integrity is mandatory between related entities.                                                                                                                                                                                      |
| BR-13 | Important recognition, separation, STT, and related actions are logged in Diary/history.                                                                                                                                                          |
| BR-14 | The SRS states that all user/meeting/audio/analysis/index data must be “processed synchronously according to system policies”; this conflicts with its asynchronous-processing requirements and must not be implemented literally until resolved. |
| BR-15 | Contextual search/playback operates only on validly indexed data.                                                                                                                                                                                 |
| BR-16 | Expired workspace data must become unreachable and be cleaned according to configurable retention; exact duration is not invented.                                                                                                                |
| BR-17 | Public upload/processing is protected by configurable workspace/network rate limits and quotas; CAPTCHA is conditional, not an unconditional dependency.                                                                                          |
| BR-18 | Clearing/changing the browser cookie or device provides no promise of Diary recovery or cross-device continuity.                                                                                                                                  |

---

## 9. Current scope versus system evolution

The following Chapter V items are future evolution goals, not automatically
approved current-scope work:

- real-time meeting processing;
- advanced speaker identification and adaptation;
- more advanced semantic intelligence;
- collaborative workspace behavior;
- integration with external meeting/content systems;
- intelligent cross-meeting knowledge base;
- cross-meeting analytics;
- AI-assisted decision support;
- evolution of modular architecture/infrastructure;
- long-term data management expansion; and
- continued security/privacy evolution.

New code must preserve extension points where required by `NFR-12`, but must not
ship a future capability merely because it appears in the evolution chapter.

---

## 10. Derived traceability matrix

This mapping is derived from the two sources to support implementation and test
planning. It does not change the original identifiers.

| Story range                      | FR/SF coverage            | Primary UC       | Principal data                                                                                   |
| -------------------------------- | ------------------------- | ---------------- | ------------------------------------------------------------------------------------------------ |
| `US-01`; `US-02`–`US-04` retired | `FR-01`, `FR-03`, `SF-01` | `UC-01`, `UC-02` | AnonymousWorkspace, workspace events                                                             |
| `US-05`                          | `FR-04`                   | `UC-01`, `UC-05` | Workspace-scoped VoiceSample                                                                     |
| `US-06`–`US-07`                  | `FR-05`–`FR-12`, `SF-02`  | `UC-03`          | Meeting, AudioFile, ProcessingJob/Step, Speaker, TranscriptSegment, SemanticSegment, SearchIndex |
| `US-08`–`US-13`                  | `FR-18`, `SF-03`–`SF-07`  | `UC-04`          | Meeting, ProcessingJob, transcript/analysis views, Diary gap                                     |
| `US-14`                          | `FR-13`                   | `UC-03`, `UC-04` | MeetingSummary                                                                                   |
| `US-15`                          | `FR-14`                   | `UC-04`          | TranscriptSegment, Speaker, Meeting                                                              |
| `US-16`                          | `FR-15`                   | `UC-04`          | SearchIndex, TranscriptSegment                                                                   |
| `US-17`                          | `FR-16`                   | `UC-04`          | AudioFile, TranscriptSegment                                                                     |
| `US-18`                          | `FR-11`, `FR-17`          | `UC-04`          | SpeakerStatistic, Speaker, Meeting                                                               |
| `US-19`–`US-23` retired          | Retired                   | —                | No Account/profile/password data                                                                 |
| `US-24`–`US-27`                  | `FR-21`, `SF-11`–`SF-13`  | `UC-05`          | VoiceSample and identified schema gaps                                                           |
| `US-28`–`US-30`; `US-31` retired | `FR-22`, `SF-14`–`SF-15`  | `UC-05`          | Browser-local language/theme                                                                     |

### 10.1 Cross-cutting requirement coverage

- Apply `NFR-02` and `NFR-09` to every protected resource and mutation.
- Apply `NFR-11` to workspace creation/resume/expiry, upload, processing,
  search, analytics, sample changes, abuse controls, and cleanup.
- Apply `NFR-01` to interactive list/detail/search endpoints and processing jobs.
- Apply `NFR-04` to processing, retry, summary, analytics, indexing, playback
  alignment, and local settings persistence.
- Apply `NFR-10` to database records, external audio/sample objects, and recovery
  of processing/history state.
- Apply `NFR-05` and `NFR-12` to module boundaries without prematurely shipping
  Chapter V features.

---

## 11. Requirements Decision Log — unresolved source issues

These are source-level ambiguities or gaps. Do not silently choose values during
implementation.

### RDL-01 — Voice enrollment required versus optional behavior

**Resolved by `CR-ANON-01`.** Registration no longer exists. Voice readiness is
checked in Upload: known-speaker recognition requires usable sample(s); an
unidentified-speaker diarization mode is allowed only when explicitly supported.

### RDL-02 — Meeting-audio format inconsistency

The SRS environment supports WAV, MP3, and M4A, while `US-06` explicitly lists
WAV and MP3 for meeting audio. `US-05` and `US-25` include M4A for voice
samples. Maintain separate configurable allowlists until M4A meeting support is
explicitly decided.

### RDL-03 — Unspecified validation thresholds

The sources do not define concrete values for maximum upload size, minimum or
maximum audio duration, diary/sample-name length, maximum voice-sample count,
workspace retention/idle expiry, quotas, rate limits, CAPTCHA threshold, or
playback synchronization tolerance. These must be configuration/policy values
with boundary tests after approval; do not invent magic numbers.

### RDL-04 — Usability step-count conflict

`NFR-07` says no more than three steps; the usability narrative says three to
five actions. Use the stricter three-step value only as a provisional target and
record how steps are counted until the Product Owner approves a definition.

### RDL-05 — Asynchronous behavior versus BR-14 wording

The SRS requires asynchronous long-running processing and allows users to
navigate away, but `BR-14` says data must be processed “synchronously.” Treat
this as a documentation defect. Preserve asynchronous job execution and request
an explicit correction of BR-14.

### RDL-06 — Voice-sample fields missing from the logical model

`US-24` requires sample name, avatar, identifier, and duration; `US-25` requires
a name/label; `US-26` renames it. The SRS VoiceSample entity has no name or
avatar field. The database/design phase must add or explicitly relocate these
attributes before implementation.

### RDL-07 — Unidentified-speaker relationship

`US-07` allows unidentified speakers with a default label, but the SRS model
describes Speaker as linked to a VoiceSample. `voice_sample_id` must support an
unidentified state or another explicit representation; do not create fake voice
samples.

### RDL-08 — Missing Diary/Activity/Event entity

`FR-18`, `BR-13`, `NFR-11`, and several stories require history and activity
logging, but the SRS entity list does not define a Diary, ActivityLog, or
SystemEvent entity. The data design must resolve whether diary is a Meeting view
and where event-level audit data is stored.

### RDL-11 — Speaker-statistic meaning mismatch

`US-18` requires contribution rate and active multi-speaker discussions;
`FR-17` mentions decisions and discussion climax; the logical entity stores
`lively_discussion` and `number_of_speech`. Define formulas, units, overlap
rules, decision/climax semantics, and accuracy thresholds before coding.

### RDL-12 — Search scope

`US-15` is selected-meeting search. `US-16` allows selected meeting or another
authorized dataset. The SRS long-term goals discuss cross-meeting knowledge.
Current scope may search only meetings in the current workspace and must not
silently enable cross-workspace/global search.

### RDL-13 — Anonymous workspace supporting data

**Superseded by `CR-ANON-01`.** Define capability digest/verification,
creation/last-seen/expiry/deletion timestamps, rotation or invalidation behavior,
scope enforcement, rate-limit/quota keys, and cleanup idempotency. Do not add
account, password, OAuth, OTP, or profile fields.

### RDL-17 — Exact anonymous retention and abuse-control policy

The anonymous model is approved, but exact retention duration, idle expiry,
upload/processing quota, rate-limit window, and CAPTCHA trigger are not. Expose
named configuration values and boundary tests; Product Owner approval is needed
before claiming final policy compliance.

### RDL-14 — Summary and analytics accuracy

The sources require correct main-point summaries and accurate analytics but do
not provide measurable quality thresholds or evaluation data sets. Define
evaluation criteria and human-review expectations before claiming compliance.

### RDL-15 — Diary-name uniqueness

`US-12` requires duplicate prevention only “if uniqueness is required.” Do not
enforce a global or per-workspace unique constraint until the uniqueness scope is
approved.

### RDL-16 — Status/error exposure

`US-13` requires failed-processing error details, but sensitive internal stack,
path, provider, and model information must not be disclosed. Define a safe
user-facing error code/message contract distinct from diagnostic logs.

---

## 12. Mandatory test derivation rules

For each implemented `US`/`FR`:

1. Create at least one positive acceptance test.
2. Create field/file/query validation tests for every stated constraint.
3. Create missing/forged/expired capability, cross-workspace, missing-resource,
   and expired-workspace tests for protected behavior.
4. Create persistence-failure and external-dependency-failure tests.
5. For uploads, test type mismatch, extension spoofing, corruption, boundary
   size/duration, cancellation, retry, duplicate submission, and cleanup.
6. For processing, test every legal state transition and reject illegal ones.
7. For retry, test workspace scope, source existence, prior partial-output cleanup,
   idempotency, and re-index/recompute behavior.
8. For search, test empty/malformed query, no result, ranking, combined filters,
   meeting boundary, workspace boundary, latency, and non-mutation.
9. For playback, test seek alignment, current-segment highlight, missing/corrupt
   audio, workspace scope, tolerance, and non-mutation.
10. For AI outputs, test missing prerequisites, failure reporting, source
    association, read-only behavior, and approved accuracy criteria.
11. For anonymous workspace flows, test capability entropy/opacity, cookie
    attributes, digest storage, forgery, expiry, rotation/invalidation if used,
    rate limits, quotas, conditional CAPTCHA behavior, and log redaction.
12. For settings, test supported/unsupported values, persistence, reload,
    isolation from meeting data, and accessible theme contrast.
13. For logging, assert event type, time, workspace pseudonymous identifier,
    resource/job identifier, outcome, and absence of raw capabilities/secrets.
14. For retention, test expiry visibility, cleanup idempotency, relational/object/
    vector deletion, stale signed access, and browser behavior after cookie loss.
15. For every numeric value from an RDL item, use named configuration and mark
    tests blocked until an approved value exists.

---

## 13. Requirements implementation invariants

1. No account, password, OAuth identity/token, OTP, profile, or avatar is
   required or persisted.
2. Protected resources require a valid anonymous-workspace capability.
3. Every resource query and mutation enforces workspace scope server-side.
4. Accepted meeting audio creates exactly one workspace-scoped meeting/diary and initial
   `Pending` processing state unless an explicit idempotent retry applies.
5. Analysis does not begin until audio storage and STT prerequisites succeed.
6. Status reflects actual processing state.
7. Failed processing does not masquerade as complete or leave active duplicate
   indexes.
8. Transcript, semantic, summary, analytics, index, and playback data remain
   traceable to a valid Meeting and workspace.
9. Unidentified speakers remain explicit and do not receive fabricated identity.
10. Search results include enough meeting/segment/speaker/time context for
    verification.
11. Search and playback do not mutate source transcript/audio data.
12. Generated summary and speaker statistics are read-only in current stories.
13. Reprocessing updates/replaces derived results consistently and prevents
    stale search/analytics data.
14. Voice-sample deletion prevents future recognition use without corrupting
    historical meeting attribution.
15. Local language/theme settings do not modify workspace or meeting data.
16. Voice-sample controls are available in Upload; no separate Profile is
    required.
17. Expired workspaces and dependent data become unreachable and are cleaned
    according to configured retention.
18. Significant workspace, security, processing, query, analytics, cleanup, and
    abuse-control events are auditable without raw capabilities.
19. Cookie loss/device change does not promise recovery or cross-device history.
20. Current scope remains post-meeting processing; Chapter V evolution is not
    silently promoted.

---

## 14. Required output format for future Flow requirements tasks

Every response produced using this prompt must include:

1. **Requirement scope:** exact `US/FR/SF/NFR/UC/BR` identifiers.
2. **Visitor and preconditions:** actor, workspace capability/scope, expiry, and prerequisite
   processing state.
3. **Behavior:** inputs, validation, main flow, alternate flow, exceptions,
   outputs, and postconditions.
4. **State/data impact:** entities and relationships created/read/updated/deleted.
5. **Security impact:** workspace capability validation, scope isolation, confidential data,
   transport/storage, audit, and abuse controls.
6. **Performance/reliability impact:** applicable thresholds and recovery/idempotency.
7. **Acceptance tests:** positive, negative, boundary, workspace-isolation,
   concurrency/asynchronous, dependency-failure, and recovery tests.
8. **Traceability matrix:** requirement → implementation unit → data → test.
9. **Decision-log impact:** relevant `RDL` issues and whether work is blocked.

Never answer with a generic feature summary. Never invent a requirement value to
make the task appear complete. A task is requirements-complete only when every
applicable acceptance obligation, business rule, NFR, invariant, and unresolved
decision has been addressed or explicitly marked not applicable.

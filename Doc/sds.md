# FLOW — SOFTWARE DETAILED DESIGN IMPLEMENTATION AND REVIEW PROMPT

## 0. Purpose and authoritative sources

Use this file as the detailed-design baseline for Flow. It is grounded in:

1. `Flow_SoftwareDesignSpecification_v1.0.pdf` — design methodology,
   paradigms/methods, UI navigation, FR/NFR traceability, and AI workflow.
2. `Flow_DetailedDesign_v2.0.pdf` — component decomposition,
   responsibilities, interfaces/APIs, domain model, class/component relationships,
   and use-case realization diagrams.
3. `Flow_DatabaseAnalysisandDesign_v1.0.pdf` — database domains, schema,
   data dictionary, relationships, and storage allocation.
4. `Flow_DesignSystemandInteractionGovernance_v2.0.pdf` — canonical data
   objects, interaction principles, processing states/user modes, user flow,
   container rules, typography/color/spacing, and form/input behavior.

This prompt converts the approved architecture and requirements into detailed
component, data, interface, and interaction constraints. It must not invent route
paths, fields, validation numbers, colors, libraries, framework code, vector
dimensions, SQL constraints, or algorithms beyond these four sources.

## 1. Mandatory detailed-design working contract

For every design, coding, review, or testing task:

1. Trace `FR/NFR → COM component → interface/API → domain entity/table → UI
object/state → test`.
2. Preserve all component identifiers `COM-01…COM-17` and database entity/table
   names.
3. Keep controller, service, infrastructure, background-job, and AI-processing
   responsibilities separate.
4. Long-running processing is asynchronous; the UI must faithfully reflect the
   backend lifecycle `Pending`, `Processing`, `Completed`, `Failed`.
5. Every transcript/search/analysis interaction remains grounded in a Meeting,
   speaker label, and source timestamps.
6. Apply anonymous-workspace scope to every meeting, audio, transcript, index,
   analytics, job, event, and voice-sample operation. Language/theme are
   browser-local and must not require a backend account.
7. Use only API paths explicitly listed in the Detailed Design. If a required
   operation has no API, record a Detailed Design Decision rather than inventing
   a path.
8. Use only fields explicitly listed in the DAD data dictionary until a schema
   gap is resolved.
9. Treat visual/state rules as design constraints, not optional decoration.
10. Do not encode semantic meaning with color alone.
11. Do not claim “real-time” transport when the Detailed Design specifies polling
    or SSE; transport changes require a decision/update.
12. Never resolve contradictions silently. Record them in the Detailed Design
    Decision Log and identify blocked implementation/tests.

### 1.1 Approved detailed-design change DDL-ANON-01

The account interfaces, tables, navigation, and components inherited from the
four source documents are superseded as follows:

- `COM-02` becomes **Anonymous Workspace Security**;
- `COM-03` becomes **Workspace Voice Samples**; Settings remains frontend-local;
- `TBL_Account` is replaced by `TBL_Anonymous_Workspace`;
- `account_id` ownership keys become non-null `workspace_id` scope keys;
- all account/auth/profile/password/OAuth/OTP/avatar/email endpoints are removed;
- new workspace start/status contracts and workspace-scoped voice-sample
  contracts below are the active API baseline;
- Landing → Start → Upload → Processing → temporary Diary → Detail/Search/
  Playback/Analytics is the canonical navigation;
- exact retention/quota/rate/CAPTCHA numeric values remain configuration
  decisions and must not be invented.

---

## 2. Design methodology, approach, paradigms, and methods

### 2.1 Three design levels

1. **User Interaction:** Landing/Start, Upload with voice samples, processing
   feedback, temporary Diary, search, playback, analytics, and local settings.
2. **System Processing:** collaboration among controllers, domain components,
   background jobs, AI processing, and infrastructure adapters.
3. **Data Transformation:** raw audio → structured transcript → analysis →
   searchable representation.

Each level must remain traceable without mixing UI behavior, business
coordination, and persistence details into one component.

### 2.2 Design paradigms

- **MVC:** controllers handle requests, domain/data models represent business
  information, and structured responses act as the backend view.
- **Pipeline Pattern:** ordered audio and AI transformation stages may be
  extended/replaced without restructuring the entire workflow.
- **Modular Monolith:** domain services remain in explicit internal boundaries,
  with the AI Worker/background execution separated at runtime.

### 2.3 Design methods

- RESTful client/backend communication.
- asynchronous background execution for diarization, STT, and semantic work;
- AI/ML methods for speech, speaker, and language processing;
- relational indexing and vector search for efficient retrieval; and
- modular services with explicit dependencies.

---

## 3. Functional traceability baseline

| FR                                    | Design component                                  | Design artifact/flow                         | Principal data                                                                    |
| ------------------------------------- | ------------------------------------------------- | -------------------------------------------- | --------------------------------------------------------------------------------- |
| FR-01 — Start Anonymous Workspace     | `COM-02` Anonymous Workspace Security             | Landing/Start sequence                       | AnonymousWorkspace                                                                |
| FR-03 — Workspace Lifecycle           | `COM-02` Anonymous Workspace Security             | create/resume/expire/cleanup                 | AnonymousWorkspace                                                                |
| FR-04 — Upload Voice Sample           | `COM-03` Workspace Voice Samples                  | Upload-tab voice readiness                   | VoiceSample                                                                       |
| FR-05 — Upload Meeting Audio          | `COM-04` Upload Management, `COM-08` Orchestrator | Upload sequence, AI-processing communication | Meeting, AudioFile, ProcessingJob                                                 |
| FR-06 — Speech Separation/Recognition | `COM-05` Speech Processing                        | AI-processing flow                           | Speaker, VoiceSample                                                              |
| FR-07 — Speech-to-Text                | `COM-06` Transcription                            | AI-processing flow                           | TranscriptSegment                                                                 |
| FR-08 — Timestamps                    | `COM-07` Timestamping                             | AI-processing flow                           | TranscriptSegment                                                                 |
| FR-09 — Semantic Timeline             | `COM-09` Semantic Analysis                        | AI-processing flow                           | SemanticSegment                                                                   |
| FR-10 — Semantic/Topic Analysis       | `COM-09` Semantic Analysis                        | AI-processing flow                           | SemanticSegment, Meeting topic                                                    |
| FR-11 — Speaker Behavior Analysis     | `COM-11` Speaker Behavior                         | AI-processing flow                           | SpeakerStatistic                                                                  |
| FR-12 — Structured Storage            | `COM-17` Infrastructure Adapter                   | Upload/AI-processing data flow               | Meeting, TranscriptSegment, Speaker, SemanticSegment, MeetingSummary, SearchIndex |
| FR-13 — Conversation Summary          | `COM-10` Summarization                            | Diary detail/AI processing                   | MeetingSummary                                                                    |
| FR-14 — Multi-Dimensional Search      | `COM-12` Search                                   | Diary detail/search flow                     | TranscriptSegment, SpeakerStatistic                                               |
| FR-15 — Semantic Search               | `COM-12` Search                                   | Diary detail/search flow                     | SearchIndex, TranscriptSegment                                                    |
| FR-16 — Contextual Playback           | `COM-13` Playback                                 | Diary detail/playback flow                   | AudioFile, TranscriptSegment                                                      |
| FR-17 — Speaker Statistics            | `COM-11` Speaker Behavior                         | Diary detail/analytics flow                  | SpeakerStatistic                                                                  |
| FR-18 — Temporary Diary Management    | `COM-14` Diary Management                         | workspace/retention-aware Diary flow         | Meeting, ProcessingJob                                                            |
| FR-21 — Voice Sample Management       | `COM-03` Workspace Voice Samples                  | Upload-tab voice-management sequence         | VoiceSample                                                                       |
| FR-22 — Local Settings                | Frontend                                          | language/theme local persistence             | ClientSetting                                                                     |

---

## 4. Detailed component catalog

| ID     | Component                    | Detailed responsibility                                                                                                    |
| ------ | ---------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| COM-01 | Request Handling             | Receive client requests, validate input, and route to application components.                                              |
| COM-02 | Anonymous Workspace Security | Start/resume, protected-cookie capability validation, scope context, expiry, quotas/rate limits, and cleanup coordination. |
| COM-03 | Workspace Voice Samples      | Workspace-scoped list/add/rename/delete/play/readiness inside Upload.                                                      |
| COM-04 | Upload Management            | Meeting-audio validation, upload, storage initiation, and processing handoff.                                              |
| COM-05 | Speech Processing            | Speaker diarization/separation and voice-sample-based recognition.                                                         |
| COM-06 | Transcription                | Convert speech to text.                                                                                                    |
| COM-07 | Timestamping                 | Assign and align transcript segment timestamps.                                                                            |
| COM-08 | Processing Orchestrator      | Coordinate pipeline, job lifecycle, status, and background execution.                                                      |
| COM-09 | Semantic Analysis            | Meaning/topic extraction and semantic segmentation/timeline.                                                               |
| COM-10 | Summarization                | Generate meeting summaries.                                                                                                |
| COM-11 | Speaker Behavior             | Compute speaker interaction/behavior/statistical results.                                                                  |
| COM-12 | Search                       | Keyword, multi-dimensional, and semantic query/retrieval.                                                                  |
| COM-13 | Playback                     | Timestamp-aligned contextual audio playback.                                                                               |
| COM-14 | Diary Management             | Meeting history, list/search/sort/rename/detail behavior.                                                                  |
| COM-15 | Activity Logging             | System/user event logging, monitoring, and auditing.                                                                       |
| COM-16 | Background Job               | Schedule and execute asynchronous work.                                                                                    |
| COM-17 | Infrastructure Adapter       | Communicate with database, storage, Redis/queue, and AI Worker/external systems.                                           |

### 4.1 Component dependency rules

- `COM-01` depends on application contracts, not repositories or AI SDKs.
- Workspace components use `COM-17` for persistence/storage and `COM-15`
  for audit events.
- Meeting Processing uses `COM-16` for asynchronous work and `COM-17` for file/
  data infrastructure.
- Meeting Intelligence consumes valid timestamped transcript output and uses
  background/infrastructure/logging components.
- Search consumes transcript/index/analysis data without mutating it.
- Playback resolves authorized audio plus transcript timestamps.
- Diary composes meeting, job/status, transcript, and analysis data; it does not
  own the AI pipeline.
- No service component directly embeds provider credentials or persistence
  implementation.

---

## 5. Approved interface/API catalog

The following routes are the interface baseline from Detailed Design. Preserve
their method/path semantics until an approved interface change updates the
source plus approved change. Workspace-scope/error envelopes are mandatory even where the
table does not spell them out.

### 5.1 Anonymous Workspace and voice-sample interfaces

| Method | Endpoint                   | Purpose                              | Source request/response contract                                                                                                                        |
| ------ | -------------------------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| POST   | `/workspaces/start`        | Create or resume anonymous workspace | No identity payload. Sets protected cookie; returns `{ workspace_state, expires_at, voice_sample_readiness }` without raw capability or `workspace_id`. |
| GET    | `/workspaces/current`      | Resolve current workspace state      | Protected cookie input; returns active/expired state and readiness only, never the capability digest.                                                   |
| GET    | `/voice-samples`           | List current workspace samples       | Returns non-expired sample metadata/readiness; query is scoped by context.                                                                              |
| POST   | `/voice-samples`           | Create workspace sample              | Multipart `speakerLabel`, `voiceSample`; returns new sample metadata/readiness. No avatar/account fields.                                               |
| PATCH  | `/voice-samples/:id`       | Rename sample                        | Path ID plus `speakerLabel`; audio content and workspace scope are immutable.                                                                           |
| DELETE | `/voice-samples/:id`       | Delete sample                        | Scope-check, confirm at UI, remove future recognition use and dependent object/vector data safely.                                                      |
| GET    | `/voice-samples/:id/audio` | Protected sample playback            | Workspace-scoped streaming/signed-access response; no public object URL.                                                                                |

There is no logout/delete-account endpoint in the approved baseline. An
explicit user-triggered “clear current workspace” operation is not to be
invented; retention cleanup is system-driven until separately approved.

### 5.2 Meeting Processing interfaces

| Method | Endpoint        | Purpose                             | Source contract                                                                      |
| ------ | --------------- | ----------------------------------- | ------------------------------------------------------------------------------------ |
| POST   | `/audio/upload` | Upload audio and initiate pipeline  | Audio file; returns `audio_id`, processing status, and message.                      |
| POST   | `/ai/progress`  | Internal AI progress callback       | `meeting_id`, `stage`, `status`, `message`, `progress`, and related progress fields. |
| GET    | `/meetings`     | Retrieve current workspace meetings | Protected cookie; returns non-expired scoped meeting list.                           |
| PATCH  | `/meetings/:id` | Change meeting title                | Path ID and `title`; returns updated meeting.                                        |

`/ai/progress` is an internal interface. Detailed implementation must define
internal service authentication, replay/idempotency protection, allowed transitions, and
safe error/progress content before exposing it.

### 5.3 Meeting Intelligence interfaces

| Method | Endpoint                | Purpose                                                 | Source contract                                                          |
| ------ | ----------------------- | ------------------------------------------------------- | ------------------------------------------------------------------------ |
| POST   | `/meetings/:id/summary` | Create or retrieve cached meeting summary               | Path ID and `force`; returns `meeting_id`, `title`, `summary`, `cached`. |
| GET    | `/audio/:audio_id`      | Retrieve meeting analysis/topic and transcript segments | Path audio ID; returns topic name and segment list in analysis data.     |

### 5.4 Search and Retrieval interfaces

| Method | Endpoint                        | Purpose                                                            | Source contract                                                                      |
| ------ | ------------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------ |
| GET    | `/meetings/semantic-search`     | Semantic search across current workspace meetings                  | Query `q`, `top_k`, `candidate_limit`; returns scoped meeting/segment IDs and score. |
| GET    | `/meetings/:id/semantic-search` | Semantic search within one meeting                                 | Path ID, query `q`, `threshold`; returns matching segment IDs/results.               |
| GET    | `/audio/:audio_id`              | Retrieve timestamped transcript segments for contextual navigation | Returns `start_time`, `end_time`, `content`, `speaker_label`.                        |

### 5.5 Activity Monitoring interfaces

| Method | Endpoint                  | Purpose                    | Source contract                                                     |
| ------ | ------------------------- | -------------------------- | ------------------------------------------------------------------- |
| GET    | `/audio/:audio_id/status` | Poll processing state      | Returns meeting status, job, processing steps, and processing time. |
| GET    | `/audio/:audio_id/stream` | Receive status through SSE | Event stream containing status and ping events.                     |
| GET    | `/health`                 | Backend health check       | Returns service identity/status such as `backend-node`.             |

### 5.6 Interface design obligations

- Every protected user-facing resource requires a valid workspace and is
  `workspace_id` scoped.
- List/search endpoints enforce workspace scope in the query, not by post-filtering.
- File and callback inputs are validated server-side.
- Status callbacks can only advance through legal job/step transitions.
- Responses use stable DTO contracts; do not expose internal storage URLs,
  provider secrets, stack traces, or model paths.
- Search is read-only.
- `force` summary behavior must be idempotent and must not create duplicate
  summaries.
- Polling and SSE must produce consistent status semantics.
- API paths missing for required behavior are design gaps, not permission to
  invent routes.

---

## 6. Domain and database design

### 6.1 Data domains

1. **Anonymous Workspace:** AnonymousWorkspace and VoiceSample. ClientSetting is
   browser-local.
2. **Meeting and Audio:** Meeting, AudioFile, ProcessingJob, ProcessingStep.
3. **Transcript and Speaker:** TranscriptSegment, Speaker.
4. **Semantic Intelligence:** SemanticSegment, MeetingSummary,
   SpeakerStatistic.
5. **Search and Retrieval:** SearchIndex linked to transcript segments.

### 6.2 Relationship baseline

- One AnonymousWorkspace scopes many VoiceSamples and Meetings.
- One Meeting has one AudioFile in the documented model.
- One Meeting has one ProcessingJob, which has many ordered ProcessingSteps.
- One Meeting has many Speakers and TranscriptSegments.
- One Speaker has many TranscriptSegments.
- One Meeting has one MeetingSummary, many SemanticSegments, and many
  SpeakerStatistics.
- One TranscriptSegment has one SearchIndex record in the documented model.
- All relationships preserve workspace scope and source traceability:
  `AnonymousWorkspace → Meeting → TranscriptSegment → SearchIndex`.

### 6.3 Data dictionary

| Table                              | Column                  | Type               | Nullable  |
| ---------------------------------- | ----------------------- | ------------------ | --------- |
| TBL_Anonymous_Workspace            | `id`                    | uuid               | No        |
|                                    | `capability_digest`     | text/bytes         | No        |
|                                    | `status`                | text               | No        |
|                                    | `created_at`            | timestamp          | No        |
|                                    | `last_seen_at`          | timestamp          | No        |
|                                    | `expires_at`            | timestamp          | No        |
|                                    | `deleted_at`            | timestamp          | Yes       |
| TBL_Voice_Sample                   | `id`                    | uuid               | No        |
|                                    | `workspace_id`          | uuid               | No        |
|                                    | `speaker_label`         | text               | No        |
|                                    | `file_url`              | text               | No        |
|                                    | `duration`              | numeric            | No        |
|                                    | `created_at`            | timestamp          | Yes       |
|                                    | `embedding_vector`      | vector             | No        |
| TBL_Speaker                        | `id`                    | uuid               | No        |
|                                    | `meeting_id`            | uuid               | No        |
|                                    | `voice_sample_id`       | uuid               | No in DAD |
|                                    | `speakers_name`         | text               | No        |
|                                    | `is_identified`         | bool               | No        |
|                                    | `avatar_url`            | text               | Yes       |
| TBL_Meeting                        | `id`                    | uuid               | No        |
|                                    | `workspace_id`          | uuid               | No        |
|                                    | `title`                 | text               | Yes       |
|                                    | `topic`                 | text               | No in DAD |
|                                    | `status`                | text               | No        |
|                                    | `created_at`            | timestamp          | Yes       |
|                                    | `expires_at`            | timestamp          | No        |
| TBL_Audio_File                     | `id`                    | uuid               | No        |
|                                    | `meeting_id`            | uuid               | No        |
|                                    | `file_url`              | text               | No        |
|                                    | `duration`              | numeric            | No        |
|                                    | `file_size`             | int8               | Yes       |
|                                    | `format`                | text               | Yes       |
|                                    | `created_at`            | timestamp          | Yes       |
| TBL_Processing_Job                 | `id`                    | uuid               | No        |
|                                    | `meeting_id`            | uuid               | No        |
|                                    | `status`                | text               | No        |
|                                    | `job_type`              | text               | No        |
|                                    | `progress_percent`      | numeric            | No        |
|                                    | `started_at`            | timestamp          | Yes       |
|                                    | `completed_at`          | timestamp          | Yes       |
|                                    | `created_at`            | text in DAD        | Yes       |
| TBL_Processing_Step                | `id`                    | uuid               | No        |
|                                    | `job_id`                | uuid               | No        |
|                                    | `step_name`             | text               | No        |
|                                    | `step_order`            | int4               | No        |
|                                    | `status`                | text               | No        |
|                                    | `started_at`            | timestamp          | Yes       |
|                                    | `completed_at`          | timestamp          | Yes       |
|                                    | `error_message`         | text               | Yes       |
| TBL_Transcript_Segment             | `id`                    | uuid               | No        |
|                                    | `meeting_id`            | uuid               | No        |
|                                    | `speaker_id`            | uuid               | No        |
|                                    | `content`               | text               | No        |
|                                    | `start_time`            | numeric            | No        |
|                                    | `end_time`              | numeric            | No        |
| ClientSetting (not a server table) | `theme`                 | browser-local enum | No        |
|                                    | `language`              | browser-local enum | No        |
| TBL_Meeting_Summary                | `id`                    | uuid               | No        |
|                                    | `meeting_id`            | uuid               | No        |
|                                    | `summary`               | text               | No        |
|                                    | `created_at`            | timestamp          | Yes       |
| TBL_Semantic_Segment               | `id`                    | uuid               | No        |
|                                    | `meeting_id`            | uuid               | No        |
|                                    | `content`               | text               | No        |
|                                    | `start_time`            | numeric            | No        |
|                                    | `end_time`              | numeric            | No        |
| TBL_Speaker_Statistic              | `id`                    | uuid               | No        |
|                                    | `meeting_id`            | uuid               | No        |
|                                    | `speaker_id`            | uuid               | No        |
|                                    | `lively_discussion`     | int4               | No        |
|                                    | `number_of_speech`      | int4               | No        |
| TBL_Search_Index                   | `id`                    | uuid               | No        |
|                                    | `meeting_id`            | uuid               | No        |
|                                    | `transcript_segment_id` | uuid               | No        |
|                                    | `embedding_vector`      | vector             | No        |
|                                    | `created_at`            | timestamp          | Yes       |

### 6.4 Storage allocation

- Structured and vector data use centralized PostgreSQL with pgvector.
- AudioFile and VoiceSample tables store metadata/references, not binary audio.
- Actual audio is held in external/Supabase Storage as described by DAD.
- TranscriptSegment is the primary unit for playback, search, and analysis.
- ProcessingJob/Step provide lifecycle, progress, debugging, and error tracing.
- SemanticSegment, MeetingSummary, and SpeakerStatistic hold AI-derived results.
- SearchIndex stores transcript-derived embeddings and must remain unique and
  traceable per transcript segment according to the documented logical model.

### 6.5 Persistence design obligations

- Enforce primary/foreign keys and workspace-scope propagation.
- Use transactions for coherent relational changes.
- Validate `start_time ≤ end_time` at domain and persistence boundaries, although
  the DAD does not specify the final SQL constraint.
- Prevent orphaned transcript/index/analysis records.
- Reprocessing must replace or version derived outputs consistently.
- Deleting storage objects must not leave usable metadata/index references.
- Vector dimension and index type/parameters are not defined by these four
  documents; do not invent them.

---

## 7. Design system and interaction governance

### 7.1 Core principles

- **Data-Centric Consistency:** The same domain/canonical object has consistent
  representation and behavior across modules.
- **Pipeline Fidelity:** UI status reflects actual ingestion, transcription,
  indexing, and retrieval state; never imply false progress/completion.
- **Temporal Awareness:** Audio, transcript, search results, and analysis retain
  clear order, duration, and timestamp relationships.
- **Progressive Cognitive Load:** Reveal advanced/secondary information when
  needed rather than overwhelming the primary task.
- **Reusability Over Novelty:** Reuse established components and interaction
  patterns; a new pattern requires a functional/analytical advantage.

### 7.2 Canonical Data Objects (CDOs)

| CDO                 | Entity references                      | UI/interaction scope                                                     |
| ------------------- | -------------------------------------- | ------------------------------------------------------------------------ |
| Anonymous Workspace | `ENT-01`, `ENT-04`                     | Capability state, voice-sample readiness, temporary scope and retention. |
| Audio Record        | `ENT-02`, `ENT-03`, `ENT-07`           | Upload, status, lifecycle, workspace scope, meeting anchor.              |
| Transcript Segment  | `ENT-05`, `ENT-06`                     | Reading, filtering, verification, speaker/time navigation.               |
| Analysis Result     | `ENT-09`, `ENT-10`, `ENT-11`, `ENT-12` | Summary, semantic timeline/search, statistics, highlights.               |
| System Event        | `ENT-07`, `ENT-08`                     | Processing/audit/monitoring/debugging feedback.                          |

CDO obligations:

- Audio Record anchors all transcript, analysis, search, and playback context.
- Transcript Segment always exposes speaker label, start/end time, and content.
- Analysis Result is visibly derived and must not be confused with raw
  transcript evidence.
- System Events are secondary interaction objects but first-class monitoring
  information.

### 7.3 Module-to-CDO interaction

| Module                      | Primary CDO behavior                                                                            |
| --------------------------- | ----------------------------------------------------------------------------------------------- |
| MOD-01 Anonymous Workspace  | Create/resume/validate workspace; scope resources; coordinate quotas, expiry and cleanup.       |
| MOD-02 Meeting Processing   | Store/manage Audio Record, create Transcript Segments, record processing events.                |
| MOD-03 Meeting Intelligence | Consume Transcript Segments, produce Analysis Results, record analysis events.                  |
| MOD-04 Search and Retrieval | Query Audio Record/Transcript/Analysis and record search events.                                |
| MOD-05 Activity Monitoring  | Create/manage System Events and associate them with Workspace/resources without raw capability. |

### 7.4 Processing states and user modes

**Canonical processing states:** `Pending`, `Processing`, `Completed`, `Failed`.
They must reflect actual server state.

**User modes:**

- Passive: observe processing/system output.
- Interactive: find, search, filter, and navigate content.
- Analytical: view metrics, statistics, and summarized insights.
- Review: verify results, play contextual audio, and inspect summary.

Mode transitions must be visible and predictable.

### 7.5 Navigation/user flow

- Landing provides a single primary **Start** action and no account controls.
- Start creates/resumes an anonymous workspace and opens Upload.
- Upload embeds voice-sample readiness and list/add/rename/delete/play controls,
  then accepts/validates meeting audio and leads to processing feedback.
- Diary lists non-expired workspace meetings with metadata/status and supports search,
  sort, rename, refresh, and documented management actions.
- Diary Detail presents transcript, speakers, timeline, keyword/semantic search,
  playback, summary, and analytics.
- Settings is reached directly from navigation and contains only
  Vietnamese/English and light/dark preferences stored locally.
- Profile, Login, Sign Up, Logout, Forgot/Reset Password, avatar, and account
  recovery routes/screens do not exist.

Do not invent URL routes; these sources define pages/flows, not a router map.

### 7.6 Interaction-container rules

- **Primary View:** stable main task context for transcript, search, analytics;
  do not reset unnecessarily.
- **Modal:** short confirmation/decision/bounded edit with clear entry/exit;
  never use for complex multi-step workflows.
- **Drawer/Side Panel:** related detail/control while preserving main context;
  dismissible and non-disruptive.
- **Inline Expansion:** metadata, optional detail, secondary controls through
  progressive disclosure.
- **Persistent/Split Panel:** continuously available search, playback, or status
  with consistent placement/behavior.
- **Toast/Status:** short, non-disruptive, dismissible confirmation, non-critical
  event, or background progress.
- **Empty/Loading:** clearly describe current and expected next state; do not
  label absence/loading as an error.

### 7.7 Typography

- Use a `system-ui` font stack: platform-native fonts such as SF Pro, Segoe UI,
  Roboto, or Ubuntu.
- Semantic roles: screen title, section heading, body, metadata/caption, button
  label, emphasized text.
- Use regular/medium for body, medium/semibold for action/structure, and avoid
  extended all-caps text.
- Documented approximate scale:
  - large screen title: 48–64 pt;
  - primary heading: 40–48 pt;
  - secondary heading: 32–36 pt;
  - body: 14–16 pt;
  - button labels: 20–24 pt;
  - small captions/labels: 12–18 pt.
- Line height: headings 1.3, metadata/captions 1.4, body 1.5.

These unusual broad sizes are source values; do not silently replace them. A
responsive token scale requires a documented design decision.

### 7.8 Color

- Follow approximately 60% neutral background, 30% neutral text/supporting UI,
  and 10% blue/purple accent.
- Semantic success, warning, and error colors retain one meaning across modules.
- Color is never the only signal; pair with text, icon, border, or structure.
- Avoid decorative color in transcript/search/analytical views.
- Do not add or redefine colors without justification.
- No exact color values are specified by these four documents; do not invent hex
  tokens in this prompt.

### 7.9 Spacing, alignment, and layout

Approved spacing scale:

| Value | Use                               |
| ----: | --------------------------------- |
|     4 | Icon-to-text and inline elements  |
|     8 | Related UI elements and form gaps |
|    16 | Component padding and list items  |
|    24 | Section separation                |
|    32 | Major content blocks              |
|    48 | Page-level grouping               |

- Maintain clear reading axes and align related items.
- Use irregular alignment only for a functional reason.
- Apply the same spacing/layout logic across modules.
- Variations must still use the approved scale.

### 7.10 Forms and inputs

- Group by workflow/logical relationship, not decoration.
- Categories: search/query, configuration/control, data entry/metadata.
- Use concise labels and helper text for purpose/constraints.
- Provide timely, local validation, error, confirmation, and success feedback.
- Prevent errors by communicating constraints before/during entry.
- Destructive/irreversible actions are visually distinct and require confirmation.
- Required states: default, focused, disabled, error, and success when applicable.
- State changes use more than color alone.

---

## 8. AI Worker processing and assistant workflow

### 8.1 Data collection

- Receive owned meeting audio and available voice samples.
- Retain stable identifiers and source/storage references.

### 8.2 Audio preprocessing

- Normalize audio format, sample rate, and encoding.
- Apply noise reduction and silence removal before downstream speech work.
- Preserve source-timeline mapping through any transformation/chunking.

### 8.3 Core processing

1. Speaker diarization and speaker identification.
2. Create speaker-associated audio/utterance segments.
3. Speech-to-text transcription.
4. Timestamp alignment against the original audio timeline.
5. Structured TranscriptSegment generation.
6. Topic/semantic processing and semantic timeline creation.
7. Persist structured outputs for later interaction.

Each stage must produce observable ProcessingStep state, failure, and timing.
Downstream stages must not run when a required upstream artifact is invalid.

### 8.4 Storage/output

Persist transcripts, timestamps, speaker segments, semantic structures, and
related meeting/job state in the approved database/storage allocation. Final
outputs become the foundation for diary, search, playback, and analysis.

### 8.5 Assistant/advanced analytics stage

The SDS describes conversation summary, speaker behavior analysis, and semantic
search as advanced capabilities activated through user interaction over stored
structured data rather than mandatory parts of the core transcript-production
workflow. Detailed Design includes a POST summary endpoint with caching/force
behavior. Automatic-versus-on-demand generation must follow the decision in
`DDL-09` below.

---

## 9. Use-case realization obligations

Detailed Design includes active realizations for:

- Start/Resume Anonymous Workspace.
- Workspace Expiry and Retention Cleanup.
- Upload Meeting Audio.
- Diary Management.
- Diary Details.
- Voice Sample Management inside Upload.
- Local Settings.
- AI Processing.

For each realization, implementation documentation must provide:

1. actor/client request;
2. `COM-01` validation/routing;
3. responsible service component;
4. infrastructure/data interaction;
5. activity/log event;
6. success response/state;
7. alternate and failure paths;
8. workspace capability/scope checks; and
9. transaction/idempotency/cleanup behavior.

Sequence diagrams must use the component and API catalogs in this prompt rather
than introducing unnamed “services” or unauthorized endpoints.

---

## 10. Non-functional design traceability

| NFR                               | Detailed design strategy/components                                                                               |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| NFR-01 — Performance              | Asynchronous AI processing; caching/query optimization; `COM-16`, Worker, Backend.                                |
| NFR-02 — Security                 | Protected opaque capability, workspace scoping, HTTPS, rate limits/quotas, protected storage; `COM-02`, `COM-17`. |
| NFR-03 — Scalability              | Modular monolith, isolated Worker, containerized/background execution.                                            |
| NFR-04 — Reliability              | Ordered processing, retry/status tracking, coherent persistence; `COM-08`, `COM-16`.                              |
| NFR-05 — Maintainability          | Clear domain/component separation and modular design.                                                             |
| NFR-06 — Availability             | Keep user-facing Backend separate from long-running Worker failure.                                               |
| NFR-07 — Usability                | Web client, structured navigation, DSIG interaction rules and feedback states.                                    |
| NFR-08 — Compatibility            | Standard browser technologies and REST APIs.                                                                      |
| NFR-09 — Data Compliance/Security | Workspace-scoped access and retention cleanup in service/data layers; protected database/storage.                 |
| NFR-10 — Recoverability           | Persistent database/object storage and reprocessing from retained audio.                                          |
| NFR-11 — Observability            | `COM-14`, `COM-15`, ProcessingJob/Step, status polling/SSE, System Events.                                        |
| NFR-12 — Future Extensibility     | Modular components and replaceable/extendable AI pipeline.                                                        |

---

## 11. Detailed Design Decision Log — unresolved source issues

### DDL-01 — Overloaded `/audio/:audio_id`

Detailed Design uses the same GET route for analysis/topic results and for
timestamped transcript segments. Define one stable response DTO or split the
resources through an approved API revision; do not implement ambiguous
context-dependent response shapes.

### DDL-02 — Meeting/audio identifier consistency

Routes mix `meeting_id`, path `:id`, and `audio_id` for meeting-level operations.
Define aggregate/resource identity rules and mapping. Avoid treating Meeting and
AudioFile IDs as interchangeable.

### DDL-03 — Missing APIs

No explicit interface is listed for keyword/multi-dimensional search, diary
search/sort/refresh/delete/detail, speaker statistics, contextual meeting-audio
streaming, retention administration,
or activity-log persistence. Add routes only through an approved interface
design with FR/COM/data traceability.

### DDL-04 — VoiceSample schema/API mismatch

**Resolved by `DDL-ANON-01`.** VoiceSample uses `speaker_label`; avatar/profile
data is removed. Physical length/character constraints remain configurable.

### DDL-05 — Unidentified speaker nullability

DAD marks `voice_sample_id` non-null, but the domain/UI must represent
unidentified speakers. Make the linkage optional or define another valid model;
never fabricate a VoiceSample.

### DDL-06 — Meeting topic lifecycle

DAD marks `topic` non-null although topic is AI-generated after processing. Define
nullable/provisional state or a valid default distinct from an actual topic.

### DDL-07 — ProcessingJob/Step error and timestamp mismatch

DAD gives `ProcessingJob.created_at` type `text` and does not list a job-level
`error_message`, while requirements/detailed status behavior need timestamps and
job failures. Correct the dictionary through an approved database revision; do
not encode timestamps as arbitrary text.

### DDL-08 — Missing Diary/SystemEvent persistence

Activity Monitoring, DSIG System Event, and diary/audit requirements exist, but
DAD defines no Diary/ActivityLog/SystemEvent table. Decide whether Diary is a
Meeting projection and create an approved event/audit persistence design.

### DDL-09 — Automatic versus on-demand intelligence

SDS places summary/behavior/semantic search in an Assistant stage triggered by
user interaction; Detailed Design includes intelligence components and a summary
POST endpoint with cache/force semantics. Define which artifacts are generated
during core completion, lazily on first request, or explicitly regenerated.

### DDL-10 — Local settings

**Resolved by `DDL-ANON-01`.** Language/theme are browser-local; account
notification settings and `TBL_Setting` are removed. In-app job status remains
server-derived and is not a user notification preference.

### DDL-11 — Status transport

Detailed Design specifies polling and SSE. DSIG requires real/near-real-time
faithful status but does not mandate WebSocket. Use polling/SSE unless an approved
decision replaces them; do not assume Supabase Realtime.

### DDL-12 — Diary deletion inconsistency

DSIG user-flow narrative mentions deleting diary entries, but Detailed Design
does not provide a deletion API and the traceability baseline maps diary
management without a delete sub-function. Treat diary deletion as unresolved,
not implemented by analogy with voice-sample deletion.

### DDL-13 — Typography responsiveness

The documented font ranges are unusually large and no breakpoints/token names
are provided. Preserve semantic hierarchy but require an approved responsive
type-token specification before hard-coding sizes.

### DDL-14 — Missing exact visual tokens

DSIG provides color-distribution/semantic rules but no exact hex colors,
elevations, radii, border widths, breakpoints, or component dimensions. Obtain
approved tokens/Figma values; do not invent a brand palette.

### DDL-15 — Vector design parameters

DAD specifies type `vector` and pgvector but no embedding dimension, distance
metric, index type, index parameters, model/version, or migration strategy.
These must be selected together and versioned before DDL/index code.

### DDL-16 — One-to-one constraints

DAD narrative says one Meeting→AudioFile, Meeting→ProcessingJob,
Meeting→MeetingSummary and TranscriptSegment→SearchIndex, but
the dictionary provides no unique-constraint design. Define uniqueness and
reprocessing/versioning semantics before physical implementation.

### DDL-17 — Processing progress trust boundary

`POST /ai/progress` needs internal service authentication, workspace-scoped
meeting/job lookup,
legal stage/state validation, monotonic progress rules, idempotency, replay
protection, and safe message content.

### DDL-18 — Summary `force` semantics

Define workspace scope, cache identity, concurrency locking, idempotency,
replacement/version behavior, and failure rollback for forced regeneration.

### DDL-19 — Anonymous retention and abuse-control constants

`DDL-ANON-01` approves the mechanisms but not exact capability entropy encoding,
idle/absolute workspace expiry, data-retention duration, quota values,
rate-limit windows, CAPTCHA threshold/provider, or cleanup schedule. Use named
configuration, safe interfaces, and boundary tests; do not invent constants.

---

## 12. Mandatory detailed-design tests

- Component-boundary tests: controllers do not contain domain/persistence logic;
  services use adapters; search remains read-only.
- API contract tests for every approved method/path/request/response.
- Missing/forged/expired capability and cross-workspace tests for every resource path.
- Callback authentication, legal transition, idempotency, and replay tests.
- Database FK, workspace propagation, uniqueness, expiry/cascade/object/vector
  cleanup, and timestamp-order tests.
- Pipeline failure injection at preprocessing, diarization, STT, timestamp,
  semantic, persistence, summary, indexing, and cleanup stages.
- Polling/SSE consistency, reconnect, duplicate-event, ordering, and terminal-
  state tests.
- Transcript/audio seek/highlight synchronization tests.
- Search ranking/filter/scope/no-result/non-mutation tests.
- Summary cache/force/concurrency/failure tests after `DDL-09/18` resolution.
- UI tests for all processing states, user modes, input states, loading, empty,
  toast, modal, drawer, inline, and persistent-panel rules.
- Accessibility tests: contrast, keyboard/focus, labels, errors, disabled state,
  and non-color semantic cues.
- Cross-module CDO consistency tests.
- Backup/reprocessing tests spanning PostgreSQL records and external audio.

---

## 13. Detailed-design implementation invariants

1. No account/auth/profile/password/OAuth/OTP endpoint or table exists.
2. All protected data access requires a valid anonymous workspace and includes
   workspace scope in the repository predicate.
3. AnonymousWorkspace is the isolation/retention root; Meeting is the anchor for
   audio, jobs, transcript, analysis, index, and Diary.
4. Processing status shown in UI equals persisted/server status.
5. Long-running AI work is asynchronous.
6. Illegal job/step transitions are rejected.
7. Transcript segments preserve speaker, content, start/end time, and meeting.
8. Unidentified speakers remain explicit.
9. Search/index records reference valid completed transcript data.
10. Playback/search do not mutate transcript/audio.
11. Analysis is distinguishable from source transcript evidence.
12. Reprocessing does not leave duplicate/stale summary, statistics, semantic
    segments, or search indexes.
13. Voice-sample deletion removes it from future recognition without corrupting
    historical meeting data.
14. Voice-sample management is embedded in Upload; Settings contains only local
    language/theme and no Profile exists.
15. Expiry cleanup is idempotent and invalidates relational, object, vector,
    cache, queue, and signed-access reachability.
16. Activity and processing failures are observable without leaking raw
    capabilities or secrets.
17. Empty/loading/failed states never masquerade as success.
18. Color is not the only semantic indicator.
19. Complex multi-step flows do not run inside modals.
20. External storage references are not treated as public URLs.
21. Physical vector/visual/validation/retention values are not invented when unspecified.

---

## 14. Required output format for future detailed-design tasks

Every response produced using this prompt must include:

1. **Traceability:** exact `FR/NFR/COM`, API, entity/table, CDO, state/mode.
2. **Component design:** responsibility, public contract, dependencies, and
   forbidden responsibilities.
3. **Interface contract:** method/path or declared missing API, request/response,
   validation, errors, workspace capability/scope, idempotency.
4. **Data design:** tables/fields/types/nullability, keys/relationships,
   transaction, indexes/storage, lifecycle/cleanup.
5. **Interaction design:** page/task, container choice, state transitions,
   loading/empty/error/success, temporal behavior, accessibility.
6. **Sequence:** actor → controller → service → job/AI → adapter/storage → event/
   response.
7. **Failure/recovery:** dependency failures, partial results, retry, rollback,
   duplicate prevention, observability.
8. **Tests:** contract, component, persistence, UI/accessibility, integration,
   async/fault, security/workspace isolation/retention.
9. **Decision-log impact:** applicable `DDL` item and whether implementation is
   blocked.

Do not output router code, CSS/Tailwind, SQL migrations, framework-specific
classes, or new endpoints until the relevant missing values/decisions are
approved. Successful detailed design requires consistent component, API, data,
interaction, traceability, and test artifacts—not only a wireframe or class
diagram.

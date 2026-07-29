# FLOW — SOFTWARE ARCHITECTURE DESIGN IMPLEMENTATION AND REVIEW PROMPT

## 0. Purpose and authoritative sources

Use this file as the architecture baseline for Flow. It is grounded in exactly:

1. `Flow_SoftwareArchitecturalDriver_v1.0.pdf` — architectural drivers,
   architecturally significant requirements, domain entities, quality-attribute
   scenarios, and constraints.
2. `Flow_SoftwareArchitectureDesign_v2.0.pdf` — architecture style/pattern,
   C4 views, static/runtime/allocation perspectives, mappings, security
   architecture, evolution path, and trade-offs.

This prompt defines architectural boundaries and responsibilities. It does not
invent database DDL, API endpoints, package trees, concrete framework code,
vector dimensions/index parameters, RLS SQL, model selection, or UI code. Those
belong to detailed design and implementation artifacts.

## 1. Mandatory architecture working contract

For every architecture, coding, review, or testing task:

1. Trace the task from `FR/ASR/NFR/QA` to design decision, static module,
   runtime component, connector, physical allocation, and verification.
2. Preserve the current architecture as a **client-server system with a modular
   monolithic Backend API and a separately deployed AI Worker container**.
3. Preserve high cohesion, low coupling, directional dependencies, and the
   restricted Shared Kernel.
4. Keep long-running AI work outside the synchronous API request thread.
5. Preserve the Backend API as the owner of business orchestration,
   anonymous-workspace scope enforcement, and structured persistence.
6. The AI Worker must not receive database credentials. Its data contribution is
   logical; persistence is mediated by the Backend API/infrastructure boundary.
7. Keep database and object storage external to the single-VM application
   boundary and access them through secure outbound connections.
8. Expose only the Reverse Proxy on HTTPS port 443. Backend, Redis, AI Worker,
   and internal frontend service must not expose public service ports.
9. Do not convert future evolution options—microservices, Kubernetes, multi-VM,
   WAF, read replicas, or managed inference—into current architecture.
10. Do not introduce an implementation artifact unless a detailed-design source
    authorizes it. Record needed decisions instead of guessing.
11. Every architectural change must state affected quality attributes, benefits,
    costs, risks, and required diagram/catalog/mapping updates.
12. Architecture compliance requires evidence from static, runtime, deployment,
    security, and quality-scenario verification—not just code organization.

### 1.1 Approved architecture change ADR-ANON-01

The account/authentication architecture in the two source documents is
superseded by the approved no-account product model. The active architecture is:

- public Landing and browser-local language/theme settings;
- an **Anonymous Workspace Module** replacing Identity and Account;
- opaque, high-entropy workspace capability issued in an `HttpOnly`, `Secure`,
  `SameSite` cookie and stored server-side only as a digest/equivalent verifier;
- `workspace_id` as the tenant/isolation key for Meeting, VoiceSample,
  ProcessingJob and every derived resource;
- server-side scope enforcement on every direct and nested resource operation,
  with RLS as defense in depth where supported;
- configurable workspace retention plus idempotent cleanup across relational
  data, object storage, vector indexes, caches, queues, and signed access;
- workspace/network rate limits, upload/processing quotas, and conditional
  CAPTCHA for abuse rather than account authentication;
- no email/password, OAuth, JWT user identity, password reset/OTP, email service,
  Profile, avatar, logout, or server-persisted account settings;
- workspace voice samples remain protected and are managed inside Upload.

This decision removes authentication technologies but does not remove the
Backend, Worker, queue, PostgreSQL/pgvector, object storage, HTTPS, reverse
proxy, observability, or data-isolation controls.

---

## 2. Architectural context and drivers

### 2.1 Structural driver

Flow separates browser-based presentation from centralized business logic,
processing, and data management through client-server architecture.

The Backend API uses a modular-monolithic structure so that domain capabilities
share one deployable backend codebase while maintaining explicit internal
boundaries. This choice balances:

- maintainability and extensibility;
- high cohesion and low coupling;
- simple deployment and operations;
- reduced distributed-system complexity; and
- future service extraction when scale justifies it.

### 2.2 Processing driver

Speech enhancement/separation, diarization, speaker recognition, STT,
timestamping, topic modeling, summarization, semantic timeline, embeddings, and
behavior analysis are computationally intensive.

Therefore:

- the API accepts/validates requests and orchestrates jobs;
- an asynchronous queue/dispatch mechanism separates request handling from AI
  execution;
- an isolated AI Worker container executes heavy pipeline work;
- worker failures must not crash the Backend API; and
- workers can be scaled independently in the evolution path.

### 2.3 Deployment driver

Flow uses Railway PaaS containerized deployment (Southeast Asia / Singapore Region) to provide repeatable environments, portability, runtime isolation, and manageable operations. The physical allocation uses Railway Cloud PaaS for frontend static serve and FastAPI backend container services, paired with external managed cloud services (Supabase PostgreSQL + pgvector and Supabase Storage).

### 2.4 Integration driver

External database and object-storage services influence trust
boundaries, credentials, protocols, adapters, and failure handling. External
dependencies must be isolated behind infrastructure adapters and secure
connectors.

### 2.5 Security driver

Meeting content is sensitive. Architecture must enforce anonymous-workspace
capability validation and scope isolation, encrypted transport, protected credentials/secrets,
network segmentation, restricted storage access, logging, rate limiting, and
controlled trust boundaries.

### 2.6 Business constraints

- **Limited budget:** Prefer cost-effective managed services and a modular
  monolith over an operationally expensive distributed architecture.
- **Tight timeline:** Favor feasible, simple, maintainable implementation and
  deployment.
- **Small team:** Use one clear codebase with explicit domain boundaries and
  manageable operational complexity.

### 2.7 Technical constraints

- Persistent structured data uses a managed cloud PostgreSQL service.
- Large audio objects are held in external object storage; the application keeps
  references rather than storing binaries in the application server.
- AI processing is resource-intensive and must remain isolated from the API.
- Frontend, Backend API, Redis, and AI Worker run in containerized boundaries.

---

## 3. Architectural domain entities

| ID     | Entity             | Architectural role and dependency impact                                                                                                                  |
| ------ | ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ENT-01 | AnonymousWorkspace | Temporary isolation root; validates an opaque capability and carries lifecycle/retention state without personal identity.                                 |
| ENT-02 | Meeting            | Aggregate/root for uploaded audio, processing lifecycle, transcript, and analytical results. Depends on AnonymousWorkspace, AudioFile, and ProcessingJob. |
| ENT-03 | AudioFile          | Raw meeting input; drives object-storage integration, performance, and asynchronous processing.                                                           |
| ENT-04 | VoiceSample        | Workspace-scoped speaker-reference audio/embedding; links a speaker label and recognition and depends on storage/processing.                              |
| ENT-05 | TranscriptSegment  | Timestamped, speaker-attributed content; foundation for navigation, search, indexing, and analysis.                                                       |
| ENT-06 | Speaker            | Meeting-context speaker, optionally linked to a VoiceSample; bridges transcript, identity, and analytics.                                                 |
| ENT-07 | ProcessingJob      | Asynchronous processing lifecycle and status; depends on Meeting and the background-processing mechanism.                                                 |
| ENT-08 | ProcessingStep     | Ordered/fine-grained job stage; enables progress, observability, and debugging.                                                                           |
| ENT-09 | SemanticSegment    | Meaningful segment derived from transcript data; enables semantic timeline and contextual navigation.                                                     |
| ENT-10 | MeetingSummary     | Derived meeting summary; depends on transcript data.                                                                                                      |
| ENT-11 | SpeakerStatistic   | Meeting/speaker behavior metrics; enables analytics and visualization.                                                                                    |
| ENT-12 | SearchIndex        | Transcript-derived embeddings for semantic retrieval; depends on TranscriptSegment/vector storage.                                                        |
| ENT-13 | ClientSetting      | Browser-local language/theme configuration; no server ownership dependency.                                                                               |

Architectural invariants:

- `ENT-01 AnonymousWorkspace` is the isolation/retention root; `ENT-02 Meeting`
  is the central processing aggregate for
  meeting-derived resources.
- All derived artifacts remain traceable to valid source entities.
- `ENT-07/ENT-08` make asynchronous work and failure observable.
- `ENT-12` never exists independently of a workspace-scoped meeting/transcript.
- An unidentified `ENT-06 Speaker` must be representable without fabricating a
  known voice identity.

---

## 4. Functional modules and architecturally significant requirements

### 4.1 Functional-module mapping

| Module                        | Entities and functions                                                                                                                             |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| MOD-01 — Anonymous Workspace  | `ENT-01`, `ENT-04`; `FR-01`, `FR-03`, `FR-04`, `FR-21`; capability lifecycle, scope, quotas, retention, and cleanup. `ENT-13` remains client-side. |
| MOD-02 — Meeting Processing   | `ENT-02`, `ENT-03`, `ENT-04`, `ENT-05`, `ENT-06`, `ENT-07`; `FR-05`, `FR-06`, `FR-07`, `FR-08`, `FR-12`.                                           |
| MOD-03 — Meeting Intelligence | `ENT-05`, `ENT-06`, `ENT-09`, `ENT-10`, `ENT-11`; `FR-09`, `FR-10`, `FR-11`, `FR-13`.                                                              |
| MOD-04 — Search and Retrieval | `ENT-03`, `ENT-05`, `ENT-11`, `ENT-12`; `FR-14`, `FR-15`, `FR-16`, `FR-17`.                                                                        |
| MOD-05 — Activity Monitoring  | `ENT-02`, `ENT-07`; `FR-18`.                                                                                                                       |

### 4.2 Architecturally significant requirements (ASRs)

| FR                                                 | Architectural impact                                                                                            |
| -------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| FR-01/FR-03 — Anonymous Workspace                  | Capability issuance/validation, scope isolation, retention, abuse controls, and workspace-scoped voice samples. |
| FR-05 — Upload Meeting Audio                       | External object storage and initiation of asynchronous processing.                                              |
| FR-06 — Speech Separation and Recognition          | Dedicated background-worker isolation for heavy computation.                                                    |
| FR-07 — Speech-to-Text                             | Staged worker processing pipeline.                                                                              |
| FR-08 — Assign Timestamps                          | Transcript/time-aligned data structures.                                                                        |
| FR-09 — Semantic Timeline                          | Semantic layer over transcript segments and Meeting Intelligence decomposition.                                 |
| FR-10 — Semantic Analysis and Topic Identification | Separation of NLP work from transcription and impact on indexing.                                               |
| FR-11 — Speaker Behavior Analysis                  | Speaker-level aggregation, persistence, and analytics processing.                                               |
| FR-12 — Structured Conversation Data Storage       | Persistent model and modular data boundaries.                                                                   |
| FR-13 — Conversation Summary                       | Summarization integration in the AI/meeting-intelligence pipeline.                                              |
| FR-15 — Semantic Conversational Search             | Vector-indexing and retrieval architecture.                                                                     |
| FR-16 — Contextual Conversation Playback           | Tight traceability between timestamps and protected audio retrieval.                                            |

These requirements are significant because they introduce heavy compute,
multi-stage processing, persistent-model constraints, external integration,
cross-module coordination, or data-lifecycle consequences.

---

## 5. Quality-attribute scenarios and verification obligations

### 5.1 NFR-to-QA decomposition

| SRS NFR                           | Architectural QA scenarios                                                                                  |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| NFR-01 — Performance              | `QA-01` Processing Latency; `QA-02` Concurrent Throughput                                                   |
| NFR-02 — Security                 | `QA-03` Workspace Capability Validation; `QA-04` Data Confidentiality; `QA-05` Capability/Secret Protection |
| NFR-03 — Scalability              | `QA-06` Horizontal Expansion Capability; `QA-07` Independent Worker Scaling                                 |
| NFR-04 — Reliability              | `QA-08` Processing Integrity; `QA-09` Fault Isolation                                                       |
| NFR-05 — Maintainability          | `QA-10` Modular Modifiability; `QA-11` Codebase Clarity                                                     |
| NFR-06 — Availability             | `QA-12` Operational Uptime; `QA-13` Service Uptime                                                          |
| NFR-07 — Usability                | `QA-14` Task Efficiency; `QA-15` Interface Clarity                                                          |
| NFR-08 — Compatibility            | `QA-16` Cross-Browser Support                                                                               |
| NFR-09 — Data Compliance/Security | `QA-17` Workspace Scope Enforcement                                                                         |
| NFR-10 — Recoverability           | `QA-18` Backup and Restoration                                                                              |
| NFR-11 — Observability            | `QA-19` Monitoring and Logging                                                                              |
| NFR-12 — Future Extensibility     | `QA-20` Analytical Module Expansion                                                                         |

### 5.2 QA catalog

| ID    | Attribute                        | Architectural response and measurable outcome                                                                                                                                                 |
| ----- | -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| QA-01 | Processing Latency               | For audio up to 60 minutes under normal load, store input, dispatch asynchronously, keep API responsive, and finish within 2× audio duration; upload acknowledgement remains under 2 seconds. |
| QA-02 | Concurrent Throughput            | Independently validate, quota, and queue simultaneous workspace uploads; distribute them to workers; keep API stable and eventually execute all accepted tasks without overload loss/failure. |
| QA-03 | Workspace Capability Validation  | Middleware resolves a valid opaque cookie to active workspace scope before protected modules; missing/forged/expired capabilities reveal no prior data.                                       |
| QA-04 | Data Confidentiality             | Before returning meeting/transcript/analysis data, validate `workspace_id`; reject cross-workspace access.                                                                                    |
| QA-05 | Capability and Secret Protection | Store only capability digests/equivalent verifiers, require secure cookie attributes, and never log raw capabilities, storage credentials, or secrets.                                        |
| QA-06 | Horizontal Expansion Capability  | Add AI Worker containers without modifying the API; queue consumers pick up work; throughput should increase as worker capacity is added, subject to infrastructure limits.                   |
| QA-07 | Independent Worker Scaling       | Scale AI workers separately while keeping user-facing API response stable; avoid queue/distribution bottlenecks.                                                                              |
| QA-08 | Processing Integrity             | Execute ordered pipeline stages and commit final transcript/analysis only after complete success; prevent partial/corrupt final data.                                                         |
| QA-09 | Fault Isolation                  | Worker crash does not interrupt Backend API or access to prior results; log failure and mark task failed.                                                                                     |
| QA-10 | Modular Modifiability            | Change semantic/topic analysis inside Meeting Intelligence without altering unrelated workspace/upload/search modules.                                                                        |
| QA-11 | Codebase Clarity                 | Clear module boundaries, restricted Shared Kernel, documentation, and explicit interfaces let developers locate relevant code without understanding unrelated modules.                        |
| QA-12 | Operational Uptime               | Core services continue while background jobs execute/fail; maintain at least 95% uptime under normal operation.                                                                               |
| QA-13 | Service Uptime                   | Detect and log service interruption with time, task IDs, and errors so operators can diagnose and restore service efficiently.                                                                |
| QA-14 | Task Efficiency                  | Upload and initiate processing in three interaction steps or fewer while clearly displaying asynchronous status.                                                                              |
| QA-15 | Interface Clarity                | Organize transcript with speaker labels, timestamps, semantic segments, timeline navigation, and related playback so users can locate content without confusion.                              |
| QA-16 | Cross-Browser Support            | Anonymous start/resume, upload, transcript viewing, and search operate consistently on Chrome, Edge, and Safari using browser-independent backend APIs.                                       |
| QA-17 | Workspace Scope Enforcement      | Middleware and data access validate workspace scope for audio, samples, transcript, analysis, search, playback, and cleanup resources.                                                        |
| QA-18 | Backup and Restoration           | Restore database and object resources from the latest valid backup with minimal data loss and downtime; exact RPO/RTO remain undefined.                                                       |
| QA-19 | Monitoring and Logging           | Record significant workspace actions, processing tasks, cleanup/abuse events, and errors with timestamps, pseudonymous workspace IDs, and task IDs without raw capabilities.                  |
| QA-20 | Analytical Module Expansion      | Add an AI analysis capability to Meeting Intelligence/worker pipeline with minimal structural change and no regression to existing functions.                                                 |

### 5.3 Scenario-driven architecture tests

- `QA-01`: test 60-minute boundary, `<2s` upload acknowledgement, and `≤2×`
  completion under defined normal load.
- `QA-02`: test concurrent acceptance, queue durability, eventual execution,
  fairness, backpressure, and no accepted-job loss.
- `QA-03`–`QA-05` and `QA-17`: test missing, invalid, expired, forged, and
  cross-workspace capabilities; verify capability/secret/log redaction.
- `QA-06`–`QA-07`: compare throughput and API latency before/after adding worker
  capacity; identify database/storage/queue bottlenecks.
- `QA-08`: inject failure at each pipeline step and confirm no partial final
  commit; preserve diagnostic/intermediate handling according to policy.
- `QA-09`: terminate a worker and verify API health, prior-result access, failed
  job state, and logged evidence.
- `QA-10`–`QA-11` and `QA-20`: dependency tests, architecture-boundary rules,
  module-level regression tests, and an extension proof for a new analysis step.
- `QA-12`–`QA-13`: service health/availability measurement, interruption
  detection, alert/log evidence, and restoration exercise.
- `QA-14`–`QA-16`: user-flow step count, content readability/navigation, and
  cross-browser core-feature suites.
- `QA-18`: backup restore drill covering structured database state and external
  object references; report measured RPO/RTO without inventing targets.
- `QA-19`: trace an upload/job/failure across request, user, meeting, job, worker,
  and persistence events.

---

## 6. Architectural decisions

| Decision                           | Rationale                                                                                                 | Principal quality drivers                             |
| ---------------------------------- | --------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| Client-server architecture         | Separate browser interaction from centralized processing/business logic.                                  | `NFR-05`, `NFR-07`, `QA-14`–`QA-16`                   |
| Modular-monolithic Backend API     | High cohesion, simple deployment, reduced distributed complexity, and future extraction.                  | `NFR-05`, `NFR-12`, `QA-10`, `QA-11`, `QA-20`         |
| Domain-driven module boundaries    | Organize around business domains and control dependencies.                                                | `QA-10`, `QA-11`, `QA-20`                             |
| Isolated AI Worker container       | Prevent heavy AI work from blocking/failing the API.                                                      | `NFR-01`, `NFR-03`, `QA-01`, `QA-02`, `QA-06`–`QA-09` |
| Asynchronous background processing | Fast acknowledgement, concurrent handling, job lifecycle, and failure isolation.                          | `QA-01`, `QA-02`, `QA-08`, `QA-09`, `QA-12`           |
| PostgreSQL with pgvector           | Unified structured persistence and semantic retrieval.                                                    | `NFR-01`, `FR-12`, `FR-15`                            |
| External object storage            | Keep large audio outside application filesystem and enable protected retrieval.                           | `FR-05`, `FR-16`, `QA-04`, `QA-18`                    |
| Containerized deployment           | Repeatable environments, isolation, portability, and recovery.                                            | `NFR-06`, `NFR-10`, `QA-06`, `QA-09`, `QA-12`         |
| Anonymous workspace isolation      | Protect meeting content without accounts through capability validation, scope, expiry and abuse controls. | `NFR-02`, `NFR-09`, `QA-03`–`QA-05`, `QA-17`          |
| Centralized history/monitoring     | Operational traceability and diagnosis.                                                                   | `NFR-11`, `QA-13`, `QA-19`                            |

Any proposal that reverses one of these decisions requires an Architecture
Decision Record containing driver changes, alternatives, migration, risks, and
updated views/mappings.

---

## 7. Architecture style, patterns, and dependency rules

### 7.1 Topology style

- Browser-based Single Page Application is the primary client.
- Client calls the Backend API using secure REST over HTTPS.
- Backend API is one modular-monolithic server application.
- AI Worker is a distinct runtime/deployment container for heavy work.
- Database and object storage are external managed dependencies.

### 7.2 Backend layered pattern

1. **Presentation:** REST controllers, routing, request validation.
2. **Application:** use-case coordination and cross-module orchestration.
3. **Domain:** business rules, entities, domain services.
4. **Infrastructure:** repositories, database/storage/cache/queue/workspace-security/AI
   adapters.

Dependency direction must point inward toward domain/application abstractions.
Domain modules do not import vendor SDKs, transport code, container concerns, or
external-service credentials.

### 7.3 MVC interpretation

- Controller receives and validates HTTP requests and delegates use cases.
- Model is the domain data/business representation.
- View is the structured response, typically JSON, returned to the separate
  frontend.

MVC is a presentation/request organization inside the backend; it does not make
the separate SPA part of the backend monolith.

### 7.4 Asynchronous processing model

1. Backend validates workspace scope/input/quota and creates meeting/audio/job metadata.
2. Backend securely stores or references the source audio.
3. Backend dispatches a job through an internal asynchronous mechanism.
4. Worker retrieves authorized audio through an infrastructure-mediated path.
5. Worker performs ordered diarization, STT, timestamps, semantic/topic work and
   other configured processing stages.
6. Results return through an approved worker/backend contract.
7. Backend persists structured results and advances lifecycle state.
8. Client polls/subscribes through the Backend-facing status contract.

The API must not wait for end-to-end AI completion.

---

## 8. C4 architecture views

### 8.1 Level 1 — System context

Model Flow as one Meeting Content Digitization Platform within its environment:

- primary person: Meeting Participant/Assistant using a web browser;
- optional CAPTCHA/abuse-verification provider only when configured;
- external managed data/database service;
- external object-storage service; and
- HTTPS interaction across the public boundary.

Level 1 shows scope and external dependencies only. Do not expose internal
modules/classes in the context view.

### 8.2 Level 2 — Containers

The logical container view contains:

- Frontend React application;
- Backend API modular monolith;
- isolated AI Worker;
- Redis cache/broker infrastructure;
- PostgreSQL + pgvector logical data service; and
- Object Store.

Level 2 shows runtime boundaries, persistence responsibilities, and REST/async/
data connectors. Although PostgreSQL and Object Store are logical containers in
this view, the Allocation view physically places them outside the VM as managed
services.

The Worker’s apparent data contribution is logical. It must not bypass the
Backend API to obtain database credentials or directly own structured
persistence.

### 8.3 Level 3 — Components

The Backend API is decomposed by domain. Each module normally contains:

- controller/interface boundary;
- application services;
- domain logic/entities; and
- infrastructure abstractions/adapters.

Detailed Level 3 component definitions belong to the Detailed Design document;
SAD must preserve the domain/module boundary, not invent endpoint/class code.

### 8.4 Level 4 — Code

Classes, DTOs, repositories, interfaces, aggregates, and implementation details
are delegated to Detailed Design. They are not authorized merely by this SAD
prompt.

---

## 9. Static module perspective

### 9.1 Modules and responsibilities

#### Anonymous Workspace Module

- create/resume/validate opaque workspace capabilities;
- map protected cookie capability to active `workspace_id` without personal
  identity;
- enforce lifecycle, idle/absolute expiry, quota, and rate-limit policies;
- coordinate idempotent retention cleanup; and
- expose workspace-scoped voice-sample contracts to Upload.

#### Meeting Processing Module

- audio-upload orchestration;
- meeting lifecycle;
- transcript-creation/storage coordination;
- worker interaction for speech processing; and
- timestamp/speaker alignment.

#### Meeting Intelligence Module

- meeting summary;
- topic modeling and keyword extraction;
- speaker analytics; and
- transcript-derived insight generation.

#### Search and Retrieval Module

- keyword search;
- semantic search over transcript embeddings;
- query processing/ranking; and
- result aggregation/formatting.

#### Activity Monitoring Module

- workspace activity;
- audit logging;
- meeting-access history; and
- monitoring/traceability.

#### Shared Kernel

Only genuinely shared, stable concepts:

- domain identifiers such as WorkspaceId and MeetingId;
- shared domain events;
- common error definitions;
- cross-module data contracts; and
- shared policies/constants.

The Shared Kernel must not become a dumping ground for module-specific business
logic, repositories, vendor adapters, or mutable global utilities.

### 9.2 Static relationship rules

- Anonymous Workspace and Meeting Processing use shared workspace/meeting primitives.
- Meeting Intelligence consumes completed/valid transcript contracts from
  Meeting Processing.
- Search/Retrieval receives transcript/metadata contracts for indexing/querying.
- Activity Monitoring consumes events from all modules without creating reverse
  domain dependencies.
- All modules depend directionally on the Shared Kernel; the Shared Kernel does
  not depend on them.
- Cross-module calls occur through explicit application contracts/events; no
  circular imports or direct access to another module’s private persistence.

### 9.3 Detailed Meeting Processing decomposition

| Internal element        | Responsibilities                                                                             |
| ----------------------- | -------------------------------------------------------------------------------------------- |
| Meeting Management      | Create/manage Meeting; metadata; lifecycle; workspace-scope validation.                      |
| Audio Handling          | Validate upload format; store via Object Storage; retain file reference; trigger processing. |
| Processing Orchestrator | Coordinate async workflow; dispatch; monitor; retry/failure; lifecycle transitions.          |
| Transcript Management   | Persist segments; speaker alignment; timestamped data; transcript consistency.               |
| Infrastructure Adapter  | Communicate with Worker and Object Storage while shielding domain logic.                     |

Required collaboration:

1. Meeting Management invokes Audio Handling during creation/upload.
2. Audio Handling initiates Processing Orchestrator only after successful
   validation/storage.
3. Orchestrator calls Infrastructure Adapter for external dispatch.
4. Orchestrator updates Transcript Management after valid successful results.
5. Infrastructure Adapter mediates Worker and Object Storage communication.

Meeting state transitions are controlled by the orchestrator:
`Pending → Processing → Completed | Failed`, with explicit retry behavior.

---

## 10. Runtime Component-and-Connector perspective

### 10.1 Level 1 runtime elements

| Runtime element | Responsibility                                                                                                                 |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Web Client      | User interaction, upload, status, transcript, search, analytics, playback.                                                     |
| Backend API     | HTTP handling, validation, workspace capability/scope enforcement, use-case orchestration, persistence mediation.              |
| AI Worker       | Speech separation/recognition, STT, timestamp/AI pipeline execution.                                                           |
| Redis           | Private transient capability cache, rate-limit/quota counter and/or queue/broker support after an explicit mechanism decision. |
| Database        | Persistent structured workspace/meeting/analysis/index metadata.                                                               |
| Object Storage  | Raw audio and file/artifact objects.                                                                                           |

### 10.2 Level 1 connectors

| Connector                  | Semantics                                                                         |
| -------------------------- | --------------------------------------------------------------------------------- |
| Client → Backend           | Synchronous HTTPS/REST request-response.                                          |
| Backend → AI Worker        | Asynchronous job submission; no public worker endpoint.                           |
| Backend → Database         | Secure structured persistence/query.                                              |
| Backend → Object Storage   | Secure audio/file storage and retrieval.                                          |
| AI Worker → Object Storage | Controlled retrieval of source audio and artifact exchange as authorized.         |
| Backend → Redis            | Private capability/rate-limit/quota cache and approved queue/broker operations.   |
| AI Worker → Redis          | Only the approved private queue/broker/cache contract; no unrelated cache access. |

### 10.3 Level 2 Backend runtime components

- REST Controller Layer.
- Anonymous Workspace Component.
- Meeting Processing Component.
- Meeting Intelligence Component.
- Search and Retrieval Component.
- Activity Monitoring Component.
- Background Job Manager.
- Infrastructure Adapter.

Connectors include in-process invocation, asynchronous submission, persistence
request, query request, history persistence, and external dispatch.

Required runtime relationships:

- Controller → domain/application components: in-process use-case invocation.
- Meeting Processing → Background Job Manager: submit async work.
- Background Job Manager → Infrastructure Adapter: dispatch external work.
- Meeting Intelligence → Infrastructure Adapter: request persistence of analysis.
- Search/Retrieval → Infrastructure Adapter: execute authorized queries.
- Activity Monitoring → Infrastructure Adapter: persist audit/history events.
- Infrastructure Adapter → external systems: translate protocols and protect
  credentials.

No domain component directly imports or calls external provider clients.

---

## 11. Allocation perspective and network topology

### 11.1 Current physical allocation

**Single application VM:**

- Host Firewall.
- Reverse Proxy container.
- Frontend/static application container.
- Backend API container.
- Redis container.
- AI Worker container.
- private Docker bridge network(s).

**External managed infrastructure:**

- Supabase-managed PostgreSQL/pgvector database.
- external Object Storage service.

### 11.2 Exposure and segmentation rules

1. Internet traffic reaches only the Host Firewall and Reverse Proxy on HTTPS
   port 443.
2. Reverse Proxy terminates TLS and routes internally to frontend/backend.
3. Frontend, Backend, Redis, and Worker expose no direct public host ports.
4. Backend communicates with Redis and Worker only across the private Docker
   network.
5. Only Backend holds outbound database credentials and connects to Supabase
   through TLS.
6. Backend accesses Object Storage through HTTPS and bucket-scoped credentials.
7. Worker accesses only the minimum Object Storage/job interfaces required for
   processing and has no database credentials.
8. Database/storage do not initiate inbound TCP connections to the VM.

### 11.3 Allocation responsibilities

| Physical element       | Responsibility                                                              |
| ---------------------- | --------------------------------------------------------------------------- |
| Host Firewall          | Restrict inbound/outbound network traffic.                                  |
| Reverse Proxy          | TLS termination, request routing, public rate/size/timeout controls.        |
| Frontend container     | Serve the browser application.                                              |
| Backend container      | Business logic, workspace isolation, orchestration, structured persistence. |
| Redis container        | Private transient cache and approved queue/broker role.                     |
| AI Worker container    | Isolated AI pipeline execution.                                             |
| Supabase cloud service | Managed structured/vector persistence.                                      |
| Object Storage         | Persistent audio/file objects.                                              |

---

## 12. Cross-perspective mappings

### 12.1 Static module → runtime component

| Static module        | Runtime realization                                      | Communication                                   |
| -------------------- | -------------------------------------------------------- | ----------------------------------------------- |
| Anonymous Workspace  | Anonymous Workspace Component inside Backend             | In-process                                      |
| Meeting Processing   | Meeting Processing Component plus Background Job Manager | In-process + asynchronous dispatch              |
| Meeting Intelligence | Meeting Intelligence Component                           | In-process; worker/persistence through adapters |
| Search and Retrieval | Search and Retrieval Component                           | In-process; query through adapter               |
| Activity Monitoring  | Activity Monitoring Component                            | In-process/event-driven persistence             |
| Shared Kernel        | Shared domain primitives/contracts                       | Compile-time/in-process dependency only         |

### 12.2 Runtime component → physical allocation

| Runtime component      | Physical deployment                                                                    |
| ---------------------- | -------------------------------------------------------------------------------------- |
| Web Client application | Frontend static build served via Railway Nixpacks (`npx serve`) and executed in browser |
| Backend API            | Backend API container on Railway PaaS (Southeast Asia / Singapore Region)              |
| AI Core / Worker       | Integrated background pipelines & Google Cloud Gemini 3.5 Flash / Embedding API         |
| Database               | Managed Supabase PostgreSQL cloud service with pgvector (3072 dims)                   |
| Object Storage         | Managed Supabase Storage cloud service                                                 |

### 12.3 Mapping compliance rule

Every new component must appear consistently in:

1. its owning static module;
2. runtime component/connector view;
3. physical allocation and trust boundary;
4. security/credential model;
5. relevant quality scenarios; and
6. evolution/current-scope classification.

If any perspective is missing, the architecture change is incomplete.

---

## 13. Security architecture

### 13.1 Principles

- **Least privilege:** Backend gets scoped database schemas/operations; Worker
  gets no database credentials; buckets and secrets are narrowly scoped.
- **Network segmentation:** public Reverse Proxy only; private application
  containers; outbound-only managed-service access.
- **Separation of concerns:** Backend owns workspace scope/business rules; Reverse
  Proxy owns transport controls; managed services provide storage-layer controls.
- **Externalized persistent infrastructure:** database and object storage remain
  outside the VM to reduce local persistence/attack surface.

### 13.2 Trust boundaries

1. **Internet → Reverse Proxy:** TLS termination, firewall, rate limiting, size
   limits, and timeout policies mitigate unauthorized access, brute force, DoS.
2. **Reverse Proxy → Frontend/Backend:** private Docker routing; no public backend
   ports; mitigate misconfiguration/container compromise.
3. **Backend → Database/Object Storage:** outbound TLS/HTTPS; protect credentials
   and validate server identity.
4. **Browser → Workspace boundary:** protected cookie is resolved only by the
   Backend; raw capability never enters URLs, application logs, or JavaScript.

### 13.3 Anonymous workspace capability architecture

- `POST /workspaces/start` (final path governed by SDS) creates/resumes a
  workspace and sets an opaque high-entropy cookie.
- Persist only a cryptographic digest/equivalent verifier of the capability;
  never persist or log the raw value.
- Cookie must be `HttpOnly`, `Secure`, and `SameSite`; scope `Path`/`Domain` and
  CSRF strategy must be explicitly configured.
- Middleware resolves the capability to an active, non-expired workspace before
  protected use cases and passes `WorkspaceContext` inward.
- Repositories include `workspace_id` in the query/update/delete predicate; do
  not fetch globally and post-filter.
- Invalid/expired capability returns safe behavior and cannot distinguish or
  enumerate prior workspaces.
- Redis may support rate limits, quota counters, or capability cache, but the
  persistent lifecycle remains authoritative in the database.
- No user JWT, refresh token, password hash, OAuth verification, or logout
  revocation flow exists.

### 13.4 Data protection

- HTTPS at the Reverse Proxy; require TLS 1.2 or newer.
- TLS for Supabase PostgreSQL connection.
- HTTPS for Object Storage APIs.
- Managed encryption at rest for database and object storage.
- Raw workspace capabilities are not persisted or logged in plaintext.
- Audio/file access is workspace-scoped and storage credentials are not exposed
  to the browser or Worker beyond approved scoped access.

### 13.5 Secret/configuration management

Sensitive values include database connection, object-storage credentials,
capability hashing/pepper material if used, TLS certificate, and proxy configuration.

- inject via runtime environment/configuration;
- exclude `.env`/secret files from version control;
- never hard-code secrets;
- restrict container access; and
- rotate/revoke through an approved operational process.

### 13.6 API protection

**Reverse Proxy:** IP rate limits, upload-size cap, connection/request timeouts.

**Application:** request/body validation, actual file-type/audio validation,
malformed-payload rejection, workspace validation/scope enforcement, quota/rate
limits, conditional CAPTCHA verification, and safe error
responses.

### 13.7 Threats and mitigations

| Threat                             | Required controls                                                                                                       |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Database/object data leakage       | No public database port, outbound TLS, scoped storage paths, workspace enforcement and RLS where applicable.            |
| Upload/AI denial of service        | Rate/size limits, async queue, worker isolation, backpressure.                                                          |
| Container lateral movement         | Private networks, non-privileged containers, minimal credentials, no Worker DB credentials.                             |
| Secret exposure                    | Runtime injection, repository exclusion, rotation, no secrets in logs/source.                                           |
| Forged/stolen workspace capability | High entropy, protected cookie, digest verification, expiry, scope checks, optional rotation/invalidation, no raw logs. |
| Anonymous abuse/cost exhaustion    | Workspace/network rate limits, quotas, file validation, queue backpressure, conditional CAPTCHA, cleanup.               |

---

## 14. Current architecture, evolution path, and trade-offs

### 14.1 Current architecture

- one VM for application containers;
- one Backend modular-monolith container;
- one or more isolated Worker instances within current capacity;
- Redis private service;
- external database and object storage;
- reverse-proxy public entry point; and
- no built-in high-availability cluster or orchestration platform.

### 14.2 Approved evolution options, not current commitments

- vertical VM scaling;
- multiple Backend/Worker containers behind load balancing;
- Meeting Processing/Intelligence extraction into microservices;
- separate Backend/Worker VMs;
- Kubernetes/container orchestration;
- managed container or AI-inference services;
- database read replicas and partitioning;
- specialized search service;
- object-storage lifecycle/CDN behavior;
- WAF, refresh-token rotation, and centralized logging stack.

### 14.3 Trade-offs

Current architecture prioritizes simplicity, maintainability, development speed,
and clear module boundaries.

Accepted current trade-offs:

- single VM limits high availability;
- modular monolith limits independent deployment granularity;
- horizontal scaling is an evolution capability, not fully built in; and
- external managed services reduce operational burden but introduce dependency
  and outbound-connectivity risk.

---

## 15. Architecture Decision Log — source ambiguities requiring resolution

### ADL-01 — Redis responsibility

SAD describes Redis as a cache and shows it on the private
worker path, while the driver requires a task queue without selecting a final
mechanism. Decide whether Redis is cache only, queue broker, result backend, or a
carefully bounded combination. Document durability, retry, visibility timeout,
dead-letter, and failure behavior before implementation.

### ADL-02 — Worker result-return contract

Worker contributes processing results but has no DB credentials and structured
persistence belongs to Backend. Define the concrete secure result/callback/object
contract, authentication, idempotency, size limits, retries, and partial-failure
handling in Detailed Design.

### ADL-03 — Logical versus physical database container

C4 Level 2 lists PostgreSQL/pgvector as a container; Allocation places Supabase
outside the VM. Diagrams must label it as a logical external data service to
avoid implying a local database container.

### ADL-04 — Frontend/browser allocation

The Frontend container serves application assets, while execution occurs in the
user browser. Architecture diagrams must not imply that browser-side state or
rendering executes inside the VM container.

### ADL-13 — Anonymous retention and abuse parameters

The anonymous architecture is approved, but exact capability entropy encoding,
idle/absolute expiry, data-retention duration, quotas, rate-limit windows,
CAPTCHA threshold, and cleanup schedule require named configuration and explicit
approval. Architecture must expose these seams without inventing constants.

### ADL-06 — Queue throughput/backpressure targets

`QA-02`, `QA-06`, and `QA-07` require stable concurrent execution and scaling,
but queue depth, wait-time, retry, fairness, saturation, and proportional-scaling
thresholds are undefined. Do not claim scalability until they are measured
against approved workload profiles.

### ADL-07 — Backup RPO/RTO

`QA-18` requires minimal loss/downtime but provides no RPO, RTO, schedule,
retention, cross-service consistency, or restore-order target. Define these for
database plus object storage before recovery compliance is claimed.

### ADL-08 — Availability limitations

`QA-12` requires 95% uptime, but the current single VM is a single failure
domain. Document the measurement window, exclusions, monitoring source, and
whether the current deployment can actually meet the target.

### ADL-09 — AI pipeline commit semantics

`QA-08` requires final results committed only after full success. Define
transaction boundaries across database and object storage, intermediate-result
retention, compensating cleanup, reprocessing, and index replacement.

### ADL-10 — Shared Kernel governance

The sources restrict Shared Kernel but do not define an ownership/review process.
Require explicit architectural review for additions and prohibit provider,
repository, or module-specific logic.

### ADL-11 — Internal connector authentication

Private networking alone is insufficient to trust Worker/Backend messages.
Detailed Design must define job authenticity, replay protection, service
identity, and least-privilege object access without contradicting the no-DB-
credential rule.

### ADL-12 — Current worker multiplicity

The current single-VM diagrams commonly show one Worker, while quality scenarios
describe adding instances. Treat multiple workers as a supported scaling tactic
only after queue semantics and host resource limits are defined; do not describe
current deployment as automatically horizontally scalable.

---

## 16. Architecture compliance checklist

An architecture/code change is compliant only when all applicable checks pass:

- Driver/ASR/QA identifiers are cited.
- Static ownership is assigned to exactly one domain module.
- Shared Kernel use is minimal and directionally safe.
- Runtime component and connector are explicit.
- Long-running work is asynchronous and API non-blocking.
- Worker failure is isolated and observable.
- Persistence remains Backend-mediated; Worker has no DB credentials.
- Physical placement and public/private ports are documented.
- Trust boundary, workspace capability/scope, encryption, rate limits/quotas,
  retention cleanup, and logs are addressed.
- External dependency failure and retry/idempotency are addressed.
- Static→runtime→physical mappings are updated.
- C4 abstraction levels remain clean.
- Current architecture is separated from future evolution.
- Relevant quality scenario has an executable verification plan.
- Trade-offs and decision-log impacts are explicit.

---

## 17. Required output format for future architecture tasks

Every response produced with this prompt must include:

1. **Architecture scope:** affected ASRs, QAs, NFRs, entities, and modules.
2. **Decision:** proposed architecture/change and why.
3. **Alternatives and trade-offs:** at least the credible alternatives relevant
   to the driver.
4. **Static view:** module ownership, public contract, dependencies, Shared
   Kernel impact.
5. **Runtime view:** components, connectors, sync/async semantics, state/failure.
6. **Allocation view:** containers/nodes, network exposure, external services,
   credentials.
7. **Security view:** trust boundaries, workspace capability validation/scope,
   encryption, secrets, abuse controls, logging.
8. **Data/persistence impact:** workspace scope/retention, transaction/commit, object storage,
   indexing, backup/recovery.
9. **Quality verification:** scenarios, workload/fault injection, measurable
   outcomes, and evidence.
10. **Evolution classification:** current implementation or future option.
11. **Decision-log impact:** affected `ADL` items and unresolved blockers.
12. **Required documentation updates:** C4, module catalog, C&C, allocation,
    mapping, threat model, ADR, and tests.

Do not return framework code, SQL schema, endpoint definitions, or package trees
unless the user also provides/authorizes the corresponding Detailed Design. Do
not claim architectural compliance from a single diagram or successful build.

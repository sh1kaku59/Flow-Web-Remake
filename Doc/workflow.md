# FLOW — CLAUDE OPUS DEVELOPMENT, TESTING, AND IDE DEMO WORKFLOW

## 0. Purpose

This file is the mandatory operating procedure for Claude Opus when working on
Flow in Antigravity IDE. It governs how the agent reads project documentation,
interprets requirements, plans, organizes source code, implements frontend,
backend, worker, and data changes, tests them, debugs failures, runs an IDE demo,
and reports evidence to the user.

This workflow is not a replacement for project requirements/design. Its job is
to ensure those documents are consistently applied.

## 1. Non-negotiable rules

1. Read every Markdown file in `Doc/` before the first implementation task.
2. At minimum, read in this order:
   1. `Doc/workflow.md`;
   2. `Doc/conops.md`;
   3. `Doc/srs.md`;
   4. `Doc/sad.md`;
   5. `Doc/sds.md`.
3. Do not rely on a previous chat summary as a substitute for reading the files.
4. Re-read the affected sections before every new feature, bug fix, refactor,
   migration, or test task.
5. After context truncation, agent restart, model switch, or long interruption,
   repeat the Documentation Gate before continuing.
6. Treat the current user request as the task scope, but never silently violate
   approved requirements or architecture. If it conflicts, explain and request a
   decision.
7. Never invent requirement values, API paths, database fields, design tokens,
   algorithms, or infrastructure behavior to make a task appear complete.
8. Do not modify `Doc/` source-of-truth prompts unless the user explicitly asks
   for documentation changes.
9. Inspect the existing code, scripts, lockfiles, configuration, and tests before
   choosing commands or introducing dependencies.
10. Preserve user changes and unrelated code. Do not rewrite broad areas merely
    to implement a small task.
11. Never report a command, test, browser flow, demo, build, or migration as
    successful unless it was actually executed and its result observed.
12. Stop and ask before destructive database/storage operations, irreversible
    migration, production deployment, secret rotation, or material scope change.
13. Enforce the approved anonymous baseline in all five Docs: no account,
    Login/Sign Up/Logout/Profile/password/OAuth/OTP/avatar/email flow; use a
    protected Anonymous Workspace, workspace-scoped data, temporary Diary,
    voice samples inside Upload, and browser-local language/theme.
14. Treat exact workspace retention, expiry, quotas, rate limits, CAPTCHA
    threshold, and cleanup schedule as named configuration decisions until
    approved; never fabricate values.

---

## 2. Documentation Gate — mandatory before coding

### 2.1 Build a task-specific context index

After reading `Doc/`, create an internal task index containing:

- operational scope and out-of-scope constraints from ConOps;
- exact `US`, `FR`, `SF`, `NFR`, `UC`, and `BR` identifiers from SRS;
- relevant `ASR`, `QA`, `ENT`, `MOD`, architectural view, connector, allocation,
  and security constraints from SAD;
- relevant `COM`, API, table/entity, CDO, processing state, user mode,
  interaction rule, and DDL decision from SDS;
- acceptance criteria and measurable thresholds;
- unresolved `RDL`, `ADL`, and `DDL` decisions;
- affected frontend/backend/worker/database/test areas.

Do not create a fake “permanent memory.” The reliable persistence mechanism is
the documentation itself. Re-open the documents when memory is uncertain.

### 2.2 Source precedence and conflict handling

Use this order when interpreting project material:

1. Explicit, current user decision that acknowledges any conflict.
2. Approved requirements and acceptance criteria in `srs.md`.
3. Operational scope and principles in `conops.md`.
4. Architecture boundaries and quality scenarios in `sad.md`.
5. Detailed component/API/data/UI constraints in `sds.md`.
6. This workflow for execution procedure and repository organization.

Lower-level design must realize, not override, higher-level requirements. When
two documents disagree:

1. cite both statements;
2. identify affected code/tests/data;
3. check the relevant decision log;
4. choose no hidden assumption;
5. ask for approval if the choice changes behavior or data; and
6. record the approved choice in the task report and relevant documentation when
   authorized.

### 2.3 Required traceability header

Before editing code, state or internally prepare:

```text
Task:
User outcome:
In scope:
Out of scope:
Requirements: US-__, FR-__, SF-__, NFR-__, UC-__, BR-__
Architecture: ASR/QA/ENT/MOD/view/connector/allocation
Detailed design: COM-__, API, table/entity, CDO, state/mode
Acceptance criteria:
Affected modules/files:
Tests required:
Decision-log blockers:
```

If traceability cannot be completed, implementation is not ready.

---

## 3. End-to-end execution workflow

### Phase 0 — Repository and environment reconnaissance

1. Read all repository instructions and `Doc/` files.
2. Inspect repository root, branch/status, changed/untracked files, lockfiles,
   package manifests, Python project files, environment examples, containers,
   migrations, and test configuration.
3. Identify actual start/build/test commands from scripts; do not guess.
4. Identify required services: frontend, Backend API, Worker, Redis/queue,
   PostgreSQL/pgvector, object storage or local test substitute.
5. Verify secrets are supplied through environment variables. Never print or
   commit secret values.
6. Record pre-existing failures before making changes.

**Gate 0 exit:** environment understood, user work preserved, commands known.

### Phase 1 — Requirements and design analysis

1. Translate the user request into observable behavior.
2. Map every behavior to identifiers and source sections.
3. Enumerate preconditions, happy path, alternate flows, exceptions, workspace
   capability/scope, state transitions, persistence, retention, abuse controls,
   logging, and recovery.
4. Identify missing API/schema/token/policy decisions.
5. Define acceptance criteria and test cases before implementation.
6. If materially ambiguous, stop and request a decision.

**Gate 1 exit:** task is traceable, testable, and not blocked by an unresolved
decision.

### Phase 2 — Design and implementation plan

Prepare a small vertical-slice plan:

1. domain/data contract;
2. backend use case and workspace-scope enforcement;
3. persistence/adapter behavior;
4. async Worker/job behavior when applicable;
5. API contract;
6. frontend CDO/state/interaction;
7. observability/error behavior;
8. tests from unit to system demo.

For risky changes, explicitly describe rollback and data migration strategy.

**Gate 2 exit:** each step names files/modules, tests, and expected evidence.

### Phase 3 — Implementation

1. Implement the smallest coherent vertical slice.
2. Keep controllers/routes thin.
3. Place business rules in application/domain code, not UI or repositories.
4. Keep vendor/database/storage/queue code behind adapters.
5. Validate input at boundaries and enforce workspace scope server-side.
6. Keep AI processing asynchronous and lifecycle-driven.
7. Use typed contracts and stable DTOs.
8. Add structured, redacted logs and error mapping.
9. Add/update tests with the code, not after all coding ends.
10. Avoid unrelated refactors and dependency upgrades.

**Gate 3 exit:** implementation compiles/type-checks and targeted tests exist.

### Phase 4 — Static and automated verification

Run the repository’s real commands in this order where applicable:

1. format check;
2. lint;
3. type check/static analysis;
4. frontend/backend unit tests;
5. component/service tests;
6. API contract tests;
7. database migration/schema tests;
8. integration tests with dependencies;
9. Worker/queue tests;
10. security/workspace-isolation/retention tests;
11. frontend production build;
12. end-to-end/system tests;
13. performance/fault/recovery tests required by the task.

Fix root causes, add a regression test, and rerun both the failed layer and the
relevant broader suite.

**Gate 4 exit:** required automated suites pass or remaining blockers are
explicitly evidenced.

### Phase 5 — Antigravity IDE demo

1. Start dependencies using the repository’s documented mechanism.
2. Apply migrations to a disposable/local test database.
3. Seed deterministic, non-sensitive test data.
4. Start Backend API and verify health.
5. Start Worker and verify queue consumption.
6. Start frontend and open it in the IDE/browser preview.
7. Execute the applicable end-to-end demo scenarios in Section 11.
8. Observe browser console, network requests, Backend logs, Worker logs,
   database state, and job/status events.
9. Capture exact expected versus actual behavior and failures.
10. Clean up temporary data/processes without deleting user data.

**Gate 5 exit:** the implemented behavior has been observed through the running
system, not only through isolated tests.

### Phase 6 — Debug loop

For every failure:

1. reproduce consistently;
2. record the exact error and environment;
3. trace it to requirement, component, request/job, data, and logs;
4. minimize to the smallest failing case;
5. identify the root cause rather than masking the symptom;
6. implement the smallest safe fix;
7. add a regression test;
8. rerun targeted tests;
9. rerun affected integration/E2E flow;
10. update the demo result and debug log.

Do not weaken assertions, disable validation, swallow exceptions, skip tests, or
hard-code demo data merely to obtain a green result.

### Phase 7 — Review and delivery report

Review the final diff for:

- requirement coverage;
- module/dependency correctness;
- security, workspace isolation, retention, and abuse controls;
- async state/idempotency;
- data integrity/migration safety;
- UI state/accessibility/design-system compliance;
- logging without secrets;
- test adequacy and non-flakiness;
- dead code/debug code/generated artifacts; and
- documentation impact.

Then provide the report format in Section 12.

---

## 4. Canonical overall repository structure

Preferred project structure when frontend and backend are maintained together:

```text
flow/
├── Doc/
│   ├── workflow.md
│   ├── conops.md
│   ├── srs.md
│   ├── sad.md
│   └── sds.md
├── frontend/
├── backend/
├── infra/
├── scripts/
├── tests/
│   └── system/
├── test-results/                 # generated; normally gitignored
├── .env.example                  # names only, never secrets
├── .gitignore
├── README.md
└── compose.yaml                  # only when approved/used
```

If frontend and backend remain separate repositories, keep the same internal
`frontend/` and `backend/` structures described below and place the five `Doc/`
files in each working repository or provide a single authoritative linked Doc
location. Never allow copies to drift silently.

`node_modules`, build output, coverage, local databases, uploads, model caches,
and test artifacts must not be committed.

---

## 5. Frontend source structure

### 5.1 Target structure

Use a pragmatic feature-first structure compatible with the current project:

```text
frontend/
├── public/
│   ├── icons/
│   └── flow-logo.svg
├── src/
│   ├── app/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   ├── providers/
│   │   ├── routing/
│   │   ├── config/
│   │   └── styles/
│   ├── entities/
│   │   ├── anonymous-workspace/
│   │   ├── audio-record/
│   │   ├── transcript-segment/
│   │   ├── analysis-result/
│   │   └── system-event/
│   ├── features/
│   │   ├── workspace-entry/
│   │   ├── upload/
│   │   │   └── voice-samples/          # embedded subfeature; no standalone route
│   │   ├── diary-list/
│   │   ├── diary-detail/
│   │   ├── semantic-search/
│   │   ├── contextual-playback/
│   │   ├── speaker-analytics/
│   │   └── settings/
│   ├── widgets/
│   │   ├── app-shell/
│   │   ├── meeting-workspace/
│   │   ├── transcript-player/
│   │   └── processing-status/
│   ├── shared/
│   │   ├── api/
│   │   ├── ui/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── types/
│   │   ├── constants/
│   │   ├── i18n/
│   │   ├── assets/
│   │   └── test/
│   ├── index.css
│   └── vite-env.d.ts
├── tests/
│   ├── e2e/
│   ├── visual/
│   ├── accessibility/
│   ├── fixtures/
│   └── mocks/
├── package.json
├── package-lock.json
├── tsconfig.json
├── vite.config.*
└── README.md
```

### 5.2 Mapping from the current screenshot

| Current folder/file           | Target location                                                                                                                                        |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `src/auth`                    | Remove after routing/import/tests confirm no remaining account flow; replace entry behavior with `src/features/workspace-entry`                        |
| `src/upload`                  | `src/features/upload`                                                                                                                                  |
| `src/diary-list`              | `src/features/diary-list`                                                                                                                              |
| `src/diary-detail`            | `src/features/diary-detail`                                                                                                                            |
| `src/profile`                 | Remove Profile UI; move reusable language/theme behavior to `src/features/settings` and voice-sample behavior to `src/features/upload`/`voice-samples` |
| `src/shared`                  | Split carefully into `shared`, `entities`, and reusable `widgets`                                                                                      |
| `src/App.tsx`, `src/main.tsx` | `src/app/` when imports/configuration are updated safely                                                                                               |
| `src/index.css`               | Keep global entry or move to `src/app/styles` with one stable import                                                                                   |

Do not perform a large folder migration during an unrelated feature. Migrate one
feature at a time with import/type/build/tests passing after each move.

### 5.3 Feature folder template

```text
feature-name/
├── api/                           # calls and DTO mapping for this feature
├── components/                    # feature-specific UI
├── hooks/
├── pages/                         # route-level composition when applicable
├── schemas/                       # runtime validation schemas
├── state/                         # local feature state only
├── types/
├── utils/
├── __tests__/
└── index.ts                       # explicit public API
```

### 5.4 Frontend dependency rules

- `app` may compose features/widgets/entities/shared.
- `features` may depend on entities and shared; avoid direct cross-feature
  imports. Coordinate through app/widget contracts when needed.
- `entities` model canonical data objects and may depend only on shared.
- `widgets` compose features/entities but do not own business rules.
- `shared` never imports from app/features/entities/widgets.
- API transport DTOs are mapped to domain/UI models; do not spread raw response
  shapes throughout components.
- UI components do not enforce server workspace isolation.
- Processing status comes from the server and uses only canonical states.
- Keep page containers stable, use modals only for bounded actions, and follow
  the spacing/color/type/input rules in `sds.md`.

---

## 6. Backend and Worker source structure

### 6.1 Target modular-monolith structure

The backend may use Python/FastAPI only when confirmed by project configuration
and the approved Flow technology choice. Organize by domain module, not by one
global controllers/services/models folder.

```text
backend/
├── app/
│   ├── bootstrap/
│   │   ├── config/
│   │   ├── dependency_injection/
│   │   └── lifecycle/
│   ├── api/
│   │   ├── main.py
│   │   ├── middleware/
│   │   ├── exception_handlers/
│   │   └── health/
│   ├── modules/
│   │   ├── anonymous_workspace/
│   │   ├── meeting_processing/
│   │   ├── meeting_intelligence/
│   │   ├── search_retrieval/
│   │   └── activity_monitoring/
│   ├── shared_kernel/
│   │   ├── ids/
│   │   ├── events/
│   │   ├── errors/
│   │   ├── contracts/
│   │   └── policies/
│   ├── infrastructure/
│   │   ├── database/
│   │   ├── object_storage/
│   │   ├── cache/
│   │   ├── queue/
│   │   ├── workspace_security/
│   │   ├── abuse_control/
│   │   ├── retention_cleanup/
│   │   └── observability/
│   └── worker/
│       ├── main.py
│       ├── tasks/
│       ├── pipelines/
│       │   ├── preprocessing/
│       │   ├── diarization/
│       │   ├── transcription/
│       │   ├── timestamping/
│       │   ├── semantic_analysis/
│       │   └── output/
│       └── contracts/
├── migrations/
├── tests/
│   ├── unit/
│   ├── integration/
│   ├── contract/
│   ├── architecture/
│   ├── security/
│   ├── worker/
│   ├── e2e/
│   ├── fixtures/
│   └── factories/
├── scripts/
├── pyproject.toml
├── Dockerfile.api
├── Dockerfile.worker
├── .env.example
└── README.md
```

### 6.2 Internal template for each domain module

```text
module-name/
├── presentation/
│   ├── controllers/
│   ├── request_schemas/
│   └── response_schemas/
├── application/
│   ├── use_cases/
│   ├── commands/
│   ├── queries/
│   ├── dto/
│   └── ports/
├── domain/
│   ├── entities/
│   ├── value_objects/
│   ├── services/
│   ├── events/
│   └── exceptions/
├── infrastructure/
│   ├── repositories/
│   ├── persistence_models/
│   └── adapters/
└── __init__.py
```

Use only directories that contain real responsibilities. Do not create empty
ceremonial layers.

### 6.3 Backend dependency rules

- Presentation depends on application contracts.
- Application coordinates domain and abstract ports.
- Domain is framework/vendor/database independent.
- Infrastructure implements ports and depends inward, never the reverse.
- Module-private persistence/models are not imported directly by other modules.
- Cross-module collaboration uses explicit application contracts or domain
  events.
- Shared Kernel contains only stable IDs, events, errors, contracts, and policies.
- Worker executes approved pipeline contracts and has no database credentials.
- Backend mediates structured persistence and legal lifecycle transitions.
- Object storage, Redis/queue, CAPTCHA provider when configured, and database clients stay behind
  adapters.

### 6.4 API and asynchronous-job standards

- Preserve API methods/paths in `sds.md`; new paths require approved design.
- Resolve a valid anonymous workspace before protected business execution and
  include `workspace_id` in every data-return/mutation predicate.
- Use stable request/response/error DTOs.
- Never expose storage provider URLs, secrets, stack traces, or internal paths.
- Use idempotency for retryable upload/job/callback/summary operations.
- Job messages carry identifiers/references, not oversized sensitive payloads.
- Validate worker callback/service identity, meeting/job workspace scope, legal state,
  progress monotonicity, and replay/idempotency.
- Define retry/backoff/dead-letter behavior; never retry permanent validation or
  workspace-scope errors as transient failures.
- Use UTC timestamps and explicit status enums.
- Do not acknowledge a job as accepted unless durable handoff succeeds.

### 6.5 Database and migration standards

- Use migrations for every physical-schema change.
- One migration has one coherent purpose and a tested downgrade/rollback plan
  where supported.
- Never edit an already-applied shared migration to change history.
- Enforce primary keys, foreign keys, workspace propagation, expiry, and approved uniqueness.
- Keep binary audio outside relational tables; store protected references.
- Use transactions for coherent relational updates.
- Plan cross-resource compensation for database plus object-storage changes.
- Never invent vector dimension/index parameters; resolve `DDL` decisions first.
- Seed scripts use synthetic/non-sensitive data and are idempotent.
- Migration tests run on an empty database and an upgrade fixture.

---

## 7. Infrastructure and generated-artifact structure

```text
infra/
├── compose/
├── reverse-proxy/
├── database/
├── monitoring/
└── env/

scripts/
├── dev/
├── test/
├── seed/
└── maintenance/

test-results/                       # gitignored generated evidence
├── frontend/
├── backend/
├── integration/
├── e2e/
├── performance/
└── demo/
```

- Commit configuration templates, not secrets.
- Keep development/test/prod configuration separate.
- Do not expose Backend, Worker, or Redis publicly.
- Local test infrastructure must resemble required connectors without using
  production data.
- Generated screenshots, traces, videos, coverage, logs, and reports belong in
  `test-results/` and normally remain uncommitted unless the user requests them.

---

## 8. Naming, code quality, and change rules

### 8.1 Naming

**Frontend:**

- feature folders: `kebab-case`;
- React components/pages: `PascalCase.tsx`;
- hooks: `useSomething.ts`;
- utilities: `camelCase.ts` or established project convention;
- tests: `*.test.ts`, `*.test.tsx`, or established runner convention;
- constants: descriptive names, not unexplained literals.

**Backend:**

- packages/files/functions: `snake_case`;
- classes/entities/value objects: `PascalCase`;
- database tables/columns: `snake_case` and approved DAD names;
- tests: `test_*.py` or project runner convention;
- commands/events: explicit past/present intent such as
  `StartMeetingProcessing`, `MeetingProcessingCompleted`.

Do not rename approved API paths, entities, statuses, or identifiers merely for
style consistency.

### 8.2 General quality rules

- Prefer clear, small units with one responsibility.
- Remove duplication only when the abstraction is stable and truly shared.
- Use configuration for approved environment/policy values; no magic numbers.
- Validate at boundaries and keep invariants in domain/application code.
- Use explicit error categories: validation, workspace missing/expired,
  cross-workspace/not-found, conflict, rate/quota exceeded, dependency
  unavailable, processing failed, internal error.
- Log pseudonymous identifiers and outcomes, not raw workspace capabilities,
  credentials/tokens, raw secrets, or
  unnecessary meeting content.
- Avoid broad exception swallowing and boolean success-only APIs.
- Comments explain why/constraints, not obvious syntax.
- Do not leave disabled tests, `TODO` placeholders presented as complete,
  console debug logs, or temporary bypasses.
- Dependency additions require justification, compatibility review, and lockfile
  update through the project package manager.

### 8.3 Safe change boundaries

- Run `git status`/diff before and after changes.
- Preserve unrelated changes.
- Do not modify generated/vendor files manually.
- Do not commit `.env`, credentials, uploads, model weights, local databases,
  logs, `node_modules`, build output, or OS metadata such as `desktop.ini`.
- Do not make mass formatting changes with a functional patch unless explicitly
  authorized.
- Schema/API contract changes require frontend/backend/test coordination.

---

## 9. Frontend UI/UX verification matrix

### 9.1 Automated frontend checks

Run the commands defined by the repository for:

- dependency integrity/install using the committed lockfile;
- formatting/linting;
- TypeScript type checking;
- unit tests for hooks, mappings, state, validation, and utilities;
- component tests for UI states and interactions;
- production build;
- API mock/contract tests;
- E2E tests;
- accessibility tests; and
- visual/responsive regression tests when configured.

### 9.2 Required UI states

Verify every affected view in:

- default;
- focused;
- disabled;
- validation error;
- success;
- loading;
- empty;
- network/dependency failure;
- missing/forged/expired workspace capability;
- cross-workspace/not found;
- retention-expired/clean workspace; and
- processing `Pending`, `Processing`, `Completed`, `Failed`.

### 9.3 Required UI/UX scenarios

- Landing Start success/failure, new workspace, valid resume, missing/forged/
  expired capability, and cookie-loss behavior.
- Upload-embedded voice-sample validation/readiness/progress/failure.
- Meeting upload: valid, invalid format, corrupted file, boundary limits,
  progress, cancel, failure, retry.
- Diary list: empty, populated, pagination/scroll, search, sort, refresh, rename,
  status update, cross-workspace request, retention expiry.
- Diary detail: incomplete, completed, failed, missing audio, read-only
  transcript/summary/analytics.
- Multi-dimensional and semantic search: loading, results, no results, invalid
  query, highlighted content, speaker/time context.
- Contextual playback: play/pause/seek, click-to-play, active transcript
  highlight, timeline navigation, synchronization tolerance, playback failure.
- Speaker analytics: data, insufficient data, unidentified speaker, reprocessed
  result.
- Voice-sample operations inside Upload and language/theme Settings; assert that
  no account/Profile controls or routes are present.
- Light/Dark theme behavior and readable contrast.
- Language changes across labels, buttons, menus, and notifications.
- Workspace expiry/cleanup messaging must not promise recovery or cross-device
  history.

### 9.4 Design-system review

- Canonical data objects look/behave consistently across pages.
- UI status never gets ahead of server status.
- Transcript/audio/search retain temporal context.
- Primary views remain stable during interaction.
- Modals are bounded and dismissible; no complex wizard in a modal.
- Drawers/side panels preserve main context.
- Empty/loading states explain what is happening and what comes next.
- Feedback is timely, local, clear, and non-disruptive.
- Approved spacing scale is used consistently.
- No semantic meaning depends on color alone.
- Keyboard operation, focus order/visibility, labels, errors, and contrast are
  checked.
- Check supported viewport sizes and browsers actually configured for the
  project; do not claim untested browser coverage.

---

## 10. Backend, Worker, data, and security verification matrix

### 10.1 Backend unit/service tests

- Domain invariants and legal state transitions.
- Use-case success, validation, workspace-scope, not-found, conflict, and
  dependency failure.
- DTO mapping and safe error mapping.
- Idempotency and duplicate prevention.
- Retry classification and compensating cleanup.
- Summary/search/statistic prerequisite behavior.

### 10.2 API contract tests

For every approved endpoint in `sds.md`:

- method/path/request/response contract;
- missing/invalid/extra field behavior;
- missing/forged/expired workspace capability and protected cookie behavior;
- cross-workspace direct-object access;
- missing resource;
- idempotent retry/duplicate request;
- dependency and internal error envelope;
- sensitive-data/stack-trace non-disclosure.

### 10.3 Database and storage tests

- migration from empty and representative prior schema;
- primary/foreign key and approved uniqueness;
- workspace propagation and cross-workspace isolation;
- nullable/required fields after resolving DDL decisions;
- timestamp ordering and processing status values;
- transaction rollback;
- database/object-storage compensation;
- cascade/delete/reprocess semantics;
- expiry and idempotent cleanup across database, objects, vectors, cache/queue,
  signed access, and search reachability;
- orphan/stale index detection;
- synthetic seed repeatability;
- backup/restore/reprocessing path when required.

### 10.4 Worker/queue tests

- durable job acceptance and consumption;
- ordered preprocessing/diarization/STT/timestamp/semantic/output steps;
- progress callback service authentication and legal transition validation;
- worker crash and restart;
- transient retry/backoff and permanent failure;
- duplicate delivery/idempotency;
- queue backlog/backpressure;
- missing/corrupt source object;
- no Worker database credential/use;
- complete final commit versus partial-result cleanup;
- reprocessing replacement of transcript, summary, statistics, semantic segments,
  and indexes.

### 10.5 Security tests

- valid workspace required for protected resources;
- IDOR/cross-workspace access across nested meeting resources;
- guessed/forged/expired/replayed workspace capabilities and callback credentials;
- `HttpOnly`, `Secure`, `SameSite`, cookie path/domain and CSRF behavior;
- raw capability/secret/log redaction and capability-digest storage;
- file extension/MIME/content spoofing and malicious payloads;
- upload size/rate/quota/backpressure and conditional CAPTCHA controls after
  values are approved;
- SQL/vector query injection and malformed search input;
- object URL/access expiration and workspace scope;
- CORS/HTTPS/security headers according to environment;
- secrets absent from code, client bundle, logs, errors, and source control.

### 10.6 Performance, reliability, and architecture tests

Run only when required by the task or release gate, using approved environment:

- upload acknowledgement and interactive response thresholds;
- 60-minute processing boundary at ≤2× duration under defined normal load;
- five simultaneous uploads;
- search response threshold;
- one-hundred-user target where the environment supports a valid test;
- Worker failure isolation from Backend API;
- worker-scale throughput comparison;
- architecture dependency rules and forbidden imports;
- availability/health/logging and backup-restore evidence.

Never claim production capacity from a laptop-only simulation. Report the exact
hardware/environment and limitations.

---

## 11. Antigravity IDE demo scenarios

Run the subset affected by the task and a smoke test of critical unaffected
flows. For a release/full-system request, run all applicable scenarios.

### DEMO-01 — Bootstrap and health

1. Start test dependencies.
2. Apply migrations.
3. Seed synthetic workspaces/voice samples/meetings with no personal data.
4. Start Backend API, Worker, and frontend.
5. Verify `/health`, Worker connection, database, cache/queue, storage substitute,
   and clean browser console.

### DEMO-02 — Anonymous entry and workspace isolation

- Open Landing and press Start; verify Upload opens with a protected cookie and
  no credential/Profile UI.
- Reload and resume the same workspace.
- Use a clean browser context to prove a separate empty workspace.
- Demonstrate missing, forged, and expired capability behavior without leaking
  whether prior resources exist.
- Inspect storage/log evidence to confirm raw capability is absent and the
  server uses a digest/equivalent verifier.

### DEMO-03 — Voice-sample management

- From Upload, list current workspace samples and readiness.
- Add valid sample; reject invalid/corrupt input.
- Play sample.
- Rename and delete with confirmation.
- Show that another workspace cannot access or delete it.

### DEMO-04 — Meeting upload and processing lifecycle

- Upload valid audio and observe `Pending → Processing → Completed`.
- Navigate elsewhere while processing.
- Inspect Backend/Worker logs and persisted job/step state.
- Demonstrate invalid/corrupt upload.
- Inject or simulate a controlled Worker failure and observe `Failed` without API
  failure.
- Retry according to approved semantics and verify stale partial data cleanup.

### DEMO-05 — Diary management and detail

- List only current workspace’s non-expired meetings.
- Search, sort, refresh, rename, and open detail.
- Verify empty, processing, completed, and failed detail states.
- Verify direct URL/resource request cannot expose another workspace’s Diary.

### DEMO-06 — Transcript, search, playback, and analytics

- Display speaker/timestamped transcript.
- Run combined structured filters.
- Run semantic query and no-result/invalid-query cases.
- Select result/segment and verify seek/highlight synchronization.
- View summary and speaker statistics, including insufficient/unidentified data.
- Confirm displayed results are read-only and linked to the correct meeting.

### DEMO-07 — Local settings and anonymous retention

- Change Vietnamese/English and light/dark; reload to verify browser-local
  persistence without backend account data.
- Verify Settings contains no notification/account/Profile controls.
- Expire a synthetic workspace using test configuration/clock control; verify
  prior Diary/resources become unreachable and a new Start is clean.
- Run cleanup and verify relational rows, objects, vectors/indexes, cache/queue
  references, and signed access are removed/invalidated idempotently.
- Demonstrate configured rate/quota response and CAPTCHA branch only when that
  integration is enabled for the test environment.

### DEMO-08 — Recovery and observability

- Trace one request/job through workspace, meeting, job, step, Worker, and outcome.
- Verify logs contain required identifiers but no secrets.
- Demonstrate dependency failure behavior.
- When in scope, restore/reprocess from retained synthetic audio.

### Demo evidence rules

For each step, record:

- exact environment and command;
- test fixture/workspace/resource IDs with no raw capability or secrets;
- expected result;
- actual observed UI/API/state/log/database result;
- pass/fail;
- screenshot/trace/log/report path if generated; and
- limitation or untested dependency.

Do not use screenshots alone as proof of backend workspace isolation or data integrity.

---

## 12. Required final test and demo report

Use this format after implementation:

```markdown
# Implementation and Verification Report

## 1. Outcome

- Completed / Partially completed / Blocked
- Short user-visible result

## 2. Scope and traceability

| Requirement/design ID | Implemented behavior | Files/modules | Tests |
| --------------------- | -------------------- | ------------- | ----- |

## 3. Changes made

- Frontend
- Backend
- Worker
- Database/migrations
- Infrastructure/configuration

## 4. Environment

- OS/runtime/tool versions
- Browser/viewport
- Services and test substitutes
- Important limitations

## 5. Commands actually executed

| Command | Purpose | Exit/result |
| ------- | ------- | ----------- |

## 6. Automated test results

| Layer/suite | Scenarios | Passed | Failed | Skipped | Evidence |
| ----------- | --------: | -----: | -----: | ------: | -------- |

## 7. Antigravity IDE demo

| Step | Expected | Actual observed | Result | Evidence |
| ---- | -------- | --------------- | ------ | -------- |

## 8. Debug log

| Failure/symptom | Root cause | Fix | Regression test | Rerun result |
| --------------- | ---------- | --- | --------------- | ------------ |

## 9. Security and data review

- Workspace capability/isolation/retention
- Sensitive data/logging
- Migration/data integrity
- Async/idempotency/recovery

## 10. UI/UX review

- Processing states
- Loading/empty/error/success
- Responsive/browser/accessibility
- Design-system compliance

## 11. Remaining risks and blockers

- RDL/ADL/DDL decisions
- Tests not run and why
- Known limitations/dependencies

## 12. Definition of Done

- Met / Not met, with reason
```

Report exact counts and real command results. If a test is not run, state “not
run” and explain; never infer that it passes.

---

## 13. Definition of Ready

A task is ready only when:

- affected documentation has been read;
- user outcome and boundaries are understood;
- requirement/design IDs are mapped;
- acceptance criteria are testable;
- decision-log blockers are resolved or explicitly excluded;
- affected modules/contracts/data are identified;
- environment and commands are known; and
- destructive/external actions are authorized.

---

## 14. Definition of Done

A task is done only when:

- requested behavior is implemented without unrelated changes;
- traceability is complete;
- code follows frontend/backend dependency rules;
- formatting, lint, type/static checks pass;
- required unit/component/contract/integration/security/E2E tests pass;
- production build succeeds where applicable;
- migrations are verified and data integrity preserved;
- affected IDE demo scenarios are executed and observed;
- failures are root-caused and regression-tested;
- security, workspace isolation, retention, async state, logs, and error
  behavior are reviewed;
- UI/UX states and accessibility are reviewed;
- no secrets/debug bypasses/generated junk are included;
- documentation impact is handled when authorized; and
- the final report honestly lists evidence, unrun tests, risks, and blockers.

Compilation alone is not completion. A visual mock without backend/data behavior
is not completion. Unit tests alone are not a system demo. A demo without
repeatable automated tests is not sufficient for final delivery.

---

## 15. Stop conditions requiring user direction

Stop and ask the user when:

- a request conflicts with ConOps/SRS/SAD/SDS;
- an unresolved RDL/ADL/DDL changes behavior, API, schema, security, or UX;
- a destructive migration or deletion is required;
- production credentials/data/deployment would be accessed;
- test infrastructure or required dependency is unavailable;
- the only possible fix would weaken security, validation, workspace isolation,
  retention, or tests;
- a large restructuring is outside the requested feature; or
- acceptance criteria cannot be made objective.

When blocked, report completed safe work, evidence, exact blocker, options, and
the decision needed. Do not bypass the blocker silently.

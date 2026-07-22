# SecureLearn Production Roadmap

> Architecture audit and implementation plan, prepared 2026-07-21 and revised 2026-07-22. Implementation has started; completed checklist items reflect the working tree.

## Current-state audit

### Executive summary

SecureLearn is a promising frontend-heavy prototype, but it is not yet production-ready. The strongest part is the visual, step-based lesson concept. The largest risks are production settings committed in insecure form, fragile browser-side authentication, absent automated tests, duplicated lesson/quiz presentation, and a catalog that advertises substantially more content than the router can render.

The audit found an active SQLite configuration and an older hard-coded PostgreSQL configuration in Git. The project decision is now **PostgreSQL in every environment**. Database credentials must come from environment variables; SQLite is not a supported runtime fallback. The existing `backend/db.sqlite3` is a legacy local artifact and must be retained only until its data is inspected or migrated.

Observed verification baseline:

- `npm run build`: passes, with numerous ESLint/accessibility warnings.
- Built main JavaScript file: 535,839 bytes before gzip/source-map exclusion; routes are eagerly bundled.
- Lesson media: 44 files totaling about 5.63 MB; the catalog renders all card images without lazy loading.
- `npm test -- --watchAll=false`: fails before running the stale starter test because Jest/CRA cannot resolve the installed React Router v7 package.
- `.venv/Scripts/python.exe manage.py check`: passes.
- Django tests: zero tests discovered.
- The second `backend/venv` environment cannot import Django, while `backend/.venv` can; neither is a reproducible dependency specification.
- The repository already contained unrelated modified/deleted/untracked files when audited. They must be preserved and reviewed separately.

### Folder structure review

Current shape:

```text
SecureLearn/
├── backend/
│   ├── config/                 # Django project settings and root URLs
│   ├── accounts/               # Registration and account mutation APIs
│   ├── db.sqlite3
│   ├── .venv/ and venv/        # duplicate local environments
│   └── manage.py
└── frontend/
    ├── public/
    └── src/
        ├── Components/         # screens, layout, UI, and lessons mixed together
        ├── assets/lessons/
        └── data/lessons.js
```

Findings:

- The repository is small enough to follow, but `Components` mixes route-level pages, reusable UI, feature logic, and lesson content. Naming is inconsistent (`Components`, `SQLInjection`, kebab-case lesson directories, mixed filename casing).
- Lesson catalog metadata is centralized, but most unreleased/non-migrated lesson content is still embedded in large components. SQL Injection and XSSI lesson, guide, and quiz content now come from PostgreSQL/API; XSS is preserved as a backend draft while its visible frontend route remains unfinished.
- SQL Injection and XSSI now share quiz presentation. Guide overview/risk/protection patterns still need broader reusable renderers before lessons 4 through 50.
- The empty XSS placeholder files were removed; XSS is still intentionally incomplete and should be finished from the backend draft before publishing.
- Generated Python bytecode and database/local-environment artifacts appear in the working tree. The root lacks a comprehensive `.gitignore`, backend dependency lock/specification, environment example, and meaningful project documentation.
- `App.css`, `logo.svg`, and the starter `App.test.js` are unused or stale Create React App artifacts.

Recommended target shape (incremental migration, not a rewrite):

```text
frontend/src/
├── app/                        # router, providers, application shell
├── components/ui/              # Button, Card, Field, CodeBlock, EmptyState
├── features/
│   ├── auth/
│   ├── lessons/
│   │   ├── components/         # LessonShell, StepNavigator, Guide, Quiz
│   │   ├── simulations/        # registered interactive simulations
│   │   └── lessonRegistry.js    # allow-listed interactive simulation modules
│   └── profile/
├── contexts/                   # theme/auth only where context is justified
├── i18n/
├── lib/                        # API client, formatting, storage
├── styles/
└── assets/

backend/
├── config/settings/            # base, development, production
├── accounts/
├── lessons/                    # content, translations, revisions, publishing API
├── learning/                   # progress, attempts, and bookmarks
├── common/                     # shared API/error utilities, only when needed
├── requirements/ or pyproject.toml
└── .env.example
```

### Frontend review

#### React structure and state

- Local `useState` is appropriate for search and isolated lesson simulations; a general-purpose global state library is not currently necessary.
- Authentication state now flows through `AuthProvider` and a small token service instead of direct component reads, synthetic storage events, or auth-related full-page redirects. The deeper security decision is still pending: refresh tokens remain in `localStorage` until the session/cookie architecture slice.
- API calls now use one environment-configured base URL helper and versioned `/api/v1/` paths. Auth/account mutations have normalized error handling, request cancellation, loading/disabled submit state, and a concurrency-safe refresh flow. Broader cancellation/error-state coverage for lesson reads is still pending.
- Route screens and lesson components now use lazy imports with Suspense loading UI and a route error boundary, so large lesson/guide modules no longer all enter the initial JavaScript bundle.
- `TerminalBox` recreates its `lines` array on every render while omitting it from effect dependencies. Timed quiz transitions are not cleaned up on unmount.
- App navigation no longer uses full-page `window.location.href`/`window.location.reload`; auth flows use router navigation, lesson handoffs use SPA history navigation, and quiz retry resets component state. The remaining `window.location` string is XSS lesson content, not app navigation.

#### Tailwind, consistency, and maintainability

- Tailwind is used directly and effectively for quick layout work. A first semantic-token and shared UI primitive layer now exists, but most feature screens still need gradual conversion away from repeated long utility strings and arbitrary colors.
- Semantic light/dark tokens, class-based dark mode, pre-paint theme initialization, and a two-option light/dark `ThemeProvider` are configured with light as the default. The theme control lives in Profile only. The app shell, auth screens, catalog, profile, toast, loading, empty, error states, and lesson/guide/quiz reading surfaces are theme-aware; intentionally simulated browser/code/terminal surfaces can keep fixed colors.
- The redundant `@tailwindcss/line-clamp` plugin has been removed because Tailwind 3.4 includes line-clamp utilities by default.
- `App.css` is untouched starter CSS and is not imported.

#### Performance

- Route-level lazy loading is now implemented for top-level screens and the lesson registry, with Suspense fallback and a resettable route error boundary.
- Catalog images should use `loading="lazy"`, `decoding="async"`, explicit aspect ratios, optimized WebP/AVIF poster images, and GIFs only when motion communicates lesson meaning.
- Search over 42–50 entries does not need memoization for speed, but normalized/search-indexed metadata will improve Persian search. Do not introduce caching abstractions without measurement.
- Add bundle analysis and Web Vitals budgets before optimizing individual renders. Current problems are asset delivery and eager modules, not small component rerenders.

#### Accessibility and responsiveness

- Login, signup, and profile password fields now have programmatic labels through the shared `Field` primitive. Lesson-search and remaining feature fields still need the same treatment.
- Quiz answers and lesson “next” panels are clickable `div` elements, so keyboard and assistive-technology users cannot operate them correctly. Use buttons or an accessible radio group.
- Sidebar icon buttons need accessible names; the mobile drawer needs focus management, Escape handling, `aria-expanded`/`aria-controls`, and focus return.
- The placeholder `About` link uses `href="#"`, which triggers a build accessibility warning.
- Step dots need current-step semantics (`aria-current="step"`) and a visible focus style. Quiz result feedback should be announced with an `aria-live` region.
- Animations and auto-typing do not honor `prefers-reduced-motion`; the XSS lesson invokes a blocking browser `alert`.
- The XSS simulation uses fixed 244/260 px elements in a non-wrapping horizontal row and is likely to overflow narrow screens. Code blocks scroll horizontally, which is appropriate, but should have labels and copy affordances.
- Color cannot be the only quiz-result signal, and all theme combinations require WCAG contrast testing.

### Backend review

#### Apps, models, views, and URLs

- Only the `accounts` app exists. It uses Django's built-in `User`; there are no application models for lessons, progress, quiz attempts, achievements, or preferences.
- The built-in user is adequate for this prototype. Decide whether a custom user model is needed **before** more production data exists; changing later is migration-intensive.
- The root URL configuration no longer duplicates `api/accounts/`.
- API paths now expose `/api/v1/` for accounts, tokens, and lessons. Legacy `/api/accounts/` and `/api/token/` remain temporarily for compatibility.
- Registration, password change, and account deletion are thin views with no domain/service layer. That is acceptable at this size, but shared validation and a consistent error envelope are needed before expansion.
- `RegisterSerializer` does not call Django password validators and does not define the intended email uniqueness/normalization policy.
- Password change does not require the current password, apply password validation explicitly, or revoke existing refresh/access tokens. Account deletion is immediate and irreversible with only a browser confirm.
- There is no throttling/rate limiting around login, registration, or password changes. The arithmetic “captcha” is client-side only and offers no bot protection.
- The admin adds bulk staff/ban actions. Restrict privilege-changing actions explicitly to authorized superusers and add tests/audit logging.

#### Authentication and production security

- JWT access and refresh tokens are stored in `localStorage`. Any successful XSS can read them; this is especially important for a site that demonstrates script injection. Prefer short-lived access state plus a `Secure`, `HttpOnly`, `SameSite` refresh cookie, with CSRF protection for cookie-authenticated mutations, or use hardened Django sessions.
- A Django secret key is committed; `DEBUG=True`; CORS allows every origin; `ALLOWED_HOSTS` is empty; production HTTPS/cookie/HSTS/logging/static settings are absent. Split settings by environment and rotate any key that may have been used outside local development.
- The settings header says Django 4.2.11 while the working environment contains Django 6.0.7. There is no pinned dependency file, so deployments are not reproducible.
- Add token rotation/blacklisting or server-side session revocation, a logout endpoint, and a `/me` endpoint so the client validates identity rather than inferring it from token presence.

#### API and performance outlook

- Current database/API load is negligible; there are no present N+1 query issues because there are no domain queries.
- As progress features arrive, use explicit serializers, pagination for attempt/history endpoints, database constraints, indexes on `(user, lesson)` and recent activity, `select_related`/`prefetch_related`, and idempotent progress updates.
- Define consistent status codes and error bodies, API schema documentation, permissions, throttles, and tests before adding learning endpoints.

### Database review

PostgreSQL is the required database for development, testing, staging, and production. This gives SecureLearn one set of query semantics and lets development and CI exercise the same constraints, transactions, indexes, full-text search, and `jsonb` behavior used in production. It also avoids discovering PostgreSQL-only migration or collation problems at deployment time.

The costs are a local service/container and slightly slower test setup. Those costs are justified because lesson publishing, concurrent progress writes, multilingual search, analytics, backup/restore, and future reporting all benefit from PostgreSQL. Tests should use a disposable PostgreSQL database, with test workers creating isolated databases as needed.

Configuration decision:

- Use PostgreSQL only; never silently fall back to SQLite.
- Read connection settings from environment variables and fail clearly when a deployment is misconfigured.
- Keep the legacy `backend/db.sqlite3` untouched until its data is classified. If it contains useful data, export it once and import it through Django migrations or a purpose-built command.
- Use normal relational columns and constraints by default. Use PostgreSQL `jsonb` only for bounded, schema-validated block configuration, not as a substitute for the lesson domain model.
- Add connection pooling only after deployment topology and measurements justify it; begin with Django persistent connections or platform pooling.
- Rehearse `pg_dump`/restore and migration rollback before public launch.

### Lesson architecture deep dive: SQL Injection

The existing SQL lesson has four stages:

1. `SQLInjection.js`: a 14-step state machine combining narration, progress dots, mock bank login, generated SQL, logs, success/error state, and the guide handoff.
2. `SQLInjectionGuide.js`: a wrapper composing overview, risks, protection, and code-sample sections.
3. `sql-injection-quiz.js`: a quiz introduction and guide review link.
4. `sql-injection-quiz-start.js`: three questions, timed answer feedback, score/pass state, retry, and catalog return.

Good reusable concepts already visible:

- Lesson shell and title
- Step progress/navigation
- Narrative/instruction card
- Simulation viewport and terminal/log panel
- Guide hero with prevalence/exploitability/impact metrics
- Risks/protection sections
- Language-tabbed code examples
- Quiz intro, quiz runner, progress indicator, result state
- Previous/next/review/catalog navigation

Current limitations:

- Presentation, copy, state transitions, validation rules, routes, and simulation UI are coupled in each lesson component.
- Step content is expressed as many `step === n` branches. Question runners are copied per lesson.
- Progress and quiz results are memory-only and disappear on refresh/navigation.
- Direct navigation bypasses prerequisites, and catalog metadata can disagree with actual route availability.
- SQL and XSSI are substantially complete; XSS has an interactive page and guide but its quiz/code-sample files are empty. The catalog contains 42 entries while only three base lesson slugs are registered; unavailable cards lead to `LessonNotFound`.

#### Recommended content/presentation split

Use a **PostgreSQL-backed, relational Django content system with typed content blocks**. The database is the canonical source for lesson content; JSON files are neither required nor the publishing source of truth.

- `Lesson` owns stable identity and non-translated metadata: slug, status, order, difficulty, estimated time, simulation key, prerequisites, and timestamps.
- `LessonTranslation` owns locale-specific title, summary, objectives, and SEO fields, with a unique constraint on `(lesson, locale)` and explicit translation status.
- `LessonRevision` provides immutable draft/published version history. Learner records reference the published revision so progress remains meaningful after content changes.
- Ordered `LessonSection`/`LessonBlock` records represent narrative, callout, code sample, terminal, image, simulation handoff, and other renderer types. Translated text is stored in related translation rows. A small validated `JSONField` may hold type-specific presentation configuration, never executable code or the entire lesson.
- `Quiz`, `Question`, `QuestionTranslation`, `Answer`, and `AnswerTranslation` remain relational so scoring, randomization, reporting, and translation completeness can be queried and constrained.
- `MediaAsset` stores metadata and object-storage URLs; large images/video do not belong in PostgreSQL.
- Generic React renderers own presentation and accessibility. A small allow-listed simulation registry maps a database `simulation_key` such as `sql-login` to a lazy React component; database content cannot name arbitrary imports or execute code.
- Read APIs return a versioned DTO and use `select_related`/`prefetch_related`. Cache published lesson responses per `(slug, locale, revision)` and invalidate them on publication. Public responses can later be cached at a CDN.
- Django admin is sufficient for the first authoring workflow. If editorial workflow becomes complex, Wagtail plus `wagtail-localize` is the preferred future CMS path; it should replace the authoring layer without changing the public API contract.

Approach comparison:

| Approach | Performance and scale | Maintainability and multilingual support | Future expansion | Decision |
|---|---|---|---|---|
| Django relational models on PostgreSQL | One API fetch, indexed querying, cacheable published revisions; handles concurrent learner writes | Admin editing, validation, constraints, translation status, preview/publish workflow | Strong for search, analytics, scheduling, permissions, learning paths, and CMS migration | **Canonical architecture** |
| Markdown files | Fast when prebuilt/CDN-hosted; Git scales well for developer-owned prose | Excellent diffs and prose authoring, but metadata/translation parity and editorial UI require custom tooling | Good documentation format; awkward for quizzes, relationships, scheduling, and non-developer authors | Optional import/export format for long-form prose, not canonical storage |
| JSON files | Fast static delivery and strict schema validation | Diffable but verbose; merge conflicts and asset/translation workflows worsen with many lessons | Reasonable for fixtures or API snapshots; poor publication workflow and relational queries | Use only for fixtures, seed/export data, and API DTOs |
| Wagtail/other headless CMS | Mature caching and content APIs, with more runtime/operational overhead | Best editorial preview, approval, and localization workflow | Excellent when several non-developer authors need workflows | Reassess when content operations justify the dependency |
| React/JavaScript content modules | Bundled reads are fast but increase frontend download size | Content and behavior become coupled; translations require redeployment | Hard to govern at 40–50 lessons | Use only for allow-listed interactive simulations |

Why this wins: it centralizes catalog, publishing, translations, prerequisites, quizzes, and learner references under database constraints while keeping unique visual behavior in frontend code. PostgreSQL indexing plus response caching removes database latency from hot published lessons, and immutable revisions make deployments, analytics, and future content updates safer.

Before migration, finalize these models and the versioned API DTO, convert SQL Injection as the reference fixture through a data migration/management command, add model/API/renderer tests, and compare it visually to the current UI. Then migrate XSSI. Do not design storage around the current React component branches.

### UI/UX screen review

| Screen | Findings and recommended improvements |
|---|---|
| Public header | Add real About destination, active route state, skip link, theme/language controls, responsive overflow handling, and an authenticated identity state. |
| Landing | Strong two-column hero; clarify the primary learning outcome, show learning paths/progress proof, reduce terminal motion for reduced-motion users, and add below-fold trust/content previews. |
| Login/signup | Add visible labels, password visibility, autocomplete attributes, loading/disabled buttons, field-level server errors, password requirements, and accessible status announcements. Replace client-only captcha with backend throttling/real abuse controls if needed. |
| Authenticated shell/sidebar | Add active navigation, dashboard destination, focus-managed mobile drawer, tooltips when collapsed, persisted collapse preference, and logical-direction layout for RTL. |
| Lessons catalog | Display only published/available items or clearly label “coming soon”; add topic/difficulty/duration/status filters, progress state, semantic result count, optimized lazy media, and stable lowercase slugs. |
| Lesson interaction | Preserve the visual concept, but add Back/Next buttons, keyboard navigation, step labels, save/resume, instructions separate from the click target, responsive simulation frames, and non-blocking in-page demonstrations. |
| Guides | Unify reading width, heading hierarchy, section navigation, code tabs/copy buttons, line wrapping, callouts, and a sticky “continue to quiz” action. |
| Quizzes | Use fieldset/radio/button semantics, explicit submit/next behavior instead of forced timers, answer explanations, live feedback, retry without reload, persisted attempts, and progress text in addition to dots/colors. |
| Profile | Protect the route, show identity/session information, require current password, expose language/theme preferences, use typed confirmation for deletion, and offer a recovery/grace-period policy. |
| Dashboard | No dashboard exists. Add one only after progress data exists: continue-learning card, completed/in-progress counts, recommended next lesson, streak/activity, and bookmarks. |
| Empty/loading/error | Only catalog-empty and lesson-404 states exist. Add route loading skeletons, offline/network errors, 401/403/404/500 pages, retry actions, and error boundaries with useful recovery. |

Adopt a small design system rather than copying a specific platform: semantic colors, an 8-point spacing rhythm, consistent content widths, two card elevations, restrained motion, strong focus rings, and one primary action per section.

## Prioritized architecture improvements

| Priority | Improvement | Why | Difficulty | Files affected | Timing |
|---|---|---|---|---|---|
| Critical | Split development/production settings; move secrets and hosts/CORS to environment; rotate exposed key | Prevents credential leakage and unsafe deployment defaults | Medium | `backend/config/settings.py` -> `settings/base.py`, `development.py`, `production.py`; `.env.example` | Now |
| Critical | Pin one Python environment and compatible frontend toolchain | Makes installs/tests reproducible; resolves CRA/Jest/router drift | Medium | `backend/pyproject.toml` or requirements files, root `.gitignore`, `frontend/package*.json`, README | Now |
| Critical | Establish authentication threat model and replace long-lived localStorage refresh token | Reduces token theft/replay risk and makes auth state trustworthy | High | backend settings/accounts URLs/views; new token endpoints; frontend auth provider/API client | Before public users |
| Critical | Validate passwords, throttle auth, secure password change/deletion, test admin actions | Closes account takeover/abuse and privilege-management gaps | Medium | accounts serializers/views/admin/tests, REST settings | Now |
| Critical | Reconcile catalog publication status with route availability | Stops 39 advertised base lesson cards from landing on 404 | Low | `data/lessons.js`, lesson registry, `LessonsPage.js` | Now |
| Critical | Add meaningful frontend/backend tests and CI gates | Current frontend test fails and backend has zero tests | Medium | test files, CI workflow, package scripts | Now |
| Important | Introduce database-backed lesson models, versioned APIs, generic renderers, and migrate SQL as reference | Makes 40–50 lessons feasible without duplicated pages | High | new lessons app/models/API; renderer/simulation registry; existing SQL files | Now, incrementally |
| Important | Add persistent learning models and APIs | Enables resume, dashboard, attempts, and cross-device progress | High | new `learning` app/migrations/API; frontend learning service | After schema |
| Important | Centralize API/auth state and protected routing | Removes hard-coded URLs, reloads, token-presence UI, and inconsistent errors | Medium | `App.js`, Layout, Auth, Profile, new API/Auth modules | Now |
| Important | Route-split lesson modules and optimize media | Improves initial load more than micro-optimizing renders | Medium | router/registry, lesson imports, LessonCard/assets/build scripts | Now |
| Important | Create semantic design tokens and reusable accessible UI | Makes dark mode, RTL, consistency, and accessibility manageable | Medium | Tailwind config, index styles, new UI primitives, all screens gradually | Before theme/i18n rollout |
| Important | Migrate CRA after tests provide safety | CRA is deprecated and current test tooling conflicts with the installed router | Medium | frontend build/config/scripts/tests | After baseline tests |
| Important | Version and document APIs with consistent errors | Prevents client/server drift as learning endpoints grow | Medium | config URLs, serializers/views, schema docs | Before learning API launch |
| Nice to Have | Add observability, analytics consent, and performance budgets | Makes regressions and production failures measurable | Medium | frontend metrics/error boundary; backend logging; deployment | Before launch |
| Nice to Have | Add richer content authoring preview and validation tooling | Speeds safe lesson creation and bilingual completeness checks | Medium | admin, preview API/route, validation, CI | After two migrated lessons |
| Nice to Have | Evaluate Wagtail as the authoring layer | Helps non-developer authors once approval/localization workflows justify complexity | High | backend content admin/API/cache | Later |

References for time-sensitive platform decisions: React has officially deprecated Create React App (<https://react.dev/blog/2025/02/14/sunsetting-create-react-app>); Django's deployment checklist covers secret, debug, hosts, HTTPS, and deployment checks (<https://docs.djangoproject.com/en/6.0/howto/deployment/checklist/>); OWASP advises against storing session identifiers in local storage (<https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html>).

## Dark/light mode implementation plan

Architecture decision: use a small `ThemeProvider` with explicit `light | dark` choices only, because theme is low-frequency global UI state. Do not add a general state library for this. Default to light mode when there is no saved preference.

Resolution order:

1. Explicit saved preference from `localStorage` (`securelearn.theme`) if it is `light` or `dark`.
2. Otherwise use `light`.
3. Apply the resolved `dark` class, `data-theme`, and `color-scheme` to `<html>`.
4. Run a tiny inline pre-paint script in `public/index.html` to avoid a flash of the wrong theme.

Use semantic CSS variables (`--color-bg`, `--color-surface`, `--color-text`, `--color-muted`, `--color-border`, `--color-primary`, `--color-danger`, code/success/warning tokens) and expose them through Tailwind. This avoids adding `dark:` to every hard-coded color and keeps lesson simulations able to opt into intentionally fixed themes.

Exact planned files:

- Modify `frontend/tailwind.config.js`: `darkMode: 'class'`, token colors, semantic shadows/transitions; remove redundant line-clamp plugin.
- Modify `frontend/src/index.css`: light/dark variables, `color-scheme`, base background/text, focus styles, reduced-motion rules.
- Modify `frontend/public/index.html`: pre-paint preference/OS resolver and themed browser metadata.
- Add `frontend/src/contexts/ThemeContext.js` and `frontend/src/hooks/useTheme.js`.
- Add `frontend/src/Components/UI/ThemeToggle.js` with two accessible choices: Light and Dark.
- Modify `frontend/src/index.js` or `frontend/src/app/AppProviders.js`: mount provider.
- Modify Layout, ToastProvider, auth/profile/catalog/lesson/guide/quiz components to consume semantic styles, and expose the theme control only from Profile.
- Add theme contrast and persistence tests.

Animation rules: transition only color/background/border over roughly 150–200 ms after hydration; never apply a global `transition-all`; disable nonessential transitions and typing motion under `prefers-reduced-motion`. Theme initialization should require no network request and trigger no React render before first paint.

## Persian/English localization plan

Use `i18next` + `react-i18next`: its hooks, namespaces, interpolation/pluralization, lazy resource loading, and language-change rerenders fit this React application (<https://react.i18next.com/latest>). Default to `fa`, support `en`, and persist the explicit choice as `securelearn.language`. Do not automatically override the required Persian default from browser locale; browser detection can be offered only as a one-time suggestion.

Proposed files:

```text
frontend/src/i18n/
├── index.js
├── locales/
│   ├── fa/{common,auth,profile,lessons}.json
│   └── en/{common,auth,profile,lessons}.json
└── formatters.js

backend/lessons/
├── models.py                  # canonical content and translation records
├── admin.py                   # authoring, validation, preview, publication
├── api/                       # locale-aware versioned read API
└── migrations/                # schema and controlled content imports
```

Implementation details:

- Initialize i18next before the app renders for interface strings. Load lesson translations from the locale-aware lesson API and cache them by revision; do not duplicate database lesson content in i18next files.
- On language change, set `<html lang="fa" dir="rtl">` or `<html lang="en" dir="ltr">` immediately and persist the preference. Store language in the user profile later for cross-device sync.
- Replace physical layout utilities (`left/right`, `ml/mr`, `pl/pr`, `text-left`) with logical layout or direction-aware variants. Simulated code/editor/database UI can remain LTR inside `dir="ltr"` boundaries.
- Self-host **Vazirmatn** for Persian and use Inter/system UI for English; retain a dedicated monospaced stack for code. Subset/preload only the fonts required above the fold.
- Centralize `Intl.DateTimeFormat` and `Intl.NumberFormat`. Use `fa-IR-u-ca-persian` when the product intends Jalali dates; keep payloads, code, CVE identifiers, URLs, and security syntax in Latin digits/LTR to prevent ambiguity.
- Never concatenate translated fragments. Use named interpolation and `<Trans>` for structured text. Add plural/context cases and translator notes for security terminology.
- Add CI checks for missing/extra interface keys, database translation completeness, valid typed blocks, and pseudo-localized layout stress.
- Update document title/description per locale and canonical route. If public lesson SEO is a priority, add prerendering/SSR so crawlers receive localized content, plus locale URLs (recommended `/fa/...`, `/en/...`), canonical and `hreflang` links, localized sitemap, and translated Open Graph metadata. A client-only `lang` switch alone is insufficient for robust bilingual SEO.
- Keep API error codes language-neutral and translate them on the client; use Django i18n only for backend-rendered/admin/email content.

## Master implementation checklist

### Phase 0 — Protect the baseline (Critical, now)

- [ ] Inspect the legacy SQLite database and document whether it contains disposable or migration-worthy development data; keep it untouched until decided.
- [x] Review and preserve the pre-existing dirty worktree before refactoring.
- [x] Add a root `.gitignore` for Python bytecode, both virtualenv names, environment files, SQLite development copies, coverage, builds, and editor artifacts.
- [ ] Remove tracked generated/local artifacts only after confirming they are not needed; never discard existing uncommitted work.
- [x] Create a concise root README with supported Python/Node versions and exact setup/run/test commands.
- [x] Choose and pin the actual Django version; reconcile the 4.2-generated settings comment with the installed 6.0 runtime.
- [x] Create `pyproject.toml`/lock or pinned requirements and retain one local virtual environment convention.
- [ ] Align React, React Router, test tooling, and lockfile; make a clean install reproducible.
- [ ] Replace the stale starter test and make frontend tests run in CI.
- [ ] Add CI for frontend lint/test/build and backend format/check/test/migration checks.

### Phase 1 — Security and correctness (Critical, now)

- [x] Split Django settings into base/development/production.
- [x] Move secret key, hosts, CORS origins, database, and debug flags to validated environment configuration; add CSRF origins when cookie authentication is implemented.
- [ ] Rotate the committed Django secret if it has been used anywhere non-disposable.
- [ ] Configure production HTTPS redirect, secure cookies, HSTS, proxy SSL header, static root, structured logging, and `check --deploy`.
- [x] Remove duplicate `api/accounts/` URL include and introduce `/api/v1/` with compatibility planning.
- [ ] Define API error envelope and OpenAPI/schema documentation.
- [ ] Apply Django password validators during registration/change; define email normalization/uniqueness policy.
- [ ] Require current password or a recent-authentication step before password change.
- [ ] Add auth throttling, lockout/abuse monitoring, and generic credential errors.
- [ ] Replace the client-only arithmetic captcha or remove it once server-side abuse controls exist.
- [ ] Restrict and test privilege-changing admin actions; record security-relevant actions.
- [ ] Decide session vs hardened JWT architecture; do not retain a long-lived refresh token in localStorage.
- [ ] Add logout/revocation and `/me`; handle expiry and cross-tab logout centrally.
- [ ] Add confirmation/re-authentication and an intentional retention/grace policy for account deletion.
- [ ] Add backend tests for registration, token flow, permissions, validation, throttles, password change, deletion, and admin authorization.
- [ ] Mark unavailable catalog lessons as `comingSoon`/unpublished and prevent playable links to missing routes.
- [ ] Normalize all lesson slugs to lowercase kebab-case and preserve redirects for any published old URLs.
- [ ] Fix mojibake characters visible in current source/output and enforce UTF-8 in editor/CI.

### Phase 2 — Frontend foundation (Important, now)

- [x] Create `AppProviders`, `AuthProvider`, a centralized API helper, and initial protected-route handling.
- [x] Use one environment-configured API base URL; remove hard-coded localhost URLs.
- [x] Add request cancellation for auth/account mutations, one concurrency-safe token-refresh path, normalized errors, and loading/disabled mutation states.
- [x] Replace `window.location` navigation/reload with SPA navigation and state reset.
- [x] Add route-level lazy imports, Suspense loading UI, and route error boundaries.
- [ ] Establish feature-oriented folders and consistent lowercase component/file naming incrementally.
- [x] Define semantic design tokens and reusable Button, Card, Field, CodeBlock, Callout, EmptyState, Skeleton, and ErrorState components.
- [x] Remove unused/stale CRA files and compiler warnings only after coverage protects behavior.
- [ ] Add active navigation, skip link, page titles, and a real About route or remove the placeholder link.
- [ ] Migrate from deprecated CRA after baseline behavior/tests are stable; measure before/after bundles.

### Phase 3 — Scalable lesson system (Important, now)

- [x] Create the `lessons` app and relational models for lessons, translations, versioned revisions, ordered typed blocks, quizzes, questions, answers, media metadata, prerequisites, and publication status.
- [x] Add database constraints and model/service validation for locale coverage, unique slug/order, valid typed block configuration, and publish readiness.
- [x] Expose versioned locale-aware catalog/detail APIs; make them the single source for catalog and lesson routes.
- [x] Add published-response caching keyed by slug, locale, and revision with publish-time invalidation.
- [x] Configure Django admin authoring, inline ordering, preview, and an explicit atomic publish action.
- [x] Refactor the SQL Injection interactive page into smaller components without changing its frontend-owned behavior.
- [ ] Build `LessonShell`, `StepNavigator`, `InstructionCard`, `SimulationFrame`, `TerminalPanel`, `GuideRenderer`, `MetricCard`, `CodeTabs`, `QuizIntro`, `QuizRunner`, and `QuizResult`.
- [ ] Implement a lazy simulation registry for unique interactions.
- [x] Add a faithful ORM-backed SQL Injection seed/import command from the existing lesson experience.
- [x] Add a hidden PostgreSQL/API-backed SQL Injection preview route using the shared frontend renderer.
- [x] Wire the frontend SQL Injection route to the lesson API only after the backend content and renderer match the existing lesson experience.
- [x] Prove SQL Injection visual/behavior parity against the legacy route after PostgreSQL seed data is published.
- [x] Move SQL Injection guide and quiz routes to PostgreSQL/API-backed content and remove the old frontend hardcoded SQL guide/content module.
- [x] Add fluent Persian PostgreSQL/API-backed translation for SQL Injection lesson, guide, and quiz while preserving code samples, payloads, URLs, and terminal/code surfaces.
- [x] Migrate XSSI second and delete duplicated quiz/guide presentation only after parity.
- [x] Move the current incomplete XSS lesson into a draft PostgreSQL/API-backed workflow.
- [ ] Finish the XSS guide, quiz, and code samples from the backend side before publishing/switching routes.
- [ ] Complete or explicitly unpublish XSS; remove ambiguous empty feature files.
- [ ] Add previous/next/review navigation and accessible step/quiz semantics.
- [ ] Add answer explanations and user-controlled advance; clean up timers on unmount.
- [ ] Add content author preview, model/API fixture tests, and bilingual completeness checks.
- [ ] Document the exact workflow for creating lesson 4 through lesson 50.

### Phase 4 — Learning data (Important, after lesson models)

- [ ] Decide custom-user requirements before production user growth; document the migration decision.
- [ ] Create a `learning` Django app.
- [ ] Model progress, quiz attempts, challenge attempts, and bookmarks against immutable published lesson revisions.
- [ ] Add uniqueness/check constraints, timestamps, indexes, and data-retention rules.
- [ ] Design idempotent resume/progress APIs and prevent clients from awarding themselves trusted achievements.
- [ ] Add permissions, pagination, query-count tests, serializer validation, and API contract tests.
- [ ] Run development, tests, staging, and production on PostgreSQL with no SQLite fallback.
- [ ] If legacy SQLite data is valuable, rehearse its one-time import into PostgreSQL with verification and rollback.
- [ ] Rehearse PostgreSQL backup, restore, point-in-time recovery expectations, and deployment rollback.

### Phase 5 — Accessibility and responsive UX (Important)

- [ ] Add programmatic labels, autocomplete, descriptions, and field-level errors to all forms.
- [ ] Replace clickable non-semantic containers with buttons/radio groups and preserve keyboard focus.
- [ ] Add visible focus rings and run keyboard-only navigation across every route.
- [ ] Implement accessible mobile drawer focus trap, Escape close, focus return, and ARIA state.
- [ ] Add `aria-current` to route/step navigation and live regions for quiz/toast results.
- [ ] Ensure color is never the only status indicator and audit contrast in every theme.
- [ ] Reflow the XSS dual-browser simulation for small screens and test at 320 px through desktop widths.
- [ ] Honor reduced motion; replace blocking alert demonstrations with safe in-page simulated dialogs.
- [ ] Add copy controls and accessible names/captions to code examples.
- [ ] Test with automated accessibility tooling plus manual screen-reader/keyboard checks.

### Phase 6 — Dark/light theme (Important)

- [x] Add semantic light/dark tokens and Tailwind class-based theme support.
- [x] Implement `ThemeProvider` with light/dark only, light default, and local persistence.
- [x] Add pre-paint theme initialization to prevent flash.
- [x] Add accessible Profile-only theme control with Light/Dark choices.
- [x] Convert shared layout and UI primitives before feature screens.
- [x] Convert auth, catalog, profile, toast, loading, empty, and error states.
- [x] Convert lesson, guide, and quiz interiors where colors are not intentionally fixed.
- [x] Preserve intentionally dark terminals/code surfaces while auditing obvious contrast issues.
- [x] Add reduced-motion-safe color transitions and theme persistence tests.

### Phase 7 — Persian default and English localization (Important)

- [x] Install/configure `i18next` and `react-i18next` with default `fa` and fallback `en`.
- [x] Create initial common UI translation resources for navigation, auth, profile, catalog, loading, and error states; keep lesson body content in PostgreSQL/API translations, not frontend locale files.
- [x] Add Profile language control, local persistence, and immediate `<html lang/dir>` updates.
- [ ] Store language preference in the user profile for cross-device sync.
- [ ] Replace remaining physical-direction CSS/utilities with logical or direction-aware layout.
- [ ] Isolate code, payloads, terminals, email/URL/CVE strings in LTR regions.
- [x] Self-host Vazirmatn and define English/code fallback stacks.
- [ ] Centralize Persian/Gregorian date and locale-aware number formatting decisions.
- [x] Extract first slice of UI strings without translating terminal/code samples or frontend-stored lesson content.
- [ ] Create a bilingual cybersecurity glossary and translation review process.
- [ ] Add missing-key, interpolation, RTL visual, and pseudo-localization tests.
- [ ] Choose locale URL/SSR/prerender strategy; add canonical, hreflang, sitemap, title, description, and social metadata.

### Phase 8 — Product experience and dashboard (Important/Later)

- [ ] Design dashboard from real progress data: continue learning, recent activity, completion, recommendations, bookmarks, and streak.
- [ ] Add catalog filters for topic, OWASP category, difficulty, duration, status, and completion.
- [ ] Add intentional loading skeletons, no-results guidance, offline/retry states, and 401/403/404/500 pages.
- [ ] Add lesson prerequisites, learning paths, estimated time, learning objectives, and completion summaries.
- [ ] Add resumable progress and cross-device synchronization with visible save state.
- [ ] Add optional feedback/report-content flow for inaccurate or outdated security guidance.

### Phase 9 — Performance, quality, and operations (Before launch)

- [ ] Lazy-load route modules, lesson namespaces, simulations, and below-fold media.
- [ ] Convert GIF-heavy cards to optimized poster formats; load motion on interaction or when visible.
- [ ] Set bundle, image, LCP, CLS, and interaction performance budgets in CI.
- [ ] Collect privacy-respecting Web Vitals and backend latency/error metrics.
- [ ] Add unit, component, API, integration, and critical end-to-end tests.
- [ ] Test auth expiry, refresh concurrency, offline recovery, RTL, dark mode, mobile lessons, and progress conflict cases.
- [ ] Add dependency/security scanning, format/lint hooks, migration checks, and release notes.
- [ ] Configure production server, static asset caching, database backups, restore drills, health checks, error reporting, and rollback procedure.
- [ ] Add architecture decision records, API docs, content-author guide, deployment runbook, and incident/security reporting policy.
- [ ] Review and pay down recorded technical debt at each milestone rather than deferring all cleanup to launch.

## Future ideas

- [ ] Safe, sandboxed “attack lab” exercises with disposable targets and explicit legal/ethical boundaries.
- [ ] Adaptive learning paths based on quiz misconceptions rather than only pass/fail scores.
- [ ] “Fix the vulnerable diff” challenges with language-specific secure-code feedback.
- [ ] Side-by-side vulnerable vs secure request/response, data-flow, and query visualizations.
- [ ] OWASP/CWE/CVE mappings with versioned “last reviewed” metadata on every lesson.
- [ ] Spaced-repetition review cards generated from completed lessons.
- [ ] Team/classroom cohorts, private assignments, and instructor progress views with minimal data collection.
- [ ] Capture-the-flag capstones that combine several previously learned vulnerabilities.
- [ ] Accessibility-first terminal mode and low-motion/low-bandwidth lesson variants.
- [ ] Persian cybersecurity glossary with English aliases and contextual definitions.
- [ ] Offline/PWA lesson reading while keeping graded attempts server-verified when reconnected.
- [ ] Content integrity signatures/version history so learners can see when security guidance changed.
- [ ] Personalized “next best lesson” recommendations that remain explainable and user-controlled.

## Definition of production-ready

- [ ] No known Critical items remain open.
- [ ] Catalog, route registry, translations, and published content pass schema/consistency checks.
- [ ] Authentication and destructive account flows have threat-model coverage and automated tests.
- [ ] PostgreSQL backup/restore and deployment rollback have been rehearsed.
- [ ] Critical journeys pass on mobile/desktop, keyboard, screen reader, Persian RTL, English LTR, light, dark, and reduced-motion modes.
- [ ] CI is green for lint, tests, build, migrations, dependency checks, accessibility smoke tests, and performance budgets.
- [ ] Monitoring, incident response, privacy/retention, content review, and release ownership are documented.

# Contributing to Hadaling

How to set up a dev environment, do common tasks, and not break things. Read once on day 1, refer back as needed.

For *how the system works* (data flow, auth, gamification), see [ARCHITECTURE.md](./ARCHITECTURE.md). This doc is about *how to develop* on it.

---

## 1. Setup (5 minutes)

```bash
git clone git@github.com:saahin2026-beep/Hadaling-app.git
cd Hadaling-app
npm install
cp .env.example .env.local
# fill in VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
# (ask the project owner — these aren't in the repo)
npm run dev
```

Open http://localhost:5173. The app should load with onboarding.

If you see "invalid API key" — your env vars aren't loaded. Check `.env.local` exists, restart `npm run dev`.

### What's in `.env.local`

| Var | Required? | Purpose |
|---|---|---|
| `VITE_SUPABASE_URL` | yes | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | yes | Supabase anon key (public — safe in client) |
| `VITE_SENTRY_DSN` | no | Sentry error tracking (leave blank to disable) |
| `VITE_APP_ENV` | no | Override `production`/`development` label sent to Sentry |

The anon key is public-safe — RLS policies are what keep data secure. Don't worry about exposing it in the bundle.

## 2. Daily workflow

### Branches

The project lives on `main`. For solo work, commit directly to main. When PRs become standard practice, branch off `main` with a descriptive name:

```bash
git checkout -b fix/streak-broken-modal-not-showing
```

### Commits

Multi-line commits with a structured body. Past examples in `git log` show the style. The first line is short (≤70 chars), imperative present tense, lowercase prefix grouping the change:

```
fix: streak broken modal not appearing on day 4
feat: add forgot-password flow
docs: ARCHITECTURE.md
test: full coverage of practice exercises
chore: silence test warnings
```

The body explains *why* and *what*, not the literal diff. Mention any doc updates in the body so they're easy to verify.

### Running tests

```bash
npm test            # one-shot, exits when done
npm run test:watch  # re-runs on file changes
npm run test:ui     # browser-based test runner
```

There are 121 tests across 17 files. They take ~7 seconds. Run them before every commit.

### Building

```bash
npm run build       # production build → dist/
npm run preview     # serve the built bundle locally to test
```

The build runs `vite build && node scripts/inject-sw-version.mjs`. The script injects the current git SHA into the service worker cache name, so each deploy invalidates the previous SW.

### Deploying

Vercel auto-deploys `main` on push. No manual deploy needed.

```
git push origin main → Vercel CI/CD runs → live in ~60 seconds
```

To deploy manually (rare):
```bash
vercel --prod
```

## 3. Code conventions (must-follow)

### Inline styles, never CSS files

Per the project's design rules, **every styled element uses inline `style={{}}` props**. No CSS Modules. No styled-components. The only exception is the `index.css` Tailwind utilities used as escape hatches.

```jsx
// ✓ correct
<div style={{ background: '#0891B2', padding: 12, borderRadius: 14 }}>...</div>

// ✗ wrong — don't add new CSS files
<div className="my-card">...</div>
```

This is for design uniformity, not aesthetic preference. Don't fight it.

### Phosphor Icons with `weight="fill"`

```jsx
import { House } from '@phosphor-icons/react';
<House size={24} weight="fill" color="white" />   // ✓
<House size={24} />                                 // ✗ — defaults to outline
```

### Always use the `storage` wrapper

```js
import { storage } from '../utils/storage';
const state = storage.get();                    // ✓
storage.update({ xp: state.xp + 10 });          // ✓
localStorage.setItem('foo', 'bar');             // ✗ — bypasses migration logic
```

The wrapper handles default values, JSON serialization, and the legacy-key migration. Direct `localStorage` access skips all of that.

### Errors go through `reportError`, not `console.error`

```js
import { reportError } from '../utils/observability';

try { ... }
catch (e) { reportError(e, { where: 'MyComponent.handleClick' }); }   // ✓
catch (e) { console.error(e); }                                        // ✗ stripped in prod
```

Vite's production build drops all `console.*` calls (configured in `vite.config.js`). If you log a critical error to the console, it vanishes in production. Use `reportError()` so it reaches Sentry / the `client_errors` Supabase table.

### Translations only via `t()`

```jsx
import { useLanguage } from '../utils/useLanguage';

function MyComponent() {
  const { t } = useLanguage();
  return <h1>{t('home.welcome')}</h1>;        // ✓
  return <h1>Welcome</h1>;                     // ✗ unless it's an English-only label like a brand name
}
```

Add new strings to `src/utils/translations.js` — both `so` and `en` blocks.

### Admin edits content; design stays locked

When you add a new admin-editable field, ask: is this *content* (text users read, ordering of items, on/off flags) or *design* (colors, icons, layouts, animations)?

- **Content** → DB column + admin form input
- **Design** → hardcode it in the component or a constants file

Mixing the two leads to admins changing `bg: '#FF00FF'` and breaking the design system.

## 4. Common task walkthroughs

### 4.1 Add a translation string

1. Open `src/utils/translations.js`
2. Add the key in **both** the `so` block (top half) and `en` block (bottom half)
3. Use `{t('your_key')}` in the component

```js
// translations.js (Somali block)
'home.new_button': 'Riix halkan',

// translations.js (English block, far below)
'home.new_button': 'Tap here',
```

If you forget to add to one language, the other falls through (won't crash). But add both.

### 4.2 Edit lesson / phrase / exercise content (no code)

Use `/admin`. Login is gated by Supabase Auth and the admin email in `src/admin/adminConfig.js`. Once logged in:

- **Lessons tab** → edit lesson titles, exercises
- **Phrases tab** → feedback / encouragement / celebration
- **Word of Day** → daily vocab
- **Onboarding** → screen copy
- **Practice** → feature cards + exercises
- **Profile Setup** → the 4 setup screens

No deploy needed. Edits are visible to users on their next page load.

### 4.3 Add a new translation key + new admin-editable field

If you need a new field that admins should edit:

1. **DB** — add a migration file `supabase/migrations/YYYYMMDDHHMMSS_add_<field>.sql` with:
   ```sql
   alter table public.<table> add column if not exists <field> <type>;
   ```
2. Apply via Supabase SQL editor (until you upgrade to the CLI)
3. **Read path** — update the relevant `fetch*` function in `src/utils/dataService.js` to surface the new field (snake_case → camelCase)
4. **Write path** — add the input to `src/admin/<Table>Manager.jsx`
5. **Consume** — use the new field in the component that needs it
6. **ARCHITECTURE.md** — update §3 (data flow), §11 (admin scope), and add to the relevant section

### 4.4 Add a new lesson exercise type

(Hypothetical: the dispatch currently handles 5 types — choose, fillgap, order, listen, scenario.)

1. Create `src/exercises/NewTypeExercise.jsx`. Mirror the pattern of `ChooseExercise.jsx`. Component receives `data` and `onComplete(wasCorrect)`.
2. Update the type CHECK constraint via migration:
   ```sql
   alter table public.exercises drop constraint if exists exercises_type_check;
   alter table public.exercises
     add constraint exercises_type_check
     check (type in ('choose','fillgap','order','listen','scenario','newtype'));
   ```
3. Update the dispatch in `LessonPlay.jsx` (and `PracticeSession.jsx` if practice supports it):
   ```jsx
   case 'newtype': return <NewTypeExercise key={...} {...baseProps} />;
   ```
4. Update `fetchLessons` transformation in `src/utils/dataService.js` to handle any new fields the type uses
5. Add admin UI in `src/admin/ExerciseEditor.jsx` to set the new fields when type === 'newtype'
6. Add a test: copy `src/exercises/__tests__/ChooseExercise.test.jsx` and adapt
7. Update ARCHITECTURE.md §7

### 4.5 Add a new tracked event

```jsx
import { trackEvent } from '../utils/observability';
trackEvent('payment_started', { plan: 'plus' });
```

Events flow to Vercel Analytics → visible in the dashboard ~30 seconds later. Names are snake_case. Props are flat key/value.

If you add a meaningful funnel event, also update ARCHITECTURE.md §10 with the event name + when it fires.

### 4.6 Add a database migration

1. Create `supabase/migrations/YYYYMMDDHHMMSS_short_description.sql`. Filename uses 14-digit UTC timestamp (`date +%Y%m%d%H%M%S` in your shell).
2. Write idempotent SQL: `IF NOT EXISTS`, `IF EXISTS`, `CREATE OR REPLACE`, `ON CONFLICT DO NOTHING`. Never assume the migration is the first run.
3. Apply: paste the file's contents into Supabase → SQL Editor → Run. Verify the change.
4. Commit the file. The repo and live DB stay in sync.

When the project upgrades to the Supabase CLI (planned), step 3 becomes `supabase db push` and the SQL editor disappears from the workflow.

### 4.7 Add a test

Tests live alongside the code:

```
src/utils/__tests__/<name>.test.js          ← util tests (pure logic)
src/pages/__tests__/<Page>.test.jsx          ← page-level component tests
src/exercises/__tests__/<Exercise>.test.jsx  ← exercise component tests
src/__tests__/<feature>.test.jsx             ← cross-cutting tests
```

Use Vitest + Testing Library. Mock `supabase` and `observability` if the component touches them. Run with `npm test`.

What to test:
- **Pure functions in `utils/`** — yes, always.
- **Component logic that branches** (auth state, validation, retry-vs-practice mode) — yes.
- **Visual rendering** — no.
- **Component animations** — no.

Real-world examples: storage tests, ProfileSetup data-loss regression, DailyPractice dahab regression.

### 4.8 Change the admin email

Two places, both required:

1. `src/admin/adminConfig.js` — the `ADMIN_EMAILS` array
2. RLS policies in DB — every `admin write …` policy hardcodes the email

The README under `supabase/` has a script to rewrite all the policies in one go. Don't forget step 2 — it's silent: the admin login still works (step 1 lets them in), but writes will fail because RLS rejects them.

### 4.9 Bump a cache version

If you change the *shape* of fetched data (e.g. rename a field in `lessonData`):

1. Open `src/utils/DataContext.jsx`
2. Bump the relevant version constant: `CACHE_VERSION`, `PHRASES_CACHE_VERSION`, `PRACTICE_FEATURES_CACHE_VERSION`
3. Deploy

On their next visit, every user's stale localStorage cache is cleared and re-fetched fresh. Existing client state (XP, streak) is unaffected — version bumps only invalidate the data caches, not user state.

## 5. Things you must not do

- **Don't bypass `storage`** with raw `localStorage.setItem`.
- **Don't `console.log` and expect it to ship** — Vite drops console in production.
- **Don't write CSS files**. Inline styles only.
- **Don't add a new DB table without a migration file**. The repo must reflect the live schema.
- **Don't change the schema directly in the SQL editor** without writing the migration file too. The repo is the source of truth.
- **Don't hardcode secrets**. Use `import.meta.env.VITE_*`. The anon key is fine to expose; service role keys are not.
- **Don't run `git push --force` on `main`**. There's no recovery without backups.
- **Don't skip tests** by passing `--no-verify` or `.skip`. If a test is failing, fix the test or the code; don't quietly disable.
- **Don't change the admin email in only one place**.
- **Don't let `docs/ARCHITECTURE.md` go stale**. See `CLAUDE.md` for the rule.

## 6. Where to find help

| Question | Answer |
|---|---|
| How does the system work? | [ARCHITECTURE.md](./ARCHITECTURE.md) |
| How is the database structured? | `supabase/migrations/20260429000000_baseline.sql` |
| How do I run / deploy / test? | This doc, §1–2 |
| How do I add a feature? | This doc, §4 |
| What gotcha am I about to hit? | ARCHITECTURE.md §13 |
| Where's the admin email defined? | `src/admin/adminConfig.js` + every RLS policy |
| What does this Supabase column do? | Check the migration file or `dataService.js` transformation |

For anything not above: ask the project owner before guessing.

## 7. Quick reference: file structure

```
src/                      ← React app
  App.jsx                 ← routes + auth listener
  main.jsx                ← bootstraps
  components/             ← reusable UI
  exercises/              ← 7 exercise components
  pages/                  ← route-level components
  admin/                  ← /admin panel
  utils/                  ← logic, hooks, services
  data/                   ← hardcoded fallback content

supabase/
  migrations/             ← version-controlled DB schema
  README.md               ← migration workflow

docs/
  ARCHITECTURE.md         ← system overview
  CONTRIBUTING.md         ← this file

scripts/
  inject-sw-version.mjs   ← runs in build, sets SW cache name to git SHA

public/
  sw.js                   ← service worker
  manifest.json           ← PWA manifest
  audio/                  ← 140 lesson + WOTD audio files

CLAUDE.md                 ← AI agent instructions + doc maintenance rules
```

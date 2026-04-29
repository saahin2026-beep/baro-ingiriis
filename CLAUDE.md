# CLAUDE.md — Hadaling Project Context

## Project
Hadaling — Somali-to-English language learning PWA. Confidence-first pedagogy, Somali before English throughout.

**Live:** https://hadaling.vercel.app (legacy `baro-ingiriisi.vercel.app` redirects here)
**Admin:** https://hadaling.vercel.app/admin (Supabase Auth — admin email in `src/admin/adminConfig.js`)

## Stack
- React 18 + Vite + Tailwind CSS (using @tailwindcss/vite plugin)
- React Router v6
- Phosphor Icons (@phosphor-icons/react) — always use `weight="fill"`
- Font: Nunito (400/600/700/800)
- Audio: Howler.js with silent fallback
- Backend: Supabase (PostgreSQL + Auth + RLS)
- Client storage: localStorage
- PWA: vite-plugin-pwa + custom service worker at public/sw.js
- Deployment: Vercel

## Supabase
- **URL/Anon Key:** stored in `.env.local` (see `.env.example`). Vercel env vars: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.
- **Tables:** lessons, exercises, phrases, onboarding_content, profiles, admin_settings
- **Auth:** Email + password, email confirmations disabled
- **RLS:** Public read on content tables. Users read/write own profile.

## Design System
- Primary green: #4CAF50
- Dark green (auth screens): #1B5E20
- Border radius: 14px standard
- Buttons: green bg, white text, UPPERCASE, bold, rounded-14, fontWeight 800
- All inline styles (no CSS classes except Tailwind utilities in index.css)
- Font family on every text element: `fontFamily: 'Nunito, sans-serif'`
- Icons: Phosphor Icons, fill weight, each lesson has unique color
- Mascot: Geel the camel at /public/mascot/geel-happy.png

## Architecture
- **Data flow:** Supabase → localStorage cache → hardcoded JS fallback
- **DataContext** (src/utils/DataContext.jsx) wraps entire app, provides lessonData, phrases, onboardingContent via `useData()` hook
- **Language:** `useLanguage()` hook returns `{ t, lang, setLang }`. Default is Somali ('so'). Toggle in Astaanta page.
- **Auth gate:** LessonGuard in App.jsx redirects lesson 4+ to /auth-gate if not authenticated
- **Admin:** Password-protected at /admin. Tabs: Lessons, Phrases, Onboarding.

## File Structure
```
src/
├── App.jsx                    # Routes + LessonGuard
├── main.jsx                   # AppShell + ErrorBoundary + DataProvider
├── index.css
├── components/                # 14 reusable components
│   ├── AppShell, BottomNav, Confetti, ErrorBoundary
│   ├── ExerciseWrapper, FeedbackBanner, Geel, GreenTopBar
│   ├── OptionCard, PrimaryButton, ProgressBar, ProgressDots
│   └── SpeechBubble
├── exercises/                 # 7 exercise types
│   ├── ChooseExercise         # Main lessons + practice
│   ├── FillGapExercise        # Main lessons + practice
│   ├── OrderExercise          # Main lessons only
│   ├── ListenChooseExercise   # Main lessons only
│   ├── ScenarioExercise       # Main lessons + practice
│   ├── ScrambleExercise       # Practice only (new)
│   └── SentenceBuilderExercise # Practice only (new)
├── pages/                     # 13 pages
│   ├── Onboarding, Home, LessonIntro, LessonPlay, LessonComplete
│   ├── PracticeHub, PracticeSession, Progress
│   ├── Astaanta, About
│   ├── AuthGate, SignupPage, LoginPage, ProfileSetup
├── admin/                     # 7 admin components
│   ├── AdminPage, AdminAuth, AdminDashboard
│   ├── LessonManager, ExerciseEditor, PhraseManager, OnboardingManager
├── utils/
│   ├── storage.js             # localStorage wrapper with defaultState
│   ├── audio.js               # Howler.js player
│   ├── supabase.js            # Supabase client
│   ├── dataService.js         # Fetch lessons, phrases, onboarding from Supabase
│   ├── DataContext.jsx         # React context provider
│   ├── useLanguage.js          # Language hook
│   └── translations.js        # 200+ keys in SO and EN
└── data/
    ├── lessonData.js           # Hardcoded fallback (10 lessons, 50 exercises)
    ├── lessons.js              # Lesson list for home screen
    ├── phrases.js              # Hardcoded feedback/encouragement/celebration
    ├── practiceFeatures.js     # 6 practice modules (60 exercises)
    └── somaliCities.js         # 27 Somali cities for profile dropdown
```

## Routes
| Route | Component | Notes |
|-------|-----------|-------|
| / | Redirect | → /home or /onboarding/0 |
| /onboarding/:step | Onboarding | 7 screens (0-6) |
| /home | Home | Lesson list + stats |
| /lesson/:id | LessonIntro | Guarded: lesson 4+ requires auth |
| /lesson/:id/play | LessonPlay | Guarded |
| /lesson/:id/complete | LessonComplete | |
| /auth-gate | AuthGate | After lesson 3 |
| /signup | SignupPage | |
| /login | LoginPage | |
| /profile-setup/:step | ProfileSetup | 4 screens (0-3) |
| /progress | PracticeHub | 6 practice feature cards |
| /practice/:featureKey | PracticeSession | 10 exercises per feature |
| /progress/stats | Progress | Stats + growth rings |
| /astaanta | Astaanta | Profile + settings |
| /about | About | App info |
| /admin | AdminPage | Password protected |

## Key Conventions
1. **All text in Somali by default.** English only appears as the language being taught.
2. **App name is "Hadaling"** — use it everywhere user-facing. "Baro Ingiriis" / "Baro Ingiriisi" should NOT appear in UI, branding, or copy.
3. **Inline styles only** — no CSS modules, no styled-components. Every element gets a `style={{}}` prop.
4. **Phosphor Icons with fill weight** — never use outline weight.
5. **FeedbackBanner for correct/wrong** — bottom sheet pattern, green for correct, red for wrong.
6. **Exercise components accept `practiceMode` prop** — when true: show correct answer on wrong, auto-advance, no retry. When false (default): retry until correct.
7. **`onComplete(wasCorrect)` signature** — exercise components pass boolean to track accuracy in practice mode.
8. **Translations via `t('key')`** — from `useLanguage()` hook. Keys in src/utils/translations.js.
9. **Data via `useData()`** — from DataContext. Provides lessonData, lessonsList, phrases, onboardingContent, getRandomPhrase.
10. **Storage via `storage.get()` / `storage.update()`** — localStorage wrapper in src/utils/storage.js.

## localStorage Keys
onboardingComplete, intent, comfort, guestMode, currentLesson, lessonsCompleted, xp, streak, lastActiveDate, longestStreak, language, authComplete, profileComplete, userId, userName, username, userEmail, userPhone, userBirthday, userCity, practiceCompleted, practice_{featureKey}_progress

## Content Rules
- **Translates with language toggle:** nav, buttons, headers, modals, settings, auth, profile, home labels, lesson UI labels
- **Stays Somali always:** exercise content, feedback phrases, celebration phrases, lesson titles, chunks, city names
- **Feedback phrases** are brand personality — Somali slang that stays in both languages

## Curriculum
10 main lessons (5 exercises each): Is-barasho fudud, Weydiin xaalad fudud, Salaan edeb leh, Mahadsanid iyo jawaab, Weydiin magac, Xaggee ka timid?, Shaqo iyo nolol, Codsi caawimaad, Hubinta fahamka, Sagootin fudud

6 practice features (10 exercises each): Vocabulary, Plurals, Opposites, Word Formation, Verb Conjugation, Sentence Builder

## Documentation maintenance (READ BEFORE EVERY CHANGE)

`docs/ARCHITECTURE.md` is the source of truth for how this system works. It must stay current. Two rules — one proactive, one reactive — keep it that way.

### Rule 1 (proactive — before editing)

Before you edit a file that ARCHITECTURE.md references, **briefly verify the relevant section still matches the code**. If you find drift, fix the doc *before* you make the new change so the diff is clean. This is a targeted check — only the section(s) related to the file you're about to touch, not the whole doc.

The mapping below tells you which doc section each kind of file relates to. If the file you're editing isn't in this table, the doc probably doesn't reference it and no proactive check is needed.

| You're editing… | Verify these sections first |
|---|---|
| `src/App.jsx` | §3 Data flow, §4 Authentication flow |
| `src/utils/DataContext.jsx` | §3 Data flow, §5 Storage layer, §6 Caching |
| `src/utils/dataService.js` | §3 Data flow, §7 Exercise system |
| `src/utils/storage.js` | §5 Storage layer |
| `src/utils/streak.js`, `speedScore.js`, `dailyMix.js` | §8 Gamification |
| `src/utils/observability.js`, `ErrorBoundary.jsx` | §10 Observability |
| `src/admin/*Manager.jsx`, `AdminDashboard.jsx`, `adminConfig.js` | §11 Admin panel scope |
| `src/exercises/*Exercise.jsx`, `LessonPlay.jsx`, `PracticeSession.jsx` | §7 Exercise system |
| `src/pages/SignupPage.jsx`, `LoginPage.jsx`, `ProfileSetup.jsx`, `AuthGate.jsx`, `*PasswordPage.jsx`, `AccountSecurityPage.jsx` | §4 Authentication flow |
| `public/sw.js`, `public/manifest.json`, `vite.config.js` | §9 Service worker / PWA |
| `supabase/migrations/*` | §3 Data flow, §5 Storage layer |
| `vitest.setup.js`, `src/**/__tests__/*` | §12 Testing strategy |

### Rule 2 (reactive — same commit)

When you make a change that affects architecture, update the relevant section of ARCHITECTURE.md **in the same commit**. Not as a follow-up. Not as a TODO. Same commit.

| Change | Update section |
|---|---|
| New / removed file in `src/` | File map (bottom of doc) |
| New / removed `useData()` field, fetch function, or DB table | §3 Data flow + §5 Storage layer + §11 Admin scope |
| Auth flow change (signup, login, password reset, gating) | §4 Authentication flow |
| New `localStorage` key, cache version bump, storage migration | §5 Storage layer + §6 Caching |
| New exercise type, change to exercise schema, change to dispatch | §7 Exercise system |
| Change to XP / dahab / streak math, new milestone, new freeze rule | §8 Gamification |
| Service worker behavior change, manifest change | §9 Service worker / PWA |
| New tracked event, new error report path, Sentry / analytics change | §10 Observability |
| New admin tab, new admin-editable field, new design lock | §11 Admin panel scope |
| New test pattern, new mocking convention | §12 Testing strategy |
| New gotcha discovered (especially silent footguns) | §13 Common pitfalls |
| New common task that isn't obvious | "Where to make changes" table at the bottom |

If a change spans multiple sections, update all of them. If in doubt, update — a slightly-stale doc is better than a doc that's lost trust.

When you write a commit message for an architectural change, mention the doc update in the body so reviewers can confirm.

### What "verify" means in Rule 1 (concretely)

Open ARCHITECTURE.md, jump to the relevant section, scan it (≤2 minutes), ask: "is anything here outdated or contradicted by the current state of the code I'm about to edit?" If yes, fix the doc. If no, proceed with the edit.

This is not "re-read the whole doc every session" — that's overkill. It's a 30-second check on the 1–2 sections that touch the file you're working in.

## Common Tasks
- **Add a new lesson:** Use /admin → Lessons tab → + Add Lesson. No code deploy needed.
- **Edit exercise:** /admin → Lessons → click Exercises on a lesson → Edit
- **Edit phrases:** /admin → Phrases tab → pick category → Edit/Add
- **Edit onboarding:** /admin → Onboarding tab → pick screen → edit fields → Save
- **Deploy:** `npm run build && vercel --prod`
- **Clear user state for testing:** `localStorage.clear(); sessionStorage.clear(); location.href = '/';`

## Do NOT
- Add loading screens or spinners — app loads instantly from cache
- Use CSS modules or external stylesheets — inline styles only
- Use outline weight for icons — fill weight always
- Change exercise content in code — use the admin dashboard
- Use "Ingiriisi" — always "Ingiriis"
- Translate feedback phrases — they stay Somali in both language modes
- Delete lessonData.js or phrases.js — they're the last-resort fallback

# Maya-Duels UI — project notes

## What this is
Maya-Duels V3 design/UI implementation: a Vite + React + TypeScript + Tailwind
SPA that implements `productDocs/MayaDuels-UI.md` (visual/design source of truth)
against the product rules in `productDocs/MayaDuels-ProductEngineering.md`.

**Scope: frontend/design only.** No backend, no real matchmaking, no persistence
beyond `localStorage`. All opponents and match data are simulated locally.

## Commands
- `npm run dev` — dev server (Vite, binds 127.0.0.1)
- `npm run build` — `tsc --noEmit` + production build
- `npx tsx scripts/smoke.ts` — headless logic smoke tests (scoring, deck, duel, divisions)

## Architecture map
- `src/lib/` — pure logic: `domains.ts` (6 arenas + Omni), `questions.ts` (question
  bank + `buildDeck`), `scoring.ts` (brief §8.1 formula), `duel.ts` (round lifecycle),
  `motion.ts` (tokens), `audio.ts` (procedural WebAudio + haptics), `demoData.ts`.
- `src/three/` — procedural 3D objects (`objects.tsx`), shared materials
  (`materials.ts`), lazy canvas (`HeroCanvas.tsx`).
- `src/components/` — design system: `HeroStage` (3D + SVG fallback), `ArenaCarousel`
  (signature center-focus drag carousel), `DuelHud`, `AnswerTile`, `QuestionStage`,
  `IdentityCapsule`, `FloatingDock`, `Charts`, `Page`, `Button`.
- `src/screens/` — one file per screen from the brief.
- `src/state/AppState.tsx` — context store, persisted to `localStorage` key
  `mayaduels.v3.state`.

## Invariants worth preserving
- A duel is **always exactly 8 rounds**; `buildDeck` tops up from the full bank if a
  domain pool is ever short, and `DuelScreen` bails out if a question is missing.
- Arena Rival matches are **never rating-eligible** (`ratingEligible === false`) and
  never show a BOT/AI label — per brief §0.1 and product law 3.
- No replay UI or replay data anywhere (product law 1).
- Correct choice is never rendered before round resolution.
- 3D must degrade gracefully: `useShouldRender3D` disables WebGL under reduced
  motion, low-effects mode, narrow viewports, data-saver, or missing WebGL, and
  `HeroStage` renders an authored SVG glyph instead.

## Gotchas
- `vite.config.ts` uses `fileURLToPath` for the `@` alias — needs `@types/node`.
- The Three.js bundle is code-split into `HeroCanvas`; don't import it eagerly.
- `src/index.css` uses `!important` inside the reduced-motion block only (intentional).
- Dev server must bind `127.0.0.1` (PRoot sandbox); never `0.0.0.0`.
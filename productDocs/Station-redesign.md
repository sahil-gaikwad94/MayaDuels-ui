# MayaDuels Arcade — frontend experience

The original briefs establish the product loop: choose a domain, play eight timed rounds against a rival, then compare both players’ answers and save useful explanations. This redesign keeps that loop and changes how a player discovers, starts, and revisits it.

## Design decisions
- **Arcade floor, not a dashboard.** One action starts Blitz. Six illustrated cartridges open domain dossiers. Desktop players use a persistent play/player rail; phone players swipe the shelf and use a thumb dock, with secondary routes in the menu.
- **A visual object for each job.** A joystick launches a game; a cartridge explains its domain; a player pass previews a handle and starter arena; an admission ticket shows queue progress; a receipt records a finished duel. Rendered toy objects are compressed local WebPs, not a GPU requirement.
- **A different pace during play.** The match removes application navigation, keeps the round number and scores visible and locks answers until resolution. The review separates responses from explanations. There is no replay UI.
- **Progress that survives navigation.** Daily Anomaly uses a UTC-day-seeded five-question deck with saved responses. Match history retains up to 25 completed local match records, each linked to its own Q&A. Vault empty states explain how to start collecting instead of simulating a player's progress.
- **Reference translation.** The supplied references inform oversized tactile objects, compact controls, browsable collectibles, and a strong single action. Warm paper, ink, orange, and arena-specific pastel stock deliberately replace the previous dark lobby in this iteration.

## Scope and verification
React Router, local browser storage, Motion, and Lucide remain the implementation base. There are no accounts, remote matchmaking, online leaderboards, or backend services. Exhibition standings remain demo data. Font and art assets are served locally.

Checks: TypeScript / Vite production build, existing scoring and deck smoke tests, Chromium desktop and phone navigation, player-pass setup, queue cancellation, eight-round match completion, result/archive navigation, and daily puzzle resumption.

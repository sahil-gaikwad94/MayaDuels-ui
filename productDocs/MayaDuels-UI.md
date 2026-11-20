# MAYA-DUELS V3 — Complete Visual Design, 3D Art, UI/UX & Experience Specification

**Document type:** End-to-end design system + visual direction + 3D asset bible + interaction/motion specification + screen requirements  
**Version:** 3.0  
**Status:** Design and frontend implementation source of truth  
**Audience:** Product designer, UI/UX designer, 3D artist, motion designer, frontend/mobile engineer, creative technologist and coding agents  
**Companion document:** `MayaDuels_V3_Product_Gameplay_Algorithms_and_Systems_Brief.md`  
**Primary visual reference:** The two-phone reference image supplied in the conversation (Humbleteam / Lay.The.Designer app composition)  
**Brand constraint:** Preserve Maya-Duels' original brandkit; do not replace it with the reference app's blue palette or invent a new neon palette.

---


## Contents

- [0. Design mandate](#0-design-mandate--what-is-being-borrowed-and-what-is-not)
- [1. Visual identity and brand rules](#1-visual-identity-and-brand-rules)
- [2. Experience principles](#2-experience-principles)
- [3. Layout system, grid and sizing](#3-layout-system-grid-and-sizing)
- [4. Typography and hierarchy](#4-typography-and-information-hierarchy)
- [5. Reference-inspired layout language](#5-signature-layout-language-inspired-by-the-reference)
- [6. Screen-by-screen UX specification](#6-complete-screen-by-screen-ux-specification)
- [7. Maya-Duels component library](#7-maya-duels-component-library)
- [8. 3D asset bible](#8-the-3d-asset-bible--core-visual-differentiator)
- [9. Motion and interaction choreography](#9-motion-design-and-interaction-choreography)
- [10. Sound and haptics](#10-sound-and-haptics)
- [11. Frontend architecture and library strategy](#11-frontend-architecture-and-library-strategy)
- [12. Responsive, accessibility and low-end-device behavior](#12-responsive-accessibility-and-low-end-device-behavior)
- [13. Performance budgets and visual QA](#13-performance-budgets-and-visual-qa)
- [14. Design production deliverables](#14-design-production-deliverables)
- [15. Recommended implementation order](#15-recommended-implementation-order)
- [16. Reference research and official documentation](#16-reference-research-and-official-implementation-documentation)
- [17. Final design direction](#17-final-design-direction)

# 0. Design mandate — what is being borrowed, and what is not

Maya-Duels must adopt the **visual composition, content hierarchy, spatial depth, 3D asset confidence, card treatment and tactile consumer-app experience** of the supplied reference, while retaining Maya-Duels' own identity.

The reference is not a colour reference. It is a composition and experience reference.

## 0.1 What to take from the reference

1. **Floating identity header:** a compact, rounded identity/control capsule near the top rather than a traditional dense toolbar.
2. **Large hero metric:** one number or status has clear visual priority and creates an immediate sense of progress.
3. **Hero object composition:** a large, playful, polished 3D illustration made from multiple objects, with depth, tilt, overlap and deliberate negative space.
4. **Center-focused horizontal carousel:** one active card in the centre, adjacent cards partially visible, a clear pagination indicator and a satisfying swipe interaction.
5. **Capsule search and filters:** a floating search control plus horizontal category chips.
6. **Featured information card:** one strong featured action or event card below the hero area.
7. **Floating bottom navigation:** a detached rounded dock that feels like a physical UI object rather than a standard flat tab bar.
8. **Consumer-app personality:** the experience feels inviting, expressive, tactile and well art-directed—not like a settings dashboard or developer admin panel.

## 0.2 What not to copy

- Do not copy the reference's blue background, white palette, typography, content, icons or visual identity.
- Do not use generic finance/loyalty-app layouts without adapting their hierarchy to a game.
- Do not replace Maya's original colours with pastel blue, electric blue, fluorescent pink, purple or lime.
- Do not turn every surface into glassmorphism.
- Do not cover the interface in neon outlines, glowing tubes, scanlines, glitch effects or HUD decoration.
- Do not use stock 3D clip-art, random AI-generated objects with inconsistent materials, or six unrelated illustration styles.
- Do not make the live duel as visually busy as the home screen.

## 0.3 Maya-Duels' design thesis

**A premium, tactile, playful engineering arcade with a dark, refined brand foundation and bold, characterful 3D objects.**

It should feel like a contemporary consumer gaming product designed by a strong creative studio—not a generic cyberpunk dashboard, not a quiz template and not a cartoon learning app.

The 3D objects are essential to the identity. They should be cool, fun, dimensional and memorable. They are not optional garnish to be replaced by generic icons when a screen is being implemented.

---

# 1. Visual identity and brand rules

## 1.1 Original brandkit — preserve it

The existing Maya-Duels brandkit is the source of truth. The design system can refine token names and semantic roles, but it must not replace the palette.

| Token | Original value | Primary use |
|---|---|---|
| `brand.canvas` | `#090A0F` | Main app canvas / deepest background |
| `brand.surface` | `#11141C` | Primary card and panel surface |
| `brand.surface-raised` | `#181D28` | Raised panels, cards and active surfaces |
| `brand.border-subtle` | `rgba(255,255,255,0.08)` | Hairline structural separation |
| `brand.text-primary` | `#F4F6FA` | Primary text |
| `brand.text-secondary` | `#A9B1C2` | Supporting text |
| `brand.cyan` | `#00F5D4` | Signature Maya accent: selected state, flow, success and key action emphasis |
| `brand.magenta` | `#FF2A85` | Rare high-intensity accent: Overdrive, clutch and selected premium moments |
| `brand.amber` | `#FFB800` | Warning, urgency and special status |
| `brand.error` | `#FF5C67` | Incorrect/error state (semantic; use consistently) |

The V2 system also experimented with slightly altered cyan/rose values. This V3 brief intentionally returns to the original V1 brand values as the brand anchor. `#181D28` is only a supporting neutral surface extension derived from the existing graphite/obsidian system, not a new accent colour. If production source files contain finalized brand tokens that differ, inspect them before implementation and reconcile deliberately—do not silently introduce another palette.

## 1.2 Colour usage ratios

These are directional targets, not pixel-count requirements:
- 65–75% deep canvas and dark surfaces.
- 15–25% neutral text, cards and supporting content.
- 5–10% cyan accent and illuminated active states.
- Magenta appears in a small number of special moments, not as a second primary colour.
- Amber and red are semantic, not decorative.

Cyan should feel like Maya's signature material. It should not appear as a bright outline around every component. Magenta should be rare enough that Overdrive genuinely feels different.

## 1.3 Cyber-futuristic character without the cliché

Create the futuristic feel through:
- Expressive 3D objects with beautiful geometry and material contrast.
- Layered compositions, scale, tilt, overlap and depth.
- Restrained edge reflections and soft, local illumination.
- Technical micro-details in the assets (ports, pins, engraved labels, signal paths, cutaways).
- Precision typography and small telemetry labels.
- A controlled kinetic language: snap, settle, spring, reveal and lock.
- Occasional holographic/translucent components, used as material choices rather than a universal UI treatment.

Do not rely on:
- Constant neon glow.
- Full-screen gradients.
- Purple/pink colour washes.
- Repeating hexagons, circuit traces or grid backgrounds everywhere.
- Fake terminal text and random numbers.
- Excessive glitch effects.

## 1.4 Surface and material system

Create a small, consistent material library:

| Material | Character | Use |
|---|---|---|
| Obsidian matte | Deep, soft, low-reflection black | Main canvas and quiet panels |
| Graphite ceramic | Slightly textured dark neutral | Main UI cards and arena plates |
| Smoked glass | Dark transparent material with controlled reflections | Floating header, navigation dock, selected overlays |
| Brushed titanium | Fine directional metallic highlight | 3D machinery, chips, server parts and trophy details |
| Satin aluminium | Softer silver reflection | Supporting floating objects and rims |
| Clear acrylic | Transparent, slightly tinted, light-catching | Select 3D layers, lenses and concept tokens |
| Soft rubber | Matte, tactile, slightly rounded | Physical control-inspired object details |
| Cyan emissive | Restrained light source | Signal points, selected object core, confirmation |
| Magenta emissive | Rare energetic state | Overdrive-only details |

Do not make every 3D object chrome. Contrast between matte, polished, translucent and soft-touch surfaces is what makes assets feel authored rather than like generic metallic renders.

---

# 2. Experience principles

## 2.1 Consumer app first, engineering content second

The user should not feel as if they opened an internal engineering dashboard. The information is technical; the interaction is an approachable game.

- Use clear, familiar navigation.
- Make the first action obvious.
- Present technical terminology only where it is the content being tested.
- Separate decorative detail from functional telemetry.
- Make the game discoverable through strong visual cards and recognizable domain objects.

## 2.2 One dominant idea per viewport

Every screen must have one clear primary focus. Examples:
- Home: the active arena and Enter Blitz action.
- Arena discovery: the selected domain's 3D hero identity.
- Duel: the question and four answer choices.
- Results: outcome and the next best action.
- Q&A history: the two players' answers and the correct explanation.

Do not let a header, streak, ticker, carousel, cards and multiple promotional banners compete equally.

## 2.3 Strong hierarchy, calm surfaces

Use a deliberately restrained UI around the expressive 3D illustrations. The objects create personality; the UI makes the product usable. A screen should not need a glowing border on every card to feel futuristic.

## 2.4 3D should carry meaning

Every hero object needs a semantic connection to its domain or action. It must not be a random floating decorative object. If a user sees a neural processor, server cluster, storage structure or shield, it should reinforce the content category.

## 2.5 The duel has a different intensity level

Home and discovery can be expressive, layered and animated. During a ranked match:
- Remove unnecessary ambient movement.
- Keep the question and answers dominant.
- Use only small state-driven effects.
- Preserve stable visual anchors.
- Never let a 3D scene reduce tap precision or obscure text.

---

# 3. Layout system, grid and sizing

## 3.1 Mobile-first canvas

Design primarily for portrait mobile screens and one-thumb interaction. Include compact-height devices, large devices, notched devices and Android gesture/navigation areas.

Starting layout rules:
- Use a 4-point base spacing scale.
- Keep consistent horizontal safe-area insets.
- Use a maximum readable width for long text.
- Keep all critical duel controls above the home-indicator / Android gesture region.
- Allow scroll only where content exceeds the viewport; the live duel should not require scrolling.

## 3.2 Suggested spacing scale

`4, 8, 12, 16, 20, 24, 32, 40, 48, 64`

Do not create arbitrary one-off spacing values without a reason.

## 3.3 Shape language

A consistent rounded-rect language, but not every element with the same radius:
- Capsules: identity pill, search, chips, compact status and primary button.
- Medium rounded cards: question content, featured cards, Q&A groups.
- Large rounded cards: arena hero and domain cards.
- Circular forms: avatars, rating rings, progress and compact status.
- Custom silhouette: 3D objects, trophy, arena emblems and collectible art.

Radius should follow component role and size. Avoid the “everything is a pill” look.

## 3.4 Layering and depth

Use three clear UI elevation levels:
1. Canvas/background.
2. Main cards and content surfaces.
3. Floating controls, identity capsule, navigation dock and overlays.

Depth can come from subtle shadows, surface contrast, blur in limited contexts and object layering. Avoid thick shadow stacks and excessive blur which reduce text sharpness.

---

# 4. Typography and information hierarchy

## 4.1 Typography roles

- **Display:** rounded/geometric contemporary sans-serif for key hero numbers and screen titles.
- **UI body:** highly readable sans-serif for labels, descriptions, buttons and explanations.
- **Telemetry:** JetBrains Mono for rating values, timers, score, round index and compact technical metadata.

Use the brand's approved font files and licensing. Do not add a novelty cyberpunk display font for general text.

## 4.2 Numeric presentation

Numbers are central to the product but should not make the interface look like a trading terminal.
- Use tabular numerals for rating, timer and score.
- Keep number labels clear: “Your rating,” “+18 this week,” “R4 / 8.”
- Use count-up only for meaningful result changes.
- Never animate every numerical value continuously.

## 4.3 Content typography

- Prompt: largest text inside the duel card after the timer/round context.
- Options: large enough to tap and scan quickly.
- Explanations: comfortable line height, not condensed monospace.
- Technical identifiers/code tokens: monospace only for the token itself, not whole paragraphs.

---

# 5. Signature layout language inspired by the reference

This section translates the supplied two-phone visual reference into Maya-Duels' information architecture.

## 5.1 Floating identity capsule

A floating, rounded profile capsule near the top of the home and discovery screens.

Contents:
- Avatar or earned identity icon.
- Greeting or handle.
- Compact rank/domain rating indicator.
- Notification entry (only if notifications are active in the product).
- Settings or profile shortcut.

Behavior:
- Entire capsule can open profile/identity.
- Notification and settings are separate explicit hit areas.
- On scroll, it may compact into a smaller fixed header.
- It must not overlap the device status bar or interfere with safe areas.

Appearance:
- Dark graphite or smoked-glass surface.
- Very subtle border and shadow.
- Cyan used for selected/active status, not as a permanent glowing outline.

## 5.2 Hero metric block

The reference uses a very large balance number. Maya uses a meaningful player metric:

Possible primary hero content:
- Current domain rating.
- Global/overall rating only if the product has a valid calculation.
- Weekly rating movement or mastery progress.
- “Provisional rating” until sufficient human-ranked data exists.

Do not show a meaningless number simply to imitate the reference. The metric must be labelled and honest.

## 5.3 Central 3D arena carousel

The home screen's signature feature.

- Active domain card centred and visually dominant.
- Adjacent cards visible at the edges, indicating horizontal continuity.
- Each domain has a distinctive 3D hero asset.
- The 3D asset is partly outside/above the card's visual bounds to create depth, but never overlaps essential text or controls.
- Active card scales and moves forward subtly; inactive cards recede.
- Swiping uses inertial movement followed by a firm spring snap.
- Pagination shows position without competing with the CTA.
- The selected domain drives the primary Enter Blitz action.

This should not be a basic horizontal list of flat cards. It is an art-directed carousel with custom 3D objects and a clear selection state.

## 5.4 Arena discovery composition

Adapt the reference's second phone:
1. Compact identity capsule and back/navigation affordance.
2. Large page title such as “Arenas”.
3. Floating search capsule.
4. A hero 3D composition assembled from 2–4 relevant objects.
5. Horizontal category chips.
6. One featured arena/challenge card.
7. Floating bottom navigation.

The 3D composition should tell the story of the selected domain (e.g. neural core + tensor blocks + connected node objects), not merely display the domain icon enlarged.

## 5.5 Floating bottom dock

Maya's four primary destinations:
- Arena
- Vault
- Ranks
- Identity

Behavior:
- Floating detached capsule with stable placement above safe-area inset.
- Active item clearly distinguished using a subtle filled/highlight state and brand cyan marker.
- Inactive icons remain calm, high contrast and consistent.
- Labels remain visible where space permits; do not make the dock icon-only without usability testing.
- The dock must not obscure scroll content, CTA buttons or duel controls.
- During the live duel, use a match-specific layout; the normal dock disappears.

---

# 6. Complete screen-by-screen UX specification

The following sections define screen goals, hierarchy, required content, interaction and states. Detailed appearance should follow the companion brand tokens and 3D art direction.

## 6.1 First launch / instant entry

**Goal:** let the user understand Maya-Duels and start a playable session quickly without a forced account wall.

Flow:
1. Short brand/identity reveal.
2. One-line promise: test engineering instincts in fast duels.
3. Choose or skip a starting domain.
4. Start a short calibration set.
5. Show a provisional starting level, not an unsupported percentile.
6. Offer account linking to preserve progress, handle and history.

Requirements:
- Explain why account linking matters.
- Anonymous user state must survive app relaunch where feasible.
- Domain selection can be changed later.
- Do not ask for unnecessary profile information before the first match.
- Provide loading, retry and offline states.

## 6.2 Home / Arena Hub

**Primary goal:** get a player into Blitz.

Hierarchy:
1. Floating identity capsule.
2. Rating / weekly progress hero.
3. Centred 3D arena carousel.
4. Large Enter 60s Blitz CTA.
5. Secondary feature card: Daily Anomaly or current featured challenge.
6. Compact secondary entry: Weakness Blitz / continue learning (when relevant).
7. Floating four-item bottom dock.

Functional behavior:
- Swiping the carousel changes selected domain.
- Tapping an adjacent card selects it; tapping the active card opens arena details.
- Enter Blitz uses the currently selected domain.
- Omni-Blitz may be a separate carousel selection or a clearly labelled “All arenas” choice; do not hide it in a confusing gesture.
- A new user sees “provisional” rating language until enough ranked matches exist.
- If Daily Anomaly is not available, do not show an empty placeholder.

States:
- New account / provisional rating.
- Returning player.
- No history.
- No internet.
- Content loading failure.
- All domain content exhausted (should be prevented by deck service).

## 6.3 Arena discovery

**Goal:** let users explore domains and find a challenge without creating a dense taxonomy page.

Hierarchy:
- Floating header capsule.
- Title and optional subtitle.
- Search capsule for domain/subtopic.
- Featured 3D domain composition.
- Category filters: All, AI/ML, Infra, Data, Web, Core CS, Security.
- Featured arena/challenge card.
- Supporting arena cards or subtopic collections.
- Bottom dock.

Search behavior:
- Search domain names, subtopics and concept labels.
- Show recent searches only when useful.
- Empty state suggests popular categories without inventing popularity statistics.
- Search results are accessible as a list; not all results need 3D assets.

## 6.4 Domain detail

Include:
- Domain title and signature 3D hero object.
- Short description that communicates what the arena tests.
- Rating and mastery summary.
- Topic clusters.
- Recommended challenge or Enter Arena CTA.
- Recent performance summary if available.

Keep domain detail actionable. Avoid turning it into a curriculum or long course page.

## 6.5 Matchmaking

**Goal:** make waiting feel intentional and short without lying about queue status.

Content:
- Selected arena.
- Player's rating/provisional status.
- Animated arena/core activation.
- A clear cancel control.
- Optional “while you wait” micro-concept only if it does not interrupt or reset the queue.

Rules:
- Do not show fake user counts or fake queue positions.
- Do not fabricate an opponent's online/typing status.
- Do not show BOT/AI labels for Arena Rival fallback.
- Use a neutral rival identity and abstract avatar; do not invent employer, college or verified identity.
- If the queue is slow, explain the state honestly without blaming the user.

## 6.6 Duel arena

**Goal:** one-thumb, fast, focused decision making.

Priority hierarchy:
1. Round status and timer.
2. Player and opponent score/identity.
3. Main question/mechanic content.
4. Four answer choices.
5. Small round progress indicator.

Requirements:
- Four large thumb-friendly choices.
- Minimum tap target size should follow platform accessibility guidance (target at least 44pt iOS / 48dp Android where practical).
- No scrolling during a standard round.
- Respect safe areas and large text settings without hiding choices.
- Selected choice locks immediately and communicates the lock.
- No second tap can alter the locked answer.
- Opponent status never reveals answer choice/correctness early.
- Ambient 3D is paused or reduced substantially during decision time.

Question mechanic variants:
- Triad: clue tokens converge into a concept prompt.
- Triage: compact telemetry/scenario card, optional mini-topology.
- Knob: parameter slider/dial is illustrative; the answer is still a single tap unless a future mode explicitly changes the mechanic.
- Mythbuster: statement plus fault choices.

## 6.7 Round resolution

Show:
- Correct answer.
- Player's choice and correctness.
- Opponent's choice after permitted resolution.
- Both response times and points for the round.
- Brief mechanism-level explanation where it can be parsed quickly.

Do not force a full explanation paragraph between every question. Allow the player to continue promptly; detailed learning belongs in the match Q&A view.

## 6.8 Match result

Hierarchy:
1. Win / loss / draw.
2. Final score comparison.
3. Rating delta if match is eligible; otherwise show relevant provisional/practice progress honestly.
4. Streak, division or mastery milestone if earned.
5. Primary actions: Review Q&A, Rematch, Queue next.

No replay, kill-cam, replay timeline or simulated playback.

Result states must cover:
- Human ranked result.
- Arena Rival result without player-facing bot label.
- Draw.
- Void match.
- Provisional placement.
- Rating unchanged / ineligible match.

## 6.9 Match History list

Each row/card includes:
- Opponent display identity.
- Arena/domain.
- Date/time.
- Result and final score.
- Rating change if eligible.
- Short mastery/XP signal if useful.

Filters:
- All, wins, losses, draws.
- Domain.
- Date range (later if not needed at MVP).

Avoid adding replay thumbnails or play icons. The primary interaction opens Q&A detail.

## 6.10 Match Q&A detail

This is a signature functional screen.

For each of the eight rounds:
- Round number and mechanic.
- Question prompt and any diagram.
- Four choices with stable labels.
- **Your answer** with state.
- **Opponent's answer** with state.
- **Correct answer**.
- Both response times.
- Both round point totals.
- Short explanation / mental-model card.
- Save concept/question to Vault.

On mobile, use stacked comparison lanes or a compact two-column comparison only if text remains readable. Do not shrink technical answer labels until they become illegible.

Filters/navigation:
- Jump to missed rounds.
- Show all rounds.
- Expand/collapse explanation.
- Save/unsave.

The content is a static historical result record. It must not animate answers as if reconstructing the original match.

## 6.11 Knowledge Vault

Content groups:
- Saved questions/concepts.
- Missed concepts.
- Due for review.
- Recently mastered.
- Domain filters.

Each learning card:
- Concept name.
- One-sentence principle.
- Why it matters.
- Optional comparison matrix.
- Review state / due date.
- Start review action.

Do not make the Vault resemble a cluttered file manager. Prioritize the next useful learning action.

## 6.12 Ranks

Views:
- Global.
- Country/region only with enough population.
- Domain-specific.
- Friends/teams when social graph exists.
- Turf Wars only in a later phase.

Show:
- Rank/division.
- Rating.
- Match count.
- Rating confidence/provisional treatment as appropriate.
- Movement over time.

Never imply a user is in a percentile without valid population coverage. Avoid ranking new users with very high uncertainty as if their rating were settled.

## 6.13 Identity / profile

Show:
- Avatar / frame.
- Handle and title.
- Domain ratings and mastery.
- Achievements.
- Match and win statistics.
- Equipped nameplate/theme.
- Recent achievements or milestones.

Avoid a giant radar chart as the only summary. A six-axis radar may be a supporting visualization, paired with readable domain scores and plain-language insight.

## 6.14 Locker / cosmetics

Categories:
- Nameplates.
- Avatar frames.
- Titles/tags.
- Arena themes.
- Victory banners.
- Sound packs.

Every cosmetic needs:
- Clear preview.
- Rarity or unlock method (if relevant).
- Owned/locked/equipped state.
- No gameplay-stat modifications.

## 6.15 Daily Anomaly

- Shared five-step challenge.
- Daily completion status.
- Personal time and score.
- Spoiler-safe share card.
- Leaderboard/percentile only after minimum sample threshold.
- Reset time displayed in local and canonical timezone where needed.

## 6.16 Settings and accessibility

- Sound volume / mute.
- Haptics.
- Reduced motion.
- Data saver / low effects mode.
- Text size / accessibility options.
- Privacy controls.
- Account linking/deletion.
- Notifications.
- Language (when supported).

---

# 7. Maya-Duels component library

Build a single coherent library with design tokens, component anatomy, variants, states and accessibility contracts. Do not combine multiple UI kits with inconsistent spacing, radius, type and interaction defaults.

## 7.1 Foundations

- Colour and semantic state tokens.
- Typography and number styles.
- Spacing and grid.
- Radius and elevation.
- Icon style.
- Motion tokens.
- 3D asset/material tokens.
- Sound and haptic tokens.

## 7.2 Navigation and identity components

| Component | Variants / states | Required behavior |
|---|---|---|
| `IdentityCapsule` | Expanded, compact, pressed, loading | Opens identity; separate notification/settings targets. |
| `FloatingDock` | Arena, Vault, Ranks, Identity active states | Clear active item; safe-area-aware; never covers content. |
| `PageHeader` | Root, back, title-only, title+action | Consistent hierarchy and navigation affordance. |
| `AvatarToken` | Default, frame, rank, fallback | Uses safe image loading and accessible label. |
| `RankPill` | Provisional, ranked, promoted | Clear semantics; does not imply unsupported percentile. |

## 7.3 Discovery components

| Component | Variants / states | Required behavior |
|---|---|---|
| `ArenaCarousel` | Home, compact, discovery | Gesture-driven snap; keyboard/accessibility alternatives on web. |
| `ArenaHeroCard` | Six domains + Omni | Selected/unselected/disabled/loading. |
| `ArenaObjectStage` | Static, idle, selected, low-power | Hosts the relevant 3D asset and fallback. |
| `CategoryCapsule` | Default, active, disabled | Horizontal chip interaction and clear focus. |
| `SearchCapsule` | Idle, focused, typing, results, empty | Search domains, topics and concepts. |
| `FeaturedChallengeCard` | Daily, event, new content, locked | Clear action and status. |
| `RatingHero` | Overall/domain/provisional | Number and context; no false precision. |

## 7.4 Gameplay components

| Component | Variants / states | Required behavior |
|---|---|---|
| `DuelHeader` | Normal, late round, Overdrive | Score, opponent state, timer and round position. |
| `PlayerMiniCard` | Self/opponent | Stable identity, no fake live indicators. |
| `RoundTimer` | Normal, warning, expired | Mirrors server deadline; accessible text status. |
| `RoundProgress` | 1–8, resolved, current | Clear progress without competing with prompt. |
| `QuestionStage` | Triad, Triage, Knob, Mythbuster | Shared content contract with mechanic-specific layout. |
| `ClueToken` | Default, revealed, selected | Short clue text and clear relation. |
| `TelemetryStrip` | Neutral, warning, critical | Readable metrics and semantic status. |
| `ParameterControlVisual` | Low, high, changing | Primarily illustrative in ranked MVP; no accidental multi-step input. |
| `AnswerTile` | Idle, pressed, locked, correct, incorrect, disabled | Large tap target and accessible state. |
| `OpponentLockStatus` | Thinking/locked/resolved | Does not reveal answer or fake human behavior. |
| `ScoreTicker` | Static, increase, decrease if any future mode | Animated only when value meaningfully changes. |
| `StreakIndicator` | 1x, 1.1x, 1.2x | Clear progression; no excessive glow. |
| `OverdriveMarker` | Upcoming, active, resolved | Distinct but consistent with brand. |

## 7.5 Results and learning components

| Component | Variants / states | Required behavior |
|---|---|---|
| `MatchOutcomeHero` | Win, loss, draw, void, practice | Clear result without replay imagery. |
| `ScoreComparison` | Equal, lead, win/loss | Shows final scores and outcome. |
| `RatingDelta` | Positive, negative, unchanged, provisional | Explain what changed and why. |
| `RoundQACard` | Correct, missed, timeout, both correct, rival timeout | Static comparison record, not a replay. |
| `AnswerComparisonLane` | Self/opponent | Clearly separates selection and correctness. |
| `MentalModelCard` | Collapsed/expanded/saved | One-line concept, core mechanism, trade-off. |
| `VaultSaveButton` | Save/saved/loading | Idempotent state and feedback. |
| `ReviewDueCard` | Due, overdue, mastered | Clear next action without shame language. |

## 7.6 Profile and reward components

- `DomainMasteryTile`.
- `DomainRadar` (optional secondary visualization).
- `AchievementBadge`.
- `CosmeticPreview`.
- `NameplateCard`.
- `DivisionProgress`.
- `StreakSummary`.
- `LeaderboardRow`.
- `Season/ChallengeCard` (later).

## 7.7 Shared component contract

Every component should define:
- Purpose and when to use it.
- Anatomy / slots.
- Tokens used.
- Supported variants.
- States and state transitions.
- Layout constraints and responsive behavior.
- Interaction and accessibility behavior.
- Motion specification.
- Empty/loading/error/disabled states where relevant.
- Static fallback for unsupported animation/3D.
- Unit/visual tests.

---

# 8. The 3D asset bible — core visual differentiator

## 8.1 Non-negotiable requirement

Maya-Duels must include **cool, fun, premium, custom 3D assets** as a major part of the product experience. The home hero, arena carousel, arena discovery and selected result/identity moments should not ship as generic flat icon cards with a placeholder gradient.

The assets should feel like a cohesive family of collectible engineering objects. They need personality, great silhouettes and memorable composition, while remaining aligned with the original palette.

## 8.2 Desired art character

Think premium product-render meets playful arcade collectible:
- Distinctive oversized silhouettes.
- Floating arrangements with several related objects.
- Slightly exaggerated scale and perspective.
- Intentional asymmetry and overlap.
- Polished but controlled material contrast.
- Small technical details that reward close inspection.
- Expressive, satisfying shapes—not cartoon clip-art.
- A little visual wit: a component can be oversized, a server stack can feel like a modular toy, a database cylinder can float with index rings, a neural chip can have orbiting tensor tiles.

Avoid making everything a realistic industrial photograph. The goal is designed 3D art, not a literal product catalogue. Avoid making everything a cute mascot either. The objects themselves should have character.

## 8.3 Signature Maya object

Create a reusable **Maya Core** visual object: a compact, distinctive energy/compute core that represents the central duel system.

Potential anatomy:
- A central faceted ceramic/metallic core.
- A small cyan-lit internal element or signal window.
- Two or three orbiting modular pieces or floating plates.
- A recognizable silhouette that can be simplified into the app icon, loading mark, achievement token and small state indicator.

It should not look like a generic glowing sphere. Give it a designed silhouette, recognisable cut-lines and a repeatable construction language.

## 8.4 Six domain hero asset concepts

### AI & ML — Neural Forge

Hero composition:
- A sculptural neural processor/chip as the central object.
- Several small tensor tiles, activation blocks or linked nodes orbiting it.
- One translucent layer that reveals internal structure.
- A small cyan signal path that suggests computation.

Avoid the stock “human brain made of glowing wires” cliché. Make it feel like a premium hardware/compute artefact.

### Infrastructure — Systems Grid

Hero composition:
- Three to five modular server blocks or rack cubes arranged in a dynamic cluster.
- Thin route/connection elements between nodes.
- One highlighted node to imply routing or bottleneck behavior.
- Optional small floating packet tiles.

Avoid a flat rack icon or generic city skyline.

### Database & Storage — Data Vault

Hero composition:
- Stack of storage plates or cylinders.
- A sculptural B-tree/index structure growing from the stack.
- Floating query token or shard blocks.
- Different materials for hot storage, index and cold storage.

Avoid a plain cylinder database logo enlarged into a 3D render.

### Web & Runtime — Runtime District

Hero composition:
- Layered browser/window frames at different depths.
- A central render plane or event-loop ring.
- Small floating DOM/component tiles.
- A subtle pointer/cursor object used sparingly.

Avoid generic laptop mockups. The subject is the runtime/browser system, not a physical laptop.

### Core CS — Core Circuit

Hero composition:
- CPU die or silicon block.
- Memory/cache tiles at multiple levels.
- One highlighted cache line or instruction path.
- Layered circuit substrate with fine details.

Avoid the generic microchip icon with random circuit traces.

### Security — Redline Protocol

Hero composition:
- A sculptural shield/lock hybrid with precise mechanical geometry.
- Two keys or cryptographic tokens interacting across a secure channel.
- A translucent boundary layer or handshake ring.
- A subtle amber warning variant for threat scenarios.

Avoid cartoon padlocks or clichéd hacker hoodies.

## 8.5 Mechanic-specific 3D/2.5D assets

These assets can use the same modelling language and appear in mechanic-specific questions or transitions:

- **Triad Compression:** three small clue artefacts converging into one core object.
- **Architecture Triage:** a miniature modular system with a visibly failing node and a repair component.
- **Shift the Knob:** a dimensional dial/slider with a small system-response object or graph.
- **Mythbuster:** a technical claim plate that reveals a hidden broken component or fault object.

Keep these diagrams simple enough to understand rapidly. The actual question text and answers remain the primary decision surface.

## 8.6 Results and identity 3D assets

Minimum launch set:
- Maya Core (hero/compact states).
- Six domain hero objects.
- Four mechanic artefacts.
- One trophy/achievement object family.
- One rank/division emblem family.
- One neutral opponent/rival emblem/avatar family (not a fake human portrait).
- Victory, promotion and Overdrive celebration elements.

Later asset families:
- Cosmetic nameplate objects.
- Seasonal collection assets.
- Turf War trophy and organization emblems.
- Sponsored arena objects (with brand approval).

## 8.7 Asset consistency rules

All 3D objects must share:
- Common camera perspective and scale logic.
- Consistent bevel/chamfer language.
- Consistent material roughness range.
- Similar shadow/lighting direction.
- Shared level of micro-detail.
- Controlled use of cyan/magenta/amber emissive areas.
- Consistent render quality and edge treatment.

The assets must look like they belong to the same product even when their silhouettes differ.

## 8.8 Composition rules

- Main hero object occupies roughly 35–60% of the available hero visual area depending on screen.
- Supporting objects occupy secondary depth layers.
- Use foreground/background overlap to create depth, but never obscure critical copy or buttons.
- Allow a few assets to bleed outside a card boundary where intentional.
- Give the hero object negative space around its silhouette.
- Keep the brightest highlight near the intended focal point.
- Avoid identical centred compositions for all six domains; vary pose and support-object placement while keeping shared art direction.
- Provide horizontal/portrait crops and a simplified compact crop for smaller screens.

## 8.9 3D asset production pipeline

Recommended workflow:
1. Art direction sketch / silhouette exploration.
2. Blockout model and camera test.
3. Material and lighting approval using Maya palette.
4. Final model and topology cleanup.
5. UVs and texture setup.
6. GLB/glTF export for interactive runtime where appropriate.
7. Static transparent/WebP/AVIF render for fallback and low-power mode.
8. LOD/simplified model if real-time 3D is used.
9. Asset manifest, preview and license record.
10. Visual QA on target devices.

Use Blender or an equivalent DCC tool. The deliverable must include editable source files plus production exports. Do not rely only on an uneditable rendered PNG if an asset is intended to be interactive.

## 8.10 Runtime formats and optimization

Preferred formats by use:
- **GLB/glTF:** real-time 3D objects and scenes.
- **WebP/AVIF:** static renders and fallback images.
- **PNG:** only when alpha/channel behavior requires it and compression is reasonable.
- **SVG:** logos, line art, diagrams and icons.
- **Rive:** interactive vector/2D stateful motion.
- **Lottie:** authored one-shot vector animation playback.

Suggested initial performance guardrails (validate on real devices; do not treat as universal hard limits):
- One primary real-time 3D scene per screen at most.
- Keep each hero model reasonably lightweight; aim for tens of thousands of visible triangles rather than hundreds of thousands for a mobile hero.
- Use 1K textures by default; 2K only where the object is large and detail visibly needs it.
- Minimize material count and draw calls.
- Compress geometry/textures where supported and visually acceptable.
- Avoid real-time shadows on many objects; use baked/contact shadows when possible.
- Pause rendering when the object is offscreen, inactive or the app is backgrounded.
- Lazy-load hero assets after the first usable shell appears.
- Provide a static render when WebGL/GL is unavailable, device power is low or reduced-motion/data-saver is active.

## 8.11 3D interaction states

Every interactive hero asset should define:
- Idle: gentle float/rotation only when appropriate.
- Hover/focus: subtle tilt or lighting change (web/keyboard).
- Press/drag: direct response and bounded movement.
- Selected: settle into selected pose; use cyan accent sparingly.
- Loading: short purposeful activation.
- Disabled: lower contrast/static state.
- Reduced motion: static or short fade transition.

Do not make 3D objects draggable unless the drag has a clear user benefit. Decorative drag is not an interaction strategy.

---

# 9. Motion design and interaction choreography

## 9.1 Motion principles

- Motion must communicate state, continuity, hierarchy or feedback.
- Frequently repeated actions should be fast and low-amplitude.
- Major moments can be more expressive, but the user must remain in control.
- Never block an answer because an animation has not finished.
- Use gesture-linked motion for carousels and direct manipulation.
- Prefer transform and opacity changes over repeated layout reflow.
- Avoid continuous motion in the duel decision area.
- Respect Reduce Motion and data/low-power settings.

## 9.2 Motion tokens

Initial token ranges; tune on devices:

| Token | Duration | Use |
|---|---:|---|
| `motion.tap` | 80–120 ms | Press feedback and simple toggles |
| `motion.quick` | 120–180 ms | Chips, lock-in and small state changes |
| `motion.standard` | 180–280 ms | Card changes, navigation and panels |
| `motion.spring` | 260–420 ms | Carousel snap and selected-card settling |
| `motion.feature` | 400–650 ms | Major result reveal or hero transition |
| `motion.celebrate` | 650–1,000 ms | Victory/promotion moment, skippable |
| `motion.idle` | 4–8 s loop | Very subtle home hero float only |

These are starting ranges, not mandates. Avoid every component using a different bespoke easing curve.

## 9.3 Signature choreography

### Home entrance
- Identity capsule enters/fades into place.
- Rating metric resolves quickly.
- Main 3D asset appears with a soft scale/settle and a subtle ambient float.
- Carousel is ready to swipe immediately; entrance does not block interaction.

### Arena carousel
- Drag follows the finger.
- Active card gains slight scale and depth.
- Side cards shift with parallax and remain partially visible.
- On release, snap to the nearest valid card.
- Domain title/rating content transitions in sync with selected card.
- Use a short haptic tick only on selection settle where supported.

### Matchmaking
- Maya Core activates in stages (core light, connected pieces, final ready state).
- Do not run an endless spinning loader.
- Provide deterministic timeout and cancel behavior.

### Question entry
- New question enters quickly with a small directional movement or masked reveal.
- Timer begins according to server state, not visual animation completion.
- Options remain tappable immediately.

### Answer lock
- Pressed tile compresses slightly and settles.
- Selection receives a clear locked state.
- Use cyan confirmation as a local accent, not a full-screen flash.

### Correct / incorrect
- Correct: focused cyan pulse or edge sweep and a concise point increment.
- Incorrect: clear error state using semantic red, with no insulting/shaming animation.
- Reveal must remain readable and quick.

### Streak
- Number increments with a short ticker.
- At a threshold, a compact ring or line accent activates.
- Do not grow permanent glow and particles across the screen.

### Overdrive
- A restrained shift toward Maya's existing magenta accent.
- A distinct short sound/haptic cue.
- An elevated round marker and small environmental intensity increase.
- Return to normal immediately after the round.

### Match result
- Hero result object or Maya Core changes state (victory/defeat/draw).
- Score and rating update count in once.
- Celebration is skippable and does not block Review Q&A or Rematch.

## 9.4 Motion anti-patterns

- Infinite particle effects behind every card.
- Large camera zooms during gameplay.
- Repeated bounce on every tap.
- Animated gradients running continuously under text.
- Long intro that delays the first question.
- Full-screen flash on correct answer.
- Moving objects near the screen edge in the live duel.
- Animating all content when the user changes a tab.

---

# 10. Sound and haptics

## 10.1 Sound identity

Sound should feel like tactile game hardware: short, crisp, satisfying and distinct—not like a casino slot machine or generic mobile quiz buzzer.

Required sound set:
- UI tap/focus (subtle).
- Answer lock.
- Correct answer.
- Incorrect answer.
- Opponent locked.
- Streak threshold.
- Overdrive entry.
- Match win/loss/draw.
- Rating/division progression.

Use procedural synthesis or a small authored library. A hybrid is acceptable. Do not generate every sound from a single oscillator; curate timbre, transient, decay and loudness so the game has a recognizable audio language.

## 10.2 Audio behavior

- Do not autoplay loud audio on first visit.
- Respect system mute and app preference.
- Every meaningful sound also has a visual equivalent.
- Avoid overlapping loops and rapidly repeated alerts.
- Provide volume/mute controls.
- Preload only critical short sounds; load optional audio lazily.

## 10.3 Haptic language

- Light tap: selection.
- Crisp confirmation: answer locked.
- Double short pulse: streak milestone.
- Strong short pulse: Overdrive / match result.
- Error pulse: incorrect answer, optional.

Haptics are optional and must never be required to understand a state. Respect platform API availability and user preferences.

---

# 11. Frontend architecture and library strategy

The goal is not to install every animation library. Use a small set of complementary tools with clear ownership and a custom Maya component system.

## 11.1 First decision: preserve the repository's working client stack

Before changing dependencies, inspect the current repository. Do not migrate a working Next.js application to React Native—or the reverse—just because a library is popular.

### If Maya's current client is Next.js / React web or PWA

Recommended roles:
- **Design primitives:** shadcn/ui source-owned components for accessible controls, dialogs, sheets, tabs, menus, inputs and popovers. Treat it as editable component source, not a visual theme to copy.
- **Styling:** the repository's existing Tailwind/CSS-token approach; one design-token source of truth.
- **Motion:** Motion for React for layout transitions, gesture-linked elements and shared-element transitions where appropriate.
- **3D:** Three.js + React Three Fiber for the selected interactive hero assets; static WebP/AVIF/GLB fallbacks for performance.
- **Interactive vector animation:** Rive for state-driven objects or controls where vector animation is sufficient.
- **One-shot authored motion:** Lottie for short, non-interactive effects where it materially simplifies production.

### If Maya's client is React Native / Expo

Recommended roles:
- **Base UI:** React Native primitives plus a single Maya-owned component layer. Avoid porting web-only shadcn styles directly to native.
- **Gestures and UI motion:** React Native Gesture Handler + Reanimated 4.
- **Interactive authored graphics:** Rive React Native runtime, after validating target-platform support and bundle impact.
- **One-shot authored animations:** Lottie React Native, version-pinned to the project's React Native/New Architecture compatibility.
- **3D:** begin with optimized 3D renders or a tested native GL rendering path. Prototype React Three Fiber Native / Expo GL only after validating current Expo, GL and React Native compatibility on target Android devices.

### If both web and native clients exist

Share tokens, question/result data contracts, domain definitions and design specifications. Do not force identical implementation details across platforms. Each client can use the most natural accessible implementation while preserving the same Maya visual language.

## 11.2 Library selection rules

### Practical library research and where each fits

The libraries below are useful sources of implementation patterns. They are not competing full design systems, and none should be copied wholesale. Their components must be restyled into Maya's existing tokens and then tested in the actual target client.

| Library | Best use in Maya-Duels | What to borrow | What not to do | Platform fit |
|---|---|---|---|---|
| **shadcn/ui** — https://ui.shadcn.com/docs | Accessible web primitives and a source-owned component foundation | Dialogs, sheets, tabs, menus, inputs, buttons, popovers and keyboard/focus patterns | Do not inherit its sample dashboard look or treat it as a ready-made Maya theme | React/Next.js web; not a native React Native kit |
| **Aceternity UI** — https://ui.aceternity.com/components | Selective web interaction inspiration and copy-paste effects | 3D card tilt, floating dock patterns, carousel behavior, expandable cards, layout grid, subtle spotlight and selected hero effects | Avoid default beams, aurora backgrounds, glowing borders, cursor trails and scroll spectacle across ordinary app screens | React/Next.js + Tailwind + Motion |
| **Magic UI** — https://magicui.net/ | Small animated utility components and polished number/entry effects | Number ticker, animated list, dock, marquee in limited contexts, selected button/loader treatments | Avoid rainbow/shimmer/pulse effects that introduce colours outside Maya's brand or distract in the match | React + Tailwind + Motion; mostly web-oriented |
| **React Bits** — https://reactbits.dev/ and https://github.com/DavidHDev/react-bits | Experimental interaction and visual prototyping library | A carefully selected carousel, card stack, split text, subtle hover/tilt, count-up or 3D/particle prototype | Do not add every background effect; avoid glitch, liquid chrome, aurora, hyperspeed and random shader components unless specifically justified by Maya's concept | React/Next.js web |
| **Motion for React** — https://motion.dev/ | Web interaction and layout transitions | Shared-layout transitions, gestures, spring movement, enter/exit and carousel transitions | Do not use it as a 3D renderer or duplicate animation systems | React web |
| **Reanimated + Gesture Handler** — https://docs.swmansion.com/react-native-reanimated/docs/ | Native gesture-linked interactions and performant motion | Pan, snap, spring, decay, shared values, gesture state | Do not use web Motion examples directly in native code | React Native |
| **Rive** — https://rive.app/features | Interactive, state-driven graphic objects | State machines, inputs, triggers, dynamic text and responsive artboards | Do not use it for ordinary page layout or replace actual 3D geometry with fake vector depth | Web and native runtimes; verify version/platform support |
| **Lottie** — https://airbnb.tech/opensource/lottie/ | Predetermined short animation playback | Small one-shot transitions, celebration flourishes and authored vector sequences | Do not use Lottie for interactive state logic or complex real-time 3D | Web and native runtimes |
| **Three.js / React Three Fiber** — https://r3f.docs.pmnd.rs/ | Actual real-time 3D hero objects where interactivity justifies the cost | GLB rendering, camera, lighting, material response and limited pointer/touch response | Do not put a WebGL scene behind every page or inside the live answer area | Web; native requires a compatibility/performance spike |

### Recommendation by role

1. Use shadcn or equivalent accessible primitives for web controls, then wrap and theme them with Maya components.
2. Treat Aceternity, Magic UI and React Bits as **pattern libraries**, not as the visual system. Select only a small number of useful components, remove their default visual styling and align their behavior with Maya's tokens.
3. Use one motion system for the main client runtime.
4. Use Rive where a graphic needs stateful interactivity; use Lottie where the animation is predetermined; use real 3D only for objects that benefit from actual geometry.
5. Never install several overlapping component registries just because an agent can import them quickly. Inspect source code, dependency footprint, licence, accessibility and mobile performance first.

### Candidate patterns to prototype (not blindly ship)

- Active-centre carousel with neighbouring cards peeking in.
- Floating dock with a moving active marker.
- Spring-settled card stack.
- Number ticker for rating changes.
- Small focused spotlight under selected domain/object.
- 3D tilt on a hero object for pointer/touch movement, with strict limits.
- Expandable card for post-match explanation.
- Animated list insertion for history/leaderboard updates.

Avoid: infinite marquee as main navigation, mouse-following effects on mobile, heavy scroll parallax, animated text scrambling during gameplay, moving borders on every card and full-screen aurora/beam backgrounds.

- One primary motion engine per client runtime.
- Rive for interaction-driven state machines; do not use it as a general substitute for layout animation.
- Lottie for authored, predetermined animation; do not use it for stateful gameplay logic.
- Three.js/R3F for actual 3D object rendering; don't render a full 3D scene when a static render looks equally good.
- shadcn/ui is a source-code foundation for web primitives, not a mobile component kit.
- Custom Maya components own the look, spacing, variants and states.
- Pin versions and test upgrades; current library compatibility changes over time.

## 11.3 Component architecture

Suggested organization (adapt to current repo conventions):

```text
src/
  design-system/
    tokens/
    typography/
    motion/
    materials/
    components/
  features/
    identity/
    arena-home/
    arena-discovery/
    matchmaking/
    duel/
    match-results/
    match-history/
    vault/
    ranks/
    profile/
    locker/
  assets/
    3d/
    renders/
    rive/
    lottie/
    audio/
    icons/
  navigation/
  accessibility/
```

Keep gameplay/business logic outside presentation components. A `RoundTimer` displays a server deadline; it must not own the authoritative deadline. An `AnswerTile` emits a selected stable choice ID; it must not calculate correctness.

---

# 12. Responsive, accessibility and low-end-device behavior

## 12.1 Responsive behavior

- Portrait mobile is the primary layout.
- Landscape should remain usable but is not necessarily the primary experience.
- Tablet uses more breathing room and a larger comparison layout, not simply stretched phone UI.
- Web/desktop can use wider history comparison and larger arena compositions while retaining the same hierarchy.
- The duel remains compact and readable on small screens.

## 12.2 Accessibility

- Maintain sufficient contrast for text, buttons and semantic states.
- Never use colour alone to distinguish correct/incorrect or active/inactive.
- Support screen readers and meaningful labels for controls.
- Provide non-gesture alternatives for carousel navigation.
- Support dynamic text sizing without clipping core controls.
- Ensure answer tiles have clear accessible names and state announcements.
- Respect reduced-motion system preference.
- Provide static 3D render fallback.
- Avoid rapid flashing and high-frequency strobing.
- Make sound and haptics optional.

## 12.3 Reduced motion

When Reduce Motion is enabled:
- Stop idle object float/parallax.
- Replace large spatial transitions with short fades or static state changes.
- Remove animated depth movement and unnecessary scaling.
- Keep state feedback immediate and clear.
- Do not remove information—only the movement.

## 12.4 Low-end Android / data saver

Provide a low-effects mode:
- Use static hero renders instead of live 3D.
- Reduce particle count to zero or a minimal value.
- Disable heavy blur and real-time shadows.
- Load only assets for the current screen/domain.
- Use smaller texture variants.
- Stop offscreen animation and pause when backgrounded.
- Keep the duel HUD responsive even if optional effects fail.

---

# 13. Performance budgets and visual QA

These are initial engineering targets and must be measured, not assumed:

- Keep core navigation and first interactive home content fast on mid-range Android.
- Do not wait for the 3D hero to load before enabling primary navigation or core actions.
- One main 3D scene maximum per screen as a starting rule.
- Use lazy loading, LOD and static fallbacks.
- Avoid large textures where 1K/2K is sufficient.
- Minimize draw calls/material count.
- Pause rendering outside visible/active state.
- Keep input response independent of animation completion.
- Test on at least one low/mid-range Android device and one higher-end device.

## 13.1 Visual QA checklist

- Does the screen clearly belong to Maya-Duels?
- Does it preserve the original palette and token meanings?
- Is the hierarchy immediately understandable?
- Is the primary action obvious?
- Are the 3D assets custom, coherent, high quality and semantically meaningful?
- Do 3D assets feel fun and memorable rather than generic clip-art?
- Do objects overlap intentionally without hiding content?
- Does the carousel have a satisfying active/side-card relationship?
- Does the floating dock work without covering content?
- Are typography and answer labels readable at actual device size?
- Does the design remain usable with reduced motion and low effects?
- Does the live duel stay focused and uncluttered?

## 13.2 Interaction QA checklist

- Every press gives immediate feedback.
- Carousel follows the finger and snaps consistently.
- Back/close behaviors are predictable.
- Answer selection locks immediately and cannot be changed.
- Timer does not wait for animations.
- Opponent status does not leak hidden information.
- Result actions work even if celebration animation is skipped.
- History compares both players' answers accurately.
- No replay UI or replay state exists.

---

# 14. Design production deliverables

The design work is not complete when a few mockups exist. The following artifacts are required for implementation handoff.

## 14.1 Foundation package
- Brand token sheet.
- Typography scale.
- Spacing/radius/elevation scale.
- Semantic colour-state map.
- Motion tokens and easing presets.
- Component naming and state conventions.
- Icon style and sizing rules.

## 14.2 Screen designs
- Onboarding/instant entry.
- Home / Arena Hub.
- Arena discovery.
- Domain detail.
- Matchmaking.
- Duel HUD with each of four mechanics.
- Round result state.
- Match result.
- Match history list.
- Match Q&A detail.
- Knowledge Vault.
- Ranks.
- Identity/profile.
- Locker/cosmetics.
- Daily Anomaly (when in scope).
- Settings/accessibility.

For each screen, include loading, empty, error, disabled, success and reduced-motion states where applicable.

## 14.3 Component library package

- All shared components from Section 7.
- Anatomy and tokens.
- Variants and states.
- Responsive behavior.
- Interaction specs.
- Accessibility behavior.
- Component examples.
- Test checklist.

## 14.4 3D production package

- Maya Core master asset and variants.
- Six domain hero assets.
- Four mechanic assets.
- Trophy/achievement/rank asset family.
- Neutral rival emblem/avatar.
- GLB/glTF exports where interactive.
- Static renders and responsive crops.
- Low-power asset variants.
- Source files and license/asset manifest.
- Material, camera and lighting reference sheet.

## 14.5 Motion and sound package

- Motion storyboard for the main user journey.
- Timing/easing presets.
- Rive state-machine contracts where applicable.
- Lottie assets for predetermined motion.
- Sound effects and audio-state map.
- Haptic mapping by platform.
- Reduced-motion alternatives.

## 14.6 Handoff contract

Every handoff item must include:
- File and component name.
- Target screen/use case.
- Exact states and transitions.
- Asset dependencies.
- Layout constraints.
- Platform/runtime constraints.
- Performance notes.
- Accessibility notes.
- Acceptance criteria.

Do not hand a coding agent only a screenshot and expect it to infer hidden states, data contracts and animation rules.

---

# 15. Recommended implementation order

1. Inspect the existing repository and confirm the actual client stack, current brand tokens and navigation architecture.
2. Build the token/foundation layer without redesigning every screen at once.
3. Build `IdentityCapsule`, `FloatingDock`, `ArenaCarousel` and `ArenaHeroCard`.
4. Produce and integrate the Maya Core plus at least two polished domain 3D assets; verify loading and static fallbacks.
5. Complete the home screen and arena discovery experience.
6. Build the duel's functional components with minimal visual effects.
7. Add the four mechanic variants and match-state transitions.
8. Build result and two-player Q&A comparison.
9. Build Vault, Ranks and Identity.
10. Add advanced 3D, celebrations and decorative detail only after performance and usability pass.

Do not build all six highly detailed 3D assets before the central carousel and home composition are validated. First test the visual system with Maya Core and two domain assets; then expand the same art direction to the other four domains.

---

# 16. Reference research and official implementation documentation

The reference image is the primary composition source supplied by the product owner. The following official documentation informs implementation roles and motion/accessibility decisions. Check current compatibility before adding or upgrading packages.

## UI foundations
- shadcn/ui introduction (editable, composable source components): https://ui.shadcn.com/docs
- shadcn/ui official project resources: https://ui.shadcn.com/docs/official
- shadcn/ui component registry: https://ui.shadcn.com/docs/directory
- Aceternity UI component library: https://ui.aceternity.com/components
- Magic UI animated components: https://magicui.net/
- React Bits component source: https://github.com/DavidHDev/react-bits

## Motion and gestures
- Motion for React layout and shared-element animation: https://motion.dev/docs/react-layout-animations
- React Native Reanimated performance guide: https://docs.swmansion.com/react-native-reanimated/docs/guides/performance/
- Reanimated 4 gesture handling: https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/handling-gestures/
- Apple Human Interface Guidelines — Motion: https://developer.apple.com/design/human-interface-guidelines/motion
- Apple accessibility / Reduce Motion guidance: https://developer.apple.com/design/human-interface-guidelines/accessibility

## Interactive graphics and 3D
- Rive features, state machines, inputs, data binding and runtimes: https://rive.app/features
- React Three Fiber: https://r3f.docs.pmnd.rs/
- Expo GLView: https://docs.expo.dev/versions/latest/sdk/gl-view/

## Authored vector animation
- Lottie documentation: https://airbnb.tech/opensource/lottie/
- Lottie React Native: https://github.com/lottie-react-native/lottie-react-native

## Design guidance
- Apple Human Interface Guidelines — Motion: https://developer.apple.com/design/human-interface-guidelines/motion
- Apple accessibility guidance: https://developer.apple.com/design/human-interface-guidelines/accessibility

**Important:** this specification recommends responsibilities, not blind dependency installation. Inspect the existing app stack, pin compatible versions, prototype 3D on the actual target devices and measure before committing to a runtime choice.

---

# 17. Final design direction

Maya-Duels should look and feel like a premium, playful engineering arcade. The supplied reference contributes the composition and experience: floating identity, a hero metric, a central carousel, rich 3D object collages, search/filter capsules, featured cards and floating navigation.

Maya contributes the identity: obsidian, graphite, cyan, restrained magenta and amber; the technical subject matter; the arena universe; and a distinctive family of expressive engineering objects.

The visual equation is:

**Reference-inspired consumer-app composition + Maya's original brandkit + custom fun 3D engineering art + tactile, purposeful motion + a focused competitive duel.**

Do not turn this into another generic neon cyberpunk dashboard. Do not flatten it into basic cards and icons. Do not replace the 3D art with placeholders. Build the 3D object system and carousel as signature parts of the brand, then let the actual duel become calm, precise and exceptionally usable.

# MAYA-DUELS V3 — Master Product, Gameplay, Algorithms & Systems Specification

**Document type:** Product requirements + game design + content operations + architecture + algorithm specification  
**Version:** 3.0  
**Status:** Implementation source of truth for the non-visual product  
**Audience:** Product manager, principal engineer, game designer, backend engineer, data/ML engineer, content lead, QA engineer and coding agents  
**Companion document:** `MayaDuels_V3_Complete_Visual_Design_UI_UX_and_Experience_Brief.md`  
**Product:** Maya-Duels  
**Core category:** Competitive engineering knowledge game / micro-learning network

---


## Contents

- [0. How to use this specification](#0-how-to-use-this-specification)
- [1. Product vision, thesis and positioning](#1-product-vision-thesis-and-positioning)
- [2. Core game rules and match loop](#2-core-game-rules-and-match-loop)
- [3. Arenas, domains and knowledge taxonomy](#3-arenas-domains-and-knowledge-taxonomy)
- [4. Core tactile mechanics](#4-core-tactile-mechanics)
- [5. Game modes and release sequencing](#5-game-modes-and-release-sequencing)
- [6. Arena Rival cold-start engine](#6-arena-rival-cold-start-engine)
- [7. Competitive rating and rank system](#7-competitive-rating-and-rank-system)
- [8. Scoring, streaks and competitive balance](#8-scoring-streaks-and-competitive-balance)
- [9. Question difficulty calibration and deck composition](#9-question-difficulty-calibration-and-deck-composition)
- [10. Matchmaking system](#10-matchmaking-system)
- [11. Response-time verification and anti-cheat](#11-response-time-verification-and-anti-cheat)
- [12. Spaced repetition and knowledge system](#12-spaced-repetition-and-knowledge-system)
- [13. The Forge content system](#13-the-forge-content-creation-validation-and-governance)
- [14. Technical architecture](#14-technical-architecture)
- [15. Data model and database contracts](#15-data-model-and-database-contracts)
- [16. Progression and economy](#16-progression-mastery-and-in-app-economy)
- [17. Monetization](#17-monetization-and-business-model)
- [18. Analytics and observability](#18-analytics-experimentation-and-observability)
- [19. Testing and quality gates](#19-testing-and-quality-gates)
- [20. Delivery roadmap](#20-delivery-roadmap)
- [21. Public-release definition of done](#21-first-serious-public-release-definition-of-done)
- [22. Open decisions](#22-open-decisions-requiring-prototypes-or-data)
- [23. Final product direction](#23-final-product-direction)
- [24. API, event and content contracts](#24-api-event-and-content-contracts)
- [25. Technical references](#25-technical-references)

# 0. How to use this specification

This document defines **what Maya-Duels does and how its underlying product and systems work**. It intentionally does not define the visual styling, screen compositions, 3D art direction, detailed component appearance or animation choreography. Those belong in the companion Design & UI/UX specification.

The two documents are complementary:

- This document owns product rules, game rules, content contracts, scoring, rating, matchmaking, data, backend, APIs, reliability, security, analytics, monetization and delivery order.
- The design document owns brand application, visual hierarchy, screen layouts, component anatomy, 3D assets, interaction design, motion, responsive behavior, accessibility presentation and visual QA.
- If the documents appear to conflict, the functional rules in this document govern the game and data. The design document governs the presentation of those rules.

## 0.1 Product decisions that are already settled

These are hard constraints, not options for an implementation agent to reinterpret.

1. **No match replays.** Do not build a replay player, kill-cam, replay archive, tap-timeline playback, replay cursor, animated match reconstruction or replay recording system.
2. **Match history includes both players' Q&A.** For each round, history must show the question, both players' selected answers, correctness, the canonical correct answer, response times, round points and a useful explanation.
3. **Cold-start opponents are not player-labelled as bots.** Do not display `BOT`, `AI`, `SIMULATED`, `TRAINING OPPONENT` or similar labels in the normal player experience. Use the same opponent-slot treatment as a match opponent. Use a neutral arena-rival identity/abstract avatar; never invent a real person's biography, company, university, location, verification badge or social profile, and never claim the rival is currently online or human.
4. **Internal opponent source remains explicit.** The backend must know whether a match used a real account or an Arena Rival. This is required for rating integrity, abuse controls and analytics. It is internal metadata, not a player-facing label.
5. **Arena Rival matches must not create fake human leaderboard activity.** They can support onboarding, practice, content exposure, XP and mastery progress under a controlled policy. They must not fabricate human accounts, human wins, company rankings or social proof.
6. **No dishonest percentile claims.** Do not display “top 14%” or any population ranking before a sufficiently large, valid comparison population exists.
7. **No pay-to-win.** Ranked access, fair question content, match completion and the ability to understand both players' Q&A remain free.
8. **Questions must be reviewed before ranked publication.** AI generation is a drafting and critique tool, not an authority that can publish ranked questions automatically.
9. **Do not overbuild the launch infrastructure.** A clean modular architecture with one durable source of truth is more valuable than a premature microservice fleet.
10. **The game is one-minute competitive play first, learning second.** The learning layer should improve the experience without turning every match into a lecture.

## 0.2 Definition: “match history with both players' Q&A”

Each completed match creates an immutable, structured result record. For every round it stores:

- Question ID and exact question version.
- The underlying four choices and stable choice IDs.
- The display-order mapping shown to each player.
- Player A's selected choice, correctness, verified elapsed time, points and timeout state.
- Player B's selected choice, correctness, verified elapsed time, points and timeout state.
- Canonical correct choice, revealed only after the round resolves.
- Concise explanation / mental-model reference.
- Round-level status (completed, timeout, disconnected, voided).

The history view is a **result comparison**. It is not a playback. Do not collect every pointer movement, touch coordinate, animation frame, screen recording, UI event sequence or continuous opponent-presence stream.

---

# 1. Product vision, thesis and positioning

## 1.1 Product thesis

Software engineers, AI/ML researchers, infrastructure engineers, data engineers, system designers and computer-science learners regularly encounter short periods of idle time: a build is running, a deployment is progressing, a training epoch is executing, a commute is underway or a review is pending. Most technical-learning products are too demanding for those short windows:

- Coding platforms require a keyboard, editor and sustained concentration.
- Technical feeds are largely passive and rarely require active recall.
- Traditional quiz products reward isolated fact memorization more than engineering judgment.
- Most multiplayer games do not reward a player's technical instincts.

Maya-Duels turns those windows into fast competitive encounters. Players recognize a mechanism, diagnose a failure, predict a system's behavior, choose an architectural intervention or identify a flawed engineering claim. They play with taps, not code entry.

**Core promise:** In roughly one minute, test your engineering instincts against a rival, discover a gap in your mental model and leave with one useful technical insight.

## 1.2 Positioning

Maya-Duels combines:

1. **Competitive quick-play:** short matches, clear stakes, score momentum, rematches and rating progression.
2. **Engineering judgment:** mechanisms, performance trade-offs, failure modes, systems behavior and mathematical intuition.
3. **Micro-learning:** immediate correction, mental models, saved concepts and spaced review.
4. **Technical identity:** domain mastery, earned cosmetics, achievements, shareable results and optional team competition.

Maya-Duels is not a LeetCode replacement, a syntax trivia app, a long-form system-design interview simulator, a course platform or a social feed with questions attached.

## 1.3 Target users

### Primary audience
- Software engineers and developers.
- Backend, platform and infrastructure engineers.
- SRE / DevOps / cloud practitioners.
- AI/ML engineers and researchers.
- Data engineers and database practitioners.
- Computer-science learners who enjoy technical competition.

### Secondary audience
- University technical clubs.
- Engineering communities and open-source groups.
- Early-career developers preparing for technical roles.
- Engineering teams that want short, low-friction learning rituals.

Do not dilute the product for generic trivia audiences at launch. Its advantage is a specific audience with a shared vocabulary and appetite for technical competition.

## 1.4 Product laws

### Law A — Fast comprehension, not forced oversimplification
The prompt must be quickly parseable, but technical accuracy takes priority over arbitrary word limits.

Initial editorial targets:
- Prefer 8–14 words for a plain prompt.
- Use a slightly longer statement when a real constraint or assumption is needed.
- Keep answer labels ideally within 1–4 words.
- Ask one primary decision per round.
- Avoid walls of text during ranked matches.

A concise but accurate 17-word scenario is better than an ambiguous 10-word fragment.

### Law B — Intuition over syntax trivia
Question content should test causal models, architectural trade-offs, performance bottlenecks, operational judgment, mathematical behavior, failure modes and security boundaries. Avoid obscure flags, semicolon placement, package trivia and ephemeral version facts unless there is a meaningful engineering consequence.

### Law C — Competitive fairness before spectacle
The server owns deadlines, answer acceptance, score calculation, match outcome and rating eligibility. Both human players receive the same underlying questions and the same round order. Cosmetics cannot change gameplay.

### Law D — Teach at the moment of relevance
Do not interrupt the duel with long explanations. Reveal the correct answer and a compact insight at an appropriate resolution point; provide the full Q&A comparison and deeper mental model after the match.

### Law E — Sell identity and learning convenience, never competitive advantage
Paid features may expand convenience, customization, private learning workflows and advanced analytics. They must not buy more time, a better question set, score multipliers or rating points.

## 1.5 North-star metric

**Weekly meaningful duels per retained player:** completed duels per weekly active player where the player answers at least six rounds and opens at least one learning insight or Q&A comparison during the session.

Supporting metrics:
- D1, D7 and D30 retention.
- Completed matches per active player per week.
- Match start and completion rate.
- Queue-to-match success, median and p95 wait time.
- Human-match share and Arena Rival fallback share.
- Disconnect, reconnect and void rates.
- Rematch rate.
- Q&A detail open rate and explanation engagement.
- Vault saves and review completion.
- Question dispute rate and question-level discrimination.
- Accuracy and time distributions by domain and skill band.
- Share-link open-to-play conversion.
- Suspicious timing / rating-abuse signals.

Do not optimize only for session duration. A satisfying one-minute session is a successful product outcome.

---

# 2. Core game rules and match loop

## 2.1 Flagship mode: 60-second Blitz

The default mode is an eight-round, one-versus-one technical duel. Each round has a maximum answer window of 7,500 ms, yielding 60 seconds of decision time. Intro, resolution and transition time may extend total wall-clock duration. “60-second Blitz” is the product name and pacing target, not a guarantee that every end-to-end app session lasts exactly 60 seconds.

### Round lifecycle
1. Server starts the round and sends the question payload without the correct answer.
2. Client renders the prompt and four choices; its visual timer is a local representation of the server deadline.
3. Player taps one choice or the deadline expires.
4. Server accepts at most one answer for that player/round.
5. The answer becomes locked and cannot be changed.
6. Opponent status may indicate that the other side has locked in, without exposing choice or correctness.
7. When both answers are locked or the deadline expires, the server resolves the round.
8. Server sends the result to both participants.
9. The match proceeds to the next round or finishes after round eight.

The server's round deadline is authoritative. Client-side countdowns are for responsiveness only.

## 2.2 Match pacing arc

| Rounds | Role | Difficulty target | Intended experience |
|---|---|---|---|
| 1–2 | Warm ignition | Slightly below estimated skill | Establish confidence and flow without trivializing the match. |
| 3–5 | Main combat | Near estimated skill | Test mechanisms, causal reasoning and trade-offs. |
| 6–7 | Pressure | Slightly above estimated skill | Separate shallow recognition from a stronger mental model. |
| 8 | Overdrive | High-discrimination and challenging | Create a memorable final decision without turning the match into a random coin flip. |

Overdrive must not be a trick question. It is a fair, high-stakes item with strong discrimination and a clear explanation.

## 2.3 Winner and tie rules

- Correct answers earn points according to the scoring formula.
- Incorrect answers earn zero and reset the correct-answer streak.
- Timeout earns zero and resets the streak.
- Higher total score wins.
- Equal total score is a draw.
- Do not invent a hidden tie-break based on network latency, answer receipt order or internal metadata.
- A disconnected player receives a bounded reconnect opportunity. If the match cannot be completed fairly, the match is void and no competitive rating update is applied.

## 2.4 Match emotional arc

1. Anticipation: quick match confirmation and opponent identity.
2. Recognition: a satisfying “I know this” decision.
3. Pressure: opponent lock-in status and streak momentum.
4. Climax: a clear Overdrive round with elevated importance.
5. Payoff: win/loss/draw, rating movement when eligible, and the two-player Q&A record.

The design document specifies how these moments are presented visually.

---

# 3. Arenas, domains and knowledge taxonomy

## 3.1 Six launch domains

| Domain ID | Arena | Content pillars |
|---|---|---|
| `AI_ML` | Neural Forge | Transformers, inference, training dynamics, optimization, retrieval, evaluation, quantization, distributed training, model architecture and research interpretation. |
| `INFRA` | Systems Grid | Distributed systems, consensus, queues, networking, containers, Kubernetes, observability, reliability, scaling and tail latency. |
| `DATA` | Data Vault | Database internals, transactions, indexing, storage engines, query plans, caching, streaming, data modeling and vector search. |
| `WEB` | Runtime District | Browser/runtime behavior, JavaScript, frontend architecture, APIs, HTTP, rendering, application security and web performance. |
| `CORE_CS` | Core Circuit | Operating systems, memory, CPU/cache, algorithms, data structures, concurrency, complexity, compilers and computer architecture. |
| `SECURITY` | Redline Protocol | Threat modeling, cryptography, identity, application security, network security, secure design, incident response and defensive reasoning. |

The schema may contain all six from day one, but content coverage must be earned. Do not launch six empty or low-quality arenas merely to make the catalogue appear complete.

## 3.2 Skill taxonomy

Each question should be tagged across multiple independent dimensions:

- Domain and subtopic.
- Concept / technical primitive.
- Skill mode: recognition, causal reasoning, trade-off, diagnosis, mathematical intuition, security judgment, operational response or research interpretation.
- Mechanic type.
- Required assumed knowledge.
- Editorial difficulty band.
- Empirical difficulty/discrimination estimate and confidence.
- Source type, source version and last-verified date.
- Stable knowledge versus version-sensitive knowledge.

This enables nuanced insights. A player may be strong at Transformer architecture but weak at inference economics, or good at databases but weak at transaction isolation.

## 3.3 Editorial difficulty bands

- **Foundation:** core primitive or standard behavior.
- **Applied:** practical trade-offs and common failure modes.
- **Advanced:** interacting constraints, non-obvious behavior and production consequences.
- **Expert:** edge cases, research-level distinctions or deep systems reasoning.

These labels are editorial priors. Empirical difficulty should eventually be calibrated from response data. An author's confidence or an AI model's claimed confidence is not proof of difficulty.

---

# 4. Core tactile mechanics

All four launch mechanics share an input contract: one concise prompt, four plausible choices, one tap. Each mechanic tests a different type of engineering thinking.

## 4.1 Triad Compression

**Purpose:** identify a technical primitive from three simultaneous constraints.

**Prompt structure:** three compact clue fragments converge into one question. Clues may be shown as short tokens, constraints or a tiny structured diagram.

**Player action:** select the primitive that satisfies all three constraints.

**Example:**
- Normalizes activations across feature channels.
- Does not depend on batch statistics.
- Commonly used in Transformer blocks.

Choices: BatchNorm / RMSNorm / Weight Decay / Dropout.

**Authoring requirements:**
- All clues jointly identify one answer.
- Clues are individually meaningful, not arbitrary trivia.
- Distractors represent plausible conceptual confusions.
- No one clue should reveal the answer by an accidental wording giveaway unless recognition is explicitly the skill being tested.

**Assessment:** measures concept recognition and constraint matching.

## 4.2 Architecture Triage

**Purpose:** identify the highest-leverage intervention for a production scenario.

**Prompt structure:** concise telemetry + short scenario + four possible interventions.

**Player action:** choose the fix that addresses the stated bottleneck under the supplied constraints.

**Example:**
A hot Redis key expires; thousands of requests miss cache and overload PostgreSQL.

Choices: Singleflight / Add DB connections / Write-through cache / Consistent hashing.

**Authoring requirements:**
- State the operational objective (reduce load, improve durability, reduce tail latency, etc.).
- Include enough constraints to make one intervention the best answer.
- If several strategies are valid, ask for the “first” or “highest-leverage” action and justify why.
- Explanation must identify second-order trade-offs.

**Assessment:** measures diagnosis and decision-making under constraints.

## 4.3 Shift the Knob

**Purpose:** predict the emergent behavior when a parameter moves toward an extreme or a system constraint changes.

**Prompt structure:** parameter, value or visualized direction of change + concise context.

**Player action:** select the consequence.

**Example:**
As temperature approaches infinity in standard softmax sampling, the token distribution approaches:

Choices: Uniform / Greedy / Zero entropy / One-hot.

**Authoring requirements:**
- State mathematical conventions.
- Avoid ambiguous terms such as “temperature goes to zero” unless the sampling formulation is explicit.
- Ensure answer explanation follows from a mechanism/equation, not a memorized slogan.

**Assessment:** measures first-principles prediction and quantitative intuition.

## 4.4 Mythbuster / Fault Isolation

**Purpose:** identify an invalid engineering claim or the mechanism that invalidates it.

**Prompt structure:** one falsifiable technical claim and four choices, one of which may identify the flaw or mark the principle valid.

**Player action:** select the underlying flaw or “Valid Principle.”

**Example:**
Two threads update independent fields on the same cache line; the claim says they cannot interfere.

Correct diagnosis: false sharing.

**Authoring requirements:**
- Claim must be fully testable under stated assumptions.
- Avoid double negatives and ambiguous quantifiers.
- “Valid principle” is allowed only when the entire claim is true under the given assumptions.
- Distractors should be close enough to test diagnosis.

**Assessment:** measures critical judgment, falsification and debugging intuition.

## 4.5 Future mechanic: Signal Trace

A later mechanic in which the player identifies the next node in a causal chain, such as:

`Hot key expires → cache miss storm → DB load spike → queue growth → P99 latency spike`

Keep it to a single choice or very short sequence. Do not make a round into a long drag-and-drop puzzle. Prototype only after the four core mechanics prove engaging.

## 4.6 Mechanic distribution

- Each standard match should contain at least three mechanics when content supply permits.
- Do not show the same mechanic more than three rounds consecutively.
- Avoid repeating the same subtopic within one match unless the mode is intentionally focused.
- Both human players receive the same underlying question version and round order.
- Option order may be independently shuffled, but stable choice IDs must be retained.
- Arena Rivals receive the same question and equivalent options.

---

# 5. Game modes and release sequencing

Do not launch every idea at once. Each mode introduces content, state, testing and operational complexity.

## Phase 1 — Core release

1. **Blitz:** eight-round 1v1 with human matchmaking where available and Arena Rival fallback for cold-start play.
2. **Calibration:** short placement set to estimate initial ability and choose a provisional skill band.
3. **Match History:** completed match summaries with both players' Q&A.
4. **Knowledge Vault:** save a question/concept and collect missed concepts.
5. **Daily Anomaly:** only after the challenge content, global reset and abuse rules are ready; it may be enabled shortly after launch rather than blocking the first playable release.

## Phase 2 — Retention and social play

6. **Weakness Blitz:** personalized, untimed or short-sprint review.
7. **Custom Gauntlet:** a fixed deck link for asynchronous challenge and result comparison.
8. **Friend Duel:** direct invite, private lobby and rematch.

## Phase 3 — Community and monetization

9. The Forge community review.
10. Private Paper/Repo-to-Duel decks.
11. Campus/company Turf Wars.
12. Sponsored arenas.
13. Optional team integrations and skills challenges.

## 5.1 Daily Anomaly

A globally synchronized five-question investigation can become a daily ritual.

Requirements:
- One daily seed and a clearly defined reset time.
- Document reset timezone in product rules; UTC is easiest operationally, while the app may localize the display.
- Same question set and order for everyone in the same daily challenge.
- Spoiler-safe share card.
- Personal completion time distinguished from global percentile.
- Do not show percentiles until a meaningful population threshold is met.
- Prevent duplicate or suspicious account farming.

## 5.2 Weakness Blitz

A personalized review session assembled from concepts the user missed, answered slowly or has not reviewed recently. It must avoid shaming the player or endlessly repeating the same failed items.

Selection order:
1. Incorrect concepts that are due for review.
2. Repeatedly slow concepts due for reinforcement.
3. Recently learned concepts ready for spaced recall.
4. A small number of fresh concepts for variety.

## 5.3 Custom Gauntlet

A shareable challenge should encode a stable deck ID or signed server seed, not a client-trusted question payload. The recipient plays the same deck and compares outcome/Q&A. Do not record the creator's tap timeline or offer a replay of their run.

---

# 6. Arena Rival cold-start engine

## 6.1 Objective

At launch, real human queue density will be low. A match should still be available for first-session calibration and early practice. Arena Rivals provide controlled opponent behavior so a new player is not confronted with an empty queue every time.

The purpose is **playability and calibration**, not manufacturing fake social proof.

## 6.2 Player-facing rules

- The rival occupies the normal opponent slot.
- Do not show BOT/AI/simulated/training labels.
- Use a neutral arena-rival name/callsign and abstract avatar, not a fabricated human identity.
- Do not invent a real person's employer, university, location, online status or verification.
- Do not show false “typing...” behavior or claim a rival is live.
- Do not create public profile pages or human follower graphs for rivals.
- Match history includes both sides' Q&A in the same structured format. No special replay marker is shown.

## 6.3 Internal rival profiles

Each profile defines:
- Target skill band.
- Domain and subtopic strengths/weaknesses.
- Probability of a correct answer by question difficulty.
- Response-time distribution.
- Distractor/misconception tendency.
- Streak consistency and time-pressure behavior.
- Profile seed and model version for deterministic reproducibility.

Avoid a handful of fixed deterministic profiles that users can memorize. Generate controlled variation around calibrated profiles.

## 6.4 Response-time model

Use a positive, right-skewed distribution (e.g. shifted log-normal) rather than a uniform random timer. Condition it on:
- Prompt length and display complexity.
- Mechanic type.
- Rival skill estimate.
- Item difficulty.
- Domain familiarity.
- Correct versus incorrect outcome, if empirically justified.

Keep response times within plausible bounds. Initial distribution parameters are hypotheses. Refit only from privacy-safe, consented player telemetry and controlled evaluations. Do not overfit to tiny samples.

## 6.5 Answer model

A logistic model is a reasonable initial structure:

`P(correct) = c + (1 - c) / (1 + exp(-a * (theta_rival - b_question)))`

Where:
- `theta_rival` is the rival's ability estimate.
- `b_question` is the question difficulty.
- `a` is question discrimination.
- `c` is a guess floor (0.25 may be a starting prior for four choices, not a universal truth).

If incorrect, sample among distractors using misconception weights. Do not choose obviously absurd options to make the user feel good.

## 6.6 Rating treatment

Maintain separate concepts:

- **Placement/calibration estimate:** may be informed by calibration and Arena Rival matches.
- **Competitive ranked rating:** represents the human competitive population.

Recommended policy:
- Arena Rival matches can award controlled XP, mastery exposure and review items.
- Arena Rival matches do not enter human-versus-human Glicko-2 rating calculations.
- No Arena Rival win/loss is counted as a human leaderboard result.
- Provisional rating remains explicitly provisional internally; public percentiles require real population data.
- Once the player has sufficient human matches, competitive rating settles from human results.

---

# 7. Competitive rating and rank system

## 7.1 Glicko-2 for human competition

Use Glicko-2 for each domain because it models skill and uncertainty. Maintain a separate tuple for each domain. An overall display rating may be introduced only after a clear, tested aggregation policy; do not average domain scores naively and call it a competitive rating.

Per player/domain:
- `r`: rating.
- `RD`: rating deviation / uncertainty.
- `sigma`: rating volatility.
- `matches_played`, `wins`, `draws`, `losses`.
- `last_rated_at`, `is_provisional`, `calculation_version`.

Use standard Glicko-2 scale initialization (e.g. rating 1500, RD 350, volatility 0.06), unless a documented transformation is used for the display layer. Do not alter the mathematics to force a preferred number on screen.

Conversion:

`mu = (r - 1500) / 173.7178`

`phi = RD / 173.7178`

Opponent impact:

`g(phi_j) = 1 / sqrt(1 + 3 * phi_j^2 / pi^2)`

`E_j = 1 / (1 + exp(-g(phi_j) * (mu - mu_j)))`

For all eligible results in a rating period:

`v = 1 / sum(g(phi_j)^2 * E_j * (1 - E_j))`

`delta = v * sum(g(phi_j) * (s_j - E_j))`

Then implement the complete published Glicko-2 volatility update and posterior `mu`, `phi` update. Use the official reference test vectors.

Result values:
- Win: `s = 1.0`.
- Draw: `s = 0.5`.
- Loss: `s = 0.0`.

**Do not feed raw points margin or speed as a fractional Glicko outcome.** Speed affects game points and therefore can affect who wins. Adding it again as a fractional rating bonus risks double-counting speed.

## 7.2 Rating periods

Choose one deterministic rating-period strategy after simulation:
- Update after each completed eligible match using a correct single-opponent update, or
- Batch matches into defined periods and update with all period opponents.

Do not mix per-match and daily batch semantics unpredictably. Store the algorithm version and all inputs needed to reproduce a rating update.

## 7.3 Divisions

Begin with a small number of divisions. Candidate naming: Initiate, Builder, Specialist, Architect, Grandmaster. Exact thresholds must be selected after rating simulations, not from arbitrary round numbers.

Division policy must define:
- Promotion threshold.
- Demotion policy.
- Provisional placement behavior.
- Inactivity behavior.
- Season reset or no reset.
- RD visibility and confidence treatment.

Avoid demoting players harshly due to short inactivity.

---

# 8. Scoring, streaks and competitive balance

## 8.1 Initial score model

Parameters (initial values to validate through simulation):
- Base correct-answer points `B = 100`.
- Maximum speed bonus `V = 60`.
- Per-round deadline `T = 7,500 ms`.
- Speed curve exponent `gamma = 1.4`.
- Streak multiplier: `1.00x`, `1.10x`, `1.20x`.
- Overdrive multiplier: `1.50x` on round 8 only.

For correct answer with verified elapsed time `t`:

`speed_bonus = V * (1 - clamp(t, 0, T) / T)^gamma`

`round_points = floor((B + speed_bonus) * streak_multiplier * overdrive_multiplier)`

Streak thresholds:
- 1–2 consecutive correct: `1.00x`.
- 3–4 consecutive correct: `1.10x`.
- 5+ consecutive correct: `1.20x`.

Incorrect or timeout:
- 0 points.
- Reset streak.
- No arbitrary large negative deduction for a normal mistake.

## 8.2 Balance constraints

- The final question should matter but must not overpower the other seven.
- A wrong answer should not punish normal exploration so severely that players become afraid to tap.
- Speed bonus should be meaningful but not dominate accuracy.
- The same score rules apply to both participants.
- Cosmetics, network quality and device performance cannot grant bonus score.

Before tuning, simulate:
- High accuracy / slower responder versus lower accuracy / fast responder.
- Strong players versus weaker players.
- High and low latency conditions.
- Comeback probability from each round.
- How often Overdrive reverses a lead.

Reject parameter sets where a player with consistently weaker accuracy wins too frequently due to speed or one final-round outcome.

## 8.3 Anti-spam and answer timing

Do not impose a blanket penalty because an answer arrives in under 850 ms. A player may recognize a short option quickly, and accessibility tools or device conditions may differ.

Instead monitor patterns across multiple matches:
- Near-zero response times repeated at implausible frequency.
- Repeated fixed-position selections.
- Perfect accuracy at impossible timing distributions.
- Automation-like cadence.
- Abnormal duplicate submissions.

Use rate limits, risk scoring and review. Never silently alter score based on one opaque heuristic in one round.

---

# 9. Question difficulty calibration and deck composition

## 9.1 Editorial prior before statistical calibration

At cold start, there is no reliable response dataset. Begin with:
- Expert-assigned difficulty band.
- Expected audience/assumed prerequisites.
- Editorial confidence.
- Source quality.
- A small pilot cohort review.

Do not pretend the item has a statistically learned Elo/IRT difficulty after a few exposures.

## 9.2 IRT calibration

Once there is sufficient, diverse response data, estimate item parameters using a Rasch/1PL or 2PL model. Consider a 3PL guessing parameter only when the data volume supports it.

2PL:

`P(correct | theta) = 1 / (1 + exp(-a * (theta - b)))`

Where `a` is item discrimination and `b` is difficulty.

3PL:

`P(correct | theta) = c + (1 - c) / (1 + exp(-a * (theta - b)))`

Rules:
- Do not use response speed as correctness in the core IRT model.
- Model response time separately unless a validated joint model is introduced.
- Use shrinkage/priors for sparse questions.
- Track parameter uncertainty.
- Retire or rewrite low-discrimination or disputed items.
- Ensure player ability estimates are not biased by only serving players questions that match their current estimate.

## 9.3 Adaptive deck composer

Inputs:
- Mode and selected domain.
- Both players' rating estimates and RD/uncertainty.
- Recent question exposure for both players.
- Active question versions and review status.
- Mechanic and subtopic balance constraints.
- Current match pacing slot.
- Learning data only in modes where personalization is allowed.

Composition stages:
1. Determine a target difficulty range based on player estimates and uncertainty.
2. Filter out retired, disputed, stale and ineligible questions.
3. Exclude exact recent exposures for both human players when feasible.
4. Enforce domain, mechanic and subtopic mix.
5. Follow the eight-round difficulty arc.
6. Avoid repeated concepts, answer-position patterns and distractor patterns.
7. Select high-quality Overdrive items with strong discrimination and clear correctness.
8. Freeze question versions and option IDs for the entire match.

For a human match both players receive the same question sequence. Personalization may change the sequence only in solo modes.

## 9.4 Deduplication

A Bloom filter can be used as a fast pre-filter, but it does not guarantee zero repeats. Use exact recent-exposure storage for the final exclusion check when feasible. If question supply is insufficient, relax the dedup window rather than failing matchmaking indefinitely. Log the relaxation internally for content operations.

---

# 10. Matchmaking system

## 10.1 Principles

- Match real players first when an eligible opponent is available.
- Consider domain, rating distance, rating uncertainty, network region/latency and queue age.
- Expand rating tolerance gradually.
- Never match a user against themselves.
- Prevent one user from holding multiple active queue entries.
- Make join, cancel, timeout and match assignment idempotent.
- Use Arena Rival fallback after a configurable wait budget.
- Treat queue-time targets as measured service objectives, not universal guarantees.

## 10.2 Candidate cost function

Use hard eligibility filters first, then a weighted soft-cost ranking:

`cost = w_r * rating_distance + w_u * uncertainty_penalty + w_l * latency_penalty + w_f * recent_rematch_penalty - w_q * queue_age_bonus`

Definitions:
- `rating_distance`: normalized rating mismatch.
- `uncertainty_penalty`: penalize pairing two uncertain/provisional players only when it harms fair placement.
- `latency_penalty`: estimate path quality, not geography alone.
- `recent_rematch_penalty`: avoid repetitive pairings unless players explicitly request a rematch.
- `queue_age_bonus`: gradually widen acceptable candidates as users wait.

The cost formula is a candidate ranking model, not a claim of optimal matchmaking. Tune with simulation and real outcomes.

## 10.3 Queue widening

Initial policy proposal:
- 0–1 seconds: prioritize close skill and stable connection.
- 1–3 seconds: gradually widen rating tolerance.
- 3–5 seconds: widen further while retaining a maximum acceptable mismatch.
- At configured fallback threshold: start Arena Rival if no appropriate human match exists.

Store policy parameters in configuration. Avoid hard-coded tolerances in multiple services.

## 10.4 Atomic assignment

A player can be assigned to at most one active match. Use a single authoritative coordinator for queue reservation/assignment. If using a Redis sorted set and Lua, ensure the script handles reservation, cancellation races and room creation idempotency; if using Durable Object storage/coordination, partition keys to avoid global hotspots. The persistence design must survive retries and process eviction.

---

# 11. Response-time verification and anti-cheat

## 11.1 Timing model

Client clocks are not authoritative. Server stores:
- Round start timestamp and deadline.
- Server receive timestamp for answer.
- Client monotonic elapsed time as a diagnostic signal.
- Recent RTT/jitter samples.
- Any bounded network adjustment and its reason.
- Final effective elapsed time used for scoring.

Do not blindly subtract `RTT / 2`; network delay can be asymmetric and jitter varies. Start with server receipt time and a conservative bounded adjustment policy that is tested with real mobile networks. Keep raw and adjusted timing separately for audit.

## 11.2 Server validation

For each `ANSWER_SUBMIT`:
1. Authenticate the participant.
2. Verify match membership and slot.
3. Verify match/round state is active.
4. Verify round nonce and question version.
5. Verify choice ID belongs to the presented set.
6. Check server deadline and documented grace period.
7. Enforce one answer per player/round.
8. Persist with an idempotency key.
9. Resolve only when the state machine permits.

## 11.3 Abuse signals

Monitor:
- Duplicate answers and replayed requests.
- Impossible or suspicious answer timing across many rounds.
- Fixed screen-coordinate selection patterns.
- Account farming and collusion.
- Repeat-pair win trading.
- Automated queue cycling.
- Content scraping and endpoint abuse.

Use risk scoring, throttling and review. Do not automatically ban on a single weak signal. Maintain an audit trail and appeal route.

## 11.4 Content protection

- Do not send correct choice IDs before resolution.
- Shuffle answer order with a server-generated permutation per player, preserving stable choice IDs.
- Validate authorization and schemas at the server.
- Do not rely on zero-width characters, Canvas text or disabling text selection as security controls. These are not robust anti-scraping defenses.
- Use request limits, abuse monitoring and server-side question selection.

---

# 12. Spaced repetition and knowledge system

## 12.1 Separate competitive skill from learning mastery

Competitive rating represents match performance against eligible opponents. Mastery represents how robustly a player understands concepts over time. A high-ranked player can still have knowledge gaps; do not collapse everything into one number.

## 12.2 MVP scheduler: Leitner-style review

Store per user/question or, preferably, user/concept where multiple questions map to one concept:
- Review stage/box.
- Last result.
- Last response time.
- Miss count.
- Last reviewed timestamp.
- Next due timestamp.
- Confidence rating if collected.

Initial interval ladder may be configured, for example: 1 day, 3 days, 7 days, 14 days, 30 days. These are starting values to validate, not scientific guarantees.

On correct recall:
- Move one stage up, with a cap.
- Schedule according to next interval.

On incorrect recall:
- Move down one or more stages according to severity.
- Give a concise explanation.
- Avoid repeatedly presenting the same item in one session.

Do not label a custom scheduler “SM-2” unless it actually implements SM-2. A Leitner-style MVP is easier to explain and inspect.

## 12.3 Concept mapping

Multiple question versions may assess the same underlying concept. Map questions to canonical concepts so one incorrect item can create a meaningful review target rather than a duplicate pile of near-identical cards.

## 12.4 Vault functionality

- Save a question or concept.
- Review missed concepts.
- Filter by domain/subtopic.
- View due reviews.
- Inspect the mental-model explanation.
- Remove saved material.

The Vault is a learning workspace, not a social feed.

---

# 13. The Forge — content creation, validation and governance

## 13.1 Content quality is the moat

A beautiful game cannot compensate for weak, ambiguous or incorrect questions. Every ranked question must be technically correct, unambiguous, useful, fast to parse, sourced and equipped with plausible distractors and an explanation that teaches.

## 13.2 Source policy

Preferred sources:
- Peer-reviewed research and reputable preprints.
- Official specifications, RFCs and standards.
- Official language/runtime/framework docs.
- Database, cloud, OS and infrastructure documentation.
- Engineering postmortems and architecture writeups.
- High-quality textbooks and university material.

Store source title, author/publisher, URL, publication/update date, access date, version, relevant section and extracted claim. Write original questions and concise explanations. Respect copyright and do not reproduce large source passages.

## 13.3 AI-assisted pipeline

1. **Ingest:** discover high-signal technical material.
2. **Extract evidence:** identify a mechanism, trade-off, claim or failure mode with source context.
3. **Draft:** generate prompt, four choices, correct choice, distractor rationale, explanation and tags under a strict schema.
4. **Independent solve:** a second reviewer solves without seeing the proposed answer.
5. **Adversarial critique:** attempt to justify alternate answers, identify missing assumptions and find counterexamples.
6. **Technical verification:** validate equations, version assumptions, source support and examples.
7. **Editorial review:** humans approve content for ranked use.
8. **Difficulty prior:** assign initial difficulty and uncertainty.
9. **Publish:** versioned release to practice or ranked pool.
10. **Monitor:** disputes, answer distributions, time distributions and discrimination.

A model confidence score is not proof. Independent model review is not a substitute for human expertise on advanced or high-impact content.

## 13.4 Question lifecycle

`DRAFT → VALIDATING → HUMAN_REVIEW → ACTIVE_PRACTICE → ACTIVE_RANKED`

Exceptional statuses:
- `DISPUTED`
- `QUARANTINED`
- `RETIRED`

A disputed or stale question is removed from ranked selection until reviewed. Historical matches continue to reference the original version.

## 13.5 Question schema

Required fields:
- `question_id`, immutable `version`.
- `domain_id`, `subtopic_id`, `concept_id`.
- `mechanic_type`, `skill_tags`, `difficulty_band`.
- `prompt_payload` and accessible text equivalent.
- Four choices with stable `choice_id` values.
- Server-only correct choice ID.
- Explanation and optional comparison matrix.
- Misconception mapping per distractor.
- Source references and assumptions.
- Author/reviewer metadata.
- Editorial difficulty, calibration state and confidence.
- Status and timestamps.

## 13.6 Peer review

A high rating alone should not unlock unrestricted publishing. Community maintainers require sustained integrity, reviewer training and a track record.

Rules:
- At least two independent approvals for ordinary ranked content.
- More review for security, cryptography and expert-level questions.
- Conflicts of interest and authorship visible to moderators.
- A report/dispute action on every question.
- Review quality evaluated by subsequent dispute outcomes, not raw approval count.
- Reviewer privileges can be suspended.

## 13.7 Document-to-Duel (later Pro feature)

Users may submit a permitted paper, PDF, repository README or technical document to create a private practice deck.

Requirements:
- Ownership/permission confirmation and copyright-aware extraction.
- File size/type limits and URL safety.
- Treat source document contents as untrusted data, not instructions to the generator.
- Source-grounded explanation and provenance.
- Private by default; public sharing requires moderation.
- Easy deletion and retention controls.
- Generated questions never enter ranked pools automatically.

---

# 14. Technical architecture

## 14.1 Architecture goals

- Mobile-first, responsive client.
- Server-authoritative match lifecycle.
- Durable match result and both-player Q&A history.
- Low idle cost at early scale.
- Clear boundary between human opponents and Arena Rivals.
- Testable state machine and deterministic scoring/rating.
- One primary durable source of truth.
- No unnecessary microservices.

## 14.2 Recommended initial architecture

The repository's existing working stack takes precedence. Do not rewrite the application purely to match this proposed diagram.

A reasonable launch shape:

- **Client:** existing Next.js/React PWA if that is already the working codebase. Add native React Native/Expo only when a concrete native capability or distribution requirement justifies maintaining a second runtime.
- **API:** stateless request handlers (e.g. Cloudflare Workers or the hosting platform's server routes) for profile, content, history and non-realtime actions.
- **Realtime:** one authoritative room per match. Cloudflare Durable Objects are a strong option when Cloudflare is already selected; otherwise use the hosting provider's equivalent stateful WebSocket/session service.
- **Primary database:** PostgreSQL (Supabase Postgres is a plausible managed option) for users, ratings, question versions, match history, Q&A, Vault and content review.
- **Authentication:** one provider only (e.g. Supabase Auth). Anonymous-first sessions must upgrade to linked accounts without losing progress.
- **Asset storage:** one canonical object storage/CDN for 3D, image and audio assets.
- **Cache:** optional. Add Redis/Upstash only when measured queue, rate-limit, leaderboard or hot-read needs justify it.

Do not deploy Cloudflare Workers + Durable Objects + Upstash Redis + multiple databases by default. Avoid overlapping sources of truth.

## 14.3 Logical modules (not necessarily separate services)

1. Identity and anonymous account linking.
2. User profile and entitlements.
3. Question retrieval and versioning.
4. Content review and publishing.
5. Matchmaking and queue reservation.
6. Match-room state machine.
7. Arena Rival behavior engine.
8. Scoring and outcome resolution.
9. Rating ledger and Glicko-2.
10. Match history and Q&A comparison.
11. Vault and review scheduling.
12. Progression, XP, streaks and cosmetics.
13. Analytics and abuse detection.
14. Organization/Turf War module (later phase).

Start as modules in a small number of deployables. Split only when ownership, load or release cadence requires it.

## 14.4 Match-room state machine

Normal path:

`CREATED → QUEUED/WAITING → READY → ROUND_ACTIVE → ROUND_RESOLVING → ROUND_COMPLETE → ... → MATCH_COMPLETE`

Exceptional states:
- `CANCELLED` before start.
- `PLAYER_RECONNECTING` as participant state.
- `MATCH_VOID` when integrity cannot be maintained.
- `FAILED_FINALIZATION` for retryable persistence failure, never exposed as a completed result until commit succeeds.

Rules:
- Every transition validates the prior state.
- All client commands are idempotent or rejected safely.
- Duplicate answer submissions cannot award points twice.
- A resolved round cannot reopen.
- Match finalization commits once.
- A failed rating update can be retried from the immutable match result and rating ledger.

## 14.5 Realtime protocol

Use versioned, schema-validated messages.

### Client → server
- `QUEUE_JOIN`
- `QUEUE_CANCEL`
- `CLIENT_READY`
- `ANSWER_SUBMIT`
- `RECONNECT_RESUME`
- `HEARTBEAT` (only if needed beyond transport ping/pong)

### Server → client
- `QUEUE_STATUS`
- `MATCH_FOUND`
- `MATCH_START`
- `ROUND_START`
- `OPPONENT_LOCKED`
- `ROUND_RESULT`
- `MATCH_RESULT`
- `RECONNECT_STATE`
- `MATCH_VOID`
- `ERROR`

Every relevant message should include:
- `protocol_version`.
- `match_id`.
- `round_index` if round-specific.
- Request/event ID for idempotency.
- Timestamp or server deadline where needed.

Do not send correct answer IDs before round resolution.

## 14.6 Server-authoritative answer contract

1. Server persists the round start and deadline.
2. Server sends prompt and choices, never correct choice before resolution.
3. Client renders timer from server deadline and local monotonic time.
4. Client submits choice ID, round nonce and request ID.
5. Server verifies identity, match membership, active round, nonce, choice membership, deadline and duplicate status.
6. Server records receipt time and derives effective elapsed time under the documented timing policy.
7. When both answers are locked or the deadline expires, the server resolves the round.
8. Server sends the same canonical resolution to both clients, with each player's own choice mapping correctly translated.
9. After round eight, the server commits match, rounds, both answers, scores, outcome and eligible rating ledger entries.

## 14.7 Reconnection and failure recovery

- Reconnect token bound to authenticated user and match.
- Configurable bounded reconnect grace period.
- Round deadline persists across reconnect.
- Rejoining before round resolution returns current state and remaining time.
- Rejoining after resolution returns result, not a chance to answer retroactively.
- A single transaction or idempotent finalization process commits match results.
- Reconstruct only the minimal live state required to resume.
- If state integrity cannot be proven after failure, void the match and protect rating integrity.

Do not rely on in-memory variables alone for match state.

---

# 15. Data model and database contracts

This is a logical model. Apply only the tables required by the first release, but preserve the contracts.

## 15.1 `users`

Suggested fields:
- `id UUID PRIMARY KEY`.
- `handle` unique and nullable until claimed.
- `created_at`, `updated_at`.
- account-link metadata.
- optional user-selected region/country code.
- moderation and account status.

Do not expose email as public profile data.

## 15.2 `user_profiles`

- `user_id` FK.
- selected domain.
- avatar/nameplate/title/theme IDs.
- profile visibility options.

## 15.3 `user_domain_ratings`

- `user_id`, `domain_id` composite key.
- `rating`, `rating_deviation`, `volatility`.
- `matches_played`, `wins`, `draws`, `losses`.
- `is_provisional`, `last_rated_at`, `algorithm_version`.

## 15.4 `questions` and `question_versions`

`questions` stores stable identity, domain/concept and current published version pointer. `question_versions` stores immutable content versions:
- version number.
- mechanic, prompt and display payload.
- four stable choice IDs.
- correct choice ID (server-only before resolve).
- explanation/mental model.
- difficulty prior and calibration state.
- source references, assumptions and review data.
- publication status and timestamps.

Published question versions are immutable. Corrections create a new version.

## 15.5 `matches`

- `id`, `mode`, `domain_id`, `status`.
- `player_a_id`, `player_b_id` (nullable only for a non-account rival slot if implementation requires it).
- internal `opponent_source` / `match_population` metadata.
- started/completed timestamps.
- both final scores and outcome.
- `rating_eligible` and `void_reason`.
- no replay URL, replay cursor or replay event payload.

## 15.6 `match_rounds`

- `match_id`, `round_index` composite key.
- `question_id`, `question_version`.
- immutable reference/snapshot of the exact prompt and choice mapping used.
- server start/deadline/resolution timestamps.
- canonical correct choice ID.
- round status.

## 15.7 `match_round_answers`

- `match_id`, `round_index`, `player_slot` composite key.
- `user_id` nullable only for an Arena Rival slot.
- `selected_choice_id`.
- `is_correct`.
- `server_elapsed_ms`, bounded adjustment, `effective_elapsed_ms`.
- `points_awarded`.
- `answer_status` (answered, timeout, disconnected/void).
- created timestamp.

This table enables the two-player Q&A comparison by joining both answer rows for each round. It is a result ledger, not an event replay stream.

## 15.8 `rating_ledger`

- match ID and player ID.
- rating scope/domain.
- pre-rating, post-rating, delta, RD and volatility.
- eligibility and calculation version.
- idempotency key.

## 15.9 `user_knowledge_items`

- user and canonical concept/question reference.
- bookmark state.
- review stage.
- last result and response-time signal.
- miss count and next due timestamp.

## 15.10 `recent_question_exposures`

- user ID, question ID, timestamp and mode.
- indexes on user/time and question/user.
- retention policy appropriate for deduplication.

## 15.11 Later organization entities

`organizations` and `organization_memberships` should be introduced only when organization competition is ready. Verification must distinguish a verified email domain from official institutional endorsement.

## 15.12 Constraints and indexes

- Unique active queue entry per user.
- Unique answer per match/round/player slot.
- Unique rating ledger entry per match/user/rating scope.
- Foreign keys and check constraints for states and score ranges.
- User history index by `completed_at DESC`.
- Question selection index by domain/status/difficulty.
- Due review index by user/next due.
- Exposure dedup index by user/question/time.
- Row-level security: only match participants may read their completed match/Q&A.

## 15.13 Explicitly prohibited replay schema

Do not create:
- `ghost_replays`.
- `replay_events`.
- `replay_cursor_data`.
- tap timeline storage.
- pointer-coordinate streams.
- animation-frame or screen-recording collections.

---

# 16. Progression, mastery and in-app economy

## 16.1 Two separate progression systems

**Competitive:** domain rating, division, wins/losses/draws and eligible leaderboard position.  
**Mastery:** concept strength, review progress, Vault content, consistency and learning streak.

Do not represent a player's entire engineering ability with one number.

## 16.2 XP

XP measures participation and learning activity. It is not competitive rating. Award for meaningful completion, daily challenge participation, Vault review and accepted community contributions. Avoid farming by requiring valid match completion and applying reasonable caps to repetitive activities.

## 16.3 Sparks

Sparks are earned cosmetic currency, not power. Potential sources:
- Completed duels.
- Daily challenge milestones.
- Review completion.
- Approved content contributions.
- Season or community milestones.

Potential uses:
- Standard tags and nameplates.
- Avatar frames.
- Non-competitive effects.
- Streak repair/freeze only if carefully balanced and not required to remain competitive.

Never allow Sparks to buy extra time, better choices, rating boosts or ranked multipliers.

## 16.4 Streaks

- Define one simple daily completion rule.
- Do not require a ranked win; a meaningful learning session can count.
- Specify timezone handling.
- Let users hide streaks.
- Avoid shame-based loss messages.
- A repair/freeze mechanic must remain optional and not create pay pressure.

## 16.5 Cosmetics

Possible categories:
- Nameplates.
- Avatar frames.
- Earned technical titles.
- Arena skins.
- Victory banners.
- Profile badges.
- Sound packs.

No gameplay effects. Cosmetic rarity is status decoration, not competitive advantage.

---

# 17. Monetization and business model

## 17.1 Product promise

Core ranked play remains free. Basic access to match Q&A and explanations remains useful on the free plan.

## 17.2 Pro hypotheses

Possible subscription benefits:
- Expanded post-match analytics and concept-level trends.
- Advanced Weakness Blitz scheduling and deck controls.
- Private Paper/Repo-to-Duel generation within fair-use limits.
- Advanced Vault organization and exports.
- Premium identity cosmetics and themes.

Do not make basic mistake explanations or core match history paywalled. Prices from early drafts are hypotheses, not commitments. Validate willingness to pay, service cost, store fees, taxes and local purchasing power.

## 17.3 B2B opportunities (later)

- Sponsored domain arenas.
- Private team tournaments.
- Team learning dashboards with privacy safeguards.
- University/club competitions.
- Optional Slack/Discord integrations.
- Opt-in skills challenges.

Do not sell personal answer histories or inferred skill profiles to employers. Any recruiting/credential use must be opt-in, transparent, explainable and independently validated. A one-minute game score is not a hiring credential by itself.

---

# 18. Analytics, experimentation and observability

## 18.1 Product events

Track a minimal purposeful event set:
- `onboarding_started`, `domain_selected`, `calibration_completed`.
- `queue_joined`, `queue_matched`, `queue_cancelled`, `arena_rival_started` (internal analytics only).
- `match_started`, `round_answered`, `round_timed_out`, `match_completed`, `match_voided`.
- `match_history_opened`, `round_explanation_opened`, `vault_saved`, `review_completed`.
- `rematch_clicked`, `share_created`, `share_opened`.

Do not duplicate complete question payloads into generic analytics if question IDs and outcomes are enough.

## 18.2 Match-quality dashboard

- Human-match share by region/domain/time.
- Arena Rival fallback rate.
- Median/p95 queue wait.
- Rating and uncertainty gap.
- Match completion, disconnect, reconnect and void rates.
- Response-time distribution by device/network bucket.
- Question accuracy/discrimination/dispute rate.
- Match rematch and return rate.
- Q&A and explanation engagement.

## 18.3 Experiments

Test one major variable at a time:
- 6 vs 8 vs 10 rounds.
- Round duration.
- Immediate feedback amount.
- Overdrive multiplier.
- Matchmaking fallback threshold.
- Difficulty pacing.
- Arena Rival profile distributions.
- Explanation placement.
- Onboarding calibration length.

Do not change scoring, rating, question difficulty and match pacing together; experiments become uninterpretable.

## 18.4 Operational observability

Monitor:
- WebSocket connection success and disconnect rates.
- Match-room state transitions and invalid transition attempts.
- Queue reservation collisions.
- Match finalization retries.
- Database transaction failures and latency.
- Rating ledger idempotency violations.
- Content retrieval failures and empty deck events.
- Asset delivery metrics are owned by the design/client implementation brief.

Keep logs free of secrets and unnecessary personal data. Correlate by match ID and request ID, not raw credentials.

---

# 19. Testing and quality gates

## 19.1 Unit tests

- Glicko-2 reference vectors.
- Score formula boundaries and multiplier transitions.
- Streak reset behavior.
- Timeout and late-answer handling.
- Duplicate answer idempotency.
- Option permutation mapping.
- Question version immutability.
- IRT probability monotonicity and parameter bounds.
- Review scheduling.
- Rating eligibility and ledger writes.

## 19.2 Property-based tests

- A player cannot answer twice in one round.
- A resolved round cannot reopen.
- Total score equals the sum of round points.
- Standard Blitz has exactly eight rounds unless voided before completion.
- Both human players receive the same question version and round sequence.
- Every selected choice belongs to the choices shown.
- Correct choice is never emitted before resolution.
- Every completed match has a complete two-slot Q&A record for all rounds, with timeouts explicit.
- Rating writes are idempotent.
- Arena Rival matches never produce human leaderboard entries.
- No replay data is persisted.

## 19.3 Integration tests

- Two human clients queue and match.
- One user queues and receives Arena Rival fallback.
- Players answer at different times.
- A player times out.
- Duplicate packets arrive.
- Client disconnects and reconnects.
- Room restarts during an active match.
- Match finalization retries.
- Both participants can read Q&A history.
- Unrelated users cannot read private Q&A.
- A question is disputed after a match; old history retains played version.

## 19.4 Load and failure tests

Test queue coordination, match rooms, concurrent WebSockets, database writes and question selection independently. Test traffic bursts, reconnect storms, hot domain partitions and database saturation. Measure actual cost and bottlenecks. Do not claim 500,000 DAU readiness from an architecture diagram.

## 19.5 Content QA

Every ranked question must pass:
- One clearly correct answer.
- No hidden assumption.
- Plausible distractors.
- Source verification.
- Mobile readability review (visual acceptance is in the companion design doc).
- Prompt-comprehension test.
- Expert/editorial review.
- Post-release dispute monitoring.

## 19.6 Product playtests

Test with technical users at different levels. Observe:
- Can a first-time user play without a tutorial video?
- Do they understand why they won or lost?
- Do they trust the questions?
- Does the match feel fair?
- Do they inspect both-player Q&A?
- Does an Arena Rival fallback feel coherent without fake human claims?
- Is it fun for ten consecutive matches?
- Does the learning layer help without slowing the game?

---

# 20. Delivery roadmap

## Phase 0 — Foundation

- Confirm data contracts and question taxonomy.
- Build content authoring/validation workflow.
- Implement match state machine and scoring unit tests.
- Implement Glicko-2 reference tests.
- Set up analytics and observability baseline.
- Agree the paired visual design brief and core design system.

**Exit gate:** ownership of state, scoring, rating, question version and match Q&A is unambiguous.

## Phase 1 — Playable vertical slice

- Instant entry / calibration.
- One content-ready domain with a strong question bank.
- Four core mechanics.
- Eight-round match state machine.
- Arena Rival engine.
- Match result and both-player Q&A history.
- Anonymous session persistence/account linking.

**Exit gate:** repeated matches work end-to-end, content is accurate and the product is fun on target devices.

## Phase 2 — Real multiplayer and ranked integrity

- Human queue.
- Authoritative WebSocket room.
- Reconnect and void policy.
- Glicko-2 rating ledger.
- Provisional-to-ranked transition.
- Match-history access controls.
- Abuse/fairness monitoring.

**Exit gate:** no duplicate score/rating writes; real matches are fair and auditable.

## Phase 3 — Learning and retention

- Vault.
- Weakness Blitz.
- Daily Anomaly.
- Domain mastery insights.
- Rematch and share links.

**Exit gate:** repeat play and learning engagement improve without reducing match completion.

## Phase 4 — Content network and social competition

- The Forge review workflow.
- Maintainer tools.
- Custom Gauntlets.
- Friend lobbies.
- Team/campus events.

**Exit gate:** content quality, moderation and anti-abuse systems scale with participation.

## Phase 5 — Monetization and ecosystem

- Pro subscription.
- Private Paper/Repo-to-Duel.
- Cosmetics locker.
- Sponsored arenas.
- Organization analytics and integrations.

**Exit gate:** paid features strengthen the product without compromising competitive fairness.

---

# 21. First serious public-release definition of done

## Product
- A new user can reach a playable session quickly without a forced registration wall.
- The game is understandable without a tutorial video.
- All four mechanics are distinct and usable.
- Match history accurately shows both players' Q&A.
- No replay UI or replay-storage system exists.
- Arena Rival fallback uses neutral presentation without BOT/AI labels or fabricated human identity.
- Rematch is one obvious action.

## Integrity
- Server controls round deadlines, accepted answers, scoring and outcome.
- Correct choice is not leaked before resolution.
- Score formula is documented and tested.
- Rating updates are restricted to eligible human competition.
- Void matches cannot update ratings.

## Content
- Ranked questions have source provenance and review approval.
- Published versions are immutable.
- Users can report disputed questions.
- Content supply is large enough for the intended launch cohort.

## Engineering
- Duplicate packets and reconnection are safe.
- Match finalization is idempotent.
- Database permissions protect history.
- Failure/load tests pass for the target launch profile.
- Low/mid-range Android performance is acceptable.
- Monitoring and incident alerts are active.

## Trust
- No fabricated human identity, affiliation or percentile.
- No pay-to-win.
- No sale of personal answer history to employers.
- Clear privacy, retention and account-deletion controls.

---

# 22. Open decisions requiring prototypes or data

Do not hard-code these without evidence:

1. Exact per-round time limit.
2. Whether a compact correct-answer reveal appears after every round or only in the final Q&A.
3. Exact Overdrive multiplier.
4. Arena Rival fallback delay by domain/region.
5. Rating period strategy and minimum human matches for ranked status.
6. Whether the first public build launches all six domains or only content-ready domains.
7. PWA-first versus native mobile release timing based on the current repository.
8. Pro price and usage limits.
9. How much of the 3D asset pipeline can be loaded on initial entry (see the companion design brief).
10. Exact Turf War aggregation formula.

Resolve through simulations, implementation prototypes, moderated playtests and production telemetry.

---

# 23. Final product direction

Maya-Duels should become the place where technical people test their instincts in satisfying competitive bursts. Its defensible loop is:

**A fair fast duel → a meaningful result → both players' Q&A → a useful mental-model correction → a reason to rematch or improve.**

The game must be enjoyable before rating matters. Rating must be trustworthy before leaderboards matter. Questions must be excellent before content volume matters. Learning must make a player better, not merely tell them that they were wrong.

Build the smallest polished version that proves this loop. Expand the content network, social competition, advanced learning and monetization around it.

---

# 24. API, event and content contracts

This section makes the major boundaries implementable. Names are suggested contracts; align them with the current repository's naming conventions, but preserve the semantics.

## 24.1 Core API surface

### Identity and profile
- `POST /v1/session/anonymous` — create or resume an anonymous session.
- `POST /v1/account/link` — link an anonymous identity to a durable account.
- `GET /v1/me` — retrieve the current profile, selected domain and progression summary.
- `PATCH /v1/me/profile` — update allowed profile fields and cosmetic selections.

### Content
- `GET /v1/arenas` — retrieve domain metadata and available-content status.
- `GET /v1/arenas/{domainId}/topics` — retrieve topic taxonomy.
- `GET /v1/questions/{questionId}/explanation` — retrieve a permitted explanation outside a live match.
- `POST /v1/questions/{questionId}/disputes` — submit a content dispute.

Do not expose the ranked question bank as an unrestricted scrape endpoint. Live-match questions are returned through an authorized match context.

### Matchmaking and match
- `POST /v1/queue` or WebSocket `QUEUE_JOIN` — enter a selected mode/domain queue.
- `DELETE /v1/queue/{queueId}` or `QUEUE_CANCEL` — idempotently cancel a pending queue entry.
- WebSocket `ANSWER_SUBMIT` — submit one answer for the active round.
- `GET /v1/matches/{matchId}` — retrieve the final match summary for a participant.
- `GET /v1/matches/{matchId}/qa` — retrieve both players' Q&A for a completed match.
- `GET /v1/matches?cursor=...` — paginated match history.

### Learning and progression
- `POST /v1/vault/items` — save a question/concept.
- `DELETE /v1/vault/items/{itemId}` — remove a saved item.
- `GET /v1/vault` — retrieve saved, due and missed concepts.
- `POST /v1/reviews/{itemId}/result` — submit a review outcome.
- `GET /v1/ranks/{scope}` — retrieve an eligible leaderboard scope.

All endpoints must authenticate, authorize and validate payloads. Public data and private profile data need separate response models.

## 24.2 Standard event envelope

Suggested event envelope:

```json
{
  "protocol_version": 1,
  "event_id": "evt_uuid",
  "op": "ROUND_START",
  "match_id": "match_uuid",
  "round_index": 3,
  "server_ts": "2026-11-20T06:00:00.000Z",
  "payload": {}
}
```

Rules:
- `event_id` is unique for server events and supports duplicate detection.
- Client commands include a client-generated `request_id` for idempotency.
- Unknown protocol versions are rejected with a controlled error.
- Payload sizes and string lengths are bounded.
- The envelope never carries secrets or authentication tokens.

## 24.3 Example `ROUND_START` event

```json
{
  "protocol_version": 1,
  "event_id": "evt_round_start_003",
  "op": "ROUND_START",
  "match_id": "match_01J...",
  "round_index": 3,
  "server_ts": "2026-11-20T06:00:12.000Z",
  "payload": {
    "deadline_ts": "2026-11-20T06:00:19.500Z",
    "round_nonce": "opaque_nonce",
    "mechanic": "ARCHITECTURE_TRIAGE",
    "question": {
      "question_id": "q_hot_key_001",
      "version": 2,
      "prompt": {
        "metric_alert": "DB CPU 100% · CACHE STAMPEDE",
        "scenario": "A hot cache key expires; thousands of requests hit PostgreSQL."
      },
      "choices": [
        {"choice_id": "c_singleflight", "label": "Singleflight"},
        {"choice_id": "c_connections", "label": "More DB connections"},
        {"choice_id": "c_write_through", "label": "Write-through cache"},
        {"choice_id": "c_hashing", "label": "Consistent hashing"}
      ]
    }
  }
}
```

The example intentionally omits the correct choice ID. The server keeps the correct choice and explanation private until resolution.

## 24.4 Example `ANSWER_SUBMIT` command

```json
{
  "protocol_version": 1,
  "request_id": "req_01J...",
  "op": "ANSWER_SUBMIT",
  "match_id": "match_01J...",
  "round_index": 3,
  "payload": {
    "round_nonce": "opaque_nonce",
    "choice_id": "c_singleflight",
    "client_elapsed_ms": 1840
  }
}
```

`client_elapsed_ms` is diagnostic input, not the authoritative clock. The server derives the accepted response time using server receipt time and the documented timing policy.

## 24.5 Example `ROUND_RESULT` event

```json
{
  "protocol_version": 1,
  "event_id": "evt_round_result_003",
  "op": "ROUND_RESULT",
  "match_id": "match_01J...",
  "round_index": 3,
  "payload": {
    "correct_choice_id": "c_singleflight",
    "explanation_summary": "Coalesce concurrent misses so one request refreshes the hot key.",
    "players": {
      "self": {
        "choice_id": "c_singleflight",
        "is_correct": true,
        "elapsed_ms": 1840,
        "points_awarded": 151,
        "total_score": 418
      },
      "opponent": {
        "choice_id": "c_connections",
        "is_correct": false,
        "elapsed_ms": 2260,
        "points_awarded": 0,
        "total_score": 366
      }
    }
  }
}
```

The event is resolved for both participants. `self` is relative to the recipient; server-side history stores canonical player slots and stable choice IDs.

## 24.6 Question content object example

```json
{
  "question_id": "q_softmax_temperature_001",
  "version": 1,
  "domain_id": "AI_ML",
  "subtopic_id": "sampling_math",
  "concept_id": "softmax_temperature",
  "mechanic_type": "SHIFT_THE_KNOB",
  "skill_tags": ["math_intuition", "causal_prediction"],
  "difficulty_band": "APPLIED",
  "prompt": {
    "knob_label": "Softmax temperature → very large",
    "scenario": "In standard temperature-scaled softmax, what happens to the distribution?"
  },
  "choices": [
    {"choice_id": "uniform", "label": "Uniform distribution"},
    {"choice_id": "argmax", "label": "Greedy selection"},
    {"choice_id": "zero_entropy", "label": "Zero entropy"},
    {"choice_id": "one_hot", "label": "One-hot distribution"}
  ],
  "correct_choice_id": "uniform",
  "explanation": {
    "summary": "Dividing finite logits by a very large temperature makes their scaled differences approach zero.",
    "mental_model": "As temperature rises, the distribution flattens; in the limit, probabilities approach equal values.",
    "tradeoff": "Higher entropy increases diversity but also reduces selection of high-logit tokens."
  },
  "distractor_rationales": {
    "argmax": "Confuses high temperature with low-temperature greedy behavior.",
    "zero_entropy": "Reverses the relationship between temperature and entropy.",
    "one_hot": "Confuses a flat distribution with a concentrated distribution."
  },
  "source_refs": [
    {"type": "documentation", "url": "https://...", "section": "Temperature scaling", "accessed_at": "2026-11-20"}
  ],
  "review": {
    "status": "ACTIVE_RANKED",
    "reviewer_count": 2,
    "last_verified_at": "2026-11-20"
  }
}
```

In production, the `correct_choice_id`, distractor rationales and source extraction metadata are never sent to a client before a round resolves. The above is the editorial/admin representation, not the live client representation.

## 24.7 Match Q&A response contract

The match history endpoint should return a stable, readable result snapshot, not an event stream:

```json
{
  "match_id": "match_01J...",
  "domain_id": "AI_ML",
  "mode": "BLITZ",
  "status": "COMPLETED",
  "outcome_for_requester": "WIN",
  "rating": {
    "eligible": true,
    "before": 1512,
    "after": 1528,
    "delta": 16
  },
  "players": [
    {"slot": "A", "display_name": "player_handle", "score": 1012},
    {"slot": "B", "display_name": "Rival 07", "score": 944}
  ],
  "rounds": [
    {
      "round_index": 1,
      "question_id": "q_...",
      "question_version": 2,
      "mechanic": "TRIAD_COMPRESSION",
      "prompt": {},
      "choices": [],
      "answers": {
        "A": {"choice_id": "c_1", "correct": true, "elapsed_ms": 1720, "points": 154},
        "B": {"choice_id": "c_2", "correct": false, "elapsed_ms": 2310, "points": 0}
      },
      "correct_choice_id": "c_1",
      "explanation": {}
    }
  ]
}
```

The opponent display name in this example is a neutral rival callsign. Do not make it look like a real verified person. Internal source type is not part of this normal player-facing response.

## 24.8 History integrity rules

- Preserve exact question version and choice mapping.
- Preserve both players' selected choice IDs and resolved correctness.
- Preserve a timeout as a timeout; do not fabricate a selected answer.
- Preserve a void match as void; do not show a false win/loss.
- Do not reconstruct time from animation or event telemetry after the fact.
- Do not add replay URLs or replay action names to the contract.
- Participant access only, unless a privacy-safe shareable summary is intentionally created.

---

# 25. Technical references

Use these as primary references during implementation. Check current documentation and version compatibility before installing packages or copying code.

## Rating and psychometrics
- Glicko-2 specification: https://glicko.net/glicko/glicko2.pdf
- IRT / item response theory background: https://www.rasch.org/ (use as a starting point; select and document the exact model and estimator used).

## Realtime and security
- Cloudflare Durable Objects WebSockets: https://developers.cloudflare.com/durable-objects/best-practices/websockets/
- Cloudflare Durable Objects SQLite storage: https://developers.cloudflare.com/durable-objects/api/sqlite-storage-api/
- OWASP WebSocket Security Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/WebSocket_Security_Cheat_Sheet.html
- PostgreSQL documentation: https://www.postgresql.org/docs/
- Supabase Row Level Security: https://supabase.com/docs/guides/database/postgres/row-level-security

## Content / privacy operations
- OWASP Top 10 for LLM Applications: https://owasp.org/www-project-top-10-for-large-language-model-applications/
- NIST AI Risk Management Framework: https://www.nist.gov/itl/ai-risk-management-framework

**Implementation note:** this is a product and systems specification, not a substitute for testing a chosen provider's current limits, pricing, regional availability or contractual terms.

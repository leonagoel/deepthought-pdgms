# PDGMS AI Platform — Architecture Documentation

## Overview

Single Page Application (SPA) built with vanilla HTML5, CSS3, and ES6+ JavaScript. No build tools required — open `index.html` directly in a browser.

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Browser / Client                      │
│                                                         │
│  ┌───────────┐  ┌──────────────┐  ┌─────────────────┐  │
│  │ index.html│  │ src/app.js   │  │ src/styles/     │  │
│  │ (SPA Shell│  │ (Controller) │  │ main.css        │  │
│  │ + Modals) │  │ 1300+ lines  │  │ (Design System) │  │
│  └───────────┘  └──────┬───────┘  └─────────────────┘  │
│                         │                               │
│           ┌─────────────┼─────────────┐                 │
│           ▼             ▼             ▼                 │
│  ┌──────────────┐ ┌──────────┐ ┌──────────────┐        │
│  │  State{}     │ │ Guardrail│ │  UI Renderers│        │
│  │  (in-memory) │ │ Engine   │ │  (per page)  │        │
│  └──────────────┘ └──────────┘ └──────────────┘        │
│                                                         │
│                    ▼ API Calls ▼                        │
│         ┌──────────────────────────────┐               │
│         │  Anthropic Claude API        │               │
│         │  /v1/messages                │               │
│         │  model: claude-sonnet-4-...  │               │
│         └──────────────────────────────┘               │
└─────────────────────────────────────────────────────────┘
```

## Page Architecture

| Page | ID | Part | Description |
|---|---|---|---|
| Dashboard | `#dashboard` | — | Overview, stats, recent threads |
| Threads | `#threads` | A | Q→H→E thread builder with rubric scoring |
| Experiments | `#experiments` | B | Experiment lifecycle management |
| Transcripts | `#transcripts` | A | Socratic dialogue viewer & scorer |
| AI Engine | `#ai-engine` | C | Claude-powered Socratic mentor |
| Analytics | `#analytics` | — | Charts and performance metrics |

## State Management

All state is held in a single `State` object in memory:
- `State.threads[]` — research threads
- `State.experiments[]` — experiment records
- `State.transcripts[]` — dialogue transcripts
- `State.chatHistory[]` — AI engine conversation
- `State.sessionStats{}` — guardrail performance metrics

No LocalStorage or external DB is required for the demo. The state seeds from `DEMO_*` constants on load.

## AI Guardrail System

```
User Input → AI Request
                ↓
     ┌──────────────────────┐
     │  4-Layer Guardrails  │
     │                      │
     │  L1: Source Anchoring│  — Claims need citation
     │  L2: Confidence Thr. │  — Flag if < threshold%
     │  L3: Contradiction   │  — Check vs thread context
     │  L4: Human Checkpoint│  — High-risk = review flag
     └──────────────────────┘
                ↓
     Confidence Score (0–100%)
                ↓
     Passed / Flagged → Displayed to user
```

## Data Flow

```
Thread Created (Q→H→E form)
    → clientGuardrailCheck() on hypothesis
    → computeScores() → grade (A/B/C/D)
    → Saved to State.threads[]
    → Rendered in sidebar + detail panel
    → Can be pushed to Experiments or AI Engine
```

## CSS Design System

Custom CSS variables (`--ink`, `--paper`, `--accent`) define the "Scientific Brutalism" aesthetic — inspired by research papers and academic publishing. No external framework.

Font stack:
- `Playfair Display` — headings, display text
- `DM Mono` — data, labels, metadata
- `Syne` — UI elements

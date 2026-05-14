# Thought Process & Approach

## How I Read the Assignment

The assignment covers 3 parts:
- **Part A + B** (GitHub): Software developer assignment — build something functional that demonstrates understanding of the DeepThought platform
- **Part C** (deepthought.education): PDGMS AI Platform — Question → Hypothesis → Experiment

I interpreted this as: build a working prototype of the PDGMS platform itself, covering all three parts in one coherent system.

---

## My Approach

### Step 1: Understand the Context
Before writing a line of code, I read:
- The assignment letter carefully (noting: 48h timeline, AI encouraged but guardrails required, hand-drawn sketch mandatory)
- The rubric.json to understand what "quality" means in this system
- The sample-transcripts.json to understand what the actual data looks like
- The context.md to understand DeepThought's mission ("MIT-like thinking in every school")

### Step 2: Define the Core Problem
The core problem is: **how do you teach rigorous scientific thinking at scale?**

The PDGMS answer: structure the thinking process as Q→H→E, coach it Socratically, score it with a rubric, and iterate.

My job: build the software platform that enables this.

### Step 3: Architecture Decision
Chose a **zero-dependency SPA** (HTML + CSS + JS, no build tools) for two reasons:
1. Reviewer can open `index.html` directly — no `npm install` friction
2. Proves I understand fundamentals, not just framework configuration

### Step 4: Design System First
Built the CSS design system before any functionality. Rationale: a platform for rigorous thinkers should look like a research paper — precise, typographically intentional, without decorative noise. The "Scientific Brutalism" aesthetic communicates the platform's values before a user reads a word.

### Step 5: Feature Priority
1. Thread Builder (Part A) — core of the platform
2. Guardrail Engine — key differentiator and assignment requirement
3. AI Engine (Part C) — highest-value feature for the mission
4. Experiments (Part B) — experiment lifecycle management
5. Analytics — visibility into quality metrics

### Step 6: Where I Disagreed with AI Suggestions
- **Suggestion**: Use localStorage for all persistence  
  **My decision**: In-memory state. Simpler, no data leakage, still fully functional for demo
  
- **Suggestion**: Use React for component architecture  
  **My decision**: Vanilla JS. Zero setup friction, and the project is scoped to a prototype

- **Suggestion**: Single regex for guardrail checks  
  **My decision**: 4 explicit layers. Each concern is auditable and explainable to a student

- **Suggestion**: Use a charting library for analytics  
  **My decision**: Pure CSS/SVG charts. No external dependencies, fully transparent

---

## Negative Prompting Strategy

When using AI assistance, I used explicit negative constraints:
- "Do NOT use any framework or build tool"
- "Do NOT use localStorage"  
- "Do NOT use external charting libraries"
- "Do NOT generate vague placeholders — every function must be fully implemented"
- "Do NOT suggest features outside the rubric criteria"

---

## Alignment with Guidelines

| Guideline | How I addressed it |
|---|---|
| Use AI but not in the chat thread | Used AI for code assistance in a separate tool, not in the submission chat |
| Set guardrails for AI hallucination | 4-layer system (Source, Confidence, Contradiction, Checkpoint) |
| Hand-drawn sketch | Separate physical sketch (pen/pencil) of architecture and thought process |
| Align with rubric | Rubric.json directly drives the scoring engine in the app |
| 48-hour timeline | Prioritised working prototype over perfect polish |

---

## What I Would Add With More Time
1. Server-side API proxy (for production Claude API access)
2. Real user authentication and multi-user threads
3. Export to PDF (rubric report + transcript)
4. Collaborative thread editing (WebSocket)
5. Integration with DeepThought's existing LMS

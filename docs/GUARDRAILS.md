# AI Hallucination Guardrails — Design Document

## Why Guardrails?

AI language models can produce confident-sounding but incorrect, unsourced, or contradictory claims — especially in scientific and educational contexts. For a platform that teaches students to think rigorously (Q→H→E), this is a critical failure mode.

The PDGMS guardrail system implements **4 independent validation layers** on every AI output before it reaches the user.

---

## Layer 1: Source Anchoring

**What it checks:**  
Detects strong causal or conclusive claims (`"this proves"`, `"demonstrates that"`, `"clearly shows"`) without any evidence marker (`"according to"`, `"research by"`, `"cited by"`).

**Why it matters:**  
Students learning the Q→H→E method must see evidence-backed claims modelled. An AI that says "students learn better this way" without citing Hattie or Vygotsky reinforces bad epistemic habits.

**Response:**  
⚠ WARN — user sees flag but AI response is still shown.

---

## Layer 2: Confidence Thresholding

**What it checks:**  
- Counts absolute language (`always`, `never`, `all`, `proven fact`)
- Checks for epistemic hedges (`may`, `suggests`, `evidence indicates`)
- Computes a confidence score (0–100%)

**Threshold:**  
User-configurable via slider. Default: **70%**. Responses below threshold are flagged.

**Why it matters:**  
Overconfident AI output in hypothesis generation leads students to skip the "experiment" step — they think the AI has already proven the answer.

**Response:**  
⚠ WARN if absolute language is excessive; 🚫 ERROR if score < threshold.

---

## Layer 3: Contradiction Detection

**What it checks:**  
When a thread is selected, new AI claims are checked against the existing hypothesis for direct contradictions (negation + key term from hypothesis).

**Example:**  
Existing hypothesis: "immediate feedback improves retention"  
AI says: "immediate feedback does not improve retention in all cases"  
→ Flagged as 🚫 CONTRADICTION

**Why it matters:**  
Multi-turn AI conversations can drift. Contradictions within the same research thread undermine the student's ability to build a coherent scientific argument.

---

## Layer 4: Human Checkpoint

**What it checks:**  
Detects directive language aimed at real-world action:  
`"you should implement"`, `"deploy this"`, `"publish now"`, `"recommend immediately"`

**Why it matters:**  
AI-generated recommendations in educational research contexts should never be acted upon without human review. This layer ensures students and mentors know when a response requires human sign-off before proceeding.

**Response:**  
⚠ WARN with explicit human review badge.

---

## Confidence Score Formula

```
confidence = 1.0
- 0.12 if UNSOURCED_CLAIM (L1)
- 0.08 × count of absolute words (L2)
- 0.20 if CONTRADICTION detected (L3)
- 0.08 if HUMAN_CHECKPOINT triggered (L4)

confidence = clamp(confidence, 0, 1) × 100
passed = confidence ≥ threshold AND no ERROR flags
```

---

## Where I Disagreed with AI

During development, Claude (the AI tool used to assist) suggested:
1. Using `localStorage` for all state persistence — rejected in favour of in-memory state for simplicity and privacy
2. Using a React framework — rejected to keep zero build-step for reviewer accessibility
3. Suggesting a single catch-all guardrail regex — rejected in favour of the 4-layer model to make each concern explicit and auditable

These disagreements are documented in the hand-drawn sketch as required by the assignment guidelines.

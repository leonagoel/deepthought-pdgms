/**
 * AI Hallucination Guardrails Engine
 * DeepThought PDGMS — 4-Layer Protection System
 *
 * Layer 1: Source Anchoring — claims must cite evidence
 * Layer 2: Confidence Thresholding — flag low-confidence outputs
 * Layer 3: Contradiction Detection — check against thread context
 * Layer 4: Human Checkpoint — require sign-off on high-risk claims
 */

export const GUARDRAILS = {
  CONFIDENCE_THRESHOLD: 0.70,
  SOURCE_REQUIRED: true,
  CONTRADICTION_CHECK: true,
  HUMAN_CHECKPOINT_RISK: 'high',
};

/**
 * Analyse an AI response and return guardrail flags
 * @param {string} aiText - The AI-generated text to validate
 * @param {object} context - Existing thread context
 * @returns {object} { passed, flags, confidence, issues }
 */
export function runGuardrails(aiText, context = {}) {
  const flags = [];
  let confidence = 1.0;

  // ── Layer 1: Source Anchoring ──────────────────────────────
  const hasSource = /according to|cited by|source:|evidence:|reference:|study shows|research by|data from/i.test(aiText);
  const hasClaim = /therefore|this proves|demonstrates|confirms|clearly|obviously|certainly|definitely/i.test(aiText);

  if (hasClaim && !hasSource) {
    flags.push({
      layer: 1,
      type: 'warn',
      code: 'UNSOURCED_CLAIM',
      message: 'Strong claim detected without evidence citation. Add a source or soften the language.',
    });
    confidence -= 0.15;
  }

  // ── Layer 2: Confidence Thresholding ──────────────────────
  const hedgeWords = /may|might|could|possibly|perhaps|likely|probably|suggests|indicates/gi;
  const absoluteWords = /always|never|all|none|every|proven|fact|guaranteed/gi;
  const hedgeCount = (aiText.match(hedgeWords) || []).length;
  const absoluteCount = (aiText.match(absoluteWords) || []).length;

  if (absoluteCount > 2) {
    flags.push({
      layer: 2,
      type: 'warn',
      code: 'OVERCONFIDENT_LANGUAGE',
      message: `${absoluteCount} absolute claims detected. Scientific language should reflect uncertainty.`,
    });
    confidence -= 0.1 * absoluteCount;
  }

  if (hedgeCount < 1 && aiText.length > 200) {
    flags.push({
      layer: 2,
      type: 'info',
      code: 'NO_HEDGING',
      message: 'Consider adding epistemic markers (may, suggests, indicates) for scientific accuracy.',
    });
    confidence -= 0.05;
  }

  // ── Layer 3: Contradiction Detection ──────────────────────
  if (context.existingHypothesis) {
    const contextWords = context.existingHypothesis.toLowerCase().split(/\s+/);
    const contradictions = detectContradictions(aiText, contextWords);
    if (contradictions.length > 0) {
      flags.push({
        layer: 3,
        type: 'error',
        code: 'CONTRADICTION_DETECTED',
        message: `Potential contradiction with existing thread hypothesis: "${contradictions[0]}"`,
      });
      confidence -= 0.25;
    }
  }

  // ── Layer 4: Human Checkpoint ──────────────────────────────
  const riskSignals = /recommend|should|must|implement|deploy|publish|conclude/gi;
  const riskCount = (aiText.match(riskSignals) || []).length;
  if (riskCount >= 3) {
    flags.push({
      layer: 4,
      type: 'checkpoint',
      code: 'HUMAN_REVIEW_REQUIRED',
      message: 'This response contains actionable recommendations. Human review required before proceeding.',
    });
    confidence -= 0.1;
  }

  confidence = Math.max(0, Math.min(1, confidence));
  const passed = confidence >= GUARDRAILS.CONFIDENCE_THRESHOLD && !flags.some(f => f.type === 'error');

  return {
    passed,
    confidence: Math.round(confidence * 100),
    flags,
    summary: passed
      ? 'Response passed all guardrails.'
      : `Response flagged: ${flags.map(f => f.code).join(', ')}`,
  };
}

/**
 * Detect contradictions between new text and context keywords
 */
function detectContradictions(text, contextWords) {
  const negators = ['not', 'no', 'never', 'doesn\'t', 'isn\'t', 'cannot', 'fails', 'opposite'];
  const textLower = text.toLowerCase();
  const contradictions = [];

  contextWords.forEach(word => {
    if (word.length < 4) return;
    const negatedPattern = new RegExp(`(${negators.join('|')})\\s+\\w*\\s*${word}`, 'i');
    if (negatedPattern.test(textLower)) {
      contradictions.push(word);
    }
  });

  return contradictions;
}

/**
 * Score a Question-Hypothesis-Experiment thread against the rubric
 */
export function scoreThread(thread, rubric) {
  const scores = {};

  // Question Clarity scoring heuristics
  const q = thread.question || '';
  let qScore = 1;
  if (q.length > 30) qScore++;
  if (/why|how|what|when|where/i.test(q)) qScore++;
  if (q.includes('?')) qScore++;
  if (q.length > 60 && /measur|test|compar/i.test(q)) qScore++;
  scores.question_clarity = Math.min(5, qScore);

  // Hypothesis Testability
  const h = thread.hypothesis || '';
  let hScore = 1;
  if (h.length > 40) hScore++;
  if (/if|then|when|because/i.test(h)) hScore++;
  if (/\d+%|\d+ percent|significantly|measur/i.test(h)) hScore++;
  if (/falsif|test|predict/i.test(h)) hScore++;
  scores.hypothesis_testability = Math.min(5, hScore);

  // Experiment Design
  const e = thread.experiment || '';
  let eScore = 1;
  if (e.length > 50) eScore++;
  if (/group|control|compare|a\/b|a-b/i.test(e)) eScore++;
  if (/measure|metric|track|data/i.test(e)) eScore++;
  if (/day|week|month|session|\d+ (participant|subject|student)/i.test(e)) eScore++;
  scores.experiment_design = Math.min(5, eScore);

  // Evidence Quality (default 3 unless evidence provided)
  scores.evidence_quality = thread.evidence ? 4 : 3;

  const total = Object.values(scores).reduce((a, b) => a + b, 0);

  let grade = 'D';
  if (total >= 18) grade = 'A';
  else if (total >= 14) grade = 'B';
  else if (total >= 10) grade = 'C';

  return { scores, total, grade, maxScore: 20 };
}

/**
 * Format confidence as a coloured label
 */
export function confidenceLabel(pct) {
  if (pct >= 85) return { label: 'High', color: '#166534' };
  if (pct >= 70) return { label: 'Medium', color: '#854d0e' };
  return { label: 'Low', color: '#991b1b' };
}

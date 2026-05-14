/**
 * Storage utility — JSON-safe LocalStorage wrapper
 * with schema validation for PDGMS data types
 */

const KEYS = {
  THREADS: 'pdgms_threads',
  EXPERIMENTS: 'pdgms_experiments',
  SETTINGS: 'pdgms_settings',
  CHAT_HISTORY: 'pdgms_chat',
};

// ── Thread schema ────────────────────────────────────────────
export function createThread(data = {}) {
  return {
    id: `thread_${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'draft', // draft | active | concluded
    question: data.question || '',
    hypothesis: data.hypothesis || '',
    experiment: data.experiment || '',
    evidence: data.evidence || '',
    scores: data.scores || null,
    grade: data.grade || null,
    tags: data.tags || [],
    notes: data.notes || '',
  };
}

// ── Experiment schema ────────────────────────────────────────
export function createExperiment(data = {}) {
  return {
    id: `exp_${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    threadId: data.threadId || null,
    title: data.title || '',
    hypothesis: data.hypothesis || '',
    methodology: data.methodology || '',
    status: data.status || 'pending', // pending | running | complete | failed
    startDate: data.startDate || null,
    endDate: data.endDate || null,
    metrics: data.metrics || [],
    findings: data.findings || '',
    confidence: data.confidence || 0,
    conclusion: data.conclusion || '',
  };
}

// ── CRUD helpers ─────────────────────────────────────────────
export const Storage = {
  // Threads
  getThreads() {
    try {
      return JSON.parse(localStorage.getItem(KEYS.THREADS)) || [];
    } catch { return []; }
  },

  saveThread(thread) {
    const threads = this.getThreads();
    const idx = threads.findIndex(t => t.id === thread.id);
    if (idx >= 0) {
      threads[idx] = { ...thread, updatedAt: new Date().toISOString() };
    } else {
      threads.unshift(thread);
    }
    localStorage.setItem(KEYS.THREADS, JSON.stringify(threads));
    return thread;
  },

  deleteThread(id) {
    const threads = this.getThreads().filter(t => t.id !== id);
    localStorage.setItem(KEYS.THREADS, JSON.stringify(threads));
  },

  // Experiments
  getExperiments() {
    try {
      return JSON.parse(localStorage.getItem(KEYS.EXPERIMENTS)) || [];
    } catch { return []; }
  },

  saveExperiment(exp) {
    const experiments = this.getExperiments();
    const idx = experiments.findIndex(e => e.id === exp.id);
    if (idx >= 0) {
      experiments[idx] = { ...exp, updatedAt: new Date().toISOString() };
    } else {
      experiments.unshift(exp);
    }
    localStorage.setItem(KEYS.EXPERIMENTS, JSON.stringify(experiments));
    return exp;
  },

  deleteExperiment(id) {
    const experiments = this.getExperiments().filter(e => e.id !== id);
    localStorage.setItem(KEYS.EXPERIMENTS, JSON.stringify(experiments));
  },

  // Settings
  getSettings() {
    try {
      return JSON.parse(localStorage.getItem(KEYS.SETTINGS)) || {
        guardrails: {
          sourceAnchoring: true,
          confidenceThreshold: true,
          contradictionDetection: true,
          humanCheckpoint: true,
        },
        theme: 'paper',
        aiModel: 'claude-sonnet-4-20250514',
      };
    } catch { return {}; }
  },

  saveSettings(settings) {
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
  },

  // Chat history
  getChatHistory() {
    try {
      return JSON.parse(localStorage.getItem(KEYS.CHAT_HISTORY)) || [];
    } catch { return []; }
  },

  saveChatHistory(messages) {
    // Keep last 50 messages
    localStorage.setItem(KEYS.CHAT_HISTORY, JSON.stringify(messages.slice(-50)));
  },

  clearChatHistory() {
    localStorage.removeItem(KEYS.CHAT_HISTORY);
  },
};

// ── Seed demo data if empty ──────────────────────────────────
export function seedDemoData() {
  if (Storage.getThreads().length > 0) return;

  const demoThreads = [
    createThread({
      question: 'Why do students disengage from traditional lectures within 10 minutes?',
      hypothesis: 'Passive listening does not activate retrieval memory pathways, leading to cognitive drift after ~10 minutes of uninterrupted input.',
      experiment: 'Compare engagement metrics between 10-min lecture vs 10-min Socratic Q&A using eye-tracking and response latency across 40 students.',
      evidence: 'Sweller cognitive load theory (1988); Atkinson & Shiffrin memory model.',
      status: 'active',
      grade: 'B',
      scores: { question_clarity: 4, hypothesis_testability: 5, experiment_design: 4, evidence_quality: 3 },
      tags: ['engagement', 'memory', 'pedagogy'],
    }),
    createThread({
      question: 'Does immediate feedback improve skill retention in coding learners?',
      hypothesis: 'Immediate per-line feedback reduces error reinforcement, improving retention by ≥30% over delayed feedback in a 14-day window.',
      experiment: 'A/B test: Group A (immediate feedback) vs Group B (end-of-task feedback). n=60, test retention on day 7 and day 14.',
      evidence: 'Hattie feedback meta-analysis (2009): effect size 0.73.',
      status: 'active',
      grade: 'A',
      scores: { question_clarity: 5, hypothesis_testability: 5, experiment_design: 5, evidence_quality: 4 },
      tags: ['feedback', 'coding', 'retention'],
    }),
    createThread({
      question: 'Can AI-generated Socratic prompts replace human mentors for beginners?',
      hypothesis: 'AI prompts can achieve 80% of human mentor effectiveness for structured Q→H→E threads when trained on high-quality transcripts.',
      experiment: 'Blind rubric evaluation: 20 learners × AI mentor vs human mentor × 4 sessions. Score using PDGMS rubric.',
      evidence: '',
      status: 'draft',
      grade: 'C',
      scores: { question_clarity: 4, hypothesis_testability: 4, experiment_design: 3, evidence_quality: 2 },
      tags: ['AI', 'Socratic', 'scalability'],
    }),
  ];

  const demoExperiments = [
    createExperiment({
      title: 'Lecture vs Socratic Q&A Engagement Study',
      hypothesis: 'Socratic Q&A increases engagement duration by >50% vs passive lecture.',
      methodology: 'Randomised controlled trial with eye-tracking + response latency measures.',
      status: 'running',
      startDate: '2026-05-01',
      metrics: ['eye-fixation duration', 'response latency', 'self-reported engagement (1–10)'],
      confidence: 72,
    }),
    createExperiment({
      title: 'Feedback Timing & Code Retention',
      hypothesis: 'Immediate feedback → ≥30% retention improvement over 14 days.',
      methodology: 'A/B test, n=60, randomised by cohort. Assessment on day 7 and 14.',
      status: 'pending',
      startDate: '2026-05-15',
      metrics: ['retention score day-7', 'retention score day-14', 'error rate'],
      confidence: 0,
    }),
    createExperiment({
      title: 'AI Mentor Effectiveness Blind Evaluation',
      hypothesis: 'AI achieves 80% of human mentor rubric scores.',
      methodology: 'Double-blind rubric scoring by 3 independent evaluators.',
      status: 'complete',
      startDate: '2026-04-01',
      endDate: '2026-04-28',
      metrics: ['rubric total score', 'thread quality grade', 'learner satisfaction'],
      findings: 'AI scored avg 14.2/20 vs human 17.8/20 — 80% threshold narrowly missed (79.8%).',
      confidence: 85,
      conclusion: 'AI can partially replace human mentors for structured threads but requires human review for novel questions.',
    }),
  ];

  demoThreads.forEach(t => Storage.saveThread(t));
  demoExperiments.forEach(e => Storage.saveExperiment(e));
}

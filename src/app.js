/**
 * DeepThought PDGMS — Main Application
 * Single Page Application Controller
 * Parts A (Threads), B (Experiments), C (AI Engine)
 * 
 * Author: Applicant — DeepThought SD Internship 2026
 */

'use strict';
console.log('%c[DeepThought v4] app.js loaded', 'color:green;font-weight:bold');

// ════════════════════════════════════════════════════════════════
// DEMO DATA
// ════════════════════════════════════════════════════════════════

const DEMO_THREADS = [
  {
    id: 'thread_001', createdAt: '2026-05-01', status: 'active', grade: 'B',
    question: 'Why do students disengage from traditional lectures within 10 minutes?',
    hypothesis: 'Passive listening fails to activate retrieval memory pathways, leading to cognitive drift after ~10 minutes of uninterrupted input.',
    experiment: 'Compare engagement metrics between 10-min lecture segments vs 10-min Socratic Q&A using eye-tracking and response latency across 40 students (2 cohorts, counterbalanced).',
    evidence: 'Sweller cognitive load theory (1988); Atkinson & Shiffrin dual-store memory model (1968); Hattie & Timperley (2007) feedback loop study.',
    scores: { question_clarity: 4, hypothesis_testability: 5, experiment_design: 4, evidence_quality: 3 },
    tags: ['engagement', 'memory', 'pedagogy'],
  },
  {
    id: 'thread_002', createdAt: '2026-05-03', status: 'active', grade: 'A',
    question: 'Does immediate feedback improve skill retention in coding learners over a 14-day window?',
    hypothesis: 'Immediate per-line feedback reduces error reinforcement loops, improving code retention by ≥30% compared to delayed end-of-task feedback over 14 days.',
    experiment: 'A/B randomised test: Group A (n=30) receives per-line feedback; Group B (n=30) receives feedback after full task completion. Retention assessed via MCQ + live coding at day 7 and day 14.',
    evidence: "Hattie meta-analysis on feedback effect sizes (2009, ES=0.73); Bjork desirable difficulties framework (1994); Ericsson deliberate practice (1993).",
    scores: { question_clarity: 5, hypothesis_testability: 5, experiment_design: 5, evidence_quality: 4 },
    tags: ['feedback', 'coding', 'retention'],
  },
  {
    id: 'thread_003', createdAt: '2026-05-06', status: 'draft', grade: 'C',
    question: 'Can AI-generated Socratic prompts replace human mentors for beginner learners?',
    hypothesis: 'AI prompts can achieve 80% of human mentor effectiveness for structured Q→H→E threads when trained on high-quality Socratic transcripts.',
    experiment: 'Double-blind rubric evaluation: 20 learners × AI mentor vs human mentor × 4 sessions each. Score all sessions using PDGMS rubric. Compare means with t-test (α=0.05).',
    evidence: '',
    scores: { question_clarity: 4, hypothesis_testability: 4, experiment_design: 3, evidence_quality: 2 },
    tags: ['AI', 'Socratic', 'scalability'],
  },
  {
    id: 'thread_004', createdAt: '2026-04-20', status: 'concluded', grade: 'A',
    question: 'Does spaced repetition outperform massed practice for vocabulary acquisition in L2 learners?',
    hypothesis: 'Spaced repetition (SR) will produce ≥40% better retention at 30 days compared to massed practice, due to the spacing effect on long-term memory consolidation.',
    experiment: 'Within-subjects design: same 40 learners study 100 vocab items — 50 via SR app (Anki), 50 via massed review. Test at day 7, 14, 30. Order counterbalanced.',
    evidence: 'Ebbinghaus forgetting curve (1885); Cepeda et al. spacing effect meta-analysis (2006); Kornell & Bjork (2008).',
    scores: { question_clarity: 5, hypothesis_testability: 5, experiment_design: 5, evidence_quality: 5 },
    tags: ['memory', 'language', 'spaced-repetition'],
  },
];

const DEMO_EXPERIMENTS = [
  {
    id: 'exp_001', status: 'running', confidence: 72,
    title: 'Lecture vs Socratic Q&A Engagement Study',
    hypothesis: 'Socratic Q&A increases measurable engagement duration by >50% compared to passive lecture.',
    methodology: 'Randomised controlled trial with Tobii eye-tracking + keyboard response latency. 40 students, 4 sessions each.',
    startDate: '2026-05-01', endDate: null,
    metrics: ['eye-fixation duration (ms)', 'response latency (ms)', 'self-reported engagement (1–10)', 'off-task count'],
    findings: 'Preliminary: Socratic sessions show 43% longer eye-fixation periods (p=0.06, approaching significance).',
    conclusion: '',
  },
  {
    id: 'exp_002', status: 'pending', confidence: 0,
    title: 'Feedback Timing & Code Retention A/B Test',
    hypothesis: 'Immediate per-line feedback → ≥30% retention improvement vs delayed feedback over 14 days.',
    methodology: 'A/B test, n=60 (30 per group), randomised by cohort. Python coding tasks. Assessment at day 7 and day 14.',
    startDate: '2026-05-15', endDate: null,
    metrics: ['retention score day-7 (%)', 'retention score day-14 (%)', 'error rate', 'time-to-completion (min)'],
    findings: '', conclusion: '',
  },
  {
    id: 'exp_003', status: 'complete', confidence: 85,
    title: 'AI Mentor Effectiveness Blind Evaluation',
    hypothesis: 'AI achieves ≥80% of human mentor rubric scores on structured Q→H→E threads.',
    methodology: 'Double-blind rubric scoring by 3 independent evaluators. 20 learners × 4 sessions each modality.',
    startDate: '2026-04-01', endDate: '2026-04-28',
    metrics: ['rubric total score /20', 'thread quality grade', 'learner satisfaction (1–10)', 'evaluator agreement (κ)'],
    findings: 'AI scored avg 14.2/20 vs human 17.8/20 — 79.8% threshold narrowly missed. Evaluator agreement κ=0.81.',
    conclusion: 'AI can partially replace human mentors for structured threads but requires human review for novel or ambiguous questions. Recommend hybrid model.',
  },
  {
    id: 'exp_004', status: 'failed', confidence: 30,
    title: 'Gamification vs Rubric Motivation Study',
    hypothesis: 'Leaderboard gamification increases thread completion rate by ≥40% over 3 weeks.',
    methodology: 'Cohort split: gamified UI (leaderboard + badges) vs standard UI. 60 students, 3-week observation.',
    startDate: '2026-03-01', endDate: '2026-03-22',
    metrics: ['thread completion rate (%)', 'time-on-task (min)', 'score variance', 'dropout rate'],
    findings: 'No significant difference in completion rate (p=0.43). High within-group variance confounded results. Sample contamination suspected.',
    conclusion: 'Gamification alone insufficient driver. Intrinsic motivation, peer accountability, and mentor quality warrant investigation as confounders.',
  },
];

const DEMO_TRANSCRIPTS = [
  {
    id: 'tr_001',
    session: 'Session 1 — Student Engagement',
    date: '2026-05-01',
    thread: {
      question: 'Why do students disengage from traditional lectures within 10 minutes?',
      hypothesis: 'Passive listening does not activate retrieval memory pathways, leading to cognitive drift.',
      experiment: 'Compare engagement via eye-tracking: lecture vs Socratic Q&A across 40 students.',
    },
    dialogue: [
      { speaker: 'Mentor', text: 'What did you observe in today\'s class that seemed unusual to you?' },
      { speaker: 'Learner', text: 'Most students had stopped paying attention after about 10 minutes.' },
      { speaker: 'Mentor', text: 'That\'s an observation. What do you think caused it?' },
      { speaker: 'Learner', text: 'Maybe the lecture was boring? Or too fast?' },
      { speaker: 'Mentor', text: 'Those are possible explanations. Can you form one that is testable and falsifiable?' },
      { speaker: 'Learner', text: 'Hmm... passive listening doesn\'t require the brain to retrieve anything, so attention drifts after a while?' },
      { speaker: 'Mentor', text: 'Good instinct. How would you measure "attention drift"?' },
      { speaker: 'Learner', text: 'Eye-tracking? Or response time to a question asked mid-lecture?' },
      { speaker: 'Mentor', text: 'Excellent. Now design a comparison. What\'s your control group?' },
      { speaker: 'Learner', text: 'Compare 10-min pure lecture vs 10-min Socratic Q&A. Same content, different delivery.' },
    ],
    scores: { question_clarity: 4, hypothesis_testability: 5, experiment_design: 4, evidence_quality: 3 },
  },
  {
    id: 'tr_002',
    session: 'Session 2 — Feedback & Retention',
    date: '2026-05-03',
    thread: {
      question: 'Does immediate feedback improve skill retention in coding learners?',
      hypothesis: 'Immediate feedback reduces error reinforcement, improving retention by ≥30% in 14 days.',
      experiment: 'A/B test: per-line feedback vs end-of-task feedback. n=60, test day 7 & 14.',
    },
    dialogue: [
      { speaker: 'Mentor', text: 'You mentioned students forget syntax fast. What\'s the root cause?' },
      { speaker: 'Learner', text: 'They practice with mistakes and don\'t get corrected until too late.' },
      { speaker: 'Mentor', text: 'So what\'s your hypothesis about timing of feedback?' },
      { speaker: 'Learner', text: 'Immediate feedback stops wrong patterns from being reinforced in memory.' },
      { speaker: 'Mentor', text: 'Can you put a number on it? What would "better" mean?' },
      { speaker: 'Learner', text: 'At least 30% better retention compared to delayed feedback over 14 days.' },
      { speaker: 'Mentor', text: 'And how would you test it without confounders?' },
      { speaker: 'Learner', text: 'Random split: 30 get per-line feedback, 30 get end-of-task. Same instructor, same tasks. Test at day 7 and 14.' },
      { speaker: 'Mentor', text: 'What are you measuring exactly?' },
      { speaker: 'Learner', text: 'Retention score via a live coding test — they must write the solution from memory.' },
    ],
    scores: { question_clarity: 5, hypothesis_testability: 5, experiment_design: 5, evidence_quality: 4 },
  },
  {
    id: 'tr_003',
    session: 'Session 3 — AI Mentor Scalability',
    date: '2026-05-06',
    thread: {
      question: 'Can AI-generated Socratic prompts replace human mentors for beginners?',
      hypothesis: 'AI prompts achieve 80% of human mentor effectiveness on rubric-scored threads.',
      experiment: 'Blind rubric evaluation: 20 learners × AI vs human × 4 sessions.',
    },
    dialogue: [
      { speaker: 'Mentor', text: 'What problem are you trying to solve with AI in this context?' },
      { speaker: 'Learner', text: 'There aren\'t enough trained Socratic mentors. We need to scale.' },
      { speaker: 'Mentor', text: 'So what\'s your core question?' },
      { speaker: 'Learner', text: 'Can AI replace human Socratic mentors — at least for beginners?' },
      { speaker: 'Mentor', text: 'What\'s your success criterion? 100% replacement? 50%?' },
      { speaker: 'Learner', text: 'If AI achieves 80% of human rubric scores, it\'s a viable supplement.' },
      { speaker: 'Mentor', text: 'How do you prevent evaluator bias in scoring?' },
      { speaker: 'Learner', text: 'Double-blind evaluation — evaluators don\'t know which sessions were AI vs human.' },
      { speaker: 'Mentor', text: 'What\'s your statistical test?' },
      { speaker: 'Learner', text: 'Independent samples t-test on rubric total scores, α=0.05.' },
    ],
    scores: { question_clarity: 4, hypothesis_testability: 4, experiment_design: 5, evidence_quality: 3 },
  },
];

// ════════════════════════════════════════════════════════════════
// APPLICATION STATE
// ════════════════════════════════════════════════════════════════

const State = {
  threads: [...DEMO_THREADS],
  experiments: [...DEMO_EXPERIMENTS],
  transcripts: [...DEMO_TRANSCRIPTS],
  selectedThread: null,
  selectedTranscript: null,
  chatHistory: [],
  qheStep: 0,
  newThread: { question: '', hypothesis: '', experiment: '', evidence: '' },
  isAILoading: false,
  confidenceThreshold: 70,
  apiKey: localStorage.getItem('dt_api_key') || '',
  sessionStats: { messages: 0, flags: 0, confidenceSum: 0, confidenceCount: 0, passed: 0 },
};

// ════════════════════════════════════════════════════════════════
// INIT
// ════════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
  State.chatHistory = buildInitialChat();

  // Dashboard
  animateCounters();
  renderRecentThreads();
  renderActivityFeed();
  renderTranscriptsPreview();

  // Pages
  setupNavigation();
  renderThreadsSidebar('all');
  if (State.threads.length) openThread(State.threads[0].id, false);
  renderExperimentsGrid('all');
  renderTranscriptList();
  renderChatMessages();
  setupGuardrailToggles();
  renderAnalyticsPage();

  // Default date for experiment modal
  // Restore API key
  const keyInput = document.getElementById('api-key-input');
  if (keyInput && State.apiKey) {
    keyInput.value = State.apiKey;
    const statusEl = document.getElementById('api-key-status');
    if (statusEl) { statusEl.textContent = '2713 Key saved'; statusEl.style.color = 'var(--green, #2a7a2a)'; }
  }

  const dateInput = document.getElementById('exp-date-input');
  if (dateInput) dateInput.value = new Date().toISOString().split('T')[0];
});

// ════════════════════════════════════════════════════════════════
// NAVIGATION
// ════════════════════════════════════════════════════════════════

function setupNavigation() {
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      navigate(link.dataset.page);
    });
  });
}

window.navigate = function (page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  const pageEl = document.getElementById(page);
  const linkEl = document.querySelector(`[data-page="${page}"]`);
  if (pageEl) pageEl.classList.add('active');
  if (linkEl) linkEl.classList.add('active');
  window.scrollTo(0, 0);
};

window.closeModal = function (id) {
  document.getElementById(id)?.classList.add('hidden');
};

window.handleOverlayClick = function (e, id) {
  if (e.target === e.currentTarget) closeModal(id);
};

// ════════════════════════════════════════════════════════════════
// DASHBOARD
// ════════════════════════════════════════════════════════════════

function animateCounters() {
  document.querySelectorAll('.stat-number[data-count]').forEach(el => {
    const target = +el.dataset.count;
    let current = 0;
    const step = target / 45;
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = Math.floor(current);
      if (current >= target) clearInterval(timer);
    }, 25);
  });
}

function renderRecentThreads() {
  const el = document.getElementById('recent-threads-list');
  if (!el) return;
  el.innerHTML = State.threads.slice(0, 3).map(t => `
    <div class="thread-item" onclick="navigate('threads');setTimeout(()=>openThread('${t.id}'),100)">
      <div class="flex" style="justify-content:space-between;align-items:flex-start;gap:.5rem;margin-bottom:.4rem;">
        <div class="thread-question">${t.question}</div>
        <span class="thread-score score-${t.grade.toLowerCase()}">${t.grade}</span>
      </div>
      <div class="thread-meta">
        <span>● ${t.status}</span>
        <span>${formatDate(t.createdAt)}</span>
        <span>${t.tags.map(g => '#' + g).join(' ')}</span>
      </div>
    </div>`).join('');
}

function renderActivityFeed() {
  const el = document.getElementById('activity-feed');
  if (!el) return;
  const activities = [
    { icon: '⬡', text: 'Thread "AI Mentor Effectiveness" scored A (19/20)', time: '2h ago' },
    { icon: '🧪', text: 'Experiment "Feedback Timing" status → running', time: '5h ago' },
    { icon: '⚠️', text: 'Guardrail L2 flagged overconfident language in Session 4', time: '1d ago' },
    { icon: '✓', text: 'Thread "Lecture Engagement" peer-reviewed & approved', time: '2d ago' },
    { icon: '🤖', text: 'AI Engine: 3 hypotheses analysed — avg confidence 87%', time: '3d ago' },
    { icon: '📊', text: 'Analytics updated: Q→H→E completion rate now 78%', time: '4d ago' },
  ];
  el.innerHTML = activities.map(a => `
    <div style="display:flex;gap:.75rem;padding:.65rem 0;border-bottom:1px solid var(--paper-3);">
      <span style="font-size:1rem;flex-shrink:0;">${a.icon}</span>
      <div>
        <div style="font-family:var(--font-mono);font-size:.76rem;margin-bottom:.2rem;">${a.text}</div>
        <div style="font-family:var(--font-mono);font-size:.65rem;color:rgba(13,13,13,.4);">${a.time}</div>
      </div>
    </div>`).join('');
}

function renderTranscriptsPreview() {
  const el = document.getElementById('transcripts-preview');
  if (!el) return;
  el.innerHTML = State.transcripts.map(t => `
    <div class="thread-item" onclick="navigate('transcripts');setTimeout(()=>openTranscript('${t.id}'),100)">
      <div class="thread-question" style="font-size:.85rem;">${t.session}</div>
      <div class="thread-meta">
        <span>${t.dialogue.length} exchanges</span>
        <span>${formatDate(t.date)}</span>
        <span>Score: ${calcTotal(t.scores)}/20</span>
      </div>
    </div>`).join('');
}

// ════════════════════════════════════════════════════════════════
// THREADS PAGE  (Part A)
// ════════════════════════════════════════════════════════════════

function renderThreadsSidebar(filter) {
  const list = document.getElementById('threads-list');
  if (!list) return;

  const filtered = filter === 'all' ? State.threads : State.threads.filter(t => t.status === filter);

  if (!filtered.length) {
    list.innerHTML = `<div class="empty-state" style="padding:2rem;">
      <span class="empty-icon">📋</span>
      <p class="empty-text">No threads here yet.</p>
    </div>`;
  } else {
    list.innerHTML = filtered.map(t => `
      <div class="thread-item" id="thread-item-${t.id}"
        onclick="openThread('${t.id}')"
        style="border-left:none;border-right:none;border-top:none;border-radius:0;margin-bottom:0;">
        <div class="flex" style="justify-content:space-between;margin-bottom:.35rem;">
          <span class="thread-score score-${t.grade.toLowerCase()}">${t.grade} · ${calcTotal(t.scores)}/20</span>
          <span style="font-family:var(--font-mono);font-size:.62rem;color:rgba(13,13,13,.35);">${t.status}</span>
        </div>
        <div class="thread-question" style="font-size:.85rem;margin-bottom:.35rem;">${t.question}</div>
        <div style="display:flex;gap:.35rem;flex-wrap:wrap;">
          ${t.tags.map(tag => `<span class="tag tag-ink">#${tag}</span>`).join('')}
        </div>
      </div>`).join('');
  }

  document.querySelectorAll('.thread-filter-btn').forEach(btn => {
    btn.style.background = btn.dataset.filter === filter ? 'var(--ink)' : '';
    btn.style.color = btn.dataset.filter === filter ? 'var(--paper)' : '';
    btn.onclick = () => renderThreadsSidebar(btn.dataset.filter);
  });
}

window.openThread = function (id, scroll = true) {
  const thread = State.threads.find(t => t.id === id);
  if (!thread) return;
  State.selectedThread = thread;

  // Highlight sidebar item
  document.querySelectorAll('[id^="thread-item-"]').forEach(el => el.style.background = '');
  const item = document.getElementById(`thread-item-${id}`);
  if (item) item.style.background = 'var(--paper-2)';

  const detail = document.getElementById('thread-detail');
  if (!detail) return;

  const scoring = computeScores(thread);

  detail.innerHTML = `
    <div style="margin-bottom:1.5rem;">
      <div class="hero-label">${thread.status.toUpperCase()} · ${formatDate(thread.createdAt)}</div>
      <h2 style="font-family:var(--font-display);font-size:1.6rem;font-weight:900;line-height:1.2;margin-bottom:.75rem;letter-spacing:-.02em;">${thread.question}</h2>
      <div style="display:flex;gap:.4rem;flex-wrap:wrap;">
        ${thread.tags.map(tg => `<span class="tag tag-accent">#${tg}</span>`).join('')}
        <span class="tag score-${thread.grade.toLowerCase()}">${thread.grade} Grade · ${calcTotal(scoring.scores)}/20</span>
      </div>
    </div>

    <div class="qhe-stepper">
      <div class="qhe-step done"><span class="step-num">Q</span>Question</div>
      <div class="qhe-step done"><span class="step-num">H</span>Hypothesis</div>
      <div class="qhe-step ${thread.experiment ? 'done' : 'active'}"><span class="step-num">E</span>Experiment</div>
    </div>

    <div style="display:grid;gap:1rem;margin-bottom:1.5rem;">
      <div>
        <div class="card-title" style="margin-bottom:.4rem;">❓ Research Question</div>
        <div style="font-family:var(--font-display);font-size:1rem;line-height:1.5;">${thread.question}</div>
      </div>
      <hr class="divider">
      <div>
        <div class="card-title" style="margin-bottom:.4rem;">💡 Hypothesis</div>
        <div style="font-family:var(--font-mono);font-size:.82rem;line-height:1.75;border-left:3px solid var(--accent);padding-left:1rem;font-style:italic;color:rgba(13,13,13,.85);">${thread.hypothesis}</div>
      </div>
      <hr class="divider">
      <div>
        <div class="card-title" style="margin-bottom:.4rem;">🧪 Experiment Design</div>
        <div style="font-family:var(--font-mono);font-size:.82rem;line-height:1.75;">${thread.experiment || '<em style="color:rgba(13,13,13,.35);">Not yet designed</em>'}</div>
      </div>
      ${thread.evidence ? `
      <hr class="divider">
      <div>
        <div class="card-title" style="margin-bottom:.4rem;">📚 Evidence & Sources</div>
        <div style="font-family:var(--font-mono);font-size:.78rem;line-height:1.75;color:rgba(13,13,13,.7);">${thread.evidence}</div>
      </div>` : ''}
    </div>

    <div class="card-title" style="margin-bottom:.75rem;">📊 Rubric Scores</div>
    <div class="scores-grid" style="margin-bottom:1.5rem;">
      ${Object.entries(scoring.scores).map(([k, v]) => `
        <div class="score-item">
          <div class="score-item-label">${k.replace(/_/g, ' ')}</div>
          <div class="score-bar-wrap">
            <div class="score-bar" style="width:${(v / 5) * 100}%"></div>
          </div>
          <div class="score-val">${v}<span style="font-size:.7rem;font-weight:400;font-family:var(--font-mono);">/5</span></div>
        </div>`).join('')}
    </div>

    <div style="display:flex;gap:.75rem;flex-wrap:wrap;">
      <button class="btn btn-primary btn-sm" onclick="sendThreadToAI('${thread.id}')">🤖 Analyse with AI</button>
      <button class="btn btn-ghost btn-sm" onclick="pushThreadToExperiment('${thread.id}')">🧪 Create Experiment</button>
      <button class="btn btn-ghost btn-sm" onclick="deleteThread('${thread.id}')">🗑 Delete</button>
    </div>
  `;
};

window.deleteThread = function (id) {
  if (!confirm('Delete this thread?')) return;
  State.threads = State.threads.filter(t => t.id !== id);
  State.selectedThread = null;
  renderThreadsSidebar('all');
  document.getElementById('thread-detail').innerHTML = `
    <div class="empty-state"><span class="empty-icon">📋</span>
    <div class="empty-title">Thread deleted</div></div>`;
  renderRecentThreads();
};

window.sendThreadToAI = function (id) {
  const thread = State.threads.find(t => t.id === id);
  if (!thread) return;
  navigate('ai-engine');
  setTimeout(() => {
    const input = document.getElementById('chat-input');
    if (input) {
      input.value = `Please analyse this research thread:\n\nQuestion: "${thread.question}"\nHypothesis: "${thread.hypothesis}"\nExperiment: "${thread.experiment}"\nEvidence: "${thread.evidence || 'None provided'}"`;
      input.focus();
    }
  }, 300);
};

window.pushThreadToExperiment = function (id) {
  const thread = State.threads.find(t => t.id === id);
  if (!thread) return;
  navigate('experiments');
  setTimeout(() => {
    document.getElementById('exp-title-input').value = thread.question.slice(0, 70);
    document.getElementById('exp-hypothesis-input').value = thread.hypothesis;
    document.getElementById('exp-methodology-input').value = thread.experiment;
    document.getElementById('experiment-modal').classList.remove('hidden');
  }, 200);
};

// ── New Thread Modal ──────────────────────────────────────────

window.openNewThread = function () {
  State.qheStep = 0;
  State.newThread = { question: '', hypothesis: '', experiment: '', evidence: '' };
  renderQHEForm();
  document.getElementById('new-thread-modal').classList.remove('hidden');
};

function renderQHEForm() {
  const body = document.getElementById('new-thread-body');
  if (!body) return;

  const steps = ['Question', 'Hypothesis', 'Experiment'];
  const fields = [
    {
      key: 'question',
      label: '❓ Research Question',
      placeholder: 'e.g. Why do students disengage from traditional lectures within 10 minutes?',
      hint: 'Be specific and observable. Avoid value judgements. Ask "why", "how", "what" — not "is it good".',
      rows: 3,
    },
    {
      key: 'hypothesis',
      label: '💡 Hypothesis',
      placeholder: 'e.g. Passive listening does not activate retrieval memory pathways, leading to cognitive drift after ~10 min of continuous input.',
      hint: 'Must be falsifiable and testable. Include a measurable prediction if possible (e.g. "by ≥30%", "more than").',
      rows: 4,
    },
    {
      key: 'experiment',
      label: '🧪 Experiment Design',
      placeholder: 'e.g. A/B test: Group A (n=30) Socratic Q&A vs Group B (n=30) lecture. Measure engagement via eye-tracking, 4 sessions each, counterbalanced.',
      hint: 'Describe: controls, sample size, measurement method, timeline, and how you will analyse the data.',
      rows: 4,
    },
  ];

  const step = State.qheStep;
  const f = fields[step];

  document.getElementById('qhe-prev-btn').style.display = step > 0 ? 'inline-flex' : 'none';
  document.getElementById('qhe-next-btn').textContent = step === 2 ? '✓ Save Thread' : 'Next →';

  body.innerHTML = `
    <div class="qhe-stepper" style="margin-bottom:1.5rem;">
      ${steps.map((s, i) => `
        <div class="qhe-step ${i < step ? 'done' : i === step ? 'active' : ''}">
          <span class="step-num">${i < step ? '✓' : s[0]}</span>${s}
        </div>`).join('')}
    </div>

    <div class="form-group">
      <label class="form-label">${f.label}</label>
      <textarea class="form-textarea" id="qhe-input" rows="${f.rows}"
        placeholder="${f.placeholder}">${State.newThread[f.key]}</textarea>
      <div class="form-hint">${f.hint}</div>
    </div>

    ${step === 2 ? `
    <div class="form-group">
      <label class="form-label">📚 Evidence / Sources <span style="opacity:.4;">(optional but recommended)</span></label>
      <textarea class="form-textarea" id="evidence-input" rows="2"
        placeholder="e.g. Hattie (2009) meta-analysis on feedback (ES=0.73); Sweller cognitive load theory (1988)">${State.newThread.evidence}</textarea>
      <div class="form-hint">Ground your reasoning in prior work — boosts your Evidence Quality score.</div>
    </div>
    <div class="form-group">
      <label class="form-label">Tags <span style="opacity:.4;">(comma separated)</span></label>
      <input type="text" class="form-input" id="tags-input" placeholder="e.g. memory, feedback, pedagogy" value="${(State.newThread.tags || []).join(', ')}">
    </div>` : ''}

    <div id="guardrail-feedback"></div>`;
}

window.qheNext = function () {
  const input = document.getElementById('qhe-input');
  const keys = ['question', 'hypothesis', 'experiment'];
  const key = keys[State.qheStep];
  const val = (input?.value || '').trim();

  if (!val || val.length < 15) {
    showAlert('guardrail-feedback', 'error', '⚠', 'Please provide a meaningful input (at least 15 characters).');
    return;
  }

  State.newThread[key] = val;

  if (State.qheStep === 2) {
    const ev = document.getElementById('evidence-input');
    const tg = document.getElementById('tags-input');
    if (ev) State.newThread.evidence = ev.value.trim();
    if (tg) State.newThread.tags = tg.value.split(',').map(s => s.trim()).filter(Boolean);
  }

  // Guardrail check on hypothesis step
  if (State.qheStep === 1) {
    const result = clientGuardrailCheck(val);
    const fb = document.getElementById('guardrail-feedback');
    if (fb) {
      fb.innerHTML = result.flags.map(f => `
        <div class="guardrail-alert guardrail-${f.type}">
          <span class="guardrail-icon">${f.type === 'error' ? '🚫' : f.type === 'warn' ? '⚠️' : 'ℹ️'}</span>
          <div><strong>[Layer ${f.layer}] ${f.code}</strong><br>${f.message}</div>
        </div>`).join('') +
        (result.passed ? `<div class="guardrail-alert guardrail-ok"><span class="guardrail-icon">✓</span>All guardrails passed. Confidence: ${result.confidence}%</div>` : '');
    }
    if (!result.passed) return;
  }

  if (State.qheStep < 2) {
    State.qheStep++;
    renderQHEForm();
  } else {
    saveNewThread();
  }
};

window.qhePrev = function () {
  if (State.qheStep > 0) { State.qheStep--; renderQHEForm(); }
};

function saveNewThread() {
  const scoring = computeScores(State.newThread);
  const thread = {
    id: `thread_${Date.now()}`,
    createdAt: new Date().toISOString(),
    status: 'active',
    question: State.newThread.question,
    hypothesis: State.newThread.hypothesis,
    experiment: State.newThread.experiment,
    evidence: State.newThread.evidence,
    tags: State.newThread.tags || [],
    ...scoring,
  };
  State.threads.unshift(thread);
  closeModal('new-thread-modal');
  renderThreadsSidebar('all');
  openThread(thread.id);
  renderRecentThreads();
  navigate('threads');
}

// ════════════════════════════════════════════════════════════════
// EXPERIMENTS PAGE  (Part B)
// ════════════════════════════════════════════════════════════════

function renderExperimentsGrid(filter) {
  const grid = document.getElementById('experiments-grid');
  if (!grid) return;

  const filtered = filter === 'all' ? State.experiments : State.experiments.filter(e => e.status === filter);

  grid.innerHTML = filtered.length ? filtered.map(exp => `
    <div class="experiment-card" onclick="openExperiment('${exp.id}')">
      <div class="exp-status status-${exp.status}">
        ${statusIcon(exp.status)} ${exp.status.toUpperCase()}
      </div>
      <div class="exp-title">${exp.title}</div>
      <div class="exp-hypothesis">${exp.hypothesis}</div>

      ${exp.confidence > 0 ? `
      <div style="margin-bottom:.85rem;">
        <div class="confidence-meter">
          <div class="confidence-fill" style="width:${exp.confidence}%;background:${confColor(exp.confidence)};"></div>
        </div>
        <div style="font-family:var(--font-mono);font-size:.65rem;margin-top:.3rem;color:rgba(13,13,13,.45);">
          Confidence: ${exp.confidence}% — ${confLabel(exp.confidence)}
        </div>
      </div>` : ''}

      <div class="exp-metrics">
        <span>📅 ${exp.startDate || 'TBD'}</span>
        <span>📏 ${exp.metrics.length} metrics</span>
        ${exp.endDate ? `<span>✓ ${exp.endDate}</span>` : ''}
      </div>

      ${exp.findings ? `
      <div style="margin-top:.75rem;padding-top:.75rem;border-top:1px solid var(--paper-3);
          font-family:var(--font-mono);font-size:.72rem;line-height:1.6;color:rgba(13,13,13,.6);">
        <strong>Finding:</strong> ${exp.findings}
      </div>` : ''}
    </div>`).join('') : `<div class="empty-state" style="grid-column:1/-1;background:var(--paper);padding:4rem;">
      <span class="empty-icon">🧪</span><div class="empty-title">No experiments here</div></div>`;

  document.querySelectorAll('.exp-filter-btn').forEach(btn => {
    btn.style.background = btn.dataset.filter === filter ? 'var(--ink)' : '';
    btn.style.color = btn.dataset.filter === filter ? 'var(--paper)' : '';
    btn.onclick = () => renderExperimentsGrid(btn.dataset.filter);
  });
}

window.openExperiment = function (id) {
  console.log('[openExperiment] called with id:', id);
  const body = document.getElementById('exp-detail-body');
  const modal = document.getElementById('exp-detail-modal');
  if (!body || !modal) { console.error('Modal elements not found'); return; }

  const exp = State.experiments.find(function(e) { return e.id === id; });
  if (!exp) {
    body.innerHTML = '<p style="color:red;padding:1rem;">Experiment not found: ' + id + '</p>';
    modal.classList.remove('hidden');
    return;
  }

  // Build HTML using string concatenation — avoids any template literal issues
  var icons = { running: '▶', pending: '◔', complete: '✓', failed: '✕' };
  var icon = icons[exp.status] || '?';
  var statusLabel = (exp.status || '').toUpperCase();

  var html = '';
  html += '<div style="margin-bottom:1.25rem;">';
  html += '<div class="exp-status status-' + exp.status + '" style="margin-bottom:.75rem;">' + icon + ' ' + statusLabel + '</div>';
  html += '<h3 style="font-family:var(--font-display);font-size:1.3rem;font-weight:700;line-height:1.25;">' + exp.title + '</h3>';
  html += '</div>';

  html += '<div class="form-group">';
  html += '<div class="form-label">Hypothesis</div>';
  html += '<div style="font-family:var(--font-mono);font-size:.81rem;line-height:1.75;border-left:3px solid var(--accent);padding-left:.85rem;font-style:italic;">' + exp.hypothesis + '</div>';
  html += '</div>';

  html += '<div class="form-group">';
  html += '<div class="form-label">Methodology</div>';
  html += '<div style="font-family:var(--font-mono);font-size:.81rem;line-height:1.75;">' + exp.methodology + '</div>';
  html += '</div>';

  if (exp.metrics && exp.metrics.length) {
    html += '<div class="form-group">';
    html += '<div class="form-label">Metrics Tracked</div>';
    html += '<div style="display:flex;flex-wrap:wrap;gap:.4rem;">';
    for (var i = 0; i < exp.metrics.length; i++) {
      html += '<span class="tag tag-ink">' + exp.metrics[i] + '</span>';
    }
    html += '</div></div>';
  }

  if (exp.confidence > 0) {
    var confBg = exp.confidence >= 85 ? '#166534' : exp.confidence >= 70 ? '#1e40af' : exp.confidence >= 50 ? '#854d0e' : '#991b1b';
    var confLbl = exp.confidence >= 85 ? 'High' : exp.confidence >= 70 ? 'Medium' : 'Low';
    html += '<div class="form-group">';
    html += '<div class="form-label">Confidence Score</div>';
    html += '<div class="confidence-meter" style="height:12px;margin-bottom:.4rem;">';
    html += '<div class="confidence-fill" style="width:' + exp.confidence + '%;background:' + confBg + ';"></div>';
    html += '</div>';
    html += '<div style="font-family:var(--font-mono);font-size:.72rem;">' + exp.confidence + '% — ' + confLbl + '</div>';
    html += '</div>';
  }

  if (exp.findings) {
    html += '<div class="form-group">';
    html += '<div class="form-label">Findings</div>';
    html += '<div style="background:var(--paper-2);border:var(--border);padding:1rem;font-family:var(--font-mono);font-size:.8rem;line-height:1.75;">' + exp.findings + '</div>';
    html += '</div>';
  }

  if (exp.conclusion) {
    html += '<div class="form-group">';
    html += '<div class="form-label">Conclusion</div>';
    html += '<div style="background:var(--paper-2);border:var(--border);padding:1rem;font-family:var(--font-mono);font-size:.8rem;line-height:1.75;border-left:4px solid var(--green);">' + exp.conclusion + '</div>';
    html += '</div>';
  }

  html += '<hr class="divider">';
  html += '<div class="form-group">';
  html += '<label class="form-label">Update Status</label>';
  html += '<select class="form-select" id="update-exp-status">';
  var statuses = ['pending', 'running', 'complete', 'failed'];
  for (var j = 0; j < statuses.length; j++) {
    var sel = exp.status === statuses[j] ? ' selected' : '';
    html += '<option value="' + statuses[j] + '"' + sel + '>' + statuses[j] + '</option>';
  }
  html += '</select></div>';

  html += '<div class="form-group">';
  html += '<label class="form-label">Add Findings / Notes</label>';
  html += '<textarea class="form-textarea" id="update-exp-findings" rows="2" placeholder="Add interim findings or notes...">' + (exp.findings || '') + '</textarea>';
  html += '</div>';
  html += '<button class="btn btn-primary btn-sm" onclick="updateExperiment(\'' + exp.id + '\')">Save Changes</button>';

  body.innerHTML = html;
  modal.classList.remove('hidden');
};

window.updateExperiment = function (id) {
  const exp = State.experiments.find(e => e.id === id);
  if (!exp) return;
  const sel = document.getElementById('update-exp-status');
  const fnds = document.getElementById('update-exp-findings');
  if (sel) exp.status = sel.value;
  if (fnds) exp.findings = fnds.value.trim();
  if (exp.status === 'complete' || exp.status === 'failed') {
    exp.endDate = new Date().toISOString().split('T')[0];
  }
  closeModal('exp-detail-modal');
  renderExperimentsGrid('all');
};

window.openNewExperiment = function () {
  document.getElementById('exp-title-input').value = '';
  document.getElementById('exp-hypothesis-input').value = '';
  document.getElementById('exp-methodology-input').value = '';
  document.getElementById('exp-metrics-input').value = '';
  document.getElementById('exp-date-input').value = new Date().toISOString().split('T')[0];
  document.getElementById('experiment-modal').classList.remove('hidden');
};

window.saveExperiment = function () {
  const title = document.getElementById('exp-title-input').value.trim();
  const hyp = document.getElementById('exp-hypothesis-input').value.trim();
  const method = document.getElementById('exp-methodology-input').value.trim();
  const metricsRaw = document.getElementById('exp-metrics-input').value.trim();
  const date = document.getElementById('exp-date-input').value;

  if (!title || !hyp) { showAlert('', 'error', '⚠', 'Title and hypothesis are required.'); return; }

  const exp = {
    id: `exp_${Date.now()}`,
    title, hypothesis: hyp, methodology: method,
    status: 'pending',
    startDate: date,
    endDate: null,
    metrics: metricsRaw ? metricsRaw.split(',').map(s => s.trim()) : [],
    findings: '', conclusion: '', confidence: 0,
  };
  State.experiments.unshift(exp);
  closeModal('experiment-modal');
  renderExperimentsGrid('all');
};

// ════════════════════════════════════════════════════════════════
// TRANSCRIPTS PAGE
// ════════════════════════════════════════════════════════════════

function renderTranscriptList() {
  const el = document.getElementById('transcript-list');
  if (!el) return;
  el.innerHTML = State.transcripts.map(t => `
    <div class="thread-item" id="tr-item-${t.id}" onclick="openTranscript('${t.id}')"
      style="border-left:none;border-right:none;border-top:none;border-radius:0;margin-bottom:0;">
      <div class="thread-question" style="font-size:.85rem;margin-bottom:.3rem;">${t.session}</div>
      <div class="thread-meta">
        <span>${formatDate(t.date)}</span>
        <span class="thread-score score-${gradeFromScore(calcTotal(t.scores)).toLowerCase()}">${gradeFromScore(calcTotal(t.scores))}</span>
      </div>
    </div>`).join('');
}

window.openTranscript = function (id) {
  const tr = State.transcripts.find(t => t.id === id);
  if (!tr) return;
  State.selectedTranscript = tr;

  document.querySelectorAll('[id^="tr-item-"]').forEach(el => el.style.background = '');
  const item = document.getElementById(`tr-item-${id}`);
  if (item) item.style.background = 'var(--paper-2)';

  const detail = document.getElementById('transcript-detail');
  if (!detail) return;

  const total = calcTotal(tr.scores);
  const grade = gradeFromScore(total);

  detail.innerHTML = `
    <div style="margin-bottom:1.5rem;">
      <div class="hero-label">${formatDate(tr.date)}</div>
      <h3 style="font-family:var(--font-display);font-size:1.4rem;font-weight:700;margin-bottom:.75rem;">${tr.session}</h3>
      <span class="thread-score score-${grade.toLowerCase()}">${grade} Grade · ${total}/20</span>
    </div>

    <div style="margin-bottom:1.5rem;padding:1rem;border:var(--border);background:var(--paper-2);">
      <div class="form-label" style="margin-bottom:.5rem;">Thread Summary</div>
      <div style="font-family:var(--font-mono);font-size:.78rem;line-height:1.8;">
        <strong>Q:</strong> ${tr.thread.question}<br>
        <strong>H:</strong> ${tr.thread.hypothesis}<br>
        <strong>E:</strong> ${tr.thread.experiment}
      </div>
    </div>

    <div class="card-title" style="margin-bottom:.75rem;">💬 Dialogue</div>
    <div class="transcript-container" style="margin-bottom:1.5rem;">
      ${tr.dialogue.map(d => `
        <div class="dialogue-entry">
          <span class="dialogue-speaker speaker-${d.speaker.toLowerCase()}">${d.speaker}</span>
          <div class="dialogue-text">${d.text}</div>
        </div>`).join('')}
    </div>

    <div class="card-title" style="margin-bottom:.75rem;">📊 Rubric Breakdown</div>
    <div class="scores-grid">
      ${Object.entries(tr.scores).map(([k, v]) => `
        <div class="score-item">
          <div class="score-item-label">${k.replace(/_/g, ' ')}</div>
          <div class="score-bar-wrap">
            <div class="score-bar" style="width:${(v/5)*100}%"></div>
          </div>
          <div class="score-val">${v}<span style="font-family:var(--font-mono);font-size:.7rem;font-weight:400;">/5</span></div>
        </div>`).join('')}
    </div>
  `;
};

window.loadTranscriptsFromFile = function () {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.onchange = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = evt => {
      try {
        const data = JSON.parse(evt.target.result);
        const arr = Array.isArray(data) ? data : [data];
        State.transcripts = [...arr, ...State.transcripts];
        renderTranscriptList();
        if (arr[0]?.id) openTranscript(arr[0].id);
        alert(`Loaded ${arr.length} transcript(s) successfully.`);
      } catch {
        alert('Invalid JSON file. Please load a valid transcripts JSON.');
      }
    };
    reader.readAsText(file);
  };
  input.click();
};

// ════════════════════════════════════════════════════════════════
// AI ENGINE PAGE  (Part C)
// ════════════════════════════════════════════════════════════════

function buildInitialChat() {
  return [{
    role: 'ai',
    text: `Welcome to the PDGMS AI Engine — your Socratic research mentor.\n\nI help you:\n• Analyse and score Q → H → E research threads\n• Evaluate hypothesis testability and falsifiability\n• Suggest rigorous experiment designs\n• Detect logical gaps, unsupported claims, and contradictions\n\nAll my responses are checked by a 4-layer hallucination guardrail system:\n  Layer 1: Source Anchoring\n  Layer 2: Confidence Thresholding (≥${State.confidenceThreshold}%)\n  Layer 3: Contradiction Detection\n  Layer 4: Human Checkpoint for high-risk claims\n\nType a question, paste a thread, or use a Quick Prompt to begin.`,
    time: getTime(),
    confidence: null,
    guardrailPassed: null,
    guardrailFlags: [],
  }];
}

window.clearChat = function () {
  State.chatHistory = buildInitialChat();
  State.sessionStats = { messages: 0, flags: 0, confidenceSum: 0, confidenceCount: 0, passed: 0 };
  renderChatMessages();
  updateSessionStats();
};

window.quickPrompt = function (text) {
  const input = document.getElementById('chat-input');
  if (input) { input.value = text; input.focus(); }
};

window.updateThreshold = function (val) {
  State.confidenceThreshold = +val;
  const el = document.getElementById('threshold-val');
  if (el) el.textContent = val;
};

async function sendMessage() {
  const input = document.getElementById('chat-input');
  const text = (input?.value || '').trim();
  if (!text || State.isAILoading) return;

  input.value = '';
  State.isAILoading = true;
  State.sessionStats.messages++;

  State.chatHistory.push({ role: 'user', text, time: getTime(), confidence: null, guardrailFlags: [] });
  State.chatHistory.push({ role: 'ai', text: '__LOADING__', time: getTime(), confidence: null, guardrailFlags: [] });
  renderChatMessages();

  const systemPrompt = `You are PDGMS AI — the Socratic Dialogue research assistant for DeepThought's Learning Management System (LMS).

Your purpose: Help users build rigorous Question → Hypothesis → Experiment (Q→H→E) research threads using the Socratic method.

Core rules:
1. Use precise, scientific language. Always use hedged epistemic markers: "may", "suggests", "evidence indicates", "research implies". Never say "this proves" or "this definitely shows".
2. When evaluating a thread, score it on these 4 criteria (each 1–5):
   - Question Clarity: specific, observable, meaningful?
   - Hypothesis Testability: falsifiable, measurable, includes a quantitative prediction?
   - Experiment Design: controls, sample size, measurement plan, timeline?
   - Evidence Quality: grounded in prior research or cited data?
3. Always ask one clarifying Socratic question after your analysis to deepen the user's thinking.
4. If a hypothesis is not falsifiable, flag it immediately with [NOT FALSIFIABLE].
5. If you do not know something, say so rather than guessing.
6. Keep responses under 300 words. Use plain text only. No markdown headers or bullet symbols.
7. End every substantive response with: "Confidence: X% | Guardrails: Passed/Flagged"

PDGMS Framework context: P=Problem Definition, D=Direction/Goal Setting, G=Generating Hypotheses, M=Measurement Design, S=Scientific Execution.`;

  const messages = State.chatHistory
    .filter(m => m.text !== '__LOADING__')
    .map(m => ({ role: m.role === 'ai' ? 'assistant' : 'user', content: m.text }));

  try {
    const apiKey = State.apiKey || '';
    if (!apiKey) {
      throw new Error('No API key set. Please enter your Anthropic API key in the AI Engine settings.');
    }
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: systemPrompt,
        messages,
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error?.message || `HTTP ${response.status}`);
    }

    const data = await response.json();
    const aiText = data.content?.map(b => b.type === 'text' ? b.text : '').join('') || 'No response received.';
    const guardrailResult = clientGuardrailCheck(aiText, State.selectedThread?.hypothesis || '');

    State.sessionStats.flags += guardrailResult.flags.length;
    State.sessionStats.confidenceSum += guardrailResult.confidence;
    State.sessionStats.confidenceCount++;
    if (guardrailResult.passed) State.sessionStats.passed++;

    State.chatHistory = State.chatHistory.filter(m => m.text !== '__LOADING__');
    State.chatHistory.push({
      role: 'ai', text: aiText, time: getTime(),
      confidence: guardrailResult.confidence,
      guardrailPassed: guardrailResult.passed,
      guardrailFlags: guardrailResult.flags,
    });

  } catch (err) {
    State.chatHistory = State.chatHistory.filter(m => m.text !== '__LOADING__');
    State.chatHistory.push({
      role: 'ai',
      text: `⚠ AI Engine error: ${err.message}.\n\nIf this is a CORS or API error, the Anthropic API requires a server-side proxy in production. For local testing, run a simple proxy or open via a local server.`,
      time: getTime(), confidence: null, guardrailPassed: false, guardrailFlags: [],
    });
  }

  State.isAILoading = false;
  renderChatMessages();
  updateSessionStats();
}

function renderChatMessages() {
  const container = document.getElementById('chat-messages');
  if (!container) return;

  container.innerHTML = State.chatHistory.map(msg => {
    if (msg.text === '__LOADING__') return `
      <div class="message ai">
        <div class="message-bubble">
          <div class="loading-dots"><span></span><span></span><span></span></div>
        </div>
      </div>`;

    const isAI = msg.role === 'ai';
    const confidenceHtml = (isAI && msg.confidence !== null)
      ? ` · Confidence: <strong style="color:${confColor(msg.confidence)}">${msg.confidence}%</strong>`
      : '';
    const statusHtml = isAI
      ? (msg.guardrailPassed === true ? ' · <span style="color:var(--green)">✓ Passed</span>'
        : msg.guardrailPassed === false ? ' · <span style="color:var(--red)">⚠ Flagged</span>' : '')
      : '';
    const meta = isAI
      ? `PDGMS AI · ${msg.time}${confidenceHtml}${statusHtml}`
      : `You · ${msg.time}`;

    const flagsHtml = (msg.guardrailFlags || []).map(f => `
      <div class="guardrail-alert guardrail-${f.type === 'error' ? 'error' : f.type === 'warn' ? 'warn' : 'info'}" style="margin-top:.5rem;font-size:.68rem;">
        <span class="guardrail-icon">${f.type === 'error' ? '🚫' : f.type === 'warn' ? '⚠️' : 'ℹ️'}</span>
        <div>[Layer ${f.layer}] ${f.message}</div>
      </div>`).join('');

    return `<div class="message ${msg.role}">
      <div class="message-bubble" style="white-space:pre-line;">${escHtml(msg.text)}</div>
      ${flagsHtml}
      <div class="message-meta">${meta}</div>
    </div>`;
  }).join('');

  container.scrollTop = container.scrollHeight;
}

function setupGuardrailToggles() {
  ['toggle-source','toggle-confidence','toggle-contradiction','toggle-checkpoint'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.classList.add('on');
      el.addEventListener('click', () => el.classList.toggle('on'));
    }
  });

  const input = document.getElementById('chat-input');
  const btn = document.getElementById('send-btn');
  if (input) input.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } });
  if (btn) btn.addEventListener('click', sendMessage);
}

function updateSessionStats() {
  const s = State.sessionStats;
  const msgEl = document.getElementById('stat-messages');
  const flagEl = document.getElementById('stat-flags');
  const confEl = document.getElementById('stat-confidence');
  const passEl = document.getElementById('stat-passed');

  const totalAI = State.chatHistory.filter(m => m.role === 'ai' && m.text !== '__LOADING__').length;
  if (msgEl) msgEl.textContent = totalAI;
  if (flagEl) flagEl.textContent = s.flags;
  if (confEl) confEl.textContent = s.confidenceCount > 0 ? Math.round(s.confidenceSum / s.confidenceCount) + '%' : '—';
  if (passEl) passEl.textContent = s.confidenceCount > 0 ? Math.round((s.passed / s.confidenceCount) * 100) + '%' : '—';
}

// ════════════════════════════════════════════════════════════════
// ANALYTICS PAGE
// ════════════════════════════════════════════════════════════════

function renderAnalyticsPage() {
  renderQualityChart();
  renderScoreBreakdown();
  renderExpStatusDonut();
  renderTranscriptTimeline();
  renderGuardrailChart();
}

function renderQualityChart() {
  const el = document.getElementById('quality-chart');
  if (!el) return;
  const grades = { A: 0, B: 0, C: 0, D: 0 };
  State.threads.forEach(t => { if (t.grade) grades[t.grade]++; });
  const max = Math.max(...Object.values(grades), 1);
  const colors = { A: '#166534', B: '#1e40af', C: '#854d0e', D: '#991b1b' };

  el.innerHTML = `
    <div class="chart-bar-group" style="margin-bottom:2.5rem;">
      ${Object.entries(grades).map(([g, count]) => `
        <div class="chart-bar" style="height:${(count/max)*100}%;background:${colors[g]};" title="${g}: ${count}">
          <span class="chart-bar-val" style="color:${colors[g]};">${count}</span>
          <span class="chart-bar-label">${g}</span>
        </div>`).join('')}
    </div>
    <div style="font-family:var(--font-mono);font-size:.65rem;color:rgba(13,13,13,.35);margin-top:.5rem;">Grade Distribution (${State.threads.length} threads)</div>`;
}

function renderScoreBreakdown() {
  const el = document.getElementById('score-breakdown');
  if (!el) return;
  const keys = ['question_clarity','hypothesis_testability','experiment_design','evidence_quality'];
  const labels = ['Q Clarity','H Testability','Exp. Design','Evidence'];
  const avgs = keys.map(k => {
    const vals = State.threads.map(t => t.scores?.[k] || 0);
    return (vals.reduce((a,b) => a+b, 0) / (vals.length || 1)).toFixed(1);
  });
  el.innerHTML = keys.map((k, i) => `
    <div style="margin-bottom:.85rem;">
      <div style="display:flex;justify-content:space-between;font-family:var(--font-mono);font-size:.68rem;margin-bottom:.3rem;">
        <span>${labels[i]}</span><span style="font-weight:500;">${avgs[i]}/5</span>
      </div>
      <div class="score-bar-wrap">
        <div class="score-bar" style="width:${(avgs[i]/5)*100}%;transition:width 1s ease;"></div>
      </div>
    </div>`).join('');
}

function renderExpStatusDonut() {
  const el = document.getElementById('exp-status-chart');
  if (!el) return;
  const counts = { running: 0, pending: 0, complete: 0, failed: 0 };
  State.experiments.forEach(e => counts[e.status]++);
  const colors = { running: '#3b82f6', pending: '#f59e0b', complete: '#22c55e', failed: '#ef4444' };
  const total = Object.values(counts).reduce((a,b) => a+b, 0) || 1;

  el.innerHTML = `
    <div class="donut-wrap">
      <svg width="100" height="100" viewBox="0 0 100 100">
        ${buildDonutSegments(counts, colors)}
        <text x="50" y="54" text-anchor="middle" font-family="var(--font-display)" font-size="18" font-weight="700">${total}</text>
      </svg>
      <div class="donut-legend">
        ${Object.entries(counts).map(([k, v]) => `
          <div class="legend-item">
            <div class="legend-dot" style="background:${colors[k]};"></div>
            <span>${k}: <strong>${v}</strong></span>
          </div>`).join('')}
      </div>
    </div>`;
}

function renderTranscriptTimeline() {
  const el = document.getElementById('transcript-timeline');
  if (!el) return;
  const max = Math.max(...State.transcripts.map(t => calcTotal(t.scores)), 1);

  el.innerHTML = `
    <div style="display:flex;align-items:flex-end;gap:12px;height:120px;margin-top:1rem;padding-bottom:1.5rem;position:relative;">
      ${State.transcripts.map(t => {
        const total = calcTotal(t.scores);
        const g = gradeFromScore(total);
        return `
        <div style="display:flex;flex-direction:column;align-items:center;flex:1;gap:.3rem;">
          <div style="font-family:var(--font-mono);font-size:.62rem;color:rgba(13,13,13,.5);">${total}/20</div>
          <div style="flex:1;width:100%;background:var(--ink);border-radius:2px 2px 0 0;
              height:${(total/max)*100}%;min-height:8px;cursor:pointer;transition:.3s;"
              title="${t.session}: ${total}/20" class="chart-bar"
              onmouseenter="this.style.background='var(--accent)'" onmouseleave="this.style.background='var(--ink)'"></div>
          <div style="font-family:var(--font-mono);font-size:.58rem;color:rgba(13,13,13,.4);text-align:center;white-space:nowrap;overflow:hidden;width:100%;text-overflow:ellipsis;">
            S${State.transcripts.indexOf(t)+1}
          </div>
        </div>`;
      }).join('')}
    </div>
    <div style="font-family:var(--font-mono);font-size:.65rem;color:rgba(13,13,13,.35);">Session scores over time (${State.transcripts.length} sessions)</div>`;
}

function renderGuardrailChart() {
  const el = document.getElementById('guardrail-chart');
  if (!el) return;
  const layers = [
    { label: 'L1 Source', hits: 2, color: '#f59e0b' },
    { label: 'L2 Confidence', hits: 5, color: '#3b82f6' },
    { label: 'L3 Contradiction', hits: 1, color: '#ef4444' },
    { label: 'L4 Checkpoint', hits: 3, color: '#8b5cf6' },
  ];
  const max = Math.max(...layers.map(l => l.hits));

  el.innerHTML = `
    <div style="display:flex;align-items:flex-end;gap:10px;height:120px;margin-top:1rem;padding-bottom:1.5rem;">
      ${layers.map(l => `
        <div style="display:flex;flex-direction:column;align-items:center;flex:1;gap:.3rem;">
          <div style="font-family:var(--font-mono);font-size:.65rem;">${l.hits}</div>
          <div style="flex:1;width:100%;background:${l.color};border-radius:2px 2px 0 0;opacity:.85;
              height:${(l.hits/max)*100}%;min-height:8px;"></div>
          <div style="font-family:var(--font-mono);font-size:.6rem;color:rgba(13,13,13,.45);text-align:center;">${l.label}</div>
        </div>`).join('')}
    </div>
    <div style="font-family:var(--font-mono);font-size:.65rem;color:rgba(13,13,13,.35);">Guardrail flags raised this session</div>`;
}

function buildDonutSegments(counts, colors) {
  const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1;
  const cx = 50, cy = 50, r = 38, strokeW = 14;
  const circ = 2 * Math.PI * r;
  let offset = 0;
  return Object.entries(counts).map(([k, v]) => {
    const frac = v / total;
    const seg = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${colors[k]}"
      stroke-width="${strokeW}" stroke-dasharray="${frac * circ} ${circ}"
      stroke-dashoffset="${-offset * circ}" transform="rotate(-90 ${cx} ${cy})"/>`;
    offset += frac;
    return seg;
  }).join('');
}

// ════════════════════════════════════════════════════════════════
// GUARDRAIL ENGINE  (client-side)
// ════════════════════════════════════════════════════════════════

function clientGuardrailCheck(text, context = '') {
  const flags = [];
  let confidence = 1.0;

  // Layer 1: Source Anchoring
  const hasBoldClaim = /therefore|this proves|demonstrates that|confirms that|clearly|obviously|certainly|definitely shows/i.test(text);
  const hasSource = /according to|cited|source:|evidence:|study|research|data from|per |found that/i.test(text);
  if (hasBoldClaim && !hasSource) {
    flags.push({ layer: 1, type: 'warn', code: 'UNSOURCED_CLAIM', message: 'Strong claim detected without evidence citation. Add a source or soften the language.' });
    confidence -= 0.12;
  }

  // Layer 2: Confidence Thresholding
  const absoluteWords = (text.match(/\b(always|never|all students|none|every|proven fact|guaranteed|impossible)\b/gi) || []).length;
  if (absoluteWords > 1) {
    flags.push({ layer: 2, type: 'warn', code: 'OVERCONFIDENT', message: `${absoluteWords} absolute claims detected. Scientific language should reflect uncertainty — use "may", "suggests", "indicates".` });
    confidence -= 0.08 * absoluteWords;
  }

  // Layer 3: Contradiction Detection
  if (context && context.length > 10) {
    const negators = ['not', 'no', 'never', "doesn't", "isn't", 'cannot', 'fails', 'opposite', 'contrary'];
    const keyWords = context.toLowerCase().split(/\W+/).filter(w => w.length > 5);
    const textLower = text.toLowerCase();
    const found = keyWords.find(w => negators.some(neg => new RegExp(`${neg}\\s+\\w*\\s*${w}`, 'i').test(textLower)));
    if (found) {
      flags.push({ layer: 3, type: 'error', code: 'CONTRADICTION', message: `Potential contradiction with existing hypothesis context ("${found}"). Review carefully.` });
      confidence -= 0.2;
    }
  }

  // Layer 4: Human Checkpoint
  const riskCount = (text.match(/\b(you should|must implement|deploy|publish now|conclude definitively|recommend immediately)\b/gi) || []).length;
  if (riskCount >= 2) {
    flags.push({ layer: 4, type: 'warn', code: 'HUMAN_CHECKPOINT', message: 'Actionable recommendations detected. Require human review before acting on these suggestions.' });
    confidence -= 0.08;
  }

  confidence = Math.max(0, Math.min(1, confidence));
  const passed = confidence >= (State.confidenceThreshold / 100) && !flags.some(f => f.type === 'error');

  return { passed, confidence: Math.round(confidence * 100), flags };
}

// ════════════════════════════════════════════════════════════════
// SCORING ENGINE
// ════════════════════════════════════════════════════════════════

function computeScores(thread) {
  const q = thread.question || '';
  const h = thread.hypothesis || '';
  const e = thread.experiment || '';

  let qs = 1;
  if (q.length > 30) qs++;
  if (/\b(why|how|what|when|where|does|can|will)\b/i.test(q)) qs++;
  if (q.includes('?')) qs++;
  if (q.length > 70 && /measur|test|compar|effect|impact/i.test(q)) qs++;

  let hs = 1;
  if (h.length > 40) hs++;
  if (/\b(if|then|when|because|due to)\b/i.test(h)) hs++;
  if (/\d+%|\d+x|significant|measur|quantifi/i.test(h)) hs++;
  if (/predict|falsif|test|more than|less than|greater|reduce|increase|improve/i.test(h)) hs++;

  let es = 1;
  if (e.length > 60) es++;
  if (/\b(group|control|compare|a\/b|randomis|randomiz)\b/i.test(e)) es++;
  if (/\b(measure|metric|track|data|assess|evaluat)\b/i.test(e)) es++;
  if (/\b(day|week|month|session|\d+ (participant|subject|student|learner))\b/i.test(e)) es++;

  const ev = thread.evidence && thread.evidence.length > 20 ? 4 : thread.evidence ? 3 : 2;

  const scores = {
    question_clarity: Math.min(5, qs),
    hypothesis_testability: Math.min(5, hs),
    experiment_design: Math.min(5, es),
    evidence_quality: ev,
  };
  const total = calcTotal(scores);
  const grade = total >= 18 ? 'A' : total >= 14 ? 'B' : total >= 10 ? 'C' : 'D';
  return { scores, total, grade };
}

// ════════════════════════════════════════════════════════════════
// UTILITIES
// ════════════════════════════════════════════════════════════════

function calcTotal(scores) {
  return scores ? Object.values(scores).reduce((a, b) => a + b, 0) : 0;
}

function gradeFromScore(total) {
  return total >= 18 ? 'A' : total >= 14 ? 'B' : total >= 10 ? 'C' : 'D';
}

function statusIcon(status) {
  return { running: '▶', pending: '◔', complete: '✓', failed: '✕' }[status] || '?';
}

function confColor(pct) {
  if (pct >= 85) return '#166534';
  if (pct >= 70) return '#1e40af';
  if (pct >= 50) return '#854d0e';
  return '#991b1b';
}

function confLabel(pct) {
  if (pct >= 85) return 'High';
  if (pct >= 70) return 'Medium';
  return 'Low';
}

function formatDate(iso) {
  if (!iso) return '';
  try { return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }); }
  catch { return iso; }
}

function getTime() {
  return new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function showAlert(containerId, type, icon, message) {
  const el = containerId ? document.getElementById(containerId) : null;
  const html = `<div class="guardrail-alert guardrail-${type}" style="margin-top:.75rem;">
    <span class="guardrail-icon">${icon}</span><div>${message}</div></div>`;
  if (el) el.innerHTML = html;
  else console.warn(message);
}

// ── API Key Management ──────────────────────────────────────────
window.saveApiKey = function (val) {
  State.apiKey = val.trim();
  localStorage.setItem('dt_api_key', State.apiKey);
  const statusEl = document.getElementById('api-key-status');
  if (statusEl) {
    if (State.apiKey.startsWith('sk-ant-') || State.apiKey.startsWith('sk-')) {
      statusEl.textContent = '✓ Key saved';
      statusEl.style.color = 'var(--green, #2a7a2a)';
    } else if (State.apiKey.length > 0) {
      statusEl.textContent = '⚠ Key format looks unusual';
      statusEl.style.color = '#b85c00';
    } else {
      statusEl.textContent = 'No key set';
      statusEl.style.color = 'rgba(13,13,13,.4)';
    }
  }
};
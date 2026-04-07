// ── MARKED CONFIG ─────────────────────────────────────────
marked.setOptions({ breaks: true, gfm: true });

// ── API CALL ──────────────────────────────────────────────
async function callAI(system, userMessage) {
  const response = await fetch('/api/claude', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system,
      messages: [{ role: 'user', content: userMessage }]
    })
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || 'API call failed');
  }

  const data = await response.json();
  return data.content;
}

// ── HELPERS ───────────────────────────────────────────────
function showLoading(tool) {
  document.getElementById(`${tool}-loading`).style.display = 'flex';
  document.getElementById(`${tool}-output`).style.display = 'none';
}

function showOutput(tool, content) {
  document.getElementById(`${tool}-loading`).style.display = 'none';
  const outputEl = document.getElementById(`${tool}-output`);
  outputEl.style.display = 'block';
  // Render markdown
  document.getElementById(`${tool}-result`).innerHTML = marked.parse(content);
  // Store raw for copy
  document.getElementById(`${tool}-result-raw`).value = content;
  outputEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function showError(tool, message) {
  document.getElementById(`${tool}-loading`).style.display = 'none';
  const outputEl = document.getElementById(`${tool}-output`);
  outputEl.style.display = 'block';
  document.getElementById(`${tool}-result`).innerHTML =
    `<p style="color:#f87171"><strong>Error:</strong> ${message}</p><p style="color:var(--muted);font-size:0.85rem;margin-top:0.5rem">Please wait a moment and try again. If the issue persists, the API rate limit may have been reached.</p>`;
  document.getElementById(`${tool}-result-raw`).value = `Error: ${message}`;
}

function copyOutput(id) {
  const text = document.getElementById(id).value;
  navigator.clipboard.writeText(text).then(() => {
    const btn = event.target;
    const orig = btn.textContent;
    btn.textContent = '✓ Copied!';
    btn.style.color = 'var(--green)';
    setTimeout(() => { btn.textContent = orig; btn.style.color = ''; }, 2000);
  });
}

function scrollToTool(id) {
  document.getElementById(id).scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function setLoading(tool, loading) {
  const btn = document.querySelector(`#${tool} .generate-btn`);
  if (btn) btn.disabled = loading;
}

// ── TOOL 1: SPRINT PLANNER ────────────────────────────────
async function generateSprint() {
  const context = document.getElementById('sprint-context').value.trim();
  const stories = document.getElementById('sprint-stories').value.trim();
  const teamSize = document.getElementById('sprint-team').value;
  const duration = document.getElementById('sprint-duration').value;

  if (!stories) { alert('Please enter at least one user story.'); return; }

  setLoading('sprint', true);
  showLoading('sprint');

  const system = `You are a Senior Agile Delivery Manager and Technical Project Manager with 10+ years of experience in banking and financial services. You produce precise, professional sprint plans that delivery teams can act on immediately. Use Fibonacci story points (1, 2, 3, 5, 8, 13). Format your response using markdown with clear headers, tables where appropriate, and structured sections.`;

  const prompt = `Generate a detailed sprint plan for the following:

**PROJECT CONTEXT:** ${context || 'Not specified'}
**TEAM SIZE:** ${teamSize} developers
**SPRINT DURATION:** ${duration}

**USER STORIES:**
${stories}

For each user story provide:
- Story Points (Fibonacci) with clear justification
- Acceptance Criteria (minimum 3 specific, testable criteria)
- Assumptions
- Dependencies  
- Risks

Then provide a **SPRINT SUMMARY** with:
- Total story points
- Recommended sprint commitment (accounting for ceremonies and buffer)
- Top 3 delivery risks
- Sprint goal statement

Use markdown formatting — headers, bold text, and tables where helpful.`;

  try {
    const result = await callAI(system, prompt);
    showOutput('sprint', result);
  } catch (err) {
    showError('sprint', err.message);
  } finally {
    setLoading('sprint', false);
  }
}

// ── TOOL 2: RAID GENERATOR ────────────────────────────────
async function generateRAID() {
  const brief = document.getElementById('raid-brief').value.trim();
  if (!brief) { alert('Please enter a project brief.'); return; }

  setLoading('raid', true);
  showLoading('raid');

  const system = `You are a Senior Project Manager and Risk Analyst with 10+ years delivering regulated banking and financial services products. You produce comprehensive, realistic RAID logs. Format your response in clean markdown with tables for each RAID section.`;

  const prompt = `Analyse this project brief and generate a fully populated RAID log:

**PROJECT BRIEF:**
${brief}

Generate four sections as markdown tables:

## RISKS
| ID | Description | Impact | Owner | Mitigation |
(minimum 4 risks)

## ASSUMPTIONS  
| ID | Description | Impact | Owner | Action if Wrong |
(minimum 3 assumptions)

## ISSUES
| ID | Description | Impact | Owner | Action |
(minimum 3 current issues)

## DEPENDENCIES
| ID | Description | Impact | Owner | Mitigation |
(minimum 3 dependencies)

After the tables add:

## PROJECT HEALTH SUMMARY
- **Overall RAG Status:** Red / Amber / Green
- **Justification:** One paragraph
- **Top 3 Immediate Actions Required This Week:**`;

  try {
    const result = await callAI(system, prompt);
    showOutput('raid', result);
  } catch (err) {
    showError('raid', err.message);
  } finally {
    setLoading('raid', false);
  }
}

// ── TOOL 3: STATUS SUMMARIZER ─────────────────────────────
async function generateStatus() {
  const project = document.getElementById('status-project').value.trim();
  const updates = document.getElementById('status-updates').value.trim();
  if (!updates) { alert('Please paste your team updates.'); return; }

  setLoading('status', true);
  showLoading('status');

  const system = `You are a Senior Project Manager preparing executive status reports for CTOs and senior client stakeholders in regulated banking environments. You write with clarity and appropriate urgency. Format using markdown.`;

  const prompt = `Convert these raw team updates into a professional executive RAG status report.

**PROJECT:** ${project || 'Project Status Update'}

**RAW TEAM UPDATES:**
${updates}

Generate a formatted markdown status report with these sections:

## Overall RAG Status
🔴 RED / 🟡 AMBER / 🟢 GREEN — one sentence justification

## Progress This Week
What was completed (professional prose)

## Key Risks and Blockers
| Risk | Impact | Recommended Action |
(table format)

## Decisions Required
Specific decisions needed from leadership this week — numbered list with enough context to act immediately

## Plan for Next Week
What the team is committing to deliver`;

  try {
    const result = await callAI(system, prompt);
    showOutput('status', result);
  } catch (err) {
    showError('status', err.message);
  } finally {
    setLoading('status', false);
  }
}

// ── TOOL 4: PROJECT HEALTH SCORECARD ─────────────────────
async function generateHealth() {
  const project = document.getElementById('health-project').value.trim();
  const week = document.getElementById('health-week').value.trim();
  const velocity = document.getElementById('health-velocity').value.trim();
  const delivery = document.getElementById('health-delivery').value.trim();
  const defects = document.getElementById('health-defects').value.trim();
  const capacity = document.getElementById('health-capacity').value.trim();
  const risks = document.getElementById('health-risks').value.trim();
  const milestone = document.getElementById('health-milestone').value.trim();

  if (!velocity && !risks) { alert('Please enter at least velocity trend and key risks.'); return; }

  setLoading('health', true);
  showLoading('health');

  const system = `You are a senior delivery consultant and programme director with 15+ years experience assessing project health for banking and enterprise clients. You produce precise, actionable health scorecards that cut through noise and give leadership what they need to make decisions. Format using markdown.`;

  const prompt = `Generate a comprehensive Project Health Scorecard for the following project:

**Project:** ${project || 'Project Assessment'}
**Timeline:** ${week || 'Not specified'}
**Velocity Trend (last 4 sprints):** ${velocity || 'Not provided'}
**On-Time Delivery Rate:** ${delivery || 'Not provided'}
**Open Defects:** ${defects || 'Not provided'}
**Team Capacity:** ${capacity || 'Not provided'}
**Key Blockers / Risks:** ${risks || 'Not provided'}
**Milestone Status:** ${milestone || 'Not provided'}

Generate a health scorecard with:

## Overall Health Score: X/100
One sentence verdict.

## Health by Dimension
| Dimension | Score | Status | Key Finding |
Score each: Delivery Velocity | Quality | Risk Exposure | Team Health | Stakeholder Alignment | Timeline Confidence

## RAG Status
🔴 / 🟡 / 🟢 with one paragraph justification

## Critical Flags
Top 3 things that need immediate leadership attention — numbered, specific, actionable

## Recommended Actions This Week
| Priority | Action | Owner | Deadline |

## 2-Week Forecast
If current trajectory continues — what happens? What changes if top action is taken?`;

  try {
    const result = await callAI(system, prompt);
    showOutput('health', result);
  } catch (err) {
    showError('health', err.message);
  } finally {
    setLoading('health', false);
  }
}

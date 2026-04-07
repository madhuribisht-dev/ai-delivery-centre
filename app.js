// ── API CALL ──────────────────────────────────────────────
async function callClaude(system, userMessage) {
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
  document.getElementById(`${tool}-output`).style.display = 'block';
  document.getElementById(`${tool}-result`).textContent = content;
  document.getElementById(`${tool}-output`).scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function showError(tool, message) {
  document.getElementById(`${tool}-loading`).style.display = 'none';
  document.getElementById(`${tool}-output`).style.display = 'block';
  document.getElementById(`${tool}-result`).textContent = `Error: ${message}\n\nPlease check your API configuration and try again.`;
}

function copyOutput(id) {
  const text = document.getElementById(id).textContent;
  navigator.clipboard.writeText(text).then(() => {
    const btn = event.target;
    btn.textContent = 'Copied!';
    setTimeout(() => btn.textContent = 'Copy', 2000);
  });
}

function scrollToTool(id) {
  document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}

// ── SPRINT PLANNER ────────────────────────────────────────
async function generateSprint() {
  const context = document.getElementById('sprint-context').value.trim();
  const stories = document.getElementById('sprint-stories').value.trim();
  const teamSize = document.getElementById('sprint-team').value;
  const duration = document.getElementById('sprint-duration').value;

  if (!stories) {
    alert('Please enter at least one user story.');
    return;
  }

  const btn = document.querySelector('#sprint .generate-btn');
  btn.disabled = true;
  showLoading('sprint');

  const system = `You are a Senior Agile Delivery Manager and Technical Project Manager with 10+ years of experience in banking and financial services. You produce precise, professional sprint plans that delivery teams can act on immediately. Always use Fibonacci story points (1, 2, 3, 5, 8, 13). Be specific and practical.`;

  const userMessage = `Generate a detailed sprint plan for the following:

PROJECT CONTEXT: ${context || 'Not specified'}
TEAM SIZE: ${teamSize} developers
SPRINT DURATION: ${duration}

USER STORIES:
${stories}

For each user story provide:
1. Story Points (Fibonacci: 1,2,3,5,8,13) with clear justification
2. Acceptance Criteria (minimum 3 specific, testable criteria)
3. Assumptions
4. Dependencies
5. Risks

Then provide a SPRINT SUMMARY including:
- Total story points
- Recommended sprint commitment (accounting for ceremonies, meetings, buffer)
- Top 3 delivery risks
- Recommended sprint goal statement

Format clearly with headers and sections. Be specific to banking/financial services context where relevant.`;

  try {
    const result = await callClaude(system, userMessage);
    showOutput('sprint', result);
  } catch (err) {
    showError('sprint', err.message);
  } finally {
    btn.disabled = false;
  }
}

// ── RAID GENERATOR ────────────────────────────────────────
async function generateRAID() {
  const brief = document.getElementById('raid-brief').value.trim();

  if (!brief) {
    alert('Please enter a project brief.');
    return;
  }

  const btn = document.querySelector('#raid .generate-btn');
  btn.disabled = true;
  showLoading('raid');

  const system = `You are a Senior Project Manager and Risk Analyst with 10+ years delivering regulated banking and financial services products. You produce comprehensive, realistic RAID logs that capture what teams actually face — not generic textbook risks. Always assign impact as High/Medium/Low and suggest specific owner roles (not names).`;

  const userMessage = `Analyse this project brief and generate a fully populated RAID log:

PROJECT BRIEF:
${brief}

Generate four separate sections:

RISKS — things that could go wrong and impact delivery
ASSUMPTIONS — things we are betting on being true  
ISSUES — things already going wrong right now
DEPENDENCIES — things we are waiting on from others

For each item use this format:
ID | Description | Impact (H/M/L) | Owner Role | Mitigation / Action

Minimum 3-4 items per section. Be specific to the context provided.

After the four tables, add:
PROJECT HEALTH SUMMARY
- Overall RAG Status (Red/Amber/Green) with one paragraph justification
- Top 3 immediate actions required this week`;

  try {
    const result = await callClaude(system, userMessage);
    showOutput('raid', result);
  } catch (err) {
    showError('raid', err.message);
  } finally {
    btn.disabled = false;
  }
}

// ── STATUS SUMMARIZER ─────────────────────────────────────
async function generateStatus() {
  const project = document.getElementById('status-project').value.trim();
  const updates = document.getElementById('status-updates').value.trim();

  if (!updates) {
    alert('Please paste your team updates.');
    return;
  }

  const btn = document.querySelector('#status .generate-btn');
  btn.disabled = true;
  showLoading('status');

  const system = `You are a Senior Project Manager preparing executive status reports for CTOs and senior client stakeholders in regulated banking environments. You write with clarity, precision, and appropriate urgency. You never use bullet soup — you use structured short paragraphs. You always make decisions required explicit and actionable.`;

  const userMessage = `Convert these raw team updates into a professional executive RAG status report.

PROJECT: ${project || 'Project Status Update'}

RAW TEAM UPDATES:
${updates}

Generate a status report with these exact sections:

1. OVERALL RAG STATUS
Red / Amber / Green with one sentence justification

2. PROGRESS THIS WEEK
What was completed this week (professional prose, not bullet points)

3. KEY RISKS AND BLOCKERS
What is threatening delivery — with impact level and recommended action for each

4. DECISIONS REQUIRED
Specific decisions needed from leadership or stakeholders this week — with enough context to act

5. PLAN FOR NEXT WEEK
What the team is committing to deliver next week

Format as a professional executive report. Language suitable for CTO and client audience.`;

  try {
    const result = await callClaude(system, userMessage);
    showOutput('status', result);
  } catch (err) {
    showError('status', err.message);
  } finally {
    btn.disabled = false;
  }
}

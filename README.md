# AI Delivery Command Centre

A free, live web application with four AI-powered tools built for Technical Project Managers and Agile delivery teams.

**Live Tool:** [ai-delivery-centre.vercel.app](https://ai-delivery-centre.vercel.app)

---

## What It Does

Most TPM work involves the same high-effort, repeatable documents — sprint plans, RAID logs, status reports, health scorecards. This tool compresses hours of that work into under 60 seconds, giving delivery teams a strong starting point that they then validate and refine with domain expertise.

The AI handles the drafting. The PM handles the judgment. That is the correct division of labour.

---

## Four Tools

### 01 — AI Sprint Planner
**Input:** User stories + team size + sprint duration
**Output:** Story points (Fibonacci), acceptance criteria, assumptions, dependencies, risks per story — plus sprint summary, recommended commitment, and sprint goal statement

### 02 — AI RAID Log Generator
**Input:** Project brief in plain text
**Output:** Fully populated RAID log across four sections (Risks, Assumptions, Issues, Dependencies) with impact ratings, suggested owner roles, and mitigation actions — plus overall project RAG status

### 03 — AI Status Report Summarizer
**Input:** Raw team updates pasted exactly as received
**Output:** Formatted executive RAG status report with progress summary, risks and blockers table, decisions required, and next week plan — ready to send to a CTO or client

### 04 — Project Health Scorecard
**Input:** Sprint velocity trend, defect counts, capacity, blockers, milestone status
**Output:** Health score out of 100 with dimensional breakdown, RAG status, critical flags, and recommended actions table

---

## Architecture

```
Frontend (HTML + CSS + Vanilla JS)
        ↓
Vercel Serverless Function  ←  API key stored securely in environment variables
        ↓
Groq API (Llama 3 — free tier)
        ↓
Structured AI output rendered as formatted markdown
```

- **Frontend:** HTML, CSS, Vanilla JavaScript — no framework dependencies
- **Backend:** Vercel serverless function acting as a secure API proxy
- **AI Model:** Llama 3 via Groq API — free tier, fast responses
- **Deployment:** Vercel — auto-deploys on GitHub push

The API key is stored as a Vercel environment variable and never appears in the repository. The prompt engineering layer is maintained in a separate private repository.

---

## Why I Built This

I spent 11 years delivering technology programmes in Banking, Telecom, and Travel — including 16 months onshore in London as the single point of contact for a UK retail banking platform modernisation. Sprint planning, RAID logs, and status reporting were a constant part of my work.

The most frustrating part was never the thinking — it was the blank page. This tool solves that.

It is also a deliberate demonstration of AI-augmented delivery — using LLMs to accelerate workflows without replacing PM judgment. Every output requires human review and domain validation before use.

---

## Try It

The tool is free and requires no login.

**[Open AI Delivery Command Centre →](https://ai-delivery-centre.vercel.app)**

---

## Built By

**Madhuri Bisht** — Technical Project Manager
PMP® · PSM I · AZ-900 · Google PM Certified
11+ years in Banking & Financial Services · India & UK

Portfolio: [madhuribisht-dev.github.io](https://madhuribisht-dev.github.io)
LinkedIn: [linkedin.com/in/madhuri-bishtkaira](https://linkedin.com/in/madhuri-bishtkaira)

---

*The prompt engineering layer and system prompt design are maintained in a private repository.*

# LexiGuard AI — Plain-English Legal Document Analysis & Grounded Traceability

> **LEGAL DISCLAIMER**: LexiGuard AI provides general legal information and document analysis. It does not provide legal advice or replace a qualified legal professional.

LexiGuard AI is an AI-powered legal document analysis platform created to transform complex employment contracts, NDAs, leases, and service agreements into plain-English insights, actionable pre-signing checklists, grounded Q&A, and side-by-side contract diffs—maintaining **100% clause-level source traceability**.

---

## 📚 Technical Documentation Index

For deep architectural, visual, UI/UX, and AI algorithmic specifications, refer to the following companion guides:

- 🎨 **[DESIGN.md](file:///c:/Users/Mrigesh%20koyande/OneDrive/Desktop/LexiGuard%20AI/LexiGuard-AI/DESIGN.md)** — Comprehensive UI/UX architecture, visual design system tokens, interactive split-screen workspace specification, component hierarchy, API endpoint contract, and database ER schema.
- 🧠 **[BRAIN.md](file:///c:/Users/Mrigesh%20koyande/OneDrive/Desktop/LexiGuard%20AI/LexiGuard-AI/BRAIN.md)** — Complete AI engine architecture, document parsing heuristics, grounding & clause traceability enforcement, TF-IDF grounded Q&A retrieval algorithm, prompt injection defense, contract diffing engine, and action brief generator.

---

## 🌟 Key Features

1. **Clause-Level Source Traceability (Core Differentiator)**
   - Every AI finding, risk alert, and monetary breakdown is mapped to a verified `sourceClauseId` and page number in the original contract.
   - Clicking any finding card auto-scrolls and illuminates the exact clause in the Document Viewer with gold glowing pulse highlights.

2. **Grounded Q&A ("Ask Lexi")**
   - Answers questions strictly using document clauses retrieved via keyword & TF-IDF relevance scoring ([`relevance.ts`](file:///c:/Users/Mrigesh%20koyande/OneDrive/Desktop/LexiGuard%20AI/LexiGuard-AI/server/src/utils/relevance.ts)).
   - Intercepts legal advice queries (e.g. *"Should I sign this?"*) with deterministic safety rules to refuse unauthorized practice of law safely.

3. **Prompt-Injection Defense & Zero-Retention Security**
   - Document text is encapsulated within protective `<document_content>` tags and treated strictly as untrusted evidence.
   - Stateless AI memory model guarantees no client document data is retained or used to train foundational AI models.

4. **Document Comparison (Clause Diffing)**
   - Upload or select two contracts to compute structured clause diffs (Added, Modified, Removed) with risk severity tags.

5. **Editorial Dark / Light Mode & Interactive Notification Hub**
   - Seamless toggling between **Midnight Luxury Dark Mode** (`#011826`) and **Editorial Warm Cream Light Mode** (`#F7F3EC`).
   - Warning signs, statutory disclaimers, and auto-renewal deadlines consolidated into an interactive slide-over Notification Hub.

6. **Interactive Pre-Signing Action Brief & Lawyer Consultation Prep**
   - Categorized checklists with persistent completion states in SQLite via Prisma.
   - Generates pointed questions and risk covenant citations for attorney meetings.

---

## 🐳 Docker Container Deployment (1-Command Launch)

LexiGuard AI is 100% container-ready with a multi-stage production build, non-root security runner, automatic SQLite schema migration, database seeding, and health checks.

### Option A: 1-Command Docker Compose (Recommended)
```bash
docker compose up -d
```
The application will automatically build, configure the SQLite database, seed the initial sample contracts, and become accessible at:
👉 **`http://localhost:5000`** (Frontend SPA & Backend API unified on port 5000)

View logs:
```bash
docker compose logs -f
```

Stop container:
```bash
docker compose down
```

### Option B: Build & Run Dockerfile Directly
```bash
# Build production multi-stage image
npm run docker:build
# or: docker build -t lexiguard-ai:latest .

# Run container with persistent volumes
docker run -d \
  -p 5000:5000 \
  --name lexiguard-app \
  -v lexiguard_data:/app/server/prisma \
  -v lexiguard_uploads:/app/server/uploads \
  lexiguard-ai:latest
```

---

## 🚀 Local Development Quickstart

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### 2. Installation
```bash
npm install
```

### 3. Database Setup & Demo Data Seeding
```bash
npm run seed
```
*Seeds `dev.db` with default demo user (`demo@lexiguard.ai` / `password123`) and pre-analyzed agreements.*

### 4. Start Local Development Servers
```bash
npm run dev
```
- **Client (Frontend)**: `http://localhost:5173`
- **Server (Backend API)**: `http://localhost:5000`

---

## ⚙️ Environment Configuration

Managed via `.env` (refer to `.env.example`):

```env
# Application Environment
NODE_ENV=production
PORT=5000
CLIENT_URL=http://localhost:5000

# Authentication & Database
JWT_SECRET=lexiguard_production_secret_key_change_in_production_32_chars_min
DATABASE_URL="file:./dev.db"

# AI Inference Provider:
# 'mock' (default, offline, zero-cost) | 'gemini' | 'anthropic' | 'real'
AI_PROVIDER=mock
GEMINI_API_KEY=
ANTHROPIC_API_KEY=
OPENAI_API_KEY=
```

---

## 🔒 Security Model & Safe Engineering Practices

1. **IDOR & Ownership Enforcement**: All document, analysis, Q&A, and action-brief routes strictly enforce `document.userId === req.user.id`.
2. **Magic Byte Binary Inspection**: Validates file headers (`%PDF-`, PK zip archive, UTF-8 text) to reject executable payloads (Windows PE `MZ`, Linux `ELF`).
3. **Non-Root Container Security**: Docker container runs as unprivileged user `lexiguard` (UID 1001) preventing container breakout.
4. **Cascading Deletions**: Deleting a document purges physical disk files and cascades database deletions across all relational models.
5. **Sanitized Error Responses**: Internal stack traces are hidden from public API responses.

---

## 🧪 Test Suite & Verification Results

```bash
# Run unit & integration tests
npm test
```

```text
 ✓ tests/ai_schema_validation.test.ts  (3 tests)
 ✓ tests/upload_validation.test.ts     (3 tests)
 ✓ tests/auth.test.ts                  (6 tests)
 ✓ tests/deletion_cascade.test.ts      (1 test)
 ✓ tests/prompt_injection.test.ts      (1 test)
 ✓ tests/ownership_idor.test.ts        (4 tests)
 ✓ tests/qna_grounding.test.ts         (3 tests)

 Test Files  7 passed (7)
      Tests  21 passed (21)
```

```bash
# Run full workspace typecheck
npm run typecheck
```
*Result: 0 errors across `@lexiguard/shared`, `@lexiguard/server`, and `@lexiguard/client`.*

---

## ⚖️ Legal Disclaimer

> **LexiGuard AI provides general legal information and document analysis. It does not provide legal advice or replace a qualified legal professional.**

# LexiGuard AI — Plain-English Legal Document Analysis & Grounded Traceability

> **LEGAL DISCLAIMER**: LexiGuard AI provides general legal information and document analysis. It does not provide legal advice or replace a qualified legal professional.

---

## 📖 Problem Statement

Legal agreements (employment contracts, NDAs, SaaS terms, leases) are filled with dense legalese, hidden auto-renewal traps, ambiguous obligations, and uncapped liabilities. Individuals and small business owners often sign contracts without understanding key terms, while hiring outside counsel for initial contract reviews is cost-prohibitive. Furthermore, generic AI chatbots frequently hallucinate non-existent clauses, invent legal remedies, or give confident but wrong legal conclusions.

---

## 💡 Solution

**LexiGuard AI** is a security-hardened, grounded AI assistant for legal document analysis. It translates complex legal jargon into clear, plain-English insights while maintaining **100% clause-level source traceability**. Rather than relying on black-box predictions, LexiGuard AI anchors every finding, obligation, financial term, and Q&A answer to verified clause character offsets and page numbers in your uploaded document. When evidence is missing, the system **abstains** cleanly instead of fabricating facts.

---

## ✨ Key Features

1. **100% Clause-Level Source Traceability (Core Differentiator)**
   - Every AI finding, risk alert, deadline, and financial breakdown is bound to a verified `sourceClauseId` and page number in the original contract.
   - Clicking **"View Source"** auto-scrolls the document viewer, centers the clause, and pulses a glowing gold highlight over the text.

2. **Grounded Q&A ("Ask Lexi")**
   - Answers questions strictly using candidate clauses retrieved via keyword and TF-IDF relevance scoring.
   - Intercepts advice-seeking queries (*"Should I sign this?"*) with deterministic safety rules to refuse unauthorized practice of law.

3. **Hallucination Prevention & Abstention Architecture**
   - Implements a strict abstention policy: if candidate clauses lack sufficient evidence, LexiGuard AI returns `"I couldn't find this information in the uploaded document"` with `supportStatus: "INSUFFICIENT EVIDENCE"`.

4. **Prompt Injection Defense**
   - All uploaded document text is encapsulated within protective `<document_content>` tags and treated strictly as untrusted data. Embedded injection commands (*"IGNORE PREVIOUS INSTRUCTIONS"*) are rendered inert.

5. **Contract Version Comparison (Clause Diffing)**
   - Computes side-by-side diffs (Added, Modified, Removed clauses) between contract revisions while highlighting factual changes without biased assumptions.

6. **Action Brief & Lawyer Consultation Dossier**
   - Generates actionable pre-signing checklists categorized into obligations, deadlines, monetary terms, and review areas with exact clause citations.

7. **Zero-Retention & Security Hardening**
   - Enforces strict user-level IDOR document isolation, file magic-byte validation, JWT authentication, and zero-retention stateless inference.

---

## 🏗️ Architecture

```
                 +---------------------------------------+
                 |            REACT CLIENT               |
                 | (TypeScript, Tailwind, Three.js 3D)   |
                 +---------------------------------------+
                                     |
                             REST API (JSON)
                                     |
                                     v
                 +---------------------------------------+
                 |            EXPRESS SERVER             |
                 | (Middleware, Auth, Multer, RateLimit) |
                 +---------------------------------------+
                                     |
          +--------------------------+--------------------------+
          |                          |                          |
          v                          v                          v
+------------------+       +------------------+       +-------------------+
| DOCUMENT SERVICE |       |   Q&A SERVICE    |       |  COMPARE SERVICE  |
|  (Parsing & DB)  |       | (Relevance & AI) |       |  (Clause Diffs)   |
+------------------+       +------------------+       +-------------------+
          |                          |                          |
          +--------------------------+--------------------------+
                                     |
                                     v
                 +---------------------------------------+
                 |           AI PROVIDER LAYER           |
                 |  (MockAIProvider / RealAIProvider)    |
                 +---------------------------------------+
                                     |
                                     v
                 +---------------------------------------+
                 |             PRISMA ORM                |
                 |          (SQLite Database)            |
                 +---------------------------------------+
```

---

## 🎯 AI Grounding Strategy

```
USER QUESTION
      ↓
DOCUMENT OWNERSHIP CHECK
      ↓
DOCUMENT RETRIEVAL
      ↓
TEXT / CLAUSE RETRIEVAL
      ↓
RELEVANCE FILTER (TF-IDF & Keyword Scoring)
      ↓
EVIDENCE VALIDATION (Threshold Check)
      ↓
LLM GENERATION (Isolated Prompt Context)
      ↓
STRUCTURED OUTPUT VALIDATION (Zod Runtime Validation)
      ↓
SOURCE VALIDATION (Verify Clause ID in DB)
      ↓
UNSUPPORTED CLAIM CHECK & SAFETY FILTER
      ↓
FINAL RESPONSE + SOURCE REFERENCES
```

---

## 🛡️ Hallucination Prevention

- **Grounding Rule:** Answers are generated strictly from candidate clauses retrieved from the user's uploaded document.
- **Literal Abstention Policy:** If candidate clauses lack evidence, the system returns `"I couldn't find this information in the uploaded document."`
- **Evidence Status Badges:** Instead of uncalibrated percentage confidence scores, LexiGuard AI displays three explicit evidence states:
  - `SUPPORTED` (✓ Verified source evidence)
  - `PARTIALLY SUPPORTED` (ℹ Partial candidate match)
  - `INSUFFICIENT EVIDENCE` (⚠ Fact absent from document)

---

## 🔒 Security

- **IDOR Protection:** Every document operation checks `doc.userId === req.user.id`.
- **Upload Security:** Enforces extension whitelisting (`.pdf`, `.docx`, `.txt`), magic-byte inspection (blocking Windows PE `MZ` and ELF binaries), and size limits (10 MB max).
- **Secret & Token Safety:** Tokens, passwords, and API keys are never logged or exposed in client responses.
- **XSS Prevention:** Document content is escaped via React DOM rendering, preventing HTML/script injection.

For full security policies, see [`SECURITY.md`](SECURITY.md).

---

## 🔑 Privacy

- **Zero Retention Policy:** Documents and user inferences are stored in isolated user accounts with strict database encryption and zero public training model exposure.
- **Local / Self-Hosted Support:** Full offline operation supported via `AI_PROVIDER=mock`.

---

## 🧪 Testing

The repository includes a multi-layered test suite built with Vitest and Supertest:

```bash
# Run all unit, integration, and security tests
npm test
```

### Test Suite Summary (31 Tests Passed):
- `hallucination_adversarial_suite.test.ts` (10 tests) — Abstention, fake clause refusal, external law non-fabrication, hypothetical handling, empty doc handling.
- `ownership_idor.test.ts` (4 tests) — Multi-tenant IDOR security validation.
- `upload_validation.test.ts` (3 tests) — Magic bytes & executable file rejections.
- `qna_grounding.test.ts` (3 tests) — Grounded retrieval & legal advice refusal heuristics.
- `auth.test.ts` (6 tests) — JWT authentication & registration constraints.
- `ai_schema_validation.test.ts` (3 tests) — Runtime Zod schema validation & recovery.
- `deletion_cascade.test.ts` (1 test) — Relational cascade deletions.
- `prompt_injection.test.ts` (1 test) — Malicious prompt instruction containment.

```bash
# Run TypeScript static check
npm run typecheck
```

---

## ♿ Accessibility

- **WCAG 2.2 AA Principles:** Focus indicators, semantic HTML elements, keyboard navigation, and ARIA attributes across drawers and modals.
- **Non-Color-Only Indicators:** Statuses rely on explicit icons (`✓`, `ℹ`, `!`) and text labels alongside color tokens.
- **Mobile Responsiveness:** Tested and responsive down to 390px screens.

---

## ⚡ Performance

- **Optimized Bundle:** Production build compiled via Vite with minification and dynamic chunk splitting.
- **3D WebGL Safety:** WebGL 3D LegalCore background scales down smoothly or falls back if WebGL is unsupported or reduced motion is requested.

---

## 🎮 Demo Mode

Evaluation judges can test the full capabilities of LexiGuard AI immediately via the **"Explore Interactive Demo"** button on the landing page, which automatically authenticates a demo account loaded with sample agreements (MSA, GDPR DPA, Term Sheet) without requiring an OpenAI API key.

---

## 💻 Tech Stack

- **Frontend:** React 18, TypeScript, Vite, TailwindCSS, Lucide React, Three.js
- **Backend:** Node.js, Express, TypeScript, Prisma ORM, SQLite
- **AI & Retrieval:** OpenAI API / Mock AI Provider, Zod Runtime Validation, TF-IDF Clause Retrieval
- **Testing:** Vitest, Supertest

---

## 🚀 Installation & Setup

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### 2. Install Dependencies
```bash
npm install
```

### 3. Database Migration & Seeding
```bash
npm run seed
```

### 4. Run Application
```bash
npm run dev
```
- **Frontend SPA:** `http://localhost:5173`
- **Backend API:** `http://localhost:5000`

---

## ⚙️ Environment Variables

Copy `.env.example` to `.env`:

```env
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173
JWT_SECRET=lexiguard_dev_secret_key_change_in_production_32_chars_min
DATABASE_URL="file:./dev.db"

# AI Provider Options: 'mock' (default) | 'real'
AI_PROVIDER=mock
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini
```

---

## 🔌 API Architecture

- `POST /api/auth/register` — User registration
- `POST /api/auth/login` — User authentication & JWT issuance
- `GET /api/documents` — List user's documents
- `GET /api/documents/:id` — Fetch document details, structure & findings
- `POST /api/documents/upload` — Secure file upload & automated AI analysis
- `DELETE /api/documents/:id` — Delete document and associated records
- `POST /api/documents/:id/qna` — Grounded Q&A ("Ask Lexi")
- `GET /api/documents/:id/action-brief` — Action Brief checklist items
- `POST /api/compare` — Compare two user documents

---

## 📁 Project Structure

```
LexiGuard-AI/
├── client/                     # React 18 SPA (Vite + TailwindCSS)
├── server/                     # Express REST API & Prisma ORM
│   ├── src/                    # Controllers, Services, AI Providers, Utils
│   ├── prisma/                 # Database Schema & Migrations
│   └── tests/                  # Vitest Test Suites
├── shared/                     # Shared Types & Zod Schemas
├── docs/                       # Architecture & AI Reliability Documentation
│   ├── AI-RELIABILITY.md       # AI Grounding & Hallucination Prevention Guide
│   └── ARCHITECTURE.md         # System Architecture & Diagram
├── SECURITY.md                 # Security Policies & Vulnerability Reporting
└── README.md                   # Project documentation
```

---

## ⚠️ Known Limitations

- **Image Scanned PDFs (OCR):** Currently supports text-selectable PDFs, DOCX, and TXT. Scanned image-only PDFs require pre-processing with external OCR tools.
- **Complex Table Structures:** Embedded nested tables are extracted into linear text paragraphs.

---

## ⚖️ Legal Disclaimer

**LexiGuard AI provides general legal information and document analysis. It does not provide legal advice or replace a qualified legal professional.**

---

## 🔮 Future Improvements

- **Native OCR Integration:** Tesseract/PDFocr pipeline for non-selectable scanned contracts.
- **Multi-Document Portfolio Chat:** Cross-referencing findings across an entire folder of vendor contracts simultaneously.
- **PDF Export Dossier:** One-click PDF generation of Lawyer Prep briefs for outside counsel consultations.

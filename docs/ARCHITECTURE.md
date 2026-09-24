# System Architecture — LexiGuard AI

LexiGuard AI is built as a multi-workspace monorepo containing modular layers with clear separation of concerns.

---

## 1. High-Level System Architecture Diagram

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

## 2. Directory Structure

```
LexiGuard-AI/
├── client/                     # React 18 frontend with Vite & TailwindCSS
│   ├── src/
│   │   ├── components/         # Reusable UI components (AskLexiDock, Viewer, 3D LegalCore)
│   │   ├── pages/              # Primary application views (Landing, Dashboard, Compare, ActionBrief)
│   │   ├── services/           # Centralized API client (`api.ts`)
│   │   └── types/              # Client state & navigation types
├── server/                     # Node.js + Express backend with TypeScript
│   ├── src/
│   │   ├── ai/                 # AI Provider implementations (Mock & Real OpenAI)
│   │   ├── controllers/        # Express route controllers
│   │   ├── db/                 # Prisma database instance singleton
│   │   ├── middleware/         # Auth, Upload, Rate Limiting, Error handling
│   │   ├── routes/             # API route definitions
│   │   ├── services/           # Business logic & domain services
│   │   └── utils/              # Safety filters, TF-IDF scoring, parsers
│   ├── prisma/                 # Prisma schema & SQLite migrations
│   └── tests/                  # Automated integration & unit test suites (Vitest + Supertest)
├── shared/                     # Shared TypeScript types, schemas & legal disclaimer constant
├── docs/                       # Architecture & AI Reliability Documentation
├── SECURITY.md                 # Security policies & IDOR documentation
└── README.md                   # Hackathon project overview & installation guide
```

---

## 3. Data Flow & Source Traceability

1. **Document Upload:** The user uploads a `.pdf`, `.docx`, or `.txt` file. `DocumentExtractionService` parses text into sections and clauses with start/end character offsets and page numbers.
2. **Clause Persistence:** Sections and clauses are saved into the SQLite database via Prisma.
3. **AI Analysis:** `DocumentAnalysisService` sends structured clauses to `AIProvider`, extracting 7 categorized findings with valid `sourceClauseId` references.
4. **Source Traceability UI:** When a user clicks **"View Source"** on any finding or Q&A response, the client receives the `sourceClauseId`, centers the clause in the document viewer, and pulses a gold focus indicator over the exact text.

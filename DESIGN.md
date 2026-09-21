# LexiGuard AI — System Design & UI/UX Architectural Specification (`DESIGN.md`)

> **LEGAL DISCLAIMER**: LexiGuard AI provides general legal information and document analysis. It does not provide legal advice or replace a qualified legal professional.

This document details the visual design system, UI/UX interaction architecture, component hierarchy, state management, API endpoint contracts, and database schema specification for **LexiGuard AI**.

---

## 🎨 1. Visual Design System & Aesthetics

LexiGuard AI uses a dark-themed visual language built with **Tailwind CSS** and **Vanilla CSS custom utilities** ([`index.css`](file:///c:/Users/Mrigesh%20koyande/OneDrive/Desktop/LexiGuard%20AI/LexiGuard-AI/client/src/index.css)). The layout emphasizes visual hierarchy, readability, and immediate clause traceability.

### 1.1 Color Palette Tokens

| Category | Tailwind Class / Hex | Usage / Purpose |
| :--- | :--- | :--- |
| **Canvas Background** | `bg-slate-950` (`#020617`) | Main application viewport backdrop |
| **Surface Cards** | `bg-slate-900/80` (`#0f172a`) | Glassmorphic card containers with `backdrop-blur-md` |
| **Primary Accent** | `bg-indigo-600` / `text-indigo-400` | Primary action buttons, active navigation states, key highlights |
| **Secondary Accent** | `bg-cyan-600` / `text-cyan-400` | Interactive docks, grounded Q&A elements, badges |
| **Border / Dividers** | `border-slate-800/80` | Glassmorphic hairline borders (`border border-slate-800`) |

### 1.2 Severity Indicator System

AI findings and contract risk items use strict visual coding:

| Severity Level | Color Token | Badge Style | Border & Highlight Accent |
| :--- | :--- | :--- | :--- |
| **`Informational`** | `emerald` | `bg-emerald-500/10 text-emerald-400 border-emerald-500/30` | Subtle green border |
| **`Review`** | `amber` | `bg-amber-500/10 text-amber-400 border-amber-500/30` | Warm amber focus highlight |
| **`Important`** | `rose` | `bg-rose-500/10 text-rose-400 border-rose-500/30` | Red border alert with glowing shadow |

### 1.3 Glassmorphism & Custom CSS Utilities

```css
/* Glassmorphism panel base */
.glass-panel {
  background: rgba(15, 23, 42, 0.75);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(51, 65, 85, 0.5);
}

/* Clause highlight auto-scroll animation */
.clause-highlight-pulse {
  animation: pulseHighlight 2s ease-in-out infinite;
}

@keyframes pulseHighlight {
  0%, 100% { background-color: rgba(99, 102, 241, 0.15); border-color: rgba(99, 102, 241, 0.8); }
  50% { background-color: rgba(245, 158, 11, 0.25); border-color: rgba(245, 158, 11, 0.9); }
}
```

---

## 🖥️ 2. Split-Screen Interactive Workspace

The core workspace view ([`WorkspacePage.tsx`](file:///c:/Users/Mrigesh%20koyande/OneDrive/Desktop/LexiGuard%20AI/LexiGuard-AI/client/src/pages/WorkspacePage.tsx)) features a dual-pane layout designed for side-by-side analysis and verification:

```
+-----------------------------------------------------------------------------------+
| Navbar: LexiGuard AI | Dashboard | Compare | Action Brief | Logout                |
+-----------------------------------------------------------------------------------+
| Disclaimer Banner: LexiGuard AI provides general legal information...             |
+---------------------------------------------------+-------------------------------+
| LEFT PANE: Document Viewer (60% width)            | RIGHT PANE: Insights (40%)    |
| - Header: Filename, Document Type, Page Selector | - Tab Bar:                    |
| - Scrollable Clause List                          |   [Summary|Important|Oblig...]|
| - Auto-scroll Target: Clause 3.2 [SELECTED]       | - Finding Cards (Categorized) |
|   -> Highlighted with Amber/Indigo Pulsing Border  |   - Title & Severity Badge    |
|   -> Source Badge: "Clause 3.2 - Page 2"          |   - Explanation & Why It...   |
|                                                   |   - Click -> Scrolls Left Pane|
+---------------------------------------------------+-------------------------------+
| FLOATING DOCK: Ask Lexi (Grounded Q&A input & drawer)                             |
+-----------------------------------------------------------------------------------+
```

### 2.1 Traceability Deep-Linking Flow

1. User clicks a finding card in the right **Insights Panel** ([`InsightsPanel.tsx`](file:///c:/Users/Mrigesh%20koyande/OneDrive/Desktop/LexiGuard%20AI/LexiGuard-AI/client/src/components/InsightsPanel.tsx)).
2. `onSelectClause(sourceClauseId)` fires, setting `selectedClauseId` in workspace state.
3. **Document Viewer** ([`DocumentViewer.tsx`](file:///c:/Users/Mrigesh%20koyande/OneDrive/Desktop/LexiGuard%20AI/LexiGuard-AI/client/src/components/DocumentViewer.tsx)) detects `selectedClauseId` change via `useEffect`.
4. `document.getElementById('clause-' + clauseId)?.scrollIntoView({ behavior: 'smooth', block: 'center' })` executes.
5. Target clause element applies `.clause-highlight-pulse` CSS animation to draw immediate visual attention.

---

## 🏗️ 3. Component Tree & Navigation Hierarchy

### 3.1 Route Mapping

| Path | View Component | Auth Required | Purpose |
| :--- | :--- | :--- | :--- |
| `/` | [`LandingPage.tsx`](file:///c:/Users/Mrigesh%20koyande/OneDrive/Desktop/LexiGuard%20AI/LexiGuard-AI/client/src/pages/LandingPage.tsx) | Public | Hero overview, key differentiators, call to action |
| `/login` | [`LoginPage.tsx`](file:///c:/Users/Mrigesh%20koyande/OneDrive/Desktop/LexiGuard%20AI/LexiGuard-AI/client/src/pages/LoginPage.tsx) | Public | JWT Authentication login form |
| `/register` | [`RegisterPage.tsx`](file:///c:/Users/Mrigesh%20koyande/OneDrive/Desktop/LexiGuard%20AI/LexiGuard-AI/client/src/pages/RegisterPage.tsx) | Public | Account creation form |
| `/dashboard` | [`DashboardPage.tsx`](file:///c:/Users/Mrigesh%20koyande/OneDrive/Desktop/LexiGuard%20AI/LexiGuard-AI/client/src/pages/DashboardPage.tsx) | Private | Document library, status overview, upload modal launcher |
| `/workspace/:id` | [`WorkspacePage.tsx`](file:///c:/Users/Mrigesh%20koyande/OneDrive/Desktop/LexiGuard%20AI/LexiGuard-AI/client/src/pages/WorkspacePage.tsx) | Private | Interactive split-screen document viewer & AI insights |
| `/compare` | [`ComparePage.tsx`](file:///c:/Users/Mrigesh%20koyande/OneDrive/Desktop/LexiGuard%20AI/LexiGuard-AI/client/src/pages/ComparePage.tsx) | Private | Dual-contract selector & structured clause diff viewer |
| `/action-brief/:id` | [`ActionBriefPage.tsx`](file:///c:/Users/Mrigesh%20koyande/OneDrive/Desktop/LexiGuard%20AI/LexiGuard-AI/client/src/pages/ActionBriefPage.tsx) | Private | Pre-signing checklist with persistent state & print CSS |

### 3.2 Component Hierarchy Diagram

```
App.tsx (Router & AuthProvider context)
│
├── Navbar.tsx (Navigation links, User profile menu, Logout)
├── DisclaimerBanner.tsx (Sticky top legal warning banner)
│
├── Pages
│   ├── LandingPage.tsx
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── DashboardPage.tsx
│   │   └── UploadModal.tsx (File drag-and-drop & validation)
│   ├── WorkspacePage.tsx
│   │   ├── DocumentViewer.tsx (Clause list & auto-scroll highlight)
│   │   ├── InsightsPanel.tsx (Categorized finding cards & tabs)
│   │   └── AskLexiDock.tsx (Grounded Q&A interface & advice hedge)
│   ├── ComparePage.tsx (Side-by-side contract diffing)
│   └── ActionBriefPage.tsx (Categorized checklist & print mode)
```

---

## 🔌 4. Backend API Endpoint Specifications

All endpoints under `/api` require JSON body payloads (unless multipart upload) and return standard JSON error payload shapes: `{ "error": "Descriptive message" }`. Authentication is enforced via httpOnly cookie or `Authorization: Bearer <token>`.

### 4.1 Authentication Endpoints (`/api/auth`)

- `POST /api/auth/register` — Creates user account with bcrypt password hashing (10 rounds).
  - Body: `{ "email": "user@example.com", "password": "secretpassword", "name": "User Name" }`
  - Response: `{ "user": { "id": "...", "email": "...", "name": "..." }, "token": "..." }`
- `POST /api/auth/login` — Authenticates credentials and sets httpOnly JWT cookie.
  - Body: `{ "email": "user@example.com", "password": "secretpassword" }`
- `POST /api/auth/logout` — Clears httpOnly JWT cookie.
- `GET /api/auth/me` — Returns current authenticated user profile.

### 4.2 Document Management (`/api/documents`)

- `POST /api/documents/upload` — Multipart form file upload (`.pdf`, `.docx`, `.txt`).
  - Validation: Inspects binary magic bytes, limits file size to 15MB.
  - Returns: `DocumentSummary` object with status `PROCESSING` / `ANALYZED`.
- `GET /api/documents` — Lists all documents owned by authenticated user.
- `GET /api/documents/:id` — Fetches full document structure, sections, and clauses.
- `DELETE /api/documents/:id` — Deletes document, storage file, and all cascaded database entities.

### 4.3 AI Analysis & Q&A (`/api/analysis` & `/api/qna`)

- `GET /api/analysis/:documentId` — Returns cached structured `AnalysisResult` for a document.
- `POST /api/qna/:documentId` — Submits grounded question to "Ask Lexi".
  - Body: `{ "question": "What is the probation period?" }`
  - Response: `QuestionResponse` containing `answer`, `sourceClauseIds`, `confidence`, `isDeclinedAdvice`.

### 4.4 Contract Comparison & Action Brief (`/api/comparison` & `/api/action-brief`)

- `POST /api/comparison` — Compares two documents owned by user.
  - Body: `{ "docAId": "doc-1", "docBId": "doc-2" }`
  - Response: `ComparisonResult` containing array of `ComparisonRecord` (`added`, `modified`, `removed`).
- `GET /api/action-brief/:documentId` — Fetches or generates categorized pre-signing action items.
- `PATCH /api/action-brief/item/:itemId` — Updates persistent completion checkbox state (`isCompleted`).

---

## 🗄️ 5. Database ER Schema Specification

LexiGuard AI uses **Prisma ORM** with **SQLite** (`dev.db`). The schema enforces foreign key constraints and cascade deletions across all relations:

```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id        String     @id @default(uuid())
  email     String     @unique
  password  String
  name      String
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
  documents Document[]
}

model Document {
  id               String        @id @default(uuid())
  userId           String
  user             User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  title            String
  originalFilename String
  storagePath      String
  mimeType         String
  fileSize         Int
  pageCount        Int           @default(1)
  status           String        @default("PENDING") // PENDING, PROCESSING, ANALYZED, ERROR
  errorMessage     String?
  createdAt        DateTime      @default(now())
  updatedAt        DateTime      @updatedAt
  sections         Section[]
  analysis         Analysis?
  qnaRecords       QnARecord[]
  actionItems      ActionItem[]
}

model Section {
  id         String   @id @default(uuid())
  documentId String
  document   Document @relation(fields: [documentId], references: [id], onDelete: Cascade)
  title      String
  orderIndex Int
  clauses    Clause[]
}

model Clause {
  id          String   @id @default(uuid())
  sectionId   String
  section     Section  @relation(fields: [sectionId], references: [id], onDelete: Cascade)
  number      String
  title       String
  text        String
  page        Int      @default(1)
  startOffset Int      @default(0)
  endOffset   Int      @default(0)
  orderIndex  Int
}

model Analysis {
  id                 String    @id @default(uuid())
  documentId         String    @unique
  document           Document  @relation(fields: [documentId], references: [id], onDelete: Cascade)
  summary            String
  documentType       String
  missingInformation String    // Stored as JSON string
  createdAt          DateTime  @default(now())
  findings           Finding[]
}

model Finding {
  id             String   @id @default(uuid())
  analysisId     String
  analysis       Analysis @relation(fields: [analysisId], references: [id], onDelete: Cascade)
  title          String
  category       String
  severity       String   // Informational, Review, Important
  explanation    String
  whyItMatters   String
  sourceClauseId String
  pageNumber     Int      @default(1)
  confidence     Float    @default(0.95)
}

model QnARecord {
  id               String   @id @default(uuid())
  documentId       String
  document         Document @relation(fields: [documentId], references: [id], onDelete: Cascade)
  userId           String
  question         String
  answer           String
  sourceClauseIds  String   // Stored as JSON array string
  confidence       Float
  isDeclinedAdvice Boolean  @default(false)
  createdAt        DateTime @default(now())
}

model ActionItem {
  id             String   @id @default(uuid())
  documentId     String
  document       Document @relation(fields: [documentId], references: [id], onDelete: Cascade)
  userId         String
  category       String
  title          String
  description    String
  isCompleted    Boolean  @default(false)
  priority       String   @default("Medium") // High, Medium, Low
  sourceClauseId String?
  createdAt      DateTime @default(now())
}

model Comparison {
  id        String   @id @default(uuid())
  userId    String
  docAId    String
  docBId    String
  summary   String
  records   String   // Stored as JSON string of ComparisonRecord[]
  createdAt DateTime @default(now())
}
```

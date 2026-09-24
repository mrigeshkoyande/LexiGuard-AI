import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { DocumentStructure } from '@lexiguard/shared';
import { MockAIProvider } from '../src/ai/MockAIProvider';

dotenv.config();
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'file:./dev.db';
}

const prisma = new PrismaClient();
const mockAI = new MockAIProvider();

const SAMPLE_DOC_TEXT = `EMPLOYMENT AGREEMENT (SAMPLE DEMONSTRATION)
NOTICE: Fictional demonstration document — not legal advice.

SECTION 1: APPOINTMENT & TERM
1.1 Position and Duties
The Company hereby employs the Executive as Principal Legal Technologist, and the Executive accepts such employment. The Executive shall report directly to the Chief Technology Officer and perform all customary duties commensurate with this role with full fidelity and best efforts.

1.2 Term and Probationary Period
Employment shall commence on the Effective Date. The first ninety (90) calendar days of employment shall constitute a Probationary Period. During the Probationary Period, either party may terminate this Agreement upon providing fourteen (14) calendar days' advance written notice. Following successful completion of the Probationary Period, standard termination provisions shall apply.

SECTION 2: COMPENSATION & BENEFITS
2.1 Base Salary
The Company shall pay Executive an initial annual base salary of $145,000 USD, payable in accordance with the Company's standard semi-monthly payroll schedule, subject to applicable statutory tax withholdings.

2.2 Performance Bonus & Equity
Executive shall be eligible for an annual discretionary incentive bonus with an annualized target of 15% of Base Salary, contingent upon company-wide performance milestones and individual KPIs. Additionally, Executive shall receive an option grant of 15,000 common stock options vesting over a standard four-year schedule with a one-year cliff.

2.3 Paid Leave and Vacations
Executive shall accrue twenty (20) business days of paid vacation per calendar year, in addition to standard observed company holidays and up to ten (10) days of statutory medical sick leave.

SECTION 3: TERMINATION & NOTICE
3.1 Termination Without Cause
Either party may terminate this Agreement without cause at any time following the Probationary Period by delivering at least thirty (30) days' advance written notice to the other party. The Company reserves the right to provide salary in lieu of notice.

3.2 Termination For Cause
The Company may terminate Executive's employment immediately without notice or severance pay in the event of Gross Misconduct, conviction of a felony, intentional material breach of this Agreement, or fraud.

SECTION 4: RESTRICTIVE COVENANTS & INTELLECTUAL PROPERTY
4.1 Confidentiality Safeguards
Executive acknowledges that during employment they will have access to proprietary trade secrets, customer lists, algorithms, and confidential financial information. Executive covenants never to disclose, publish, or use any Confidential Information outside authorized Company business, both during and indefinitely after the term of employment.

4.2 Intellectual Property & Inventions Assignment
Executive agrees that all inventions, software code, legal prompt designs, patents, and copyrightable works created or conceived during the period of employment that relate to the Company's current or prospective business shall be the sole and exclusive property of the Company as works made for hire.

4.3 Non-Solicitation Covenant
For a period of twelve (12) consecutive months following the termination of employment for any reason, Executive shall not directly or indirectly solicit, recruit, or entice away any employee, contractor, or active client of the Company.

SECTION 5: GENERAL PROVISIONS
5.1 Term and Automatic Renewal
This Agreement shall remain in effect for an initial period of twelve (12) months from the Effective Date and shall automatically renew for successive one (1) year periods unless either party provides written notice of non-renewal at least sixty (60) days prior to expiration.

5.2 Dispute Resolution & Governing Law
This Agreement shall be governed by and construed in accordance with the laws of the State of Delaware without regard to conflicts of law principles. Any dispute arising under this Agreement shall be resolved exclusively through final and binding arbitration administered by the American Arbitration Association (AAA) in Wilmington, Delaware.
`;

async function main() {
  console.log('[Seed] Starting database seed...');

  // Ensure uploads dir exists
  const uploadDir = path.resolve(__dirname, '../uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const sampleFilePath = path.join(uploadDir, 'demo_employment_agreement.txt');
  fs.writeFileSync(sampleFilePath, SAMPLE_DOC_TEXT);

  // 1. Create Demo User
  const passwordHash = await bcrypt.hash('password123', 10);
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@lexiguard.ai' },
    update: {
      passwordHash,
      name: 'Alex Morgan'
    },
    create: {
      email: 'demo@lexiguard.ai',
      passwordHash,
      name: 'Alex Morgan'
    }
  });

  console.log(`[Seed] Demo User ready: ${demoUser.email} (password: password123)`);

  // Delete existing demo documents for clean re-seeding
  const existingDocs = await prisma.document.findMany({
    where: { userId: demoUser.id, title: 'Employment Agreement — Example' }
  });
  for (const d of existingDocs) {
    await prisma.document.delete({ where: { id: d.id } });
  }

  // 2. Create Document
  const doc = await prisma.document.create({
    data: {
      userId: demoUser.id,
      title: 'Employment Agreement — Example',
      originalFilename: 'demo_employment_agreement.txt',
      mimeType: 'text/plain',
      fileSize: Buffer.byteLength(SAMPLE_DOC_TEXT),
      filePath: sampleFilePath,
      pageCount: 2,
      status: 'ANALYZED'
    }
  });

  // 3. Create Sections and Clauses
  const rawSections = [
    {
      title: 'SECTION 1: APPOINTMENT & TERM',
      clauses: [
        {
          number: '1.1',
          title: 'Position and Duties',
          text: 'The Company hereby employs the Executive as Principal Legal Technologist, and the Executive accepts such employment. The Executive shall report directly to the Chief Technology Officer and perform all customary duties commensurate with this role with full fidelity and best efforts.',
          page: 1
        },
        {
          number: '1.2',
          title: 'Term and Probationary Period',
          text: 'Employment shall commence on the Effective Date. The first ninety (90) calendar days of employment shall constitute a Probationary Period. During the Probationary Period, either party may terminate this Agreement upon providing fourteen (14) calendar days\' advance written notice. Following successful completion of the Probationary Period, standard termination provisions shall apply.',
          page: 1
        }
      ]
    },
    {
      title: 'SECTION 2: COMPENSATION & BENEFITS',
      clauses: [
        {
          number: '2.1',
          title: 'Base Salary',
          text: 'The Company shall pay Executive an initial annual base salary of $145,000 USD, payable in accordance with the Company\'s standard semi-monthly payroll schedule, subject to applicable statutory tax withholdings.',
          page: 1
        },
        {
          number: '2.2',
          title: 'Performance Bonus & Equity',
          text: 'Executive shall be eligible for an annual discretionary incentive bonus with an annualized target of 15% of Base Salary, contingent upon company-wide performance milestones and individual KPIs. Additionally, Executive shall receive an option grant of 15,000 common stock options vesting over a standard four-year schedule with a one-year cliff.',
          page: 1
        },
        {
          number: '2.3',
          title: 'Paid Leave and Vacations',
          text: 'Executive shall accrue twenty (20) business days of paid vacation per calendar year, in addition to standard observed company holidays and up to ten (10) days of statutory medical sick leave.',
          page: 1
        }
      ]
    },
    {
      title: 'SECTION 3: TERMINATION & NOTICE',
      clauses: [
        {
          number: '3.1',
          title: 'Termination Without Cause',
          text: 'Either party may terminate this Agreement without cause at any time following the Probationary Period by delivering at least thirty (30) days\' advance written notice to the other party. The Company reserves the right to provide salary in lieu of notice.',
          page: 2
        },
        {
          number: '3.2',
          title: 'Termination For Cause',
          text: 'The Company may terminate Executive\'s employment immediately without notice or severance pay in the event of Gross Misconduct, conviction of a felony, intentional material breach of this Agreement, or fraud.',
          page: 2
        }
      ]
    },
    {
      title: 'SECTION 4: RESTRICTIVE COVENANTS & INTELLECTUAL PROPERTY',
      clauses: [
        {
          number: '4.1',
          title: 'Confidentiality Safeguards',
          text: 'Executive acknowledges that during employment they will have access to proprietary trade secrets, customer lists, algorithms, and confidential financial information. Executive covenants never to disclose, publish, or use any Confidential Information outside authorized Company business, both during and indefinitely after the term of employment.',
          page: 2
        },
        {
          number: '4.2',
          title: 'Intellectual Property & Inventions Assignment',
          text: 'Executive agrees that all inventions, software code, legal prompt designs, patents, and copyrightable works created or conceived during the period of employment that relate to the Company\'s current or prospective business shall be the sole and exclusive property of the Company as works made for hire.',
          page: 2
        },
        {
          number: '4.3',
          title: 'Non-Solicitation Covenant',
          text: 'For a period of twelve (12) consecutive months following the termination of employment for any reason, Executive shall not directly or indirectly solicit, recruit, or entice away any employee, contractor, or active client of the Company.',
          page: 2
        }
      ]
    },
    {
      title: 'SECTION 5: GENERAL PROVISIONS',
      clauses: [
        {
          number: '5.1',
          title: 'Term and Automatic Renewal',
          text: 'This Agreement shall remain in effect for an initial period of twelve (12) months from the Effective Date and shall automatically renew for successive one (1) year periods unless either party provides written notice of non-renewal at least sixty (60) days prior to expiration.',
          page: 2
        },
        {
          number: '5.2',
          title: 'Dispute Resolution & Governing Law',
          text: 'This Agreement shall be governed by and construed in accordance with the laws of the State of Delaware without regard to conflicts of law principles. Any dispute arising under this Agreement shall be resolved exclusively through final and binding arbitration administered by the American Arbitration Association (AAA) in Wilmington, Delaware.',
          page: 2
        }
      ]
    }
  ];

  const struct: DocumentStructure = { sections: [] };

  for (let sIdx = 0; sIdx < rawSections.length; sIdx++) {
    const s = rawSections[sIdx];
    const dbSection = await prisma.documentSection.create({
      data: {
        documentId: doc.id,
        title: s.title,
        orderIndex: sIdx
      }
    });

    const clausesList = [];
    for (const c of s.clauses) {
      const dbClause = await prisma.documentClause.create({
        data: {
          documentId: doc.id,
          sectionId: dbSection.id,
          number: c.number,
          title: c.title,
          text: c.text,
          page: c.page,
          startOffset: 0,
          endOffset: c.text.length
        }
      });
      clausesList.push({
        id: dbClause.id,
        number: dbClause.number,
        title: dbClause.title,
        text: dbClause.text,
        page: dbClause.page,
        startOffset: dbClause.startOffset,
        endOffset: dbClause.endOffset
      });
    }

    struct.sections.push({
      id: dbSection.id,
      title: dbSection.title,
      clauses: clausesList
    });
  }

  // 4. Run Mock Analysis to generate structured findings and persist
  const analysisResult = await mockAI.analyzeDocument(struct);

  const dbAnalysis = await prisma.analysis.create({
    data: {
      documentId: doc.id,
      summary: analysisResult.summary,
      documentType: analysisResult.documentType,
      missingInfoJson: JSON.stringify(analysisResult.missingInformation)
    }
  });

  const allFindings = [
    ...analysisResult.importantClauses,
    ...analysisResult.obligations,
    ...analysisResult.deadlines,
    ...analysisResult.monetaryTerms,
    ...analysisResult.terminationTerms,
    ...analysisResult.renewalTerms,
    ...analysisResult.potentialConcerns
  ];

  for (const f of allFindings) {
    await prisma.finding.create({
      data: {
        analysisId: dbAnalysis.id,
        documentId: doc.id,
        sourceClauseId: f.sourceClauseId,
        category: f.category,
        severity: f.severity,
        title: f.title,
        explanation: f.explanation,
        whyItMatters: f.whyItMatters,
        pageNumber: f.pageNumber,
        confidence: f.confidence
      }
    });
  }

  // 5. Seed Action Items
  const actionItemsData = [
    {
      category: 'Document Overview',
      title: 'Confirm Employer Entity & Start Date',
      description: 'Ensure the legal name of the employing entity and the Effective Date match your offer letter.',
      priority: 'High'
    },
    {
      category: 'Financial Terms',
      title: 'Validate $145,000 Base Salary & 15% Bonus Scheme',
      description: 'Confirm semi-monthly payment schedule and review KPI conditions required for bonus eligibility.',
      priority: 'High'
    },
    {
      category: 'Important Dates',
      title: 'Mark 90-Day Probation & 60-Day Renewal Deadlines',
      description: 'Add a calendar alert 60 days before the annual term ends to evaluate renewal or non-renewal.',
      priority: 'High'
    },
    {
      category: 'Review Areas',
      title: 'Review 12-Month Non-Solicitation & IP Assignment Scope',
      description: 'Assess whether the broad assignment of inventions affects any personal outside projects or open source contributions.',
      priority: 'Important'
    },
    {
      category: 'Questions for a Lawyer',
      title: 'Consult on Delaware Arbitration Clause',
      description: 'Verify if mandatory binding arbitration in Delaware is standard and acceptable for your jurisdiction.',
      priority: 'Medium'
    }
  ];

  for (const item of actionItemsData) {
    await prisma.actionItem.create({
      data: {
        documentId: doc.id,
        userId: demoUser.id,
        category: item.category,
        title: item.title,
        description: item.description,
        priority: item.priority,
        isCompleted: false
      }
    });
  }

  console.log('[Seed] Database seeded successfully with demo user, document, and analyzed findings!');
}

main()
  .catch((e) => {
    console.error('[Seed Error]', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

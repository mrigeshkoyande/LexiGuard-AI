import { LEGAL_DISCLAIMER } from '@lexiguard/shared';

// Regular expressions to detect advice-seeking questions like "Should I sign this?"
const ADVICE_SEEKING_PATTERNS = [
  /should\s+(i|we)\s+sign\b/i,
  /is\s+it\s+safe\s+to\s+sign\b/i,
  /would\s+you\s+sign\s+this\b/i,
  /do\s+you\s+recommend\s+signing\b/i,
  /can\s+i\s+sign\s+this\b/i,
  /tell\s+me\s+if\s+i\s+should\s+accept\b/i,
  /should\s+i\s+agree\s+to\s+this\b/i
];

export function isAdviceSeekingQuestion(question: string): boolean {
  return ADVICE_SEEKING_PATTERNS.some((pattern) => pattern.test(question));
}

export const DECLINED_ADVICE_RESPONSE =
  `As an AI document assistant, I cannot provide legal advice or advise you on whether or not to sign this agreement. ` +
  `However, you can review the key findings, obligations, monetary terms, and potential review items highlighted in the insights panel. ` +
  `For personalized advice tailored to your situation, please consult a qualified attorney or legal professional.`;

/**
 * Wraps document content in protective untrusted tags to defend against prompt injection.
 */
export function formatDocumentPromptContext(rawContent: string): string {
  // Sanitize any stray closing tags inside content
  const sanitized = rawContent.replace(/<\/document_content>/gi, '[end_doc_tag]');
  return `\n<document_content>\n${sanitized}\n</document_content>\n`;
}

/**
 * Post-generation safety filter to hedge definitive legal conclusions.
 * Ensures terms like "illegal", "unenforceable" are softened to informational analysis.
 */
export function sanitizeSafetyOutput(text: string): string {
  if (!text) return text;

  let sanitized = text;

  const replacements: [RegExp, string][] = [
    [/\bthis\s+is\s+illegal\b/gi, 'this may warrant legal review under governing regulations'],
    [/\bis\s+illegal\b/gi, 'may raise legal questions'],
    [/\bthis\s+is\s+unenforceable\b/gi, 'this may be subject to review regarding enforceability in some jurisdictions'],
    [/\bis\s+unenforceable\b/gi, 'may face enforceability questions depending on jurisdiction'],
    [/\bunlawful\b/gi, 'potentially non-standard'],
    [/\bvoid\s+and\s+null\b/gi, 'subject to legal challenge'],
    [/\bnull\s+and\s+void\b/gi, 'subject to legal review']
  ];

  for (const [pattern, replacement] of replacements) {
    sanitized = sanitized.replace(pattern, replacement);
  }

  return sanitized;
}

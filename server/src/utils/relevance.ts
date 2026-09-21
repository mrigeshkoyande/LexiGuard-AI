import { DocumentClause } from '@lexiguard/shared';

// Common English stopwords to filter out for better semantic relevance
const STOPWORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'aren\'t',
  'as', 'at', 'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by',
  'can', 'could', 'did', 'do', 'does', 'doing', 'down', 'during', 'each', 'few', 'for', 'from',
  'further', 'had', 'has', 'have', 'having', 'he', 'her', 'here', 'hers', 'herself', 'him', 'himself',
  'his', 'how', 'i', 'if', 'in', 'into', 'is', 'isn\'t', 'it', 'it\'s', 'its', 'itself', 'just',
  'me', 'more', 'most', 'my', 'myself', 'no', 'nor', 'not', 'now', 'of', 'off', 'on', 'once', 'only',
  'or', 'other', 'our', 'ours', 'ourselves', 'out', 'over', 'own', 'same', 'she', 'should', 'so',
  'some', 'such', 'than', 'that', 'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there',
  'these', 'they', 'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was',
  'we', 'were', 'what', 'when', 'where', 'which', 'while', 'who', 'whom', 'why', 'with', 'would',
  'you', 'your', 'yours', 'yourself', 'yourselves'
]);

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOPWORDS.has(w));
}

export interface ScoredClause {
  clause: DocumentClause;
  score: number;
}

/**
 * Calculates relevance score between a query and a set of document clauses using TF-IDF / term overlap.
 */
export function scoreClausesForQuery(
  query: string,
  clauses: DocumentClause[],
  topK: number = 4
): ScoredClause[] {
  const queryTokens = tokenize(query);
  if (queryTokens.length === 0 || clauses.length === 0) {
    return [];
  }

  // Document Frequency (DF) across clauses
  const docCount = clauses.length;
  const dfMap = new Map<string, number>();

  const tokenizedClauses = clauses.map((clause) => {
    const tokens = tokenize(`${clause.title} ${clause.text}`);
    const uniqueTokens = new Set(tokens);
    uniqueTokens.forEach((token) => {
      dfMap.set(token, (dfMap.get(token) || 0) + 1);
    });
    return { clause, tokens };
  });

  const scored: ScoredClause[] = tokenizedClauses.map(({ clause, tokens }) => {
    let score = 0;
    const tfMap = new Map<string, number>();

    tokens.forEach((t) => {
      tfMap.set(t, (tfMap.get(t) || 0) + 1);
    });

    queryTokens.forEach((qt) => {
      const tf = tfMap.get(qt) || 0;
      if (tf > 0) {
        const df = dfMap.get(qt) || 1;
        const idf = Math.log((docCount + 1) / (df + 0.5)) + 1;
        score += (tf / tokens.length) * idf * 10;

        // Boost if term appears in clause title
        if (clause.title.toLowerCase().includes(qt)) {
          score += 5;
        }
      }
    });

    return { clause, score };
  });

  // Filter clauses with positive score and sort descending
  return scored
    .filter((item) => item.score > 0.05)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}

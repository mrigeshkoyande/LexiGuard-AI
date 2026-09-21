import {
  ActionBrief,
  ActionItemRecord,
  AnalysisResult,
  ComparisonResult,
  DocumentSummary,
  QuestionResponse,
  UserProfile
} from '@lexiguard/shared';

const BASE_URL = '/api';

class ApiClient {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('lexiguard_token');
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('lexiguard_token', token);
    } else {
      localStorage.removeItem('lexiguard_token');
    }
  }

  getToken(): string | null {
    return this.token;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string>)
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
      credentials: 'include'
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMsg = data.error || `HTTP error ${response.status}`;
      throw new Error(errorMsg);
    }

    return data as T;
  }

  // Auth endpoints
  async register(params: { email: string; password: string; name: string }) {
    const res = await this.request<{ user: UserProfile; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(params)
    });
    this.setToken(res.token);
    return res;
  }

  async login(params: { email: string; password: string }) {
    const res = await this.request<{ user: UserProfile; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(params)
    });
    this.setToken(res.token);
    return res;
  }

  async logout() {
    await this.request<{ message: string }>('/auth/logout', { method: 'POST' }).catch(() => {});
    this.setToken(null);
  }

  async getCurrentUser() {
    return this.request<{ user: UserProfile }>('/auth/me');
  }

  // Document endpoints
  async listDocuments() {
    return this.request<{ documents: DocumentSummary[] }>('/documents');
  }

  async getDocument(id: string) {
    return this.request<{ document: any }>(`/documents/${id}`);
  }

  async uploadDocument(formData: FormData) {
    return this.request<{ message: string; document: any }>('/documents/upload', {
      method: 'POST',
      body: formData
    });
  }

  async deleteDocument(id: string) {
    return this.request<{ message: string }>(`/documents/${id}`, {
      method: 'DELETE'
    });
  }

  async reanalyzeDocument(id: string) {
    return this.request<{ message: string; analysis: AnalysisResult }>(`/documents/${id}/analyze`, {
      method: 'POST'
    });
  }

  // Q&A endpoints ("Ask Lexi")
  async askQuestion(documentId: string, question: string) {
    return this.request<QuestionResponse>(`/documents/${documentId}/qna`, {
      method: 'POST',
      body: JSON.stringify({ question })
    });
  }

  async getQnAHistory(documentId: string) {
    return this.request<{ history: QuestionResponse[] }>(`/documents/${documentId}/qna/history`);
  }

  // Action Brief endpoints
  async getActionBrief(documentId: string) {
    return this.request<ActionBrief>(`/documents/${documentId}/action-brief`);
  }

  async toggleActionItem(documentId: string, itemId: string, isCompleted: boolean) {
    return this.request<{ item: ActionItemRecord }>(
      `/documents/${documentId}/action-brief/items/${itemId}`,
      {
        method: 'PATCH',
        body: JSON.stringify({ isCompleted })
      }
    );
  }

  // Comparison endpoints
  async compareDocuments(docAId: string, docBId: string) {
    return this.request<ComparisonResult>('/comparisons', {
      method: 'POST',
      body: JSON.stringify({ docAId, docBId })
    });
  }

  async getComparison(id: string) {
    return this.request<ComparisonResult>(`/comparisons/${id}`);
  }
}

export const api = new ApiClient();

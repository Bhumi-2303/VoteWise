/**
 * VoteWise AI - Centralized Frontend API Layer
 * Production-ready client for backend service integration.
 */

const DEFAULT_API_URL = "https://votewise-backend-934331733354.us-central1.run.app";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_URL;

// --- Types ---

export interface Message {
  role: 'user' | 'assistant' | 'model' | 'system';
  content: string;
}

export interface ChatResponse {
  reply: string;
  status?: string;
  context?: unknown;
}

export interface ComparisonItem {
  category: string;
  v1: string; // The UI expects v1/v2, but backend gives c1/c2
  v2: string;
}

export interface ComparisonResponse {
  candidates: string[];
  comparison: ComparisonItem[];
  summary?: string;
}

export interface Representative {
  name: string;
  office: string; // The UI expects office, backend gives title
  party: string;
}

export interface Election {
  name: string;
  date: string;
}

export interface DistrictResponse {
  address: string;
  representatives: Representative[];
  elections: Election[];
  polling_locations?: unknown[];
}

export interface ApiError {
  message: string;
  status?: number;
}

// --- Internal Helpers ---

function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(isString);
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  // Strip trailing slashes to avoid issues, then append properly if needed.
  // The backend uses /api/v1/chat/, /api/v1/compare/, /api/v1/lookup/?address=...
  const url = `${API_BASE_URL.replace(/\/$/, '')}${path}`;
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      let errorMessage = `API Error: ${response.statusText || response.status}`;
      try {
        const errorData = await response.json();
        if (errorData.message) errorMessage = errorData.message;
        if (errorData.detail) errorMessage = Array.isArray(errorData.detail) ? errorData.detail[0].msg : errorData.detail;
      } catch (_e: unknown) {
        // Not a JSON error, keep default
      }
      throw { message: errorMessage, status: response.status } as ApiError;
    }

    return await response.json();
  } catch (error: unknown) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw { message: "Request timed out. Please check your connection and try again.", status: 408 };
    }
    // If it's a TypeError related to fetch, it's likely offline or CORS
    if (error instanceof TypeError) {
       throw { message: "Network error. Please check if you are offline or if the backend is reachable.", status: 0 };
    }
    const err = error as Record<string, unknown>;
    if (err && err.status !== undefined) throw error;
    throw { message: (error instanceof Error ? error.message : "Unknown error occurred."), status: 0 };
  }
}

// --- Public API Functions ---

/**
 * Health Check: Verifies frontend-to-backend connectivity.
 */
export async function checkHealth(): Promise<{ status: string }> {
  return apiRequest<{ status: string }>("/health", { method: 'GET' });
}

/**
 * Sends a chat message history to the AI assistant.
 */
export async function sendChatMessage(messages: Message[], locale: string = "en"): Promise<ChatResponse> {
  if (!messages || messages.length === 0) {
    throw new Error("Messages array cannot be empty.");
  }
  
  // Maps UI 'assistant' -> 'model' if backend expects 'model'
  const mappedMessages = messages.map(m => ({
    role: m.role === 'assistant' ? 'model' : m.role,
    content: m.content
  }));

  // Actual backend route is POST /api/v1/chat/
  return apiRequest<ChatResponse>("/api/v1/chat/", {
    method: 'POST',
    body: JSON.stringify({ 
      message: mappedMessages[mappedMessages.length - 1]?.content || "Hello", 
      messages: mappedMessages, 
      locale 
    }),
  });
}

/**
 * Generates a neutral comparison between two political candidates.
 */
export async function compareCandidates(candidate1: string, candidate2: string, language: string = "English"): Promise<ComparisonResponse> {
  if (!candidate1?.trim() || !candidate2?.trim()) {
    throw new Error("Both candidates are required for comparison.");
  }
  
  // Actual backend route is POST /api/v1/compare/
  const data = await apiRequest<Record<string, unknown>>("/api/v1/compare/", {
    method: 'POST',
    body: JSON.stringify({ candidate1, candidate2, language }),
  });

  // Safely normalize comparison
  const rawComparison = Array.isArray(data.comparison) ? data.comparison : [];
  const comparison: ComparisonItem[] = rawComparison
    .filter(isObject)
    .map((item) => ({
      category: isString(item.category) ? item.category : "Unknown",
      v1: isString(item.c1) ? item.c1 : (isString(item.v1) ? item.v1 : ""),
      v2: isString(item.c2) ? item.c2 : (isString(item.v2) ? item.v2 : "")
    }));

  const candidates = isStringArray(data.candidates)
    ? data.candidates
    : [candidate1, candidate2];

  const summary = isString(data.summary) ? data.summary : undefined;

  return {
    candidates,
    comparison,
    summary
  };
}

/**
 * Looks up district and election information for a given address.
 */
export async function lookupDistrict(address: string): Promise<DistrictResponse> {
  if (!address?.trim()) {
    throw new Error("An address is required.");
  }
  
  // Actual backend route is GET /api/v1/lookup/?address=...
  const data = await apiRequest<Record<string, unknown>>(`/api/v1/lookup/?address=${encodeURIComponent(address)}`, {
    method: 'GET',
  });

  // Safely normalize representatives
  const rawReps = Array.isArray(data.representatives) ? data.representatives : [];
  const representatives: Representative[] = rawReps
    .filter(isObject)
    .map((rep) => ({
      name: isString(rep.name) ? rep.name : "Unknown",
      office: isString(rep.title) ? rep.title : (isString(rep.office) ? rep.office : "Unknown"),
      party: isString(rep.party) ? rep.party : "Unknown"
    }));

  // Safely normalize elections
  const rawElections = Array.isArray(data.elections) ? data.elections : [];
  const elections: Election[] = rawElections
    .filter(isObject)
    .map((el) => ({
      name: isString(el.name) ? el.name : "Unknown Election",
      date: isString(el.date) ? el.date : "TBD"
    }));

  const normalizedAddress = isString(data.address) ? data.address : address;
  const polling_locations = Array.isArray(data.polling_locations) ? data.polling_locations : undefined;

  return {
    address: normalizedAddress,
    elections,
    representatives,
    polling_locations
  };
}

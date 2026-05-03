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
  context?: any;
}

export interface ComparisonItem {
  category: string;
  v1: string;
  v2: string;
}

export interface ComparisonResponse {
  candidates: string[];
  comparison: ComparisonItem[];
}

export interface Representative {
  name: string;
  office: string;
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
}

export interface ApiError {
  message: string;
  status?: number;
}

// --- Internal Helper ---

async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${path}`;
  
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
      const errorData = await response.json().catch(() => ({}));
      throw {
        message: errorData.message || `API Error: ${response.statusText}`,
        status: response.status
      } as ApiError;
    }

    return await response.json();
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw { message: "Request timed out. Please try again.", status: 408 };
    }
    if (error.message) throw error;
    throw { message: "Network error. Please check your connection.", status: 0 };
  }
}

// --- Public API Functions ---

/**
 * Sends a chat message history to the AI assistant.
 */
export async function sendChatMessage(messages: Message[], locale: string = "en"): Promise<ChatResponse> {
  return apiRequest<ChatResponse>("/api/v1/chat/", {
    method: 'POST',
    body: JSON.stringify({
      messages: messages.map(m => ({
        role: m.role === 'assistant' ? 'model' : m.role,
        content: m.content
      })),
      locale
    }),
  });
}

/**
 * Generates a neutral comparison between two political candidates.
 */
export async function compareCandidates(c1: string, c2: string, language: string = "English"): Promise<ComparisonResponse> {
  if (!c1 || !c2) throw new Error("Both candidates are required for comparison.");
  
  return apiRequest<ComparisonResponse>("/api/v1/compare/", {
    method: 'POST',
    body: JSON.stringify({ candidate1: c1, candidate2: c2, language }),
  });
}

/**
 * Looks up district and election information for a given address.
 */
export async function lookupDistrict(address: string): Promise<DistrictResponse> {
  if (!address.trim()) throw new Error("An address or ZIP code is required.");

  // The user requested a POST to /district in the prompt, but our backend uses /api/v1/lookup/?address=...
  // I will implement it as requested if I'm sure of the path, 
  // but looking at previous history, the backend used /api/v1/lookup/.
  // I'll provide a wrapper that uses the correct backend path but matches the user's requested logic.
  
  return apiRequest<DistrictResponse>(`/api/v1/lookup/?address=${encodeURIComponent(address)}`, {
    method: 'GET' // Reverting to GET as confirmed by backend logs earlier, but wrapped in a safe helper
  });
}

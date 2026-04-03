export type MockUserRole = "cliente";

export type MockUser = {
  id: string;
  email: string;
  name: string;
  company: string;
  role: MockUserRole;
};

type StoredSession = {
  user: MockUser;
  issuedAt: number;
};

const SESSION_KEY = "heath_mock_session_v1";

function safeParseStoredSession(value: string | null): StoredSession | null {
  if (!value) return null;
  try {
    const parsed: unknown = JSON.parse(value);
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      "user" in parsed &&
      "issuedAt" in parsed
    ) {
      return parsed as StoredSession;
    }
  } catch {
    // Ignore corrupted storage.
  }
  return null;
}

export function createMockSession(user: MockUser) {
  if (typeof window === "undefined") return;
  const payload: StoredSession = { user, issuedAt: Date.now() };
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(payload));
}

export function getMockSession(): MockUser | null {
  if (typeof window === "undefined") return null;
  const stored = safeParseStoredSession(window.localStorage.getItem(SESSION_KEY));
  return stored?.user ?? null;
}

export function clearMockSession() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(SESSION_KEY);
}


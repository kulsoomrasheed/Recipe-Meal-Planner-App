// Use Next.js rewrite proxy to avoid cross-origin CORS preflight (OPTIONS)
// See next.config.mjs -> rewrites('/api/:path*' -> backend)
export const API_BASE_URL = "/api";

const AUTH_TOKEN_KEY = "recipesai_auth_token";

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  } catch (_) {
    return null;
  }
}

export function setStoredToken(token: string | null) {
  try {
    if (token) localStorage.setItem(AUTH_TOKEN_KEY, token);
    else localStorage.removeItem(AUTH_TOKEN_KEY);
  } catch (_) {}
}

export function parseJwt(token: string): any {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (_) {
    return null;
  }
}

export async function apiFetch(path: string, { method = "GET", body, token }: { method?: string; body?: unknown; token?: string } = {}) {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const authToken = token ?? getStoredToken();
  if (authToken) headers["Authorization"] = `Bearer ${authToken}`;

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  let data: any = null;
  try {
    data = await res.json();
  } catch (_) {}

  if (!res.ok) {
    const message = data?.error || data?.msg || `Request failed (${res.status})`;
    const err: any = new Error(message);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

// Auth APIs
export const AuthAPI = {
  async register({ username, email, pass }: { username: string; email: string; pass: string }) {
    return apiFetch("/users/register", { method: "POST", body: { username, email, pass } });
  },
  async login({ username, pass }: { username: string; pass: string }) {
    return apiFetch("/users/login", { method: "POST", body: { username, pass } });
  },
};

// Recipes APIs
export const RecipesAPI = {
  list: (token?: string) => {
    return apiFetch("/recipes", { token });
  },
  create: (payload: any, token?: string) => {
    return apiFetch("/recipes", { method: "POST", body: payload, token });
  },
  update: (id: string, payload: any, token?: string) => {
    return apiFetch(`/recipes/${id}`, { method: "PATCH", body: payload, token });
  },
  remove: (id: string, token?: string) => {
    return apiFetch(`/recipes/${id}`, { method: "DELETE", token });
  },
};


// AI APIs
export const AiAPI = {
  suggest(ingredients: string[]) {
    return apiFetch("/ai/suggest", { method: "POST", body: { ingredients } });
  },
  mealPlan({ days, preferences }: { days: number; preferences: string }) {
    return apiFetch("/ai/meal-plan", { method: "POST", body: { days, preferences } });
  },
};



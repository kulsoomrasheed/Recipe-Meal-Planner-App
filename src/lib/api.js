// Use Next.js rewrite proxy to avoid cross-origin CORS preflight (OPTIONS)
// See next.config.mjs -> rewrites('/api/:path*' -> backend)
export const API_BASE_URL = "/api";

const AUTH_TOKEN_KEY = "recipesai_auth_token";

export function getStoredToken() {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  } catch (_) {
    return null;
  }
}

export function setStoredToken(token) {
  try {
    if (token) localStorage.setItem(AUTH_TOKEN_KEY, token);
    else localStorage.removeItem(AUTH_TOKEN_KEY);
  } catch (_) {}
}

export function parseJwt(token) {
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

export async function apiFetch(path, { method = "GET", body, token } = {}) {
  const headers = { "Content-Type": "application/json" };
  const authToken = token ?? getStoredToken();
  if (authToken) headers["Authorization"] = `Bearer ${authToken}`;

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  let data = null;
  try {
    data = await res.json();
  } catch (_) {}

  if (!res.ok) {
    const message = data?.error || data?.msg || `Request failed (${res.status})`;
    const err = new Error(message);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

// Auth APIs
export const AuthAPI = {
  async register({ username, email, pass }) {
    return apiFetch("/users/register", { method: "POST", body: { username, email, pass } });
  },
  async login({ username, pass }) {
    return apiFetch("/users/login", { method: "POST", body: { username, pass } });
  },
};

// Recipes APIs
export const RecipesAPI = {
  list() {
    return apiFetch("/recipes");
  },
  create(payload) {
    return apiFetch("/recipes", { method: "POST", body: payload });
  },
  update(id, payload) {
    return apiFetch(`/recipes/edit/${id}`, { method: "PATCH", body: payload });
  },
  remove(id) {
    return apiFetch(`/recipes/delete/${id}`, { method: "DELETE" });
  },
};

// AI APIs
export const AiAPI = {
  suggest(ingredients) {
    return apiFetch("/ai/suggest", { method: "POST", body: { ingredients } });
  },
  mealPlan({ days, preferences }) {
    return apiFetch("/ai/meal-plan", { method: "POST", body: { days, preferences } });
  },
};



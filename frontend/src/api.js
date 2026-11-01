
const BASE = (
  import.meta.env.VITE_API_URL || "https://futureverse-portfolio-backend.onrender.com/api"
).replace(/\/+$/, "");

let refreshPromise = null;

function clearSession() {
  localStorage.removeItem("fv_token");
  localStorage.removeItem("fv_refresh_token");

  window.dispatchEvent(new Event("fv:auth-expired"));
}

async function refreshAccessToken() {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    const refreshToken = localStorage.getItem("fv_refresh_token");

    if (!refreshToken) {
      clearSession();
      return null;
    }

    try {
      const response = await fetch(`${BASE}/auth/refresh`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${refreshToken}`
        }
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.access_token) {
        clearSession();
        return null;
      }

      localStorage.setItem("fv_token", data.access_token);

      return data.access_token;
    } catch (error) {
      clearSession();
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

async function sendRequest(path, options, token) {
  const headers = {
    ...(options.body ? { "Content-Type": "application/json" } : {}),
    ...(options.headers || {})
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return fetch(
    `${BASE}/${path.replace(/^\/+/, "")}`,
    {
      ...options,
      headers
    }
  );
}

export async function api(path, options = {}) {
  const cleanPath = path.replace(/^\/+/, "");

  const isAuthRequest =
    cleanPath === "auth/login" ||
    cleanPath === "auth/refresh";

  let token = localStorage.getItem("fv_token");

  let response;

  try {
    response = await sendRequest(cleanPath, options, token);

    if (response.status === 401 && token && !isAuthRequest) {
      const newToken = await refreshAccessToken();

      if (newToken) {
        response = await sendRequest(
          cleanPath,
          options,
          newToken
        );
      } else {
        throw new Error("Your session has expired. Please log in again.");
      }
    }
  } catch (error) {
    if (error.message?.includes("session has expired")) {
      throw error;
    }

    throw new Error(
      "Cannot connect to backend. Please check whether Flask is running."
    );
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.error || `Request failed (${response.status})`
    );
  }

  return data;
}

export const track = (kind, page = "home") => {
  return api(`/analytics/${kind}`, {
    method: "POST",
    body: JSON.stringify({ page })
  }).catch(error => {
    console.error("Analytics error:", error);
  });
};

export { BASE };

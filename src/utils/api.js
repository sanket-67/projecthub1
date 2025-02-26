const BASE_URL = "https://projecthub-38w5.onrender.com";

class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export async function apiRequest(endpoint, options = {}) {
  const defaultOptions = {
    credentials: "include", // Ensures cookies are sent with the request
    headers: {
      "Content-Type": "application/json",
    },
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...defaultOptions,
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(response.status, data.message || "Something went wrong");
  }

  return data;
}

export const api = {
  // Auth endpoints
  register: (formData) =>
    fetch(`${BASE_URL}/users/register`, {
      method: "POST",
      credentials: "include", // Includes cookies in the request
      body: formData, // Don't set Content-Type, browser will set it with boundary
    }).then((res) => res.json()),

  login: (data) =>
    apiRequest("/users/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  logout: () =>
    apiRequest("/users/logout", {
      method: "POST",
    }),

  // Admin endpoints
  verifyAdmin: () =>
    apiRequest("/users/admin", {
      method: "POST",
    }),

  getPendingUsers: () => apiRequest("/users/pendingreq"),

  grantAccess: (data) =>
    apiRequest("/users/grantuser", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  banUser: (data) =>
    apiRequest("/users/bannedUser", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Project endpoints
  createProject: (data) =>
    apiRequest("/project/create", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  applyToProject: (data) =>
    apiRequest("/project/apply", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getProjects: () => apiRequest("/project/list"),
};

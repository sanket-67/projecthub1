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

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...defaultOptions,
      ...options,
    });

    // Handle 404 errors specifically
    if (response.status === 404) {
      throw new ApiError(404, "Resource not found");
    }

    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(response.status, data.message || "Something went wrong");
    }

    return data;
  } catch (error) {
    // Handle network errors or JSON parsing errors
    if (!(error instanceof ApiError)) {
      console.error("API Request Error:", error);
      throw new ApiError(500, "Network error or server unavailable");
    }
    throw error;
  }
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

  getCurrentUser: async () => {
    try {
      return await apiRequest("/users/gettoken", {
        method: "GET",
      });
    } catch (error) {
      console.error("Error getting current user:", error);
      // If we get 401 or 404, just throw to trigger redirect to login
      throw error;
    }
  },

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

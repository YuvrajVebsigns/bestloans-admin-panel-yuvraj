
import axios from "axios";

const DEFAULT_API_BASE_URL = "https://admin.bestloans.co.in";

// Adjust baseURL according to your backend
const API = axios.create({
  baseURL: DEFAULT_API_BASE_URL,
});

export const buildApiUrl = (path = "") => {
  if (!path) return DEFAULT_API_BASE_URL;
  if (/^https?:\/\//i.test(path)) return path;

  return new URL(path.startsWith("/") ? path : `/${path}`, DEFAULT_API_BASE_URL).toString();
};

/**
 * 🔹 Request Interceptor: Attaches JWT token to every request
 */
API.interceptors.request.use(
  (config) => {
    const jwtToken = localStorage.getItem("jwt_token")?.trim();
    if (jwtToken) {
      config.headers["x-auth-token"] = jwtToken; // Attach token
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * 🔹 Response Interceptor: Handles token expiration and refresh
 */
API.interceptors.response.use(
  (response) => response, // Return response if successful
  async (error) => {
    const originalRequest = error.config;

    // If token expired (401 Unauthorized) and it’s not a retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Get refresh token
        const refreshToken = localStorage.getItem("refreshToken")?.trim();
        if (!refreshToken) throw new Error("No refresh token available");

        // Request new token using refresh token
        const refreshResponse = await axios.post(
          // "http://localhost:8080/applicant/auth/refresh_session",
          "https://admin.bestloans.co.in/applicant/auth/refresh_session",
          { token: refreshToken }
        );

        const newToken = refreshResponse.data.jwt_token;
        localStorage.setItem("jwt_token", newToken); // Save new token

        // Update the original request with new token and retry
        originalRequest.headers["x-auth-token"] = newToken;
        return API(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);

        // If refresh fails, clear tokens and force logout
        localStorage.removeItem("jwt_token");
        localStorage.removeItem("refreshToken");
        window.location.href = "/"; // Redirect to login
      }
    }

    return Promise.reject(error);
  }
);

/**
 * **🔹 General API Call Function**
 */
export const authenticateAdmin = (data, path, method) => {
  const config = {
    headers: { "Content-Type": "application/json" },
  };

  return method === "get"
    ? API.get(path, { ...config, params: data })
    : API[method](path, data, config);
};

/**
 * **🔹 Other API Functions**
 */
export const onboardApplicant = (data, path = "/applicant", method) =>
  API[method](path, data);

export const authenticateApplicant = (data, path = "/applicant/auth", method) =>
  API[method](path, data);

export const fetchAdminDashboard = (
  path = "/admin/dashboard",
  method = "get", // Default method is GET
  data = {},
  config = {} // Allow passing headers
) => {
  return method === "get"
    ? API.get(path, { ...config, params: data }) // Pass data as params for GET
    : API[method](path, data, config);
};


export default API; // Export the Axios instance

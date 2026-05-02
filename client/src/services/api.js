import axios from "axios";

// 🔧 Base URL (safe fallback for local dev)
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  timeout: 10000,
});

// 🔐 Attach token automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// ⚠️ Global error handling
API.interceptors.response.use(
  (res) => res,
  (err) => {
    const message =
      err.response?.data?.message || err.message || "Something went wrong";

    console.error("API Error:", message);

    // 🔥 Auto logout on unauthorized
    if (err.response?.status === 401) {
      localStorage.clear(); // ✅ clear all
      window.location.href = "/";
    }

    return Promise.reject(message); // ✅ return clean string
  }
);

export default API;


// ================= AUTH =================

export const login = (data) => API.post("/auth/login", data);
export const signup = (data) => API.post("/auth/signup", data);


// ================= PROJECT =================

export const getProjects = () => API.get("/projects");
export const createProject = (data) => API.post("/projects", data);


// ================= TASK =================

export const getTasks = () => API.get("/tasks");
export const createTask = (data) => API.post("/tasks", data);

export const updateTask = (id, data) =>
  API.put(`/tasks/${id}`, data);


// ================= DASHBOARD =================

export const getDashboard = () => API.get("/dashboard");


// ================= TEAM =================

export const addTeamMember = (data) =>
  API.post("/team/add", data);


// ================= USERS (ADMIN) =================

export const getUsers = () => API.get("/users");

export const updateUserRole = (id, role) =>
  API.put(`/users/${id}`, { role });
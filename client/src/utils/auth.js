export const getToken = () => localStorage.getItem("token");

export const getRole = () => localStorage.getItem("role") || "Member";

export const isAdmin = () => getRole() === "Admin";

export const isLoggedIn = () => !!getToken();

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("user");
};
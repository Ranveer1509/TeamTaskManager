export const getToken = () => localStorage.getItem("token");

export const getRole = () => localStorage.getItem("role") || "Member";

export const getUser = () => {
  try {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

export const isAdmin = () => getRole() === "Admin";

export const isLoggedIn = () => Boolean(getToken());

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("user");
};
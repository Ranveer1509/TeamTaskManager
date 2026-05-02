import { useNavigate, useLocation } from "react-router-dom";
import { getRole } from "../utils/auth";

export default function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const role = getRole() || "Member"; // ✅ fallback

  const logout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (!confirmLogout) return;

    localStorage.clear(); // ✅ safer
    navigate("/");
  };

  // ✅ Dynamic menu
  const menu = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Projects", path: "/projects" },

    // 👑 Admin-only features
    ...(role === "Admin"
      ? [
          { name: "Team", path: "/team" },
          { name: "Admin Panel", path: "/admin" }, // ✅ ADDED
        ]
      : []),
  ];

  return (
    <div className="flex h-screen bg-gray-900 text-white">

      {/* Sidebar */}
      <div className="w-64 bg-gray-800 p-6 flex flex-col justify-between shadow-lg">

        {/* Top */}
        <div>
          <h2 className="text-2xl font-bold mb-2 text-purple-400">
            TaskManager 🚀
          </h2>

          <p className="text-sm text-gray-400 mb-8">
            Role: <span className="text-purple-300">{role}</span>
          </p>

          <ul className="space-y-3">
            {menu.map((item) => (
              <li
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`cursor-pointer p-2 rounded transition ${
                  location.pathname === item.path
                    ? "bg-purple-600 text-white"
                    : "hover:bg-gray-700 hover:text-purple-400"
                }`}
              >
                {item.name}
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom */}
        <button
          onClick={logout}
          className="bg-red-500 p-2 rounded hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 p-8 overflow-auto">
        {children}
      </div>
    </div>
  );
}
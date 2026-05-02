import { useNavigate, useLocation } from "react-router-dom";
import { getRole } from "../utils/auth";

export default function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const role = getRole() || "Member";

  const logout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (!confirmLogout) return;

    localStorage.clear();
    navigate("/", { replace: true });
  };

  const menu = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Projects", path: "/projects" },
    ...(role === "Admin"
      ? [
          { name: "Team", path: "/team" },
          { name: "Admin Panel", path: "/admin" },
        ]
      : []),
  ];

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      <aside className="w-64 bg-gray-800 p-6 flex flex-col justify-between shadow-lg">
        <div>
          <h2 className="text-2xl font-bold mb-2 text-purple-400">
            TaskManager
          </h2>

          <p className="text-sm text-gray-400 mb-8">
            Role: <span className="text-purple-300">{role}</span>
          </p>

          <ul className="space-y-3">
            {menu.map((item) => (
              <li key={item.path}>
                <button
                  type="button"
                  onClick={() => navigate(item.path)}
                  className={`w-full text-left p-2 rounded transition ${
                    location.pathname === item.path
                      ? "bg-purple-600 text-white"
                      : "hover:bg-gray-700 hover:text-purple-400"
                  }`}
                >
                  {item.name}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <button
          type="button"
          onClick={logout}
          className="bg-red-500 p-2 rounded hover:bg-red-600 transition"
        >
          Logout
        </button>
      </aside>

      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  );
}
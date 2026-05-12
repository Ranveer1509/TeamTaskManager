import { useLocation, useNavigate } from "react-router-dom";
import { getRole, getUser } from "../utils/auth";

export default function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const role = getRole();
  const user = getUser();

  const logout = () => {
    if (!window.confirm("Logout from TeamTaskManager?")) return;
    localStorage.clear();
    navigate(role === "Admin" ? "/admin-login" : "/member-login", { replace: true });
  };

  const menu = [
    { name: "Dashboard", path: "/dashboard", icon: "D" },
    { name: "Projects", path: "/projects", icon: "P" },
    ...(role === "Admin"
      ? [
          { name: "Team", path: "/team", icon: "T" },
          { name: "Admin", path: "/admin", icon: "A" },
        ]
      : []),
  ];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-950">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-72 border-r border-slate-200 bg-slate-950 px-5 py-6 text-white lg:flex lg:flex-col">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded bg-cyan-400 text-lg font-black text-slate-950">
            T
          </div>
          <div>
            <h2 className="text-lg font-black">TeamTaskManager</h2>
            <p className="text-xs font-medium text-slate-400">Clear team delivery</p>
          </div>
        </div>

        <div className="mb-6 rounded border border-slate-800 bg-slate-900 p-4">
          <p className="text-sm font-bold">{user?.name || "Team user"}</p>
          <p className="mt-1 truncate text-xs text-slate-400">{user?.email || "Signed in"}</p>
          <span className="mt-3 inline-flex rounded bg-cyan-400 px-2 py-1 text-xs font-black uppercase tracking-[0.16em] text-slate-950">
            {role}
          </span>
        </div>

        <nav className="flex-1 space-y-2">
          {menu.map((item) => {
            const active = location.pathname === item.path;
            return (
              <button
                key={item.path}
                type="button"
                onClick={() => navigate(item.path)}
                className={`flex w-full items-center gap-3 rounded px-3 py-3 text-left text-sm font-bold transition ${
                  active
                    ? "bg-white text-slate-950"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <span className={`flex h-7 w-7 items-center justify-center rounded text-xs ${active ? "bg-cyan-100" : "bg-slate-800"}`}>
                  {item.icon}
                </span>
                {item.name}
              </button>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={logout}
          className="rounded border border-red-400/40 px-4 py-3 text-sm font-bold text-red-100 transition hover:bg-red-500 hover:text-white"
        >
          Logout
        </button>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 px-4 py-4 backdrop-blur sm:px-6 lg:hidden">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-sm font-black">TeamTaskManager</p>
              <p className="text-xs text-slate-500">{role} portal</p>
            </div>
            <button type="button" onClick={logout} className="rounded bg-slate-950 px-3 py-2 text-sm font-bold text-white">
              Logout
            </button>
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {menu.map((item) => (
              <button
                key={item.path}
                type="button"
                onClick={() => navigate(item.path)}
                className={`shrink-0 rounded px-3 py-2 text-sm font-bold ${
                  location.pathname === item.path ? "bg-cyan-600 text-white" : "bg-slate-100 text-slate-700"
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>
        </header>

        <main className="mx-auto min-h-screen w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}

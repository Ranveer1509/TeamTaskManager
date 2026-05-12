import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../services/api";

const roleContent = {
  Admin: {
    title: "Admin Login",
    eyebrow: "Control room",
    subtitle: "Manage projects, assign work, review users, and keep team delivery on track.",
    panelTitle: "Admin workspace",
    highlights: ["Create projects", "Assign tasks", "Manage members", "Change roles"],
    switchLabel: "Login as Member",
    switchPath: "/member-login",
  },
  Member: {
    title: "Member Login",
    eyebrow: "My work",
    subtitle: "See assigned projects, update task progress, and focus on the work that matters today.",
    panelTitle: "Member workspace",
    highlights: ["View assigned tasks", "Update status", "Track due dates", "Stay focused"],
    switchLabel: "Login as Admin",
    switchPath: "/admin-login",
  },
};

export default function Login({ roleMode = "Member" }) {
  const content = roleContent[roleMode] || roleContent.Member;
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    const email = form.email.trim();

    if (!email || !form.password) {
      setError("Email and password are required.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await login({
        email,
        password: form.password,
        role: roleMode,
      });

      const user = res?.data?.user;
      if (res?.data?.token && user) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", user.role);
        localStorage.setItem("user", JSON.stringify(user));
        navigate(user.role === "Admin" ? "/admin" : "/dashboard", { replace: true });
        return;
      }

      setError("Invalid credentials.");
    } catch (err) {
      setError(err || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !loading) handleLogin();
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto grid min-h-screen w-full max-w-6xl grid-cols-1 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="flex flex-col justify-between px-6 py-8 sm:px-10 lg:px-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded bg-cyan-400 text-lg font-black text-slate-950">
                T
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-300">
                  TeamTaskManager
                </p>
                <p className="text-xs text-slate-400">Role based task control</p>
              </div>
            </div>

            <Link
              to={content.switchPath}
              className="rounded border border-slate-700 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:border-cyan-300 hover:text-cyan-200"
            >
              {content.switchLabel}
            </Link>
          </div>

          <div className="py-16 lg:py-0">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-amber-300">
              {content.eyebrow}
            </p>
            <h1 className="max-w-xl text-4xl font-black leading-tight sm:text-5xl">
              {content.title}
            </h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-slate-300">
              {content.subtitle}
            </p>

            <div className="mt-8 grid max-w-xl grid-cols-2 gap-3">
              {content.highlights.map((item) => (
                <div key={item} className="rounded border border-slate-800 bg-slate-900/70 p-4">
                  <p className="text-sm font-semibold text-slate-100">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="text-sm text-slate-500">
            New users are created as members. An existing admin can promote accounts from the Admin Panel.
          </p>
        </section>

        <section className="flex items-center bg-slate-900/80 px-6 py-10 sm:px-10 lg:px-12">
          <div className="w-full rounded-lg border border-slate-800 bg-white p-6 text-slate-950 shadow-2xl sm:p-8">
            <div className="mb-7">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-700">
                {content.panelTitle}
              </p>
              <h2 className="mt-2 text-2xl font-black">Sign in securely</h2>
              <p className="mt-2 text-sm text-slate-500">
                Use the correct login type for your account role.
              </p>
            </div>

            {error && (
              <div className="mb-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
                {error}
              </div>
            )}

            <label className="mb-2 block text-sm font-bold text-slate-700" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={form.email}
              onKeyDown={handleKeyDown}
              className="mb-4 w-full rounded border border-slate-300 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
              placeholder="you@example.com"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />

            <label className="mb-2 block text-sm font-bold text-slate-700" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={form.password}
              onKeyDown={handleKeyDown}
              className="mb-5 w-full rounded border border-slate-300 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
              placeholder="Enter your password"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />

            <button
              type="button"
              onClick={handleLogin}
              disabled={loading}
              className="w-full rounded bg-slate-950 px-4 py-3 font-bold text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {loading ? "Signing in..." : `Enter ${roleMode} Portal`}
            </button>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-sm">
              <Link to="/signup" className="font-bold text-cyan-700 hover:text-cyan-900">
                Create member account
              </Link>
              <Link to={content.switchPath} className="font-semibold text-slate-500 hover:text-slate-900">
                {content.switchLabel}
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

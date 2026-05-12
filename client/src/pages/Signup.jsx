import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signup } from "../services/api";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async () => {
    const name = form.name.trim();
    const email = form.email.trim();

    if (!name || !email || !form.password) {
      setError("Name, email, and password are required.");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setError("");
      setLoading(true);
      await signup({ name, email, password: form.password });
      navigate("/member-login", { replace: true });
    } catch (err) {
      setError(err || "Signup failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !loading) handleSignup();
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10 text-slate-100">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-lg border border-slate-800 bg-white shadow-2xl lg:grid-cols-[0.9fr_1.1fr]">
        <section className="bg-cyan-700 p-8 text-white sm:p-10">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-cyan-100">
            Member onboarding
          </p>
          <h1 className="mt-4 text-4xl font-black leading-tight">Create your member account</h1>
          <p className="mt-4 leading-7 text-cyan-50">
            Member accounts can view assigned projects, update task status, and track deadlines.
            Admin access is granted later from the Admin Panel.
          </p>

          <div className="mt-8 space-y-3">
            {["Simple work dashboard", "Clear task ownership", "Deadline visibility"].map((item) => (
              <div key={item} className="rounded border border-cyan-300/40 bg-cyan-600/40 p-4 font-semibold">
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="p-6 text-slate-950 sm:p-10">
          <div className="mb-7">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-700">
              Signup
            </p>
            <h2 className="mt-2 text-2xl font-black">Start as a member</h2>
          </div>

          {error && (
            <div className="mb-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          <label className="mb-2 block text-sm font-bold text-slate-700" htmlFor="name">
            Full name
          </label>
          <input
            id="name"
            value={form.name}
            onKeyDown={handleKeyDown}
            className="mb-4 w-full rounded border border-slate-300 px-4 py-3 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
            placeholder="Ranveer Singh"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <label className="mb-2 block text-sm font-bold text-slate-700" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={form.email}
            onKeyDown={handleKeyDown}
            className="mb-4 w-full rounded border border-slate-300 px-4 py-3 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
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
            className="mb-5 w-full rounded border border-slate-300 px-4 py-3 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
            placeholder="Minimum 6 characters"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <button
            type="button"
            onClick={handleSignup}
            disabled={loading}
            className="w-full rounded bg-slate-950 px-4 py-3 font-bold text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {loading ? "Creating account..." : "Create Member Account"}
          </button>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already registered?{" "}
            <Link to="/member-login" className="font-bold text-cyan-700 hover:text-cyan-900">
              Go to member login
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}

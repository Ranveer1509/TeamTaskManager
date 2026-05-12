import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDashboard } from "../services/api";
import Layout from "../components/Layout";
import { getRole, getUser } from "../utils/auth";

const defaultStats = { total: 0, done: 0, inProgress: 0, todo: 0, overdue: 0 };

export default function Dashboard() {
  const [stats, setStats] = useState(defaultStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const role = getRole();
  const user = getUser();
  const navigate = useNavigate();

  useEffect(() => {
    let ignore = false;

    const fetchData = async () => {
      try {
        const res = await getDashboard();
        if (!ignore) setStats(res?.data?.data || defaultStats);
      } catch (err) {
        if (!ignore) setError(err || "Failed to load dashboard");
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchData();
    return () => {
      ignore = true;
    };
  }, []);

  const completion = useMemo(() => {
    if (!stats.total) return 0;
    return Math.round((stats.done / stats.total) * 100);
  }, [stats.done, stats.total]);

  const cards = [
    { label: "Total Tasks", value: stats.total, hint: "All visible work", color: "border-slate-200" },
    { label: "Completed", value: stats.done, hint: `${completion}% completion`, color: "border-emerald-200" },
    { label: "In Progress", value: stats.inProgress, hint: "Currently moving", color: "border-amber-200" },
    { label: "Overdue", value: stats.overdue, hint: "Needs attention", color: "border-red-200" },
  ];

  return (
    <Layout>
      <section className="mb-6 flex flex-col justify-between gap-4 rounded-lg bg-slate-950 p-6 text-white sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-300">
            {role} overview
          </p>
          <h1 className="mt-3 text-3xl font-black">Welcome, {user?.name || "there"}</h1>
          <p className="mt-2 max-w-2xl text-slate-300">
            {role === "Admin"
              ? "Monitor delivery, assign work, and keep team responsibilities clear."
              : "Track your assigned work and move tasks through the workflow."}
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate(role === "Admin" ? "/admin" : "/projects")}
          className="rounded bg-cyan-400 px-4 py-3 text-sm font-black text-slate-950 transition hover:bg-cyan-300"
        >
          {role === "Admin" ? "Open Admin Panel" : "View My Projects"}
        </button>
      </section>

      {error && <div className="mb-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{error}</div>}

      {loading ? (
        <div className="rounded-lg border border-slate-200 bg-white p-6 text-slate-500">Loading dashboard...</div>
      ) : (
        <>
          <section className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {cards.map((card) => (
              <div key={card.label} className={`rounded-lg border ${card.color} bg-white p-5 shadow-sm`}>
                <p className="text-sm font-bold text-slate-500">{card.label}</p>
                <p className="mt-3 text-4xl font-black text-slate-950">{card.value}</p>
                <p className="mt-2 text-sm text-slate-500">{card.hint}</p>
              </div>
            ))}
          </section>

          <section className="grid grid-cols-1 gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black">Delivery Progress</h2>
                  <p className="text-sm text-slate-500">Done tasks compared with total visible tasks.</p>
                </div>
                <span className="rounded bg-slate-100 px-3 py-1 text-sm font-black">{completion}%</span>
              </div>
              <div className="h-4 overflow-hidden rounded bg-slate-100">
                <div className="h-full rounded bg-cyan-600 transition-all" style={{ width: `${completion}%` }} />
              </div>
              <div className="mt-5 grid grid-cols-3 gap-3 text-center">
                <MiniStat label="Todo" value={stats.todo} />
                <MiniStat label="Active" value={stats.inProgress} />
                <MiniStat label="Done" value={stats.done} />
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-black">Recommended Next Step</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {stats.overdue > 0
                  ? "Start with overdue work. Reassign, update due dates, or move blocked tasks forward."
                  : stats.inProgress > 0
                    ? "Review active tasks and complete the closest deadline first."
                    : stats.todo > 0
                      ? "Pick the highest priority todo task and move it into progress."
                      : "No visible pending work. Create a project or wait for new assignments."}
              </p>
              <button
                type="button"
                onClick={() => navigate("/projects")}
                className="mt-5 rounded bg-slate-950 px-4 py-3 text-sm font-bold text-white transition hover:bg-cyan-700"
              >
                Go to Projects
              </button>
            </div>
          </section>
        </>
      )}
    </Layout>
  );
}

function MiniStat({ label, value }) {
  return (
    <div className="rounded border border-slate-200 bg-slate-50 p-3">
      <p className="text-2xl font-black">{value}</p>
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">{label}</p>
    </div>
  );
}

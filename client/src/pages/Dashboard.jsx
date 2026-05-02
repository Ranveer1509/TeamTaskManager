import { useEffect, useState } from "react";
import { getDashboard } from "../services/api";
import Layout from "../components/Layout";

export default function Dashboard() {
  const [stats, setStats] = useState({
    total: 0,
    done: 0,
    inProgress: 0,
    todo: 0,
    overdue: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch dashboard data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setError("");
        setLoading(true);

        const res = await getDashboard();
        setStats(res.data);

      } catch (err) {
        console.log(err);
        setError("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Layout>
      {/* Topbar */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="text-gray-400">Welcome 👋</div>
      </div>

      {/* Error */}
      {error && (
        <p className="text-red-400 mb-4">{error}</p>
      )}

      {/* Loading */}
      {loading ? (
        <p className="text-gray-400">Loading dashboard...</p>
      ) : (
        <div className="grid grid-cols-4 gap-6">

          {/* Total */}
          <div className="bg-gray-800 p-6 rounded-xl shadow hover:scale-105 transition">
            <h2 className="text-gray-400">Total Tasks</h2>
            <p className="text-3xl font-bold mt-2">{stats.total}</p>
          </div>

          {/* Done */}
          <div className="bg-green-600/20 p-6 rounded-xl shadow hover:scale-105 transition">
            <h2 className="text-gray-300">Completed</h2>
            <p className="text-3xl font-bold mt-2 text-green-400">
              {stats.done}
            </p>
          </div>

          {/* In Progress */}
          <div className="bg-yellow-600/20 p-6 rounded-xl shadow hover:scale-105 transition">
            <h2 className="text-gray-300">In Progress</h2>
            <p className="text-3xl font-bold mt-2 text-yellow-400">
              {stats.inProgress}
            </p>
          </div>

          {/* Overdue */}
          <div className="bg-red-600/20 p-6 rounded-xl shadow hover:scale-105 transition">
            <h2 className="text-gray-300">Overdue</h2>
            <p className="text-3xl font-bold mt-2 text-red-400">
              {stats.overdue}
            </p>
          </div>

        </div>
      )}
    </Layout>
  );
}
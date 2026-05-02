import { useEffect, useState } from "react";
import { getDashboard } from "../services/api";
import Layout from "../components/Layout";

const defaultStats = {
  total: 0,
  done: 0,
  inProgress: 0,
  todo: 0,
  overdue: 0,
};

export default function Dashboard() {
  const [stats, setStats] = useState(defaultStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    const fetchData = async () => {
      try {
        const res = await getDashboard();

        if (!ignore) {
          setStats(res?.data?.data || defaultStats);
        }
      } catch (err) {
        console.log(err);

        if (!ignore) {
          setError(err || "Failed to load dashboard");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <Layout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="text-gray-400">Welcome</div>
      </div>

      {error && <p className="text-red-400 mb-4">{error}</p>}

      {loading ? (
        <p className="text-gray-400">Loading dashboard...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <div className="bg-gray-800 p-6 rounded-xl shadow hover:scale-105 transition">
            <h2 className="text-gray-400">Total Tasks</h2>
            <p className="text-3xl font-bold mt-2">{stats.total}</p>
          </div>

          <div className="bg-green-600/20 p-6 rounded-xl shadow hover:scale-105 transition">
            <h2 className="text-gray-300">Completed</h2>
            <p className="text-3xl font-bold mt-2 text-green-400">
              {stats.done}
            </p>
          </div>

          <div className="bg-yellow-600/20 p-6 rounded-xl shadow hover:scale-105 transition">
            <h2 className="text-gray-300">In Progress</h2>
            <p className="text-3xl font-bold mt-2 text-yellow-400">
              {stats.inProgress}
            </p>
          </div>

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
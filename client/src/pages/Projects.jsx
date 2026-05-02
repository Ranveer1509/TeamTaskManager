import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { getProjects, createProject } from "../services/api";
import { isAdmin } from "../utils/auth";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const admin = isAdmin();

  const fetchProjects = async () => {
    try {
      setFetching(true);
      setError("");

      const res = await getProjects();
      const data = res?.data?.data || [];

      setProjects(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log(err);
      setError(err || "Failed to load projects");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    let ignore = false;

    const loadProjects = async () => {
      try {
        const res = await getProjects();

        if (!ignore) {
          const data = res?.data?.data || [];
          setProjects(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.log(err);

        if (!ignore) {
          setError(err || "Failed to load projects");
        }
      } finally {
        if (!ignore) {
          setFetching(false);
        }
      }
    };

    loadProjects();

    return () => {
      ignore = true;
    };
  }, []);

  const handleCreate = async () => {
    const projectName = name.trim();

    if (!admin) {
      setError("Only Admin can create projects");
      return;
    }

    if (!projectName) {
      setError("Project name required");
      return;
    }

    try {
      setError("");
      setLoading(true);

      await createProject({ name: projectName });

      setName("");
      await fetchProjects();
    } catch (err) {
      console.log(err);
      setError(err || "Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Projects</h1>

      {error && <p className="text-red-400 mb-4">{error}</p>}

      {admin && (
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <input
            className="p-3 rounded bg-gray-800 border border-gray-700 w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Project name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <button
            type="button"
            onClick={handleCreate}
            disabled={loading || !name.trim()}
            className={`px-5 py-3 rounded transition ${
              loading || !name.trim()
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-purple-600 hover:bg-purple-700"
            }`}
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      )}

      {fetching ? (
        <p className="text-gray-400">Loading projects...</p>
      ) : projects.length === 0 ? (
        <p className="text-gray-400">No projects yet</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {projects.map((p) => (
            <button
              type="button"
              key={p.id}
              onClick={() => navigate(`/tasks/${p.id}`)}
              className="bg-gray-800 p-5 rounded-xl shadow cursor-pointer hover:scale-105 hover:bg-gray-700 transition text-left"
            >
              <h2 className="text-xl font-semibold">{p.name}</h2>

              <p className="text-gray-400 text-sm mt-2">
                Project ID: {p.id}
              </p>

              <p className="text-purple-400 text-sm mt-4">
                View Tasks →
              </p>
            </button>
          ))}
        </div>
      )}
    </Layout>
  );
}
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { createProject, getProjects } from "../services/api";
import { isAdmin } from "../utils/auth";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState("");
  const [query, setQuery] = useState("");
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
        if (!ignore) setError(err || "Failed to load projects");
      } finally {
        if (!ignore) setFetching(false);
      }
    };

    loadProjects();
    return () => {
      ignore = true;
    };
  }, []);

  const filteredProjects = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return projects;
    return projects.filter((project) => project.name?.toLowerCase().includes(term));
  }, [projects, query]);

  const handleCreate = async () => {
    const projectName = name.trim();

    if (!admin) {
      setError("Only Admin can create projects.");
      return;
    }

    if (!projectName) {
      setError("Project name is required.");
      return;
    }

    try {
      setError("");
      setLoading(true);
      await createProject({ name: projectName });
      setName("");
      await fetchProjects();
    } catch (err) {
      setError(err || "Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <section className="mb-6 flex flex-col justify-between gap-4 rounded-lg bg-white p-6 shadow-sm md:flex-row md:items-end">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-700">
            Projects
          </p>
          <h1 className="mt-2 text-3xl font-black">Project Workspace</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            {admin
              ? "Create project spaces, then open a project to assign and manage tasks."
              : "Open your available projects and update the tasks assigned to you."}
          </p>
        </div>
        <div className="rounded bg-slate-100 px-4 py-3 text-sm font-black text-slate-700">
          {projects.length} total projects
        </div>
      </section>

      {error && <div className="mb-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{error}</div>}

      <section className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1.1fr]">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <label className="mb-2 block text-sm font-bold text-slate-700" htmlFor="project-search">
            Search projects
          </label>
          <input
            id="project-search"
            className="w-full rounded border border-slate-300 px-4 py-3 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
            placeholder="Type a project name"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {admin ? (
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <label className="mb-2 block text-sm font-bold text-slate-700" htmlFor="project-name">
              Create new project
            </label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                id="project-name"
                className="min-w-0 flex-1 rounded border border-slate-300 px-4 py-3 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                placeholder="Project name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <button
                type="button"
                onClick={handleCreate}
                disabled={loading || !name.trim()}
                className="rounded bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {loading ? "Creating..." : "Create"}
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-lg border border-cyan-200 bg-cyan-50 p-5 text-sm leading-6 text-cyan-950">
            Members can view assigned project work. Ask an admin if a project is missing.
          </div>
        )}
      </section>

      {fetching ? (
        <div className="rounded-lg border border-slate-200 bg-white p-6 text-slate-500">Loading projects...</div>
      ) : filteredProjects.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center">
          <h2 className="text-xl font-black">No projects found</h2>
          <p className="mt-2 text-sm text-slate-500">
            {query ? "Try a different search." : admin ? "Create your first project above." : "No projects are available yet."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredProjects.map((project) => (
            <button
              type="button"
              key={project.id}
              onClick={() => navigate(`/tasks/${project.id}`)}
              className="group rounded-lg border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-cyan-300 hover:shadow-md"
            >
              <div className="mb-5 flex items-start justify-between gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded bg-cyan-100 font-black text-cyan-800">
                  {project.name?.charAt(0)?.toUpperCase() || "P"}
                </div>
                <span className="rounded bg-slate-100 px-2 py-1 text-xs font-bold text-slate-500">
                  ID #{project.id}
                </span>
              </div>
              <h2 className="text-xl font-black text-slate-950">{project.name}</h2>
              <p className="mt-3 text-sm font-bold text-cyan-700 group-hover:text-cyan-900">
                Open task board
              </p>
            </button>
          ))}
        </div>
      )}
    </Layout>
  );
}

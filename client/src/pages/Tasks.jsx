import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../components/Layout";
import { isAdmin } from "../utils/auth";
import { createTask, getTasks, updateTask } from "../services/api";

const columns = ["Todo", "In Progress", "Done"];

export default function Tasks() {
  const { projectId } = useParams();
  const admin = isAdmin();
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getTasks();
      const data = res?.data?.data || [];
      setTasks(data.filter((task) => String(task.projectId) === String(projectId)));
    } catch (err) {
      setError(err || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;

    const loadTasks = async () => {
      try {
        const res = await getTasks();
        if (!ignore) {
          const data = res?.data?.data || [];
          setTasks(data.filter((task) => String(task.projectId) === String(projectId)));
        }
      } catch (err) {
        if (!ignore) setError(err || "Failed to load tasks");
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    loadTasks();
    return () => {
      ignore = true;
    };
  }, [projectId]);

  const visibleTasks = useMemo(() => {
    if (statusFilter === "All") return tasks;
    return tasks.filter((task) => task.status === statusFilter);
  }, [tasks, statusFilter]);

  const summary = useMemo(() => ({
    total: tasks.length,
    todo: tasks.filter((task) => task.status === "Todo").length,
    active: tasks.filter((task) => task.status === "In Progress").length,
    done: tasks.filter((task) => task.status === "Done").length,
    overdue: tasks.filter((task) => isOverdue(task)).length,
  }), [tasks]);

  const handleCreate = async () => {
    const taskTitle = title.trim();
    const userId = assignedTo.trim();

    if (!admin) {
      setError("Only Admin can create tasks.");
      return;
    }

    if (!taskTitle || !userId) {
      setError("Task title and assignee user ID are required.");
      return;
    }

    try {
      setError("");
      setCreating(true);
      await createTask({
        title: taskTitle,
        projectId,
        assignedTo: Number(userId),
        dueDate: dueDate || null,
      });
      setTitle("");
      setAssignedTo("");
      setDueDate("");
      await fetchTasks();
    } catch (err) {
      setError(err || "Failed to create task");
    } finally {
      setCreating(false);
    }
  };

  const changeStatus = async (task, status) => {
    try {
      setError("");
      await updateTask(task.id, { status });
      await fetchTasks();
    } catch (err) {
      setError(err || "Failed to update task");
    }
  };

  const assignUser = async (task) => {
    const userId = assignedTo.trim();

    if (!admin) {
      setError("Only Admin can assign tasks.");
      return;
    }

    if (!userId) {
      setError("Enter a user ID in the assignee field first.");
      return;
    }

    try {
      setError("");
      await updateTask(task.id, { assignedTo: Number(userId) });
      await fetchTasks();
    } catch (err) {
      setError(err || "Failed to assign task");
    }
  };

  return (
    <Layout>
      <section className="mb-6 rounded-lg bg-white p-6 shadow-sm">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-700">
          Project #{projectId}
        </p>
        <div className="mt-2 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <h1 className="text-3xl font-black">Task Board</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              {admin
                ? "Create tasks, assign them to members, and move work across the board."
                : "Update your assigned tasks as work moves from todo to done."}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
            <Summary label="Total" value={summary.total} />
            <Summary label="Todo" value={summary.todo} />
            <Summary label="Active" value={summary.active} />
            <Summary label="Done" value={summary.done} />
            <Summary label="Late" value={summary.overdue} />
          </div>
        </div>
      </section>

      {error && <div className="mb-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{error}</div>}

      {admin && (
        <section className="mb-6 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-[1.2fr_0.7fr_0.7fr_auto]">
            <input
              className="rounded border border-slate-300 px-4 py-3 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
              placeholder="Task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <input
              type="number"
              className="rounded border border-slate-300 px-4 py-3 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
              placeholder="Assignee user ID"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
            />
            <input
              type="date"
              className="rounded border border-slate-300 px-4 py-3 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
            <button
              type="button"
              onClick={handleCreate}
              disabled={creating || !title.trim() || !assignedTo.trim()}
              className="rounded bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {creating ? "Adding..." : "Add Task"}
            </button>
          </div>
        </section>
      )}

      <div className="mb-4 flex flex-wrap gap-2">
        {["All", ...columns].map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => setStatusFilter(status)}
            className={`rounded px-3 py-2 text-sm font-bold ${
              statusFilter === status ? "bg-cyan-600 text-white" : "bg-white text-slate-600"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="rounded-lg border border-slate-200 bg-white p-6 text-slate-500">Loading tasks...</div>
      ) : tasks.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center">
          <h2 className="text-xl font-black">No tasks yet</h2>
          <p className="mt-2 text-sm text-slate-500">
            {admin ? "Add the first task above." : "No work is assigned to you in this project yet."}
          </p>
        </div>
      ) : statusFilter === "All" ? (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {columns.map((column) => (
            <Column
              key={column}
              title={column}
              tasks={visibleTasks.filter((task) => task.status === column)}
              changeStatus={changeStatus}
              assignUser={assignUser}
              admin={admin}
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visibleTasks.map((task) => (
            <TaskCard key={task.id} task={task} columnTitle={task.status} changeStatus={changeStatus} assignUser={assignUser} admin={admin} />
          ))}
        </div>
      )}
    </Layout>
  );
}

function Column({ title, tasks, changeStatus, assignUser, admin }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-black">{title}</h2>
        <span className="rounded bg-slate-100 px-2 py-1 text-xs font-black text-slate-500">{tasks.length}</span>
      </div>
      <div className="space-y-3">
        {tasks.length === 0 ? (
          <p className="rounded border border-dashed border-slate-200 p-4 text-sm text-slate-500">No tasks here.</p>
        ) : (
          tasks.map((task) => (
            <TaskCard key={task.id} task={task} columnTitle={title} changeStatus={changeStatus} assignUser={assignUser} admin={admin} />
          ))
        )}
      </div>
    </section>
  );
}

function TaskCard({ task, columnTitle, changeStatus, assignUser, admin }) {
  const overdue = isOverdue(task);

  return (
    <article className={`rounded border p-4 ${overdue ? "border-red-200 bg-red-50" : "border-slate-200 bg-slate-50"}`}>
      <div className="mb-3 flex items-start justify-between gap-3">
        <h3 className="font-black text-slate-950">{task.title}</h3>
        <span className={`rounded px-2 py-1 text-xs font-black ${overdue ? "bg-red-600 text-white" : "bg-white text-slate-500"}`}>
          {overdue ? "Late" : task.status}
        </span>
      </div>
      <p className="text-sm text-slate-600">Assigned to user #{task.assignedTo || "None"}</p>
      <p className="mt-1 text-sm text-slate-600">
        Due {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "not set"}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {columnTitle === "Todo" && (
          <button type="button" onClick={() => changeStatus(task, "In Progress")} className="rounded bg-amber-100 px-3 py-2 text-sm font-bold text-amber-800">
            Start
          </button>
        )}
        {columnTitle === "In Progress" && (
          <button type="button" onClick={() => changeStatus(task, "Done")} className="rounded bg-emerald-100 px-3 py-2 text-sm font-bold text-emerald-800">
            Complete
          </button>
        )}
        {columnTitle === "Done" && (
          <button type="button" onClick={() => changeStatus(task, "In Progress")} className="rounded bg-slate-200 px-3 py-2 text-sm font-bold text-slate-700">
            Reopen
          </button>
        )}
        {admin && (
          <button type="button" onClick={() => assignUser(task)} className="rounded bg-cyan-100 px-3 py-2 text-sm font-bold text-cyan-800">
            Assign
          </button>
        )}
      </div>
    </article>
  );
}

function Summary({ label, value }) {
  return (
    <div className="rounded bg-slate-100 px-3 py-2 text-center">
      <p className="text-xl font-black">{value}</p>
      <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">{label}</p>
    </div>
  );
}

function isOverdue(task) {
  if (!task.dueDate || task.status === "Done") return false;
  return new Date(task.dueDate) < new Date();
}

import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { isAdmin } from "../utils/auth";

import {
  getTasks,
  createTask,
  updateTask,
} from "../services/api";

export default function Tasks() {
  const { projectId } = useParams();
  const admin = isAdmin(); // ✅ FIX

  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await getTasks();
      const data = res?.data?.data || [];
      const filtered = data.filter(
        (t) => String(t.projectId) === String(projectId)
      );
      setTasks(filtered);

    } catch (err) {
      console.log(err);
      setError("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;

    const loadTasks = async () => {
      try {
        const res = await getTasks();
        if (ignore) return;

        const data = res?.data?.data || [];
        setTasks(
          data.filter((t) => String(t.projectId) === String(projectId))
        );
      } catch (err) {
        console.log(err);
        if (!ignore) setError("Failed to load tasks");
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    loadTasks();

    return () => {
      ignore = true;
    };
  }, [projectId]);

  // 👑 CREATE TASK (ADMIN ONLY)
  const handleCreate = async () => {
    if (!admin) {
      setError("Only Admin can create tasks");
      return;
    }

    if (!title.trim()) {
      setError("Task title required");
      return;
    }

    if (!assignedTo) {
      setError("Assigned user ID required");
      return;
    }

    try {
      setError("");
      setCreating(true);

      await createTask({
        title: title.trim(),
        projectId,
        assignedTo: assignedTo || null,
        dueDate: dueDate || null,
      });

      setTitle("");
      setAssignedTo("");
      setDueDate("");
      fetchTasks();

    } catch (err) {
      console.log(err);
      setError(err || "Failed to create task");
    } finally {
      setCreating(false);
    }
  };

  // ✅ BOTH CAN UPDATE STATUS
  const changeStatus = async (task, status) => {
    try {
      setError("");
      await updateTask(task.id, { status });
      fetchTasks();
    } catch (err) {
      console.log(err);
      setError(err || "Failed to update task");
    }
  };

  // 👑 ASSIGN TASK (ADMIN ONLY)
  const assignUser = async (task) => {
    if (!admin) {
      setError("Only Admin can assign tasks");
      return;
    }

    if (!assignedTo) {
      setError("Enter user ID first");
      return;
    }

    try {
      setError("");
      await updateTask(task.id, { assignedTo });
      fetchTasks();
    } catch (err) {
      console.log(err);
      setError(err || "Failed to assign task");
    }
  };

  const isOverdue = (task) => {
    if (!task.dueDate || task.status === "Done") return false;
    return new Date(task.dueDate) < new Date();
  };

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Tasks 🧠</h1>

      {error && (
        <p className="text-red-400 mb-4">{error}</p>
      )}

      {/* 👑 ONLY ADMIN */}
      {admin && (
        <div className="flex gap-3 mb-6 flex-wrap">

          <input
            className="p-3 rounded bg-gray-800 border border-gray-700"
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            type="number"
            className="p-3 rounded bg-gray-800 border border-gray-700"
            placeholder="Assign User ID"
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
          />

          <input
            type="date"
            className="p-3 rounded bg-gray-800 border border-gray-700"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />

          <button
            onClick={handleCreate}
            disabled={creating}
            className={`px-4 rounded ${
              creating
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-purple-600 hover:bg-purple-700"
            }`}
          >
            {creating ? "Adding..." : "Add Task"}
          </button>
        </div>
      )}

      {/* Tasks */}
      {loading ? (
        <p className="text-gray-400">Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <p className="text-gray-400">No tasks yet 🧠</p>
      ) : (
        <div className="grid grid-cols-3 gap-6">

          <Column
            title="Todo"
            tasks={tasks.filter(t => t.status === "Todo")}
            changeStatus={changeStatus}
            assignUser={assignUser}
            isOverdue={isOverdue}
            admin={admin}
          />

          <Column
            title="In Progress"
            tasks={tasks.filter(t => t.status === "In Progress")}
            changeStatus={changeStatus}
            assignUser={assignUser}
            isOverdue={isOverdue}
            admin={admin}
          />

          <Column
            title="Done"
            tasks={tasks.filter(t => t.status === "Done")}
            changeStatus={changeStatus}
            assignUser={assignUser}
            isOverdue={isOverdue}
            admin={admin}
          />

        </div>
      )}
    </Layout>
  );
}


// Column
function Column({ title, tasks, changeStatus, assignUser, isOverdue, admin }) {
  return (
    <div>
      <h2 className="mb-3 text-lg text-gray-300">{title}</h2>

      {tasks.map((t) => (
        <div
          key={t.id}
          className={`p-4 rounded mb-3 ${
            isOverdue(t)
              ? "bg-red-700/30 border border-red-500"
              : "bg-gray-800"
          }`}
        >
          <p className="font-semibold">{t.title}</p>

          <p className="text-sm text-gray-400 mt-1">
            Assigned: {t.assignedTo || "None"}
          </p>

          <p className="text-sm text-gray-400">
            Due: {t.dueDate || "N/A"}
          </p>

          <div className="flex gap-2 mt-3 flex-wrap">

            {title === "Todo" && (
              <button
                onClick={() => changeStatus(t, "In Progress")}
                className="text-yellow-400 text-sm"
              >
                Start
              </button>
            )}

            {title === "In Progress" && (
              <button
                onClick={() => changeStatus(t, "Done")}
                className="text-green-400 text-sm"
              >
                Complete
              </button>
            )}

            {/* 👑 ADMIN ONLY */}
            {admin && (
              <button
                onClick={() => assignUser(t)}
                className="text-blue-400 text-sm"
              >
                Assign
              </button>
            )}

          </div>
        </div>
      ))}
    </div>
  );
}

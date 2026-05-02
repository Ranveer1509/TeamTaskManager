import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../components/Layout";
import { isAdmin } from "../utils/auth";
import {
  getTasks,
  createTask,
  updateTask,
} from "../services/api";

export default function Tasks() {
  const { projectId } = useParams();
  const admin = isAdmin();

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
        (task) => String(task.projectId) === String(projectId)
      );

      setTasks(filtered);
    } catch (err) {
      console.log(err);
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
          setTasks(
            data.filter((task) => String(task.projectId) === String(projectId))
          );
        }
      } catch (err) {
        console.log(err);

        if (!ignore) {
          setError(err || "Failed to load tasks");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadTasks();

    return () => {
      ignore = true;
    };
  }, [projectId]);

  const handleCreate = async () => {
    const taskTitle = title.trim();
    const userId = assignedTo.trim();

    if (!admin) {
      setError("Only Admin can create tasks");
      return;
    }

    if (!taskTitle) {
      setError("Task title required");
      return;
    }

    if (!userId) {
      setError("Assigned user ID required");
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
      console.log(err);
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
      console.log(err);
      setError(err || "Failed to update task");
    }
  };

  const assignUser = async (task) => {
    const userId = assignedTo.trim();

    if (!admin) {
      setError("Only Admin can assign tasks");
      return;
    }

    if (!userId) {
      setError("Enter user ID first");
      return;
    }

    try {
      setError("");

      await updateTask(task.id, {
        assignedTo: Number(userId),
      });

      await fetchTasks();
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
      <h1 className="text-3xl font-bold mb-6">Tasks</h1>

      {error && <p className="text-red-400 mb-4">{error}</p>}

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
            type="button"
            onClick={handleCreate}
            disabled={creating || !title.trim() || !assignedTo.trim()}
            className={`px-4 rounded ${
              creating || !title.trim() || !assignedTo.trim()
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-purple-600 hover:bg-purple-700"
            }`}
          >
            {creating ? "Adding..." : "Add Task"}
          </button>
        </div>
      )}

      {loading ? (
        <p className="text-gray-400">Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <p className="text-gray-400">No tasks yet</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Column
            title="Todo"
            tasks={tasks.filter((task) => task.status === "Todo")}
            changeStatus={changeStatus}
            assignUser={assignUser}
            isOverdue={isOverdue}
            admin={admin}
          />

          <Column
            title="In Progress"
            tasks={tasks.filter((task) => task.status === "In Progress")}
            changeStatus={changeStatus}
            assignUser={assignUser}
            isOverdue={isOverdue}
            admin={admin}
          />

          <Column
            title="Done"
            tasks={tasks.filter((task) => task.status === "Done")}
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

function Column({ title, tasks, changeStatus, assignUser, isOverdue, admin }) {
  return (
    <div>
      <h2 className="mb-3 text-lg text-gray-300">{title}</h2>

      {tasks.map((task) => (
        <div
          key={task.id}
          className={`p-4 rounded mb-3 ${
            isOverdue(task)
              ? "bg-red-700/30 border border-red-500"
              : "bg-gray-800"
          }`}
        >
          <p className="font-semibold">{task.title}</p>

          <p className="text-sm text-gray-400 mt-1">
            Assigned: {task.assignedTo || "None"}
          </p>

          <p className="text-sm text-gray-400">
            Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "N/A"}
          </p>

          <div className="flex gap-2 mt-3 flex-wrap">
            {title === "Todo" && (
              <button
                type="button"
                onClick={() => changeStatus(task, "In Progress")}
                className="text-yellow-400 text-sm"
              >
                Start
              </button>
            )}

            {title === "In Progress" && (
              <button
                type="button"
                onClick={() => changeStatus(task, "Done")}
                className="text-green-400 text-sm"
              >
                Complete
              </button>
            )}

            {admin && (
              <button
                type="button"
                onClick={() => assignUser(task)}
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
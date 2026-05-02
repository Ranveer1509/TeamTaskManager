import { useState } from "react";
import Layout from "../components/Layout";
import { addTeamMember } from "../services/api";
import { isAdmin } from "../utils/auth";

export default function Team() {
  const admin = isAdmin();

  const [userId, setUserId] = useState("");
  const [projectId, setProjectId] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const addMember = async () => {
    const selectedUserId = userId.trim();
    const selectedProjectId = projectId.trim();

    if (!admin) {
      setMessage("Only Admin can add members");
      return;
    }

    if (!selectedUserId || !selectedProjectId) {
      setMessage("Both User ID and Project ID are required");
      return;
    }

    if (Number.isNaN(Number(selectedUserId)) || Number.isNaN(Number(selectedProjectId))) {
      setMessage("IDs must be numbers");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      await addTeamMember({
        userId: Number(selectedUserId),
        projectId: Number(selectedProjectId),
      });

      setMessage("Member added successfully");
      setUserId("");
      setProjectId("");
    } catch (err) {
      console.log(err);
      setMessage(err || "Failed to add member");
    } finally {
      setLoading(false);
    }
  };

  if (!admin) {
    return (
      <Layout>
        <h2 className="text-red-400 text-xl">
          Access Denied (Admin Only)
        </h2>
      </Layout>
    );
  }

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">
        Team Management
      </h1>

      {message && (
        <p className="mb-4 text-sm text-purple-400">
          {message}
        </p>
      )}

      <div className="flex gap-3 flex-wrap">
        <input
          type="number"
          value={userId}
          placeholder="User ID"
          className="p-3 bg-gray-800 rounded border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
          onChange={(e) => setUserId(e.target.value)}
        />

        <input
          type="number"
          value={projectId}
          placeholder="Project ID"
          className="p-3 bg-gray-800 rounded border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
          onChange={(e) => setProjectId(e.target.value)}
        />

        <button
          type="button"
          onClick={addMember}
          disabled={loading || !userId.trim() || !projectId.trim()}
          className={`px-4 rounded transition ${
            loading || !userId.trim() || !projectId.trim()
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-purple-600 hover:bg-purple-700"
          }`}
        >
          {loading ? "Adding..." : "Add Member"}
        </button>
      </div>
    </Layout>
  );
}
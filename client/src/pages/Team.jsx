import { useState } from "react";
import Layout from "../components/Layout";
import { addTeamMember } from "../services/api";
import { isAdmin } from "../utils/auth";

export default function Team() {
  const admin = isAdmin(); // ✅ RBAC

  const [userId, setUserId] = useState("");
  const [projectId, setProjectId] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const addMember = async () => {
    if (!admin) {
      setMessage("Only Admin can add members ❌");
      return;
    }

    if (!userId || !projectId) {
      setMessage("Both User ID and Project ID are required");
      return;
    }

    if (isNaN(userId) || isNaN(projectId)) {
      setMessage("IDs must be numbers");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      await addTeamMember({
        userId: Number(userId),
        projectId: Number(projectId),
      });

      setMessage("Member added successfully ✅");
      setUserId("");
      setProjectId("");

    } catch (err) {
      console.log(err);
      setMessage(err || "Failed to add member ❌");
    } finally {
      setLoading(false);
    }
  };

  // 🔐 Access control
  if (!admin) {
    return (
      <Layout>
        <h2 className="text-red-400 text-xl">
          Access Denied 🚫 (Admin Only)
        </h2>
      </Layout>
    );
  }

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">
        Team Management 👥
      </h1>

      {message && (
        <p className="mb-4 text-sm text-purple-400">
          {message}
        </p>
      )}

      <div className="flex gap-3 flex-wrap">

        {/* User ID */}
        <input
          value={userId}
          placeholder="User ID"
          className="p-3 bg-gray-800 rounded border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
          onChange={(e) => setUserId(e.target.value)}
        />

        {/* Project ID */}
        <input
          value={projectId}
          placeholder="Project ID"
          className="p-3 bg-gray-800 rounded border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
          onChange={(e) => setProjectId(e.target.value)}
        />

        {/* Button */}
        <button
          onClick={addMember}
          disabled={loading}
          className={`px-4 rounded transition ${
            loading
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
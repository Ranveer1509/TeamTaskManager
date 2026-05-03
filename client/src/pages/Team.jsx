import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { addTeamMember, getTeamMembers } from "../services/api";
import { isAdmin } from "../utils/auth";

export default function Team() {
  const admin = isAdmin();

  const [members, setMembers] = useState([]);
  const [userId, setUserId] = useState("");
  const [projectId, setProjectId] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(admin);
  const [message, setMessage] = useState("");

  const fetchMembers = async () => {
    try {
      setFetching(true);
      setMessage("");

      const res = await getTeamMembers();
      const data = res?.data?.data || [];
      setMembers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log(err);
      setMessage(err || "Failed to load team members");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (!admin) return;

    let ignore = false;

    const loadMembers = async () => {
      try {
        const res = await getTeamMembers();
        if (ignore) return;

        const data = res?.data?.data || [];
        setMembers(Array.isArray(data) ? data : []);
      } catch (err) {
        console.log(err);
        if (!ignore) setMessage(err || "Failed to load team members");
      } finally {
        if (!ignore) setFetching(false);
      }
    };

    loadMembers();

    return () => {
      ignore = true;
    };
  }, [admin]);

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

    if (
      Number.isNaN(Number(selectedUserId)) ||
      Number.isNaN(Number(selectedProjectId))
    ) {
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
      await fetchMembers();
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

      <div className="flex gap-3 flex-wrap mb-8">
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

      {fetching ? (
        <p className="text-gray-400">Loading team members...</p>
      ) : members.length === 0 ? (
        <p className="text-gray-400">No team members assigned yet</p>
      ) : (
        <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg">
          <table className="w-full text-left">
            <thead className="bg-gray-700 text-gray-300">
              <tr>
                <th className="p-3">User</th>
                <th>Email</th>
                <th>Project</th>
                <th>Team Role</th>
              </tr>
            </thead>

            <tbody>
              {members.map((member) => (
                <tr
                  key={`${member.userId}-${member.projectId}`}
                  className="border-t border-gray-700 hover:bg-gray-700/40 transition"
                >
                  <td className="p-3">
                    {member.User?.name || `User #${member.userId}`}
                  </td>
                  <td>
                    {member.User?.email || "N/A"}
                  </td>
                  <td>
                    {member.Project?.name || `Project #${member.projectId}`}
                  </td>
                  <td>
                    <span className="px-2 py-1 rounded text-sm bg-gray-600">
                      {member.role}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
}

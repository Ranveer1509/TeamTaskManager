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
        if (!ignore) {
          const data = res?.data?.data || [];
          setMembers(Array.isArray(data) ? data : []);
        }
      } catch (err) {
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

    if (!selectedUserId || !selectedProjectId) {
      setMessage("Both User ID and Project ID are required.");
      return;
    }

    if (Number.isNaN(Number(selectedUserId)) || Number.isNaN(Number(selectedProjectId))) {
      setMessage("IDs must be numbers.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");
      await addTeamMember({
        userId: Number(selectedUserId),
        projectId: Number(selectedProjectId),
      });
      setMessage("Member added successfully.");
      setUserId("");
      setProjectId("");
      await fetchMembers();
    } catch (err) {
      setMessage(err || "Failed to add member");
    } finally {
      setLoading(false);
    }
  };

  if (!admin) {
    return (
      <Layout>
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-700">
          Access denied. Admin account required.
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="mb-6 rounded-lg bg-white p-6 shadow-sm">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-700">Team</p>
        <h1 className="mt-2 text-3xl font-black">Team Assignment</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
          Connect members to projects so work ownership is visible and simple to manage.
        </p>
      </section>

      {message && (
        <div className="mb-4 rounded border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm font-bold text-cyan-800">
          {message}
        </div>
      )}

      <section className="mb-6 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_1fr_auto]">
          <input
            type="number"
            value={userId}
            placeholder="User ID"
            className="rounded border border-slate-300 px-4 py-3 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
            onChange={(e) => setUserId(e.target.value)}
          />
          <input
            type="number"
            value={projectId}
            placeholder="Project ID"
            className="rounded border border-slate-300 px-4 py-3 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
            onChange={(e) => setProjectId(e.target.value)}
          />
          <button
            type="button"
            onClick={addMember}
            disabled={loading || !userId.trim() || !projectId.trim()}
            className="rounded bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {loading ? "Adding..." : "Add Member"}
          </button>
        </div>
      </section>

      {fetching ? (
        <div className="rounded-lg border border-slate-200 bg-white p-6 text-slate-500">Loading team members...</div>
      ) : members.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center">
          <h2 className="text-xl font-black">No team members assigned yet</h2>
          <p className="mt-2 text-sm text-slate-500">Add a user and project ID above to begin.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left">
              <thead className="bg-slate-50 text-sm text-slate-500">
                <tr>
                  <th className="p-4">Member</th>
                  <th>Email</th>
                  <th>Project</th>
                  <th>Team Role</th>
                </tr>
              </thead>
              <tbody>
                {members.map((member) => (
                  <tr key={`${member.userId}-${member.projectId}`} className="border-t border-slate-200">
                    <td className="p-4 font-bold text-slate-950">{member.User?.name || `User #${member.userId}`}</td>
                    <td className="text-sm text-slate-600">{member.User?.email || "N/A"}</td>
                    <td className="text-sm text-slate-600">{member.Project?.name || `Project #${member.projectId}`}</td>
                    <td>
                      <span className="rounded bg-slate-100 px-2 py-1 text-xs font-black uppercase tracking-[0.14em] text-slate-600">
                        {member.role}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </Layout>
  );
}

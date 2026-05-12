import { useEffect, useMemo, useState } from "react";
import Layout from "../components/Layout";
import { isAdmin } from "../utils/auth";
import { getUsers, updateUserRole } from "../services/api";

export default function Admin() {
  const admin = isAdmin();
  const [users, setUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState("All");
  const [loading, setLoading] = useState(admin);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getUsers();
      setUsers(res?.data?.data || []);
    } catch (err) {
      setError(err || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!admin) return;

    let ignore = false;
    const loadUsers = async () => {
      try {
        const res = await getUsers();
        if (!ignore) setUsers(res?.data?.data || []);
      } catch (err) {
        if (!ignore) setError(err || "Failed to load users");
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    loadUsers();
    return () => {
      ignore = true;
    };
  }, [admin]);

  const filteredUsers = useMemo(() => {
    if (roleFilter === "All") return users;
    return users.filter((user) => user.role === roleFilter);
  }, [roleFilter, users]);

  const counts = useMemo(() => ({
    total: users.length,
    admins: users.filter((user) => user.role === "Admin").length,
    members: users.filter((user) => user.role === "Member").length,
  }), [users]);

  const changeRole = async (id, role) => {
    try {
      setUpdatingId(id);
      setError("");
      await updateUserRole(id, role);
      await fetchUsers();
    } catch (err) {
      setError(err || "Failed to update role");
    } finally {
      setUpdatingId(null);
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
      <section className="mb-6 rounded-lg bg-slate-950 p-6 text-white">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-300">Admin Panel</p>
        <h1 className="mt-2 text-3xl font-black">User Roles & Access</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
          Keep admin and member responsibilities separate. Promote only trusted users who should manage projects, teams, and assignments.
        </p>
      </section>

      {error && <div className="mb-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{error}</div>}

      <section className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <Metric label="Total Users" value={counts.total} />
        <Metric label="Admins" value={counts.admins} />
        <Metric label="Members" value={counts.members} />
      </section>

      <div className="mb-4 flex flex-wrap gap-2">
        {["All", "Admin", "Member"].map((role) => (
          <button
            key={role}
            type="button"
            onClick={() => setRoleFilter(role)}
            className={`rounded px-3 py-2 text-sm font-bold ${
              roleFilter === role ? "bg-cyan-600 text-white" : "bg-white text-slate-600"
            }`}
          >
            {role}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="rounded-lg border border-slate-200 bg-white p-6 text-slate-500">Loading users...</div>
      ) : filteredUsers.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center">
          <h2 className="text-xl font-black">No users found</h2>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left">
              <thead className="bg-slate-50 text-sm text-slate-500">
                <tr>
                  <th className="p-4">User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-t border-slate-200">
                    <td className="p-4 font-bold text-slate-950">{user.name}</td>
                    <td className="text-sm text-slate-600">{user.email}</td>
                    <td>
                      <span className={`rounded px-2 py-1 text-xs font-black uppercase tracking-[0.14em] ${
                        user.role === "Admin" ? "bg-cyan-100 text-cyan-800" : "bg-slate-100 text-slate-600"
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        disabled={updatingId === user.id}
                        onClick={() => changeRole(user.id, user.role === "Admin" ? "Member" : "Admin")}
                        className="rounded bg-slate-950 px-3 py-2 text-sm font-bold text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:bg-slate-400"
                      >
                        {updatingId === user.id ? "Updating..." : user.role === "Admin" ? "Make Member" : "Make Admin"}
                      </button>
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

function Metric({ label, value }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-bold text-slate-500">{label}</p>
      <p className="mt-2 text-4xl font-black">{value}</p>
    </div>
  );
}

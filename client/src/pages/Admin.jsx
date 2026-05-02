import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import API from "../services/api";
import { isAdmin } from "../utils/auth";
import { getUsers, updateUserRole } from "../services/api";

export default function Admin() {
  const admin = isAdmin(); // ✅ call once

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);

  // Fetch users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await API.get("/users");
      setUsers(res.data.data); // ✅ FIX

    } catch (err) {
      console.log(err);
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (admin) fetchUsers();
  }, [admin]);

  // Change role
  const changeRole = async (id, role) => {
    try {
      setUpdating(true);

      await API.put(`/users/${id}`, { role });

      fetchUsers();

    } catch (err) {
      console.log(err);
      setError("Failed to update role");
    } finally {
      setUpdating(false);
    }
  };

  // 🔐 Access protection
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
        Admin Panel 🛠️
      </h1>

      {error && (
        <p className="text-red-400 mb-4">{error}</p>
      )}

      {loading ? (
        <p className="text-gray-400">Loading users...</p>
      ) : users.length === 0 ? (
        <p className="text-gray-400">No users found</p>
      ) : (
        <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg">
          <table className="w-full text-left">
            <thead className="bg-gray-700 text-gray-300">
              <tr>
                <th className="p-3">Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t border-gray-700 hover:bg-gray-700/40 transition">
                  <td className="p-3">{u.name}</td>
                  <td>{u.email}</td>

                  <td>
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        u.role === "Admin"
                          ? "bg-purple-600"
                          : "bg-gray-600"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>

                  <td>
                    <button
                      disabled={updating}
                      onClick={() =>
                        changeRole(
                          u.id,
                          u.role === "Admin" ? "Member" : "Admin"
                        )
                      }
                      className={`px-3 py-1 rounded transition ${
                        updating
                          ? "bg-gray-600 cursor-not-allowed"
                          : "bg-purple-600 hover:bg-purple-700"
                      }`}
                    >
                      Toggle Role
                    </button>
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
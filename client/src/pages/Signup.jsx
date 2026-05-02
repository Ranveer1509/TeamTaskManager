import { useState } from "react";
import { signup } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSignup = async () => {
    // 🔍 Validation
    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      setError("All fields are required");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      setError("");
      setLoading(true);

      await signup({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      });

      // ✅ Redirect after success
      navigate("/");

    } catch (err) {
      // ⚠️ Your API returns string error
      setError(err || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  // ⌨️ Enter key support
  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSignup();
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-black text-white">

      <div className="backdrop-blur-lg bg-white/10 border border-white/20 p-8 rounded-2xl shadow-2xl w-96">

        <h2 className="text-3xl font-bold mb-6 text-center">
          Create Account
        </h2>

        {error && (
          <div className="bg-red-500/20 text-red-300 p-2 rounded mb-4 text-sm text-center">
            {error}
          </div>
        )}

        {/* Name */}
        <input
          placeholder="Name"
          value={form.name}
          onKeyDown={handleKeyDown}
          className="w-full p-3 mb-3 bg-white/20 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onKeyDown={handleKeyDown}
          className="w-full p-3 mb-3 bg-white/20 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onKeyDown={handleKeyDown}
          className="w-full p-3 mb-4 bg-white/20 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        {/* Button */}
        <button
          onClick={handleSignup}
          disabled={loading}
          className={`w-full p-3 rounded-lg font-semibold transition ${
            loading
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-gradient-to-r from-purple-500 to-indigo-500 hover:opacity-90"
          }`}
        >
          {loading ? "Creating..." : "Signup"}
        </button>

        {/* Redirect */}
        <p
          onClick={() => navigate("/")}
          className="text-center mt-4 text-sm text-gray-300 cursor-pointer hover:text-white"
        >
          Already have an account? Login
        </p>
      </div>
    </div>
  );
}
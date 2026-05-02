import { useState } from "react";
import { login } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!form.email || !form.password) {
      setError("Email and password required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await login(form);

      if (res?.data?.token) {
        // 🔐 Store auth data
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.user.role);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        navigate("/dashboard");
      } else {
        setError("Invalid credentials");
      }

    } catch (err) {
      // ✅ Your API returns string error now
      setError(err || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // ⌨️ Enter key support
  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-black">

      <div className="backdrop-blur-lg bg-white/10 border border-white/20 p-8 rounded-2xl shadow-2xl w-96 text-white">

        <h2 className="text-3xl font-bold text-center mb-6">
          Welcome Back 👋
        </h2>

        {error && (
          <div className="bg-red-500/20 text-red-300 p-2 rounded mb-4 text-sm text-center">
            {error}
          </div>
        )}

        {/* Email */}
        <input
          type="email"
          value={form.email}
          onKeyDown={handleKeyDown}
          className="w-full p-3 bg-white/20 border border-white/30 rounded-lg mb-3 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Email"
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        {/* Password */}
        <input
          type="password"
          value={form.password}
          onKeyDown={handleKeyDown}
          className="w-full p-3 bg-white/20 border border-white/30 rounded-lg mb-4 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Password"
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        {/* Button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className={`w-full p-3 rounded-lg font-semibold transition ${
            loading
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-gradient-to-r from-purple-500 to-indigo-500 hover:opacity-90"
          }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Redirect */}
        <p className="text-sm text-center mt-4 text-gray-300">
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-purple-400 cursor-pointer hover:underline"
          >
            Signup
          </span>
        </p>
      </div>
    </div>
  );
}
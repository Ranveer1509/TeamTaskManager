import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Tasks from "./pages/Tasks";
import Signup from "./pages/Signup";
import Team from "./pages/Team";
import Admin from "./pages/Admin";
import { isLoggedIn } from "./utils/auth"; // ✅ IMPORT FIX

// 🔐 Protected Route
function PrivateRoute({ children }) {
  return isLoggedIn()
    ? children
    : <Navigate to="/" replace />;
}

// 🔓 Public Route
function PublicRoute({ children }) {
  return isLoggedIn()
    ? <Navigate to="/dashboard" replace />
    : children;
}

function App() {
  return (
    <Routes>

      {/* Public */}
      <Route path="/" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />

      {/* Protected */}
      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/projects" element={<PrivateRoute><Projects /></PrivateRoute>} />
      <Route path="/tasks/:projectId" element={<PrivateRoute><Tasks /></PrivateRoute>} />
      <Route path="/team" element={<PrivateRoute><Team /></PrivateRoute>} />
      <Route path="/admin" element={<PrivateRoute><Admin /></PrivateRoute>} />

      {/* Redirect */}
      <Route
        path="*"
        element={
          <Navigate
            to={isLoggedIn() ? "/dashboard" : "/"}
            replace
          />
        }
      />

    </Routes>
  );
}

export default App;
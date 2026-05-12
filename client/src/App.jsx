import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Tasks from "./pages/Tasks";
import Signup from "./pages/Signup";
import Team from "./pages/Team";
import Admin from "./pages/Admin";
import { isLoggedIn, isAdmin } from "./utils/auth";

function PrivateRoute({ children }) {
  return isLoggedIn() ? children : <Navigate to="/member-login" replace />;
}

function PublicRoute({ children }) {
  return isLoggedIn() ? <Navigate to="/dashboard" replace /> : children;
}

function AdminRoute({ children }) {
  if (!isLoggedIn()) {
    return <Navigate to="/admin-login" replace />;
  }

  return isAdmin() ? children : <Navigate to="/dashboard" replace />;
}

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to="/member-login" replace />}
      />

      <Route
        path="/member-login"
        element={
          <PublicRoute>
            <Login roleMode="Member" />
          </PublicRoute>
        }
      />

      <Route
        path="/admin-login"
        element={
          <PublicRoute>
            <Login roleMode="Admin" />
          </PublicRoute>
        }
      />

      <Route
        path="/signup"
        element={
          <PublicRoute>
            <Signup />
          </PublicRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />

      <Route
        path="/projects"
        element={
          <PrivateRoute>
            <Projects />
          </PrivateRoute>
        }
      />

      <Route
        path="/tasks/:projectId"
        element={
          <PrivateRoute>
            <Tasks />
          </PrivateRoute>
        }
      />

      <Route
        path="/team"
        element={
          <AdminRoute>
            <Team />
          </AdminRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <AdminRoute>
            <Admin />
          </AdminRoute>
        }
      />

      <Route
        path="*"
        element={<Navigate to={isLoggedIn() ? "/dashboard" : "/"} replace />}
      />
    </Routes>
  );
}

export default App;

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import RegisterPage from "./pages/register";
import LoginPage from "./pages/login";
import DashboardPage from "./pages/dashboard";
import CreateProjectPage from "./pages/create-project";
import AdminPanel from "./pages/admin-panel";

// Protected Route to check if user is an admin
function ProtectedAdminRoute({ children }) {
  const [isAdmin, setIsAdmin] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const response = await fetch("https://projecthub-38w5.onrender.com/users/admin", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (data.success) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } catch (err) {
        console.error("Admin check error:", err);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminStatus();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Redirect to login if not an admin
  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// Main App Component
function App() {
  useEffect(() => {
    // Check if the user is already logged in on page load (after refresh)
    const token = localStorage.getItem("authToken");
    if (!token) {
      window.location.href = "/login"; // Redirect to login if no token
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/projects/create" element={<CreateProjectPage />} />
        
        {/* Protected Admin Route */}
        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <AdminPanel />
            </ProtectedAdminRoute>
          }
        />
        
        {/* Redirect default route to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Catch all invalid routes and redirect to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

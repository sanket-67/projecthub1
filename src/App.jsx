import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import React from "react";
import RegisterPage from "./pages/register";
import LoginPage from "./pages/login";
import DashboardPage from "./pages/dashboard";
import CreateProjectPage from "./pages/create-project";
import AdminPanel from "./pages/admin-panel";
import NotFoundPage from "./pages/NotFound";
import { api } from "./utils/api";

// Loading spinner component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
  </div>
);

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
    return <LoadingSpinner />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function ProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        await api.getCurrentUser();
        setIsAuthenticated(true);
      } catch (err) {
        console.error("Auth check error:", err);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}

// Error boundary for routes
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Route error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center flex-col p-4">
          <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
          <p className="mb-4">We're sorry, but there was an error loading this page.</p>
          <button 
            onClick={() => {
              this.setState({ hasError: false });
              window.location.href = '/';
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Go to Home Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  return (
    <Router>
      <ErrorBoundary>
        <Routes>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<LoginPage />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } />
          <Route path="/projects/create" element={
            <ProtectedRoute>
              <CreateProjectPage />
            </ProtectedRoute>
          } />
          <Route
            path="/admin"
            element={
              <ProtectedAdminRoute>
                <AdminPanel />
              </ProtectedAdminRoute>
            }
          />
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </ErrorBoundary>
    </Router>
  );
}

export default App;

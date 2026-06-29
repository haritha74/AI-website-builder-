import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

export default function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="grid min-h-screen place-items-center bg-white text-ink dark:bg-[#0b1018] dark:text-white">Loading workspace...</div>;
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />;
}

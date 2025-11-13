import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function AdminRoute({ children }) {
  const { user, loading } = useContext(AuthContext);

  // ⏳ Evita redirect prematuri durante il recupero login
  if (loading) return null;

  // ❌ Non loggato → vai al login
  if (!user) return <Navigate to="/login" replace />;

  // ❌ Loggato ma non admin → vai alla home
  if (user.role !== "admin") return <Navigate to="/" replace />;

  // ✔️ Admin → acceso
  return children;
}

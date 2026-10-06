import { Navigate, Outlet } from "react-router-dom";
import type { Role } from "../api/types";
import { useAuth } from "./AuthContext";

export function RequireAuth() {
  const { user, ready } = useAuth();
  if (!ready) {
    return <p className="status-line">Cargando sesión…</p>;
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}

export function RequireRole({ roles }: { roles: Role[] }) {
  const { user } = useAuth();
  if (!user || !roles.includes(user.role)) {
    return (
      <section className="card">
        <h1>Sin permiso</h1>
        <p>Tu rol no puede abrir esta sección.</p>
      </section>
    );
  }
  return <Outlet />;
}

import { NavLink, Outlet } from "react-router-dom";
import { NavIcon } from "./CampusArt";
import { ROLE_LABEL } from "../domain/labels";
import { useAuth } from "../auth/AuthContext";

export function Layout() {
  const { user, logout } = useAuth();
  if (!user) {
    return null;
  }

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand-lockup">
          <span className="mark" aria-hidden="true">
            CF
          </span>
          <div>
            <p className="brand">CampusFlow</p>
            <p className="role">{ROLE_LABEL[user.role]}</p>
          </div>
        </div>
        <nav className="nav">
          <NavLink to="/" end>
            <NavIcon name="home" />
            Inicio
          </NavLink>
          <NavLink to="/solicitudes">
            <NavIcon name="list" />
            Solicitudes
          </NavLink>
          {user.role === "USER" && (
            <NavLink to="/solicitudes/nueva">
              <NavIcon name="plus" />
              Nueva solicitud
            </NavLink>
          )}
          {user.role === "ADMIN" && (
            <NavLink to="/usuarios">
              <NavIcon name="users" />
              Usuarios
            </NavLink>
          )}
          {user.role === "ADMIN" && (
            <NavLink to="/categorias">
              <NavIcon name="tags" />
              Categorías
            </NavLink>
          )}
        </nav>
        <div className="sidebar-foot">
          <p className="who">{user.fullName}</p>
          <button type="button" className="secondary" onClick={logout}>
            Cerrar sesión
          </button>
        </div>
      </aside>
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}

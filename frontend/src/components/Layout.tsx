import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { ROLE_LABEL } from "../domain/labels";
import { useAuth } from "../auth/AuthContext";
import { Icon, Mark } from "./Icons";

function casesActive(pathname: string) {
  return (
    pathname === "/solicitudes" ||
    (pathname.startsWith("/solicitudes/") && !pathname.startsWith("/solicitudes/nueva"))
  );
}

function titleFor(pathname: string) {
  if (pathname === "/") return "Inicio";
  if (pathname.startsWith("/solicitudes/nueva")) return "Nueva solicitud";
  if (pathname.startsWith("/solicitudes/")) return "Expediente";
  if (pathname.startsWith("/solicitudes")) return "Expedientes";
  if (pathname.startsWith("/usuarios")) return "Personas";
  if (pathname.startsWith("/categorias")) return "Oficios";
  return "CampusFlow";
}

export function Layout() {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  if (!user) {
    return null;
  }

  const page = titleFor(pathname);

  return (
    <div className="app">
      {open && (
        <button type="button" className="scrim" aria-label="Cerrar menú" onClick={() => setOpen(false)} />
      )}
      <aside className={open ? "sidebar open" : "sidebar"}>
        <div className="brand-lockup">
          <Mark />
          <div>
            <p className="brand">CampusFlow</p>
            <p className="brand-sub">Operaciones</p>
          </div>
        </div>
        <nav className="sidenav">
          <p className="nav-label">Principal</p>
          <NavLink to="/" end>
            <Icon name="home" /> Inicio
          </NavLink>
          <p className="nav-label">Gestión</p>
          <Link
            to="/solicitudes"
            className={casesActive(pathname) ? "active" : undefined}
            aria-current={casesActive(pathname) ? "page" : undefined}
          >
            <Icon name="cases" /> Expedientes
          </Link>
          {user.role === "USER" && (
            <NavLink to="/solicitudes/nueva">
              <Icon name="plus" /> Radicar
            </NavLink>
          )}
          {user.role === "ADMIN" && (
            <>
              <p className="nav-label">Administración</p>
              <NavLink to="/usuarios">
                <Icon name="people" /> Personas
              </NavLink>
              <NavLink to="/categorias">
                <Icon name="tags" /> Oficios
              </NavLink>
            </>
          )}
        </nav>
      </aside>
      <div className="workspace">
        <header className="topbar">
          <div className="topbar-lead">
            <button type="button" className="icon-btn" aria-label="Abrir menú" onClick={() => setOpen(true)}>
              <Icon name="menu" />
            </button>
            <p className="crumb">
              CampusFlow <span>/</span> {page}
            </p>
          </div>
          <div className="account">
            <div>
              <p className="account-name">{user.fullName}</p>
              <p className="account-role">{ROLE_LABEL[user.role]}</p>
            </div>
            <button type="button" className="btn btn-secondary" onClick={logout}>
              Cerrar sesión
            </button>
          </div>
        </header>
        <main className="workspace-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

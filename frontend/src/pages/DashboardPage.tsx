import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import type { RequestPage, RequestStatus, RequestSummary, RequestSummaryCounts } from "../api/types";
import { StatusBadge } from "../components/StatusBadge";
import { STATUS_LABEL } from "../domain/labels";
import { useAuth } from "../auth/AuthContext";

const PATH: RequestStatus[] = ["PENDING", "IN_REVIEW", "IN_PROGRESS", "RESOLVED", "CLOSED", "CANCELLED"];

const HOME = {
  USER: {
    title: "Mis trámites",
    sub: "Radica una solicitud o abre el caso que sigue pendiente.",
    note: "Como estudiante solo ves y mueves tus propias solicitudes.",
  },
  STAFF: {
    title: "Bandeja de trabajo",
    sub: "Toma los pendientes y avanza el estado de los casos que tienes a cargo.",
    note: "Como personal encargado puedes asignarte un pendiente y cambiar su estado.",
  },
  ADMIN: {
    title: "Operación del campus",
    sub: "Supervisa los casos y administra personas y oficios.",
    note: "Como administrador puedes asignar, mover estados, y cuidar cuentas y categorías.",
  },
} as const;

export function DashboardPage() {
  const { user } = useAuth();
  const [summary, setSummary] = useState<RequestSummaryCounts | null>(null);
  const [lead, setLead] = useState<RequestSummary | null | undefined>(undefined);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const counts = await api<RequestSummaryCounts>("/api/requests/summary");
      const pending = await api<RequestPage>("/api/requests?status=PENDING");
      const opened = pending.items[0] ? pending : await api<RequestPage>("/api/requests");
      if (cancelled) return;
      setSummary(counts);
      setLead(opened.items[0] ?? null);
    }
    load().catch((caught: unknown) => {
      if (!cancelled) setError(caught instanceof Error ? caught.message : "No se pudo cargar el inicio.");
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="page">
      <header className="page-header">
        <div>
          <h1>{user ? HOME[user.role].title : "Inicio"}</h1>
          <p className="sub">{user ? HOME[user.role].sub : "El caso que necesita atención y el conteo real de cada estado."}</p>
        </div>
        <div className="header-actions">
          {user?.role === "USER" && (
            <Link className="btn btn-primary" to="/solicitudes/nueva">
              Nueva solicitud
            </Link>
          )}
          {user?.role === "ADMIN" && (
            <>
              <Link className="btn btn-secondary" to="/usuarios">
                Personas
              </Link>
              <Link className="btn btn-secondary" to="/categorias">
                Oficios
              </Link>
            </>
          )}
        </div>
      </header>
      {error && (
        <p className="alert" role="alert">
          {error}
        </p>
      )}
      {lead === undefined && !error && <p className="status-line">Cargando…</p>}
      <div className="home-grid">
        {lead && (
          <Link className="panel attention" to={`/solicitudes/${lead.id}`}>
            <p className="kicker">Requiere atención</p>
            <span className="code">{lead.code}</span>
            <h1>{lead.title}</h1>
            <StatusBadge status={lead.status} />
            <p className="meta-line">
              {lead.category.name} · {lead.assignee?.fullName ?? "Sin responsable"}
            </p>
          </Link>
        )}
        {lead === null && (
          <div className="panel empty">
            <strong>No hay casos abiertos</strong>
            El archivo todavía no tiene solicitudes.
          </div>
        )}
        {summary && (
          <nav className="panel rail" aria-label="Estados">
            {PATH.map((status) => (
              <Link
                key={status}
                className={status === "PENDING" && summary.byStatus.PENDING > 0 ? "waiting" : undefined}
                to={`/solicitudes?status=${status}`}
              >
                <span>{STATUS_LABEL[status]}</span>
                <strong>{summary.byStatus[status]}</strong>
              </Link>
            ))}
          </nav>
        )}
      </div>
      {user && <p className="note">{HOME[user.role].note}</p>}
    </section>
  );
}

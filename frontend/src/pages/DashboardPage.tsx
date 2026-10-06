import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import type { RequestStatus, RequestSummaryCounts } from "../api/types";
import { StatusBadge } from "../components/StatusBadge";
import { ROLE_LABEL, STATUS_LABEL } from "../domain/labels";
import { useAuth } from "../auth/AuthContext";

const ORDER: RequestStatus[] = [
  "PENDING",
  "IN_REVIEW",
  "IN_PROGRESS",
  "RESOLVED",
  "CLOSED",
  "CANCELLED",
];

export function DashboardPage() {
  const { user } = useAuth();
  const [summary, setSummary] = useState<RequestSummaryCounts | null>(null);
  const [error, setError] = useState("");
  const firstName = user?.fullName.split(" ")[0] ?? "";

  useEffect(() => {
    api<RequestSummaryCounts>("/api/requests/summary")
      .then(setSummary)
      .catch((caught: unknown) =>
        setError(caught instanceof Error ? caught.message : "No se pudo cargar el resumen."),
      );
  }, []);

  return (
    <section>
      <header className="hero">
        <div>
          <p className="eyebrow">Panel</p>
          <h1>Hola, {firstName}</h1>
          <p className="lede">
            Entras como {user ? ROLE_LABEL[user.role].toLowerCase() : "usuario"}. Elige un estado
            para ver solo esas solicitudes.
          </p>
        </div>
        <Link className="button-link" to="/solicitudes">
          Ver solicitudes
        </Link>
      </header>
      {error && (
        <p className="alert" role="alert">
          {error}
        </p>
      )}
      {!summary && !error && <p className="status-line">Cargando resumen…</p>}
      {summary && (
        <div className="cards">
          {ORDER.map((status) => (
            <Link className="card stat" key={status} to={`/solicitudes?status=${status}`}>
              <StatusBadge status={status} />
              <strong>{summary.byStatus[status]}</strong>
              <span>{STATUS_LABEL[status]}</span>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

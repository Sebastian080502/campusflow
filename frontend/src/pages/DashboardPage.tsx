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

  useEffect(() => {
    api<RequestSummaryCounts>("/api/requests/summary")
      .then(setSummary)
      .catch((caught: unknown) =>
        setError(caught instanceof Error ? caught.message : "No se pudo cargar el resumen."),
      );
  }, []);

  return (
    <section>
      <h1>Inicio</h1>
      <p>
        {user ? `${user.fullName}, entras como ${ROLE_LABEL[user.role].toLowerCase()}.` : ""}
      </p>
      {error && (
        <p className="alert" role="alert">
          {error}
        </p>
      )}
      {!summary && !error && <p className="status-line">Cargando resumen…</p>}
      {summary && (
        <div className="cards">
          {ORDER.map((status) => (
            <article className="card" key={status}>
              <StatusBadge status={status} />
              <strong>{summary.byStatus[status]}</strong>
              <span>{STATUS_LABEL[status]}</span>
            </article>
          ))}
        </div>
      )}
      <p>
        <Link to="/solicitudes">Ver solicitudes</Link>
      </p>
    </section>
  );
}

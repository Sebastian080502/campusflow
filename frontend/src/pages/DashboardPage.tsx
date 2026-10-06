import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import type { RequestStatus, RequestSummaryCounts } from "../api/types";
import { CampusScene } from "../components/CampusArt";
import { StatusBadge } from "../components/StatusBadge";
import { ROLE_LABEL, STATUS_HINT, STATUS_LABEL } from "../domain/labels";
import { useAuth } from "../auth/AuthContext";

const ORDER: RequestStatus[] = [
  "PENDING",
  "IN_REVIEW",
  "IN_PROGRESS",
  "RESOLVED",
  "CLOSED",
  "CANCELLED",
];

const NEXT_STEP = {
  USER: "Crea una solicitud o abre las tuyas para ver en qué punto del camino van.",
  STAFF: "Toma una pendiente: al asignarla pasa a en revisión y queda a cargo de alguien.",
  ADMIN: "Además del seguimiento, desde el menú cuidas usuarios y categorías del campus.",
} as const;

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
      <header className="hero campus-hero">
        <div>
          <p className="eyebrow">Panel de seguimiento</p>
          <h1>Hola, {firstName}</h1>
          <p className="lede">
            Entras como {user ? ROLE_LABEL[user.role].toLowerCase() : "usuario"}. Cada tarjeta es un
            punto del recorrido: ábrela para ver solo esas solicitudes.
          </p>
          {user && <p className="lede">{NEXT_STEP[user.role]}</p>}
          <Link className="button-link" to="/solicitudes">
            Ver solicitudes
          </Link>
        </div>
        <CampusScene />
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
              <small>{STATUS_HINT[status]}</small>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

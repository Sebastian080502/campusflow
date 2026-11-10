import { FormEvent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api/client";
import type { AssigneeOption, RequestDetail, RequestStatus } from "../api/types";
import { useAuth } from "../auth/AuthContext";
import { StatusBadge } from "../components/StatusBadge";
import { HISTORY_LABEL, ROLE_LABEL, STATUS_ACTION, STATUS_HINT, STATUS_LABEL, formatWhen } from "../domain/labels";
import type { Role } from "../api/types";

const PATH: RequestStatus[] = ["PENDING", "IN_REVIEW", "IN_PROGRESS", "RESOLVED", "CLOSED"];

function roleNote(role: Role, isRequester: boolean): string {
  if (role === "USER") {
    return isRequester
      ? "Entras como estudiante y esta solicitud es tuya. Puedes comentar y retirarla mientras siga pendiente o en revisión."
      : "Entras como estudiante. Solo puedes abrir las solicitudes que tú radicaste.";
  }
  if (role === "STAFF") {
    return "Entras como personal encargado. Puedes tomar un pendiente y avanzar el estado cuando el caso está a tu cargo.";
  }
  return "Entras como administrador. Puedes asignar un responsable y mover el estado.";
}

export function RequestDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [request, setRequest] = useState<RequestDetail | null>(null);
  const [assignees, setAssignees] = useState<AssigneeOption[]>([]);
  const [assigneeId, setAssigneeId] = useState("");
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [confirmStatus, setConfirmStatus] = useState<RequestStatus | null>(null);

  async function reload() {
    const detail = await api<RequestDetail>(`/api/requests/${id}`);
    setRequest(detail);
    if (detail.capabilities.canAssign) {
      const options = await api<AssigneeOption[]>("/api/users/assignees");
      setAssignees(options);
      setAssigneeId((current) => current || options[0]?.id || "");
    }
  }

  useEffect(() => {
    reload().catch((caught: unknown) =>
      setError(caught instanceof Error ? caught.message : "No se pudo abrir la solicitud."),
    );
  }, [id]);

  async function run(action: () => Promise<void>) {
    setPending(true);
    setError("");
    try {
      await action();
      await reload();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "No se pudo completar la acción.");
    } finally {
      setPending(false);
      setConfirmStatus(null);
    }
  }

  async function assign(event: FormEvent) {
    event.preventDefault();
    await run(async () => {
      await api(`/api/requests/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ assigneeId }),
      });
    });
  }

  async function commentOn(event: FormEvent) {
    event.preventDefault();
    const body = comment.trim();
    if (!body) {
      setError("Escribe un comentario.");
      return;
    }
    await run(async () => {
      await api(`/api/requests/${id}/comments`, {
        method: "POST",
        body: JSON.stringify({ body }),
      });
      setComment("");
    });
  }

  if (!request && !error) {
    return <p className="status-line">Cargando solicitud…</p>;
  }
  if (!request) {
    return (
      <p className="alert" role="alert">
        {error}
      </p>
    );
  }

  const current = PATH.indexOf(request.status);

  return (
    <section className="page record">
      <header className="record-head">
        <div>
          <p className="code">{request.code}</p>
          <p className="identifier">Identificador {request.id}</p>
          <h1>{request.title}</h1>
        </div>
        <StatusBadge status={request.status} />
      </header>
      {user && <p className="panel panel-pad role-note">{roleNote(user.role, user.id === request.requester.id)}</p>}
      <section>
        <h2>Recorrido</h2>
        <p className="sub">Estado actual: {STATUS_LABEL[request.status]}. {STATUS_HINT[request.status]}</p>
      </section>
      {request.status === "CANCELLED" ? (
        <p className="alert">Este caso salió del recorrido. Quedó cancelado.</p>
      ) : (
        <ol className="stepper" aria-label="Recorrido de la solicitud">
          {PATH.map((status, index) => {
            const state = index < current ? "done" : index === current ? "current" : "";
            return (
              <li key={status} className={state} aria-current={state === "current" ? "step" : undefined}>
                {STATUS_LABEL[status]}
              </li>
            );
          })}
        </ol>
      )}
      <section className="panel panel-pad">
        <h2>Descripción</h2>
        <p className="description">{request.description}</p>
      </section>
      <dl className="panel facts">
        <div>
          <dt>Categoría</dt>
          <dd>{request.category.name}</dd>
        </div>
        <div>
          <dt>Solicitante</dt>
          <dd>{request.requester.fullName}</dd>
        </div>
        <div>
          <dt>Responsable</dt>
          <dd>{request.assignee?.fullName ?? "Sin asignar"}</dd>
        </div>
        <div>
          <dt>Actualizada</dt>
          <dd>{formatWhen(request.updatedAt)}</dd>
        </div>
      </dl>
      {error && (
        <p className="alert" role="alert">
          {error}
        </p>
      )}
      <div className="actions">
        {request.capabilities.canAssign && (
          <form className="inline-form" onSubmit={assign}>
            <label>
              Responsable
              <select value={assigneeId} onChange={(event) => setAssigneeId(event.target.value)}>
                {assignees.map((person) => (
                  <option key={person.id} value={person.id}>
                    {person.fullName}
                  </option>
                ))}
              </select>
            </label>
            <button className="btn btn-primary" type="submit" disabled={pending || !assigneeId}>
              Asignar
            </button>
          </form>
        )}
        {request.capabilities.statuses.map((status) => (
          <button
            key={status}
            type="button"
            className={status === "CANCELLED" ? "btn btn-danger" : "btn btn-secondary"}
            disabled={pending}
            onClick={() => setConfirmStatus(status)}
          >
            {STATUS_ACTION[status]}
          </button>
        ))}
      </div>
      {confirmStatus && (
        <div className="confirm">
          <p>¿Confirmas esta acción: {STATUS_ACTION[confirmStatus]}?</p>
          <button
            className="btn btn-primary"
            type="button"
            disabled={pending}
            onClick={() =>
              run(async () => {
                await api(`/api/requests/${id}`, {
                  method: "PATCH",
                  body: JSON.stringify({ status: confirmStatus }),
                });
              })
            }
          >
            Confirmar
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => setConfirmStatus(null)}>
            Volver
          </button>
        </div>
      )}
      <section className="panel panel-pad">
      <h2>Comentarios</h2>
      {request.comments.length === 0 && <p className="field-note">Todavía no hay comentarios.</p>}
      <ul className="feed">
        {request.comments.map((item) => (
          <li key={item.id}>
            <strong>{item.author.fullName}</strong>
            <span>{formatWhen(item.createdAt)}</span>
            <p>{item.body}</p>
          </li>
        ))}
      </ul>
      {request.capabilities.canComment && (
        <form className="form-grid" onSubmit={commentOn}>
          <label>
            Nuevo comentario
            <textarea value={comment} onChange={(event) => setComment(event.target.value)} rows={3} />
          </label>
          <button className="btn btn-primary" type="submit" disabled={pending}>
            Publicar comentario
          </button>
        </form>
      )}
      </section>
      <section className="panel panel-pad">
      <h2>Trazabilidad</h2>
      <p className="field-note">Quién hizo el cambio, cuándo y qué ocurrió.</p>
      <ol className="feed">
        {request.history.map((entry) => (
          <li key={entry.id}>
            <strong>{entry.actor.fullName}</strong>
            <span>
              {entry.actor.role in ROLE_LABEL ? ROLE_LABEL[entry.actor.role as Role] : entry.actor.role}
              {" · "}
              {HISTORY_LABEL[entry.type] ?? entry.type}
              {" · "}
              {formatWhen(entry.createdAt)}
            </span>
            <p>{entry.note}</p>
          </li>
        ))}
      </ol>
      </section>
    </section>
  );
}

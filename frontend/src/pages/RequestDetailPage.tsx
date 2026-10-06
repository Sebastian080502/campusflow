import { FormEvent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api/client";
import type { AssigneeOption, RequestDetail, RequestStatus } from "../api/types";
import { StatusBadge } from "../components/StatusBadge";
import { STATUS_ACTION, STATUS_LABEL, formatWhen } from "../domain/labels";

const PATH: RequestStatus[] = ["PENDING", "IN_REVIEW", "IN_PROGRESS", "RESOLVED", "CLOSED"];

export function RequestDetailPage() {
  const { id } = useParams();
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

  return (
    <section className="detail">
      <header className="page-header">
        <div>
          <p className="code">{request.code}</p>
          <h1>{request.title}</h1>
        </div>
        <StatusBadge status={request.status} />
      </header>
      <p>{request.description}</p>
      {request.status === "CANCELLED" ? (
        <p className="field-note">Esta solicitud se canceló y ya no continúa el recorrido.</p>
      ) : (
        <ol className="stepper" aria-label="Recorrido de la solicitud">
          {PATH.map((status, index) => {
            const current = PATH.indexOf(request.status);
            const state = index < current ? "done" : index === current ? "current" : "";
            return (
              <li key={status} className={state} aria-current={state === "current" ? "step" : undefined}>
                {STATUS_LABEL[status]}
              </li>
            );
          })}
        </ol>
      )}
      <dl className="meta">
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
            <button type="submit" disabled={pending || !assigneeId}>
              Asignar
            </button>
          </form>
        )}
        {request.capabilities.statuses.map((status) => (
          <button
            key={status}
            type="button"
            className={status === "CANCELLED" ? "danger" : undefined}
            disabled={pending}
            onClick={() => setConfirmStatus(status)}
          >
            {STATUS_ACTION[status]}
          </button>
        ))}
      </div>
      {confirmStatus && (
        <div className="card confirm">
          <p>¿Confirmas esta acción: {STATUS_ACTION[confirmStatus]}?</p>
          <button
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
          <button type="button" className="secondary" onClick={() => setConfirmStatus(null)}>
            Volver
          </button>
        </div>
      )}
      <h2>Comentarios</h2>
      {request.comments.length === 0 && <p>Todavía no hay comentarios.</p>}
      <ul className="timeline">
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
          <button type="submit" disabled={pending}>
            Publicar comentario
          </button>
        </form>
      )}
      <h2>Historial</h2>
      <ol className="timeline">
        {request.history.map((entry) => (
          <li key={entry.id}>
            <strong>{entry.actor.fullName}</strong>
            <span>{formatWhen(entry.createdAt)}</span>
            <p>{entry.note}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

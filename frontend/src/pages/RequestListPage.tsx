import { FormEvent, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import type { Category, RequestPage, RequestStatus } from "../api/types";
import { StatusBadge } from "../components/StatusBadge";
import { STATUS_LABEL, formatWhen } from "../domain/labels";
import { useAuth } from "../auth/AuthContext";

export function RequestListPage() {
  const { user } = useAuth();
  const [page, setPage] = useState<RequestPage | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [q, setQ] = useState("");

  async function load(nextStatus = status, nextCategory = categoryId, nextQuery = q) {
    const params = new URLSearchParams();
    if (nextStatus) params.set("status", nextStatus);
    if (nextCategory) params.set("categoryId", nextCategory);
    if (nextQuery) params.set("q", nextQuery);
    const suffix = params.size ? `?${params.toString()}` : "";
    const result = await api<RequestPage>(`/api/requests${suffix}`);
    setPage(result);
  }

  useEffect(() => {
    load().catch((caught: unknown) =>
      setError(caught instanceof Error ? caught.message : "No se pudieron cargar las solicitudes."),
    );
    api<Category[]>("/api/categories")
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  function onFilter(event: FormEvent) {
    event.preventDefault();
    load().catch((caught: unknown) =>
      setError(caught instanceof Error ? caught.message : "No se pudo filtrar."),
    );
  }

  return (
    <section>
      <header className="page-header">
        <h1>{user?.role === "USER" ? "Mis solicitudes" : "Solicitudes"}</h1>
        {user?.role === "USER" && <Link to="/solicitudes/nueva">Nueva solicitud</Link>}
      </header>
      <form className="filters" onSubmit={onFilter}>
        <label>
          Estado
          <select value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="">Todos</option>
            {(Object.keys(STATUS_LABEL) as RequestStatus[]).map((item) => (
              <option key={item} value={item}>
                {STATUS_LABEL[item]}
              </option>
            ))}
          </select>
        </label>
        <label>
          Categoría
          <select value={categoryId} onChange={(event) => setCategoryId(event.target.value)}>
            <option value="">Todas</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Buscar
          <input value={q} onChange={(event) => setQ(event.target.value)} placeholder="Código o título" />
        </label>
        <button type="submit">Filtrar</button>
      </form>
      {error && (
        <p className="alert" role="alert">
          {error}
        </p>
      )}
      {!page && !error && <p className="status-line">Cargando solicitudes…</p>}
      {page && page.items.length === 0 && <p>No hay solicitudes con esos criterios.</p>}
      {page && page.items.length > 0 && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Código</th>
                <th>Título</th>
                <th>Categoría</th>
                <th>Estado</th>
                <th>Responsable</th>
                <th>Actualizada</th>
              </tr>
            </thead>
            <tbody>
              {page.items.map((item) => (
                <tr key={item.id}>
                  <td data-label="Código">
                    <Link to={`/solicitudes/${item.id}`}>{item.code}</Link>
                  </td>
                  <td data-label="Título">{item.title}</td>
                  <td data-label="Categoría">{item.category.name}</td>
                  <td data-label="Estado">
                    <StatusBadge status={item.status} />
                  </td>
                  <td data-label="Responsable">{item.assignee?.fullName ?? "Sin asignar"}</td>
                  <td data-label="Actualizada">{formatWhen(item.updatedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

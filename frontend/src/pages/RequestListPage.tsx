import { FormEvent, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { api } from "../api/client";
import type { Category, RequestPage, RequestStatus } from "../api/types";
import { StatusBadge } from "../components/StatusBadge";
import { STATUS_LABEL, formatWhen } from "../domain/labels";
import { useAuth } from "../auth/AuthContext";

export function RequestListPage() {
  const { user } = useAuth();
  const [params, setParams] = useSearchParams();
  const [page, setPage] = useState<RequestPage | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState("");
  const [status, setStatus] = useState(params.get("status") ?? "");
  const [categoryId, setCategoryId] = useState(params.get("categoryId") ?? "");
  const [q, setQ] = useState(params.get("q") ?? "");

  async function load(nextStatus = status, nextCategory = categoryId, nextQuery = q, nextPage = Number(params.get("page") ?? "1")) {
    const params = new URLSearchParams();
    if (nextStatus) params.set("status", nextStatus);
    if (nextCategory) params.set("categoryId", nextCategory);
    if (nextQuery) params.set("q", nextQuery);
    if (nextPage > 1) params.set("page", String(nextPage));
    const suffix = params.size ? `?${params.toString()}` : "";
    const result = await api<RequestPage>(`/api/requests${suffix}`);
    setPage(result);
  }

  useEffect(() => {
    const nextStatus = params.get("status") ?? "";
    const nextCategory = params.get("categoryId") ?? "";
    const nextQuery = params.get("q") ?? "";
    const nextPage = Number(params.get("page") ?? "1");
    setStatus(nextStatus);
    setCategoryId(nextCategory);
    setQ(nextQuery);
    load(nextStatus, nextCategory, nextQuery, nextPage).catch((caught: unknown) =>
      setError(caught instanceof Error ? caught.message : "No se pudieron cargar las solicitudes."),
    );
    api<Category[]>("/api/categories")
      .then(setCategories)
      .catch(() => setCategories([]));
  }, [params]);

  function onFilter(event: FormEvent) {
    event.preventDefault();
    const next = new URLSearchParams();
    if (status) next.set("status", status);
    if (categoryId) next.set("categoryId", categoryId);
    if (q.trim()) next.set("q", q.trim());
    setParams(next);
  }

  return (
    <section className="page">
      <header className="page-header">
        <div>
          <h1>{user?.role === "USER" ? "Mis solicitudes" : "Expedientes"}</h1>
          <p className="sub">
            {user?.role === "USER"
              ? "Solo ves las que tú enviaste. El código abre el caso."
              : "El código abre el caso para asignar, comentar o cambiar el estado."}
          </p>
        </div>
        {user?.role === "USER" && (
          <Link className="btn btn-primary" to="/solicitudes/nueva">
            Nueva solicitud
          </Link>
        )}
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
        <button className="btn btn-secondary" type="submit">
          Filtrar
        </button>
      </form>
      {error && (
        <p className="alert" role="alert">
          {error}
        </p>
      )}
      {!page && !error && <p className="status-line">Cargando solicitudes…</p>}
      {page && page.items.length === 0 && (
        <div className="panel empty">
          <strong>Sin resultados</strong>
          No hay solicitudes con esos criterios.
        </div>
      )}
      {page && page.items.length > 0 && (
        <div className="panel table-wrap">
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
                    <Link className="code" to={`/solicitudes/${item.id}`}>
                      {item.code}
                    </Link>
                    <span className="identifier">{item.id}</span>
                  </td>
                  <td data-label="Título">
                    <Link to={`/solicitudes/${item.id}`}>{item.title}</Link>
                  </td>
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
      {page && page.total > 0 && (
        <nav className="pagination" aria-label="Paginación de solicitudes">
          <span>Mostrando {(page.page - 1) * page.pageSize + 1}–{Math.min(page.page * page.pageSize, page.total)} de {page.total} solicitudes</span>
          <div>
            <button
              className="btn btn-secondary"
              type="button"
              disabled={page.page <= 1}
              onClick={() => { const next = new URLSearchParams(params); next.set("page", String(page.page - 1)); setParams(next); }}
            >Anterior</button>
            <span className="pagination-page">Página {page.page} de {Math.max(1, Math.ceil(page.total / page.pageSize))}</span>
            <button
              className="btn btn-secondary"
              type="button"
              disabled={page.page * page.pageSize >= page.total}
              onClick={() => { const next = new URLSearchParams(params); next.set("page", String(page.page + 1)); setParams(next); }}
            >Siguiente</button>
          </div>
        </nav>
      )}
    </section>
  );
}

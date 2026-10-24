import { FormEvent, useEffect, useState } from "react";
import { api } from "../api/client";
import type { Category } from "../api/types";

export function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [creating, setCreating] = useState(false);

  async function reload() {
    setCategories(await api<Category[]>("/api/categories"));
  }

  useEffect(() => {
    reload().catch((caught: unknown) =>
      setError(caught instanceof Error ? caught.message : "No se pudieron cargar las categorías."),
    );
  }, []);

  async function create(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setPending(true);
    setError("");
    try {
      await api("/api/categories", {
        method: "POST",
        body: JSON.stringify({
          name: String(form.get("name") ?? ""),
          description: String(form.get("description") ?? ""),
        }),
      });
      event.currentTarget.reset();
      setCreating(false);
      await reload();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "No se pudo crear la categoría.");
    } finally {
      setPending(false);
    }
  }

  async function toggle(category: Category) {
    setError("");
    try {
      await api(`/api/categories/${category.id}`, {
        method: "PATCH",
        body: JSON.stringify({ active: !category.active }),
      });
      await reload();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "No se pudo actualizar la categoría.");
    }
  }

  return (
    <section className="page">
      <header className="page-header">
        <div>
          <h1>Oficios</h1>
          <p className="sub">Gestiona las categorías disponibles para clasificar las solicitudes.</p>
        </div>
        <button className="btn btn-primary" type="button" onClick={() => setCreating((value) => !value)}>
          Nueva categoría
        </button>
      </header>
      {error && (
        <p className="alert" role="alert">
          {error}
        </p>
      )}
      {creating && (
        <form className="panel panel-pad form-grid composer" onSubmit={create}>
          <h2>Nueva categoría</h2>
          <label>
            Nombre de la categoría
            <input name="name" required minLength={3} maxLength={80} />
          </label>
          <label>
            Descripción
            <input name="description" maxLength={500} />
          </label>
          <div className="btn-row">
            <button
              className="btn btn-secondary"
              type="button"
              onClick={(event) => {
                event.currentTarget.form?.reset();
                setCreating(false);
              }}
            >
              Cancelar
            </button>
            <button className="btn btn-primary" type="submit" disabled={pending}>
              {pending ? "Guardando…" : "Crear categoría"}
            </button>
          </div>
        </form>
      )}
      <div className="panel rows">
        {categories.length === 0 && (
          <p className="empty">
            <strong>Sin oficios</strong>
            Crea la primera categoría para clasificar solicitudes.
          </p>
        )}
        {categories.map((category) => (
          <div className="row" key={category.id}>
            <div>
              <strong>{category.name}</strong>
              {category.description && <p>{category.description}</p>}
            </div>
            <button
              type="button"
              className={`badge${category.active ? " on" : ""}`}
              aria-pressed={category.active}
              onClick={() => toggle(category)}
            >
              <span className="dot" aria-hidden="true" />
              {category.active ? "Activa" : "Inactiva"}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

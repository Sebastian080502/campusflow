import { FormEvent, useEffect, useState } from "react";
import { api } from "../api/client";
import type { Category } from "../api/types";

export function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

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
    <section>
      <h1>Categorías</h1>
      {error && (
        <p className="alert" role="alert">
          {error}
        </p>
      )}
      <form className="card form-grid" onSubmit={create}>
        <h2>Nueva categoría</h2>
        <label>
          Nombre
          <input name="name" required minLength={3} maxLength={80} />
        </label>
        <label>
          Descripción
          <input name="description" maxLength={500} />
        </label>
        <button type="submit" disabled={pending}>
          {pending ? "Guardando…" : "Crear categoría"}
        </button>
      </form>
      <ul className="category-list">
        {categories.map((category) => (
          <li key={category.id}>
            <div>
              <strong>{category.name}</strong>
              <p>{category.description}</p>
            </div>
            <button type="button" className="secondary" onClick={() => toggle(category)}>
              {category.active ? "Activa" : "Inactiva"}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

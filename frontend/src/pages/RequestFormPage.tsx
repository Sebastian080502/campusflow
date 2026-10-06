import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import type { Category, RequestDetail } from "../api/types";

export function RequestFormPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    api<Category[]>("/api/categories")
      .then((items) => setCategories(items.filter((item) => item.active)))
      .catch((caught: unknown) =>
        setError(caught instanceof Error ? caught.message : "No se pudieron cargar las categorías."),
      );
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const title = String(form.get("title") ?? "").trim();
    const description = String(form.get("description") ?? "").trim();
    const categoryId = String(form.get("categoryId") ?? "");
    if (title.length < 5 || description.length < 10 || !categoryId) {
      setError("Completa categoría, título (mínimo 5) y descripción (mínimo 10).");
      return;
    }
    setPending(true);
    setError("");
    try {
      const created = await api<RequestDetail>("/api/requests", {
        method: "POST",
        body: JSON.stringify({ title, description, categoryId }),
      });
      navigate(`/solicitudes/${created.id}`);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "No se pudo crear la solicitud.");
    } finally {
      setPending(false);
    }
  }

  return (
    <section>
      <h1>Nueva solicitud</h1>
      <form className="card form-grid" onSubmit={onSubmit}>
        <label>
          Categoría
          <select name="categoryId" required defaultValue="">
            <option value="" disabled>
              Selecciona una categoría
            </option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Título
          <input name="title" required minLength={5} maxLength={120} />
        </label>
        <label>
          Descripción
          <textarea name="description" required minLength={10} maxLength={4000} rows={6} />
        </label>
        {error && (
          <p className="alert" role="alert">
            {error}
          </p>
        )}
        <button type="submit" disabled={pending}>
          {pending ? "Guardando…" : "Crear solicitud"}
        </button>
      </form>
    </section>
  );
}

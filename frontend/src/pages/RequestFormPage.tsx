import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import type { Category, RequestDetail } from "../api/types";
import { CampusScene } from "../components/CampusArt";

export function RequestFormPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const selected = categories.find((item) => item.id === categoryId);

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
      <header className="page-header">
        <div>
          <p className="eyebrow">Tu trámite</p>
          <h1>Nueva solicitud</h1>
          <p className="lede">Cuenta qué necesitas. El campus le asigna un código y un recorrido.</p>
        </div>
      </header>
      <div className="request-create">
        <form className="card form-grid" onSubmit={onSubmit}>
          <label>
            Categoría
            <select
              name="categoryId"
              required
              value={categoryId}
              onChange={(event) => setCategoryId(event.target.value)}
            >
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
          {selected?.description && <p className="field-note">{selected.description}</p>}
          <label>
            Título
            <input name="title" required minLength={5} maxLength={120} placeholder="Por ejemplo, Cambio de salón" />
          </label>
          <label>
            Descripción
            <textarea
              name="description"
              required
              minLength={10}
              maxLength={4000}
              rows={6}
              placeholder="Qué ocurre, dónde y qué esperas que resuelvan."
            />
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
        <aside className="card aside-note">
          <CampusScene compact />
          <h2>Qué ocurre después</h2>
          <ol>
            <li>Queda pendiente, con un código CF.</li>
            <li>Un responsable la toma y pasa a en revisión.</li>
            <li>Cuando haya respuesta, tú decides si la cierras.</li>
          </ol>
        </aside>
      </div>
    </section>
  );
}

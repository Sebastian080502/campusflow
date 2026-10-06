import { FormEvent, useEffect, useState } from "react";
import { api } from "../api/client";
import type { PublicUser, Role } from "../api/types";
import { ROLE_LABEL } from "../domain/labels";

const ROLES: Role[] = ["USER", "STAFF", "ADMIN"];

export function UsersPage() {
  const [users, setUsers] = useState<PublicUser[]>([]);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function reload() {
    setUsers(await api<PublicUser[]>("/api/users"));
  }

  useEffect(() => {
    reload().catch((caught: unknown) =>
      setError(caught instanceof Error ? caught.message : "No se pudieron cargar los usuarios."),
    );
  }, []);

  async function create(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setPending(true);
    setError("");
    try {
      await api("/api/users", {
        method: "POST",
        body: JSON.stringify({
          fullName: String(form.get("fullName") ?? ""),
          email: String(form.get("email") ?? ""),
          password: String(form.get("password") ?? ""),
          role: String(form.get("role") ?? "STAFF"),
        }),
      });
      event.currentTarget.reset();
      await reload();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "No se pudo crear el usuario.");
    } finally {
      setPending(false);
    }
  }

  async function update(user: PublicUser, change: { role?: Role; active?: boolean }) {
    setError("");
    try {
      await api(`/api/users/${user.id}`, {
        method: "PATCH",
        body: JSON.stringify(change),
      });
      await reload();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "No se pudo actualizar el usuario.");
    }
  }

  return (
    <section>
      <h1>Usuarios</h1>
      {error && (
        <p className="alert" role="alert">
          {error}
        </p>
      )}
      <form className="card form-grid" onSubmit={create}>
        <h2>Nuevo usuario</h2>
        <label>
          Nombre
          <input name="fullName" required minLength={3} />
        </label>
        <label>
          Correo
          <input name="email" type="email" required />
        </label>
        <label>
          Contraseña temporal
          <input name="password" type="password" required minLength={8} />
        </label>
        <label>
          Rol
          <select name="role" defaultValue="STAFF">
            {ROLES.map((role) => (
              <option key={role} value={role}>
                {ROLE_LABEL[role]}
              </option>
            ))}
          </select>
        </label>
        <button type="submit" disabled={pending}>
          {pending ? "Guardando…" : "Crear usuario"}
        </button>
      </form>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Rol</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td data-label="Nombre">{user.fullName}</td>
                <td data-label="Correo">{user.email}</td>
                <td data-label="Rol">
                  <select
                    value={user.role}
                    onChange={(event) => update(user, { role: event.target.value as Role })}
                  >
                    {ROLES.map((role) => (
                      <option key={role} value={role}>
                        {ROLE_LABEL[role]}
                      </option>
                    ))}
                  </select>
                </td>
                <td data-label="Estado">
                  <button
                    type="button"
                    className={`switch${user.active ? " on" : ""}`}
                    aria-pressed={user.active}
                    onClick={() => update(user, { active: !user.active })}
                  >
                    {user.active ? "Activo" : "Inactivo"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

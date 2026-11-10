import { FormEvent, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { api } from "../api/client";
import { Mark } from "../components/Icons";
import { PasswordField } from "../components/PasswordField";

export function ResetPasswordPage() {
  const [params] = useSearchParams();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const password = String(form.get("password") ?? "");
    const token = String(form.get("token") ?? "").trim();
    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }
    setPending(true);
    setError("");
    try {
      const response = await api<{ message: string }>("/api/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, password }),
      });
      setDone(response.message);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "No se pudo restablecer la contraseña.");
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="auth">
      <form className="panel auth-card" onSubmit={onSubmit}>
        <div className="auth-brand">
          <Mark />
          <div>
            <p className="brand">CampusFlow</p>
            <p className="brand-sub">Nueva contraseña</p>
          </div>
        </div>
        <h1>Restablecer</h1>
        <p className="sub">Pega el código de recuperación y elige una contraseña nueva.</p>
        {!done && (
          <>
            <label>
              Código
              <input name="token" required defaultValue={params.get("token") ?? ""} autoComplete="one-time-code" />
            </label>
            <PasswordField name="password" label="Nueva contraseña" autoComplete="new-password" minLength={8} />
          </>
        )}
        {error && (
          <p className="alert" role="alert">
            {error}
          </p>
        )}
        {done && <p className="field-note">{done}</p>}
        {!done && (
          <button className="btn btn-primary" type="submit" disabled={pending}>
            {pending ? "Guardando…" : "Guardar contraseña"}
          </button>
        )}
        <p className="field-note">
          <Link to="/login">Entrar</Link>
        </p>
      </form>
    </section>
  );
}

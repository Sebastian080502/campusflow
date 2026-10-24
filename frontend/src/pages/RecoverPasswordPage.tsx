import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import type { PasswordResetRequest } from "../api/types";
import { Mark } from "../components/Icons";

export function RecoverPasswordPage() {
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<PasswordResetRequest | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setPending(true);
    setError("");
    try {
      const response = await api<PasswordResetRequest>("/api/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email: String(form.get("email") ?? "") }),
      });
      setResult(response);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "No se pudo iniciar la recuperación.");
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
            <p className="brand-sub">Recuperar contraseña</p>
          </div>
        </div>
        <h1>Recuperar acceso</h1>
        <p className="sub">Escribe el correo de la cuenta. El código vence en 30 minutos y solo se usa una vez.</p>
        {!result && (
          <label>
            Correo
            <input name="email" type="email" autoComplete="email" required />
          </label>
        )}
        {error && (
          <p className="alert" role="alert">
            {error}
          </p>
        )}
        {result && <p className="field-note">{result.message}</p>}
        {result?.resetToken && (
          <p className="field-note">
            Este entorno local no envía correo, así que el código aparece aquí.{" "}
            <Link to={`/restablecer?token=${encodeURIComponent(result.resetToken)}`}>Definir una contraseña nueva</Link>
          </p>
        )}
        {!result && (
          <button className="btn btn-primary" type="submit" disabled={pending}>
            {pending ? "Enviando…" : "Pedir código"}
          </button>
        )}
        <p className="field-note">
          <Link to="/login">Volver a entrar</Link>
        </p>
      </form>
    </section>
  );
}

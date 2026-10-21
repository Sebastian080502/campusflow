import { FormEvent, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { Mark } from "../components/Icons";
import { PasswordField } from "../components/PasswordField";

export function LoginPage() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  if (user) return <Navigate to="/" replace />;

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setPending(true);
    setError("");
    try {
      await login(String(form.get("email") ?? ""), String(form.get("password") ?? ""));
      navigate("/");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "No se pudo iniciar sesión.");
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
            <p className="brand-sub">Operaciones del campus</p>
          </div>
        </div>
        <h1>Entrar</h1>
        <p className="sub">Usa el correo institucional para abrir tu sesión.</p>
        <label>
          Correo
          <input name="email" type="email" autoComplete="username" required />
        </label>
        <PasswordField name="password" label="Contraseña" autoComplete="current-password" />
        {error && (
          <p className="alert" role="alert">
            {error}
          </p>
        )}
        <button className="btn btn-primary" type="submit" disabled={pending}>
          {pending ? "Entrando…" : "Entrar"}
        </button>
        <p className="field-note">
          <Link to="/recuperar">Olvidé mi contraseña</Link>
        </p>
        <p className="field-note">
          ¿Primera vez? <Link to="/registro">Crear cuenta de estudiante</Link>
        </p>
        <p className="field-note">
          <a href="/api/docs">Documentación de la API</a>
        </p>
      </form>
    </section>
  );
}

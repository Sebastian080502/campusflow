import { FormEvent, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export function LoginPage() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  if (user) {
    return <Navigate to="/" replace />;
  }

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
    <section className="auth-screen">
      <div className="auth-hero">
        <p className="eyebrow">CampusFlow</p>
        <h1>El campus, con un solo hilo de seguimiento.</h1>
        <p>Registra una solicitud, mira quién la atiende y conserva el historial en un mismo lugar.</p>
        <ul className="auth-points">
          <li>El estudiante crea y consulta solo lo suyo.</li>
          <li>El personal asigna, comenta y cambia el estado.</li>
          <li>La administración cuida usuarios y categorías.</li>
        </ul>
      </div>
      <form className="card auth-card" onSubmit={onSubmit}>
        <p className="brand">Iniciar sesión</p>
        <p>Entra con tu correo institucional de demostración.</p>
        <label>
          Correo
          <input name="email" type="email" autoComplete="username" required />
        </label>
        <label>
          Contraseña
          <input name="password" type="password" autoComplete="current-password" required />
        </label>
        {error && (
          <p className="alert" role="alert">
            {error}
          </p>
        )}
        <button type="submit" disabled={pending}>
          {pending ? "Entrando…" : "Entrar"}
        </button>
        <p>
          ¿No tienes cuenta? <Link to="/registro">Regístrate como estudiante</Link>
        </p>
      </form>
    </section>
  );
}

import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const password = String(form.get("password") ?? "");
    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }
    setPending(true);
    setError("");
    try {
      await register(
        String(form.get("fullName") ?? ""),
        String(form.get("email") ?? ""),
        password,
      );
      navigate("/");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "No se pudo crear la cuenta.");
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="auth-screen">
      <form className="card auth-card" onSubmit={onSubmit}>
        <p className="brand">CampusFlow</p>
        <h1>Crear cuenta de estudiante</h1>
        <p>El personal y los administradores se crean desde el rol administrador.</p>
        <label>
          Nombre completo
          <input name="fullName" required minLength={3} maxLength={120} />
        </label>
        <label>
          Correo
          <input name="email" type="email" autoComplete="email" required />
        </label>
        <label>
          Contraseña
          <input name="password" type="password" autoComplete="new-password" required minLength={8} />
        </label>
        {error && (
          <p className="alert" role="alert">
            {error}
          </p>
        )}
        <button type="submit" disabled={pending}>
          {pending ? "Creando…" : "Crear cuenta"}
        </button>
        <p>
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </form>
    </section>
  );
}

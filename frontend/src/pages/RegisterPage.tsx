import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { CampusScene } from "../components/CampusArt";
import { PasswordField } from "../components/PasswordField";

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
      <div className="auth-hero">
        <CampusScene />
        <p className="eyebrow">CampusFlow</p>
        <h1>Abre tu cuenta y deja la solicitud en marcha.</h1>
        <p>El registro público crea solo cuentas de estudiante. El personal lo habilita un administrador.</p>
      </div>
      <form className="card auth-card" onSubmit={onSubmit}>
        <CampusScene compact />
        <p className="brand">Crear cuenta</p>
        <p>Usa un correo que todavía no esté registrado.</p>
        <label>
          Nombre completo
          <input name="fullName" required minLength={3} maxLength={120} />
        </label>
        <label>
          Correo
          <input name="email" type="email" autoComplete="email" required />
        </label>
        <PasswordField
          name="password"
          label="Contraseña"
          autoComplete="new-password"
          minLength={8}
        />
        <p className="field-note">Mínimo 8 caracteres. Puedes mostrarla para revisarla antes de crear la cuenta.</p>
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

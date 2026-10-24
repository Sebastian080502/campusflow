import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { Mark } from "../components/Icons";
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
      await register(String(form.get("fullName") ?? ""), String(form.get("email") ?? ""), password);
      navigate("/");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "No se pudo crear la cuenta.");
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
        <h1>Crear cuenta</h1>
        <p className="sub">El registro público abre solo cuentas de estudiante.</p>
        <label>
          Nombre completo
          <input name="fullName" required minLength={3} maxLength={120} />
        </label>
        <label>
          Correo
          <input name="email" type="email" autoComplete="email" required />
        </label>
        <PasswordField name="password" label="Contraseña" autoComplete="new-password" minLength={8} />
        <p className="field-note">Mínimo 8 caracteres. El ojo del campo la muestra antes de continuar.</p>
        {error && (
          <p className="alert" role="alert">
            {error}
          </p>
        )}
        <button className="btn btn-primary" type="submit" disabled={pending}>
          {pending ? "Creando…" : "Crear cuenta"}
        </button>
        <p className="field-note">
          ¿Ya tienes cuenta? <Link to="/login">Entrar</Link>
        </p>
      </form>
    </section>
  );
}

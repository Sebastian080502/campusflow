import { useId, useState } from "react";

type PasswordFieldProps = {
  name: string;
  label: string;
  autoComplete: string;
  minLength?: number;
  required?: boolean;
};

export function PasswordField({
  name,
  label,
  autoComplete,
  minLength,
  required = true,
}: PasswordFieldProps) {
  const id = useId();
  const [visible, setVisible] = useState(false);

  return (
    <div className="password-field">
      <label htmlFor={id}>{label}</label>
      <div className="password-row">
        <input
          id={id}
          name={name}
          type={visible ? "text" : "password"}
          autoComplete={autoComplete}
          required={required}
          minLength={minLength}
        />
        <button
          type="button"
          className="reveal"
          aria-pressed={visible}
          aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
          onClick={() => setVisible((current) => !current)}
        >
          {visible ? "Ocultar" : "Mostrar"}
        </button>
      </div>
    </div>
  );
}

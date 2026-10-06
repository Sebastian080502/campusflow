import { useId } from "react";

type CategoryKind = "academica" | "administrativa" | "tecnologica" | "infraestructura" | "otra";

function kindOf(name: string): CategoryKind {
  const value = name.toLowerCase();
  if (value.includes("acad")) return "academica";
  if (value.includes("admin")) return "administrativa";
  if (value.includes("tecno")) return "tecnologica";
  if (value.includes("infra")) return "infraestructura";
  return "otra";
}

export function CampusScene({ compact = false }: { compact?: boolean }) {
  const sky = `sky-${useId().replace(/:/g, "")}`;
  const roof = `roof-${useId().replace(/:/g, "")}`;

  return (
    <svg
      className={compact ? "campus-scene compact" : "campus-scene"}
      viewBox="0 0 640 400"
      role="img"
      aria-label="Campus con aulas, un sendero y una solicitud en camino"
    >
      <defs>
        <linearGradient id={sky} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f7f1e4" />
          <stop offset="1" stopColor="#d7efe4" />
        </linearGradient>
        <linearGradient id={roof} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#128466" />
          <stop offset="1" stopColor="#084737" />
        </linearGradient>
      </defs>
      <rect width="640" height="400" rx="28" fill={`url(#${sky})`} />
      <circle cx="520" cy="78" r="36" fill="#f2d7a2" />
      <ellipse cx="150" cy="86" rx="46" ry="16" fill="#fff" opacity="0.85" />
      <ellipse cx="188" cy="80" rx="34" ry="14" fill="#fff" opacity="0.9" />
      <path d="M0 292 C120 250 220 330 340 286 C460 242 540 300 640 268 L640 400 L0 400 Z" fill="#cfe6d4" />
      <path
        d="M48 348 C160 300 250 360 340 318 C430 276 520 340 600 300"
        fill="none"
        stroke="#0e6b52"
        strokeWidth="10"
        strokeLinecap="round"
      />
      <path
        d="M48 348 C160 300 250 360 340 318 C430 276 520 340 600 300"
        fill="none"
        stroke="#f6f3ea"
        strokeWidth="2"
        strokeDasharray="10 12"
        strokeLinecap="round"
      />
      <g>
        <rect x="78" y="168" width="150" height="132" rx="8" fill="#f7f1e4" />
        <path d="M68 176 L153 112 L238 176 Z" fill={`url(#${roof})`} />
        {[0, 1, 2].map((column) =>
          [0, 1].map((row) => (
            <rect
              key={`${column}-${row}`}
              x={98 + column * 40}
              y={188 + row * 42}
              width="22"
              height="26"
              rx="3"
              fill="#14352c"
            />
          )),
        )}
      </g>
      <g>
        <rect x="248" y="118" width="78" height="182" rx="8" fill="#f3efe4" />
        <rect x="236" y="108" width="102" height="22" rx="4" fill={`url(#${roof})`} />
        <circle cx="287" cy="168" r="18" fill="#f6f3ea" stroke="#0e6b52" strokeWidth="4" />
        <path d="M287 168 V156 M287 168 L296 174" stroke="#0e6b52" strokeWidth="2" strokeLinecap="round" />
      </g>
      <g>
        <rect x="360" y="188" width="176" height="112" rx="8" fill="#f7f1e4" />
        <rect x="348" y="172" width="200" height="22" rx="4" fill={`url(#${roof})`} />
        {[0, 1, 2, 3].map((column) => (
          <rect key={column} x={378 + column * 38} y="210" width="22" height="28" rx="3" fill="#14352c" />
        ))}
        <rect x="430" y="256" width="28" height="44" rx="3" fill="#0e6b52" />
      </g>
      <g transform="translate(292 246)">
        <rect width="86" height="64" rx="10" fill="#fffdf8" stroke="#0e6b52" strokeWidth="2" />
        <path d="M62 0 L86 22 L62 22 Z" fill="#d7f3e8" />
        <rect x="12" y="18" width="40" height="4" rx="2" fill="#0e6b52" />
        <rect x="12" y="28" width="52" height="3" rx="1.5" fill="#c9d7cf" />
        <rect x="12" y="36" width="46" height="3" rx="1.5" fill="#c9d7cf" />
      </g>
      <circle cx="46" cy="250" r="22" fill="#0e6b52" />
      <rect x="40" y="268" width="12" height="36" rx="4" fill="#8a5a32" />
      <circle cx="590" cy="236" r="26" fill="#128466" />
      <rect x="583" y="258" width="14" height="40" rx="4" fill="#8a5a32" />
    </svg>
  );
}

export function CategoryMark({ name }: { name: string }) {
  const kind = kindOf(name);
  return (
    <span className={`glyph glyph-${kind}`} aria-hidden="true">
      {kind === "academica" && (
        <svg viewBox="0 0 24 24">
          <path d="M3 8.5 12 4l9 4.5L12 13 3 8.5Z" />
          <path d="M7 10.5V15c0 1.4 2.2 3 5 3s5-1.6 5-3v-4.5" />
        </svg>
      )}
      {kind === "administrativa" && (
        <svg viewBox="0 0 24 24">
          <rect x="6" y="3" width="12" height="18" rx="2" />
          <path d="M9 8h6M9 12h6M9 16h4" />
        </svg>
      )}
      {kind === "tecnologica" && (
        <svg viewBox="0 0 24 24">
          <rect x="3" y="5" width="18" height="12" rx="2" />
          <path d="M8 20h8M12 17v3" />
        </svg>
      )}
      {kind === "infraestructura" && (
        <svg viewBox="0 0 24 24">
          <path d="M4 20V9l8-5 8 5v11" />
          <path d="M10 20v-6h4v6" />
        </svg>
      )}
      {kind === "otra" && (
        <svg viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="8" />
          <path d="M12 8v4M12 16h.01" />
        </svg>
      )}
    </span>
  );
}

const NAV_PATHS = {
  home: "M4 11.5 12 5l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-8.5Z",
  list: "M5 7h14M5 12h14M5 17h10",
  plus: "M12 6v12M6 12h12",
  users: "M8 19v-1.2A3.8 3.8 0 0 1 11.8 14h.4A3.8 3.8 0 0 1 16 17.8V19M12 11.5a2.6 2.6 0 1 0 0-5.2 2.6 2.6 0 0 0 0 5.2ZM18.5 19v-1a3 3 0 0 0-2.2-2.9M17 6.6a2.2 2.2 0 0 1 0 4.2",
  tags: "M4 12.5 11.2 5.3a2 2 0 0 1 1.4-.6H20v7.4a2 2 0 0 1-.6 1.4L12.5 20 4 12.5Z M16.5 8.5h.01",
} as const;

export function NavIcon({ name }: { name: keyof typeof NAV_PATHS }) {
  return (
    <svg className="nav-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d={NAV_PATHS[name]} />
    </svg>
  );
}

type IconProps = { name: "home" | "cases" | "people" | "tags" | "plus" | "menu" | "close" };

const PATHS: Record<IconProps["name"], string> = {
  home: "M4 11.2 12 4.5l8 6.7V20a1 1 0 0 1-1 1h-4.5v-5.5h-5V21H5a1 1 0 0 1-1-1v-8.8Z",
  cases: "M4 7.5h6l2 2h8a1 1 0 0 1 1 1V18a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8.5a1 1 0 0 1 1-1Z",
  people: "M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3.5 19.5v-1.2A4.3 4.3 0 0 1 7.8 14h2.4a4.3 4.3 0 0 1 4.3 4.3v1.2M16 11a2.4 2.4 0 1 0 0-4.8M16.2 14.2a4 4 0 0 1 3.8 3.6v1.7",
  tags: "M4 12.2 11.2 5h7.3v7.3L11.8 19.2 4 12.2Z M15.5 8.8h.01",
  plus: "M12 5v14M5 12h14",
  menu: "M4 7h16M4 12h16M4 17h16",
  close: "M6 6l12 12M18 6 6 18",
};

export function Icon({ name }: IconProps) {
  return (
    <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d={PATHS[name]} />
    </svg>
  );
}

export function Mark() {
  return (
    <svg className="mark" viewBox="0 0 32 32" role="img" aria-label="CampusFlow">
      <rect x="3" y="3" width="12" height="12" rx="3" fill="#0f6e56" />
      <rect x="17" y="3" width="12" height="12" rx="3" fill="#0f6e56" opacity="0.35" />
      <rect x="3" y="17" width="12" height="12" rx="3" fill="#0f6e56" opacity="0.35" />
      <rect x="17" y="17" width="12" height="12" rx="3" fill="#0f6e56" />
    </svg>
  );
}

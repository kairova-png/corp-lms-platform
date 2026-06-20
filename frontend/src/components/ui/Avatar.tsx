/** Аватар с инициалами (бренд-фон). */
export function Avatar({ name, size = 40 }: { name: string; size?: number }) {
  const initials = (name || "")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <span
      style={{ width: size, height: size, fontSize: size * 0.4 }}
      className="grid place-items-center rounded-full bg-brand text-brand-fg font-display font-bold flex-none"
    >
      {initials}
    </span>
  );
}

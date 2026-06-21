"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV, NavIcon } from "./navItems";

export function Sidebar() {
  const pathname = usePathname();
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <aside className="hidden md:block w-56 shrink-0 py-6">
      <nav className="sticky top-20 space-y-1">
        {NAV.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                active ? "bg-brand text-brand-fg" : "text-zinc-600 hover:bg-surface hover:text-brand"
              }`}
            >
              <NavIcon name={item.icon} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

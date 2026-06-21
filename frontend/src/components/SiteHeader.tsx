import Link from "next/link";
import { MobileNav } from "./MobileNav";

function initials(name: string): string {
  return name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}

export function SiteHeader({ fullname }: { fullname?: string }) {
  return (
    <header className="bg-brand text-brand-fg sticky top-0 z-20 shadow-sm">
      <div className="w-full px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <MobileNav />
          <Link href="/" className="flex items-center gap-2.5">
            <span className="grid place-items-center w-9 h-9 rounded-xl bg-white/15 font-display font-bold">CL</span>
            <span className="font-display font-bold text-lg">Corp LMS</span>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/notifications" aria-label="Уведомления" className="p-2 rounded-lg hover:bg-white/10 transition">
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 01-3.4 0" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
          {fullname && (
            <div className="flex items-center gap-3 text-sm pl-1">
              <span className="hidden sm:block opacity-90">{fullname}</span>
              <span className="grid place-items-center w-9 h-9 rounded-full bg-white/15 font-semibold">
                {initials(fullname)}
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

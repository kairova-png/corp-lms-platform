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
        {fullname && (
          <div className="flex items-center gap-3 text-sm">
            <span className="hidden sm:block opacity-90">{fullname}</span>
            <span className="grid place-items-center w-9 h-9 rounded-full bg-white/15 font-semibold">
              {initials(fullname)}
            </span>
          </div>
        )}
      </div>
    </header>
  );
}

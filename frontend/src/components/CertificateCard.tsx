import Link from "next/link";
import { Badge } from "@/components/ui";

export function CertificateCard({ course }: { course: any }) {
  return (
    <Link
      href={`/certificates/${course.id}`}
      className="group block rounded-2xl border border-zinc-200 bg-white overflow-hidden shadow-sm hover:shadow-md hover:border-brand/40 transition"
    >
      <div className="h-28 bg-gradient-to-br from-brand to-brand-dark grid place-items-center">
        <svg viewBox="0 0 24 24" className="w-12 h-12 text-white/90" fill="none" stroke="currentColor" strokeWidth="1.4">
          <circle cx="12" cy="9" r="5" />
          <path d="M9 13l-1 8 4-2 4 2-1-8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div className="p-4">
        <Badge tone="success">Сертификат</Badge>
        <h3 className="mt-2 font-display font-semibold text-ink leading-snug line-clamp-2">{course.fullname}</h3>
        <p className="mt-1 text-sm text-zinc-500">Доступен после прохождения</p>
      </div>
    </Link>
  );
}

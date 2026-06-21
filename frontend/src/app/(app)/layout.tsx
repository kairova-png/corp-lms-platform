import { SiteHeader } from "@/components/SiteHeader";
import { Sidebar } from "@/components/Sidebar";
import { getSiteInfo } from "@/lib/moodle";

export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  let fullname = "";
  try {
    fullname = (await getSiteInfo()).fullname;
  } catch {
    // header просто без имени
  }
  return (
    <div className="flex-1 flex flex-col">
      <SiteHeader fullname={fullname} />
      <div className="flex-1 w-full px-6 lg:px-8 flex gap-8">
        <Sidebar />
        <main className="flex-1 min-w-0 py-6">{children}</main>
      </div>
    </div>
  );
}

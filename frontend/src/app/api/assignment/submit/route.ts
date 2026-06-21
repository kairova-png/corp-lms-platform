import { NextResponse } from "next/server";
import { assignSave, assignFullStatus } from "@/lib/moodle";

export async function POST(req: Request) {
  try {
    const { assignid, courseid, cmid, text } = await req.json();
    await assignSave(Number(assignid), text);
    const st = await assignFullStatus(Number(courseid), Number(cmid));
    return NextResponse.json(st);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

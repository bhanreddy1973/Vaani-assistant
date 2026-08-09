import { NextResponse } from "next/server";
import { getFormById } from "@/lib/forms/catalog";

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const form = getFormById(params.id);
  if (!form) {
    return NextResponse.json({ error: "form not found" }, { status: 404 });
  }
  return NextResponse.json({ form });
}

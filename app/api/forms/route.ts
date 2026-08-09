import { NextResponse } from "next/server";
import { formCatalog, getFormsByCategory } from "@/lib/forms/catalog";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const forms = category ? getFormsByCategory(category) : formCatalog;
  return NextResponse.json({ forms });
}

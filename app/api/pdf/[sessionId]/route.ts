import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getFormById } from "@/lib/forms/catalog";
import { generateFilledFormPdf } from "@/lib/pdf";

export async function GET(_request: Request, { params }: { params: { sessionId: string } }) {
  const session = getSession(params.sessionId);
  if (!session || session.status !== "submitted" || !session.reference_number) {
    return NextResponse.json({ error: "form not yet submitted" }, { status: 404 });
  }

  const schema = getFormById(session.form_id);
  if (!schema) {
    return NextResponse.json({ error: "form not found" }, { status: 404 });
  }

  const pdfBytes = await generateFilledFormPdf(schema, session.fields, session.reference_number);

  return new NextResponse(Buffer.from(pdfBytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${session.form_id}-${session.reference_number}.pdf"`,
    },
  });
}

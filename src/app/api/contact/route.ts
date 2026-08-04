import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email, subject, message } = body;

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return NextResponse.json({ error: "Name, email, and message are required." }, { status: 400 });
  }

  await prisma.contactSubmission.create({
    data: {
      name: name.trim(),
      email: email.trim(),
      subject: subject?.trim() || "(no subject)",
      message: message.trim(),
    },
  });

  return NextResponse.json({ ok: true });
}

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { requireStudentSession } from "@/lib/studentAuth";

export async function PATCH(req: NextRequest) {
  let session;
  try {
    session = await requireStudentSession();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, phone, gender, dateOfBirth, currentPassword, newPassword } = await req.json();
  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  if (!user) return NextResponse.json({ error: "Account not found." }, { status: 404 });

  const profileData: { name?: string; phone?: string; gender?: string; dateOfBirth?: Date } = {};
  if (typeof name === "string" && name.trim()) profileData.name = name.trim();
  if (typeof phone === "string" && phone.trim()) profileData.phone = phone.trim();
  if (typeof gender === "string" && gender.trim()) profileData.gender = gender.trim();
  if (typeof dateOfBirth === "string" && dateOfBirth.trim()) profileData.dateOfBirth = new Date(dateOfBirth);

  if (Object.keys(profileData).length > 0) {
    await prisma.user.update({ where: { id: user.id }, data: profileData });
  }

  if (newPassword) {
    const valid = await bcrypt.compare(currentPassword ?? "", user.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: "Current password is incorrect." }, { status: 400 });
    }
    if (newPassword.length < 8) {
      return NextResponse.json({ error: "New password must be at least 8 characters." }, { status: 400 });
    }
    const passwordHash = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({ where: { id: user.id }, data: { passwordHash } });
  }

  return NextResponse.json({ ok: true });
}

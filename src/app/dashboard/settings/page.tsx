import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getStudentSession } from "@/lib/studentAuth";
import SettingsForm from "./SettingsForm";

export const dynamic = "force-dynamic";

export default async function DashboardSettingsPage() {
  const session = await getStudentSession();
  if (!session) redirect("/login");

  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  if (!user) redirect("/login");

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-brand-ink">Settings</h1>
      <SettingsForm
        initialName={user.name}
        initialPhone={user.phone}
        initialGender={user.gender}
        initialDateOfBirth={user.dateOfBirth ? user.dateOfBirth.toISOString() : null}
      />
    </div>
  );
}

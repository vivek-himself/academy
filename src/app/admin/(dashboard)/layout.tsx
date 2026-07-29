import AdminSidebar from "../AdminSidebar";

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <AdminSidebar />
      <main className="min-h-screen flex-1 overflow-x-hidden p-8">{children}</main>
    </div>
  );
}

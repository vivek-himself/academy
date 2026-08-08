import AdminSidebar from "../AdminSidebar";
import MobileTabBar from "../components/mobile/MobileTabBar";

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <AdminSidebar />
      <main className="min-h-screen flex-1 overflow-x-hidden p-4 pb-24 lg:p-8">{children}</main>
      <MobileTabBar />
    </div>
  );
}

import AdminSidebar from "../../components/admin/AdminSidebar";
import { requireAdmin } from "../../lib/auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await requireAdmin();

  if (!admin) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      <AdminSidebar />

      <main className="min-h-screen">
        {children}
      </main>
    </div>
  );
}
import AdminSidebar from "../../components/admin/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      <AdminSidebar />

      <main className="min-h-screen">
        {children}
      </main>
    </div>
  );
}
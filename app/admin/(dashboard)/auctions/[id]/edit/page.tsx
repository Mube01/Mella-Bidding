import AdminHeader from "../../../../../components/admin/AdminHeader";
import AdminSidebar from "../../../../../components/admin/AdminSidebar";
import AdminAuctionForm from "../../../../../components/admin/AdminAuctionForm";

export default async function EditAuctionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <main className="min-h-screen bg-[#F7F8FA]"><AdminSidebar /><div className="lg:pl-64"><AdminHeader title="Edit Auction" description="Update auction details" /><div className="p-5 lg:p-8"><AdminAuctionForm id={id} /></div></div></main>;
}
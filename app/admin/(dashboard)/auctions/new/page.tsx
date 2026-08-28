import AdminHeader from "../../../../components/admin/AdminHeader";
import AdminSidebar from "../../../../components/admin/AdminSidebar";
import AdminAuctionForm from "../../../../components/admin/AdminAuctionForm";

export default function NewAuctionPage() {
  return <main className="min-h-screen bg-[#F7F8FA]"><AdminSidebar /><div className="lg:pl-64"><AdminHeader title="Create Auction" description="Add a persistent auction" /><div className="p-5 lg:p-8"><AdminAuctionForm /></div></div></main>;
}
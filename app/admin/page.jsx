import { AdminDashboard } from "@/admin/admin-dashboard";

export const metadata = {
  title: "Admin Panel",
  description: "Manage portfolio content",
  robots: {
    index: false,
    follow: false
  }
};

export default function AdminPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 pb-16 pt-12 sm:px-6 lg:px-8">
      <AdminDashboard />
    </main>
  );
}

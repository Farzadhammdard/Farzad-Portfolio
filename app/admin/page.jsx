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
    <main className="admin-shell mx-auto max-w-6xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
      <section className="relative overflow-hidden rounded-3xl border border-[color:var(--ui-border)] bg-[var(--ui-surface)] p-4 shadow-xl sm:p-6 lg:p-8">
        <div className="pointer-events-none absolute -right-20 -top-24 h-56 w-56 rounded-full bg-sky-400/20 blur-3xl" />
        <div className="pointer-events-none absolute -left-16 bottom-0 h-40 w-40 rounded-full bg-cyan-300/20 blur-3xl" />
        <AdminDashboard />
      </section>
    </main>
  );
}

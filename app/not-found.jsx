import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center px-4 text-center">
      <p className="text-sm text-sky-200">404</p>
      <h1 className="mt-3 text-3xl font-bold text-white">صفحه پیدا نشد</h1>
      <p className="mt-3 text-slate-300">The page you requested does not exist.</p>
      <Link
        href="/"
        className="mt-8 rounded-full border border-sky-300/40 px-5 py-2 text-sm text-sky-100 transition hover:bg-sky-400/10"
      >
        بازگشت به خانه
      </Link>
    </main>
  );
}

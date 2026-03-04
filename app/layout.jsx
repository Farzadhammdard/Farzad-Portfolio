import { Vazirmatn } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { LanguageProvider } from "@/components/ui/language-provider";
import { Navbar } from "@/components/ui/navbar";
import "./globals.css";

const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  variable: "--font-vazirmatn"
});

export const metadata = {
  metadataBase: new URL("https://farzad-portfolio.vercel.app"),
  title: {
    default: "Farzad Portfolio",
    template: "%s | Farzad Portfolio"
  },
  description:
    "Simple and clean portfolio built with Next.js and JavaScript, including admin panel and contact email delivery.",
  openGraph: {
    title: "Farzad Portfolio",
    description: "JavaScript portfolio with Persian language support and admin dashboard.",
    url: "https://farzad-portfolio.vercel.app",
    siteName: "Farzad Portfolio",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Farzad Portfolio" }],
    locale: "fa_IR",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Farzad Portfolio",
    description: "Simple JavaScript portfolio with admin panel and contact form.",
    images: ["/opengraph-image"]
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir="rtl" className="bg-ink">
      <body className={`${vazirmatn.variable} font-body bg-ink text-slate-100 antialiased`}>
        <LanguageProvider>
          <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.18),transparent_40%),linear-gradient(180deg,#050913_0%,#080f1f_100%)]">
            <Navbar />
            {children}
          </div>
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: "#0c162a",
                color: "#dbeafe",
                border: "1px solid rgba(56,189,248,0.35)"
              }
            }}
          />
        </LanguageProvider>
      </body>
    </html>
  );
}

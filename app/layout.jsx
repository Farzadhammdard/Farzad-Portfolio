import { Vazirmatn } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { LanguageProvider } from "@/components/ui/language-provider";
import { ThemeProvider } from "@/components/ui/theme-provider";
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
    <html lang="fa" dir="rtl">
      <body className={`${vazirmatn.variable} font-body antialiased`}>
        <ThemeProvider>
          <LanguageProvider>
            <div className="site-shell min-h-screen">
              <Navbar />
              {children}
            </div>
            <Toaster
              position="bottom-right"
              toastOptions={{
                style: {
                  background: "var(--toast-bg)",
                  color: "var(--toast-text)",
                  border: "1px solid var(--toast-border)"
                }
              }}
            />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

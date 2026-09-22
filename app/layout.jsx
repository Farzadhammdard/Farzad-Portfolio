import { Inter, Vazirmatn } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { LanguageProvider } from "@/components/ui/language-provider";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Navbar } from "@/components/ui/navbar";
import "./globals.css";

const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  variable: "--font-vazirmatn"
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter"
});

// Runs before hydration so the saved theme applies before first paint (no flash).
const themeInitScript = `
(function () {
  try {
    var saved = window.localStorage.getItem("portfolio-theme");
    var theme = saved === "light" || saved === "dark" ? saved : "dark";
    document.documentElement.dataset.theme = theme;
  } catch (e) {
    document.documentElement.dataset.theme = "dark";
  }
})();
`;

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
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body
        className={`${vazirmatn.variable} ${inter.variable} font-body bg-background text-foreground antialiased`}
      >
        <ThemeProvider>
          <LanguageProvider>
            <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgb(105_71_191_/_0.14),transparent_45%)]">
              <Navbar />
              {children}
            </div>
            <Toaster
              position="bottom-right"
              toastOptions={{
                style: {
                  background: "rgb(var(--color-surface))",
                  color: "rgb(var(--color-fg))",
                  border: "1px solid rgb(var(--color-primary) / 0.35)"
                }
              }}
            />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

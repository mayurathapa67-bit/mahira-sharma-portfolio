import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-inter",
  display: "swap",
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  weight: ["500"],
  variable: "--font-roboto-mono",
  display: "swap",
});

const SITE_URL = "https://mahira-sharma-seo.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Mahira Sharma — Enterprise SEO Strategist & Digital Growth Architect",
    template: "%s · Mahira Sharma",
  },
  description:
    "Enterprise SEO strategist based in Melbourne & Kathmandu. I architect data-driven organic growth for enterprise brands through technical SEO, content systems, and link strategy.",
  keywords: [
    "Enterprise SEO",
    "SEO Strategist",
    "Technical SEO",
    "Digital Growth",
    "Organic Traffic",
    "Melbourne SEO",
    "Kathmandu SEO",
  ],
  authors: [{ name: "Mahira Sharma" }],
  creator: "Mahira Sharma",
  openGraph: {
    type: "website",
    locale: "en_AU",
    url: SITE_URL,
    siteName: "Mahira Sharma SEO",
    title: "Mahira Sharma — Enterprise SEO Strategist",
    description:
      "Data-driven enterprise SEO strategy that scales organic growth for top-tier brands.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mahira Sharma — Enterprise SEO Strategist",
    description:
      "Data-driven enterprise SEO strategy that scales organic growth for top-tier brands.",
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  alternates: { canonical: SITE_URL },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
  width: "device-width",
  initialScale: 1,
};

const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${jakarta.variable} ${inter.variable} ${robotoMono.variable} h-full antialiased`}
    >
      <head>
        {GA_ID ? (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`,
              }}
            />
          </>
        ) : null}
      </head>
      <body className="min-h-full flex flex-col bg-white text-space dark:bg-space dark:text-white">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-trust focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        <SiteNav />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}

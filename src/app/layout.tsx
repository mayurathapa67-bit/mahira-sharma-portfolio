import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { getContent } from "@/lib/github";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

const SITE_URL = "https://mahira-sharma-seo.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Mahira Sharma — SEO Specialist",
    template: "%s · Mahira Sharma",
  },
  description:
    "Mahira Sharma is an SEO specialist based in Melbourne and Kathmandu, helping brands earn lasting visibility through thoughtful technical work and honest content.",
  keywords: [
    "SEO Specialist",
    "Search Engine Optimization",
    "Technical SEO",
    "Content Strategy",
    "Local SEO",
    "Melbourne SEO",
    "Kathmandu SEO",
  ],
  authors: [{ name: "Mahira Sharma" }],
  openGraph: {
    type: "website",
    locale: "en_AU",
    url: SITE_URL,
    siteName: "Mahira Sharma SEO",
    title: "Mahira Sharma — SEO Specialist",
    description:
      "Helping brands rank higher, naturally. Thoughtful SEO from Melbourne & Kathmandu.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mahira Sharma — SEO Specialist",
    description: "Helping brands rank higher, naturally.",
    images: ["/opengraph-image"],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: SITE_URL },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf7f2" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1a1a" },
  ],
  width: "device-width",
  initialScale: 1,
};

const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "";

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const content = await getContent();
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} h-full antialiased`}
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
      <body className="flex min-h-full flex-col bg-cream text-charcoal">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-teal focus:px-4 focus:py-2 focus:text-cream"
        >
          Skip to content
        </a>
        <Navbar nav={content.nav} />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer nav={content.nav} contact={content.contact} />
      </body>
    </html>
  );
}

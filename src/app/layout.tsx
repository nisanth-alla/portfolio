import type { Metadata } from "next";
import localFont from "next/font/local";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { AmbientBackground } from "@/components/AmbientBackground";
import { PersonJsonLd, WebSiteJsonLd } from "@/components/JsonLd";
import { StickyLocalTimeBar } from "@/components/StickyLocalTimeBar";
import { ThemeProvider } from "@/components/ThemeProvider";
import { themeInitScript } from "@/lib/theme";
import { site } from "@/lib/site";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.title,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  authors: [{ name: site.author.name, url: site.url }],
  creator: site.author.name,
  openGraph: {
    type: "website",
    locale: site.locale,
    url: site.url,
    siteName: site.name,
    title: site.title,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: site.url,
  },
};

// Use the Geist woff2 files already bundled inside next — no network fetch needed.
const geist = localFont({
  src: [
    {
      path: "../../node_modules/next/dist/esm/next-devtools/server/font/geist-latin.woff2",
      weight: "100 900",
      style: "normal",
    },
  ],
  variable: "--font-geist-sans",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <PersonJsonLd />
        <WebSiteJsonLd />
      </head>
      <body className={`${geist.variable} font-sans antialiased`}>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <ThemeProvider>
          <AmbientBackground />
          {children}
          <StickyLocalTimeBar />
        </ThemeProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}

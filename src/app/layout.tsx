import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { CommandPalette } from "@/components/chrome/CommandPalette";
import { ConsoleGreeting } from "@/components/chrome/ConsoleGreeting";
import { Dock } from "@/components/chrome/Dock";
import { SpotlightTracker } from "@/components/chrome/SpotlightTracker";
import { PersonJsonLd, WebSiteJsonLd } from "@/components/seo/JsonLd";
import { SoundProvider } from "@/components/providers/SoundProvider";
import { UiProvider } from "@/components/providers/UiProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
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

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f2ec" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0f0e" },
  ],
  colorScheme: "light dark",
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

const geistMono = localFont({
  src: [
    {
      path: "../../node_modules/next/dist/esm/next-devtools/server/font/geist-mono-latin.woff2",
      weight: "100 900",
      style: "normal",
    },
  ],
  variable: "--font-geist-mono",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <PersonJsonLd />
        <WebSiteJsonLd />
      </head>
      <body className="font-sans antialiased">
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <ThemeProvider>
          <SoundProvider>
            <UiProvider>
              {children}
              <ErrorBoundary name="dock">
                <Dock />
              </ErrorBoundary>
              <ErrorBoundary name="command-palette">
                <CommandPalette />
              </ErrorBoundary>
              <SpotlightTracker />
              <ConsoleGreeting />
            </UiProvider>
          </SoundProvider>
        </ThemeProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
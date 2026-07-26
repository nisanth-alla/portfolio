import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nisanth A | Software Engineer",
  description:
    "Personal portfolio of Nisanth A, a Software Engineer focused on frontend, full-stack systems, cloud, and distributed systems.",
};

const geist = Geist({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={geist.className}>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
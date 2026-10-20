import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

const title = "Olon Khond Tourist Camp — Discover the Soul of the Gobi";
const description =
  "Comfortable gers and modern facilities in Bulgan sum, Ömnögovi, next to Bayanzag (the Flaming Cliffs). Nature, culture, comfort and adventure in the Mongolian Gobi.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  applicationName: "Olon Khond Tourist Camp",
  keywords: [
    "Olon Khond",
    "tourist camp",
    "Gobi",
    "Bayanzag",
    "Flaming Cliffs",
    "Mongolia",
    "ger camp",
    "Ömnögovi",
  ],
  openGraph: {
    type: "website",
    siteName: "Olon Khond Tourist Camp",
    title,
    description,
    url: "/",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: title }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#fbf0da",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={geistSans.variable}>
      <body>{children}</body>
    </html>
  );
}

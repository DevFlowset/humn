import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import "./sections.css";
import "./close.css";

const site = process.env.NEXT_PUBLIC_SITE_URL || "https://humn.app";

export const metadata: Metadata = {
  metadataBase: new URL(site),
  title: "HUMN — Feel at home in your body",
  description:
    "HUMN reads your posture, plans your movement, coaches you every day and helps you eat well. One app, one calm routine. Join the waitlist.",
  openGraph: {
    title: "HUMN — Feel at home in your body",
    description: "One app for posture, movement, coaching and food. Join the waitlist.",
    type: "website",
    siteName: "HUMN",
  },
  twitter: { card: "summary_large_image", title: "HUMN — Feel at home in your body" },
};

export const viewport: Viewport = {
  themeColor: "#19090E",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={GeistSans.variable}>
      <head>
        <link rel="preconnect" href="https://use.typekit.net" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://use.typekit.net/jjd4sjm.css" />
      </head>
      <body>{children}</body>
    </html>
  );
}

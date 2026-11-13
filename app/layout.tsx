import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import "./theme.css";
import "./globals.css";
import "./sections.css";
import "./coach.css";
import "./close.css";
import "./compact.css";
import "./v2.css";

const site = process.env.NEXT_PUBLIC_SITE_URL || "https://humn.app";

export const metadata: Metadata = {
  metadataBase: new URL(site),
  title: "HUMN — Your body, updated.",
  description: "Scan your body. Meet your coach. Watch yourself level up. Be first to install v2.0 of you.",
  openGraph: {
    title: "HUMN — Your body, updated.",
    description: "Scan your body. Meet your coach. Watch yourself level up.",
    type: "website",
    siteName: "HUMN",
  },
  twitter: { card: "summary_large_image", title: "HUMN — Your body, updated." },
};

export const viewport: Viewport = {
  themeColor: "#1A0904",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={GeistSans.variable}>
      <head>
        <link rel="preload" href="/fonts/michroma-latin-400-normal.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  );
}

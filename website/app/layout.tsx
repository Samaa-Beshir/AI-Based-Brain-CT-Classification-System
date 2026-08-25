import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://clyra-brain-ct.vercel.app"),
  title: "CLYRA | AI-Based Brain CT Analysis",
  description:
    "CLYRA is an AI-assisted brain CT analysis workspace for classification, lesion segmentation, and hemorrhage subtype assessment.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    title: "CLYRA | AI-Based Brain CT Analysis",
    description: "See it. Map it. Know it.",
    type: "website",
    url: "/",
    images: [{ url: "https://clyra-brain-ct.samaareda-sr.chatgpt.site/og.png", width: 1536, height: 1024, alt: "CLYRA — AI-Based Brain CT Analysis" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "CLYRA | AI-Based Brain CT Analysis",
    description: "See it. Map it. Know it.",
    images: ["https://clyra-brain-ct.samaareda-sr.chatgpt.site/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

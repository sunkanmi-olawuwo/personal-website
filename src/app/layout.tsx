import type { Metadata } from "next";
import localFont from "next/font/local";

import "./globals.css";

import Navbar from "@/components/navbar";
import Providers from "@/components/providers";
import NewsletterCard from "@/components/newsletter-card";
import Footer from "@/components/footer";
import { getBlogName } from "@/lib/requests";

const displayFont = localFont({
  src: "./fonts/ManropeLatin.woff2",
  variable: "--font-display",
  display: "swap",
});

const bodyFont = localFont({
  src: "./fonts/InterLatin.woff2",
  variable: "--font-body",
  display: "swap",
});

const newsletterEnabled =
  process.env.NEXT_PUBLIC_BLOG_DATA_MODE !== "mock" &&
  Boolean(
    process.env.NEXT_PUBLIC_HASHNODE_ENDPOINT &&
      process.env.NEXT_PUBLIC_HASHNODE_PUBLICATION_ID
  );

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getBlogName();

  return {
    title: data.displayTitle || data.title,
    icons: {
      icon: data.favicon || "/favicon.ico",
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <body
        className={`${displayFont.variable} ${bodyFont.variable} min-h-screen bg-background font-sans antialiased`}
      >
        <Providers>
          <div className="relative flex min-h-screen flex-col">
            <Navbar />
            <div className="flex-1">{children}</div>
            <NewsletterCard newsletterEnabled={newsletterEnabled} />
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}

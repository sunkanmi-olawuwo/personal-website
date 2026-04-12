import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/navbar";
import Providers from "@/components/providers";
import NewsletterCard from "@/components/newsletter-card";
import Footer from "@/components/footer";
import { getBlogName } from "@/lib/requests";

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
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen font-sans antialiased">
        <Providers>
          <Navbar />
          {children}
          <NewsletterCard />
          <Footer />
        </Providers>
      </body>
    </html>
  );
}

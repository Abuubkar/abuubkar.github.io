import type { Metadata, Viewport } from "next";
import { Hanken_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import { siteConfig, siteUrl } from "@/config/site";
import "./globals.css";

const hanken = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

const { profile } = siteConfig;
const title = `${profile.name} — ${profile.role}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description: profile.metaDescription,
  alternates: { canonical: "/" },
  // Google Search Console ownership — the meta-tag method, because the HTML
  // file method would need public/, which the resume sync wipes.
  verification: {
    google: "hBIqxivVE3TUIMIt2N2rNkPhChFsZVUAUUCtsFVFuU8",
  },
  authors: [{ name: profile.name, url: siteUrl }],
  creator: profile.name,
  openGraph: {
    type: "profile",
    firstName: profile.firstName,
    lastName: profile.lastName,
    url: "/",
    siteName: profile.brand,
    description: profile.socialDescription,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    description: profile.socialDescription,
  },
};

export const viewport: Viewport = {
  themeColor: "#f1f0ed",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${hanken.variable} ${inter.variable} ${jetbrainsMono.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full">
        <div className="top-hairline" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}

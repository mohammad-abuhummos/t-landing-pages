import type { Metadata } from "next";

import { Inter } from "next/font/google";

import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { GTMScript, GTMNoscript } from "@/components/gtm";
import SmartlookScript from "@/components/smartlook";
import { MetaPixelScript, MetaPixelNoscript } from "@/components/meta-pixel";

const inter = Inter({ subsets: ["latin"] });

// Dynamic metadata based on lead vertical
const getMetadata = (): Metadata => {
  const vertical = process.env.NEXT_PUBLIC_LEAD_VERTICAL;

  switch (vertical) {
    case "bathroom":
      return {
        title: "Premium Bathroom Remodeling",
        description: "Transform your bathroom with our premium remodeling solutions. Professional installation, luxury designs, and exceptional service.",
      };
    case "new-bathroom":
      return {
        title: "Transform Your Bathroom | Free Quote",
        description: "Elevate your home with stunning bathroom features. Get a free quote today from trusted local pros.",
      };
    case "new-windows":
      return {
        title: "Premium Window Solutions",
        description: "Transform your home with energy-efficient windows. Professional installation and exceptional service.",
      };
    case "new-roofing":
      return {
        title: "Premium Roofing Solutions",
        description: "Protect your home with durable, expertly installed roofing.",
      };
    case "new-flooring":
      return {
        title: "Premium Flooring Solutions",
        description: "Enhance your home with beautiful, long-lasting flooring installed by pros.",
      };
    case "roofing":
      return {
        title: "Premium Roofing Solutions",
        description: "Protect your home with our premium roofing solutions. Professional installation, durable materials, and exceptional service.",
      };
    case "flooring":
      return {
        title: "Premium Flooring Solutions",
        description: "Transform your home with our premium flooring solutions. Professional installation, beautiful materials, and exceptional service.",
      };
    default:
      return {
        title: "Premium Window Solutions",
        description: "Transform your home with our premium window solutions. Professional installation, energy-efficient windows, and exceptional service.",
      };
  }
};

export const metadata: Metadata = getMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const metaPixelEnabled =
    process.env.NEXT_PUBLIC_LEAD_VERTICAL === "new-flooring" &&
    process.env.LEAD_API_TYPE === "39";
  const fbPixelId = process.env.NEXT_PUBLIC_FB_PIXEL_ID || "1382970733833855";
  return (
    <html lang="en">
      <head>
        <GTMScript />
        <SmartlookScript />
        {metaPixelEnabled ? (
          <MetaPixelScript pixelId={fbPixelId} enabled={true} />
        ) : null}
      </head>
      <body className={inter.className}>
        <GTMNoscript />
        {metaPixelEnabled ? (
          <MetaPixelNoscript pixelId={fbPixelId} enabled={true} />
        ) : null}
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

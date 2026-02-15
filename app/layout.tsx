import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { Navbar } from "@/components/Navbar";
import { ShoppingBagDrawer } from "@/components/ShoppingBagDrawer";
import { Analytics } from "@vercel/analytics/next";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://dinacosmetic.store'),
  title: {
    default: "DINA COSMETIC | The Obsidian Palace - Luxury Beauty & Cosmetics",
    template: "%s | DINA COSMETIC"
  },
  description: "Discover premium beauty products and cosmetics at DINA COSMETIC - The Obsidian Palace. Shop luxury skincare, makeup, and beauty essentials with ultra-minimalist, high-end design.",
  keywords: [
    "DINA COSMETIC",
    "luxury cosmetics",
    "premium beauty products",
    "high-end skincare",
    "luxury makeup",
    "beauty essentials",
    "The Obsidian Palace",
    "luxury beauty store",
    "premium cosmetics online",
    "designer beauty products"
  ],
  authors: [{ name: "DINA COSMETIC", url: "https://dinacosmetic.store" }],
  creator: "DINA COSMETIC",
  publisher: "DINA COSMETIC",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://dinacosmetic.store",
    siteName: "DINA COSMETIC - The Obsidian Palace",
    title: "DINA COSMETIC | Luxury Beauty & Cosmetics",
    description: "Discover premium beauty products and cosmetics at The Obsidian Palace. Shop luxury skincare, makeup, and beauty essentials.",
    images: [
      {
        url: "/logo.jpg",
        width: 1200,
        height: 630,
        alt: "DINA COSMETIC - The Obsidian Palace",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DINA COSMETIC | Luxury Beauty & Cosmetics",
    description: "Discover premium beauty products at The Obsidian Palace",
    images: ["/logo.jpg"],
    creator: "@dinacosmetic",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    // Add other verification codes as needed
  },
};

import { Footer } from "@/components/Footer";

import { Toaster } from 'sonner';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch user server-side for SSR-safe session handling
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  // Fetch user server-side (optional - available for future use)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/favicon.jpg" />
      </head>
      <body
        className={`${playfair.variable} ${inter.variable} font-sans antialiased`}
      >
        <CartProvider>
          <div className="min-h-screen flex flex-col pt-20">
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
            <ShoppingBagDrawer />
            <Footer />
          </div>
          <Toaster position="bottom-right" theme="dark" expand={false} richColors />
          <Analytics />
        </CartProvider>
      </body>
    </html>
  );
}

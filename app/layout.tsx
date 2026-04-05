import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ConvexClientProvider } from "@/components/ConvexClientProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ClerkProvider } from "@clerk/nextjs";
import SyncUserWithConvex from "@/components/SyncUserWithConvex";
import { Toaster } from "@/components/ui/toaster";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Ticket — Ethiopian Event Ticketing",
  description: "Buy and sell event tickets in Ethiopia. Pay with Chapa (ETB) or Stripe. Real-time queue, QR tickets, and resale marketplace.",
  icons: { icon: "/favicon.svg", apple: "/favicon.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ClerkProvider>
          <ConvexClientProvider>
            <div className="flex flex-col min-h-screen">
              <Header />
              <SyncUserWithConvex />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <Toaster />
          </ConvexClientProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}

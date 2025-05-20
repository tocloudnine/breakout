import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientWalletProvider from "@/api/ClientWalletProvider"
import { Toaster } from "@/components/ui/sonner"
import { UploadProvider } from "@/lib/context/upload-context";
import MobileHeader from "../components/MobileHeader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cyberdeus",
  description: "Cyberdeus",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white min-h-screen`}
      >
        <ClientWalletProvider>
          <UploadProvider>
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-md h-screen max-h-[844px] bg-black flex flex-col border-x border-white/10">
              <div className="sticky top-0 left-0 right-0 z-10 w-full">
                <MobileHeader />
              </div>
              <main className="px-4 pb-4 flex-1 overflow-y-auto">
                {children}
              </main>
            </div>
          </UploadProvider>
          <Toaster />
        </ClientWalletProvider>
      </body>
    </html>
  );
}

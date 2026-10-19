import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProviderClient } from "@/lib/auth-client";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BeeKeeper — Gestión apícola",
  description: "Apicultura de LaCajaAmbar",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <AuthProviderClient>{children}</AuthProviderClient>
      </body>
    </html>
  );
}

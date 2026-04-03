import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { AppFrame } from "@/components/layout/AppFrame";
import { LanguageProvider } from "@/components/providers/LanguageProvider";
import "./globals.css";

const generalSans = Manrope({
  subsets: ["latin"],
  variable: "--font-general-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Heath — Plataforma de suscripción",
  description:
    "Plataforma impulsada por IA para gestionar solicitudes, optimizar capacidad y tomar mejores decisiones de suscripción.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${generalSans.variable} font-sans min-h-screen`}>
        <LanguageProvider>
          <AppFrame>{children}</AppFrame>
        </LanguageProvider>
      </body>
    </html>
  );
}

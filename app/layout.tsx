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
  title: "Heath — Modern underwriting business",
  description:
    "Modern MGM underwriting business combining technical expertise, portfolio discipline, and technology-enabled execution.",
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

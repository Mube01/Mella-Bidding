import type { Metadata } from "next";
import "./globals.css";

import Header from "./components/Header";
import { LanguageProvider } from "./context/LanguageContext";
import { AuthProvider } from "./context/AuthContext";

export const metadata: Metadata = {
  title: "Mella",
  description:
    "A new way to bid in Ethiopia.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="am">
      <body>
        <LanguageProvider>
          <AuthProvider>
            <Header />
            {children}
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AuthProvider from "@/components/auth/AuthProvider";

export const metadata: Metadata = {
  title: {
    default: "East Texas Official Tracker",
    template: "%s | East Texas Official Tracker",
  },
  description:
    "Track elected officials in East Texas. Scorecards on water rights, land rights, taxes, and transparency. See who funds your representatives and how they vote.",
  keywords: [
    "East Texas",
    "elected officials",
    "HD-7",
    "TX-1",
    "scorecard",
    "voting record",
    "campaign finance",
    "Smith County",
    "Gregg County",
    "Tyler",
    "Longview",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-gray-50 text-gray-900">
        <AuthProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}

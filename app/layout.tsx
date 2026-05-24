import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "ChainPulse — Your Wallet Tells a Story",
  description:
    "Wallet Persona, On-Chain Resume & Reputation Score powered by AI. Analyze any Ethereum wallet instantly.",
  keywords: [
    "ethereum",
    "wallet",
    "blockchain",
    "web3",
    "persona",
    "reputation",
    "on-chain",
    "AI",
  ],
  openGraph: {
    title: "ChainPulse — Your Wallet Tells a Story",
    description:
      "Wallet Persona, On-Chain Resume & Reputation Score powered by AI.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        {/* Ambient background blobs */}
        <div className="ambient-blob -top-40 -left-40 h-[500px] w-[500px] bg-violet-600" />
        <div className="ambient-blob top-1/3 -right-40 h-[400px] w-[400px] bg-cyan-600" />
        <div className="ambient-blob -bottom-40 left-1/3 h-[400px] w-[400px] bg-emerald-600" />

        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}

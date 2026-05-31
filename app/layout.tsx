import type { Metadata } from "next";
import { Geist_Mono, Inter, Instrument_Serif } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-serif-accent",
  subsets: ["latin"],
  style: "italic",
  weight: "400",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sohovi.com"),
  title: {
    default: "Sohovi — Privacy-First Data Quality Platform",
    template: "%s | Sohovi",
  },
  description:
    "Stop spending 40% of your day fixing bad data. Sohovi profiles, scores, and helps you repair data quality — entirely in your browser. Your data never leaves your device.",
  keywords: [
    "data quality",
    "data profiling",
    "DQ rules",
    "CSV analysis",
    "Excel analysis",
    "data governance",
    "privacy-first",
    "no upload",
  ],
  openGraph: {
    type: "website",
    siteName: "Sohovi",
    title: "Sohovi — Privacy-First Data Quality Platform",
    description:
      "Profile and score your CSV/Excel data entirely in the browser. Zero server upload. Enterprise-grade data quality for small teams.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sohovi — Privacy-First Data Quality Platform",
    description: "Your data never leaves your browser. Data quality made simple.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${inter.variable} ${geistMono.variable} ${instrumentSerif.variable} h-full antialiased`}
      >
        <body className="min-h-full flex flex-col bg-background text-foreground">
          {children}
          <Toaster richColors position="top-right" />
        </body>
      </html>
    </ClerkProvider>
  );
}

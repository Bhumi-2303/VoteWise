import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "VoteWise AI | Empowering Voters with AI-Driven Civic Intelligence",
  description: "Navigate elections with confidence. Get neutral candidate comparisons, district-level data, and interactive civic education powered by Google Gemini.",
  keywords: ["elections", "voting", "civic education", "AI", "Gemini", "candidate comparison", "VoteWise"],
  authors: [{ name: "VoteWise Team" }],
  openGraph: {
    title: "VoteWise AI - Premium Civic Education",
    description: "Your intelligent civic education assistant. Get accurate civic data.",
    url: "https://votewise.ai",
    siteName: "VoteWise AI",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "VoteWise AI - Premium Civic Education",
    description: "Your intelligent civic education assistant. Get accurate civic data.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${plusJakartaSans.variable} font-sans antialiased`}>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[9999] focus:bg-white focus:text-primary focus:p-4 focus:rounded-md focus:shadow-xl font-bold">
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}

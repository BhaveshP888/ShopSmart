import type { Metadata } from "next";
import { Bricolage_Grotesque, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  weight: ["400", "700", "800"],
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Anti_Retail | AI Shopping Intelligence",
  description: "Natural language commodity locator powered by Gemini AI. Real-time price comparison across Amazon, Flipkart, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${bricolage.variable} ${jetbrains.variable} antialiased min-h-screen relative`}
      >
        {/* Global dot-grid texture layer */}
        <div className="fixed inset-0 texture-dots pointer-events-none z-0" aria-hidden="true" />
        
        <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 py-8 sm:py-12">
          {children}
        </div>

        {/* Bottom status bar — persistent system feel */}
        <footer className="fixed bottom-0 left-0 right-0 z-50 border-t-[3px] border-ink bg-ink text-surface-elevated font-mono text-[10px] tracking-[0.3em] uppercase flex justify-between items-center px-4 sm:px-8 py-2">
          <span>Anti_Retail // v1.0.0</span>
          <span className="hidden sm:block text-ink-faint">Gemini 2.5 Flash × Rainforest × SerpApi</span>
          <span className="text-accent">System_Active</span>
        </footer>
      </body>
    </html>
  );
}

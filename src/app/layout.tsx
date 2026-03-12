import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'NovelcoOS',
  description: 'Valenzuela City Business Marketplace',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body suppressHydrationWarning className="bg-[#FDFCFB] text-stone-900 selection:bg-orange-100">
          {/* This wrapper ensures EVERY page starts with the same 
              responsive padding and max-width.
          */}
          <div className="min-h-screen flex flex-col">
            <main className="flex-grow w-full max-w-7xl mx-auto px-5 sm:px-8 md:px-12 lg:px-16">
              {children}
            </main>
            
            {/* Optional Global Footer could go here */}
            <footer className="py-12 border-t border-stone-100 text-center">
              <p className="font-sans text-[10px] font-bold uppercase tracking-[0.3em] text-stone-300">
                © 2026 NovelArc Studio • Valenzuela City
              </p>
            </footer>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}

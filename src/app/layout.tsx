import { ThemeProvider } from "@/components/ThemeProvider";
import { PDFProvider } from "@/contexts/PDFContext";
import ExpiredSessionCheck from "@/features/authentication/components/ExpiredSessionCheck";
import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { Inter } from "next/font/google";
import { Toaster } from 'react-hot-toast';
import "./globals.css";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Kezdőlap - DokMester',
    template: '%s - DokMester'
  },
  description: 'Céges dokumentum készítő webalkalmazás. Számlák, árajánlatok, szerződések és még sok más! Könnyen kezelhető bárhonnan, bármikor!',
  twitter: {
    card: 'summary_large_image',
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {


  return (
    <html lang="hu" suppressHydrationWarning>
      <SessionProvider>
        <ExpiredSessionCheck />
        <PDFProvider>
          <body className={`${inter.className} light:text-slate-950 dark:text-slate-50 light:bg-slate-50 dark:bg-slate-900 antialiased`}>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
              <>
                {children}
                <Toaster toastOptions={{ className: 'mt-0 md:mt-20' }} />
              </>
            </ThemeProvider>
          </body>
        </PDFProvider>
      </SessionProvider>
    </html>
  );
}

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ConvexClientProvider } from "./ConvexClientProvider";
import { ClerkProvider } from "@clerk/nextjs";
import {  shadesOfPurple } from "@clerk/themes";
import Header from "@/components/header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Content Platform",
  description: "Create amazing content with AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body 
        className={inter.className}
      >
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ClerkProvider
                appearance={{
                theme: shadesOfPurple,
                
              }}
            >
              <ConvexClientProvider>
                <Header/>
                <main className="bg-slate-900 min-h-screen text-white overflow-x-hidden">
                  {children}
                </main>
              </ConvexClientProvider>
            </ClerkProvider>
          </ThemeProvider>

        
        
        
      </body>
    </html>
  );
}

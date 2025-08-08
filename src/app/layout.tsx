import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FoodFlux",
  description: "Calories tracker",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}>
        <div className="container-shell space-y-6">
          <header className="flex items-center justify-between pt-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-black text-white grid place-items-center font-semibold">FF</div>
              <div>
                <h1 className="text-lg font-semibold tracking-tight">FoodFlux</h1>
                <p className="text-xs text-neutral-500">Track your calories with ease</p>
              </div>
            </div>
          </header>
          <main>{children}</main>
          <footer className="py-6 text-center text-xs text-neutral-500">© {new Date().getFullYear()} FoodFlux</footer>
        </div>
      </body>
    </html>
  );
}

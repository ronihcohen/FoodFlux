import RegisterSW from "@/components/RegisterSW";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { getServerAuthSession } from "@/lib/server-auth";
import UserMenu from "@/components/UserMenu";
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
  manifest: "/manifest.json",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerAuthSession();
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#0ea5a4" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}>
        <RegisterSW />
        <div className="container-shell space-y-6">
          <header className="flex flex-wrap items-center justify-between gap-3 pt-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-9 w-9 rounded-full bg-black text-white grid place-items-center font-semibold">FF</div>
              <div>
                <h1 className="text-lg font-semibold tracking-tight">FoodFlux</h1>
                <p className="text-xs text-neutral-500">Track your calories with ease</p>
              </div>
            </div>
            <div className="ml-auto">
              {session?.user ? <UserMenu user={session.user} /> : null}
            </div>
          </header>
          <main>{children}</main>
          <footer className="py-6 text-center text-xs text-neutral-500">© {new Date().getFullYear()} FoodFlux</footer>
        </div>
      </body>
    </html>
  );
}

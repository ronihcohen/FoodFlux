import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { getServerAuthSession } from "@/lib/server-auth";
import SignOutButton from "@/components/SignOutButton";
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerAuthSession();
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
            <div className="flex items-center gap-3">
              {session?.user ? (
                <>
                  {session.user.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={session.user.image}
                      alt={session.user.name ?? session.user.email ?? "User"}
                      className="h-8 w-8 rounded-full"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-neutral-200 grid place-items-center text-xs font-medium">
                      {(session.user.name ?? session.user.email ?? "?")
                        .slice(0, 1)
                        .toUpperCase()}
                    </div>
                  )}
                  <div className="text-sm">
                    <div className="font-medium leading-none">{session.user.name ?? "User"}</div>
                    <div className="text-neutral-500 leading-none">{session.user.email}</div>
                  </div>
                  <SignOutButton className="btn-ghost" />
                </>
              ) : null}
            </div>
          </header>
          <main>{children}</main>
          <footer className="py-6 text-center text-xs text-neutral-500">© {new Date().getFullYear()} FoodFlux</footer>
        </div>
      </body>
    </html>
  );
}

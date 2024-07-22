import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Nav from "@/components/nav";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Rudy Pena",
  description: "A summary of my work and contributions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased max-w-2xl mb-40 flex flex-col md:flex-row mx-4 mt-8 lg:mx-auto ${inter.className}`}
      >
        <main className="flex-auto min-w-0 mt-6 flex flex-col px-2 md:px-0">
          <aside className="-ml-[8px] mb-16 tracking-tight">
            {/* lg:top-20 */}
            <div className="lg:sticky">
              <Nav />
              <section className="py-1 px-2">{children}</section>
            </div>
          </aside>
        </main>
      </body>
    </html>
  );
}

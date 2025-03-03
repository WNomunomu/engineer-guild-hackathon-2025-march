import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "bootstrap/dist/css/bootstrap.min.css"; // Bootstrap のスタイルを適用
import { Sidebar } from "@/components/Sidebar";
import "../styles/global.scss";
import { Lora } from "next/font/google";

const lora = Lora({ subsets: ["latin"] });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hack Book",
  description:
    "A gamified reading app designed for software engineers who want to level up their skills but struggle with motivation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined&display=optional"
          rel="stylesheet"
        />
      </head>
      <body
        className={`
          ${geistSans.variable} 
          ${geistMono.variable} 
          ${lora.className}
          d-flex 
          overflow-hidden 
          vh-100
        `}
      >
        <Sidebar />
        <div className="flex-grow-1 overflow-auto h-100">{children}</div>
      </body>
    </html>
  );
}

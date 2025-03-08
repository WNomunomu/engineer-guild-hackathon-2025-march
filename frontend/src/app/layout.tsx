import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "bootstrap/dist/css/bootstrap.min.css"; // Bootstrap のスタイルを適用
import { Sidebar } from "@/components/Sidebar";
import "../styles/global.scss";
import { Lora } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
});

export const metadata: Metadata = {
  title: "Hack Book",
  description:
    "モチベーションに悩むソフトウェアエンジニアのためにデザインされたゲーミフィケーション要素を取り入れた読書アプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* eslint-disable-next-line @next/next/no-page-custom-font, @next/next/google-font-display */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0..1,-25..0"
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

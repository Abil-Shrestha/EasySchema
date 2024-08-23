import type {Metadata} from "next";
import "./globals.css";

import {Providers} from "@/components/providers";

import {GeistSans} from "geist/font/sans";
import {GeistMono} from "geist/font/mono";

export const metadata: Metadata = {
  title: "EZ Schema",
  description:
    "Visualize and generate JSON Schema with a simple drag-and-drop interface.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} antialiased  font-sans`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

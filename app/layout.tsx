import type {Metadata} from "next";
import "./globals.css";

import {Providers} from "@/components/providers";

import {GeistMono} from "geist/font/mono";
import {GeistSans} from "geist/font/sans";
import {Toaster} from "sonner";

export const metadata: Metadata = {
  title: "Resume Tailor",
  description:
    "Tailorobs with AI. Create a resume in seconds. Tailor your resume to a job description and download it as a PDF.",
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
        <Toaster richColors />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";

import { Providers } from "@/components/providers";

import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { Toaster } from "sonner";
import { CSPostHogProvider } from "./providers";

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
			<CSPostHogProvider>
				<body
					className={`${GeistSans.variable} ${GeistMono.variable} antialiased  font-sans`}
				>
					<Toaster position="top-center" richColors />
					<Providers>{children}</Providers>
				</body>
			</CSPostHogProvider>
		</html>
	);
}

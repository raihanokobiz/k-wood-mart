import type { Metadata } from "next";
import "./globals.css";
import NextTopLoader from "nextjs-toploader";

export const metadata: Metadata = {
  title: "K Wood Mart",
  description: "K Wood Mart is your one-stop destination for premium quality wooden furniture and elegant curtains, crafted with care and designed for comfort and style.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <NextTopLoader showSpinner={false} color="#D4A373" />
        {children}
      </body>
    </html>
  );
}

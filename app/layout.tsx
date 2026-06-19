import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vesper — A Private Sports & Lifestyle Platform",
  description:
    "Vesper is a private, invitation-only platform built around the world's defining sporting moments. Pressure is a privilege. Request access.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Hanken+Grotesk:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ fontFamily: "'Hanken Grotesk', system-ui, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}

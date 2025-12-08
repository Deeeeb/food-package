import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import MuiThemeProvider from "./ThemeProvider";
import { AuthProvider } from "./contexts/AuthContext";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Food Package - Order Delicious Pack Lunches & Food Sets",
  description: "Order fresh pack lunches and food sets with fast delivery. Perfect meals for individuals and families.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <MuiThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </MuiThemeProvider>
      </body>
    </html>
  );
}

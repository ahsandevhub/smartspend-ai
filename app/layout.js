import { Baloo_Da_2 } from "next/font/google";
import "./globals.css";

const balooDa2 = Baloo_Da_2({
  variable: "--font-baloo-da-2",
  subsets: ["latin"],
});

export const metadata = {
  title: "SmartSpend Ai",
  description: "AI-Powered Personal Finance Notepad",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={balooDa2.className}>
      <body className={`antialiased ${balooDa2.variable}`}>{children}</body>
    </html>
  );
}

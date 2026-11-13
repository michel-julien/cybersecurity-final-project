import type { Metadata } from "next";
import { AuthProvider } from "@/app/components/auth-provider";
import Navbar from "@/app/components/navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "PeperoLife — Sweet deliveries across Korea",
    template: "%s | PeperoLife",
  },
  description:
    "Send thoughtful Pepero gifts, notes, and smiles across South Korea with PeperoLife.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased font-sans">
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <Navbar />
          <main className="site-main">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}

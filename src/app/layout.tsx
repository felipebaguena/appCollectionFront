import type { Metadata } from "next";
import localFont from "next/font/local";
import "@/styles/globals.css";
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ClientLayout from "@/components/layout/ClientLayout";
import { PageWrapper } from '@/components/layout/LayoutElements';
import StyledComponentsRegistry from "@/components/StyledComponentsRegistry";
import StyledComponentsProvider from '@/components/StyledComponentsProvider';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Mi Aplicación",
  description: "Descripción de mi aplicación",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={geistSans.variable}>
        <StyledComponentsRegistry>
          <StyledComponentsProvider>
            <PageWrapper>
              <Navbar />
              <ClientLayout>{children}</ClientLayout>
              <Footer />
            </PageWrapper>
          </StyledComponentsProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}

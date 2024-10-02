import type { Metadata } from "next";
import "@/styles/globals.css";
import Navbar from '@/components/layout/Navbar';
import ClientLayout from "@/components/layout/ClientLayout";
import StyledComponentsRegistry from "@/components/StyledComponentsRegistry";

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
    <html lang="es">
      <body>
        <StyledComponentsRegistry>
          <Navbar />
          <ClientLayout>{children}</ClientLayout>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
import type { Metadata } from "next";
import localFont from "next/font/local";
import "@/styles/globals.css";
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ClientLayout from "@/components/layout/ClientLayout";
import { PageWrapper } from '@/components/layout/LayoutElements';
import StyledComponentsRegistry from "@/components/StyledComponentsRegistry";
import StyledComponentsProvider from '@/components/StyledComponentsProvider';
import AuthRedirectHandler from "@/components/auth/AuthRedirectHandler";
import { AuthProvider } from "@/contexts/AuthContext";
import UnreadMessagesPoller from '@/components/messages/UnreadMessagesPoller';
import { UnreadMessagesProvider } from '@/contexts/UnreadMessagesContext';
import ChatDrawer from '@/components/chat/ChatDrawer';

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
            <AuthProvider>
              <UnreadMessagesProvider>
                <PageWrapper>
                  <Navbar />
                  <ClientLayout showLogs={false}>{children}</ClientLayout>
                  <Footer />
                  <AuthRedirectHandler />
                  <UnreadMessagesPoller />
                </PageWrapper>
                <ChatDrawer />
              </UnreadMessagesProvider>
            </AuthProvider>
          </StyledComponentsProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}

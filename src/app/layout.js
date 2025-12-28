import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "antd/dist/reset.css";
import { Toaster } from "react-hot-toast";
import AppShell from "./components/AppShell";
import { ConfigProvider, App } from "antd";
import { antdTheme, suppressAntdWarnings } from "../lib/antd-theme";
import AntdWarningBoundary from "../lib/error-boundary";
import "../lib/suppress-warnings";
import AuthSessionProvider from "./components/SessionProvider"; 
import AutoSubscriptionManager from "./components/AutoSubscriptionManager";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Equiherds",
  description: "Equiherds is a platform for horse owners to find the best horses for sale and to sell their horses.",
};

export default function RootLayout({ children }) {
  // Suppress Ant Design warnings
  suppressAntdWarnings();

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo.jpeg" />
      </head>
      <body suppressHydrationWarning={true} className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}>
        <AuthSessionProvider>
          <AntdWarningBoundary>
            <ConfigProvider theme={antdTheme}>
              <App>
                <AppShell>
                  {children}
                </AppShell>
                <AutoSubscriptionManager />
                <Toaster position="top-right" />
              </App>
            </ConfigProvider>
          </AntdWarningBoundary>
        </AuthSessionProvider>
      </body>
    </html>
  );
}

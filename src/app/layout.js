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
import RemoveNextJSIndicator from "./components/RemoveNextJSIndicator";


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
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                function removeNextJSIndicators() {
                  // Remove by ID
                  ['__next-build-watcher', '__next-dev-overlay'].forEach(id => {
                    const el = document.getElementById(id);
                    if (el) el.remove();
                  });
                  
                  // Remove by selectors
                  document.querySelectorAll('[data-nextjs-dialog], [data-nextjs-toast], [data-nextjs-dialog-overlay], [data-nextjs-icon]').forEach(el => el.remove());
                  
                  // Remove fixed position indicators
                  document.querySelectorAll('div').forEach(div => {
                    const style = window.getComputedStyle(div);
                    const id = div.id || '';
                    const className = div.className || '';
                    if ((id.includes('__next') || id.includes('nextjs') || className.includes('nextjs')) && 
                        style.position === 'fixed' && (style.bottom === '0px' || style.right === '0px')) {
                      div.remove();
                    }
                  });
                }
                
                // Run immediately
                removeNextJSIndicators();
                
                // Run on DOM ready
                if (document.readyState === 'loading') {
                  document.addEventListener('DOMContentLoaded', removeNextJSIndicators);
                } else {
                  removeNextJSIndicators();
                }
                
                // Set up observer
                if (typeof MutationObserver !== 'undefined') {
                  new MutationObserver(removeNextJSIndicators).observe(document.body, {
                    childList: true,
                    subtree: true
                  });
                }
              })();
            `,
          }}
        />
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
                <RemoveNextJSIndicator />
              </App>
            </ConfigProvider>
          </AntdWarningBoundary>
        </AuthSessionProvider>
      </body>
    </html>
  );
}

import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
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
  icons: {
    icon: "/logo.jpeg",
  },
};

export default function RootLayout({ children }) {
  // Suppress Ant Design warnings
  suppressAntdWarnings();

  return (
    <html lang="en">
      <head>
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-5FL38TWK');
            `,
          }}
        />
        <link rel="icon" href="/logo.jpeg" />
        <link href="https://cdn.jsdelivr.net/npm/remixicon@4.3.0/fonts/remixicon.css" rel="stylesheet" />
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
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-5FL38TWK"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        
        {/* Google Analytics (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-HB0E7V08Y7"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-HB0E7V08Y7');
          `}
        </Script>
        
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

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Manish Mehra | Portfolio",
  description: "Personal portfolio website of Manish Mehra",
  verification: {
    google: "googled5cd77b53033fa83",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="dark scroll-smooth"
    >
      <head>
        {/* Google Search Console Verification */}
        <meta name="google-site-verification" content="googled5cd77b53033fa83" />

        {/* Google AdSense Script */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4510422045053733"
          crossOrigin="anonymous"
        ></script>

        {/* Google Fonts (Inter & Outfit) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        
        {/* Font Awesome Icons */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
        {/* Clash Display Font */}
        <link
          href="https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-slate-950 text-slate-100 font-sans selection:bg-orange-500/30 selection:text-orange-300 overflow-x-hidden min-h-screen">
        {children}
      </body>
    </html>
  );
}

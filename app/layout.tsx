import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/site/theme-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://accidentmaxxing.com"),
  title: {
    default: "AccidentMaxxing — Maximize every accident claim",
    template: "%s | AccidentMaxxing",
  },
  description:
    "The modern intake layer for accident claims. We turn chaotic post-accident moments into qualified, well-documented cases — matched instantly to the right attorney.",
  keywords: [
    "car accident",
    "accident attorney",
    "legal tech",
    "claim intake",
    "personal injury",
    "case qualification",
  ],
  openGraph: {
    title: "AccidentMaxxing — Maximize every accident claim",
    description:
      "A premium intake layer for accident victims and the attorneys who represent them.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f8fb" },
    { media: "(prefers-color-scheme: dark)", color: "#070b14" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${geistMono.variable} h-full antialiased dark`}
      style={{ colorScheme: "dark" }}
      suppressHydrationWarning
    >
      <head>
        <script
          // Prevent flash-of-wrong-theme by applying the user's preference
          // before React hydrates.
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=localStorage.getItem('amx-theme');var m=window.matchMedia('(prefers-color-scheme: light)').matches;var t=s||(m?'light':'dark');var r=document.documentElement;r.classList.toggle('dark',t==='dark');r.style.colorScheme=t;}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}

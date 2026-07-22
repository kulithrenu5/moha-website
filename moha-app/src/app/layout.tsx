import type { Metadata } from "next";
import "./globals.css";
import { AudioProvider } from "@/context/AudioContext";
import { PageWrapper } from "@/components/PageWrapper";

export const metadata: Metadata = {
  title: "MOHA | Sri Lankan Folklore Survival Horror Game",
  description: "Official interactive website for MOHA, a deeply psychological survival horror game by Black Mirage Studio. Face the Mahasona demon in the haunted forests of Meemure.",
  metadataBase: new URL("https://www.blackmirage.studio"),
  openGraph: {
    title: "MOHA | Sri Lankan Folklore Survival Horror Game",
    description: "Unravel ancient mythology and survive the legendary cemetery demon Mahasona in Unreal Engine 5. Developed by Black Mirage Studio.",
    images: [
      {
        url: "/assets/story-artwork-BMFGOwij.webp",
        width: 1200,
        height: 630,
        alt: "MOHA Game Story Art",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="antialiased bg-[#050505] text-neutral-200">
        <AudioProvider>
          <PageWrapper>
            {children}
          </PageWrapper>
        </AudioProvider>
      </body>
    </html>
  );
}

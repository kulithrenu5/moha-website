import type { Metadata } from "next";
import { Oswald, Barlow } from "next/font/google";

const oswald = Oswald({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-vero-display" });
const barlow = Barlow({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-vero-body" });

export const metadata: Metadata = {
  title: "Resident Evil Veronica | Unofficial Fan Recreation",
  description: "An unofficial fan-made recreation of the Resident Evil Veronica promotional site layout. Not affiliated with CAPCOM.",
  openGraph: {
    title: "Resident Evil Veronica | Unofficial Fan Recreation",
    description: "An unofficial fan-made recreation of a promotional site layout. Not affiliated with CAPCOM.",
    images: [{ url: "/veronica/hero.jpg", width: 1376, height: 768, alt: "Storm-lashed island fortress" }],
  },
};

export default function VeronicaLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${oswald.variable} ${barlow.variable}`}>{children}</div>;
}

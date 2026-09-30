"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CustomCursor } from "@/components/CustomCursor";
import { EnterOverlay } from "@/components/EnterOverlay";

export const PageWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  // The Veronica tribute site ships its own chrome (age gate, header, footer).
  if (pathname.startsWith("/veronica")) {
    return <>{children}</>;
  }

  if (isAdmin) {
    return (
      <div className="bg-[#0b0b0b] min-h-screen text-neutral-200 selection:bg-red-700 selection:text-white font-sans">
        {/* Simple CRT overlay for admin dashboard looks extremely cyber/hacker/retro! */}
        <div className="absolute inset-0 pointer-events-none scanlines opacity-5" />
        {children}
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Immersive UI Effects */}
      <EnterOverlay />
      <CustomCursor />
      
      {/* 2. Film Grain Cinematic Layer */}
      <div className="film-grain" />

      {/* 3. Global Navbar */}
      <Navbar />

      {/* 4. Main Public Content */}
      <main className="flex-grow pt-20">
        {children}
      </main>

      {/* 5. Global Footer */}
      <Footer />
    </div>
  );
};

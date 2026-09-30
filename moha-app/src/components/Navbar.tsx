"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAudio } from "@/context/AudioContext";
import { Volume2, VolumeX, Flame, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { isMuted, toggleMute, playHoverSound, playClickSound } = useAudio();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { name: "HOME", href: "/" },
    { name: "ABOUT", href: "/about" },
    { name: "LORE", href: "/lore" },
    { name: "CHARACTERS", href: "/characters" },
    { name: "CREATURES", href: "/creatures" },
    { name: "FEATURES", href: "/gameplay" },
    { name: "GALLERY", href: "/gallery" },
    { name: "NEWS", href: "/news" },
    { name: "COMMUNITY", href: "/community" },
    { name: "FAQ", href: "/faq" },
    { name: "CONTACT", href: "/contact" },
  ];

  const logWishlistClick = async () => {
    playClickSound();
    try {
      await fetch("/api/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventType: "wishlist_click",
          metadata: "User clicked WISHLIST ON STEAM in main navigation",
        }),
      });
    } catch (err) {
      console.warn("Analytics error:", err);
    }
    // Redirect to official steam (or store placeholder)
    window.open("https://store.steampowered.com", "_blank");
  };

  const isLinkActive = (href: string) => {
    if (href === "/" && pathname !== "/") return false;
    return pathname.startsWith(href);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-40 bg-[#050505]/80 backdrop-blur-md border-b border-red-950/30 px-6 py-4 flex items-center justify-between">
        {/* Logo / Title */}
        <Link
          href="/"
          onClick={playClickSound}
          onMouseEnter={playHoverSound}
          className="flex items-center gap-2 group cursor-pointer"
        >
          <Flame className="w-6 h-6 text-red-600 group-hover:text-red-500 transition-colors animate-pulse" />
          <div className="flex flex-col">
            <span className="font-bebas text-xl md:text-2xl text-white tracking-widest leading-none">
              MOHA
            </span>
            <span className="text-[7px] text-neutral-500 font-sans tracking-[0.3em] font-bold group-hover:text-red-500 transition-colors leading-none mt-0.5">
              BLACK MIRAGE
            </span>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden xl:flex items-center gap-6">
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={playClickSound}
              onMouseEnter={playHoverSound}
              className={`text-[10px] font-sans tracking-[0.2em] font-bold transition-all duration-300 relative py-1 hover:text-red-500 ${
                isLinkActive(link.href) ? "text-red-500" : "text-neutral-400"
              }`}
            >
              {link.name}
              {isLinkActive(link.href) && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-[1px] bg-red-600"
                  layoutId="activeNavIndicator"
                />
              )}
            </Link>
          ))}
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-3">
          {/* Audio toggle */}
          <button
            onClick={() => {
              playClickSound();
              toggleMute();
            }}
            onMouseEnter={playHoverSound}
            className="p-2 rounded bg-neutral-900 border border-neutral-800 hover:border-red-900 hover:bg-red-950/20 text-neutral-400 hover:text-red-500 transition-all duration-300 cursor-pointer"
            title={isMuted ? "Unmute Ambient Sound" : "Mute Sound"}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 animate-pulse" />}
          </button>

          {/* Steam Wishlist Button */}
          <button
            onClick={logWishlistClick}
            onMouseEnter={playHoverSound}
            className="hidden md:flex px-4 py-2 bg-gradient-to-r from-red-950 to-red-800 hover:from-red-900 hover:to-red-600 text-white rounded text-[10px] tracking-[0.15em] font-bold border border-red-700 hover:border-red-500 transition-all duration-300 cursor-pointer shadow-[0_0_15px_rgba(122,0,0,0.3)] hover:shadow-[0_0_20px_rgba(163,0,0,0.6)]"
          >
            WISHLIST ON STEAM
          </button>

          {/* Admin link shortcut (Subtle icon or text) */}
          <Link
            href="/admin"
            onClick={playClickSound}
            onMouseEnter={playHoverSound}
            className="hidden md:block text-[9px] font-mono tracking-widest text-neutral-600 hover:text-red-500 py-2 px-1 transition-all duration-300"
          >
            [PORTAL]
          </Link>

          {/* Mobile menu trigger */}
          <button
            onClick={() => {
              playClickSound();
              setMobileOpen(!mobileOpen);
            }}
            onMouseEnter={playHoverSound}
            className="p-2 rounded bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-red-500 transition-all duration-300 cursor-pointer xl:hidden"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-30 bg-[#050505]/95 backdrop-blur-xl pt-24 px-6 flex flex-col xl:hidden"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Mobile Scanline Overlay */}
            <div className="absolute inset-0 pointer-events-none scanlines opacity-10" />

            <div className="flex flex-col gap-4 text-center mt-6">
              {links.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => {
                    playClickSound();
                    setMobileOpen(false);
                  }}
                  onMouseEnter={playHoverSound}
                  className={`text-lg font-bebas tracking-[0.25em] py-2 transition-all duration-300 ${
                    isLinkActive(link.href) ? "text-red-500 text-xl border-y border-red-950/20" : "text-neutral-300 hover:text-red-500"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Mobile Steam CTA */}
            <button
              onClick={() => {
                setMobileOpen(false);
                logWishlistClick();
              }}
              className="mt-12 px-6 py-4 bg-gradient-to-r from-red-950 to-red-800 text-white font-bebas text-lg tracking-[0.2em] rounded border border-red-700 cursor-pointer shadow-xl text-center active:scale-95"
            >
              WISHLIST ON STEAM
            </button>

            {/* Admin shortcut on mobile */}
            <Link
              href="/admin"
              onClick={() => {
                playClickSound();
                setMobileOpen(false);
              }}
              className="mt-8 text-center text-xs font-mono tracking-widest text-neutral-600 hover:text-red-500"
            >
              [ADMIN SECURE PORTAL]
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

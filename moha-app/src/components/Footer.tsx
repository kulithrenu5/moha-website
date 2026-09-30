"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAudio } from "@/context/AudioContext";
import { Send, Sparkles, Flame, Play, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

export const Footer: React.FC = () => {
  const { playHoverSound, playClickSound } = useAudio();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    playClickSound();
    setLoading(true);
    setMessage(null);
    setIsError(false);

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Thank you! You are now subscribed. The spirits are pleased.");
        setEmail("");
      } else {
        setIsError(true);
        setMessage(data.error || "An error occurred during subscription.");
      }
    } catch (err) {
      setIsError(true);
      setMessage("Failed to connect to the portal. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-[#050505] border-t border-red-950/20 pt-16 pb-8 px-6 relative z-10 overflow-hidden">
      {/* Visual background bleed */}
      <div className="absolute bottom-0 left-1/2 translate-x-[-50%] w-[600px] h-[200px] bg-red-950/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16 relative z-10">
        {/* Left Column: Branding and University Disclaimer */}
        <div className="flex flex-col gap-4">
          <Link href="/" onClick={playClickSound} className="flex items-center gap-2 group cursor-pointer w-fit">
            <Flame className="w-6 h-6 text-red-600 animate-pulse" />
            <div className="flex flex-col">
              <span className="font-bebas text-2xl text-white tracking-widest">MOHA</span>
              <span className="text-[7px] text-neutral-500 font-sans tracking-[0.3em] font-bold mt-0.5">
                BLACK MIRAGE
              </span>
            </div>
          </Link>
          <p className="text-xs text-neutral-500 leading-relaxed max-w-sm font-sans mt-2">
            MOHA is a deeply psychological first-person horror survival game set in the haunted forests of Meemure, Sri Lanka. Based on authentic mythology and legends.
          </p>
          <div className="border border-neutral-900 bg-neutral-950/50 p-4 rounded text-[10px] text-neutral-600 font-mono leading-relaxed mt-4">
            <span className="text-red-900 font-bold block mb-1">UNIVERSITY PROJECT DISCLAIMER</span>
            This site is developed as part of a high-end Software Engineering assessment for advanced responsive architectures, database transactions, reporting modules, and client-side interactive visual design. All metrics and administrative controls are fully functional.
          </div>
        </div>

        {/* Center Column: Quick Links & Lore */}
        <div className="grid grid-cols-2 gap-8">
          <div className="flex flex-col gap-3">
            <h4 className="text-xs tracking-[0.2em] font-bold text-red-600 uppercase mb-2">Navigation</h4>
            <Link href="/about" onMouseEnter={playHoverSound} onClick={playClickSound} className="text-xs text-neutral-400 hover:text-red-500 transition-colors">About MOHA</Link>
            <Link href="/lore" onMouseEnter={playHoverSound} onClick={playClickSound} className="text-xs text-neutral-400 hover:text-red-500 transition-colors">Story & Lore</Link>
            <Link href="/characters" onMouseEnter={playHoverSound} onClick={playClickSound} className="text-xs text-neutral-400 hover:text-red-500 transition-colors">Characters</Link>
            <Link href="/creatures" onMouseEnter={playHoverSound} onClick={playClickSound} className="text-xs text-neutral-400 hover:text-red-500 transition-colors">Demons / Folklore</Link>
            <Link href="/gameplay" onMouseEnter={playHoverSound} onClick={playClickSound} className="text-xs text-neutral-400 hover:text-red-500 transition-colors">Gameplay Features</Link>
          </div>
          <div className="flex flex-col gap-3">
            <h4 className="text-xs tracking-[0.2em] font-bold text-red-600 uppercase mb-2">Information</h4>
            <Link href="/gallery" onMouseEnter={playHoverSound} onClick={playClickSound} className="text-xs text-neutral-400 hover:text-red-500 transition-colors">Media Gallery</Link>
            <Link href="/news" onMouseEnter={playHoverSound} onClick={playClickSound} className="text-xs text-neutral-400 hover:text-red-500 transition-colors">Updates / News</Link>
            <Link href="/community" onMouseEnter={playHoverSound} onClick={playClickSound} className="text-xs text-neutral-400 hover:text-red-500 transition-colors">Join Community</Link>
            <Link href="/faq" onMouseEnter={playHoverSound} onClick={playClickSound} className="text-xs text-neutral-400 hover:text-red-500 transition-colors">FAQ</Link>
            <Link href="/contact" onMouseEnter={playHoverSound} onClick={playClickSound} className="text-xs text-neutral-400 hover:text-red-500 transition-colors">Contact Press</Link>
          </div>
        </div>

        {/* Right Column: Newsletter Subscription */}
        <div className="flex flex-col gap-4">
          <h4 className="text-xs tracking-[0.2em] font-bold text-red-600 uppercase">Subscribe to the ritual</h4>
          <p className="text-xs text-neutral-400 leading-relaxed font-sans">
            Get exclusive developer updates, lore notes, alpha playtesting slots, and notifications when the demo drops.
          </p>

          <form onSubmit={handleSubscribe} className="flex gap-2 mt-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="flex-1 bg-neutral-950 border border-neutral-900 rounded p-3 text-xs text-white focus:outline-none focus:border-red-600 transition-all font-sans"
            />
            <button
              type="submit"
              disabled={loading}
              onMouseEnter={playHoverSound}
              className="px-4 py-3 bg-red-950 hover:bg-red-800 text-white rounded transition-all border border-red-700 hover:border-red-500 cursor-pointer flex items-center justify-center disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </form>

          {message && (
            <motion.p
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className={`text-[11px] leading-relaxed font-sans ${isError ? "text-red-500" : "text-emerald-500"}`}
            >
              {message}
            </motion.p>
          )}

          {/* Social Icons Row */}
          <div className="flex items-center gap-4 mt-4">
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={playHoverSound}
              onClick={playClickSound}
              className="text-neutral-500 hover:text-red-500 transition-colors"
            >
              <Play className="w-5 h-5" />
            </a>
            <a
              href="https://discord.gg"
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={playHoverSound}
              onClick={playClickSound}
              className="text-neutral-500 hover:text-red-500 transition-colors"
            >
              <MessageSquare className="w-5 h-5" />
            </a>
            <a
              href="https://store.steampowered.com"
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={playHoverSound}
              onClick={playClickSound}
              className="text-neutral-500 hover:text-red-500 transition-colors flex items-center gap-1 text-[10px] font-mono tracking-widest uppercase border border-neutral-900 px-2 py-1 rounded hover:border-red-950"
            >
              <Sparkles className="w-3.5 h-3.5 text-red-500" />
              <span>STEAM</span>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="max-w-7xl mx-auto border-t border-neutral-950 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left text-[10px] text-neutral-600 font-mono tracking-wider relative z-10">
        <div>
          © {new Date().getFullYear()} MOHA horror project. Developed by Black Mirage Studio. All Rights Reserved.
        </div>
        <div className="flex items-center gap-4">
          <Link href="/privacy" onMouseEnter={playHoverSound} onClick={playClickSound} className="hover:text-red-500 transition-colors">PRIVACY POLICY</Link>
          <span>|</span>
          <Link href="/terms" onMouseEnter={playHoverSound} onClick={playClickSound} className="hover:text-red-500 transition-colors">TERMS OF SERVICE</Link>
          <span>|</span>
          <Link href="/admin" onMouseEnter={playHoverSound} onClick={playClickSound} className="hover:text-red-500 transition-colors text-neutral-500">[ADMIN]</Link>
        </div>
      </div>
    </footer>
  );
};

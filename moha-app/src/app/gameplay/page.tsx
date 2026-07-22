"use client";

import React, { useEffect } from "react";
import { useAudio } from "@/context/AudioContext";
import { Compass, Battery, Volume2, ShieldAlert } from "lucide-react";

export default function GameplayPage() {
  const { playHoverSound, playClickSound } = useAudio();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll(".reveal-on-scroll").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="bg-[#050505] min-h-screen text-white py-20 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Title */}
        <div className="text-center mb-16 reveal-on-scroll">
          <p className="text-[10px] tracking-[0.4em] text-red-600 uppercase font-bold mb-3 font-mono">The Rules of Engagement</p>
          <h1 className="text-4xl md:text-5xl font-extrabold uppercase tracking-[0.15em] mb-4">Gameplay Mechanics</h1>
          <div className="w-16 h-[2px] bg-red-700 mx-auto mt-4" />
        </div>

        {/* Hero split */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center reveal-on-scroll mb-16">
          <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-bold uppercase tracking-wider text-red-500 font-bebas">First-Person Survival Horror</h2>
            <p className="text-xs text-neutral-400 leading-relaxed font-sans">
              MOHA delivers a brutal, unforgiving experience that prioritizes tactical planning and acute physical awareness over simple fast-paced shooting.
            </p>
            <p className="text-xs text-neutral-400 leading-relaxed font-sans">
              To survive, players must leverage a mixture of modern items like highly-focused high-intensity flashlights, mechanical keys, and hand-held cameras, alongside traditional Sri Lankan **Thovil talismans** and salt-water powders to craft holy barriers against the dark.
            </p>
          </div>

          <div className="relative h-64 bg-neutral-950 border border-neutral-900 rounded-lg overflow-hidden flex items-center justify-center">
            <img
              src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop"
              alt="Occult ritual representation"
              className="w-full h-full object-cover opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] to-transparent" />
            <div className="absolute bottom-6 left-6 text-left">
              <span className="text-[8px] font-mono tracking-[0.2em] text-red-500 uppercase block mb-1">TRADITIONAL EXORCISM</span>
              <p className="text-xs text-neutral-300 font-sans font-bold">Wield the ancient clay Thovil lamps.</p>
            </div>
          </div>
        </div>

        {/* Detailed Mechanics List */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 reveal-on-scroll">
          {/* Mech 1 */}
          <div className="bg-neutral-950 border border-neutral-900/60 p-6 rounded hover:border-red-950 transition-colors">
            <Battery className="w-6 h-6 text-red-600 mb-4 animate-pulse" />
            <h3 className="text-sm tracking-wider uppercase text-white font-bold mb-2">Tactical Flashlight System</h3>
            <p className="text-xs text-neutral-400 leading-relaxed font-sans">
              Your flashlight is your lifeline, but batteries are rare and drain rapidly. You must conserve your light, clicking it on and off, or choosing to walk in absolute, terrifying pitch darkness to hide your position.
            </p>
          </div>

          {/* Mech 2 */}
          <div className="bg-neutral-950 border border-neutral-900/60 p-6 rounded hover:border-red-950 transition-colors">
            <Compass className="w-6 h-6 text-red-600 mb-4" />
            <h3 className="text-sm tracking-wider uppercase text-white font-bold mb-2">Physical Item Examination</h3>
            <p className="text-xs text-neutral-400 leading-relaxed font-sans">
              Every document, diary page, and key can be rotated, flipped, and opened in 3D in your hand to find hidden drawer compartments, etched numbers, and cryptic symbols required to bypass lock mechanisms.
            </p>
          </div>

          {/* Mech 3 */}
          <div className="bg-neutral-950 border border-neutral-900/60 p-6 rounded hover:border-red-950 transition-colors">
            <ShieldAlert className="w-6 h-6 text-red-600 mb-4" />
            <h3 className="text-sm tracking-wider uppercase text-white font-bold mb-2">Binaural Heartbeat Response</h3>
            <p className="text-xs text-neutral-400 leading-relaxed font-sans">
              When encountering spirits like Mohini or hearing Mahasona's grunt, your character's panic rises, speeding up your heartbeat. A fast heartbeat blocks out subtle environmental hints and increases the chance of hyperventilating.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

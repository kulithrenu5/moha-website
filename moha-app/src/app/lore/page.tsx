"use client";

import React, { useEffect } from "react";
import { useAudio } from "@/context/AudioContext";
import { BookOpen, Map, Eye } from "lucide-react";

export default function LorePage() {
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
          <p className="text-[10px] tracking-[0.4em] text-red-600 uppercase font-bold mb-3 font-mono">The Annals of Darkness</p>
          <h1 className="text-4xl md:text-5xl font-extrabold uppercase tracking-[0.15em] mb-4">Story & Lore</h1>
          <div className="w-16 h-[2px] bg-red-700 mx-auto mt-4" />
        </div>

        {/* Narrative columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start reveal-on-scroll mb-16">
          <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-bold uppercase tracking-wider text-red-500 font-bebas">The Awakening of Mahasona</h2>
            <p className="text-xs text-neutral-400 leading-relaxed font-sans">
              Driven by skepticism and academic curiosity, a group of five teenagers travels to **Meemure**, an isolated jungle village tucked away in the deep mist-covered hills of central Sri Lanka. Their goal is to research ancient exorcism rituals, locally known as **Thovil**, and catalog folklore that urban culture has long since forgotten.
            </p>
            <p className="text-xs text-neutral-400 leading-relaxed font-sans">
              However, their arrival triggers an ancient curse. An occult seal buried in the crumbling monastery steps of **Ritigala** is shattered, releasing **Mahasona**, the terrifying, bear-headed lord of cemeteries, and his army of bloodthirsty spirits. What began as a school research trip immediately turns into a desperate, frantic scramble for physical and psychological survival.
            </p>
          </div>

          <div className="border border-neutral-900 bg-neutral-950 p-8 rounded-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-950/5 blur-[50px] rounded-full pointer-events-none" />
            <h3 className="text-sm font-bold uppercase text-white tracking-widest mb-4 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-red-500" />
              <span>THE EXORCIST'S DIARY (1973)</span>
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed italic font-serif mb-4">
              "We have drawn the lines in the clay, lit the seven torches of the coconut shell, and prepared the salt powder. The grunting of a giant boar echoes from the tree canopy, and my assistants are shaking. They say the half-man, half-beast is smelling the blood. He does not hunt with eyes, but with our breaths..."
            </p>
            <span className="text-[10px] font-mono text-red-600 uppercase font-bold tracking-widest">
              - DISCOVERED SCROLL IN WALAWWA CELLARS
            </span>
          </div>
        </div>

        {/* Setting Highlights */}
        <div className="text-center mb-12 reveal-on-scroll">
          <h3 className="text-xl font-bold uppercase tracking-wider mb-2">Key Locations</h3>
          <p className="text-xs text-neutral-500 font-sans max-w-lg mx-auto">Explore these haunting, meticulously researched locations reconstructed with hyper-realistic UE5 photogrammetry.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 reveal-on-scroll">
          {/* Location 1 */}
          <div className="bg-neutral-950 border border-neutral-900 rounded-lg overflow-hidden hover:border-red-950 transition-colors group">
            <div className="h-44 relative bg-neutral-900 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=600&auto=format&fit=crop"
                alt="Ritigala Ruins"
                className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 to-transparent" />
            </div>
            <div className="p-6">
              <h4 className="text-sm font-bold uppercase tracking-wide text-white mb-2">Ritigala Ruins</h4>
              <p className="text-[11px] text-neutral-400 leading-relaxed font-sans">
                A 1st-century Buddhist monastery sanctuary long reclaimed by massive tree roots. These stone steps hide ancient protective seals and cryptic, occult carvings.
              </p>
            </div>
          </div>

          {/* Location 2 */}
          <div className="bg-neutral-950 border border-neutral-900 rounded-lg overflow-hidden hover:border-red-950 transition-colors group">
            <div className="h-44 relative bg-neutral-900 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1513530534585-c7b1394c6d51?q=80&w=600&auto=format&fit=crop"
                alt="Meemure Village"
                className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 to-transparent" />
            </div>
            <div className="p-6">
              <h4 className="text-sm font-bold uppercase tracking-wide text-white mb-2">Meemure Village</h4>
              <p className="text-[11px] text-neutral-400 leading-relaxed font-sans">
                An isolated jungle settlement nestled beneath the jagged peaks of Knuckles Range. Cut off from modern communication, its residents guard deep secrets of ancient blood-bonds.
              </p>
            </div>
          </div>

          {/* Location 3 */}
          <div className="bg-neutral-950 border border-neutral-900 rounded-lg overflow-hidden hover:border-red-950 transition-colors group">
            <div className="h-44 relative bg-neutral-900 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600&auto=format&fit=crop"
                alt="The Walawwa Manor"
                className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 to-transparent" />
            </div>
            <div className="p-6">
              <h4 className="text-sm font-bold uppercase tracking-wide text-white mb-2">The Walawwa Manor</h4>
              <p className="text-[11px] text-neutral-400 leading-relaxed font-sans">
                A massive, decaying ancestral estate built during the colonial era. Some rooms are boarded up and protected by locks that should never be violated.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

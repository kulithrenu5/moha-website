"use client";

import React, { useEffect } from "react";
import { useAudio } from "@/context/AudioContext";
import { Skull, HelpCircle, Eye } from "lucide-react";

const demons = [
  {
    name: "MAHASONA",
    title: "King of Graveyards",
    origin: "Reborn warrior with a backward bear head.",
    ritual: "Draw a protective clay boundary, remain completely silent.",
    desc: "The supreme hunter of MOHA. His footsteps echo like thunder, and he tracks purely via the sound of your movements and panic-induced breathing.",
    img: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=600&auto=format&fit=crop",
  },
  {
    name: "MOHINI",
    title: "Ghostly Temptress",
    origin: "A restless phantom trapped in forest highways.",
    ritual: "Never accept her child, maintain solid eye-contact.",
    desc: "She manifests in remote clearings as a young mother in white. If you approach her or break eye contact, her beautiful mask peels back to expose a razor-jawed beast.",
    img: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=600&auto=format&fit=crop",
  },
  {
    name: "KALUKUMARAYA",
    title: "The Dream Devourer",
    origin: "A dark demon prince that targets the sleeping.",
    ritual: "Burn protective salt incenses, place talisman mirrors.",
    desc: "Haunts old bedchambers in the Walawwa manor. He attacks by trapping you in a sleep paralysis dream-state, slowly siphoning away your physical strength.",
    img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop",
  },
  {
    name: "RIRIYAKA",
    title: "The Blood Skirmisher",
    origin: "manifestation of fevers and raw violence.",
    ritual: "Fight back with an iron sickle, throw salt-water dust.",
    desc: "Small, fast, and rabid, they hunt in packs within the deep moonlit paddy fields, attacking from the tall grasses and inducing a draining bleed effect.",
    img: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600&auto=format&fit=crop",
  }
];

export default function CreaturesPage() {
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
          <p className="text-[10px] tracking-[0.4em] text-red-600 uppercase font-bold mb-3 font-mono">The Bestiary of Legend</p>
          <h1 className="text-4xl md:text-5xl font-extrabold uppercase tracking-[0.15em] mb-4">Demons & Folklore</h1>
          <div className="w-16 h-[2px] bg-red-700 mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          {demons.map((demon, i) => (
            <div
              key={i}
              className="bg-neutral-950 border border-neutral-900 rounded-lg overflow-hidden hover:border-red-950 transition-all duration-300 group reveal-on-scroll"
            >
              <div className="h-48 relative bg-neutral-900 overflow-hidden">
                <img
                  src={demon.img}
                  alt={demon.name}
                  className="w-full h-full object-cover opacity-30 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 to-transparent" />
                <div className="absolute top-4 right-4 bg-red-950/40 border border-red-900/50 p-1.5 rounded">
                  <Skull className="w-4 h-4 text-red-500" />
                </div>
              </div>

              <div className="p-6">
                <span className="text-[9px] font-mono tracking-widest text-red-500 uppercase block mb-1">
                  {demon.title}
                </span>
                <h3 className="text-2xl font-bold uppercase tracking-wider text-white mb-3">
                  {demon.name}
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed font-sans mb-4">
                  {demon.desc}
                </p>

                <div className="border-t border-neutral-900/80 pt-4 flex flex-col gap-2 font-sans">
                  <p className="text-[11px] text-neutral-400">
                    <strong className="text-neutral-500 font-mono text-[9px] uppercase tracking-wider block mb-0.5">Mythological Origin</strong>
                    {demon.origin}
                  </p>
                  <p className="text-[11px] text-neutral-400">
                    <strong className="text-neutral-500 font-mono text-[9px] uppercase tracking-wider block mb-0.5">Exorcism Ritual Repellent</strong>
                    {demon.ritual}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

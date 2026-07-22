"use client";

import React, { useState, useEffect } from "react";
import { useAudio } from "@/context/AudioContext";
import { UserCheck, ShieldAlert, Zap, Award } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const characters = [
  {
    id: "saman",
    name: "Saman",
    role: "The Group Leader & Lead Skeptic",
    age: "19",
    traits: "Analytical, Decisive, Headstrong",
    skill: "Flashlight Conservation & Structural Navigation",
    description: "Saman is a sophomore anthropology student who organized the expedition. His absolute refusal to believe in supernatural entities makes him bold—but his skepticism blinds him to the immediate threat until the Ritigala seals are broken. He wields the heavy high-beam flashlight.",
    visualUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "dinithi",
    name: "Dinithi",
    role: "The Folklore Scholar",
    age: "18",
    traits: "Intuitive, Empathetic, Highly Observant",
    skill: "Talisman Translation & Spell Deciphering",
    description: "Deeply interested in ancient Sinhalese rituals, Dinithi is the only one who takes the folklore seriously. Her ability to translate the Sanskrit scrolls and recognize the signs of the different demons is crucial to staying alive. She carries the ancient Exorcist's Diary.",
    visualUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "aravinda",
    name: "Aravinda",
    role: "The Tech & Media Specialist",
    age: "19",
    traits: "Nervous, Methodical, Resourceful",
    skill: "Spatial Sound Scanning & Night Vision Recording",
    description: "Armed with a digital camcorder and high-end microphones, Aravinda joined to document the journey. He is the first to detect Mahasona's approach by catching the infrasound of the demon's grunts on his audio receiver. He operates the camcorder view.",
    visualUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "kavinda",
    name: "Kavinda",
    role: "The Athlete",
    age: "19",
    traits: "Loyal, Physical, Reckless",
    skill: "Stamina Boost & Heavy Door Breaker",
    description: "Saman's childhood friend and a track runner. Kavinda is practical and strong, always volunteering to carry heavy items or force open jammed wooden doorways. However, his physical energy makes him noisy, which is a lethal drawback when hiding from Mahasona.",
    visualUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=600&auto=format&fit=crop",
  }
];

export default function CharactersPage() {
  const { playHoverSound, playClickSound } = useAudio();
  const [selected, setSelected] = useState(characters[0]);

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
          <p className="text-[10px] tracking-[0.4em] text-red-600 uppercase font-bold mb-3 font-mono">The Prey</p>
          <h1 className="text-4xl md:text-5xl font-extrabold uppercase tracking-[0.15em] mb-4">Characters</h1>
          <div className="w-16 h-[2px] bg-red-700 mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mt-12 items-start">
          {/* Navigation left */}
          <div className="md:col-span-4 flex flex-col gap-3 reveal-on-scroll">
            {characters.map((char) => (
              <button
                key={char.id}
                onClick={() => {
                  playClickSound();
                  setSelected(char);
                }}
                onMouseEnter={playHoverSound}
                className={`p-4 text-left rounded border transition-all duration-300 cursor-pointer ${
                  selected.id === char.id
                    ? "bg-red-950/20 border-red-700/80 shadow-[0_0_10px_rgba(122,0,0,0.1)]"
                    : "bg-neutral-950 border-neutral-900 hover:border-red-950 hover:bg-neutral-900/30"
                }`}
              >
                <h3 className={`text-lg font-bebas tracking-wider ${selected.id === char.id ? "text-red-500" : "text-neutral-300"}`}>
                  {char.name}
                </h3>
                <p className="text-[10px] text-neutral-500 font-sans tracking-wide mt-0.5">{char.role}</p>
              </button>
            ))}
          </div>

          {/* Details right */}
          <div className="md:col-span-8 reveal-on-scroll">
            <AnimatePresence mode="wait">
              <motion.div
                key={selected.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3 }}
                className="bg-neutral-950 border border-neutral-900 rounded-lg p-8 grid grid-cols-1 md:grid-cols-2 gap-8 relative overflow-hidden"
              >
                {/* Visual */}
                <div className="h-72 bg-neutral-900 rounded overflow-hidden border border-neutral-800 relative group">
                  <div className="absolute inset-0 bg-[#050505] flex items-center justify-center">
                    <UserCheck className="w-12 h-12 text-red-900/30 group-hover:scale-110 transition-transform duration-700" />
                  </div>
                  <img
                    src={selected.visualUrl}
                    alt={selected.name}
                    className="w-full h-full object-cover opacity-50 mix-blend-luminosity hover:mix-blend-normal transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-80" />
                  <div className="absolute bottom-4 left-4">
                    <span className="text-[9px] font-mono text-red-500 tracking-widest block uppercase font-bold mb-1">PROFILER RECORD</span>
                    <h4 className="text-sm font-sans tracking-wider text-white">{selected.name} (Age: {selected.age})</h4>
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] font-mono tracking-widest text-neutral-500 uppercase block mb-1">Role in party</span>
                    <h3 className="text-2xl font-extrabold uppercase tracking-wide text-white mb-4">{selected.role}</h3>
                    <p className="text-xs text-neutral-400 leading-relaxed font-sans mb-6">{selected.description}</p>
                  </div>

                  <div className="border-t border-neutral-900 pt-4 flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-red-600 flex-shrink-0" />
                      <span className="text-xs text-neutral-300 font-sans">
                        <strong className="text-neutral-500 font-mono text-[9px] uppercase tracking-wider block">Personality traits</strong>
                        {selected.traits}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 border-t border-neutral-900/50 pt-2">
                      <Zap className="w-4 h-4 text-amber-500 flex-shrink-0" />
                      <span className="text-xs text-neutral-300 font-sans">
                        <strong className="text-neutral-500 font-mono text-[9px] uppercase tracking-wider block">Special gameplay trait</strong>
                        {selected.skill}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useEffect } from "react";
import { useAudio } from "@/context/AudioContext";
import { Compass, Shield, Users, Heart } from "lucide-react";

export default function AboutPage() {
  const { playHoverSound, playClickSound } = useAudio();

  useEffect(() => {
    // Add scroll reveal
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
          <p className="text-[10px] tracking-[0.4em] text-red-600 uppercase font-bold mb-3 font-mono">Behind the Mirage</p>
          <h1 className="text-4xl md:text-5xl font-extrabold uppercase tracking-[0.15em] mb-4">About MOHA</h1>
          <div className="w-16 h-[2px] bg-red-700 mx-auto mt-4" />
        </div>

        {/* Studio and Game intro */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center reveal-on-scroll mb-16">
          <div className="relative h-80 rounded-lg overflow-hidden border border-neutral-900 bg-neutral-950">
            <img
              src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop"
              alt="Unreal Engine rendering"
              className="w-full h-full object-cover opacity-50"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <span className="text-[9px] font-mono tracking-widest text-red-500 uppercase font-bold block mb-1">UNREAL ENGINE 5 POWERED</span>
              <p className="text-sm text-neutral-300">Pushing the boundaries of spatial atmosphere and micro-lighting.</p>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-bold uppercase tracking-wider text-white">Our Flagship Title</h2>
            <p className="text-xs text-neutral-400 leading-relaxed font-sans">
              **MOHA** is a deeply immersive and emotionally driven survival horror game, built to leave players thinking about its world and characters long after the journey ends. Created by **Black Mirage Studio**, a leading indie studio representing professional game development from Sri Lanka.
            </p>
            <p className="text-xs text-neutral-400 leading-relaxed font-sans">
              Our mission is to introduce global audiences to the ancient, occult, and highly terrifying lore of South Asian folklore, utilizing state-of-the-art volumetric lighting, performance-captured facial animation, and procedural sound synthesis.
            </p>
          </div>
        </div>

        {/* Studio Vision Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 reveal-on-scroll">
          <div className="bg-neutral-950 border border-neutral-900 p-6 rounded hover:border-red-950 transition-colors">
            <Users className="w-6 h-6 text-red-600 mb-4" />
            <h3 className="text-sm tracking-wider uppercase text-white font-bold mb-2">Authentic representation</h3>
            <p className="text-xs text-neutral-400 leading-relaxed font-sans">
              Our team works closely with archeologists, historians, and cultural advisors in Sri Lanka to ensure that temple layouts, language structures, and exorcism rituals are chillingly authentic.
            </p>
          </div>

          <div className="bg-neutral-950 border border-neutral-900 p-6 rounded hover:border-red-950 transition-colors">
            <Compass className="w-6 h-6 text-red-600 mb-4" />
            <h3 className="text-sm tracking-wider uppercase text-white font-bold mb-2">Atmospheric gameplay</h3>
            <p className="text-xs text-neutral-400 leading-relaxed font-sans">
              We design horror around the absence of safety. No quick saves, no flashing minimaps. Every shadow must be parsed with physical exploration and flashlight-battery conservation.
            </p>
          </div>

          <div className="bg-neutral-950 border border-neutral-900 p-6 rounded hover:border-red-950 transition-colors">
            <Shield className="w-6 h-6 text-red-600 mb-4" />
            <h3 className="text-sm tracking-wider uppercase text-white font-bold mb-2">Technical excellence</h3>
            <p className="text-xs text-neutral-400 leading-relaxed font-sans">
              By adopting Unreal Engine 5's Nanite and MetaSound systems, we construct dense, spatial, and photorealistic landscapes that capture the heavy dampness of ancient rain forests.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

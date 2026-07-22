"use client";

import React, { useState, useEffect } from "react";
import { useAudio } from "@/context/AudioContext";
import { CinematicHeroCanvas } from "@/components/CinematicHeroCanvas";
import {
  Flame,
  Volume2,
  Sparkles,
  Play,
  Share2,
  Calendar,
  Compass,
  Zap,
  Skull,
  Shield,
  Clock,
  Eye,
  ChevronRight,
  UserCheck,
  X,
  Plus
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

// Lore structure for the five demons of Sri Lankan mythology
const demons = [
  {
    id: "mahasona",
    name: "MAHASONA",
    title: "The King of Cemeteries",
    description: "A colossal, 12-foot-tall demon with the head of a fierce bear (or lion) turned backward, riding a giant black boar. He was once Jayasena, a human giant of legendary strength, who was decapitated in a duel of honor. His friends panic-attached a bear's head to revive him. Shamed and filled with absolute hatred, he became the supreme stalker of the dead.",
    mechanics: "Sound-based tracker. He cannot see, but has hyper-acute hearing. Running or stepping on twigs will immediately reveal your location. When he approaches, your flashlight will flicker and chromatic aberration will distort your screen.",
    visualUrl: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=600&auto=format&fit=crop",
    quote: '"His paw slams onto the victim\'s back, leaving a cold blue bruise that rots the soul in hours."',
  },
  {
    id: "mohini",
    name: "MOHINI",
    title: "The Ghostly Mother",
    description: "Appears under the full moon as an ethereal, beautiful young woman dressed in white, cradling a baby on lonely forest roads. She asks travelers to hold her child for a moment while she ties her hair. Anyone who takes the baby falls under an instant curse, as the baby turns into a demonic doll and Mohini reveals her fanged, rotting visage.",
    mechanics: "A siren-like illusion entity. She lures you with soft, echoing baby cries. If you approach, you must maintain eye contact and walk backward slowly. Turning your back or running triggers an instant throat-slitting charge.",
    visualUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=600&auto=format&fit=crop",
    quote: '"Can you hold my child, traveler? Just for a second..."',
  },
  {
    id: "kalukumaraya",
    name: "KALUKUMARAYA",
    title: "The Dark Prince",
    description: "A shadowy, seductive demon prince who haunts the dreams of young women and travelers sleeping in old manor houses (Walawwas). He manifests as a dark cloud or a handsome black-clad youth, inducing sleep paralysis, severe night sweats, and physical weakness, slowly draining the victim\'s life force.",
    mechanics: "A dream-state predator. He spawns while you investigate the indoor bedrooms of the Walawwa. He attacks by raising the room temperature and inducing hallucinations. You must find hidden talisman mirrors to reflect his gaze and break the sleep paralysis.",
    visualUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop",
    quote: '"Do not fall asleep in the master bedroom. He is already waiting."',
  },
  {
    id: "ririyaka",
    name: "RIRIYAKA",
    title: "The Blood Demon",
    description: "A small, manic, and highly hyperactive demon who is perpetually drenched in blood. He carries a small club and has skin covered in raw sores. Ririyaka is the physical manifestation of high fevers, hemorrhages, and pure animalistic bloodlust, dwelling near moonlit paddy fields and stagnant waters.",
    mechanics: "A high-speed skirmisher. Ririyaka travels in packs. They attack from the tall paddy grasses, biting and inflicting a bleeding status effect. Wielding an ancient iron sickle or using salt-water Thovil powder are the only ways to repel them.",
    visualUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600&auto=format&fit=crop",
    quote: '"He drinks the blood of cattle and men, leaving dry husks in the mud."',
  },
  {
    id: "kinduri",
    name: "KINDURI",
    title: "The Forest Siren",
    description: "A tragic, weeping creature with the upper torso of a pregnant woman and the lower body of a majestic bird. In ancient folklore, she was a pregnant woman banished to the jungle who died in childbed. Now, her spirit haunts the deep valleys of Meemure, weeping mournfully and striking down anyone who dares to cross her nesting trees.",
    mechanics: "An environmental sound obstacle. Her agonizing wails block out other sounds (including Mahasona's footsteps). You must burn incense to soothe her spirit and quiet her cries to safely navigate the sector.",
    visualUrl: "https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?q=80&w=600&auto=format&fit=crop",
    quote: '"Her weeping mimics the wind, but it carries a mother\'s cold wrath."',
  }
];

// Timeline events
const timeline = [
  {
    date: "Q3 2025",
    title: "Research & Photogrammetry Phase",
    description: "Traveled to Meemure and Ritigala to scan ancient structures, ruins, and capture authentic ambient soundscapes of the Sri Lankan tropical jungle.",
    status: "Completed",
  },
  {
    date: "Q4 2025",
    title: "Pre-Alpha Mechanics Verification",
    description: "Built the advanced first-person physical environment interactions, flashlight physics, and procedural wind synthesizer systems in Unreal Engine 5.",
    status: "Completed",
  },
  {
    date: "Q1 2026",
    title: "First-Look Official Teaser",
    description: "Released the first official cinematic trailer for MOHA. Reached over 100,000 views in the horror gaming community.",
    status: "Completed",
  },
  {
    date: "Q2 2026",
    title: "Exorcism Systems & AI",
    description: "Completed the AI behavior for Mahasona (sound-guided stalker) and implemented traditional Sri Lankan Thovil talisman creation mechanics.",
    status: "In Progress",
  },
  {
    date: "Q4 2026",
    title: "Public Playable Steam Demo",
    description: "Launching our first public demo during the Steam Next Fest, covering the initial 3 hours of the Meemure prologue.",
    status: "Upcoming",
  },
  {
    date: "2027",
    title: "Full Commercial Launch",
    description: "Global release of the full MOHA game on Steam, with console ports (PS5, Xbox Series X) to follow shortly.",
    status: "Upcoming",
  }
];

export default function Home() {
  const { playHoverSound, playClickSound, playTrailerSound } = useAudio();
  const [selectedDemon, setSelectedDemon] = useState(demons[0]);
  const [showTrailer, setShowTrailer] = useState(false);

  // Trigger scroll reveals using pure CSS intersections
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

    document.querySelectorAll(".reveal-on-scroll").forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleSteamClick = async (type: "wishlist" | "demo") => {
    playClickSound();
    try {
      await fetch("/api/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventType: type === "wishlist" ? "wishlist_click" : "steam_click",
          metadata: `User clicked ${type.toUpperCase()} from Homepage Hero CTA`,
        }),
      });
    } catch (err) {
      console.warn(err);
    }
    window.open("https://store.steampowered.com", "_blank");
  };

  const handleOpenTrailer = () => {
    playTrailerSound();
    setShowTrailer(true);
  };

  return (
    <div className="relative bg-[#050505] min-h-screen text-white overflow-hidden">
      {/* 1. CINEMATIC HERO SECTION */}
      <section className="relative h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden select-none">
        {/* Animated Particle background */}
        <CinematicHeroCanvas />

        {/* Floating Ambient blood shadows */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(0,0,0,0)_20%,rgba(5,5,5,0.95)_90%)] z-[1]" />

        <div className="relative z-10 max-w-4xl flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0 }}
            className="flex items-center gap-1.5 px-3 py-1 border border-red-950 bg-red-950/20 backdrop-blur-md rounded-full mb-6"
          >
            <Flame className="w-3.5 h-3.5 text-red-500 animate-pulse" />
            <span className="text-[9px] tracking-[0.3em] uppercase font-bold text-red-500">
              Official Interactive Showcase
            </span>
          </motion.div>

          {/* Huge Game Logo */}
          <motion.h1
            className="text-8xl md:text-[13rem] font-extrabold uppercase font-sans tracking-[0.25em] leading-none mb-4 select-none filter drop-shadow-[0_0_40px_rgba(163,0,0,0.4)]"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            initial={{ opacity: 0, scale: 0.9, filter: "blur(8px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ delay: 0.3, duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
          >
            <span className="text-red-700">M</span>OHA
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-xs md:text-sm tracking-[0.4em] text-neutral-400 uppercase font-cinzel font-semibold max-w-2xl leading-relaxed mb-10 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ delay: 0.8, duration: 1.0 }}
          >
            Sri Lankan Folklore Survival Horror
          </motion.p>

          {/* Dynamic Interactive CTA buttons with Red Pulse hover */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full px-6 max-w-3xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.8 }}
          >
            <button
              onClick={() => handleSteamClick("wishlist")}
              onMouseEnter={playHoverSound}
              className="px-6 py-4 bg-[#7A0000] hover:bg-[#A30000] text-white rounded font-sans text-xs tracking-[0.2em] font-bold border border-red-600 transition-all duration-300 shadow-[0_0_20px_rgba(122,0,0,0.4)] hover:shadow-[0_0_30px_rgba(239,68,68,0.7)] cursor-pointer hover:scale-[1.03] active:scale-95 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-white" />
              <span>WISHLIST ON STEAM</span>
            </button>

            <button
              onClick={() => handleSteamClick("demo")}
              onMouseEnter={playHoverSound}
              className="px-6 py-4 bg-neutral-950/70 hover:bg-neutral-900 text-neutral-200 hover:text-white rounded font-sans text-xs tracking-[0.2em] font-bold border border-neutral-800 hover:border-red-950 transition-all duration-300 cursor-pointer hover:scale-[1.03] active:scale-95 flex items-center justify-center gap-2"
            >
              <span>GET STEAM DEMO</span>
            </button>

            <button
              onClick={handleOpenTrailer}
              onMouseEnter={playHoverSound}
              className="px-6 py-4 bg-neutral-950/70 hover:bg-red-950/20 text-neutral-200 hover:text-red-500 rounded font-sans text-xs tracking-[0.2em] font-bold border border-neutral-800 hover:border-red-800 transition-all duration-300 cursor-pointer hover:scale-[1.03] active:scale-95 flex items-center justify-center gap-2"
            >
              <Play className="w-3.5 h-3.5 text-red-500 fill-red-500" />
              <span>WATCH TRAILER</span>
            </button>

            <Link
              href="/community"
              onMouseEnter={playHoverSound}
              onClick={playClickSound}
              className="px-6 py-4 bg-neutral-950/70 hover:bg-neutral-900 text-neutral-200 hover:text-white rounded font-sans text-xs tracking-[0.2em] font-bold border border-neutral-800 hover:border-red-950 transition-all duration-300 cursor-pointer hover:scale-[1.03] active:scale-95 flex items-center justify-center gap-2"
            >
              <span>JOIN COMMUNITY</span>
            </Link>
          </motion.div>
        </div>

        {/* Scroll Down mouse indicator */}
        <div className="absolute bottom-10 left-1/2 translate-x-[-50%] z-10 flex flex-col items-center gap-2 opacity-50 hover:opacity-100 transition-opacity cursor-pointer">
          <span className="text-[8px] tracking-[0.3em] font-mono text-neutral-500 uppercase">Scroll to uncover</span>
          <div className="w-5 h-9 rounded-full border border-neutral-700 p-1 flex justify-center">
            <motion.div
              className="w-1.5 h-2 bg-red-600 rounded-full"
              animate={{ y: [0, 12, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            />
          </div>
        </div>
      </section>

      {/* 2. SRI LANKAN FOLKLORE SECTION (DEMON VIEWER) */}
      <section className="relative py-24 px-6 bg-[#0B0B0B] border-t border-neutral-950 z-10 select-none">
        <div className="max-w-7xl mx-auto">
          {/* Section title */}
          <div className="text-center mb-16 reveal-on-scroll">
            <p className="text-[10px] tracking-[0.4em] text-red-600 uppercase font-bold mb-3 font-mono">The Ancient Curse Is Real</p>
            <h2 className="text-4xl md:text-5xl font-extrabold uppercase tracking-[0.1em]">Sri Lankan Folklore</h2>
            <div className="w-16 h-[2px] bg-red-700 mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mt-12">
            {/* Left list: 5 Demons */}
            <div className="lg:col-span-4 flex flex-col gap-3 reveal-on-scroll">
              {demons.map((demon) => (
                <button
                  key={demon.id}
                  onClick={() => {
                    playClickSound();
                    setSelectedDemon(demon);
                  }}
                  onMouseEnter={playHoverSound}
                  className={`text-left p-5 rounded-lg border transition-all duration-300 cursor-pointer flex items-center justify-between group ${
                    selectedDemon.id === demon.id
                      ? "bg-red-950/20 border-red-700/80 shadow-[0_0_15px_rgba(122,0,0,0.2)]"
                      : "bg-neutral-950 border-neutral-900/60 hover:border-red-950 hover:bg-neutral-900/40"
                  }`}
                >
                  <div>
                    <h3
                      className={`text-lg font-bebas tracking-[0.15em] transition-colors group-hover:text-red-500 ${
                        selectedDemon.id === demon.id ? "text-red-500" : "text-neutral-300"
                      }`}
                    >
                      {demon.name}
                    </h3>
                    <p className="text-[9px] text-neutral-500 uppercase tracking-widest font-mono mt-1">
                      {demon.title}
                    </p>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 transition-transform duration-300 ${
                      selectedDemon.id === demon.id ? "text-red-500 translate-x-1" : "text-neutral-700 group-hover:text-neutral-400"
                    }`}
                  />
                </button>
              ))}
            </div>

            {/* Right: Rich demon details card */}
            <div className="lg:col-span-8 reveal-on-scroll">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedDemon.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4 }}
                  className="bg-neutral-950 border border-neutral-900 p-8 rounded-lg relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-64 h-64 bg-red-950/5 blur-[80px] rounded-full pointer-events-none" />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Visual box */}
                    <div className="relative h-64 md:h-full min-h-[250px] rounded-lg border border-neutral-900 overflow-hidden group">
                      {/* Image placeholder with dark red gradient */}
                      <div className="absolute inset-0 bg-neutral-900 flex items-center justify-center">
                        <Skull className="w-12 h-12 text-red-900/30 group-hover:scale-110 transition-transform duration-700" />
                      </div>
                      <img
                        src={selectedDemon.visualUrl}
                        alt={selectedDemon.name}
                        className="w-full h-full object-cover opacity-60 mix-blend-luminosity hover:mix-blend-normal group-hover:scale-105 transition-all duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <span className="text-[8px] font-mono tracking-[0.2em] text-red-500 uppercase block mb-1">
                          FOLKLORE SCULPT PREVIEW
                        </span>
                        <h4 className="text-sm font-sans tracking-wide text-neutral-300">
                          {selectedDemon.name}
                        </h4>
                      </div>
                    </div>

                    {/* Content Box */}
                    <div className="flex flex-col justify-between">
                      <div>
                        <span className="text-[9px] font-mono tracking-[0.3em] text-red-500 uppercase font-bold block mb-1">
                          {selectedDemon.title}
                        </span>
                        <h3 className="text-3xl font-extrabold uppercase tracking-[0.05em] mb-4 text-white">
                          {selectedDemon.name}
                        </h3>
                        <p className="text-xs text-neutral-400 leading-relaxed mb-6 font-sans">
                          {selectedDemon.description}
                        </p>

                        <div className="border-t border-neutral-900 pt-4 mt-4">
                          <span className="text-[9px] font-mono tracking-[0.2em] text-neutral-500 uppercase block mb-2">
                            GAMEPLAY MECHANICS
                          </span>
                          <p className="text-[11px] text-neutral-300 leading-relaxed font-sans">
                            {selectedDemon.mechanics}
                          </p>
                        </div>
                      </div>

                      {/* Cryptic quote block */}
                      <div className="border-l-2 border-red-700/60 pl-4 py-1 mt-6 italic bg-red-950/5">
                        <p className="text-xs text-red-400 font-serif leading-relaxed">
                          {selectedDemon.quote}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* 3. GAMEPLAY FEATURES SECTION */}
      <section className="relative py-24 px-6 bg-[#050505] z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 reveal-on-scroll">
            <p className="text-[10px] tracking-[0.4em] text-red-600 uppercase font-bold mb-3 font-mono">Unparalleled Immersion</p>
            <h2 className="text-4xl md:text-5xl font-extrabold uppercase tracking-[0.1em]">Survival Horror Mechanics</h2>
            <div className="w-16 h-[2px] bg-red-700 mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {/* Feature 1 */}
            <div className="bg-neutral-950 border border-neutral-900/60 p-6 rounded hover:border-red-900 hover:bg-neutral-900/10 transition-all duration-300 group reveal-on-scroll">
              <div className="w-10 h-10 rounded bg-red-950/20 border border-red-900/30 flex items-center justify-center mb-6 group-hover:bg-red-900 group-hover:border-red-500 transition-colors">
                <Compass className="w-5 h-5 text-red-500 group-hover:text-white" />
              </div>
              <h3 className="text-lg font-bold uppercase tracking-wider text-white mb-3">
                First-Person Dread
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                Full physical presence controls. Inspect objects in 3D, solve complex machinery, and carefully manage resources like flashlight batteries and exorcism charms.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-neutral-950 border border-neutral-900/60 p-6 rounded hover:border-red-900 hover:bg-neutral-900/10 transition-all duration-300 group reveal-on-scroll">
              <div className="w-10 h-10 rounded bg-red-950/20 border border-red-900/30 flex items-center justify-center mb-6 group-hover:bg-red-900 group-hover:border-red-500 transition-colors">
                <Zap className="w-5 h-5 text-red-500 group-hover:text-white" />
              </div>
              <h3 className="text-lg font-bold uppercase tracking-wider text-white mb-3">
                UE5 Hyper-Realism
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                Lumen dynamic lighting and photogrammetry of actual ruins from Ritigala create a claustrophobic, suffocatingly dark setting where danger lurks in every shadow.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-neutral-950 border border-neutral-900/60 p-6 rounded hover:border-red-900 hover:bg-neutral-900/10 transition-all duration-300 group reveal-on-scroll">
              <div className="w-10 h-10 rounded bg-red-950/20 border border-red-900/30 flex items-center justify-center mb-6 group-hover:bg-red-900 group-hover:border-red-500 transition-colors">
                <Flame className="w-5 h-5 text-red-500 group-hover:text-white" />
              </div>
              <h3 className="text-lg font-bold uppercase tracking-wider text-white mb-3">
                Thovil Exorcism Systems
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                Wield a mixture of dynamic weaponry and traditional folklore rituals: draw protective circles in the mud, chant ancient spells, and light holy clay lamps to survive.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-neutral-950 border border-neutral-900/60 p-6 rounded hover:border-red-900 hover:bg-neutral-900/10 transition-all duration-300 group reveal-on-scroll">
              <div className="w-10 h-10 rounded bg-red-950/20 border border-red-900/30 flex items-center justify-center mb-6 group-hover:bg-red-900 group-hover:border-red-500 transition-colors">
                <Skull className="w-5 h-5 text-red-500 group-hover:text-white" />
              </div>
              <h3 className="text-lg font-bold uppercase tracking-wider text-white mb-3">
                Psychological Sound
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                Spatial binaural audio captures every twig snap in the distance, heavy panting of the protagonist, and terrifying whispers that emerge directly behind your ears.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CHRONICLES OF DARKNESS (DEVELOPMENT UPDATES ROADMAP) */}
      <section className="relative py-24 px-6 bg-[#0B0B0B] border-t border-neutral-950 z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 reveal-on-scroll">
            <p className="text-[10px] tracking-[0.4em] text-red-600 uppercase font-bold mb-3 font-mono">The Path Unfolded</p>
            <h2 className="text-4xl md:text-5xl font-extrabold uppercase tracking-[0.1em]">Timeline of updates</h2>
            <div className="w-16 h-[2px] bg-red-700 mx-auto mt-4" />
          </div>

          <div className="relative border-l border-neutral-900/80 pl-6 ml-4 md:ml-20 flex flex-col gap-12 mt-12 reveal-on-scroll">
            {timeline.map((item, idx) => (
              <div key={idx} className="relative group">
                {/* Node dot */}
                <div
                  className={`absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-2 transition-all duration-300 group-hover:scale-125 ${
                    item.status === "Completed"
                      ? "bg-red-600 border-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]"
                      : item.status === "In Progress"
                      ? "bg-amber-600 border-amber-500 animate-pulse"
                      : "bg-[#050505] border-neutral-800"
                  }`}
                />

                <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                  <span className="text-[10px] font-mono tracking-widest text-red-500 font-bold uppercase block w-24">
                    {item.date}
                  </span>
                  <span
                    className={`text-[9px] font-mono tracking-wider px-2 py-0.5 rounded uppercase w-fit ${
                      item.status === "Completed"
                        ? "bg-emerald-950/20 text-emerald-500 border border-emerald-900/30"
                        : item.status === "In Progress"
                        ? "bg-amber-950/20 text-amber-500 border border-amber-900/30"
                        : "bg-neutral-950 text-neutral-600 border border-neutral-900"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white uppercase tracking-wider group-hover:text-red-500 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-neutral-400 font-sans leading-relaxed mt-1 max-w-2xl">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. IMMERSIVE GALLERY PREVIEW CTA */}
      <section className="relative py-24 px-6 bg-[#050505] z-10 text-center select-none border-t border-neutral-950">
        <div className="max-w-4xl mx-auto flex flex-col items-center reveal-on-scroll">
          <p className="text-[10px] tracking-[0.4em] text-red-600 uppercase font-bold mb-3 font-mono">Witness the Nightmare</p>
          <h2 className="text-4xl md:text-5xl font-extrabold uppercase tracking-[0.1em] mb-6">Explore the visual art</h2>
          <p className="text-xs text-neutral-400 font-sans leading-relaxed max-w-2xl mb-8">
            Access our fully interactive cinematic gallery featuring photogrammetry concepts of real locations, haunting dark forests, and close-up views of ancient rituals.
          </p>
          <Link
            href="/gallery"
            onMouseEnter={playHoverSound}
            onClick={playClickSound}
            className="px-8 py-4 border border-red-800 hover:border-red-500 hover:bg-red-950/10 text-white rounded text-xs uppercase tracking-[0.25em] font-bold transition-all duration-300 hover:shadow-[0_0_20px_rgba(122,0,0,0.3)] hover:scale-105 flex items-center gap-2"
          >
            <span>ENTER THE ARCHIVE</span>
            <ChevronRight className="w-4 h-4 text-red-500" />
          </Link>
        </div>
      </section>

      {/* 6. TRAILER MODAL LIGHTBOX */}
      <AnimatePresence>
        {showTrailer && (
          <motion.div
            className="fixed inset-0 z-[110] flex items-center justify-center bg-black/95 backdrop-blur-md p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 pointer-events-none scanlines opacity-5" />

            <div className="relative w-full max-w-5xl aspect-video rounded-lg border border-red-950 bg-neutral-950 overflow-hidden shadow-2xl">
              {/* Close Button */}
              <button
                onClick={() => {
                  playClickSound();
                  setShowTrailer(false);
                }}
                className="absolute top-4 right-4 z-20 p-2 rounded bg-black/60 hover:bg-red-950 border border-neutral-800 hover:border-red-700 text-neutral-400 hover:text-white transition-all cursor-pointer"
                title="Close Trailer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Responsive Iframe */}
              <iframe
                src="https://www.youtube.com/embed/4t_3dhmuYHY?autoplay=1&mute=0&rel=0&modestbranding=1"
                title="MOHA Official Trailer"
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

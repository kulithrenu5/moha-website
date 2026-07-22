"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAudio } from "@/context/AudioContext";
import { Volume2, ShieldAlert } from "lucide-react";

export const EnterOverlay: React.FC = () => {
  const [show, setShow] = useState(true);
  const { initializeAudio, toggleMute, isMuted } = useAudio();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Check if the user has already entered this session
    const hasEntered = sessionStorage.getItem("moha_entered");
    if (hasEntered === "true") {
      setShow(false);
    }
    setMounted(true);
  }, []);

  const handleEnter = () => {
    // Unmute if they click enter (standard default for immersive experience)
    if (isMuted) {
      toggleMute();
    }
    // Initialize the Web Audio API engine
    initializeAudio();

    // Store in session storage so they don't see it on every refresh in the same session
    sessionStorage.setItem("moha_entered", "true");
    setShow(false);
  };

  if (!mounted || !show) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#050505] text-white overflow-hidden px-4"
        initial={{ opacity: 1 }}
        exit={{
          opacity: 0,
          scale: 1.05,
          filter: "brightness(2) contrast(1.5) blur(10px)",
        }}
        transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
      >
        {/* Cinematic CRT/VHS scanline effect */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] opacity-40" />

        {/* Pulsing red vignette overlay */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(0,0,0,0)_40%,rgba(122,0,0,0.3)_100%)] animate-pulse duration-[4000ms]" />

        {/* Ambient floating ash particles in splash */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-neutral-500 rounded-full opacity-30"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: ["0px", "-100px"],
                x: ["0px", `${(Math.random() - 0.5) * 40}px`],
                opacity: [0.3, 0],
              }}
              transition={{
                duration: Math.random() * 5 + 5,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-xl text-center flex flex-col items-center">
          {/* Studio Name Reveal */}
          <motion.p
            className="text-[10px] tracking-[0.4em] text-red-600 uppercase font-bold font-sans mb-2"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1.0 }}
          >
            Black Mirage Studio Presents
          </motion.p>

          {/* Game Title Reveal with Glitch */}
          <motion.h1
            className="text-7xl md:text-9xl tracking-[0.2em] font-extrabold uppercase font-sans mb-8 select-none relative"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              textShadow: "0 0 20px rgba(163,0,0,0.6)",
            }}
            initial={{ opacity: 0, scale: 0.9, filter: "blur(5px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ delay: 0.6, duration: 1.2, ease: "easeOut" }}
          >
            <span className="text-red-700">M</span>OHA
            {/* Split duplicate glitters */}
            <motion.span
              className="absolute top-0 left-0 text-cyan-600 select-none opacity-20 pointer-events-none"
              animate={{
                x: [2, -2, 3, -3, 0],
                y: [-1, 1, -2, 2, 0],
              }}
              transition={{ repeat: Infinity, duration: 0.1, repeatType: "mirror", delay: 2 }}
            >
              MOHA
            </motion.span>
          </motion.h1>

          {/* Warning Container */}
          <motion.div
            className="border border-red-950/50 bg-red-950/10 backdrop-blur-md p-6 rounded-lg mb-10 flex items-start gap-4 text-left shadow-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.8 }}
          >
            <ShieldAlert className="text-red-500 w-8 h-8 flex-shrink-0 mt-0.5 animate-pulse" />
            <div>
              <h3 className="text-red-500 text-xs tracking-wider uppercase font-bold mb-1">
                Sensory & Atmosphere Warning
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                This official interactive portfolio of **MOHA** contains atmospheric dark visual styling,
                sudden flashing sequences, custom Web Audio synthesis, and spatial horror soundscapes.
                Please ensure your volume is turned on and wear headphones for the optimal cinematic experience.
              </p>
            </div>
          </motion.div>

          {/* Action Button */}
          <motion.button
            onClick={handleEnter}
            className="group relative px-10 py-4 bg-gradient-to-r from-red-950/80 to-red-900/80 hover:from-red-900 hover:to-red-700 text-white rounded text-sm uppercase tracking-[0.3em] font-bold border border-red-600 transition-all duration-300 shadow-[0_0_20px_rgba(122,0,0,0.3)] hover:shadow-[0_0_35px_rgba(239,68,68,0.6)] flex items-center gap-3 overflow-hidden cursor-pointer"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.4, duration: 0.6 }}
          >
            {/* Hover sliding bg glow */}
            <div className="absolute inset-0 w-1/2 h-full bg-white/5 skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-out" />
            <Volume2 className="w-4 h-4 animate-bounce text-red-400 group-hover:text-white" />
            <span>Enter the Nightmare</span>
          </motion.button>

          <motion.p
            className="text-[10px] text-neutral-500 font-mono tracking-widest uppercase mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ delay: 1.8, duration: 1.0 }}
          >
            Direct Audio Consent Protocol (RFC-22)
          </motion.p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

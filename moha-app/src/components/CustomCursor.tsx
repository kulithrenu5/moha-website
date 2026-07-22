"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export const CustomCursor: React.FC = () => {
  const [isMobile, setIsMobile] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 30, stiffness: 250, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  // Ash particles trailing behind
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; size: number; opacity: number }[]>([]);
  const particleIdRef = useRef(0);

  useEffect(() => {
    // Detect mobile/touch devices
    const checkMobile = () => {
      const mobile = window.matchMedia("(max-width: 768px)").matches || "ontouchstart" in window;
      setIsMobile(mobile);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    if (isMobile) return;

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);

      // Randomly spawn ash particles on mouse move
      if (Math.random() < 0.15) {
        const id = particleIdRef.current++;
        setParticles((prev) => [
          ...prev.slice(-15), // keep last 15 particles max
          {
            id,
            x: e.clientX + (Math.random() * 20 - 10),
            y: e.clientY + (Math.random() * 20 - 10),
            size: Math.random() * 4 + 2,
            opacity: Math.random() * 0.5 + 0.3,
          },
        ]);
      }
    };

    const handleMouseDown = () => setClicked(true);
    const handleMouseUp = () => setClicked(false);

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive =
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.closest("button") ||
        target.closest("a") ||
        target.closest('[role="button"]') ||
        target.classList.contains("cursor-pointer");

      setHovered(!!isInteractive);
    };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("resize", checkMobile);
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [isMobile, cursorX, cursorY]);

  // Animate ash particles drifting upwards and fading
  useEffect(() => {
    if (particles.length === 0) return;

    const interval = setInterval(() => {
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            y: p.y - 1.5, // Drift up
            x: p.x + (Math.random() * 1 - 0.5), // Subtle sway
            opacity: p.opacity - 0.03, // Fade
          }))
          .filter((p) => p.opacity > 0)
      );
    }, 30);

    return () => clearInterval(interval);
  }, [particles]);

  if (isMobile) return null;

  return (
    <>
      {/* 1. Flashlight reveal / spotlight overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-40 hidden md:block"
        style={{
          background: `radial-gradient(circle 280px at ${cursorX.get()}px ${cursorY.get()}px, rgba(0,0,0,0) 0%, rgba(5,5,5,0.85) 60%, rgba(5,5,5,0.98) 100%)`,
          mixBlendMode: "multiply",
        }}
      />

      {/* 2. Custom cursor dot */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-50 rounded-full bg-red-600 mix-blend-screen"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          width: hovered ? 12 : 8,
          height: hovered ? 12 : 8,
          marginLeft: hovered ? -6 : -4,
          marginTop: hovered ? -6 : -4,
          boxShadow: hovered
            ? "0 0 15px rgba(239, 68, 68, 0.8), 0 0 30px rgba(239, 68, 68, 0.4)"
            : "0 0 8px rgba(239, 68, 68, 0.5)",
        }}
        animate={{
          scale: clicked ? 0.8 : 1,
          backgroundColor: hovered ? "#ef4444" : "#ffffff",
        }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
      />

      {/* 3. Custom cursor larger ring */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-50 rounded-full border border-red-800"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          width: hovered ? 48 : 32,
          height: hovered ? 48 : 32,
          marginLeft: hovered ? -24 : -16,
          marginTop: hovered ? -24 : -16,
        }}
        animate={{
          scale: clicked ? 1.2 : 1,
          borderColor: hovered ? "#ef4444" : "#450a0a",
          opacity: clicked ? 0.8 : 0.5,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      />

      {/* 4. Ash Particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="pointer-events-none fixed left-0 top-0 z-50 rounded-full bg-neutral-600 mix-blend-screen shadow-[0_0_5px_rgba(255,255,255,0.2)]"
          style={{
            transform: `translate3d(${p.x}px, ${p.y}px, 0)`,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
          }}
        />
      ))}
    </>
  );
};

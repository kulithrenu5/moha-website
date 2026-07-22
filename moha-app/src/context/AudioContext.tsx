"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";

interface AudioContextProps {
  isMuted: boolean;
  isInitialized: boolean;
  toggleMute: () => void;
  initializeAudio: () => void;
  playHoverSound: () => void;
  playClickSound: () => void;
  playThunderSound: () => void;
  playTrailerSound: () => void;
  setHeartbeatSpeed: (speed: "slow" | "fast" | "rapid") => void;
}

const AudioContext = createContext<AudioContextProps | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // Web Audio API refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const windNodeRef = useRef<BiquadFilterNode | null>(null);
  const windGainRef = useRef<GainNode | null>(null);
  const heartbeatTimerRef = useRef<NodeJS.Timeout | null>(null);
  const heartbeatSpeedRef = useRef<"slow" | "fast" | "rapid">("slow");

  useEffect(() => {
    // Load mute preference
    const storedMute = localStorage.getItem("moha_audio_muted");
    if (storedMute !== null) {
      setIsMuted(storedMute === "true");
    } else {
      // Default to muted until user interaction
      setIsMuted(true);
    }
  }, []);

  const initializeAudio = () => {
    if (isInitialized) return;

    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      audioCtxRef.current = ctx;

      // Create wind synthesizer
      setupWindGenerator(ctx);

      // Create heartbeat loop
      setupHeartbeatLoop();

      setIsInitialized(true);
      // Play initial thunder rumble
      setTimeout(() => {
        if (!isMuted) {
          synthesizeThunder(ctx);
        }
      }, 500);
    } catch (e) {
      console.warn("Failed to initialize Web Audio API:", e);
    }
  };

  // Noise generator for wind
  const setupWindGenerator = (ctx: AudioContext) => {
    const bufferSize = 2 * ctx.sampleRate;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    // Generate brown noise
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = output[i];
      output[i] *= 3.5; // Amplify
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    // Filter to make it sound like howling wind
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.Q.value = 3.0;
    filter.frequency.value = 300; // Low frequency base

    const gainNode = ctx.createGain();
    gainNode.gain.value = isMuted ? 0 : 0.15;

    noiseSource.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    noiseSource.start(0);

    windNodeRef.current = filter;
    windGainRef.current = gainNode;

    // Modulate wind frequency (LFO simulation)
    let time = 0;
    const modulateWind = () => {
      if (!audioCtxRef.current) return;
      time += 0.02;
      // Map sin wave to range 150Hz - 600Hz
      const freq = 300 + Math.sin(time) * 150 + Math.cos(time * 0.4) * 80;
      if (filter) {
        filter.frequency.setValueAtTime(freq, ctx.currentTime);
      }
      setTimeout(modulateWind, 50);
    };
    modulateWind();
  };

  // Heartbeat Loop (low thumping sounds)
  const setupHeartbeatLoop = () => {
    if (heartbeatTimerRef.current) {
      clearInterval(heartbeatTimerRef.current);
    }

    const playHeartbeatDoublet = () => {
      if (isMuted || !audioCtxRef.current) return;
      const ctx = audioCtxRef.current;

      const thump = (delay: number, pitch: number, vol: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = "sine";
        osc.frequency.setValueAtTime(pitch, ctx.currentTime + delay);
        // Exponential pitch drop
        osc.frequency.exponentialRampToValueAtTime(10, ctx.currentTime + delay + 0.15);

        filter.type = "lowpass";
        filter.frequency.value = 120;

        gain.gain.setValueAtTime(0.001, ctx.currentTime + delay);
        gain.gain.exponentialRampToValueAtTime(vol, ctx.currentTime + delay + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.2);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + delay);
        osc.stop(ctx.currentTime + delay + 0.25);
      };

      // Double-thump "lub-dub"
      thump(0, 60, 0.4);
      thump(0.22, 55, 0.3);
    };

    const runLoop = () => {
      let interval = 1200; // Slow heartbeat
      if (heartbeatSpeedRef.current === "fast") interval = 800;
      if (heartbeatSpeedRef.current === "rapid") interval = 500;

      playHeartbeatDoublet();
      heartbeatTimerRef.current = setTimeout(runLoop, interval);
    };

    runLoop();
  };

  const setHeartbeatSpeed = (speed: "slow" | "fast" | "rapid") => {
    heartbeatSpeedRef.current = speed;
    if (isInitialized) {
      setupHeartbeatLoop();
    }
  };

  // UI Tick (hover)
  const playHoverSound = () => {
    if (isMuted || !audioCtxRef.current) return;
    const ctx = audioCtxRef.current;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.03);

    gain.gain.setValueAtTime(0.02, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.035);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.04);
  };

  // UI Button Click (thud)
  const playClickSound = () => {
    if (isMuted || !audioCtxRef.current) return;
    const ctx = audioCtxRef.current;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = "sine";
    osc.frequency.setValueAtTime(150, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.1);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(200, ctx.currentTime);

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  };

  // Sound of opening trailer/video
  const playTrailerSound = () => {
    if (isMuted || !audioCtxRef.current) return;
    const ctx = audioCtxRef.current;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(55, ctx.currentTime); // Deep C
    osc.frequency.linearRampToValueAtTime(65, ctx.currentTime + 0.8);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(80, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.8);

    gain.gain.setValueAtTime(0.01, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + 0.2);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.0);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 1.0);
  };

  // Thunder Synthesizer (white noise + heavy distortion + exponential low rumble decay)
  const synthesizeThunder = (ctx: AudioContext) => {
    const duration = 4.0;
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    // Create white noise with crackle
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = buffer;

    // Filters
    const lpFilter = ctx.createBiquadFilter();
    lpFilter.type = "lowpass";
    lpFilter.frequency.setValueAtTime(1000, ctx.currentTime);
    lpFilter.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 1.5);

    const gainNode = ctx.createGain();
    // Initial blast, then rumble decay
    gainNode.gain.setValueAtTime(0.01, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.35, ctx.currentTime + 0.1); // Sudden strike
    gainNode.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 0.6); // Falloff
    gainNode.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 1.5); // Rumble
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration); // Final fade

    noiseSource.connect(lpFilter);
    lpFilter.connect(gainNode);
    gainNode.connect(ctx.destination);

    noiseSource.start();

    // Add a high-freq crackle on start
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(180, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(60, ctx.currentTime + 0.25);

    oscGain.gain.setValueAtTime(0.2, ctx.currentTime);
    oscGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

    const hpFilter = ctx.createBiquadFilter();
    hpFilter.type = "highpass";
    hpFilter.frequency.value = 400;

    osc.connect(hpFilter);
    hpFilter.connect(oscGain);
    oscGain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  };

  const playThunderSound = () => {
    if (isMuted || !audioCtxRef.current) return;
    synthesizeThunder(audioCtxRef.current);
  };

  const toggleMute = () => {
    const nextState = !isMuted;
    setIsMuted(nextState);
    localStorage.setItem("moha_audio_muted", String(nextState));

    // Update wind gain immediately
    if (windGainRef.current && audioCtxRef.current) {
      windGainRef.current.gain.setValueAtTime(
        nextState ? 0 : 0.15,
        audioCtxRef.current.currentTime
      );
    }

    if (!nextState && !isInitialized) {
      initializeAudio();
    }
  };

  return (
    <AudioContext.Provider
      value={{
        isMuted,
        isInitialized,
        toggleMute,
        initializeAudio,
        playHoverSound,
        playClickSound,
        playThunderSound,
        playTrailerSound,
        setHeartbeatSpeed,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
};

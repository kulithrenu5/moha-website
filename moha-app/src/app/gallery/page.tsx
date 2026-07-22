"use client";

import React, { useState, useEffect } from "react";
import { useAudio } from "@/context/AudioContext";
import { Eye, Image as ImageIcon, Film, X, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface GalleryItem {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string;
  category: string;
  isVideo: boolean;
  videoUrl: string | null;
}

export default function GalleryPage() {
  const { playHoverSound, playClickSound } = useAudio();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Categories list
  const categories = [
    { label: "ALL SIGHTINGS", id: "all" },
    { label: "THE TEMPLE", id: "temple" },
    { label: "WALAWWA", id: "walawwa" },
    { label: "DEMONS", id: "character" },
    { label: "CONCEPT ART", id: "concept_art" },
    { label: "SCREENSHOTS", id: "screenshot" },
  ];

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const response = await fetch("/api/admin/gallery");
        const resData = await response.json();
        if (response.ok && resData.success) {
          setItems(resData.data);
        }
      } catch (err) {
        console.warn("Failed to fetch gallery items:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  const filteredItems = activeFilter === "all"
    ? items
    : items.filter((item) => item.category.toLowerCase() === activeFilter.toLowerCase());

  const handlePrev = () => {
    if (lightboxIndex === null) return;
    playClickSound();
    setLightboxIndex((prev) => (prev! === 0 ? filteredItems.length - 1 : prev! - 1));
  };

  const handleNext = () => {
    if (lightboxIndex === null) return;
    playClickSound();
    setLightboxIndex((prev) => (prev! === filteredItems.length - 1 ? 0 : prev! + 1));
  };

  return (
    <div className="bg-[#050505] min-h-screen text-white py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <div className="text-center mb-12">
          <p className="text-[10px] tracking-[0.4em] text-red-600 uppercase font-bold mb-3 font-mono">The Sightings Chamber</p>
          <h1 className="text-4xl md:text-5xl font-extrabold uppercase tracking-[0.15em] mb-4">Media Archive</h1>
          <div className="w-16 h-[2px] bg-red-700 mx-auto mt-4" />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                playClickSound();
                setActiveFilter(cat.id);
              }}
              onMouseEnter={playHoverSound}
              className={`px-4 py-2 border rounded text-[10px] tracking-widest font-mono font-bold transition-all duration-300 cursor-pointer ${
                activeFilter === cat.id
                  ? "bg-red-950/40 border-red-700 text-red-400 shadow-[0_0_10px_rgba(122,0,0,0.2)]"
                  : "bg-neutral-950 border-neutral-900 text-neutral-400 hover:border-red-950 hover:text-red-500"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Masonry-like Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-mono tracking-widest text-neutral-500 uppercase">Parsing occurrences...</span>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-24 border border-neutral-900 rounded bg-neutral-950/20">
            <ImageIcon className="w-12 h-12 text-neutral-800 mx-auto mb-4" />
            <p className="text-xs text-neutral-500 tracking-wider font-mono">NO SIGHTINGS LOGGED IN THIS SECTION</p>
          </div>
        ) : (
          <motion.div
            className="columns-1 sm:columns-2 lg:columns-3 gap-6"
            layout
          >
            {filteredItems.map((item, idx) => (
              <motion.div
                key={item.id}
                layoutId={`gallery-item-${item.id}`}
                onClick={() => {
                  playClickSound();
                  setLightboxIndex(idx);
                }}
                onMouseEnter={playHoverSound}
                className="break-inside-avoid bg-neutral-950 border border-neutral-900/60 rounded-lg overflow-hidden group mb-6 hover:border-red-800 transition-all duration-500 cursor-pointer relative shadow-lg"
              >
                <div className="relative overflow-hidden aspect-video sm:aspect-auto">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-60 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-80" />

                  {/* Indicator icons */}
                  <div className="absolute top-4 right-4 bg-[#050505]/80 p-1.5 rounded border border-neutral-800/80 text-neutral-400 group-hover:text-red-500 transition-colors">
                    {item.isVideo ? <Film className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </div>
                </div>

                <div className="p-4">
                  <span className="text-[8px] font-mono tracking-[0.2em] text-red-500 uppercase font-bold block mb-1">
                    {item.category}
                  </span>
                  <h3 className="text-sm font-bold uppercase text-neutral-100 tracking-wider group-hover:text-red-500 transition-colors">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-[10px] text-neutral-500 font-sans leading-relaxed mt-1.5 line-clamp-2">
                      {item.description}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Lightbox Modal */}
        <AnimatePresence>
          {lightboxIndex !== null && (
            <motion.div
              className="fixed inset-0 z-[110] flex items-center justify-center bg-black/95 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="absolute inset-0 pointer-events-none scanlines opacity-5" />

              {/* Close Button */}
              <button
                onClick={() => {
                  playClickSound();
                  setLightboxIndex(null);
                }}
                className="absolute top-6 right-6 z-20 p-2 rounded bg-black/60 hover:bg-red-950 border border-neutral-800 hover:border-red-700 text-neutral-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Navigation Left */}
              <button
                onClick={handlePrev}
                className="absolute left-6 top-1/2 translate-y-[-50%] p-3 rounded bg-black/60 hover:bg-red-950 border border-neutral-800 text-neutral-400 hover:text-white cursor-pointer"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {/* Lightbox Content Container */}
              <div className="relative max-w-5xl w-full max-h-[85vh] flex flex-col justify-center items-center gap-4">
                <motion.div
                  key={filteredItems[lightboxIndex].id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="relative rounded-lg border border-neutral-900 bg-neutral-950 overflow-hidden w-full h-[65vh] flex items-center justify-center"
                >
                  <img
                    src={filteredItems[lightboxIndex].imageUrl}
                    alt={filteredItems[lightboxIndex].title}
                    className="w-full h-full object-contain"
                  />
                </motion.div>

                {/* Details Footer */}
                <div className="text-center max-w-2xl px-4">
                  <span className="text-[10px] font-mono tracking-widest text-red-500 uppercase block mb-1">
                    {filteredItems[lightboxIndex].category}
                  </span>
                  <h2 className="text-xl font-bold uppercase tracking-wider text-white">
                    {filteredItems[lightboxIndex].title}
                  </h2>
                  {filteredItems[lightboxIndex].description && (
                    <p className="text-xs text-neutral-400 font-sans leading-relaxed mt-2">
                      {filteredItems[lightboxIndex].description}
                    </p>
                  )}
                </div>
              </div>

              {/* Navigation Right */}
              <button
                onClick={handleNext}
                className="absolute right-6 top-1/2 translate-y-[-50%] p-3 rounded bg-black/60 hover:bg-red-950 border border-neutral-800 text-neutral-400 hover:text-white cursor-pointer"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

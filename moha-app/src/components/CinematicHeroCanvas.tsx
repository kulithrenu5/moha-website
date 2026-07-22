"use client";

import React, { useEffect, useRef } from "react";

export const CinematicHeroCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Particle class for floating ash
    class AshParticle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      decay: number;
      color: string;

      constructor() {
        this.x = Math.random() * width;
        this.y = height + Math.random() * 100;
        this.vx = Math.random() * 0.8 - 0.4;
        this.vy = -(Math.random() * 1.5 + 0.5);
        this.size = Math.random() * 3 + 1;
        this.alpha = Math.random() * 0.5 + 0.2;
        this.decay = Math.random() * 0.002 + 0.001;
        // Ember ash has a subtle orange glow, charcoal has black/gray
        this.color = Math.random() > 0.7 ? "239, 68, 68" : "150, 150, 150";
      }

      update() {
        this.y += this.vy;
        this.x += this.vx;
        this.alpha -= this.decay;

        // Reset particle
        if (this.alpha <= 0 || this.y < 0 || this.x < 0 || this.x > width) {
          this.x = Math.random() * width;
          this.y = height + 10;
          this.vx = Math.random() * 0.8 - 0.4;
          this.vy = -(Math.random() * 1.5 + 0.5);
          this.size = Math.random() * 3 + 1;
          this.alpha = Math.random() * 0.5 + 0.2;
        }
      }

      draw(c: CanvasRenderingContext2D) {
        c.save();
        c.beginPath();
        c.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        c.fillStyle = `rgba(${this.color}, ${this.alpha})`;
        c.shadowBlur = this.color.startsWith("239") ? 10 : 0;
        c.shadowColor = "rgba(239, 68, 68, 0.8)";
        c.fill();
        c.restore();
      }
    }

    // Fog cloud definition
    class FogCloud {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      alpha: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = height / 2 + Math.random() * (height / 2);
        this.vx = Math.random() * 0.3 - 0.15;
        this.vy = Math.random() * 0.1 - 0.05;
        this.radius = Math.random() * 180 + 120;
        this.alpha = Math.random() * 0.08 + 0.04;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x - this.radius > width) this.x = -this.radius;
        if (this.x + this.radius < 0) this.x = width + this.radius;
        if (this.y - this.radius > height) this.y = height / 2;
        if (this.y + this.radius < height / 2) this.y = height;
      }

      draw(c: CanvasRenderingContext2D) {
        c.save();
        const gradient = c.createRadialGradient(
          this.x,
          this.y,
          0,
          this.x,
          this.y,
          this.radius
        );
        // Blood red / Dark fog gradients
        gradient.addColorStop(0, `rgba(122, 0, 0, ${this.alpha})`);
        gradient.addColorStop(0.5, `rgba(15, 5, 5, ${this.alpha * 0.4})`);
        gradient.addColorStop(1, "rgba(5, 5, 5, 0)");

        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        c.fillStyle = gradient;
        c.fill();
        c.restore();
      }
    }

    // Initialize systems
    const particleCount = 60;
    const fogCount = 12;
    const particlesArray: AshParticle[] = [];
    const fogArray: FogCloud[] = [];

    for (let i = 0; i < particleCount; i++) {
      particlesArray.push(new AshParticle());
    }

    for (let i = 0; i < fogCount; i++) {
      fogArray.push(new FogCloud());
    }

    // Mouse tracking for subtle parallax deflection
    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX - width / 2) * 0.05;
      mouseY = (e.clientY - height / 2) * 0.05;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Resize event
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Animation Loop
    let lastTime = 0;
    const render = (time: number) => {
      ctx.fillStyle = "#050505";
      ctx.fillRect(0, 0, width, height);

      // 1. Draw volumetric red background glow
      const radialGlow = ctx.createRadialGradient(
        width / 2 + mouseX * 0.5,
        height / 2 + mouseY * 0.5,
        0,
        width / 2,
        height / 2,
        width * 0.8
      );
      radialGlow.addColorStop(0, "rgba(40, 0, 0, 0.4)");
      radialGlow.addColorStop(0.5, "rgba(10, 5, 5, 0.1)");
      radialGlow.addColorStop(1, "rgba(5, 5, 5, 1)");

      ctx.fillStyle = radialGlow;
      ctx.fillRect(0, 0, width, height);

      // 2. Update and draw Fog
      fogArray.forEach((fog) => {
        fog.update();
        // apply mouse offset
        fog.x += mouseX * 0.01;
        fog.y += mouseY * 0.01;
        fog.draw(ctx);
      });

      // 3. Update and draw Ash Particles
      particlesArray.forEach((part) => {
        part.update();
        part.x += mouseX * 0.03; // drifting reaction
        part.draw(ctx);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none select-none z-0"
    />
  );
};

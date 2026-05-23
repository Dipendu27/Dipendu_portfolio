import React, { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
  rotation: number;
  rotationSpeed: number;
  type: "dust" | "needle" | "flare";
}

// Highly refined, professional theme colors (Apple Blue, Ice Cyan, Core Pure White, Metallic Zinc + Silver)
const GLITTER_COLORS = [
  "rgba(0, 113, 230, 0.85)",   // Apple Blue
  "rgba(100, 210, 255, 0.90)",  // Ice Cyan
  "rgba(255, 255, 255, 0.95)",  // Core Pure Light
  "rgba(229, 229, 234, 0.65)",  // Anodized Silver
  "rgba(142, 142, 147, 0.45)",  // Metallic Zinc
];

export default function CursorGlitter() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    const maxParticles = 80;

    // Scale canvas to physical window pixels (retina standard capped to 2x dpr)
    const resizeCanvas = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    let lastX = 0;
    let lastY = 0;

    const createParticles = (x: number, y: number) => {
      const dx = x - lastX;
      const dy = y - lastY;
      const speed = Math.sqrt(dx * dx + dy * dy);
      
      // Keep it highly minimalist and sparse (max 3 particles per update to maintain premium air)
      const count = Math.min(3, Math.floor(speed / 14) + 1);

      for (let i = 0; i < count; i++) {
        if (particles.length >= maxParticles) {
          particles.shift(); 
        }

        const angle = Math.random() * Math.PI * 2;
        // Moderate starting velocity
        const velocity = Math.random() * 0.9 + 0.2;

        const types: Array<"dust" | "needle" | "flare"> = ["dust", "needle", "flare"];
        const type = types[Math.floor(Math.random() * types.length)];

        // Micro scale sizes (typically between 0.6px and 2.5px) for incredible fidelity
        const size = Math.random() * 1.8 + 0.6;

        particles.push({
          x,
          y,
          vx: Math.cos(angle) * velocity + (dx * 0.04), // soft lateral momentum from swipe
          vy: Math.sin(angle) * velocity + (dy * 0.04) - 0.15, // light thermal ascent
          size,
          color: GLITTER_COLORS[Math.floor(Math.random() * GLITTER_COLORS.length)],
          alpha: 0.95,
          decay: Math.random() * 0.015 + 0.012, // beautiful slow-dissolve
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 3, // very subtle rotation
          type,
        });
      }

      lastX = x;
      lastY = y;
    };

    const handleMouseMove = (e: MouseEvent) => {
      createParticles(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        createParticles(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    // Render loop running inside Window requestAnimationFrame
    const update = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;
        p.alpha -= p.decay;

        // Apply fluid friction dampening (causes gorgeous suspension drift)
        p.vx *= 0.96;
        p.vy *= 0.96;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);

        // High-Performance double-pass vector halo glow instead of sluggish GPU shadow Filters
        if (p.color.includes("255") || p.color.includes("0, 113")) {
          ctx.fillStyle = p.color.includes("255") ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 113, 230, 0.08)";
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 2.5, 0, Math.PI * 2);
          ctx.fill();
        }

        if (p.type === "needle") {
          // Exquisite watchmaker-style ultra-thin crosshair glint
          ctx.lineWidth = 0.7;
          ctx.strokeStyle = p.color;
          ctx.beginPath();
          // Horizontal axis
          ctx.moveTo(-p.size * 2.5, 0);
          ctx.lineTo(p.size * 2.5, 0);
          // Vertical axis
          ctx.moveTo(0, -p.size * 2.5);
          ctx.lineTo(0, p.size * 2.5);
          ctx.stroke();
        } else if (p.type === "flare") {
          // Sharp minimalist double-tapered diamond sparkler
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.moveTo(0, -p.size * 1.8);
          ctx.lineTo(p.size * 0.45, 0);
          ctx.lineTo(0, p.size * 1.8);
          ctx.lineTo(-p.size * 0.45, 0);
          ctx.closePath();
          ctx.fill();
        } else {
          // Minute high-tech ambient dust particle
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.5, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(update);
    };

    update();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="cursor-spark-glitter-layer"
      className="fixed inset-0 pointer-events-none z-[9999] w-full h-full"
      style={{ mixBlendMode: "screen" }}
    />
  );
}

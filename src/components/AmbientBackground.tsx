import React, { useEffect, useRef, useState } from "react";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
}

interface Star {
  x: number;
  y: number;
  size: number;
  twinkleSpeed: number;
  phase: number;
  color: string;
  isBright?: boolean;
}

export default function AmbientBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);

  useEffect(() => {
    // 1. Detect and listen to prefers-reduced-motion media query
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);

    const handleMediaChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleMediaChange);
    } else {
      mediaQuery.addListener(handleMediaChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handleMediaChange);
      } else {
        mediaQuery.removeListener(handleMediaChange);
      }
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let nodes: Node[] = [];
    let stars: Star[] = [];
    // Lower node count for extreme speed without losing density elegance
    const maxNodes = window.innerWidth < 768 ? 16 : 45; 
    const maxStars = window.innerWidth < 768 ? 45 : 110;

    // Resize Canvas to fit screen layout with support for High DPI (Retina displays)
    const resizeCanvas = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      // Cap standard Retina resolution buffer to 2x to save immense GPU memory and processing throughput
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);

      // Re-initialize nodes & stars spread evenly across new dimensions
      initNodes(width, height);
      initStars(width, height);
    };

    const initNodes = (width: number, height: number) => {
      nodes = [];
      const nodeColors = [
        "rgba(0, 113, 227, 0.16)",   // Signature Blue
        "rgba(41, 151, 255, 0.12)",  // Neon Accent Blue
        "rgba(129, 140, 248, 0.1)",  // Indigo Drift
        "rgba(255, 255, 255, 0.05)"  // Ambient Zinc
      ];

      for (let i = 0; i < maxNodes; i++) {
        const speedMultiplier = reducedMotion ? 0 : 1;
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.12 * speedMultiplier, // Slower gentle drift
          vy: (Math.random() - 0.5) * 0.12 * speedMultiplier,
          radius: Math.random() * 1.2 + 0.6, // Balanced size
          color: nodeColors[i % nodeColors.length]
        });
      }
    };

    const initStars = (width: number, height: number) => {
      stars = [];
      const starColors = [
        "rgba(255, 255, 255, ",
        "rgba(186, 230, 253, ", // sky accent blue-white
        "rgba(224, 231, 255, ", // indigo-white
        "rgba(254, 243, 199, "  // slight warm amber-white
      ];

      for (let i = 0; i < maxStars; i++) {
        const isBright = Math.random() < 0.22; // 22% premium active twinkling stars
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: isBright 
            ? Math.random() * 1.6 + 1.2  // Premium sparkling stars (1.2px to 2.8px)
            : Math.random() * 0.85 + 0.55, // Subtle spatial layout stars (0.55px to 1.4px)
          twinkleSpeed: isBright
            ? Math.random() * 0.038 + 0.015  // Premium fast-shimmer
            : Math.random() * 0.009 + 0.004, // Background steady hum
          phase: Math.random() * Math.PI * 2,
          color: starColors[i % starColors.length],
          isBright
        });
      }
    };

    // Track mouse coordinates for dynamic proximity interactive line rendering
    const mouse = { x: -9999, y: -9999 };

    const handleMouseMove = (e: MouseEvent) => {
      // Don't pull interactive lines if user prefers reduced motion
      if (reducedMotion) return;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    const render = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      // Clear layout background delicately
      ctx.clearRect(0, 0, width, height);

      // 1. Render and update twinkling background stars
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        if (!reducedMotion) {
          star.phase += star.twinkleSpeed;
        }
        
        // Bright shining, clear glittering amplitude wave: 0.22 to 0.98 range (highly visible, warm twinkling)
        const shimmer = Math.sin(star.phase) * 0.38 + Math.cos(star.phase * 2.45) * 0.18 + 0.48;
        const alpha = Math.max(0.22, Math.min(0.98, shimmer));
        
        // Draw star core
        ctx.fillStyle = `${star.color}${alpha})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();

        // Elegant cross flare and ambient glow aura for bright stars at near-peak intervals
        if (star.isBright && alpha > 0.45) {
          // Draw a soft ambient outer halo around the blinking star
          ctx.fillStyle = `${star.color}${(alpha - 0.45) * 0.22})`;
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size * 2.8, 0, Math.PI * 2);
          ctx.fill();

          // Draw custom 4-pointed cross flare vectors
          ctx.strokeStyle = `${star.color}${(alpha - 0.45) * 0.18})`;
          ctx.lineWidth = 0.45;
          ctx.beginPath();
          // Horizontal beam
          ctx.moveTo(star.x - star.size * 3.2, star.y);
          ctx.lineTo(star.x + star.size * 3.2, star.y);
          // Vertical beam
          ctx.moveTo(star.x, star.y - star.size * 3.2);
          ctx.lineTo(star.x, star.y + star.size * 3.2);
          ctx.stroke();
        }
      }

      // 2. Update positions & render elegant nodes
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];

        if (!reducedMotion) {
          node.x += node.vx;
          node.y += node.vy;

          // Seamless boundary bounce coordinates check
          if (node.x < 0 || node.x > width) node.vx *= -1;
          if (node.y < 0 || node.y > height) node.vy *= -1;
        }

        ctx.fillStyle = node.color;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // 3. High-Performance Batched Lines drawing
      // We open ONE path, trace all lines, and stroke ONCE. This saves hundreds of GPU state switches.
      ctx.lineWidth = 0.45;
      ctx.strokeStyle = "rgba(41, 151, 255, 0.045)";
      ctx.beginPath();
      const maxDistance = 125;
      const maxDistanceSq = maxDistance * maxDistance;

      for (let i = 0; i < nodes.length; i++) {
        const nodeA = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const nodeB = nodes[j];

          const dx = nodeA.x - nodeB.x;
          const dy = nodeA.y - nodeB.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < maxDistanceSq) {
            ctx.moveTo(nodeA.x, nodeA.y);
            ctx.lineTo(nodeB.x, nodeB.y);
          }
        }
      }
      ctx.stroke();

      // 4. Batched dynamic lines connecting to the cursor
      if (!reducedMotion && mouse.x > 0) {
        ctx.strokeStyle = "rgba(41, 151, 255, 0.07)";
        ctx.beginPath();
        const interactiveMaxDistance = 150;
        const interactiveMaxDistanceSq = interactiveMaxDistance * interactiveMaxDistance;

        for (let i = 0; i < nodes.length; i++) {
          const nodeA = nodes[i];
          const dxMouse = nodeA.x - mouse.x;
          const dyMouse = nodeA.y - mouse.y;
          const distMouseSq = dxMouse * dxMouse + dyMouse * dyMouse;

          if (distMouseSq < interactiveMaxDistanceSq) {
            ctx.moveTo(nodeA.x, nodeA.y);
            ctx.lineTo(mouse.x, mouse.y);
          }
        }
        ctx.stroke();
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationId);
    };
  }, [reducedMotion]);

  return (
    <canvas
      id="ambient-geometric-network"
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 w-full h-full opacity-100 select-none bg-transparent"
    />
  );
}

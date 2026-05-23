import React, { useEffect, useRef, useState } from "react";

interface QANode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  label: string;
  intensity: number;
  pulseTime: number;
  size: number;
}

const QA_TAGS = [
  "ASSERT_TRUE", "API_200", "CI_PASS", "CY_FLOW", "SE_RUN", "DB_MIGRATION_OK",
  "PLAYBOOK_LOOP", "SHIFT_LEFT", "REG_0_DEFECT", "UBUY_GATE_OK", "CHROME_HEADLESS"
];

export default function AqaSystemMatrix() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);

  useEffect(() => {
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

    let animFrameId: number;
    let nodes: QANode[] = [];
    let scanY = 0;
    let scanDirection = 1; // 1 = down, -1 = up

    const numNodes = 12; // Perfectly balanced count
    const isMobile = window.innerWidth < 768;
    const actualNodeCount = isMobile ? 6 : numNodes;

    const resizeCanvas = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      // Cap Retina scaling up to 2 for optimal CPU/GPU throughput
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Initialize clean floating node coordinates
    const initNodes = () => {
      nodes = [];
      const width = window.innerWidth;
      const height = window.innerHeight;

      for (let i = 0; i < actualNodeCount; i++) {
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.1, // extremely slow drift
          vy: (Math.random() - 0.5) * 0.1,
          label: QA_TAGS[i % QA_TAGS.length],
          intensity: Math.random() * 0.12 + 0.04,
          pulseTime: Math.random() * Math.PI * 2,
          size: Math.random() * 1.2 + 1.2,
        });
      }
    };

    initNodes();

    // Mouse coordinates tracking
    let mouseX = -1000;
    let mouseY = -1000;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // Loop renderer
    const render = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      ctx.clearRect(0, 0, width, height);

      // 1. Draw a faint grid background (Single-pass batched performance)
      const gridSpacing = 80; // Larger grid saves line sweeps
      ctx.beginPath();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.012)";
      ctx.lineWidth = 0.5;

      // Trace vertical grid lines
      for (let x = 0; x < width; x += gridSpacing) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }

      // Trace horizontal grid lines
      for (let y = 0; y < height; y += gridSpacing) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke(); // Single draw call!

      // 2. Automated Scanner sweep line (mimics quality checks)
      if (!reducedMotion) {
        scanY += 0.8 * scanDirection;
        if (scanY > height) {
          scanY = height;
          scanDirection = -1;
        } else if (scanY < 0) {
          scanY = 0;
          scanDirection = 1;
        }
      }

      // Draw scanner gradient sweep line
      const scannerGrad = ctx.createLinearGradient(0, scanY - 20, 0, scanY + 10);
      scannerGrad.addColorStop(0, "rgba(0, 113, 227, 0.0)");
      scannerGrad.addColorStop(0.7, "rgba(0, 113, 227, 0.015)");
      scannerGrad.addColorStop(0.9, "rgba(41, 151, 255, 0.035)");
      scannerGrad.addColorStop(1, "rgba(0, 113, 227, 0.0)");

      ctx.fillStyle = scannerGrad;
      ctx.fillRect(0, scanY - 20, width, 30);

      // Thin bright laser trace element in the scanner center
      ctx.strokeStyle = "rgba(41, 151, 255, 0.08)";
      ctx.lineWidth = 0.75;
      ctx.beginPath();
      ctx.moveTo(0, scanY);
      ctx.lineTo(width, scanY);
      ctx.stroke();

      // 3. Render connections to nearby nodes (unified vector stroke batch)
      ctx.beginPath();
      ctx.strokeStyle = "rgba(0, 113, 227, 0.015)";
      ctx.lineWidth = 0.5;
      const maxDistNodeSq = 180 * 180;

      for (let i = 0; i < nodes.length; i++) {
        const nodeA = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const nodeB = nodes[j];
          const dx = nodeA.x - nodeB.x;
          const dy = nodeA.y - nodeB.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < maxDistNodeSq) {
            ctx.moveTo(nodeA.x, nodeA.y);
            ctx.lineTo(nodeB.x, nodeB.y);
          }
        }
      }
      ctx.stroke(); // Single draw call for connections!

      // 4. Render individual nodes & custom text strings (fewer, cleaner)
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];

        if (!reducedMotion) {
          // Slowly move and bounce off boundaries
          node.x += node.vx;
          node.y += node.vy;

          if (node.x < 0 || node.x > width) node.vx *= -1;
          if (node.y < 0 || node.y > height) node.vy *= -1;

          // Blinking state update
          node.pulseTime += 0.008;
        }

        const blink = Math.sin(node.pulseTime) * 0.04;

        // Interaction with scanning sweep line: glow when swept!
        const distToScan = Math.abs(node.y - scanY);
        let sweepGlow = 0;
        if (distToScan < 50) {
          sweepGlow = (1 - distToScan / 50) * 0.15;
        }

        // Interaction with mouse pointer
        const dx = node.x - mouseX;
        const dy = node.y - mouseY;
        const distToMouseSq = dx * dx + dy * dy;
        let mouseInteraction = 0;
        const reactiveDist = 150;
        if (distToMouseSq < reactiveDist * reactiveDist) {
          mouseInteraction = (1 - Math.sqrt(distToMouseSq) / reactiveDist) * 0.18;
        }

        const currentOpacity = node.intensity + blink + sweepGlow + mouseInteraction;
        const clampedOpacity = Math.min(0.4, Math.max(0.02, currentOpacity));

        // Render target node coordinates indicator
        ctx.fillStyle = `rgba(41, 151, 255, ${clampedOpacity})`;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size + (sweepGlow > 0 ? 0.5 : 0), 0, Math.PI * 2);
        ctx.fill();

        // Node label rendering (Only rendered above safe alpha to reduce text rasterization overhead)
        if (clampedOpacity > 0.06) {
          ctx.font = "500 8px var(--font-mono)";
          ctx.fillStyle = `rgba(134, 134, 139, ${clampedOpacity * 1.2})`;
          ctx.fillText(`[${node.label}]`, node.x + 8, node.y + 3);
        }

        // Faint ring borders (Optimized outer ring drawing)
        ctx.strokeStyle = `rgba(41, 151, 255, ${clampedOpacity * 0.15})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size * 2.5 + (sweepGlow * 6), 0, Math.PI * 2);
        ctx.stroke();
      }

      animFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animFrameId);
    };
  }, [reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[1] w-full h-full opacity-65 select-none bg-transparent"
      style={{ mixBlendMode: "screen" }}
    />
  );
}

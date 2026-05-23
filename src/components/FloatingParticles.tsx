import React, { useMemo } from "react";
import { motion } from "motion/react";

interface FloatingItem {
  id: number;
  type: "dot" | "code" | "check" | "warning";
  content?: string;
  size: number;
  initialX: number; // percentage
  initialY: number; // percentage
  duration: number;
  delay: number;
  color: string;
}

export default function FloatingParticles() {
  const items: FloatingItem[] = useMemo(() => {
    const symbolTypes: ("dot" | "code" | "check" | "warning")[] = ["dot", "code", "check", "warning"];
    const colors = [
      "text-indigo-400/20 bg-indigo-500/10",
      "text-emerald-400/20 bg-emerald-500/10",
      "text-purple-400/20 bg-purple-500/10",
      "text-amber-400/20 bg-amber-500/10"
    ];

    const generated: FloatingItem[] = [];
    for (let i = 0; i < 11; i++) {
      const type = symbolTypes[i % symbolTypes.length];
      let content = "";
      if (type === "code") {
        content = i % 2 === 0 ? "{ }" : "=>";
      } else if (type === "check") {
        content = "✔";
      } else if (type === "warning") {
        content = "⚠";
      }

      generated.push({
        id: i,
        type,
        content,
        size: type === "dot" ? Math.floor(Math.random() * 4) + 3 : Math.floor(Math.random() * 6) + 11,
        initialX: Math.random() * 100,
        initialY: Math.random() * 100,
        duration: Math.random() * 25 + 20, // slow, gentle float
        delay: Math.random() * -15, // negative delay so they start immediately distributed
        color: colors[i % colors.length]
      });
    }

    return generated;
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {items.map((item) => {
        // Dot element or symbol element
        const isDot = item.type === "dot";

        return (
          <motion.div
            key={item.id}
            initial={{
              x: 0,
              y: 0,
              opacity: 0
            }}
            animate={{
              // Super smooth floating path that triggers GPU render layers directly
              x: [0, 40, -40, 0],
              y: [0, -80, 50, 0],
              opacity: [0, 0.55, 0.75, 0.35, 0],
              rotate: [0, 120, 240, 360]
            }}
            transition={{
              duration: item.duration,
              delay: item.delay,
              repeat: Infinity,
              ease: "linear"
            }}
            className={`absolute pointer-events-none select-none flex items-center justify-center font-mono ${
              isDot ? "rounded-full" : "rounded-md p-1 border border-white/5 shadow-sm"
            } ${item.color}`}
            style={{
              left: `${item.initialX}%`,
              top: `${item.initialY}%`,
              width: isDot ? item.size : "auto",
              height: isDot ? item.size : "auto",
              fontSize: isDot ? undefined : `${item.size}px`,
              willChange: "transform, opacity"
            }}
          >
            {!isDot && item.content}
          </motion.div>
        );
      })}
    </div>
  );
}

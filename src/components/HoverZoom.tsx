import React from "react";
import { motion } from "motion/react";

interface HoverZoomProps {
  children: React.ReactNode;
  className?: string;
  scale?: number;
  glowColor?: string;
  inline?: boolean;
  key?: React.Key;
}

export default function HoverZoom({
  children,
  className = "",
  scale = 1.035,
  glowColor = "rgba(99, 102, 241, 0.25)",
  inline = false
}: HoverZoomProps) {
  const MotionTag = inline ? motion.span : motion.div;

  return (
    <MotionTag
      whileHover={{
        scale,
        y: -1.5,
        z: 5,
        filter: "brightness(1.1)",
        boxShadow: !inline ? `0 12px 24px -10px ${glowColor}` : undefined,
        textShadow: inline ? `0 0 8px ${glowColor}` : undefined
      }}
      transition={{
        type: "spring",
        stiffness: 350,
        damping: 20
      }}
      className={`inline-block transition-all duration-200 ${className}`}
    >
      {children}
    </MotionTag>
  );
}

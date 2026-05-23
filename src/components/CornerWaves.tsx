import React from "react";
import { motion } from "motion/react";

export default function CornerWaves() {
  // We'll create 4 deforming liquid structures, one for each corner.
  // We utilize a CSS animation with framer-motion keyframes to randomly morph border-radius,
  // creating a beautiful liquid fluid look.

  const deformingKeyframes = {
    borderRadius: [
      "42% 58% 70% 30% / 45% 45% 55% 55%",
      "70% 30% 52% 48% / 60% 40% 60% 40%",
      "30% 70% 40% 60% / 50% 60% 40% 50%",
      "42% 58% 70% 30% / 45% 45% 55% 55%"
    ],
    rotate: [0, 90, 180, 270, 360],
    scale: [1, 1.15, 0.95, 1.08, 1]
  };

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* TOP LEFT CORNER WAVE */}
      <motion.div
        animate={deformingKeyframes}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute -top-32 -left-32 w-[340px] h-[340px] md:w-[480px] md:h-[480px] rounded-full bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent blur-[40px] opacity-60 mix-blend-screen"
        style={{
          willChange: "transform, border-radius",
          backfaceVisibility: "hidden"
        }}
      />

      {/* TOP RIGHT CORNER WAVE */}
      <motion.div
        animate={{
          borderRadius: [
            "50% 50% 30% 70% / 50% 60% 40% 50%",
            "30% 70% 70% 30% / 50% 30% 70% 50%",
            "60% 40% 30% 75% / 40% 60% 50% 60%",
            "50% 50% 30% 70% / 50% 60% 40% 50%"
          ],
          rotate: [360, 270, 180, 90, 0],
          scale: [0.9, 1.1, 1.0, 0.95, 0.9]
        }}
        transition={{
          duration: 26,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute -top-32 -right-32 w-[340px] h-[340px] md:w-[480px] md:h-[480px] rounded-full bg-gradient-to-bl from-purple-500/10 via-pink-500/5 to-transparent blur-[40px] opacity-50 mix-blend-screen"
        style={{
          willChange: "transform, border-radius",
          backfaceVisibility: "hidden"
        }}
      />

      {/* BOTTOM LEFT CORNER WAVE */}
      <motion.div
        animate={{
          borderRadius: [
            "60% 40% 60% 40% / 40% 60% 40% 60%",
            "40% 60% 30% 70% / 50% 42% 58% 50%",
            "55% 45% 70% 30% / 65% 35% 65% 35%",
            "60% 40% 60% 40% / 40% 60% 40% 60%"
          ],
          rotate: [0, -120, -240, -360],
          scale: [1, 1.08, 0.9, 1.04, 1]
        }}
        transition={{
          duration: 28,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute -bottom-32 -left-32 w-[340px] h-[340px] md:w-[480px] md:h-[480px] rounded-full bg-gradient-to-tr from-emerald-500/10 via-indigo-500/5 to-transparent blur-[40px] opacity-55 mix-blend-screen"
        style={{
          willChange: "transform, border-radius",
          backfaceVisibility: "hidden"
        }}
      />

      {/* BOTTOM RIGHT CORNER WAVE */}
      <motion.div
        animate={{
          borderRadius: [
            "40% 60% 50% 50% / 50% 30% 70% 50%",
            "70% 30% 62% 38% / 60% 40% 60% 40%",
            "50% 50% 40% 60% / 40% 60% 40% 60%",
            "40% 60% 50% 50% / 50% 30% 70% 50%"
          ],
          rotate: [360, 180, 0],
          scale: [0.95, 1.12, 0.98, 1.05, 0.95]
        }}
        transition={{
          duration: 24,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute -bottom-32 -right-32 w-[340px] h-[340px] md:w-[480px] md:h-[480px] rounded-full bg-gradient-to-tl from-indigo-500/10 via-teal-500/5 to-transparent blur-[40px] opacity-60 mix-blend-screen"
        style={{
          willChange: "transform, border-radius",
          backfaceVisibility: "hidden"
        }}
      />
    </div>
  );
}

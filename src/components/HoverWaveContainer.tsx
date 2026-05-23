import React, { useState, useRef, MouseEvent } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

interface HoverWaveContainerProps {
  children: React.ReactNode;
  className?: string;
  key?: React.Key;
}

export default function HoverWaveContainer({ children, className = "" }: HoverWaveContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const rippleIdCounter = useRef(0);

  // Mouse absolute positions
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring animations for cursor chasing
  const springConfig = { stiffness: 150, damping: 25 };
  const spotlightX = useSpring(mouseX, springConfig);
  const spotlightY = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseEnter = (e: MouseEvent<HTMLDivElement>) => {
    setIsHovered(true);
    triggerRipple(e);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const triggerRipple = (e: MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newRipple = {
      id: rippleIdCounter.current++,
      x,
      y
    };

    setRipples((prev) => [...prev, newRipple]);

    // Clean up older ripple from DOM
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 1200);
  };

  return (
    <motion.div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={triggerRipple}
      whileHover={{ 
        scale: 1.025,
        y: -4,
        zIndex: 10
      }}
      transition={{ 
        type: "spring", 
        stiffness: 260, 
        damping: 22 
      }}
      className={`relative rounded-3xl overflow-hidden bg-[#121213]/40 backdrop-blur-xl border border-white/5 hover:border-[#0071e3]/40 transition-all duration-500 cursor-default ${className}`}
      style={{
        transformStyle: "preserve-3d"
      }}
    >
      {/* Interactive Silver Spotlight (Glow Wave) */}
      <motion.div
        className="absolute pointer-events-none rounded-full blur-[100px] z-0 transition-opacity duration-300"
        style={{
          width: 320,
          height: 320,
          background: "radial-gradient(circle, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.01) 60%, transparent 100%)",
          left: spotlightX,
          top: spotlightY,
          translateX: "-50%",
          translateY: "-50%",
          opacity: isHovered ? 1 : 0
        }}
      />

      {/* Behind-the-text Ambient Silver Tracker */}
      <motion.div
        className="absolute pointer-events-none rounded-full blur-[50px] z-0 transition-opacity duration-500"
        style={{
          width: 140,
          height: 140,
          background: "radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 100%)",
          left: spotlightX,
          top: spotlightY,
          translateX: "-50%",
          translateY: "-50%",
          opacity: isHovered ? 0.9 : 0
        }}
      />

      {/* Ripple Waves Grid */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-10 select-none">
        {ripples.map((rip) => (
          <motion.div
            key={rip.id}
            initial={{ scale: 0, opacity: 0.4 }}
            animate={{ scale: 3.5, opacity: 0 }}
            transition={{ duration: 1.0, ease: "easeOut" }}
            className="absolute rounded-full border border-white/10 bg-transparent"
            style={{
              left: rip.x,
              top: rip.y,
              width: 100,
              height: 100,
              transform: "translate(-50%, -50%)"
            }}
          />
        ))}
      </div>

      {/* Child elements rendered relative to custom layers */}
      <div className="relative z-20 w-full h-full">
        {children}
      </div>
    </motion.div>
  );
}

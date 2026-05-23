import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Bug, ShieldCheck, Zap, Terminal, CheckCircle2 } from "lucide-react";

interface QABugHunterProps {
  activeTab: string;
}

interface ScurryingBug {
  id: string;
  name: string;
  emoji: string;
  status: "scurrying" | "squashed" | "escaped";
  startX: number; // percentage
  startY: number; // percentage
  endX: number; // percentage
  endY: number; // percentage
  delay: number;
  duration: number;
  angle: number;
}

const FUNNY_BUGS = [
  { name: "NullPointerException", emoji: "🐛" },
  { name: "Race Condition", emoji: "🐞" },
  { name: "Merge Conflict", emoji: "🐜" },
  { name: "Z-Index Leak", emoji: "🕷️" },
  { name: "Infinite Loop", emoji: "🦟" },
  { name: "CSS Flexbox Collapse", emoji: "🐌" },
  { name: "Memory Leak", emoji: "🦂" },
  { name: "OffByOne Array", emoji: "🦗" },
];

const QA_LOGS = [
  "Deploying automated WebDriver check...",
  "WARNING: Uncaught exception in main UI thread!",
  "Synchronizing locks for checkout transaction...",
  "BUG SQUASHED: Race condition successfully resolved.",
  "PROD DEPLOYMENT CLEAN: Zero-defect threshold reached.",
];

export default function QABugHunter({ activeTab }: QABugHunterProps) {
  const [bugs, setBugs] = useState<ScurryingBug[]>([]);
  const [activeLogs, setActiveLogs] = useState<string[]>([]);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    // Generate new set of bugs on tab change
    const newBugs: ScurryingBug[] = Array.from({ length: 6 }).map((_, idx) => {
      const bugTemplate = FUNNY_BUGS[Math.floor(Math.random() * FUNNY_BUGS.length)];
      const startFromLeft = Math.random() > 0.5;
      
      const startX = startFromLeft ? -10 : Math.random() * 100;
      const startY = startFromLeft ? Math.random() * 80 + 10 : 110;
      const endX = startFromLeft ? 110 : Math.random() * 100;
      const endY = startFromLeft ? Math.random() * 80 + 10 : -10;

      // Calculate angle of motion
      const dx = endX - startX;
      const dy = endY - startY;
      const angle = (Math.atan2(dy, dx) * 180) / Math.PI;

      return {
        id: `${activeTab}-${idx}-${Date.now()}`,
        name: bugTemplate.name,
        emoji: bugTemplate.emoji,
        status: "scurrying",
        startX,
        startY,
        endX,
        endY,
        delay: Math.random() * 0.4,
        duration: Math.random() * 2 + 1.8, // 1.8s to 3.8s
        angle,
      };
    });

    setBugs(newBugs);
    setIsScanning(true);

    // Pick 2 random funny QA logs to show in scanning HUD
    const log1 = `[QA Engine] Scanner matched '${newBugs[0]?.name || "UncaughtError"}' in branch.`;
    const log2 = `[Selenium] Firing assertions: expect(${Math.round(Math.random() * 100) + 200}ms response time).`;
    setActiveLogs([log1, log2]);

    // Cleanup scans and bugs after transition is over
    const scanTimeout = setTimeout(() => {
      setIsScanning(false);
    }, 2500);

    // Dynamically squash some bugs 1.2s into the journey
    const squashTimeout = setTimeout(() => {
      setBugs((currentBugs) =>
        currentBugs.map((b, bIdx) => {
          if (bIdx % 2 === 0) {
            return { ...b, status: "squashed" };
          }
          return b;
        })
      );
      setActiveLogs((prev) => [
        ...prev,
        `[Assert SUCCESS] Squashed bug '${newBugs[0]?.name || "NullPointerException"}' with zero residuals. ✅`,
      ]);
    }, 1200);

    return () => {
      clearTimeout(scanTimeout);
      clearTimeout(squashTimeout);
    };
  }, [activeTab]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {/* Background Matrix/Grid Overlay just during transitions */}
      <AnimatePresence>
        {isScanning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.12 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 bg-radial-gradient from-emerald-500/10 via-black/80 to-black grid grid-cols-12 gap-1 pointer-events-none opacity-10"
            style={{
              backgroundImage: "radial-gradient(circle, rgba(16,185,129,0.06) 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />
        )}
      </AnimatePresence>

      {/* Cybernetic Suite Scanner Sweep Line */}
      <AnimatePresence>
        {isScanning && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-0 bottom-0 left-0 w-full border-r-2 border-emerald-500/50 bg-gradient-to-r from-transparent to-emerald-500/5 pointer-events-none z-10 shadow-[4px_0_20px_rgba(16,185,129,0.15)] flex items-center justify-end"
          >
            {/* Tiny Retro LED Scanner Bulb at the right edge of sweep */}
            <div className="absolute right-0 top-0 bottom-0 w-0.5 flex flex-col justify-between py-12">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            </div>
            <span className="hidden md:inline absolute top-4 right-6 font-mono text-[8px] text-emerald-400 bg-black/90 border border-emerald-500/30 px-1.5 py-0.5 rounded uppercase tracking-wider backdrop-blur-sm shadow-xl">
              REGRESSION RUNNER SCANNING
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Bugs and Squashed Popups */}
      {bugs.map((bug) => {
        const isScurrying = bug.status === "scurrying";
        const isSquashed = bug.status === "squashed";

        return (
          <motion.div
            key={bug.id}
            initial={{
              left: `${bug.startX}%`,
              top: `${bug.startY}%`,
              opacity: 0,
              scale: 0.2,
              rotate: bug.angle,
            }}
            animate={{
              left: `${bug.endX}%`,
              top: `${bug.endY}%`,
              opacity: [0, 0.6, 0.7, 0.4, 0],
              scale: [0.6, 1.1, 0.8, 0],
            }}
            transition={{
              duration: bug.duration,
              delay: bug.delay,
              ease: "easeInOut",
            }}
            className="absolute flex flex-col items-center justify-center select-none"
            style={{
              willChange: "left, top, transform, opacity",
            }}
          >
            {isScurrying ? (
              <div className="relative group flex items-center justify-center">
                {/* Bug Emoji with wiggle animation */}
                <span className="text-xl inline-block animate-wiggle select-none text-rose-500/50">
                  {bug.emoji}
                </span>

                {/* Bug label tag */}
                <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 bg-black/90 border border-rose-500/20 rounded px-1.5 py-0.5 text-[8px] font-mono text-rose-400 backdrop-blur-sm whitespace-nowrap opacity-30 tracking-tight scale-75">
                  {bug.name}
                </span>
                
                {/* Wavy legs indicator */}
                <span className="absolute w-6 h-1 border-t border-rose-500/10 -bottom-1 -left-1 rounded-full animate-pulse" />
              </div>
            ) : isSquashed ? (
              <motion.div 
                initial={{ scale: 1.4, opacity: 1, rotate: 0 }}
                animate={{ scale: 0, opacity: 0, y: -40, rotate: 180 }}
                transition={{ duration: 0.9, ease: "easeOut" }}
                className="flex flex-col items-center justify-center"
              >
                {/* Green checkpoint spark */}
                <div className="bg-emerald-500/15 border border-emerald-500/40 rounded-full p-1.5 text-emerald-400 shadow-lg shadow-emerald-500/10">
                  <ShieldCheck className="w-4 h-4 mr-px" />
                </div>
                <div className="absolute text-[8px] font-mono text-emerald-400 bg-black/90 border border-emerald-500/20 px-1 rounded -bottom-5 whitespace-nowrap uppercase tracking-widest font-bold scale-90">
                  FIXED: ok!
                </div>
              </motion.div>
            ) : null}
          </motion.div>
        );
      })}

      {/* Retro HUD log streams of QA operations */}
      <AnimatePresence>
        {isScanning && activeLogs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 0.85, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="absolute bottom-4 left-4 right-4 hidden md:flex flex-col gap-1 text-left select-none max-w-md bg-[#161617]/90 border border-zinc-800/80 rounded-xl p-3 font-mono text-[9px] text-zinc-500 backdrop-blur-sm z-10"
          >
            <div className="flex items-center gap-1.5 text-emerald-400 border-b border-zinc-800/40 pb-1 font-bold text-[8px] uppercase tracking-wider">
              <Terminal className="w-3 h-3 text-emerald-400 animate-pulse" />
              <span>Shift-Left Regression Thread Diagnostic</span>
            </div>
            {activeLogs.map((log, idx) => (
              <p key={idx} className={`truncate ${log.includes("SUCCESS") ? "text-emerald-400 font-semibold" : "text-zinc-400"}`}>
                {log}
              </p>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

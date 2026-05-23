import React, { useState } from "react";
import { Shield, Sparkles, HelpCircle, Coins, Clock, ArrowRight, AlertTriangle, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import HoverWaveContainer from "./HoverWaveContainer";
import HoverZoom from "./HoverZoom";

export default function ProfessionalSummary() {
  const [[activeStage, direction], setActiveStageState] = useState<[number, number]>([0, 0]);

  const setActiveStage = (nextStage: number) => {
    setActiveStageState((prev) => {
      const current = prev[0];
      const dir = nextStage > current ? 1 : -1;
      return [nextStage, dir];
    });
  };

  const stages = [
    {
      name: "Requirements",
      cost: 100,
      time: "15 mins",
      risk: "Extremely Low",
      impact: "Zero customer impact. Clarified specs immediately.",
      description: "Defining clear, testable criteria before developers write a single line of code. Catching ambiguities in user stories.",
      color: "bg-emerald-500",
      textColor: "text-emerald-400 font-semibold",
      borderColor: "border-emerald-500",
    },
    {
      name: "Design / Architecture",
      cost: 300,
      time: "1 hour",
      risk: "Low",
      impact: "Minor alignment sync. Technical design adjusted.",
      description: "Reviewing data models,API endpoints, and integration points. Pre-empting design bottlenecks and security vulnerabilities.",
      color: "bg-teal-500",
      textColor: "text-teal-400 font-semibold",
      borderColor: "border-teal-500",
    },
    {
      name: "Development",
      cost: 1000,
      time: "4 hours",
      risk: "Moderate",
      impact: "Dev stops feature work, refactors, and recommits.",
      description: "Pairing with developers, reviewing pull requests, running fast unit tests, and local boundary validations.",
      color: "bg-blue-500",
      textColor: "text-blue-400 font-semibold",
      borderColor: "border-blue-500",
    },
    {
      name: "Continuous Integration & Testing",
      cost: 2500,
      time: "1 day",
      risk: "High",
      impact: "Re-triggers build pipeline, blocks deployment, demands complete regression run.",
      description: "Automated regression pipelines, cross-browser suites, functional end-to-end user testing across staging environments.",
      color: "bg-amber-500",
      textColor: "text-amber-400 font-semibold",
      borderColor: "border-amber-500",
    },
    {
      name: "Production (Post-Release)",
      cost: 15000,
      time: "5+ days",
      risk: "CRITICAL & DISRUPTIVE",
      impact: "Hotfix required, lost revenue, customer frustration, severe brand damage.",
      description: "Bugs reaching the active Ubuy user base. Requires rollsbacks, firefighting, emergency deployments, and post-mortems.",
      color: "bg-rose-500",
      textColor: "text-rose-400 font-semibold",
      borderColor: "border-rose-500",
    },
  ];

  const containerVariants = {
    enter: (dir: number) => ({
      x: dir * 35,
      opacity: 0,
      scale: 0.98,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: "spring", stiffness: 350, damping: 26 },
        opacity: { duration: 0.2 },
        scale: { duration: 0.2 },
        staggerChildren: 0.05,
        delayChildren: 0.02,
      },
    },
    exit: (dir: number) => ({
      x: -dir * 35,
      opacity: 0,
      scale: 0.98,
      transition: {
        x: { type: "spring", stiffness: 350, damping: 26 },
        opacity: { duration: 0.15 },
        scale: { duration: 0.15 },
      },
    }),
  };

  const childVariants = {
    enter: (dir: number) => ({
      opacity: 0,
      x: dir * 15,
      y: 8,
    }),
    center: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
    exit: (dir: number) => ({
      opacity: 0,
      x: -dir * 15,
      y: -8,
      transition: {
        duration: 0.15,
      },
    }),
  };

  return (
    <div id="professional-summary" className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left column: Professional Bio */}
        <div className="lg:col-span-5 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 text-[#86868b] text-[10px] font-sans border border-zinc-800">
            <Shield className="w-3 h-3 text-[#2997ff]" />
            <span>Software Tester QA @ Ubuy</span>
          </div>
          
          <h2 className="text-section-title text-white text-left">
            Testing Philosophy. <br />
            <span className="text-[#86868b] bg-gradient-to-r from-white to-[#86868b] bg-clip-text text-transparent">
              Shift-Left & Automation.
            </span>
          </h2>
          
          <p className="text-[#86868b] leading-relaxed text-sm text-left">
            I approach software testing as a continuous engineering discipline. At <strong>Ubuy Technologies</strong>, I validate web, iOS, and Android applications, ensuring checkout flows, search engines like <span className="text-white font-medium">OneSearch</span>, and web scraping accuracy (95%+) are bulletproof.
          </p>

          <p className="text-[#86868b] leading-relaxed text-sm text-left">
            By shifting quality assurance upstream and introducing robust DevOps cloud testing pipelines, we detect regression loops and schema errors in minutes instead of days. This prevents post-production leaks and delivers stable releases.
          </p>
 
          <HoverWaveContainer className="p-5 space-y-4 bg-transparent border-transparent">
            <h4 className="text-[10px] font-mono uppercase tracking-wider text-white font-semibold">Core Tenets</h4>
            <ul className="space-y-3 text-xs text-[#86868b]">
              <li className="flex items-start gap-2.5">
                <span className="text-[#0071e3] mt-0.5">●</span>
                <span><strong className="text-white font-medium">E-Commerce Domain Expertise</strong>: Functional, regression, and cross-browser testing for web, iOS, and Android applications at e-commerce scale.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-[#0071e3] mt-0.5">●</span>
                <span><strong className="text-white font-medium">150+ Bugs Documented & Tracked</strong>: Managed complete defect life-cycles in Jira to cut defect turnaround times by 20–25%.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-[#0071e3] mt-0.5">●</span>
                <span><strong className="text-white font-medium">Data Scraping & Validation</strong>: Automated schema testing (via jq tools/shell scripting) achieving 95%+ pricing & stock data accuracy.</span>
              </li>
            </ul>
          </HoverWaveContainer>
        </div>

        {/* Right column: COST TO FIX SIMULATOR */}
        <HoverWaveContainer className="lg:col-span-7 bg-transparent border-transparent p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h3 className="text-md font-semibold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#0071e3]" />
                <span>Interactive Cost-to-Fix Simulator</span>
              </h3>
              <p className="text-[11px] text-[#86868b] mt-0.5">
                Click across the software development life cycle (SDLC) stages to model the cost of bugs.
              </p>
            </div>
            <div className="px-2.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] text-[#86868b] font-medium">
              QA Metrics Engine
            </div>
          </div>

          {/* Graphical Timeline Bar */}
          <div className="relative mb-8 pt-4">
            {/* Background Line */}
            <div className="absolute top-[38px] left-2 right-2 h-[2px] bg-zinc-800 rounded-full" />
            {/* Filled progress line */}
            <div 
              className="absolute top-[38px] left-2 h-[2px] bg-gradient-to-r from-[#0071e3] to-white rounded-full transition-all duration-500"
              style={{ width: `${(activeStage / 4) * 100}%` }}
            />

            {/* Stepper Dots */}
            <div className="relative flex justify-between">
              {stages.map((stage, idx) => {
                const isActive = idx === activeStage;
                return (
                  <button
                    key={idx}
                    id={`stage-selector-btn-${idx}`}
                    onClick={() => setActiveStage(idx)}
                    className="flex flex-col items-center group focus:outline-none z-10 cursor-pointer"
                    style={{ width: "18%" }}
                  >
                    <div className="relative flex items-center justify-center">
                      {isActive && (
                        <motion.div
                          layoutId="activeSDLCStageDot"
                          className="absolute -inset-1.5 rounded-full bg-white/5 border border-white/20 blur-[1px]"
                          transition={{ type: "spring", stiffness: 350, damping: 20 }}
                        />
                      )}
                      
                      <div 
                        className={`relative w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-300 ${
                          isActive 
                            ? "border-white bg-white text-black font-semibold scale-105" 
                            : "border-zinc-800 bg-[#161617] text-zinc-500 group-hover:border-zinc-600"
                        }`}
                      >
                        <span className="text-[11px] font-semibold">{idx + 1}</span>
                      </div>
                    </div>
                    <span 
                      className={`text-[9px] mt-2 font-medium tracking-tight text-center transition-colors duration-200 line-clamp-1 ${
                        isActive ? "text-white font-semibold" : "text-[#86868b] group-hover:text-white"
                      }`}
                    >
                      {stage.name.split(" ")[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Stage Details */}
          <div className="relative overflow-hidden min-h-[350px] sm:min-h-[310px] md:min-h-[260px] w-full flex flex-col justify-start">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div 
                key={activeStage}
                custom={direction}
                variants={containerVariants}
                initial="enter"
                animate="center"
                exit="exit"
                id="stage-details-card"
                className="p-5 rounded-2xl bg-black border border-[#2c2c2e] space-y-4 w-full h-full text-left"
              >
                <motion.div 
                  custom={direction} 
                  variants={childVariants}
                  className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 pb-3 border-b border-[#2c2c2e]"
                >
                  <div>
                    <span className="text-[10px] text-[#86868b] tracking-wider uppercase font-semibold block">STAGE {activeStage + 1} OF 5</span>
                    <h4 className="text-base font-semibold text-white flex items-center gap-1.5 mt-0.5">
                      <span className={`w-2 h-2 rounded-full ${activeStage < 3 ? "bg-emerald-500" : "bg-rose-500"}`} />
                      {stages[activeStage].name}
                    </h4>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800">
                      <Coins className="w-3 h-3 text-[#86868b]" />
                      <span className="text-xs font-semibold text-white">${stages[activeStage].cost}</span>
                      <span className="text-[9px] text-[#86868b]">cost to fix</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800">
                      <Clock className="w-3 h-3 text-[#0071e3]" />
                      <span className="text-xs font-semibold text-white">{stages[activeStage].time}</span>
                      <span className="text-[9px] text-[#86868b]">fix delay</span>
                    </div>
                  </div>
                </motion.div>

                <motion.p 
                  custom={direction} 
                  variants={childVariants}
                  className="text-xs text-[#86868b] leading-relaxed text-left"
                >
                  {stages[activeStage].description}
                </motion.p>

                <motion.div 
                  custom={direction} 
                  variants={childVariants}
                  className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1"
                >
                  <div className="p-3 rounded-xl bg-zinc-900/55 border border-zinc-800 space-y-1 text-left">
                    <span className="text-[10px] text-[#86868b] uppercase tracking-wider block font-semibold">Risk profile</span>
                    <span className={`flex items-center gap-1.5 font-semibold ${
                      activeStage >= 3 ? "text-rose-400" : activeStage === 2 ? "text-amber-400" : "text-emerald-400"
                    }`}>
                      <AlertTriangle className="w-3.5 h-3.5" />
                      {stages[activeStage].risk}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-zinc-900/55 border border-zinc-800 space-y-1 text-left">
                    <span className="text-[10px] text-[#86868b] uppercase tracking-wider block font-semibold">Operational Impact</span>
                    <span className="text-[#86868b] text-[11px] leading-tight block text-left">
                      {stages[activeStage].impact}
                    </span>
                  </div>
                </motion.div>

                {/* Shift-left visual conclusion banner */}
                <motion.div 
                  custom={direction} 
                  variants={childVariants}
                  className={`p-3 rounded-xl border text-xs flex items-center gap-3 text-left ${
                    activeStage < 3 
                      ? "bg-zinc-950 border-zinc-800 text-emerald-400"
                      : "bg-zinc-950 border-zinc-800 text-rose-400"
                  }`}
                >
                  <CheckCircle className={`w-3.5 h-3.5 shrink-0 ${activeStage < 3 ? "text-emerald-400" : "text-rose-400"}`} />
                  <p className="text-left leading-relaxed text-[11px]">
                    {activeStage < 3 
                      ? "Capturing bugs here operates at high efficiency. Average savings of up to 90% in developer costs, preventing customer attrition."
                      : "Escaping upstream gates. This tier incurs deep overhead, demanding immediate developer shift-off and complex testing passes."
                    }
                  </p>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </HoverWaveContainer>
      </div>
    </div>
  );
}

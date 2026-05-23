import React, { useState, useEffect, useRef } from "react";
import { Bug, Terminal, Code, Cpu, Mail, Globe, Github, Linkedin, Sparkles, ExternalLink, Activity, FileText } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import ProfessionalSummary from "./components/ProfessionalSummary";
import TechnicalSkills from "./components/TechnicalSkills";
import UbuyContributions from "./components/UbuyContributions";
import ProjectShowcase from "./components/ProjectShowcase";
import EducationSection from "./components/EducationSection";
import LiveDemoSandbox from "./components/LiveDemoSandbox";
import AiQaAssistant from "./components/AiQaAssistant";
import ContactSection from "./components/ContactSection";
import CornerWaves from "./components/CornerWaves";
import FloatingParticles from "./components/FloatingParticles";
import CursorGlitter from "./components/CursorGlitter";
import HoverZoom from "./components/HoverZoom";
import CVModal from "./components/CVModal";
import AqaSystemMatrix from "./components/AqaSystemMatrix";
import AmbientBackground from "./components/AmbientBackground";

/**
 * Apple Spec Scroll Reveal helper.
 * Uses real IntersectionObserver (0.15 threshold) and appends 'is-visible'.
 */
function ScrollReveal({ children, className = "", style = {} }: { children: React.ReactNode, className?: string, style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!("IntersectionObserver" in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Once visible, keep it to mimic seamless native load
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.15 }
    );
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`scroll-entrance ${isVisible ? "is-visible" : ""} ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}

function getIsMobileLike() {
  if (typeof window === "undefined" || !("matchMedia" in window)) {
    return true;
  }

  return window.matchMedia("(max-width: 767px), (pointer: coarse)").matches;
}

export default function App() {
  const mailTo = "mailto:dipendu.mukherjee.27@gmail.com";
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCvModalOpen, setIsCvModalOpen] = useState(false);
  const [isMobileLike, setIsMobileLike] = useState(getIsMobileLike);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const updateDeviceMode = () => setIsMobileLike(getIsMobileLike());
    updateDeviceMode();
    window.addEventListener("resize", updateDeviceMode, { passive: true });
    return () => window.removeEventListener("resize", updateDeviceMode);
  }, []);

  const appleEase = [0.25, 0.1, 0.25, 1];

  // Professional Smooth Scroll implementation with header-offset subtraction
  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      const headerOffset = 48; // sticky nav bar height is exactly 48px
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  // Animated elements variants for Hero page load seq
  const heroVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-[#000000] text-[#f5f5f7] selection:bg-[#0071e3]/30 selection:text-white font-sans antialiased text-left pb-16 relative overflow-hidden">
      {!isMobileLike && (
        <>
          <AmbientBackground />
          <FloatingParticles />
          <AqaSystemMatrix />
          <CursorGlitter />
        </>
      )}

      {/* Sticky Apple-Style Product Navigation Bar (48px tall, frosted glass) */}
      <div 
        className={`fixed top-0 z-50 w-full h-12 flex items-center transition-all duration-300 ${
          isScrolled 
            ? "bg-[#000000]/72 backdrop-blur-[20px] saturate-[180%] border-b border-white/10 shadow-sm" 
            : "bg-[#000000]/30 backdrop-blur-[10px] saturate-[150%] border-b border-transparent"
        }`}
      >
        <div className="max-w-[1020px] lg:max-w-[1120px] xl:max-w-[1240px] 2xl:max-w-[1360px] mx-auto w-full px-[22px] flex justify-between items-center overflow-x-clip">
          <div className="flex items-center gap-3 lg:gap-4 xl:gap-6 animate-fade-in">
            <a 
              href="#portfolio-header" 
              onClick={(e) => handleScrollTo(e, "portfolio-header")}
              className="text-xs lg:text-sm font-semibold text-white tracking-tight hover:opacity-60 transition duration-300 whitespace-nowrap"
            >
              Dipendu Mukherjee
            </a>
            <nav className="hidden lg:flex items-center gap-2.5 lg:gap-3.5 xl:gap-6 text-[11px] lg:text-[11.5px] xl:text-[13px] text-[#86868b] font-medium font-sans">
              <a href="#professional-summary" onClick={(e) => handleScrollTo(e, "professional-summary")} className="text-[#f5f5f7] hover:text-white hover:opacity-100 opacity-80 transition duration-300 whitespace-nowrap">Philosophy</a>
              <a href="#technical-skills" onClick={(e) => handleScrollTo(e, "technical-skills")} className="text-[#f5f5f7] hover:text-white hover:opacity-100 opacity-80 transition duration-300 whitespace-nowrap">Tools</a>
              <a href="#project-showcase" onClick={(e) => handleScrollTo(e, "project-showcase")} className="text-[#f5f5f7] hover:text-white hover:opacity-100 opacity-80 transition duration-300 whitespace-nowrap">Test Matrix</a>
              <a href="#education-activities" onClick={(e) => handleScrollTo(e, "education-activities")} className="text-[#f5f5f7] hover:text-white hover:opacity-100 opacity-80 transition duration-300 whitespace-nowrap">Journey</a>
              <a href="#live-sandbox-demo" onClick={(e) => handleScrollTo(e, "live-sandbox-demo")} className="text-[#f5f5f7] hover:text-white hover:opacity-100 opacity-80 transition duration-300 whitespace-nowrap">Sandbox</a>
              <a href="#ai-qa-assistant" onClick={(e) => handleScrollTo(e, "ai-qa-assistant")} className="text-[#f5f5f7] hover:text-white hover:opacity-100 opacity-80 transition duration-300 whitespace-nowrap">AI Builder</a>
              <a href="#contact-hub" onClick={(e) => handleScrollTo(e, "contact-hub")} className="text-[#f5f5f7] hover:text-white hover:opacity-100 opacity-80 transition duration-300 whitespace-nowrap">Contact</a>
            </nav>
          </div>
          
          <div className="flex items-center gap-2 lg:gap-3 sm:gap-4">
            {/* Desktop Icons */}
            <div className="hidden xl:flex items-center gap-3.5 border-r border-white/11 pr-3.5">
              <a
                href="https://github.com/Dipendu27"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#86868b] hover:text-white transition duration-200"
                title="GitHub Profile"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://www.linkedin.com/in/dipendu-mukherjee-4199a8226"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#86868b] hover:text-white transition duration-200"
                title="LinkedIn Profile"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href={mailTo}
                className="text-[#86868b] hover:text-[#2997ff] transition duration-200"
                title="Email Candidate"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>

            {/* Resume / CV Modal Trigger */}
            <button
              onClick={() => setIsCvModalOpen(true)}
              className="text-[11px] font-semibold bg-white text-black hover:bg-zinc-200 rounded-full px-3 py-1.5 transition-all duration-300 flex items-center gap-1.5 hover:scale-105 active:scale-95 whitespace-nowrap"
            >
              <FileText className="w-3.5 h-3.5 shrink-0" />
              <span>Resume / CV</span>
            </button>

            <a
              href={mailTo}
              className="text-xs font-medium text-white border border-white/25 rounded-full px-3 py-1.5 hover:bg-white hover:text-black transition-all duration-300 hidden lg:inline-block whitespace-nowrap"
            >
              Hire me
            </a>

            {/* Mobile Hamburger Icon (three 1px lines, 20px wide, 6px gap) */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden flex flex-col justify-center items-center w-5 h-5 gap-[5px] z-50 focus:outline-none relative"
              aria-label="Toggle navigation menu"
            >
              <span className={`w-5 h-[1px] bg-white transition-all duration-300 ${mobileMenuOpen ? "rotate-45 translate-y-[6px]" : ""}`} />
              <span className={`w-5 h-[1px] bg-white transition-all duration-300 ${mobileMenuOpen ? "opacity-0" : ""}`} />
              <span className={`w-5 h-[1px] bg-white transition-all duration-300 ${mobileMenuOpen ? "-rotate-45 -translate-y-[6px]" : ""}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Overlay Menu. Slides in from top with staggered items (60ms apart) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: "-100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ duration: 0.5, ease: appleEase }}
            className="fixed inset-0 bg-black z-40 flex flex-col justify-center items-center px-6 pt-16"
          >
            <nav className="flex flex-col items-center gap-6 text-[#e5e5ea] text-lg font-sans">
              {[
                { label: "Philosophy", href: "#professional-summary" },
                { label: "Tools", href: "#technical-skills" },
                { label: "Test Matrix", href: "#project-showcase" },
                { label: "Journey", href: "#education-activities" },
                { label: "Sandbox", href: "#live-sandbox-demo" },
                { label: "AI Builder", href: "#ai-qa-assistant" },
                { label: "Contact", href: "#contact-hub" },
              ].map((item, idx) => (
                <motion.a
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12 + idx * 0.06, duration: 0.4, ease: appleEase }}
                  href={item.href}
                  onClick={(e) => {
                    setMobileMenuOpen(false);
                    handleScrollTo(e, item.href.slice(1));
                  }}
                  className="hover:opacity-60 transition duration-300 text-xl tracking-tight"
                >
                  {item.label}
                </motion.a>
              ))}
              
              <div className="flex flex-col items-center gap-4 mt-4">
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12 + 6 * 0.06, duration: 0.4, ease: appleEase }}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsCvModalOpen(true);
                  }}
                  className="flex items-center gap-2 px-6 py-2 rounded-full border border-white/20 bg-white/5 text-white text-sm font-semibold tracking-tight transition hover:bg-white/15"
                >
                  <FileText className="w-4 h-4" />
                  <span>Resume / CV</span>
                </motion.button>

                <motion.a
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12 + 7 * 0.06, duration: 0.4, ease: appleEase }}
                  href={mailTo}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-6 py-2 rounded-full bg-[#0071e3] text-white text-sm font-semibold tracking-tight transition hover:opacity-85"
                >
                  Hire me
                </motion.a>
              </div>

              {/* Mobile Social Link Icons Row */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.12 + 8 * 0.06, duration: 0.4 }}
                className="flex items-center gap-6 mt-8 text-[#86868b]"
              >
                <a
                  href="https://github.com/Dipendu27"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition duration-200"
                >
                  <Github className="w-6 h-6" />
                </a>
                <a
                  href="https://www.linkedin.com/in/dipendu-mukherjee-4199a8226"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition duration-200"
                >
                  <Linkedin className="w-6 h-6" />
                </a>
                <a
                  href={mailTo}
                  className="hover:text-white transition duration-200"
                >
                  <Mail className="w-6 h-6" />
                </a>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* EXECUTIVE HERO PANEL - 100vh CENTERED EXQUISITE LAYOUT */}
      <div 
        id="portfolio-header" 
        className="min-h-screen bg-transparent w-full flex items-center justify-center pt-16 relative overflow-hidden"
      >
        {/* Soft Ambient Gaussian Blur Orbs to mix dark contrasts */}
        <div className="absolute top-[20%] right-[10%] w-[500px] h-[350px] bg-[#0071e3]/12 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-[20%] left-[15%] w-[450px] h-[350px] bg-indigo-500/8 rounded-full blur-[130px] pointer-events-none" />

        <div className="w-full max-w-[1020px] lg:max-w-[1120px] xl:max-w-[1240px] 2xl:max-w-[1360px] mx-auto px-[22px] relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left: Main details */}
            <div className="lg:col-span-8 space-y-6">
              {/* Eyebrow target animated seq 1 */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: appleEase, delay: 0 }}
                className="flex flex-wrap items-center gap-2"
              >
                <span className="px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-200 text-[10px] font-semibold tracking-wider uppercase">
                  Software Tester QA @ Ubuy
                </span>
                <span className="px-3 py-1 rounded-full bg-sky-500/10 text-sky-400 text-[10px] font-semibold border border-sky-500/20 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-pulse" />
                  DevOps Cloud Testing
                </span>
              </motion.div>

              {/* Headline target animated seq 2 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: appleEase, delay: 0.12 }}
                className="space-y-4"
              >
                <h1 className="text-hero-display text-white text-left tracking-tight">
                  Software Tester <br className="hidden md:inline" />
                  QA Specialist <br />
                  <span className="text-slate-400">Built for speed. Tested for perfection.</span>
                </h1>
              </motion.div>

              {/* Subtitle target animated seq 3 */}
              <motion.p 
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: appleEase, delay: 0.25 }}
                className="text-[17px] font-normal text-slate-200 font-sans leading-[1.7] text-left max-w-xl"
              >
                Test Automation Architect focusing on extreme regression performance and zero-defect e-commerce integrity. Applying Shift-Left strategies with automated CI pipelines to cut regression latency by up to 40%.
              </motion.p>

              {/* CTAs target animated seq 4 */}
              <motion.div 
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: appleEase, delay: 0.38 }}
                className="flex flex-wrap items-center gap-6 pt-2 text-sm font-semibold"
              >
                <a
                  href="#live-sandbox-demo"
                  onClick={(e) => handleScrollTo(e, "live-sandbox-demo")}
                  className="text-sky-400 hover:text-sky-300 underline decoration-sky-400/30 hover:decoration-sky-300/80 decoration-2 underline-offset-4 flex items-center gap-1.5 transition-colors duration-200"
                >
                  Run live automation <span>➔</span>
                </a>
                <a
                  href="#ai-qa-assistant"
                  onClick={(e) => handleScrollTo(e, "ai-qa-assistant")}
                  className="text-sky-400 hover:text-sky-300 underline decoration-sky-400/30 hover:decoration-sky-300/80 decoration-2 underline-offset-4 flex items-center gap-1.5 transition-colors duration-200"
                >
                  Try AI script builder <span>➔</span>
                </a>
                <a
                  href={mailTo}
                  className="text-white hover:text-slate-200 underline decoration-white/20 hover:decoration-slate-200/80 decoration-2 underline-offset-4 flex items-center gap-1.5 transition-colors duration-200"
                >
                  Contact Candidate
                </a>
              </motion.div>
            </div>

            {/* Right: Technical specifications box - mockup animated seq 5 with blended glassmorphism */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, ease: appleEase, delay: 0.2 }}
              className="lg:col-span-4 bg-zinc-900/60 backdrop-blur-xl border border-white/5 rounded-[18px] p-6 space-y-6 text-left relative overflow-hidden group shadow-2xl"
            >
              {/* Soft ambient inner-glow mixing the dark contrast */}
              <div className="absolute -inset-20 bg-[radial-gradient(circle_at_center,rgba(0,113,227,0.07),transparent_60%)] blur-[40px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              
              <div className="relative z-10">
                <span className="text-[10px] font-bold text-[#86868b] uppercase tracking-wider block">QA SPECIFICATION SHEET</span>
                <h2 className="text-base font-semibold text-white mt-1">Engineered Invariants</h2>
              </div>
              
              <div className="grid grid-cols-2 gap-y-5 gap-x-4 relative z-10">
                <div className="space-y-1">
                  <span className="text-[10px] text-[#86868b] font-medium block">REGRESSION LATENCY</span>
                  <span className="text-xl font-bold text-white font-mono block tracking-tight">40% Saved</span>
                  <span className="text-[9px] text-[#86868b] block leading-tight">via asynchronous playbook loops</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-[#86868b] font-medium block">CODE COVERAGE</span>
                  <span className="text-xl font-bold text-white font-mono block tracking-tight">94.2% UI</span>
                  <span className="text-[9px] text-[#86868b] block leading-tight">critical path contract gates</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-[#86868b] font-medium block">CATCH METRIC</span>
                  <span className="text-xl font-bold text-white font-mono block tracking-tight">250+ Bugs</span>
                  <span className="text-[9px] text-[#86868b] block leading-tight">upstream developer branch traps</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-[#86868b] font-medium block">INTEGRATIONS</span>
                  <span className="text-xl font-bold text-white font-mono block tracking-tight">120+ Contracts</span>
                  <span className="text-[9px] text-[#86868b] block leading-tight">monitored checkout APIs</span>
                </div>
              </div>

              <div className="p-3 bg-black/60 rounded-xl border border-white/5 flex items-center gap-2.5 relative z-10">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-[10px] font-medium text-emerald-400">Nightly Jenkins health index: 100% passing</span>
              </div>
            </motion.div>

          </div>
        </div>
      </div>

      {/* SECTION 1: PROFESSIONAL SUMMARY & PHILOSOPHY TIMELINE */}
      <section className="w-full bg-transparent py-[80px] md:py-[120px] relative overflow-hidden border-t border-zinc-900/50">
        {/* Soft Ambient Gaussian Blur Orbs to blend section transitions */}
        <div className="absolute top-0 left-1/4 -translate-y-1/2 w-[550px] h-[350px] bg-[#0071e3]/8 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 translate-y-1/2 w-[550px] h-[350px] bg-indigo-500/5 rounded-full blur-[140px] pointer-events-none" />
        <ScrollReveal className="w-full max-w-[1020px] lg:max-w-[1120px] xl:max-w-[1240px] 2xl:max-w-[1360px] mx-auto px-[22px] relative z-10">
          <ProfessionalSummary />
        </ScrollReveal>
      </section>

      {/* SECTION 2: TECHNICAL SKILLS TOOLBELT */}
      <section className="w-full bg-transparent py-[80px] md:py-[120px] relative overflow-hidden border-t border-zinc-900/50">
        {/* Soft Ambient Gaussian Blur Orbs to mix contrasts */}
        <div className="absolute top-1/2 right-1/3 -translate-y-1/2 w-[500px] h-[400px] bg-blue-500/4 rounded-full blur-[130px] pointer-events-none" />
        <ScrollReveal className="w-full max-w-[1020px] lg:max-w-[1120px] xl:max-w-[1240px] 2xl:max-w-[1360px] mx-auto px-[22px] relative z-10">
          <TechnicalSkills />
        </ScrollReveal>
      </section>

      {/* SECTION 3: UBUY ACHIEVEMENTS & CONTRIBUTIONS ROI CALCULATOR */}
      <section className="w-full bg-transparent py-[80px] md:py-[120px] relative overflow-hidden border-t border-zinc-900/50">
        {/* Soft Ambient Gaussian Blur Orbs to mix contrasts */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-sky-500/8 rounded-full blur-[150px] pointer-events-none" />
        <ScrollReveal className="w-full max-w-[1020px] lg:max-w-[1120px] xl:max-w-[1240px] 2xl:max-w-[1360px] mx-auto px-[22px] relative z-10">
          <UbuyContributions />
        </ScrollReveal>
      </section>

      {/* SECTION 4: PROJECT EVIDENCE SHOWCASE (BUG REPORTS & REPOS) */}
      <section className="w-full bg-transparent py-[80px] md:py-[120px] relative overflow-hidden border-t border-zinc-900/50">
        {/* Soft Ambient Gaussian Blur Orbs to mix contrasts */}
        <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-indigo-500/4 rounded-full blur-[140px] pointer-events-none" />
        <ScrollReveal className="w-full max-w-[1020px] lg:max-w-[1120px] xl:max-w-[1240px] 2xl:max-w-[1360px] mx-auto px-[22px] relative z-10">
          <ProjectShowcase />
        </ScrollReveal>
      </section>

      {/* SECTION 5: EDUCATION & CAMPUS TIMELINE */}
      <section className="w-full bg-transparent py-[80px] md:py-[120px] relative overflow-hidden border-t border-zinc-900/50">
        {/* Soft Ambient Gaussian Blur Orbs to mix contrasts */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[550px] h-[350px] bg-indigo-500/5 rounded-full blur-[140px] pointer-events-none" />
        <ScrollReveal className="w-full max-w-[1020px] lg:max-w-[1120px] xl:max-w-[1240px] 2xl:max-w-[1360px] mx-auto px-[22px] relative z-10">
          <EducationSection />
        </ScrollReveal>
      </section>

      {/* SECTION 5: LIVE SANDBOX PLAYGROUND */}
      <section className="w-full bg-transparent py-[80px] md:py-[120px] relative overflow-hidden border-t border-zinc-900/50">
        {/* Soft Ambient Gaussian Blur Orbs to mix contrasts */}
        <div className="absolute bottom-0 left-1/3 w-[550px] h-[350px] bg-indigo-500/8 rounded-full blur-[140px] pointer-events-none" />
        <ScrollReveal className="w-full max-w-[1020px] lg:max-w-[1120px] xl:max-w-[1240px] 2xl:max-w-[1360px] mx-auto px-[22px] relative z-10">
          <LiveDemoSandbox />
        </ScrollReveal>
      </section>

      {/* SECTION 6: AI-POWERED TEST CODE GENERATOR */}
      <section className="w-full bg-transparent py-[80px] md:py-[120px] relative overflow-hidden border-t border-zinc-900/50">
        {/* Soft Ambient Gaussian Blur Orbs to mix contrasts */}
        <div className="absolute bottom-0 right-1/3 w-[550px] h-[400px] bg-sky-500/4 rounded-full blur-[140px] pointer-events-none" />
        <ScrollReveal className="w-full max-w-[1020px] lg:max-w-[1120px] xl:max-w-[1240px] 2xl:max-w-[1360px] mx-auto px-[22px] relative z-10">
          <AiQaAssistant />
        </ScrollReveal>
      </section>

      {/* SECTION 7: SECURE SECRETS AND CONTACT HUB */}
      <section className="w-full bg-transparent py-[80px] md:py-[120px] relative overflow-hidden border-t border-zinc-900/50">
        {/* Soft Ambient Gaussian Blur Orbs to mix contrasts */}
        <div className="absolute bottom-0 left-[20%] w-[550px] h-[350px] bg-[#0071e3]/6 rounded-full blur-[145px] pointer-events-none" />
        <ScrollReveal className="w-full max-w-[1020px] lg:max-w-[1120px] xl:max-w-[1240px] 2xl:max-w-[1360px] mx-auto px-[22px] relative z-10">
          <ContactSection />
        </ScrollReveal>
      </section>

      {/* INTERACTIVE COMPREHENSIVE FOOTER */}
      <footer className="w-full bg-transparent py-12 border-t border-white/10 text-xs text-slate-500">
        <div className="max-w-[1020px] lg:max-w-[1120px] xl:max-w-[1240px] 2xl:max-w-[1360px] mx-auto px-[22px] flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col gap-1 text-left">
            <span className="font-mono text-slate-400">© 2026 Dipendu Mukherjee. Ubuy QA Integration Verified.</span>
            <span>Ubuy QA Software Tester Portfolio Case Study</span>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <a
              href="https://github.com/Dipendu27"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-300 transition flex items-center gap-1"
            >
              <Github className="w-4 h-4" />
              <span>GitHub</span>
            </a>
            <a
              href="https://www.linkedin.com/in/dipendu-mukherjee-4199a8226"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-300 transition flex items-center gap-1"
            >
              <Linkedin className="w-4 h-4" />
              <span>LinkedIn</span>
            </a>
            <a
              href={mailTo}
              className="hover:text-slate-300 transition flex items-center gap-1"
            >
              <Mail className="w-4 h-4" />
              <span>dipendu.mukherjee.27@gmail.com</span>
            </a>
          </div>
        </div>
      </footer>

      {/* CV / Resume Interactive Overlay Modal */}
      <CVModal isOpen={isCvModalOpen} onClose={() => setIsCvModalOpen(false)} />
    </div>
  );
}

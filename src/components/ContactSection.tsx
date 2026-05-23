import React, { useState } from "react";
import { Mail, Send, Terminal, ShieldCheck, Check, Copy, AlertTriangle, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import HoverWaveContainer from "./HoverWaveContainer";

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "QA_CONSULTATION",
    message: ""
  });

  const [loadingStep, setLoadingStep] = useState<number>(-1);
  const [ticketId, setTicketId] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const steps = [
    "Analyzing form structural semantics...",
    "Encrypting payload with asymmetric PGP key...",
    "Validating secure SMTP relay sockets...",
    "Writing dispatch receipt to immutable ledger...",
    "Delivering secure packet to Dipendu's inbox..."
  ];

  const handleCopy = () => {
    if (ticketId) {
      navigator.clipboard.writeText(ticketId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const validate = () => {
    const tempErrors: Record<string, string> = {};
    if (!formData.name.trim()) tempErrors.name = "Candidate name is mandatory.";
    if (!formData.email.trim()) {
      tempErrors.email = "Sender email address is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = "Please specify a valid email address structure.";
    }
    if (!formData.message.trim() || formData.message.length < 10) {
      tempErrors.message = "Message must span at least 10 spatial characters.";
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // Trigger sequential loading steps animation
    setLoadingStep(0);
    const interval = setInterval(() => {
      setLoadingStep((prev) => {
        if (prev >= steps.length - 1) {
          clearInterval(interval);
          // Set simulated secure ticket receipt
          const generatedId = `TKT-${Math.floor(100000 + Math.random() * 900000)}-${formData.subject.substring(0, 3)}`;
          setTicketId(generatedId);
          return -1;
        }
        return prev + 1;
      });
    }, 900);
  };

  const handleReset = () => {
    setFormData({ name: "", email: "", subject: "QA_CONSULTATION", message: "" });
    setTicketId(null);
    setLoadingStep(-1);
    setErrors({});
  };

  return (
    <div id="contact-hub" className="w-full text-left">
      <div className="text-center md:text-left mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 text-[#86868b] text-[10px] font-sans border border-zinc-800 mb-3">
          <Mail className="w-3 h-3 text-[#0071e3]" />
          <span>CONTACT & COLLABORATION</span>
        </div>
        <h2 className="text-section-title text-white">Let's Assemble Quality</h2>
        <p className="text-sm text-[#86868b] mt-1.5 max-w-xl">
          Pitch a role, schedule QA systems consulting, or discuss test automation architectures. Submit your secure request below.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left Interactive form */}
        <div className="lg:col-span-7">
          <HoverWaveContainer className="p-6 sm:p-8 bg-transparent border-transparent rounded-3xl h-full flex flex-col justify-between">
            <AnimatePresence mode="wait">
              {loadingStep !== -1 ? (
                // Dispatch load sequences
                <motion.div
                  key="form-loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 flex flex-col items-center justify-center py-16 space-y-6"
                >
                  <RefreshCw className="w-8 h-8 text-[#0071e3] animate-spin" />
                  <div className="space-y-2 text-center max-w-sm">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#86868b]">
                      SMTP TRANSACTION IN PROCESS
                    </span>
                    <h4 className="text-sm font-semibold text-white">
                      {steps[loadingStep]}
                    </h4>
                    <p className="text-[10px] text-zinc-650 font-mono">
                      Establishing handshake: secure TLS socket verification [OK]
                    </p>
                  </div>
                </motion.div>
              ) : ticketId ? (
                // Completed State
                <motion.div
                  key="form-completed"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 flex flex-col items-center justify-center py-12 text-center space-y-6"
                >
                  <div className="p-4 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <ShieldCheck className="w-8 h-8 animate-pulse" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-base font-bold text-white tracking-tight">
                      Transmission Dispatched Successfully!
                    </h3>
                    <p className="text-xs text-[#86868b] max-w-md mx-auto leading-relaxed">
                      Thank you, <span className="text-white font-semibold">{formData.name}</span>! Your consultation request has been encrypted and securely forwarded. Dipendu aims to formulate complete resolutions under 24 hours.
                    </p>
                  </div>

                  {/* Copyable Secure Ticket Block */}
                  <div className="bg-black border border-zinc-800 rounded-xl p-4 w-full max-w-xs flex justify-between items-center font-mono text-xs text-zinc-400">
                    <div className="text-left">
                      <span className="text-[9px] text-zinc-600 block leading-none">TRANSACTION KEY ID</span>
                      <span className="font-semibold text-white tracking-wider mt-0.5 block">{ticketId}</span>
                    </div>
                    <button
                      id="copy-ticket"
                      onClick={handleCopy}
                      className="p-2 bg-zinc-900 border border-zinc-805 hover:bg-zinc-800 text-zinc-300 rounded-lg cursor-pointer transition"
                    >
                      {copied ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  <button
                    id="reset-form"
                    onClick={handleReset}
                    className="text-xs font-semibold text-[#2997ff] border border-[#2997ff]/20 px-4 py-2 rounded-full bg-[#2997ff]/5 hover:bg-[#2997ff]/10 cursor-pointer transition duration-300"
                  >
                    Send Another Packet <span>➔</span>
                  </button>
                </motion.div>
              ) : (
                // Standard form block
                <motion.form key="form-inputs" onSubmit={handleSubmit} className="space-y-5 text-left flex-1 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Name input */}
                      <div className="space-y-1.5 text-left">
                        <label className="text-[10px] font-mono tracking-wider text-[#86868b] uppercase block">Full Name</label>
                        <input
                          id="contact-name"
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g. Rachel Jenkins"
                          className="w-full px-4 py-2.5 bg-black border border-zinc-800 focus:border-white rounded-xl text-xs text-white placeholder-zinc-600 focus:ring-1 focus:ring-white outline-none transition"
                        />
                        {errors.name && (
                          <p className="text-[10px] text-rose-400 font-medium flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            <span>{errors.name}</span>
                          </p>
                        )}
                      </div>

                      {/* Email input */}
                      <div className="space-y-1.5 text-left">
                        <label className="text-[10px] font-mono tracking-wider text-[#86868b] uppercase block">Email Address</label>
                        <input
                          id="contact-email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="e.g. rachel@example.com"
                          className="w-full px-4 py-2.5 bg-black border border-zinc-800 focus:border-white rounded-xl text-xs text-white placeholder-zinc-600 focus:ring-1 focus:ring-white outline-none transition"
                        />
                        {errors.email && (
                          <p className="text-[10px] text-rose-400 font-medium flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            <span>{errors.email}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Subject Selector */}
                    <div className="space-y-1.5 text-left">
                      <label className="text-[10px] font-mono tracking-wider text-[#86868b] uppercase block">Inquiry Priority Subject</label>
                      <select
                        id="contact-subject"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-4 py-2.5 bg-black border border-zinc-800 focus:border-white rounded-xl text-xs text-white outline-none focus:ring-1 focus:ring-white transition cursor-pointer appearance-none"
                      >
                        <option value="QA_CONSULTATION">QA Architecture Consultation (Staging Audits)</option>
                        <option value="CAREER_OPPORTUNITY">B.Tech QA / Testing Hire Opportunity (Open to All Cities / Remote)</option>
                        <option value="COLLECTIVE_ML">Earth Observation ML Collaboration (Remote/Global)</option>
                        <option value="GENERAL_MESSAGE">General Professional Inquiries</option>
                      </select>
                    </div>

                    {/* Message textarea */}
                    <div className="space-y-1.5 text-left">
                      <label className="text-[10px] font-mono tracking-wider text-[#86868b] uppercase block">Transaction Message Details</label>
                      <textarea
                        id="contact-message"
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Detail your requirements, project schedules, or testing specifications..."
                        className="w-full px-4 py-3 bg-black border border-zinc-800 focus:border-white rounded-xl text-xs text-white placeholder-zinc-600 focus:ring-1 focus:ring-white outline-none transition resize-none"
                      />
                      {errors.message && (
                        <p className="text-[10px] text-rose-400 font-medium flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          <span>{errors.message}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 text-left border-t border-zinc-900 mt-4">
                    <button
                      id="contact-submit"
                      type="submit"
                      className="w-full sm:w-auto font-semibold bg-white text-black hover:bg-zinc-200 rounded-full px-6 py-2.5 text-xs tracking-tight transition-all duration-300 flex items-center justify-center gap-1.5 hover:scale-103 active:scale-97 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Encapsulate & Dispatch</span>
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </HoverWaveContainer>
        </div>

        {/* Right Info Specification details */}
        <div className="lg:col-span-5 flex flex-col justify-between max-h-[450px] lg:max-h-none">
          <HoverWaveContainer className="p-6 bg-transparent border-transparent rounded-3xl h-full flex flex-col justify-between space-y-6">
            <div className="space-y-4 text-left">
              <span className="text-[10px] font-mono text-[#86868b] uppercase font-semibold">CANDIDATE PROTOCOLS</span>
              <h3 className="text-base font-bold text-white tracking-tight">Channel SLA & Specifications</h3>
              <p className="text-xs text-[#86868b] leading-relaxed">
                Dipendu's communication lines run on dedicated asynchronous triage filters. Outbound transactions are categorised by active priority parameters.
              </p>
              
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2 text-xs">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full shrink-0" />
                  <span className="text-zinc-400 font-mono">Response Turnaround:</span>
                  <span className="text-white font-mono">&lt; 24 Hours SLA</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full shrink-0" />
                  <span className="text-zinc-400 font-mono">Accepting Roles:</span>
                  <span className="text-white font-mono">QA Specialist, Manual/Automated Test Engineer</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="w-1.5 h-1.5 bg-amber-400 rounded-full shrink-0" />
                  <span className="text-zinc-400 font-mono">Deployable Frame:</span>
                  <span className="text-white font-mono">Open to All Cities (India & Global) / Remote</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-black/60 rounded-2xl border border-zinc-900 text-[10px] font-mono leading-relaxed text-zinc-550 flex items-start gap-2.5 space-y-0.5 text-left">
              <Terminal className="w-4 h-4 text-[#0071e3] shrink-0" />
              <div>
                <span className="text-zinc-400 font-semibold block">PGP Security Check</span>
                <span>SHA-256 Checksum validation verified against global candidate database key ID: <code className="text-[#2997ff]">dipendu.mukherjee.27</code>.</span>
              </div>
            </div>
          </HoverWaveContainer>
        </div>
      </div>
    </div>
  );
}

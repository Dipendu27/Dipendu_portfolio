import React, { useState } from "react";
import { Sparkles, Play, Code, CheckSquare, Terminal, HelpCircle, Loader2, RefreshCw, Copy, Check, ChevronRight, AlertCircle } from "lucide-react";
import { motion } from "motion/react";

export default function AiQaAssistant() {
  const [featureName, setFeatureName] = useState<string>("Checkout with promo code");
  const [techStack, setTechStack] = useState<string>("Playwright (TypeScript)");
  const [testType, setTestType] = useState<string>("End-to-End Functional UI");
  const [extraDetails, setExtraDetails] = useState<string>("Use Page Object Model (POM) pattern, include negative edge cases.");
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [aiResult, setAiResult] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // Template buttons
  const presets = [
    {
      label: "Cart Flow",
      feature: "Shopping Cart additions and updates",
      details: "Stress verify quantity bounds, ensure zero negatives are allowed."
    },
    {
      label: "API Contracts",
      feature: "HTTP /api/products contracts verification",
      details: "Inspect API payload schema validation on response keys."
    },
    {
      label: "Login Negative Bounds",
      feature: "Secure user authentication portals",
      details: "Test rate limit triggers, trace output validation messages."
    }
  ];

  // Manual trigger for presets
  const applyPreset = (item: typeof presets[0]) => {
    setFeatureName(item.feature);
    setExtraDetails(item.details);
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    setAiResult("");
    
    try {
      const response = await fetch("/api/qa-assistant/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          featureName,
          techStack,
          testType,
          extraDetails
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Server processing failed.");
      }

      setAiResult(data.result);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Failed to communicate with QA Assistant backend server. Please verify your GEMINI_API_KEY environment configuration.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyResult = () => {
    if (!aiResult) return;
    navigator.clipboard.writeText(aiResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper custom formatter for Gemini results to render headers and code blocks beautifully
  const renderFormattedResult = (rawText: string) => {
    if (!rawText) return null;
    
    // Splitting by lines to format code blocks and bold items
    const lines = rawText.split("\n");
    let inCodeBlock = false;
    let codeContent: string[] = [];
    let renderingElements: React.ReactNode[] = [];
    let codeLanguage = "";

    lines.forEach((line, idx) => {
      // Code blocks toggle
      if (line.trim().startsWith("```")) {
        if (inCodeBlock) {
          // Close Codeblock
          inCodeBlock = false;
          const blockCodeJoined = codeContent.join("\n");
          const blockLang = codeLanguage;
          renderingElements.push(
            <div key={`code-${idx}`} className="my-4 border border-slate-800 rounded-xl overflow-hidden bg-slate-950 font-mono text-[11px] sm:text-xs">
              <div className="bg-slate-900 px-4 py-2 border-b border-slate-800/80 flex justify-between items-center text-slate-400">
                <span>{blockLang.toUpperCase() || "CODE SNIPPET"}</span>
                <button
                  onClick={() => navigator.clipboard.writeText(blockCodeJoined)}
                  className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[10px] text-slate-300 hover:text-white"
                >
                  copy
                </button>
              </div>
              <pre className="p-4 overflow-x-auto text-slate-200">
                <code>{blockCodeJoined}</code>
              </pre>
            </div>
          );
          codeContent = [];
        } else {
          // Open Codeblock
          inCodeBlock = true;
          codeLanguage = line.replace("```", "").trim() || "typescript";
        }
        return;
      }

      if (inCodeBlock) {
        codeContent.push(line);
        return;
      }

      // Check header types
      if (line.startsWith("### ")) {
        renderingElements.push(
          <h5 key={idx} className="text-sm font-semibold text-indigo-400 mt-4 mb-2 font-mono flex items-center gap-1.5">
            <ChevronRight className="w-4 h-4 shrink-0 text-indigo-500" />
            {line.substring(4)}
          </h5>
        );
      } else if (line.startsWith("## ")) {
        renderingElements.push(
          <h4 key={idx} className="text-base font-bold text-white mt-5 mb-3 border-b border-slate-800 pb-1 font-sans">
            {line.substring(3)}
          </h4>
        );
      } else if (line.startsWith("# ")) {
        renderingElements.push(
          <h3 key={idx} className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 mt-6 mb-4">
            {line.substring(2)}
          </h3>
        );
      } else if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
        renderingElements.push(
          <div key={idx} className="flex gap-2 text-xs text-slate-300 my-1 pl-2">
            <span className="text-indigo-400 mt-0.5 shrink-0">•</span>
            <p className="leading-relaxed">
              {line.trim().substring(2).split("**").map((part, pIdx) => {
                if (pIdx % 2 === 1) return <strong key={pIdx} className="text-white font-semibold">{part}</strong>;
                return part;
              })}
            </p>
          </div>
        );
      } else if (line.trim() !== "") {
        // Plain text check bold delimiters '**'
        renderingElements.push(
          <p key={idx} className="text-xs text-slate-300 leading-relaxed my-2">
            {line.split("**").map((part, pIdx) => {
              if (pIdx % 2 === 1) return <strong key={pIdx} className="text-white font-semibold">{part}</strong>;
              return part;
            })}
          </p>
        );
      } else {
        renderingElements.push(<div key={idx} className="h-2" />);
      }
    });

    return <div className="space-y-1">{renderingElements}</div>;
  };

  return (
    <div id="ai-qa-assistant" className="w-full">
      {/* Section Header */}
      <div className="mb-10 text-left">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 text-xs font-mono border border-indigo-500/20 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
          <span>GEMINI 3.5 FLASH QA ASSISTANT</span>
        </div>
        <h2 className="text-section-title text-white">On-Demand Test Automation Generator</h2>
        <p className="text-sm text-slate-400 mt-1.5 leading-relaxed">
          Interact with a custom Gemini intelligence framework tailored around quality pipelines to automatically construct mock specifications or testing manuals.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left Inputs parameters column (Col-5) */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-4 flex-1 flex flex-col justify-between">
            
            {/* Quick Presets row */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">QUICK LOAD QA TEMPLATES</span>
              <div className="flex flex-wrap gap-2">
                {presets.map((pr, idx) => (
                  <motion.button
                    key={idx}
                    id={`preset-btn-${idx}`}
                    onClick={() => applyPreset(pr)}
                    whileHover={{ scale: 1.05, y: -1 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-2.5 py-1 text-[10px] font-mono rounded bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 cursor-pointer transition"
                  >
                    {pr.label}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Feature form input */}
            <div className="space-y-2">
              <label htmlFor="feature-name-input" className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Target Feature Description</label>
              <input
                id="feature-name-input"
                type="text"
                placeholder="Product checkout or API inventory call"
                value={featureName}
                onChange={(e) => setFeatureName(e.target.value)}
                className="w-full bg-slate-950 text-white font-mono text-xs rounded-xl border border-slate-800 p-3 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Technology frame */}
              <div className="space-y-2">
                <label htmlFor="tech-stack-selector" className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Tech Framework</label>
                <select
                  id="tech-stack-selector"
                  value={techStack}
                  onChange={(e) => setTechStack(e.target.value)}
                  className="w-full bg-slate-950 text-white font-mono text-xs rounded-xl border border-slate-800 p-2.5 focus:outline-none focus:border-indigo-500"
                >
                  <option>Playwright (TypeScript)</option>
                  <option>Cypress (JavaScript)</option>
                  <option>Selenium WebDriver (Java)</option>
                  <option>RestAssured API (Java)</option>
                  <option>K6 Loading (JS)</option>
                </select>
              </div>

              {/* Testing type */}
              <div className="space-y-2">
                <label id="lbl-test-type" className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Suite Methodology</label>
                <select
                  id="test-type-selector"
                  value={testType}
                  onChange={(e) => setTestType(e.target.value)}
                  className="w-full bg-slate-950 text-white font-mono text-xs rounded-xl border border-slate-800 p-2.5 focus:outline-none focus:border-indigo-500"
                >
                  <option>End-to-End Functional UI</option>
                  <option>REST API Contract</option>
                  <option>Boundary & Manual Plan</option>
                  <option>Smoke Performance Stress</option>
                </select>
              </div>
            </div>

            {/* Context parameters */}
            <div className="space-y-2 font-mono">
              <label htmlFor="extra-details-input" className="text-[10px] text-slate-400 uppercase tracking-wider block">Additional Directives</label>
              <textarea
                id="extra-details-input"
                rows={3}
                placeholder="e.g. inject cookies session auth, page validations"
                value={extraDetails}
                onChange={(e) => setExtraDetails(e.target.value)}
                className="w-full bg-slate-950 text-white text-xs rounded-xl border border-slate-800 p-3 focus:outline-none focus:border-indigo-500 resize-none"
              />
            </div>

            {/* Run CTA Button */}
            <button
              id="generate-ai-script-btn"
              disabled={isLoading || !featureName}
              onClick={handleGenerate}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[#0071e3] hover:bg-[#147ce5] disabled:opacity-50 text-white font-sans text-xs font-semibold tracking-tight transition cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Synthesizing Test Code...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Generate Test Script Suite</span>
                </>
              )}
            </button>

          </div>
        </div>

        {/* Right Outputs rendering board (Col-7) */}
        <div id="ai-assistant-output-board" className="lg:col-span-7 bg-slate-900/40 border border-slate-800 rounded-2xl flex flex-col justify-between overflow-hidden min-h-[520px] h-full backdrop-blur-sm">
          
          {/* Output Header banner */}
          <div className="bg-slate-950 p-4 border-b border-slate-800 flex justify-between items-center text-xs">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-indigo-400" />
              <span className="font-mono text-slate-300 font-semibold">Gemini Live Output Receiver</span>
            </div>
            
            {aiResult && (
              <button
                id="copy-ai-result-btn"
                onClick={handleCopyResult}
                className="flex items-center gap-1.5 px-3 py-1 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-300 hover:text-white cursor-pointer transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied" : "Copy Suite"}</span>
              </button>
            )}
          </div>

          {/* Core content rendering block */}
          <div className="p-6 flex-1 max-h-[640px] overflow-y-auto">
            {isLoading ? (
              <div className="h-full flex flex-col items-center justify-center space-y-3 py-16 text-center">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
                <p className="text-xs font-mono text-slate-400">Communicating with Gemini 3.5 Flash server node...</p>
                <div className="px-3.5 py-1.5 rounded-lg bg-slate-950 border border-slate-900 font-mono text-[9px] text-slate-500">
                  POST /api/qa-assistant/generate
                </div>
              </div>
            ) : errorMsg ? (
              <div className="p-4 rounded-xl bg-rose-500/5 border border-rose-500/10 text-rose-300 text-xs flex gap-3 my-4">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                <div className="space-y-1.5">
                  <span className="font-semibold block">QA Server Connection Failed</span>
                  <p className="leading-relaxed leading-normal">{errorMsg}</p>
                </div>
              </div>
            ) : aiResult ? (
              <div className="prose prose-invert max-w-none text-left">
                {renderFormattedResult(aiResult)}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center space-y-4 py-20 text-center text-slate-500 select-none">
                <div className="p-4 rounded-full bg-slate-900/40 border border-slate-800 text-slate-400">
                  <Code className="w-7 h-7" />
                </div>
                <div className="space-y-1 text-center">
                  <h4 className="text-sm font-semibold text-slate-400">Terminal Output Empty</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                    Select a preset or customize the feature parameters on the left, then click Generate to create custom automation codes.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Bottom telemetry indicators */}
          <div className="p-3 bg-slate-950 border-t border-slate-800/80 text-[10px] text-slate-500 font-mono flex justify-between items-center px-4">
            <span>Model node: gemini-3.5-flash</span>
            <span>Ubuy QA Auto-architect Integration v1.2</span>
          </div>

        </div>
      </div>
    </div>
  );
}

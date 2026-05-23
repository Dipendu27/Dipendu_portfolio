import React, { useState, useEffect } from "react";
import { Play, RotateCcw, Monitor, Terminal, BadgeCheck, AlertCircle, ShoppingCart, Tag, CreditCard, Sparkles, Copy, Check } from "lucide-react";
import { motion } from "motion/react";
import HoverWaveContainer from "./HoverWaveContainer";
import HoverZoom from "./HoverZoom";

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
}

export default function LiveDemoSandbox() {
  // Sandbox Items
  const products: Product[] = [
    { id: "h100", name: "Premium Noise-Cancelling Headphones", price: 150, category: "Electronics" },
    { id: "m200", name: "Wireless Ergonomic Mouse", price: 50, category: "Accessories" },
    { id: "w300", name: "Aesthetic Smart Fitness Watch", price: 100, category: "Electronics" }
  ];

  // Cart and coupon state
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
  const [couponCode, setCouponCode] = useState<string>("");
  const [appliedPromo, setAppliedPromo] = useState<string>("");
  const [discountMultiplier, setDiscountMultiplier] = useState<number>(0);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Automation Simulator State Machine
  const [activeSuite, setActiveSuite] = useState<"positive-checkout" | "negative-empty-card" | null>(null);
  const [simulationStep, setSimulationStep] = useState<number>(-1);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    "[SYSTEM] Ubuy QA Sandbox virtual daemon initialized on port 8080...",
    "[SYSTEM] Ready for manual order routing verification & automated suite runs.",
    "[SYSTEM] Waiting for trigger event..."
  ]);
  const [suiteStatus, setSuiteStatus] = useState<"IDLE" | "RUNNING" | "PASSED" | "FAILED">("IDLE");
  const [locatorHighlight, setLocatorHighlight] = useState<string | null>(null);
  const [logsCopied, setLogsCopied] = useState<boolean>(false);

  const copyLogsToClipboard = () => {
    const textToCopy = terminalLogs.join("\n");
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        setLogsCopied(true);
        setTimeout(() => setLogsCopied(false), 2000);
        showToast("Session logs copied to clipboard!", "success");
      })
      .catch((err) => {
        console.error("Failed to copy logs: ", err);
        showToast("Failed to copy logs.", "error");
      });
  };

  // Clear toast helper
  const showToast = (text: string, type: "success" | "error") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Add Item manual trigger
  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { product, quantity: 1 }];
    });
    showToast(`Added ${product.name} to cart. Locator target verified!`, "success");
    setTerminalLogs((prev) => [
      ...prev,
      `[INFO] [MANUAL] Locating targets: locator('button#btn-add-${product.id}')`,
      `[SUCCESS] [MANUAL] Basket state synced: successfully added ${product.name} to order list.`
    ]);
  };

  // Clear cart
  const resetSandbox = () => {
    setCart([]);
    setCouponCode("");
    setAppliedPromo("");
    setDiscountMultiplier(0);
    setSimulationStep(-1);
    setActiveSuite(null);
    setTerminalLogs([
      "[SYSTEM] Ubuy QA Sandbox virtual daemon initialized on port 8080...",
      "[SYSTEM] Ready for manual order routing verification & automated suite runs.",
      "[SYSTEM] Waiting for trigger event..."
    ]);
    setSuiteStatus("IDLE");
    setLocatorHighlight(null);
  };

  // Calculate totals
  const subtotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const discountTotal = subtotal * discountMultiplier;
  const finalPrice = Math.max(0, subtotal - discountTotal);

  // Manual Coupon Trigger Method
  const applyCouponManual = (codeToApply: string) => {
    if (codeToApply.trim().toUpperCase() === "UBUYFAST40") {
      setAppliedPromo("UBUYFAST40");
      setDiscountMultiplier(0.40);
      showToast("40% discount voucher applied successfully!", "success");
      setTerminalLogs((prev) => [
        ...prev,
        `[INFO] [MANUAL] Validating voucher checksum on locator('input#input-promo')`,
        `[SUCCESS] [MANUAL] Hex coupon 'UBUYFAST40' matches criteria. Subtotal adjusted with -40% multipliers.`
      ]);
    } else {
      showToast("Verification Error: Invalid voucher token provided.", "error");
      setTerminalLogs((prev) => [
        ...prev,
        `[ACTION] [MANUAL] Warning: Regex check rejected invalid coupon value '${codeToApply}'.`
      ]);
    }
  };

  // ----------------------------------------------------
  // AUTOMATION RUNNER SIMULATION MACHINE STEPS
  // ----------------------------------------------------
  const positiveCheckoutSteps = [
    {
      log: "[INFO] Initializing Playwright webkit environment context...",
      action: () => {
        setSuiteStatus("RUNNING");
        setTerminalLogs(["[INFO] Initializing Playwright browser driver context... (Webkit Engine)"]);
      }
    },
    {
      log: "[SUCCESS] Context activated. Navigating to sandbox endpoint: `/qa-sandbox`...",
      action: () => {}
    },
    {
      log: "[INFO] Locating product item card locator target: `locator('button#btn-add-h100')`...",
      action: () => {
        setLocatorHighlight("btn-add-h100");
      }
    },
    {
      log: "[ACTION] Simulating mouse click on: `locator('button#btn-add-h100')`...",
      action: () => {
        // Automatically add headphones to cart
        const headphones = products[0];
        setCart([{ product: headphones, quantity: 1 }]);
        setLocatorHighlight(null);
      }
    },
    {
      log: "[ASSERT] Verifying basket inventory index equals 1... [SUCCESS] Obtained expected 1.",
      action: () => {}
    },
    {
      log: "[INFO] Traversing input voucher locator container: `locator('input#input-promo')`...",
      action: () => {
        setLocatorHighlight("input-promo");
      }
    },
    {
      log: "[ACTION] Typing coupon voucher code: 'UBUYFAST40'...",
      action: () => {
        setCouponCode("UBUYFAST40");
        setLocatorHighlight(null);
      }
    },
    {
      log: "[INFO] Triggering coupon submit handle: `locator('button#btn-apply-promo')`...",
      action: () => {
        setLocatorHighlight("btn-apply-promo");
      }
    },
    {
      log: "[ACTION] Simulating click on: `locator('button#btn-apply-promo')`...",
      action: () => {
        setAppliedPromo("UBUYFAST40");
        setDiscountMultiplier(0.40);
        setLocatorHighlight(null);
      }
    },
    {
      log: "[ASSERT] Verifying subtotal discount calculations... Expected $150 minus 40% = $90 final price.",
      action: () => {}
    },
    {
      log: "[SUCCESS] Assert total validated correctly. Final basket value matches expected: $90.00 base.",
      action: () => {}
    },
    {
      log: "[PASS] testSuite('positive_cart_checkout_automation') completed with zero fails.",
      action: () => {
        setSuiteStatus("PASSED");
      }
    }
  ];

  const negativeEmptyCardSteps = [
    {
      log: "[INFO] Initializing Selenium Grid node context on port: 4444...",
      action: () => {
        setSuiteStatus("RUNNING");
        setTerminalLogs(["[INFO] Booting remote Selenium Hub worker context... [OK]"]);
      }
    },
    {
      log: "[SUCCESS] Port connected. Resolving URL target: `/checkout`...",
      action: () => {}
    },
    {
      log: "[INFO] Checking checkout submit element locator: `locator('button#btn-checkout-submit')`...",
      action: () => {
        setLocatorHighlight("btn-checkout-submit");
      }
    },
    {
      log: "[ACTION] Attempting immediate click validation on payment container without adding products...",
      action: () => {
        setLocatorHighlight(null);
      }
    },
    {
      log: "[ASSERT] Verifying error handling prompts... Expected validation toast trigger stating 'No elements loaded'.",
      action: () => {}
    },
    {
      log: "[SUCCESS] Assert passed! Toast container visible. Located UI rejection bounds as expected.",
      action: () => {}
    },
    {
      log: "[PASS] testSuite('negative_empty_cart_guardrail') completed. Output traces saved to artifacts.",
      action: () => {
        setSuiteStatus("PASSED");
      }
    }
  ];

  // Run suite triggering
  const triggerSuite = (suiteType: "positive-checkout" | "negative-empty-card") => {
    resetSandbox();
    setActiveSuite(suiteType);
    setSimulationStep(0);
  };

  // Step sequencer effect
  useEffect(() => {
    if (activeSuite === null || simulationStep === -1) return;

    const pipeline = activeSuite === "positive-checkout" ? positiveCheckoutSteps : negativeEmptyCardSteps;

    if (simulationStep < pipeline.length) {
      const timer = setTimeout(() => {
        const currentStep = pipeline[simulationStep];
        
        // Execute state actions
        currentStep.action();
        
        // Append logs
        setTerminalLogs((prev) => [...prev, currentStep.log]);
        
        // Go next
        setSimulationStep((s) => s + 1);
      }, 700); // Dynamic latency to simulate real terminal execution delay

      return () => clearTimeout(timer);
    }
  }, [activeSuite, simulationStep]);

  return (
    <div id="live-sandbox-demo" className="w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 text-[#86868b] text-[10px] font-sans border border-zinc-800 mb-3">
            <Monitor className="w-3 h-3 text-[#0071e3]" />
            <span>LIVE INTERACTIVE TEST APPLICATION</span>
          </div>
          <h2 className="text-section-title text-white text-left">E-Commerce QA Sandbox & Simulator</h2>
          <p className="text-sm text-[#86868b] mt-1.5 text-left">
            Test the sandbox manually, or trigger the live simulated Selenium / Playwright test automation runs.
          </p>
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            id="run-playwright-positive-btn"
            disabled={suiteStatus === "RUNNING"}
            onClick={() => triggerSuite("positive-checkout")}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#0071e3] hover:bg-[#147ce5] disabled:opacity-50 text-white text-xs font-semibold tracking-tight transition cursor-pointer"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Run Playwright Suite</span>
          </button>
          
          <button
            id="run-selenium-negative-btn"
            disabled={suiteStatus === "RUNNING"}
            onClick={() => triggerSuite("negative-empty-card")}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 text-white border border-zinc-800 text-xs font-semibold tracking-tight transition cursor-pointer"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Run Selenium Guard</span>
          </button>

          <button
            id="reset-sandbox-btn"
            onClick={resetSandbox}
            className="p-2 rounded-full bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 hover:text-white transition cursor-pointer"
            title="Reset Sandbox Application"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Ubuy QA E-Commerce Sandbox Page Frame (Col-7) */}
        <HoverWaveContainer className="lg:col-span-7 bg-transparent border-transparent flex flex-col justify-between">
          
          {/* Mock Browser Title bar */}
          <div className="bg-slate-950 p-3.5 border-b border-slate-800 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/40" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/40" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/40" />
              </div>
              <div className="px-3 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-400 select-all tracking-wide">
                https://ubuy.qa.sandbox/checkout
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-slate-500 font-mono">TARGET APPLET</span>
            </div>
          </div>

          {/* Sandbox content area */}
          <div className="p-6 space-y-6 relative flex-1 min-h-[350px]">
            {/* Locator Tag highlight overlay overlay */}
            {locatorHighlight && (
              <div className="absolute inset-0 bg-indigo-500/10 backdrop-blur-[1px] z-20 flex items-center justify-center p-4 transition-all animate-pulse">
                <div className="px-3.5 py-2 rounded-xl border border-indigo-400 bg-slate-950/90 text-indigo-300 font-mono text-[10px] shadow-2xl flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
                  <span>PLAYWRIGHT TARGET: <strong className="text-white">#{locatorHighlight}</strong></span>
                </div>
              </div>
            )}

            {/* Simulated Live Toast notifications */}
            {toastMessage && (
              <div className="absolute top-4 right-4 z-30 shadow-2xl animate-bounce">
                <div className={`px-4 py-2 rounded-xl border text-xs flex items-center gap-2 ${
                  toastMessage.type === "success" 
                    ? "bg-slate-950/95 border-emerald-500/30 text-emerald-300"
                    : "bg-slate-950/95 border-rose-500/30 text-rose-300"
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${toastMessage.type === "success" ? "bg-emerald-400" : "bg-rose-400"}`} />
                  {toastMessage.text}
                </div>
              </div>
            )}

            {/* Product catalog grid */}
            <div className="space-y-3">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">PRODUCTS CATALOG (PLAYGROUND TARGETS)</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                {products.map((p) => (
                  <HoverZoom
                    key={p.id}
                    className="w-full flex"
                    glowColor="rgba(99, 102, 241, 0.15)"
                  >
                    <div className="p-3.5 rounded-xl border border-slate-800/80 bg-slate-950/30 hover:bg-slate-950/60 transition flex flex-col justify-between w-full h-full text-left">
                      <div>
                        <span className="text-[9px] font-mono text-slate-500">{p.category}</span>
                        <h4 className="text-xs font-semibold text-white mt-1 line-clamp-2">
                          {p.name}
                        </h4>
                      </div>
                      <div className="mt-4 flex justify-between items-center">
                        <span className="text-xs font-mono font-bold text-slate-300">${p.price}</span>
                        <button
                          id={`btn-add-${p.id}`}
                          onClick={() => addToCart(p)}
                          className={`text-[10px] font-mono font-bold px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-indigo-400 hover:text-indigo-300 border border-slate-700/60 cursor-pointer transition ${
                            locatorHighlight === `btn-add-${p.id}` ? "ring-2 ring-indigo-400 scale-105" : ""
                          }`}
                        >
                          + add
                        </button>
                      </div>
                    </div>
                  </HoverZoom>
                ))}
              </div>
            </div>

            {/* Shopping Cart breakdown and coupons */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 pt-4 border-t border-slate-800/60">
              
              {/* Left inner checkout: Cart items lists */}
              <div className="sm:col-span-7 space-y-3">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">SHOPPING BASKET</span>
                {cart.length === 0 ? (
                  <div className="p-6 text-center border border-dashed border-slate-800 bg-slate-950/10 rounded-xl text-slate-500 text-xs">
                    Cart is currently empty. Try adding an item above!
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
                    {cart.map((item, idx) => (
                      <div
                        key={idx}
                        className="py-2 px-3 border border-slate-800/50 bg-slate-950/20 rounded-lg flex justify-between items-center text-xs"
                      >
                        <div className="truncate pr-2">
                          <span className="text-[10px] font-mono text-indigo-400 font-bold mr-1">{item.product.id}</span>
                          <span className="text-slate-300 font-medium truncate">{item.product.name}</span>
                        </div>
                        <span className="font-mono text-slate-400 bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded text-[10px]">
                          x{item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right inner checkout: coupon values calculation */}
              <div className="sm:col-span-5 bg-slate-950/40 border border-slate-800 p-4 rounded-xl flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex gap-1.5 flex-1 select-all">
                    <input
                      id="input-promo"
                      type="text"
                      placeholder="ENTER PROMO CODE (e.g. UBUYFAST40)"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className={`flex-1 min-w-0 bg-slate-900 text-white font-mono text-[10px] rounded border border-slate-800 p-1.5 focus:outline-none focus:border-indigo-500 ${
                        locatorHighlight === "input-promo" ? "ring-2 ring-indigo-400" : ""
                      }`}
                    />
                    <button
                      id="btn-apply-promo"
                      onClick={() => applyCouponManual(couponCode)}
                      className={`px-2 px-3 bg-slate-800 hover:bg-slate-700 text-[10px] font-mono font-bold text-slate-300 rounded border border-slate-700 cursor-pointer transition ${
                        locatorHighlight === "btn-apply-promo" ? "ring-2 ring-indigo-400" : ""
                      }`}
                    >
                      Verify
                    </button>
                  </div>

                  {appliedPromo && (
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[9px] font-mono">
                      <Tag className="w-3 h-3 text-emerald-400" />
                      <span>Applied Promo: <strong>40% OFF</strong> ({appliedPromo})</span>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-800/80 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Subtotal:</span>
                    <span className="font-mono">${subtotal}</span>
                  </div>
                  {discountMultiplier > 0 && (
                    <div className="flex justify-between text-emerald-400">
                      <span>Promo Discount:</span>
                      <span className="font-mono">-${discountTotal}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-white font-bold font-mono text-sm pt-1 border-t border-slate-800/50">
                    <span>TOTAL:</span>
                    <span>${finalPrice}</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Standard checkout submit test trigger elements */}
            <div className="pt-2 flex justify-end">
              <HoverZoom scale={1.05} glowColor="rgba(16, 185, 129, 0.35)">
                <button
                  id="btn-checkout-submit"
                  onClick={() => {
                    if (cart.length === 0) {
                      showToast("Checkout rejected: Basket elements load check failed.", "error");
                      setTerminalLogs((prev) => [
                        ...prev,
                        `[ASSERT] [MANUAL] Assert checkout conditions...`,
                        `[FAIL] [MANUAL] Order rejected: basket items count check equals 0!`,
                      ]);
                      setSuiteStatus("FAILED");
                    } else {
                      showToast(`Success! Verified standard payment routing of $${finalPrice}.`, "success");
                      setTerminalLogs((prev) => [
                        ...prev,
                        `[ASSERT] [MANUAL] Assert checkout conditions...`,
                        `[SUCCESS] [MANUAL] Basket validation passed. Routing payment sum of $${finalPrice}.`,
                        `[PASS] [MANUAL] Manual order-dispatch transaction completed flawlessly!`
                      ]);
                      setSuiteStatus("PASSED");
                    }
                  }}
                  className={`w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-mono text-xs font-bold transition shadow-lg shrink-0 cursor-pointer ${
                    locatorHighlight === "btn-checkout-submit" ? "ring-2 ring-indigo-400" : ""
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Simulate Order Dispatch</span>
                </button>
              </HoverZoom>
            </div>

          </div>
        </HoverWaveContainer>

        {/* Live CLI Shell Terminal and Results Tracker (Col-5) */}
        <HoverWaveContainer className="lg:col-span-5 bg-transparent border-transparent flex flex-col justify-between">
          
          {/* Terminal Title Header */}
          <div className="bg-slate-900 border-b border-slate-800/80 px-4 py-3 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span className="text-xs font-mono text-slate-300 font-semibold">QA CLI Standard Shell</span>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Copy Logs Button */}
              <button
                id="copy-terminal-logs-btn"
                onClick={copyLogsToClipboard}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-950 border border-slate-800 hover:text-white text-slate-400 hover:border-slate-700 transition font-mono text-[9px] font-semibold cursor-pointer active:scale-95 group"
                title="Copy Terminal Logs"
              >
                {logsCopied ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">COPIED</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 text-slate-400 group-hover:text-white transition-colors" />
                    <span>COPY LOGS</span>
                  </>
                )}
              </button>

              {/* Status indicators */}
              <span className={`text-[9px] px-2 py-0.5 rounded-full font-mono font-bold border ${
                suiteStatus === "PASSED" 
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                  : suiteStatus === "RUNNING"
                  ? "bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse"
                  : "bg-slate-900 text-slate-500 border-slate-800"
              }`}>
                {suiteStatus}
              </span>
            </div>
          </div>

          {/* Terminal Lines list */}
          <div className="p-4 flex-1 font-mono text-[10px] text-slate-300 bg-[#0c1017] min-h-[250px] max-h-[340px] overflow-y-auto space-y-1.5 leading-relaxed">
            {terminalLogs.length === 0 ? (
              <span className="text-slate-500 italic">No automated suite active. Trigger a run from the top controls to begin execution simulation...</span>
            ) : (
              terminalLogs.map((log, idx) => {
                let color = "text-slate-300";
                if (log.startsWith("[INFO]")) color = "text-sky-300";
                if (log.startsWith("[SUCCESS]")) color = "text-emerald-400 font-semibold";
                if (log.startsWith("[ACTION]")) color = "text-amber-400";
                if (log.startsWith("[ASSERT]")) color = "text-indigo-300 font-medium";
                if (log.startsWith("[PASS]")) color = "text-emerald-400 bg-emerald-500/5 px-1 rounded block border border-emerald-500/15";

                return (
                  <div key={idx} className={`${color} break-words whitespace-pre-wrap`}>
                    {log}
                  </div>
                );
              })
            )}
          </div>

          {/* Bottom trace and assertions verification metrics */}
          <div className="bg-slate-900 p-4 border-t border-slate-800 space-y-3.5">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono text-slate-400">
                {activeSuite === "negative-empty-card" ? "SELENIUM" : "PLAYWRIGHT"} ASSERTS COMPLETED:
              </span>
              <span className="text-xs font-mono font-bold text-white">
                {suiteStatus === "PASSED" ? (activeSuite === "negative-empty-card" ? "3 / 3 passed" : "4 / 4 passed") : suiteStatus === "RUNNING" ? "calculating..." : "0 / 0 pending"}
              </span>
            </div>

            {/* Test step progress checkmarks */}
            <div className="grid grid-cols-4 gap-1.5 text-center text-[9px] font-mono text-slate-400">
              <div className={`p-1.5 rounded-md border text-[8px] sm:text-[9px] ${
                simulationStep >= 2 ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400 font-semibold" : "bg-slate-950 border-slate-800"
              }`}>
                Initialize
              </div>
              <div className={`p-1.5 rounded-md border text-[8px] sm:text-[9px] ${
                (activeSuite === "positive-checkout" ? simulationStep >= 4 : simulationStep >= 3) ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400 font-semibold" : "bg-slate-950 border-slate-800"
              }`}>
                {activeSuite === "negative-empty-card" ? "Locate Button" : "Add Target"}
              </div>
              <div className={`p-1.5 rounded-md border text-[8px] sm:text-[9px] ${
                (activeSuite === "positive-checkout" ? simulationStep >= 9 : simulationStep >= 4) ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400 font-semibold" : "bg-slate-950 border-slate-800"
              }`}>
                {activeSuite === "negative-empty-card" ? "Verify Rejects" : "Promo Math"}
              </div>
              <div className={`p-1.5 rounded-md border text-[8px] sm:text-[9px] ${
                (activeSuite === "positive-checkout" ? simulationStep >= 11 : simulationStep >= 5) ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400 font-semibold" : "bg-slate-950 border-slate-800"
              }`}>
                Report Assert
              </div>
            </div>

            <p className="text-[10px] text-slate-500 leading-normal font-mono">
              ★ Tip: Simulating real DOM traversals allows inspecting the Page Object Model (POM) mapping configurations accurately in live environments.
            </p>
          </div>

        </HoverWaveContainer>

      </div>
    </div>
  );
}

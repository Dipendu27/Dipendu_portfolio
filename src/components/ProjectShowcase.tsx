import React, { useState } from "react";
import { FolderGit2, Bug, ClipboardList, Link2, ExternalLink, ShieldCheck, AlertCircle, RefreshCw, Terminal, CheckCircle, Code2, FileCode, Activity, Search } from "lucide-react";
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, CartesianGrid, LineChart, Line, Legend } from "recharts";
import { motion, AnimatePresence } from "motion/react";
import { BugReport, TestCase } from "../types";
import HoverWaveContainer from "./HoverWaveContainer";
import HoverZoom from "./HoverZoom";
import QABugHunter from "./QABugHunter";

const tableContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.02,
    },
  },
};

const tableRowVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 280,
      damping: 24,
    },
  },
};

export default function ProjectShowcase() {
  const [activeTab, setActiveTab] = useState<"frameworks" | "bugs" | "testplans" | "unittests" | "academic">("bugs");
  const [activeBugIdx, setActiveBugIdx] = useState<number>(0);
  const [activeSuiteIdx, setActiveSuiteIdx] = useState<number>(0);
  const [testPlanFilter, setTestPlanFilter] = useState<"ALL" | "Automation" | "Manual" | "Performance">("ALL");
  const [clearedSuiteLogs, setClearedSuiteLogs] = useState<Record<string, boolean>>({});

  // Unit Testing Search, Filtering, Coverage modes and toast states
  const [suiteSearchQuery, setSuiteSearchQuery] = useState("");
  const [suiteStatusFilter, setSuiteStatusFilter] = useState<"ALL" | "PASSED" | "FAILED">("ALL");
  const [activeSuiteId, setActiveSuiteId] = useState("UT-101");
  const [chartMode, setChartMode] = useState<"radar" | "bar" | "trend">("radar");
  const [toasts, setToasts] = useState<Array<{ id: string; message: string; type: "success" | "error"; suiteName: string }>>([]);
  const [runningSuiteId, setRunningSuiteId] = useState<string | null>(null);
  const [confirmModalData, setConfirmModalData] = useState<{
    isOpen: boolean;
    suiteId: string | null;
    suiteName: string;
    duration: string;
    suiteIds: string[];
  } | null>(null);
  
  // Parallel execution states
  const [runningSuiteIds, setRunningSuiteIds] = useState<Record<string, boolean>>({});
  const [selectedSuiteIds, setSelectedSuiteIds] = useState<Record<string, boolean>>({
    "UT-101": true,
    "UT-102": true,
    "UT-103": true,
    "UT-104": true,
  });
  const [suiteStatuses, setSuiteStatuses] = useState<Record<string, "PASSED" | "FAILED">>({
    "UT-101": "PASSED",
    "UT-102": "PASSED",
    "UT-103": "PASSED",
    "UT-104": "FAILED",
  });
  const [logFilter, setLogFilter] = useState<"ALL" | "INFO" | "ASSERT" | "ERROR">("ALL");

  const [runCounts, setRunCounts] = useState<Record<string, number>>({
    "UT-101": 0,
    "UT-102": 0,
    "UT-103": 0,
    "UT-104": 0,
  });
  const [suiteHistories, setSuiteHistories] = useState<Record<string, number[]>>({
    "UT-101": [96, 97, 98, 99, 100],
    "UT-102": [90, 92, 93, 94, 95.8],
    "UT-103": [81, 82, 83, 84, 85.4],
    "UT-104": [60, 61.5, 63, 64.5, 66],
  });
  const [dynamicCoverages, setDynamicCoverages] = useState<Record<string, { statements: number; branches: number; functions: number; lines: number }>>({
    "UT-101": { statements: 100, branches: 100, functions: 100, lines: 100 },
    "UT-102": { statements: 95.8, branches: 91.6, functions: 100, lines: 95.8 },
    "UT-103": { statements: 88.2, branches: 75.0, functions: 90.0, lines: 88.2 },
    "UT-104": { statements: 72.4, branches: 50.0, functions: 66.7, lines: 75.0 },
  });

  // Sanitized Ubuy Bug Reports
  const bugReports: BugReport[] = [
    {
      id: "BUG-2041",
      title: "Cart Race Condition on Rapid Double-Tap during Card Authorizations",
      severity: "CRITICAL",
      component: "Checkout API / Stripe Webhooks Gateway",
      stepsToReproduce: [
        "Add one high-value custom product to the shopping basket.",
        "Proceed to the standard Checkout checkout-form page.",
        "Enter validated financial testing card numbers.",
        "Rapidly double-check and double-tap the 'Pay Now' button with < 150ms delay.",
        "Throttled response speed is set to Slow 3G in browser dev tools."
      ],
      expectedResult: "Button disables instantly on the first click. Only one transaction is authorization routed to Stripe and one single Order is drafted in CRM.",
      actualResult: "Button allowed dual clicks. Duplicate transaction calls were made to Stripe, spawning two distinct order tokens in CRM for a single shipping container.",
      status: "RESOLVED",
      resolution: "Modified frontend Submit component to state-disable immediately upon click. Added a double-submit interceptor token server-side on /pay route. Created Playwright concurrent click regression suite."
    },
    {
      id: "BUG-1988",
      title: "Silent Cart Expiration on Mobile-Safari Private Browser Isolation session",
      severity: "HIGH",
      component: "Client State Module / LocalStorage Manager",
      stepsToReproduce: [
        "Open Ubuy.com under iOS Safari private browsing context.",
        "Add three random items to standard store basket.",
        "Minimize mobile browser, wait 10 seconds of session backgrounding.",
        "Resume browser application and click on cart icon."
      ],
      expectedResult: "The added items are continuously retained via SessionStorage backup fallback.",
      actualResult: "Cart is cleared. Mobile Safari private mode blocks direct standard LocalStorage write methods, resulting in silent Javascript error and memory loss.",
      status: "VERIFIED",
      resolution: "Created a try-catch memory-mapping wrapper for LocalStorage with immediate fallback to memory-based SessionStorage variables, retaining states in incognito. Verified across iOS emulator grid."
    },
    {
      id: "BUG-2210",
      title: "Infinite Item Carousel CPU Spike under Throttled Network Packet-Loss",
      severity: "MEDIUM",
      component: "Hero Product Feed Component UI",
      stepsToReproduce: [
        "Navigate to home promotional banner list.",
        "Simulate high background packet loss (25%) using Network Throttling proxy manager.",
        "Allow slider to scroll automatically 4 times across visual items."
      ],
      expectedResult: "Carousel waits gracefully for next image resource block, displaying responsive placeholder.",
      actualResult: "Carousel entered rapid image-loading loop. Infinite recursive callback fired internally, causing browser tab memory leak and 100% Client CPU spike.",
      status: "RESOLVED",
      resolution: "Throttled the state update controller callback inside useEffect hooks, avoiding unmounted setStates. Implemented a 5-second connection load timeout."
    }
  ];

  // Ubuy Modular automation frameworks specs
  const frameworks = [
    {
      title: "devops-cloud-testin (Core Repository)",
      description: "30-Day DevOps Cloud Testing Journey: Dockerized scripting suite featuring cloud test runners, multi-threaded executors, automatic log packaging to Amazon S3, and local LLM performance profiling.",
      tags: ["Bash", "Docker", "AWS S3", "GitHub Actions", "Python", "jq"],
      coverage: "CI Continuous Monitor Suite",
      stars: 15,
      githubUrl: "https://github.com/Dipendu27/devops-cloud-testin"
    },
    {
      title: "ubuy_monitor.sh",
      description: "Polite e-commerce endpoint health & price tracker validating status responses. Handles 200 OK, redirects, 403 API blockages, and rate-limits with custom bot user-agents and polite delays.",
      tags: ["Bash", "curl", "Monitoring", "E-Commerce"],
      coverage: "Response Code Gateway Checks",
      stars: 8,
      githubUrl: "https://github.com/Dipendu27/devops-cloud-testin/blob/main/ubuy_monitor.sh"
    },
    {
      title: "parallel_runner.sh & cloud_test_runner.sh",
      description: "Continuous enterprise multi-threaded runner triggering parallel suites. Features status extraction, original test failure preservation, and automated log pushing to AWS S3.",
      tags: ["Bash", "AWS Cloud", "Docker", "Concurrency", "AWS CLI"],
      coverage: "Docker Cloud Integration",
      stars: 9,
      githubUrl: "https://github.com/Dipendu27/devops-cloud-testin/blob/main/parallel_runner.sh"
    },
    {
      title: "benchmark.py & inventory_check.sh",
      description: "Measures Ollama (llama3.2) token-per-second output speeds. Paired with high-speed JSON validators parsing inventory quantity constraints under jq scanning filters.",
      tags: ["Python", "Ollama", "jq", "REST API", "JSON Schema"],
      coverage: "LLM Speed & Stock Audits",
      stars: 11,
      githubUrl: "https://github.com/Dipendu27/devops-cloud-testin/blob/main/benchmark.py"
    }
  ];

  // Interactive Test Plan list
  const testCases: TestCase[] = [
    { id: "TC-101", feature: "Cart Management", title: "Add item from detailed page and verify quantity updates", type: "Automation", status: "PASSED" },
    { id: "TC-102", feature: "Cart Management", title: "Promo discount multiplier computations check (boundary verification)", type: "Automation", status: "PASSED" },
    { id: "TC-201", feature: "Checkout Flow", title: "Credit card gateway timeout failure recovery check (simulate error responses)", type: "Manual", status: "PASSED" },
    { id: "TC-202", feature: "Checkout Flow", title: "Postal Zip-code validation and geographic address auto-filling", type: "Automation", status: "PASSED" },
    { id: "TC-301", feature: "Payment Integrity", title: "Payment endpoint stress run: 500 concurrent Checkout API request payloads", type: "Performance", status: "PASSED" },
    { id: "TC-401", feature: "Cross-Device Rendering", title: "Mobile UI viewport validation for checkout fields on iPhone SE physical dimensions", type: "Manual", status: "PASSED" },
    { id: "TC-402", feature: "Session Isolation", title: "Simultaneous checkouts on the same account from distinct browser tabs (anti-clash)", type: "Manual", status: "PASSED" }
  ];

  // Filtered test cases
  const filteredTestCases = testCases.filter((tc) => {
    if (testPlanFilter === "ALL") return true;
    return tc.type === testPlanFilter;
  });

  // Mock Vitest/Jest unit test files and coverage reports
  const unitTestSuites = [
    {
      id: "UT-101",
      name: "Cart Calculations Core",
      filePath: "tests/unit/cart-service.test.ts",
      framework: "Vitest",
      status: "PASSED",
      duration: "42ms",
      assertions: 8,
      coverage: { statements: 100, branches: 100, functions: 100, lines: 100 },
      code: `import { expect, test, describe, beforeEach } from "vitest";
import { CartService } from "./CartService";

describe("CartService Core API", () => {
  let service: CartService;

  beforeEach(() => {
    service = new CartService();
  });

  test("should append new instances with standard quant=1", () => {
    service.add({ id: "prod_09", name: "Premium Dev Jersey", price: 75 });
    const state = service.getCartState();
    expect(state.items).toHaveLength(1);
    expect(state.items[0].quantity).toBe(1);
  });

  test("should multiply base item quant on repeated add triggers", () => {
    service.add({ id: "prod_09", price: 75 });
    service.add({ id: "prod_09", price: 75 });
    const state = service.getCartState();
    expect(state.items[0].quantity).toBe(2);
    expect(state.total).toBe(150);
  });

  test("should flush entire lists on hard reset calls", () => {
    service.add({ id: "prod_09", price: 75 });
    service.clear();
    expect(service.getCartState().items).toHaveLength(0);
  });
});`,
      terminalLogs: [
        "[11:15:30 AM] [VITEST] Starting thread pools...",
        "✓ tests/unit/cart-service.test.ts (42ms)",
        "  ✓ CartService Core API (3 tests)",
         "    ✓ should append new instances with standard quant=1 (14ms)",
         "    ✓ should multiply base item quant on repeated add triggers (18ms)",
         "    ✓ should flush entire lists on hard reset calls (10ms)",
        "Test Files: 1 passed, 1 total",
        "Tests: 3 passed, 3 total",
        "Snapshots: 0 total",
        "Time: 1.12s (executing thread overhead included)"
      ]
    },
    {
      id: "UT-102",
      name: "Voucher Code Validation Algorithms",
      filePath: "tests/unit/coupon-validator.test.ts",
      framework: "Vitest",
      status: "PASSED",
      duration: "28ms",
      assertions: 12,
      coverage: { statements: 95.8, branches: 91.6, functions: 100, lines: 95.8 },
      code: `import { expect, test, describe } from "vitest";
import { validateCouponCode } from "./CouponValidator";

describe("Coupon Regex Validation", () => {
  test("should match positive regex for UBUYFAST40", () => {
    const response = validateCouponCode("UBUYFAST40");
    expect(response.isValid).toBe(true);
    expect(response.multiplier).toBe(0.40);
  });

  test("should gracefully fail invalid structures", () => {
    const response = validateCouponCode("FAKE_COUPON_999");
    expect(response.isValid).toBe(false);
    expect(response.multiplier).toBe(0);
  });

  test("should filter fractional multipliers securely", () => {
    const response = validateCouponCode("UBUYFAST105"); // over maximum cap
    expect(response.isValid).toBe(false);
  });
});`,
      terminalLogs: [
        "[11:15:31 AM] [VITEST] Starting thread pools...",
        "✓ tests/unit/coupon-validator.test.ts (28ms)",
        "  ✓ Coupon Regex Validation (3 tests)",
        "    ✓ should match positive regex for UBUYFAST40 (8ms)",
        "    ✓ should gracefully fail invalid structures (12ms)",
        "    ✓ should filter fractional multipliers securely (8ms)",
        "Test Files: 1 passed, 1 total",
        "Tests: 3 passed, 3 total",
        "Time: 0.95s"
      ]
    },
    {
      id: "UT-103",
      name: "Incognito Browser Engine Fallbacks",
      filePath: "tests/unit/auth-session.spec.ts",
      framework: "Jest",
      status: "PASSED",
      duration: "135ms",
      assertions: 6,
      coverage: { statements: 88.2, branches: 75.0, functions: 90.0, lines: 88.2 },
      code: `const { SessionManager } = require("./SessionManager");

describe("Incognito Fallbacks Under Sandboxed Viewports", () => {
  beforeEach(() => {
    // Simulate browser blocking localStorage completely
    Object.defineProperty(window, "localStorage", {
      value: null,
      writable: true
    });
  });

  test("should fallback smoothly to dynamic RAM cache on storage throw", () => {
    const session = new SessionManager();
    expect(() => session.set("auth_token", "jwt_abc")).not.toThrow();
    expect(session.get("auth_token")).toBe("jwt_abc");
    expect(session.isFallbackActive()).toBe(true);
  });
});`,
      terminalLogs: [
        "PASS tests/unit/auth-session.spec.ts (0.135s)",
        "  Incognito Fallbacks Under Sandboxed Viewports",
        "    ✓ should fallback smoothly to dynamic RAM cache on storage throw (18ms)",
        "Test Suites: 1 passed, 1 total",
        "Tests:       1 passed, 1 total",
        "Snapshots:   0 total",
        "Time:        1.85s, estimated 2s"
      ]
    },
    {
      id: "UT-104",
      name: "Concurrent Transaction Token Interceptor",
      filePath: "tests/unit/payment-token.spec.ts",
      framework: "Jest",
      status: "FAILED",
      duration: "192ms",
      assertions: 5,
      coverage: { statements: 72.4, branches: 50.0, functions: 66.7, lines: 75.0 },
      code: `const { PaymentInterceptor } = require("./PaymentInterceptor");

describe("Payment Token Clash Checks", () => {
  test("should block rapid sequential identical payloads", () => {
    const lock = new PaymentInterceptor();
    const t1 = lock.acquire("user_tx_99");
    const t2 = lock.acquire("user_tx_99"); // same window
    
    expect(t1.success).toBe(true);
    expect(t2.success).toBe(false); // Fails due to concurrency leak
  });
});`,
      terminalLogs: [
        "[11:15:35 AM] [JEST] Initializing concurrent validation context...",
        "✕ tests/unit/payment-token.spec.ts (192ms)",
        "  Payment Token Clash Checks",
        "    ✕ should block rapid sequential identical payloads (42ms)",
        "      Expected t2.success to be: false",
        "      Received: true",
        "      ",
        "      12 |     const t2 = lock.acquire(\"user_tx_99\");",
        "    > 13 |     expect(t2.success).toBe(false);",
        "         |                        ^",
        "      ",
        "      at Object.test (tests/unit/payment-token.spec.ts:13:24)",
        "",
        "Test Suites: 1 failed, 1 total",
        "Tests:       1 failed, 1 total",
        "Snapshots:   0 total",
        "Time:        2.34s"
      ]
    }
  ];

  // Filtered unit test suites based on search bar and status select
  const filteredSuites = unitTestSuites.filter((suite) => {
    const matchesSearch =
      suite.name.toLowerCase().includes(suiteSearchQuery.toLowerCase()) ||
      suite.id.toLowerCase().includes(suiteSearchQuery.toLowerCase()) ||
      suite.filePath.toLowerCase().includes(suiteSearchQuery.toLowerCase());
    const matchesStatus =
      suiteStatusFilter === "ALL" || (suiteStatuses[suite.id] || suite.status) === suiteStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeSuite = filteredSuites.find((s) => s.id === activeSuiteId) || filteredSuites[0];

  const activeCoverage = activeSuite ? (dynamicCoverages[activeSuite.id] || activeSuite.coverage) : { statements: 80, branches: 80, functions: 80, lines: 80 };

  const activeHistory = activeSuite ? (suiteHistories[activeSuite.id] || [80, 81, 82, 83, 84]) : [80, 81, 82, 83, 84];
  
  // Calculate project-wide historical trend lines by aggregating performance across all 4 suites
  const activeSparklineData = activeHistory.map((val, idx) => {
    let sum = 0;
    const suiteIds = ["UT-101", "UT-102", "UT-103", "UT-104"];
    suiteIds.forEach((id) => {
      const history = suiteHistories[id] || [80, 81, 82, 83, 84];
      sum += history[idx] !== undefined ? history[idx] : val;
    });
    const avgCoverage = Number((sum / suiteIds.length).toFixed(1));
    return {
      run: `Run ${idx + 1}`,
      coverage: val,
      projectCoverage: avgCoverage,
    };
  });

  const activeLastVal = activeHistory[activeHistory.length - 1];
  const activeBeforeLastVal = activeHistory[activeHistory.length - 2] || activeLastVal;
  const activeTrendDelta = Number((activeLastVal - activeBeforeLastVal).toFixed(1));

  const triggerRerunMultiple = (suiteIds: string[]) => {
    if (suiteIds.length === 0) return;

    // Set parallel running indicators
    setRunningSuiteIds((prev) => {
      const next = { ...prev };
      suiteIds.forEach((id) => {
        next[id] = true;
      });
      return next;
    });

    // Support backwards compatibility for active single suite visualizer overlay loading states
    if (activeSuite && suiteIds.includes(activeSuite.id)) {
      setRunningSuiteId(activeSuite.id);
    }

    // Reset log clearance on rerun
    setClearedSuiteLogs((prev) => {
      const next = { ...prev };
      suiteIds.forEach((id) => {
        next[id] = false;
      });
      return next;
    });

    suiteIds.forEach((suiteId) => {
      const suite = unitTestSuites.find((s) => s.id === suiteId);
      if (!suite) return;

      // Staggered Parallel Execution timeout simulation
      const runDelay = 600 + Math.random() * 600;

      setTimeout(() => {
        // Organic status re-evaluations (UT-104 flips with 50% chance, minor chance of flakes for others)
        let nextStatus: "PASSED" | "FAILED" = suite.status === "FAILED" ? "FAILED" : "PASSED";
        if (suiteId === "UT-104") {
          nextStatus = Math.random() > 0.5 ? "PASSED" : "FAILED";
        } else {
          nextStatus = Math.random() > 0.05 ? "PASSED" : "FAILED";
        }

        setSuiteStatuses((prev) => ({
          ...prev,
          [suiteId]: nextStatus,
        }));

        setRunningSuiteIds((prev) => ({
          ...prev,
          [suiteId]: false,
        }));

        if (activeSuite?.id === suiteId) {
          setRunningSuiteId(null);
        }

        // Increment run count
        setRunCounts((prev) => ({ ...prev, [suiteId]: (prev[suiteId] || 0) + 1 }));

        // Append new trend entry with realistic micro-fluctuations
        setSuiteHistories((prev) => {
          const history = prev[suiteId] || [80, 81, 82, 83, 84];
          const lastVal = history[history.length - 1];
          const delta = Number((Math.random() * 2.4 - 1.2).toFixed(1));
          const nextVal = Math.min(100, Math.max(30, Number((lastVal + delta).toFixed(1))));
          return {
            ...prev,
            [suiteId]: [...history.slice(1), nextVal],
          };
        });

        // Calculate dynamic coverages for perfect animations
        let nextCoverage = suite.coverage;
        setDynamicCoverages((prev) => {
          const current = prev[suiteId] || suite.coverage;
          const dStat = Number((Math.random() * 3.2 - 1.6).toFixed(1));
          const dBran = Number((Math.random() * 3.2 - 1.6).toFixed(1));
          const dFunc = Number((Math.random() * 3.2 - 1.6).toFixed(1));
          const dLine = Number((Math.random() * 3.2 - 1.6).toFixed(1));

          nextCoverage = {
            statements: Math.min(100, Math.max(30, Number((current.statements + dStat).toFixed(1)))),
            branches: Math.min(100, Math.max(30, Number((current.branches + dBran).toFixed(1)))),
            functions: Math.min(100, Math.max(30, Number((current.functions + dFunc).toFixed(1)))),
            lines: Math.min(100, Math.max(30, Number((current.lines + dLine).toFixed(1)))),
          };

          return {
            ...prev,
            [suiteId]: nextCoverage,
          };
        });

        const isSuccess = nextStatus === "PASSED";
        const avgCov = Math.round((nextCoverage.statements + nextCoverage.branches + nextCoverage.functions) / 3);
        const newToast = {
          id: Math.random().toString(),
          message: isSuccess
            ? `Parallel re-run accomplished: "${suite.name}" (${suite.id}) passed successfully! Average Code Coverage stands at ${avgCov}%.`
            : `Parallel re-run completed: "${suite.name}" (${suite.id}) failed on unit test assertion requirements. Review terminal streams.`,
          type: isSuccess ? ("success" as const) : ("error" as const),
          suiteName: suite.name,
        };

        setToasts((prev) => [...prev, newToast]);
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
        }, 4000);
      }, runDelay);
    });
  };

  const triggerRerun = (suiteId: string) => {
    const suite = unitTestSuites.find((s) => s.id === suiteId);
    if (!suite) return;
    setConfirmModalData({
      isOpen: true,
      suiteId: suite.id,
      suiteName: suite.name,
      duration: suite.duration,
      suiteIds: [suite.id]
    });
  };

  const triggerRerunSelected = (suiteIds: string[]) => {
    if (suiteIds.length === 0) return;
    if (suiteIds.length === 1) {
      triggerRerun(suiteIds[0]);
      return;
    }
    setConfirmModalData({
      isOpen: true,
      suiteId: null,
      suiteName: `${suiteIds.length} Selected Suites`,
      duration: "~1.2s parallel overhead",
      suiteIds: suiteIds
    });
  };

  const confirmRerunHandler = () => {
    if (!confirmModalData) return;
    triggerRerunMultiple(confirmModalData.suiteIds);
    setConfirmModalData(null);
  };

  const getLogLevel = (log: string): "INFO" | "ASSERT" | "ERROR" => {
    const lower = log.toLowerCase();
    if (
      lower.includes("error") || 
      lower.includes("expect") || 
      lower.includes("received") || 
      lower.includes("at object") || 
      lower.includes("failed") || 
      lower.includes("fail") || 
      lower.includes(" | ") || 
      lower.includes(" > ") || 
      lower.includes("^")
    ) {
      return "ERROR";
    }
    if (
      lower.includes("✓") || 
      lower.includes("should") || 
      (lower.includes("✕") && !lower.includes("spec.ts") && !lower.includes("test.ts"))
    ) {
      return "ASSERT";
    }
    return "INFO";
  };

  return (
    <div id="project-showcase" className="w-full relative">
      {/* Software Testing themed funny background scanner & scurrying bug transition */}
      <QABugHunter activeTab={activeTab} />

      <div className="flex flex-col gap-5 mb-8 text-left">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 text-xs font-mono border border-indigo-500/20 mb-2">
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>PROJECTS & EVIDENCE SHOWCASE</span>
          </div>
          <h2 className="text-section-title text-white">Structured Repositories & QA Traceability</h2>
          <p className="text-xs text-slate-400 mt-1">
            Browse standard QA evidence packages: git automation frameworks, sanitized production bug logs, and custom test plans.
          </p>
        </div>

        {/* Tab Selector Buttons */}
        <div className="flex max-w-full overflow-x-auto no-scrollbar scrollbar-none py-0.5">
          <div className="flex bg-zinc-950 p-[3px] rounded-full border border-[#2c2c2e] relative select-none whitespace-nowrap">
            <button
              id="tab-toggle-bugs"
              onClick={() => setActiveTab("bugs")}
              className="px-4 py-1.5 rounded-full text-xs font-semibold cursor-pointer relative transition duration-200 inline-block"
            >
              {activeTab === "bugs" && (
                <motion.div
                  layoutId="activeProjectShowcaseTab"
                  className="absolute inset-0 bg-white rounded-full"
                  transition={{ type: "spring", stiffness: 350, damping: 26 }}
                />
              )}
              <span className={`relative z-10 transition-colors duration-200 ${activeTab === "bugs" ? "text-black font-semibold" : "text-zinc-400 hover:text-white"}`}>
                Sanitized Bugs
              </span>
            </button>

            <button
              id="tab-toggle-frameworks"
              onClick={() => setActiveTab("frameworks")}
              className="px-4 py-1.5 rounded-full text-xs font-semibold cursor-pointer relative transition duration-200 inline-block"
            >
              {activeTab === "frameworks" && (
                <motion.div
                  layoutId="activeProjectShowcaseTab"
                  className="absolute inset-0 bg-white rounded-full"
                  transition={{ type: "spring", stiffness: 350, damping: 26 }}
                />
              )}
              <span className={`relative z-10 transition-colors duration-200 ${activeTab === "frameworks" ? "text-black font-semibold" : "text-zinc-400 hover:text-white"}`}>
                QA Frameworks
              </span>
            </button>

            <button
              id="tab-toggle-testplans"
              onClick={() => setActiveTab("testplans")}
              className="px-4 py-1.5 rounded-full text-xs font-semibold cursor-pointer relative transition duration-200 inline-block"
            >
              {activeTab === "testplans" && (
                <motion.div
                  layoutId="activeProjectShowcaseTab"
                  className="absolute inset-0 bg-white rounded-full"
                  transition={{ type: "spring", stiffness: 350, damping: 26 }}
                />
              )}
              <span className={`relative z-10 transition-colors duration-200 ${activeTab === "testplans" ? "text-black font-semibold" : "text-zinc-400 hover:text-white"}`}>
                E-Commerce Test Matrix
              </span>
            </button>

            <button
              id="tab-toggle-unittests"
              onClick={() => setActiveTab("unittests")}
              className="px-4 py-1.5 rounded-full text-xs font-semibold cursor-pointer relative transition duration-200 inline-block"
            >
              {activeTab === "unittests" && (
                <motion.div
                  layoutId="activeProjectShowcaseTab"
                  className="absolute inset-0 bg-white rounded-full"
                  transition={{ type: "spring", stiffness: 350, damping: 26 }}
                />
              )}
              <span className={`relative z-10 transition-colors duration-200 ${activeTab === "unittests" ? "text-black font-semibold" : "text-zinc-400 hover:text-white"}`}>
                Unit Testing
              </span>
            </button>

            <button
              id="tab-toggle-academic"
              onClick={() => setActiveTab("academic")}
              className="px-4 py-1.5 rounded-full text-xs font-semibold cursor-pointer relative transition duration-200 inline-block"
            >
              {activeTab === "academic" && (
                <motion.div
                  layoutId="activeProjectShowcaseTab"
                  className="absolute inset-0 bg-white rounded-full"
                  transition={{ type: "spring", stiffness: 350, damping: 26 }}
                />
              )}
              <span className={`relative z-10 transition-colors duration-200 ${activeTab === "academic" ? "text-black font-semibold" : "text-zinc-400 hover:text-white"}`}>
                Academic ML Projects
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Frame 1: Frameworks Feed */}
      {activeTab === "frameworks" && (
        <motion.div
          key="frameworks-panel"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {frameworks.map((fw, idx) => (
            <HoverWaveContainer
              key={idx}
              className="bg-transparent border-transparent p-5 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-indigo-400 group-hover:text-amber-400 transition">
                    <FolderGit2 className="w-5 h-5" />
                  </div>
                  <a
                    href={fw.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-[11px] text-indigo-400 hover:text-indigo-300 font-mono"
                  >
                    <span>GitHub Repo</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div>
                  <h4 className="text-sm font-mono font-bold text-slate-100 flex items-center gap-1.5">
                    {fw.title}
                  </h4>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    {fw.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {fw.tags.map((tg, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-2 py-0.5 rounded bg-slate-950 font-mono text-[9px] text-slate-400 border border-slate-800"
                    >
                      {tg}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-800/60 flex justify-between items-center text-[11px]">
                <span className="text-emerald-400 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  {fw.coverage}
                </span>
                <span className="text-slate-500 font-mono">{fw.stars} Stars</span>
              </div>
            </HoverWaveContainer>
          ))}
        </motion.div>
      )}

      {/* Frame 2: Sanitized bugs Explorer */}
      {activeTab === "bugs" && (
        <motion.div
          key="bugs-panel"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch"
        >
          {/* Bug Sidebar selector */}
          <div className="lg:col-span-4 flex flex-col gap-2.5">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block px-1">Triage Ticket Pipeline</span>
            {bugReports.map((bug, bIdx) => {
              const borderCols = bug.severity === "CRITICAL" 
                ? "border-rose-500/25 border-l-rose-500" 
                : bug.severity === "HIGH" 
                ? "border-amber-500/25 border-l-amber-500" 
                : "border-slate-800 border-l-sky-500";
              const isSelected = bIdx === activeBugIdx;
              return (
                <HoverZoom
                  key={bug.id}
                  scale={1.03}
                  glowColor={bug.severity === "CRITICAL" ? "rgba(244, 63, 94, 0.2)" : "rgba(99, 102, 241, 0.15)"}
                  className="w-full flex"
                >
                  <button
                    id={`bug-selector-btn-${bug.id}`}
                    onClick={() => setActiveBugIdx(bIdx)}
                    className={`text-left p-3.5 rounded-xl border-l-[3px] border transition-all cursor-pointer w-full h-full ${
                      isSelected 
                        ? "bg-slate-900 border-indigo-500/30 border-l-indigo-500" 
                        : `bg-slate-900/25 hover:bg-slate-900/40 ${borderCols}`
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <span className="font-mono text-[10px] text-slate-500">{bug.id}</span>
                      <span className={`text-[8px] px-1.5 py-0.5 rounded font-mono font-bold ${
                        bug.severity === "CRITICAL" 
                          ? "bg-rose-500/10 text-rose-300 border border-rose-500/20" 
                          : "bg-amber-500/10 text-amber-300 border border-amber-500/20"
                      }`}>
                        {bug.severity}
                      </span>
                    </div>
                    <h5 className={`text-xs font-semibold mt-1.5 line-clamp-1 transition-colors ${
                      isSelected ? "text-white" : "text-slate-300"
                    }`}>
                      {bug.title}
                    </h5>
                    <span className="text-[10px] text-slate-500 block mt-1">{bug.component}</span>
                  </button>
                </HoverZoom>
              );
            })}
          </div>

          {/* Active Bug Ticket content */}
          <motion.div 
            key={activeBugIdx}
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="lg:col-span-8 bg-slate-900/25 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden"
          >
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-indigo-400 font-bold">{bugReports[activeBugIdx].id}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1 font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      {bugReports[activeBugIdx].status}
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-white mt-1">
                    {bugReports[activeBugIdx].title}
                  </h4>
                </div>
                <div className="px-3 py-1 bg-slate-950 border border-slate-800 rounded-lg text-[10px] font-mono text-slate-400">
                  DEFECT LOG
                </div>
              </div>

              {/* Bug Details Fields */}
              <div className="space-y-3.5">
                <div>
                  <span className="text-[9px] font-mono uppercase text-slate-500 tracking-wider block">Target Component Scope</span>
                  <span className="text-slate-300 font-mono text-xs">{bugReports[activeBugIdx].component}</span>
                </div>

                <div>
                  <span className="text-[9px] font-mono uppercase text-slate-500 tracking-wider block mb-1">Steps-To-Reproduce Queue</span>
                  <ol className="list-decimal list-inside space-y-1 text-xs text-slate-300 pl-1 font-sans">
                    {bugReports[activeBugIdx].stepsToReproduce.map((step, sIdx) => (
                      <li key={sIdx} className="leading-relaxed">
                        <span className="text-slate-400">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3.5 rounded-xl bg-rose-500/5 border border-rose-500/10">
                    <span className="text-[9px] font-mono uppercase text-rose-400 tracking-wider block">Actual Result Defect</span>
                    <p className="text-slate-300 text-xs mt-1.5 leading-relaxed">
                      {bugReports[activeBugIdx].actualResult}
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                    <span className="text-[9px] font-mono uppercase text-emerald-400 tracking-wider block">Expected Stable Flow</span>
                    <p className="text-slate-300 text-xs mt-1.5 leading-relaxed">
                      {bugReports[activeBugIdx].expectedResult}
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/85">
                  <span className="text-[9px] font-mono uppercase text-indigo-400 tracking-wider block flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-emerald-400" />
                    QA Fix and Resolution Action Item
                  </span>
                  <p className="text-slate-300 text-xs mt-1.5 leading-relaxed">
                    {bugReports[activeBugIdx].resolution}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Frame 3: Interactive Test Plan Case Suite */}
      {activeTab === "testplans" && (
        <motion.div
          key="testplans-panel"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          id="testplan-browser"
          className="bg-slate-900/25 border border-slate-800 rounded-2xl overflow-hidden flex flex-col"
        >
          {/* Header filters */}
          <div className="p-4 bg-slate-950/40 border-b border-slate-800 flex flex-wrap justify-between items-center gap-3">
            <span className="text-xs font-semibold text-white">Interactive Regression Test Case Matrix</span>
            
            <div className="flex gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
              {["ALL", "Automation", "Manual", "Performance"].map((fl) => (
                <button
                  key={fl}
                  id={`testplan-filter-btn-${fl}`}
                  onClick={() => setTestPlanFilter(fl as any)}
                  className={`px-2.5 py-1 text-[10px] rounded font-mono transition cursor-pointer ${
                    testPlanFilter === fl ? "bg-indigo-500 text-white" : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {fl}
                </button>
              ))}
            </div>
          </div>

          {/* Test cases table rendering */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/20 text-slate-400 uppercase tracking-widest text-[9px] font-mono border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Test ID</th>
                  <th className="py-3 px-4">E-Commerce Area</th>
                  <th className="py-3 px-4">Test Case Validation Summary</th>
                  <th className="py-3 px-4">Methodology</th>
                  <th className="py-3 px-4 text-right">Testing Integration</th>
                </tr>
              </thead>
              <motion.tbody 
                key={testPlanFilter}
                variants={tableContainerVariants}
                initial="hidden"
                animate="visible"
                className="divide-y divide-slate-800/60 font-sans"
              >
                {filteredTestCases.map((tc) => (
                  <motion.tr 
                    key={tc.id} 
                    variants={tableRowVariants}
                    className="hover:bg-slate-900/20 transition-colors"
                  >
                    <td className="py-3 px-4 font-mono text-[11px] text-indigo-400 font-semibold">{tc.id}</td>
                    <td className="py-3 px-4 text-slate-200 font-medium">{tc.feature}</td>
                    <td className="py-3 px-4 text-slate-400 leading-normal">{tc.title}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded font-mono text-[9px] ${
                        tc.type === "Automation" 
                          ? "bg-indigo-500/10 text-indigo-300 border border-indigo-500/20" 
                          : tc.type === "Manual" 
                          ? "bg-sky-500/10 text-sky-300 border border-sky-500/20"
                          : "bg-amber-500/10 text-amber-300 border border-amber-500/20"
                      }`}>
                        {tc.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-semibold border border-emerald-500/20 font-mono">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                        {tc.status}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </motion.tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Frame 4: Unit Testing & Coverage */}
      {activeTab === "unittests" && (
        <motion.div
          key="unittests-panel"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-6"
        >
          {/* Unit Test & Coverage KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-zinc-900/40 border border-[#2c2c2e] rounded-2xl p-4 flex flex-col justify-between">
              <span className="text-[10px] text-[#86868b] uppercase tracking-wider block font-semibold">STATEMENT COV</span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-2xl font-bold font-mono text-white">91.2%</span>
                <span className="text-[10px] text-emerald-400 font-semibold">+0.6%</span>
              </div>
              <div className="w-full bg-zinc-950 h-1.5 rounded-full mt-2.5 overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: "91.2%" }} />
              </div>
            </div>

            <div className="bg-zinc-900/40 border border-[#2c2c2e] rounded-2xl p-4 flex flex-col justify-between">
              <span className="text-[10px] text-[#86868b] uppercase tracking-wider block font-semibold">BRANCH COV</span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-2xl font-bold font-mono text-white">79.1%</span>
                <span className="text-[10px] text-[#0071e3] font-semibold">+1.2%</span>
              </div>
              <div className="w-full bg-zinc-950 h-1.5 rounded-full mt-2.5 overflow-hidden">
                <div className="bg-[#0071e3] h-full rounded-full" style={{ width: "79.1%" }} />
              </div>
            </div>

            <div className="bg-zinc-900/40 border border-[#2c2c2e] rounded-2xl p-4 flex flex-col justify-between">
              <span className="text-[10px] text-[#86868b] uppercase tracking-wider block font-semibold">RUN TOTALS</span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-2xl font-bold font-mono text-white">
                  31 asserts
                </span>
                <span className="text-[10px] text-[#86868b]">4 suites total</span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-rose-400 font-mono mt-2.5">
                <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse" />
                <span className="font-sans font-semibold">1 suite failing</span>
              </div>
            </div>

            <div className="bg-zinc-900/40 border border-[#2c2c2e] rounded-2xl p-4 flex flex-col justify-between">
              <span className="text-[10px] text-[#86868b] uppercase tracking-wider block font-semibold">UNIT DURATION</span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-2xl font-bold font-mono text-white">397ms</span>
                <span className="text-[10px] text-[#0071e3]">multi-thread</span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-[#86868b] font-mono mt-2.5">
                <RefreshCw className="w-3 h-3 text-[#30d158] animate-spin" style={{ animationDuration: "3s" }} />
                <span className="font-sans text-[#30d158]">reactive watch active</span>
              </div>
            </div>
          </div>

          {/* Search bar and status filter Dropdown */}
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 p-4 bg-zinc-900/30 border border-[#2c2c2e] rounded-2xl">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#86868b]" />
              <input
                id="unittest-suite-search"
                type="text"
                value={suiteSearchQuery}
                onChange={(e) => setSuiteSearchQuery(e.target.value)}
                placeholder="Search test suites by name, suite ID, or file path..."
                className="w-full bg-black border border-[#2c2c2e] rounded-full pl-10 pr-4 py-2 text-xs text-white outline-none placeholder-[#86868b] transition focus:border-zinc-700"
              />
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-[#86868b] uppercase tracking-wider font-semibold font-sans">Status:</span>
              <select
                id="unittest-suite-status-filter"
                value={suiteStatusFilter}
                onChange={(e) => setSuiteStatusFilter(e.target.value as any)}
                className="bg-black hover:bg-zinc-900 border border-[#2c2c2e] text-xs text-white rounded-full px-3.5 py-1.5 outline-none cursor-pointer font-sans transition-all"
              >
                <option value="ALL">All Statuses</option>
                <option value="PASSED">Passed Only</option>
                <option value="FAILED">Failed Only</option>
              </select>
            </div>
          </div>

          {/* Core Explorer Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Sidebar List */}
            <div className="lg:col-span-4 flex flex-col gap-2.5">
              <div className="flex justify-between items-center px-1">
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Unit Test Suites ({filteredSuites.length})</span>
                {suiteSearchQuery || suiteStatusFilter !== "ALL" ? (
                  <button
                    onClick={() => {
                      setSuiteSearchQuery("");
                      setSuiteStatusFilter("ALL");
                    }}
                    className="text-[9px] text-[#0071e3] hover:underline cursor-pointer"
                  >
                    Clear Filters
                  </button>
                ) : null}
              </div>

              {/* Bulk Multi-Select & Parallel Run Action Bar */}
              {filteredSuites.length > 0 && (
                <div className="flex justify-between items-center p-2.5 bg-zinc-900/25 border border-[#2c2c2e] rounded-xl gap-2">
                  <label className="flex items-center gap-1.5 cursor-pointer text-[10px] text-zinc-400 select-none">
                    <input
                      id="checkbox-all-suites"
                      type="checkbox"
                      checked={filteredSuites.every((s) => selectedSuiteIds[s.id])}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setSelectedSuiteIds((prev) => {
                          const next = { ...prev };
                          filteredSuites.forEach((s) => {
                            next[s.id] = checked;
                          });
                          return next;
                        });
                      }}
                      className="w-3.5 h-3.5 accent-[#0071e3] bg-zinc-950 border-[#2c2c2e] rounded focus:ring-0 cursor-pointer"
                    />
                    <span>Select All</span>
                  </label>

                  <button
                    id="btn-run-selected"
                    onClick={() => {
                      const selectedIds = filteredSuites
                        .map((s) => s.id)
                        .filter((id) => selectedSuiteIds[id]);
                      triggerRerunSelected(selectedIds);
                    }}
                    disabled={
                      filteredSuites.filter((s) => selectedSuiteIds[s.id]).length === 0 ||
                      Object.values(runningSuiteIds).some(Boolean)
                    }
                    className="text-[10px] bg-[#0071e3] hover:bg-[#147ce5] disabled:opacity-40 text-white font-sans font-semibold px-2.5 py-1 rounded-full cursor-pointer transition flex items-center gap-1"
                  >
                    <RefreshCw className={`w-3 h-3 ${Object.values(runningSuiteIds).some(Boolean) ? "animate-spin" : ""}`} />
                    <span>Run Selected ({filteredSuites.filter((s) => selectedSuiteIds[s.id]).length})</span>
                  </button>
                </div>
              )}

              {filteredSuites.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 border border-dashed border-[#2c2c2e] rounded-2xl bg-zinc-950/20 text-center">
                  <AlertCircle className="w-8 h-8 text-zinc-600 mb-2" />
                  <p className="text-xs text-zinc-400 font-sans">No matching test suites</p>
                  <p className="text-[10px] text-zinc-500 font-sans mt-1">Try tweaking your search parameters.</p>
                </div>
              ) : (
                filteredSuites.map((suite) => {
                  const isSelected = suite.id === activeSuite?.id;
                  const covData = dynamicCoverages[suite.id] || suite.coverage;
                  const totalCov = Math.round(
                    (covData.statements + covData.branches + covData.functions) / 3
                  );
                  const isSuiteRunning = runningSuiteIds[suite.id];
                  const currentSuiteStatus = suiteStatuses[suite.id] || suite.status;
                  return (
                    <HoverZoom
                      key={suite.id}
                      scale={1.015}
                      glowColor="rgba(0, 113, 227, 0.15)"
                      className="w-full flex"
                    >
                      <button
                        id={`suite-selector-btn-${suite.id}`}
                        onClick={() => setActiveSuiteId(suite.id)}
                        className={`text-left p-3.5 rounded-2xl border transition-all cursor-pointer w-full h-full border-l-[4px] ${
                          isSelected
                            ? "bg-zinc-900/60 border-[#0071e3]/40 shadow-md"
                            : "bg-zinc-900/10 border-[#2c2c2e] hover:bg-zinc-900/25"
                        } ${
                          isSuiteRunning
                            ? "border-l-blue-500"
                            : currentSuiteStatus === "PASSED"
                            ? "border-l-emerald-500"
                            : "border-l-rose-500"
                        }`}
                      >
                        <div className="flex justify-between items-center gap-2">
                          <label className="flex items-center gap-2 cursor-pointer" onClick={(e) => e.stopPropagation()}>
                            <input
                              id={`checkbox-suite-${suite.id}`}
                              type="checkbox"
                              checked={!!selectedSuiteIds[suite.id]}
                              onChange={(e) => {
                                setSelectedSuiteIds((prev) => ({
                                  ...prev,
                                  [suite.id]: e.target.checked,
                                }));
                              }}
                              className="w-3.5 h-3.5 accent-[#0071e3] bg-zinc-950 border-[#2c2c2e] rounded focus:ring-0 cursor-pointer"
                            />
                            <span className="font-mono text-[9px] text-zinc-500 truncate max-w-[125px]">
                              {suite.filePath}
                            </span>
                          </label>

                          {isSuiteRunning ? (
                            <div className="flex items-center gap-1.5">
                              <span className="text-[9px] px-1.5 py-0.5 rounded font-mono font-bold bg-zinc-800/40 text-zinc-400 border border-[#2c2c2e]" title="Execution count in current session">
                                Runs: {runCounts[suite.id] || 0}
                              </span>
                              <span className="text-[8px] px-1.5 py-0.5 rounded font-mono font-bold border border-blue-500/20 bg-blue-500/10 text-blue-400 flex items-center gap-1 animate-pulse">
                                <RefreshCw className="w-2 h-2 animate-spin text-blue-400" />
                                RUNNING
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5">
                              <span className="text-[9px] px-1.5 py-0.5 rounded font-mono font-bold bg-zinc-800/40 text-zinc-400 border border-[#2c2c2e]" title="Execution count in current session">
                                Runs: {runCounts[suite.id] || 0}
                              </span>
                              <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold border transition-all duration-300 ${
                                currentSuiteStatus === "PASSED"
                                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_8px_rgba(52,211,153,0.15)]"
                                  : "bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-[0_0_8px_rgba(251,113,133,0.15)]"
                              }`}>
                                {currentSuiteStatus === "PASSED" ? "PASSED ✨" : "FAILED ✕"}
                              </span>
                            </div>
                          )}
                        </div>
                        <h5 className={`text-xs font-semibold mt-1.5 line-clamp-1 transition-colors flex items-center gap-2 ${
                          isSelected ? "text-white" : "text-zinc-300"
                        }`}>
                          {isSuiteRunning ? (
                            <RefreshCw className="w-3.5 h-3.5 text-blue-400 animate-spin shrink-0 shadow-[0_0_6px_rgba(59,130,246,0.5)]" />
                          ) : currentSuiteStatus === "PASSED" ? (
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 shadow-[0_0_6px_rgba(16,185,129,0.5)]" />
                          ) : (
                            <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0 shadow-[0_0_6px_rgba(244,63,94,0.5)]" />
                          )}
                          <span className="flex items-center gap-1.5 min-w-0">
                            <span className="truncate">{suite.name}</span>
                            <span 
                              className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                                isSuiteRunning 
                                  ? "bg-blue-400 animate-pulse" 
                                  : currentSuiteStatus === "PASSED" 
                                  ? "bg-[#30d158] shadow-[0_0_4px_rgba(48,209,88,0.75)]" 
                                  : "bg-[#ff453a] shadow-[0_0_4px_rgba(255,69,58,0.75)]"
                              }`}
                              title={isSuiteRunning ? "Running" : currentSuiteStatus === "PASSED" ? "Passed" : "Failed"}
                            />
                          </span>
                        </h5>
                        <div className="flex justify-between items-center mt-2.5 text-[10px] font-mono">
                          <span className={`${totalCov >= 90 ? "text-emerald-400" : "text-amber-400"} font-semibold`}>
                            {totalCov}% Cov
                          </span>
                          <span className="text-zinc-500">{suite.assertions} asserts</span>
                        </div>
                      </button>
                    </HoverZoom>
                  );
                })
              )}
            </div>

            {/* Active Code, Progress & Recharts details split */}
            <div className="lg:col-span-8 flex flex-col gap-4">
              {activeSuite ? (
                <motion.div
                  key={activeSuite.id}
                  initial={{ opacity: 0, scale: 0.99, y: 5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 350, damping: 26 }}
                  className="bg-zinc-900/15 border border-[#2c2c2e] rounded-2xl p-5 md:p-6 space-y-6 text-left"
                >
                  {/* Suite Header */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-[#2c2c2e]">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-[#0071e3] font-semibold">{activeSuite.id}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border flex items-center gap-1 font-mono ${
                          (suiteStatuses[activeSuite.id] || activeSuite.status) === "PASSED"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_8px_rgba(52,211,153,0.1)]"
                            : "bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-[0_0_8px_rgba(251,113,133,0.1)]"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${(suiteStatuses[activeSuite.id] || activeSuite.status) === "PASSED" ? "bg-emerald-500" : "bg-rose-500"} animate-pulse`} />
                          {suiteStatuses[activeSuite.id] || activeSuite.status}
                        </span>
                      </div>
                      <h4 className="text-sm font-semibold text-white mt-1">
                        {activeSuite.name}
                      </h4>
                    </div>
                    <div className="flex items-center gap-3 font-mono text-[10px]">
                      <div className="text-zinc-400 bg-black px-3 py-1.5 rounded-lg border border-[#2c2c2e] hidden sm:block">
                        Execution: {activeSuite.duration}
                      </div>
                      
                      <button
                        id="suite-rerun-btn"
                        onClick={() => triggerRerun(activeSuite.id)}
                        disabled={runningSuiteIds[activeSuite.id]}
                        className="px-3.5 py-1.5 rounded-full bg-[#0071e3] hover:bg-[#147ce5] disabled:opacity-50 text-white font-sans text-xs font-semibold cursor-pointer transition flex items-center gap-1.5"
                      >
                        {runningSuiteIds[activeSuite.id] ? (
                          <>
                            <RefreshCw className="w-3 h-3 animate-spin text-white" />
                            <span>Running...</span>
                          </>
                        ) : (
                          <>
                            <RefreshCw className="w-3 h-3 text-white" />
                            <span>Rerun Suite</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* 2-Column Split: Stats/Code (Left) and Recharts/Terminal (Right) */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    {/* Left: Coverage progress bars & Test spec code preview */}
                    <div className="md:col-span-7 space-y-5">
                      <div className="space-y-3">
                        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block font-bold">Coverage Summary</span>
                        <div className="grid grid-cols-2 gap-3.5 bg-black/40 p-3.5 rounded-xl border border-[#2c2c2e]">
                          <div className="space-y-1.5">
                            <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider block">Statements</span>
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold font-mono text-zinc-200">{activeCoverage.statements}%</span>
                            </div>
                            <div className="w-full bg-zinc-950 h-1.5 rounded-full overflow-hidden">
                              <motion.div
                                key={`cov-statements-${activeSuiteId}`}
                                initial={{ width: 0 }}
                                animate={{ width: `${activeCoverage.statements}%` }}
                                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                                className="bg-emerald-400 h-full rounded-full"
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-1.5">
                            <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider block">Branches</span>
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold font-mono text-zinc-200">{activeCoverage.branches}%</span>
                            </div>
                            <div className="w-full bg-zinc-950 h-1.5 rounded-full overflow-hidden">
                              <motion.div
                                key={`cov-branches-${activeSuiteId}`}
                                initial={{ width: 0 }}
                                animate={{ width: `${activeCoverage.branches}%` }}
                                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                                className="bg-emerald-400 h-full rounded-full"
                              />
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider block">Functions</span>
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold font-mono text-zinc-200">{activeCoverage.functions}%</span>
                            </div>
                            <div className="w-full bg-zinc-950 h-1.5 rounded-full overflow-hidden">
                              <motion.div
                                key={`cov-functions-${activeSuiteId}`}
                                initial={{ width: 0 }}
                                animate={{ width: `${activeCoverage.functions}%` }}
                                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                                className="bg-emerald-400 h-full rounded-full"
                              />
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider block">Lines</span>
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold font-mono text-zinc-200">{activeCoverage.lines}%</span>
                            </div>
                            <div className="w-full bg-zinc-950 h-1.5 rounded-full overflow-hidden">
                              <motion.div
                                key={`cov-lines-${activeSuiteId}`}
                                initial={{ width: 0 }}
                                animate={{ width: `${activeCoverage.lines}%` }}
                                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                                className="bg-emerald-400 h-full rounded-full"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Historical Trend Sparkline */}
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block font-bold">Historical Trend (Last 5 Runs)</span>
                          <span className="text-[10px] font-sans text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Stable Trend
                          </span>
                        </div>
                        <div className="bg-black/40 p-4 rounded-xl border border-[#2c2c2e] flex items-center justify-between gap-4">
                          <div className="flex flex-col gap-1.5 shrink-0 text-left">
                            <span className="text-[9px] text-[#86868b] font-sans font-medium uppercase tracking-wider">Trend Key</span>
                            <div className="flex items-center gap-1.5">
                              <span className="w-2.5 h-0.5 bg-[#30d158] inline-block" />
                              <span className="text-[10px] text-zinc-300 font-mono font-semibold">
                                Suite: {activeLastVal}%
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="w-2.5 h-0.5 border-t border-dashed border-[#38bdf8] inline-block" />
                              <span className="text-[10px] text-zinc-300 font-mono font-semibold">
                                Project: {activeSparklineData[activeSparklineData.length - 1]?.projectCoverage}%
                              </span>
                            </div>
                            <span className={`text-[9px] font-mono flex items-center gap-1 mt-0.5 ${activeTrendDelta >= 0 ? "text-emerald-400" : "text-rose-450 text-rose-400"}`}>
                              {activeTrendDelta >= 0 ? "▲" : "▼"} {activeTrendDelta >= 0 ? "+" : ""}{activeTrendDelta}% suite delta
                            </span>
                          </div>
                          
                          {/* Sparkline Canvas Wrapper */}
                          <div className="h-14 flex-1 max-w-[210px]">
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={activeSparklineData}>
                                <Line 
                                  type="monotone" 
                                  dataKey="coverage" 
                                  stroke={activeLastVal >= 85 ? "#30d158" : "#ff9f0a"} 
                                  strokeWidth={2} 
                                  dot={{ r: 3, strokeWidth: 1.5, stroke: activeLastVal >= 85 ? "#30d158" : "#ff9f0a", fill: "#000" }} 
                                  activeDot={{ r: 4.5 }} 
                                />
                                <Line 
                                  type="monotone" 
                                  dataKey="projectCoverage" 
                                  stroke="#38bdf8" 
                                  strokeWidth={1.5} 
                                  strokeDasharray="3 3"
                                  dot={{ r: 2.5, strokeWidth: 1, stroke: "#38bdf8", fill: "#000" }} 
                                  activeDot={{ r: 4 }} 
                                />
                                <Tooltip
                                  contentStyle={{
                                    backgroundColor: "#161617",
                                    borderColor: "#2c2c2e",
                                    borderRadius: "8px",
                                    fontSize: "9px",
                                    padding: "4px 8px",
                                    fontFamily: "monospace"
                                  }}
                                  itemStyle={{ color: "#ffffff", padding: 0 }}
                                />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      </div>

                      {/* Test Spec Code Preview Box */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] font-mono uppercase text-zinc-500 tracking-wider block font-bold">Source Test Code Spec</span>
                          <span className="text-[9px] font-mono text-zinc-400 bg-zinc-950 px-2 py-0.5 rounded border border-[#2c2c2e]">TypeScript</span>
                        </div>
                        <div className="bg-black/60 p-3.5 rounded-xl border border-[#2c2c2e] font-mono text-[9px] text-[#86868b] overflow-x-auto leading-relaxed max-h-[170px] overflow-y-auto">
                          <div className="flex">
                            <div className="text-zinc-600 select-none pr-3 text-right sticky left-0 bg-black/60">
                              {activeSuite.code.split("\n").map((_, i) => (
                                <div key={i}>{i + 1}</div>
                              ))}
                            </div>
                            <pre className="text-left text-zinc-300 leading-normal font-mono select-text">
                              {activeSuite.code.split("\n").map((line, i) => {
                                const formattedLine = line
                                  .replace(/&/g, "&amp;")
                                  .replace(/</g, "&lt;")
                                  .replace(/>/g, "&gt;")
                                  .replace(/(import|from|describe|test|expect|let|new|const|require|beforeEach|toBe|toHaveLength|not|toThrow)/g, '<span class="text-[#0071e3] font-semibold">$1</span>')
                                  .replace(/(\".*?\"|'.*?')/g, '<span class="text-emerald-400">$1</span>')
                                  .replace(/(\d+)/g, '<span class="text-amber-400">$1</span>');
                                return (
                                  <div key={i} dangerouslySetInnerHTML={{ __html: formattedLine || "&nbsp;" }} />
                                );
                              })}
                            </pre>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right: Recharts Interactive Chart & Console logs */}
                    <div className="md:col-span-5 space-y-5 flex flex-col justify-between">
                      {/* Chart Area */}
                      <div className="bg-black/35 rounded-xl border border-[#2c2c2e] p-4">
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block font-bold">Coverage Visualizer</span>
                          
                          {/* Toggle for Radar / Bar / Trend chart */}
                          <div className="flex items-center gap-1.5 bg-zinc-950 p-0.5 rounded-lg border border-[#2c2c2e]">
                            <button
                              onClick={() => setChartMode("radar")}
                              className={`text-[9px] font-sans px-2 py-0.5 rounded-md cursor-pointer transition-all ${
                                chartMode === "radar"
                                  ? "bg-zinc-800 text-white font-medium shadow-sm"
                                  : "text-zinc-500 hover:text-zinc-300"
                              }`}
                            >
                              Radar
                            </button>
                            <button
                              onClick={() => setChartMode("bar")}
                              className={`text-[9px] font-sans px-2 py-0.5 rounded-md cursor-pointer transition-all ${
                                chartMode === "bar"
                                  ? "bg-zinc-800 text-white font-medium shadow-sm"
                                  : "text-zinc-500 hover:text-zinc-300"
                              }`}
                            >
                              Bar
                            </button>
                            <button
                              onClick={() => setChartMode("trend")}
                              className={`text-[9px] font-sans px-2 py-0.5 rounded-md cursor-pointer transition-all ${
                                chartMode === "trend"
                                  ? "bg-zinc-800 text-white font-medium shadow-sm"
                                  : "text-zinc-500 hover:text-zinc-300"
                              }`}
                            >
                              Trend
                            </button>
                          </div>
                        </div>

                        {/* Interactive Recharts Canvas wrapper with loading state */}
                        <div className="relative h-[210px] w-full flex items-center justify-center">
                          {runningSuiteId === activeSuite.id && (
                            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-10 flex flex-col items-center justify-center rounded-xl space-y-3">
                              <RefreshCw className="w-5 h-5 animate-spin text-[#0071e3]" />
                              <span className="text-[9px] font-mono text-zinc-400 animate-pulse">COMPILING MEASUREMENTS...</span>
                            </div>
                          )}
                          
                          {chartMode === "radar" ? (
                            <ResponsiveContainer width="100%" height="100%">
                              <RadarChart 
                                cx="50%" 
                                cy="50%" 
                                outerRadius="68%" 
                                data={[
                                  { subject: "Statements", percentage: activeCoverage.statements },
                                  { subject: "Branches", percentage: activeCoverage.branches },
                                  { subject: "Functions", percentage: activeCoverage.functions },
                                  { subject: "Lines", percentage: activeCoverage.lines }
                                ]}
                              >
                                <PolarGrid stroke="#2c2c2e" />
                                <PolarAngleAxis 
                                  dataKey="subject" 
                                  tick={{ fill: "#86868b", fontSize: 9 }} 
                                />
                                <PolarRadiusAxis 
                                  angle={30} 
                                  domain={[0, 100]} 
                                  tick={{ fill: "#636366", fontSize: 7 }} 
                                  axisLine={false} 
                                />
                                <Radar
                                  name="Coverage"
                                  dataKey="percentage"
                                  stroke="#0071e3"
                                  fill="#0071e3"
                                  fillOpacity={0.25}
                                />
                                <Tooltip 
                                  contentStyle={{ 
                                    backgroundColor: "#161617", 
                                    borderColor: "#2c2c2e", 
                                    borderRadius: "8px",
                                    fontSize: "11px",
                                    fontFamily: "monospace"
                                  }} 
                                  itemStyle={{ color: "#ffffff" }}
                                  labelStyle={{ color: "#86868b" }}
                                />
                              </RadarChart>
                            </ResponsiveContainer>
                          ) : chartMode === "bar" ? (
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart 
                                data={[
                                  { name: "Stats", percentage: activeCoverage.statements },
                                  { name: "Branch", percentage: activeCoverage.branches },
                                  { name: "Funcs", percentage: activeCoverage.functions },
                                  { name: "Lines", percentage: activeCoverage.lines }
                                ]} 
                                margin={{ top: 10, right: 10, left: -25, bottom: 5 }}
                              >
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2c2c2e" />
                                <XAxis 
                                  dataKey="name"
                                  stroke="#86868b" 
                                  fontSize={9} 
                                  tickLine={false} 
                                  axisLine={false} 
                                />
                                <YAxis 
                                  stroke="#86868b" 
                                  fontSize={9} 
                                  domain={[0, 100]}
                                  tickLine={false} 
                                  axisLine={false} 
                                />
                                <Tooltip 
                                  contentStyle={{ 
                                    backgroundColor: "#161617", 
                                    borderColor: "#2c2c2e", 
                                    borderRadius: "8px",
                                    fontSize: "11px",
                                    fontFamily: "monospace"
                                  }}  
                                  itemStyle={{ color: "#ffffff" }}
                                  labelStyle={{ color: "#86868b" }}
                                />
                                <Bar dataKey="percentage" radius={[4, 4, 0, 0]}>
                                  <Cell fill="#30d158" fillOpacity={0.7} />
                                  <Cell fill="#0071e3" fillOpacity={0.7} />
                                  <Cell fill="#bf5af2" fillOpacity={0.7} />
                                  <Cell fill="#ff9f0a" fillOpacity={0.7} />
                                </Bar>
                              </BarChart>
                            </ResponsiveContainer>
                          ) : (
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={activeSparklineData} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2c2c2e" />
                                <XAxis 
                                  dataKey="run"
                                  stroke="#86868b" 
                                  fontSize={9} 
                                  tickLine={false} 
                                  axisLine={false} 
                                />
                                <YAxis 
                                  stroke="#86868b" 
                                  fontSize={9} 
                                  domain={[0, 100]}
                                  tickLine={false} 
                                  axisLine={false} 
                                />
                                <Tooltip 
                                  contentStyle={{ 
                                    backgroundColor: "#161617", 
                                    borderColor: "#2c2c2e", 
                                    borderRadius: "8px",
                                    fontSize: "10px",
                                    fontFamily: "monospace"
                                  }}  
                                  itemStyle={{ color: "#ffffff" }}
                                  labelStyle={{ color: "#86868b" }}
                                />
                                <Legend 
                                  verticalAlign="top" 
                                  height={24} 
                                  iconSize={8}
                                  wrapperStyle={{ fontSize: "9px", fontFamily: "sans-serif", color: "#86868b" }}
                                />
                                <Line 
                                  name={`Suite (${activeSuite?.id || "Selected"})`}
                                  type="monotone" 
                                  dataKey="coverage" 
                                  stroke={activeLastVal >= 85 ? "#30d158" : "#ff9f0a"} 
                                  strokeWidth={2} 
                                  dot={{ r: 3.5, strokeWidth: 1.5, stroke: activeLastVal >= 85 ? "#30d158" : "#ff9f0a", fill: "#000" }} 
                                  activeDot={{ r: 5 }} 
                                />
                                <Line 
                                  name="Project-Wide Average"
                                  type="monotone" 
                                  dataKey="projectCoverage" 
                                  stroke="#38bdf8" 
                                  strokeWidth={1.5} 
                                  strokeDasharray="3 3"
                                  dot={{ r: 2.5, strokeWidth: 1.5, stroke: "#38bdf8", fill: "#000" }} 
                                  activeDot={{ r: 4.5 }} 
                                />
                              </LineChart>
                            </ResponsiveContainer>
                          )}
                        </div>
                      </div>

                      {/* Console Outputs / Runner Logs */}
                      <div className="space-y-1.5 flex-1 flex flex-col justify-end mt-4">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-1 text-[9px] font-mono uppercase text-zinc-500 tracking-wider font-bold">
                            <Terminal className="w-3 h-3 text-zinc-500" />
                            <span>Terminal Sandbox Streams</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-mono text-[#86868b] font-bold uppercase tracking-wide">Filter:</span>
                            <select
                              id="unittest-terminal-log-filter"
                              value={logFilter}
                              onChange={(e) => setLogFilter(e.target.value as any)}
                              className="bg-black hover:bg-zinc-900 border border-[#2c2c2e] text-[9px] text-[#86868b] hover:text-white rounded px-2 py-0.5 outline-none cursor-pointer font-mono transition-all focus:border-zinc-700"
                            >
                              <option value="ALL">ALL LOGS</option>
                              <option value="INFO">INFO</option>
                              <option value="ASSERT">ASSERT</option>
                              <option value="ERROR">ERROR</option>
                            </select>
                            {clearedSuiteLogs[activeSuite.id] ? (
                              <button
                                onClick={() => setClearedSuiteLogs(prev => ({ ...prev, [activeSuite.id]: false }))}
                                className="text-[9px] font-mono font-semibold px-2 py-0.5 rounded bg-[#0071e3]/10 text-[#0071e3] hover:bg-[#0071e3]/20 border border-[#0071e3]/25 cursor-pointer transition-colors"
                              >
                                Restart Log
                              </button>
                            ) : (
                              <button
                                onClick={() => setClearedSuiteLogs(prev => ({ ...prev, [activeSuite.id]: true }))}
                                className="text-[9px] font-mono font-semibold px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/25 cursor-pointer transition-colors"
                              >
                                Clear
                              </button>
                            )}
                          </div>
                        </div>
                        <div className="bg-black border border-[#2c2c2e] rounded-xl p-3 font-mono text-[9px] text-[#86868b] space-y-1 block min-h-[95px] max-h-[145px] overflow-y-auto leading-relaxed">
                          {clearedSuiteLogs[activeSuite.id] ? (
                            <p className="text-zinc-600 italic text-left">
                              Terminal thread clear completed. Click "Restart Log" or run a "Rerun Suite" trigger to spool output logs.
                            </p>
                          ) : (
                            (() => {
                              const filteredLogs = activeSuite.terminalLogs.filter(log => {
                                if (logFilter === "ALL") return true;
                                return getLogLevel(log) === logFilter;
                              });
                              if (filteredLogs.length === 0) {
                                return <p className="text-zinc-600 italic text-left">No logs found matching filter "{logFilter}".</p>;
                              }
                              return filteredLogs.map((log, lIdx) => {
                                const isSuccessLog = log.includes("✓") || log.includes("passed") || log.includes("PASS");
                                const isErrLog = log.includes("✕") || log.includes("failed") || log.includes("FAIL") || log.includes("Expected") || log.includes("Received");
                                const logClass = isSuccessLog ? "text-emerald-400 font-semibold" : isErrLog ? "text-rose-400 font-semibold animate-pulse" : log.includes("[SYSTEM]") ? "text-zinc-600" : "text-zinc-300";
                                return (
                                  <p key={lIdx} className={`text-left ${logClass}`}>
                                    {log}
                                  </p>
                                );
                              });
                            })()
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="bg-zinc-900/15 border border-[#2c2c2e] rounded-2xl p-12 text-center h-full flex flex-col items-center justify-center">
                  <AlertCircle className="w-10 h-10 text-zinc-600 mb-2" />
                  <p className="text-[#86868b] font-sans">No Active Test Suite Selected</p>
                  <p className="text-xs text-zinc-600 font-sans mt-1">Please select an action or reset filters above.</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Frame 5: Academic ML Projects */}
      {activeTab === "academic" && (
        <motion.div
          key="academic-panel"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-8 text-left"
        >
          <div className="bg-[#111112] border border-[#2c2c2e] rounded-2xl p-6 sm:p-8">
            <div className="max-w-2xl text-left space-y-2 mb-8">
              <span className="text-[10px] font-bold text-[#0071e3] tracking-widest uppercase block">UEM JAIPUR CAMPUS PORTFOLIO</span>
              <h3 className="text-xl font-bold text-white tracking-tight">Academic AI and Deep Learning Compendium</h3>
              <p className="text-xs text-[#86868b] leading-relaxed">
                Core academic research and development in Earth Observation, Computer Vision, and Predictive Diagnostic healthcare. Projects developed during the B.Tech tenure at the University of Engineering & Management, specialising in Artificial Intelligence & Machine Learning.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Card 1: Downscaling of Jodhpur’s MODIS Land Surface Temperature Data */}
              <HoverWaveContainer className="p-6 bg-transparent border-transparent rounded-3xl flex flex-col justify-between space-y-6 group">
                <div className="space-y-4">
                  <div className="flex justify-between items-start gap-4">
                    <span className="text-[10px] font-mono text-[#86868b] uppercase font-semibold">May 2025 • Research Capstone</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium whitespace-nowrap">
                      10m Resolution
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-white group-hover:text-[#2997ff] transition duration-300">
                    Downscaling Jodhpur’s MODIS Land Surface Temperature
                  </h4>
                  <p className="text-xs text-[#86868b] leading-relaxed">
                    Led development of a downscaling model using MODIS LST (2000-present), NDVI (2015-2025), and Digital Elevation Model (DEM) datasets. Refined global thermal readings by 100x resolution for extreme geographic analysis.
                  </p>
                  <ul className="space-y-1.5 pt-1.5">
                    <li className="flex items-start gap-2 text-[11px] text-zinc-300">
                      <span className="text-[#0071e3] font-bold mt-0.5">•</span>
                      <span>Downscaled Jodhpur LST grid data from 1km down to 10m precision</span>
                    </li>
                    <li className="flex items-start gap-2 text-[11px] text-zinc-350">
                      <span className="text-[#0071e3] font-bold mt-0.5">•</span>
                      <span>Integrated multi-temporal NDVI and high-resolution spatial DEMs</span>
                    </li>
                  </ul>
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  {["Python", "MODIS Data", "GIS Mapping", "Machine Learning", "Spatial Analytics"].map((tag, tIdx) => (
                    <span key={tIdx} className="text-[9px] font-mono font-medium px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
                      {tag}
                    </span>
                  ))}
                </div>
              </HoverWaveContainer>

              {/* Card 2: LST Temporal Analysis */}
              <HoverWaveContainer className="p-6 bg-transparent border-transparent rounded-3xl flex flex-col justify-between space-y-6 group">
                <div className="space-y-4">
                  <div className="flex justify-between items-start gap-4">
                    <span className="text-[10px] font-mono text-[#86868b] uppercase font-semibold">Nov 2024 • Model Optimization</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-medium whitespace-nowrap">
                      94.8% High Accuracy
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-white group-hover:text-[#2997ff] transition duration-300">
                    Temporal Analysis & Thermal Predictive Analyzer
                  </h4>
                  <p className="text-xs text-[#86868b] leading-relaxed">
                    Spearheaded temperature prediction engines incorporating 20 years of chronological satellite data of West Rajasthan. Utilised XGBoost and GridSearchCV iterations to map climate trends.
                  </p>
                  <ul className="space-y-1.5 pt-1.5">
                    <li className="flex items-start gap-2 text-[11px] text-zinc-300">
                      <span className="text-indigo-500 font-bold mt-0.5">•</span>
                      <span>Analyzed 20-year chronological spatial temperature indices</span>
                    </li>
                    <li className="flex items-start gap-2 text-[11px] text-zinc-350">
                      <span className="text-indigo-500 font-bold mt-0.5">•</span>
                      <span>Fine-tuned hyper-parameters using exhaustive GridSearchCV pipelines</span>
                    </li>
                  </ul>
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  {["XGBoost", "GridSearchCV", "Python", "Time Series", "Climate Modeling"].map((tag, tIdx) => (
                    <span key={tIdx} className="text-[9px] font-mono font-medium px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
                      {tag}
                    </span>
                  ))}
                </div>
              </HoverWaveContainer>

              {/* Card 3: Chronic Kidney Disease Detection */}
              <HoverWaveContainer className="p-6 bg-transparent border-transparent rounded-3xl flex flex-col justify-between space-y-6 group">
                <div className="space-y-4">
                  <div className="flex justify-between items-start gap-4">
                    <span className="text-[10px] font-mono text-[#86868b] uppercase font-semibold">Aug 2023 • Health Informatics</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-500/10 text-pink-400 border border-pink-500/20 font-medium whitespace-nowrap">
                      Clinical Classification
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-white group-hover:text-[#2997ff] transition duration-300">
                    Chronic Kidney Disease (CKD) Diagnostic Detection
                  </h4>
                  <p className="text-xs text-[#86868b] leading-relaxed">
                    Coded and trained predictive classifier frameworks designed to identify CKD markers in early-stage patients using blood panels and physiological variables. Evaluated multiple algorithms for peak sensitivity.
                  </p>
                  <ul className="space-y-1.5 pt-1.5">
                    <li className="flex items-start gap-2 text-[11px] text-zinc-300">
                      <span className="text-pink-500 font-bold mt-0.5">•</span>
                      <span>Exhaustive multi-algorithm comparative accuracy indices run</span>
                    </li>
                    <li className="flex items-start gap-2 text-[11px] text-zinc-350">
                      <span className="text-pink-500 font-bold mt-0.5">•</span>
                      <span>Targeting extreme recall metrics to minimize diagnostic false negatives</span>
                    </li>
                  </ul>
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  {["Machine Learning", "Healthcare AI", "Python", "Supervised Learning", "Scikit-Learn"].map((tag, tIdx) => (
                    <span key={tIdx} className="text-[9px] font-mono font-medium px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
                      {tag}
                    </span>
                  ))}
                </div>
              </HoverWaveContainer>

              {/* Card 4: Hand Sign Recognition */}
              <HoverWaveContainer className="p-6 bg-transparent border-transparent rounded-3xl flex flex-col justify-between space-y-6 group">
                <div className="space-y-4">
                  <div className="flex justify-between items-start gap-4">
                    <span className="text-[10px] font-mono text-[#86868b] uppercase font-semibold">May 2023 • Computer Vision</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 font-medium whitespace-nowrap">
                      Real-time Feed
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-white group-hover:text-[#2997ff] transition duration-300">
                    Real-time Computer Vision Hand Sign Recognition
                  </h4>
                  <p className="text-xs text-[#86868b] leading-relaxed">
                    Designed and optimized a lightweight camera-stream hand gesture translator applying contours profiling and adaptive color matrices to translate gestures into terminal directives instantly.
                  </p>
                  <ul className="space-y-1.5 pt-1.5">
                    <li className="flex items-start gap-2 text-[11px] text-zinc-300">
                      <span className="text-sky-500 font-bold mt-0.5">•</span>
                      <span>Executed contours boundary mapping and tracking in real-time</span>
                    </li>
                    <li className="flex items-start gap-2 text-[11px] text-zinc-350">
                      <span className="text-sky-500 font-bold mt-0.5">•</span>
                      <span>Leveraged OpenCV matrices for fast frame processing cycles</span>
                    </li>
                  </ul>
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  {["OpenCV", "Computer Vision", "Python", "NumPy", "Human-Computer Interaction"].map((tag, tIdx) => (
                    <span key={tIdx} className="text-[9px] font-mono font-medium px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
                      {tag}
                    </span>
                  ))}
                </div>
              </HoverWaveContainer>

              {/* Card 5: Fake News Detection */}
              <HoverWaveContainer className="p-6 bg-transparent border-transparent rounded-3xl md:col-span-2 flex flex-col justify-between space-y-6 group">
                <div className="space-y-4">
                  <div className="flex justify-between items-start gap-4">
                    <span className="text-[10px] font-mono text-[#86868b] uppercase font-semibold">May 2023 • Computational Linguistics</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20 font-medium whitespace-nowrap">
                      Natural Language Processing
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-white group-hover:text-[#2997ff] transition duration-300">
                    Fake News Structural Detection & Text Classification
                  </h4>
                  <p className="text-xs text-[#86868b] leading-relaxed">
                    Developed a robust NLP classifier tracking semantic anomalies and reporting news authenticity index using standard dataset models. Built complete corpus cleaning pipelines utilizing corpus tokenizers and lemmatization.
                  </p>
                  <ul className="space-y-1.5 pt-1.5">
                    <li className="flex items-start gap-2 text-[11px] text-zinc-300">
                      <span className="text-violet-500 font-bold mt-0.5">•</span>
                      <span>Preprocessed raw corpus inputs with NLTK tokenization and TF-IDF vectors</span>
                    </li>
                    <li className="flex items-start gap-2 text-[11px] text-zinc-350">
                      <span className="text-violet-500 font-bold mt-0.5">•</span>
                      <span>Assigned lexical consistency weights and computed binary authenticity values</span>
                    </li>
                  </ul>
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  {["NLP Data Processors", "NLTK Preprocessing", "Python", "Text Classification", "TF-IDF Vectorizers"].map((tag, tIdx) => (
                    <span key={tIdx} className="text-[9px] font-mono font-medium px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
                      {tag}
                    </span>
                  ))}
                </div>
              </HoverWaveContainer>
            </div>
          </div>
        </motion.div>
      )}

      {/* Floating System Glass Toasts Renderer */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none select-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className={`pointer-events-auto p-4 rounded-2xl shadow-2xl border flex items-start gap-3 backdrop-blur-md ${
                toast.type === "success" 
                  ? "bg-[#161617]/95 border-emerald-500/30 text-white" 
                  : "bg-[#161617]/95 border-rose-500/30 text-white"
              }`}
            >
              <div className={`p-1.5 rounded-lg shrink-0 ${
                toast.type === "success" ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
              }`}>
                {toast.type === "success" ? (
                  <ShieldCheck className="w-4 h-4" />
                ) : (
                  <AlertCircle className="w-4 h-4" />
                )}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-mono tracking-wider uppercase text-[#86868b]">
                    {toast.type === "success" ? "Verification OK" : "Verification Failed"}
                  </span>
                  <button 
                    onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
                    className="text-[#86868b] hover:text-white transition text-xs cursor-pointer px-1 pr-1"
                  >
                    ×
                  </button>
                </div>
                <p className="text-xs font-semibold leading-relaxed text-zinc-200 text-left">{toast.message}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Modal Confirmation Dialog for Rerun Suite */}
      <AnimatePresence>
        {confirmModalData && confirmModalData.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              id="rerun-confirm-modal"
              className="w-full max-w-sm bg-[#161617] border border-zinc-800/80 rounded-3xl p-6 shadow-2xl flex flex-col space-y-5"
            >
              {/* Header */}
              <div className="flex items-start gap-4 text-left">
                <div className="p-3 bg-amber-500/10 text-amber-500 rounded-2xl border border-amber-500/20 shrink-0">
                  <Activity className="w-5 h-5 animate-pulse" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold tracking-tight text-white font-sans">
                    Confirm Rerun Activity
                  </h3>
                  <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
                    You are triggering an execution cycle for the target suite(s). Please verify resource context before confirming.
                  </p>
                </div>
              </div>

              {/* Suite Detail Panel */}
              <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-2xl p-4 space-y-3.5 font-mono text-[11px] text-left">
                <div className="flex justify-between items-center border-b border-zinc-900 pb-2">
                  <span className="text-zinc-500">Target Framework</span>
                  <span className="text-zinc-300 font-semibold uppercase">Vitest Core API</span>
                </div>
                <div className="flex justify-between items-start border-b border-zinc-900 pb-2 gap-4">
                  <span className="text-zinc-500 shrink-0">Execution Target</span>
                  <span className="text-white font-semibold text-right break-all max-w-[200px] line-clamp-2">
                    {confirmModalData.suiteName}
                  </span>
                </div>
                {confirmModalData.suiteId && (
                  <div className="flex justify-between items-center border-b border-zinc-900 pb-2">
                    <span className="text-zinc-500">Suite Identifier</span>
                    <span className="text-[#0071e3] font-bold">{confirmModalData.suiteId}</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-zinc-500">Est. Cycle Frame</span>
                  <span className="text-amber-400 font-sans font-medium px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-[10px]">
                    {confirmModalData.duration}
                  </span>
                </div>
              </div>

              {/* Core Accompanying Alert Info */}
              <div className="flex items-start gap-2.5 px-3 py-2 bg-zinc-950/40 rounded-xl border border-zinc-900 text-[10px] text-zinc-500 font-sans leading-relaxed text-left">
                <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>
                  Parallel staging runs allocate dynamic container sandboxes. Running this suite repeatedly can throttle build pipelines on current branch commits.
                </span>
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-end gap-2.5 pt-1.5 font-sans">
                <button
                  id="btn-confirm-cancel"
                  onClick={() => setConfirmModalData(null)}
                  className="px-4 py-2 rounded-full border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-90 w-1/2 sm:w-auto text-center text-xs font-semibold select-none cursor-pointer duration-200"
                >
                  Cancel
                </button>
                <button
                  id="btn-confirm-execute"
                  onClick={confirmRerunHandler}
                  className="px-4 py-2 rounded-full bg-[#0071e3] hover:bg-[#147ce5] text-white w-1/2 sm:w-auto text-center text-xs font-semibold select-none cursor-pointer duration-200 shadow-lg shadow-[#0071e3]/20"
                >
                  Confirm Run
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

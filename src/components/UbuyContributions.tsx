import React, { useState, useMemo } from "react";
import { Award, Zap, Shuffle, ShieldCheck, Cpu, Sliders, TrendingDown, DollarSign } from "lucide-react";
import { motion } from "motion/react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import HoverWaveContainer from "./HoverWaveContainer";

export default function UbuyContributions() {
  // Slider states for the ROI calculator
  const [testCycles, setTestCycles] = useState<number>(4);      // Cycles per month
  const [manualHours, setManualHours] = useState<number>(40);  // Hours needed per manual regression
  const [billingRate, setBillingRate] = useState<number>(55);  // Hourly engineer rate ($)

  // Memoized ROI metrics
  const impactMetrics = useMemo(() => {
    // 1. Manual baseline
    const yearlyManualHours = manualHours * testCycles * 12;
    const yearlyManualCost = yearlyManualHours * billingRate;

    // 2. Automated regression (reduces manual execution time by 40% directly, and stabilizes builds)
    const regressionSavingsMultiplier = 0.40; // 40% reduction in regression bottleneck
    const savedHoursValue = Math.round(yearlyManualHours * regressionSavingsMultiplier);
    const savedDollarValue = Math.round(yearlyManualCost * regressionSavingsMultiplier);
    
    // 3. Ubuy metrics conversions
    const daysSaved = Math.round(savedHoursValue / 8); // Assuming 8-hour work days

    // Generate monthly incremental growth data for Recharts forecast
    const monthlySavings = (manualHours * testCycles * billingRate) * regressionSavingsMultiplier;
    const monthlyHoursValue = (manualHours * testCycles) * regressionSavingsMultiplier;

    const chartData = Array.from({ length: 12 }, (_, i) => {
      const monthNum = i + 1;
      return {
        month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
        Savings: Math.round(monthlySavings * monthNum),
        "Hours Gained": Math.round(monthlyHoursValue * monthNum)
      };
    });

    return {
      yearlyManualCost,
      savedHoursValue,
      savedDollarValue,
      daysSaved,
      monthlySavings,
      chartData
    };
  }, [testCycles, manualHours, billingRate]);

  return (
    <div id="ubuy-contributions" className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start animate-fade-in">
        {/* Left column: Direct Ubuy Case Studies */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 text-[#86868b] text-[10px] font-sans border border-zinc-800 mb-3">
              <Award className="w-3 h-3 text-[#0071e3]" />
              <span>KEY QA CONTRIBUTIONS & IMPACT AT UBUY</span>
            </div>
            <h2 className="text-section-title text-white text-left">
              E-Commerce Regression. <br />
              <span className="text-[#86868b]">Optimized for scale.</span>
            </h2>
            <p className="text-sm text-[#86868b] mt-2 text-left">
              Developing strategies that protect conversion funnels, validate global payments, and accelerate production releases.
            </p>
          </div>

          <div className="space-y-4">
            {/* Achievement 1 */}
            <motion.div 
              whileHover={{ scale: 1.01, x: 2 }}
              className="p-5 rounded-2xl bg-[#111112] border border-[#2c2c2e] flex gap-4 transition-all"
            >
              <div className="w-9 h-9 rounded-full bg-[#0071e3]/10 text-[#0071e3] flex items-center justify-center shrink-0">
                <TrendingDown className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-semibold text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/15">Saves 40% Time</span>
                  <h4 className="text-sm font-semibold text-white">40% Reduction in Regression Bottlenecks</h4>
                </div>
                <p className="text-xs text-[#86868b] leading-relaxed text-left">
                  Refactored our legacy, linear QA regression testing suites into automated, asynchronous parallel-worker threads using fully configured Playwright cluster nodes. Avoided test-flakiness and reduced check periods from 12 hours down to 7.2 hours.
                </p>
              </div>
            </motion.div>

            {/* Achievement 2 */}
            <motion.div 
              whileHover={{ scale: 1.01, x: 2 }}
              className="p-5 rounded-2xl bg-[#111112] border border-[#2c2c2e] flex gap-4 transition-all"
            >
              <div className="w-9 h-9 rounded-full bg-white/5 text-white flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-semibold text-[#86868b] px-2 py-0.5 rounded-full bg-zinc-800 border border-zinc-700">Cross-Browser</span>
                  <h4 className="text-sm font-semibold text-white">Unified Cross-Browser Testing Strategy</h4>
                </div>
                <p className="text-xs text-[#86868b] leading-relaxed text-left">
                  Architected cloud grid integration mappings covering Chrome, Safari, Firefox, iOS, and responsive break-points. Successfully identified 34 critical payment-gateway rendering anomalies before they reached Ubuy production checkouts.
                </p>
              </div>
            </motion.div>

            {/* Achievement 3 */}
            <motion.div 
              whileHover={{ scale: 1.01, x: 2 }}
              className="p-5 rounded-2xl bg-[#111112] border border-[#2c2c2e] flex gap-4 transition-all"
            >
              <div className="w-9 h-9 rounded-full bg-[#0071e3]/10 text-[#0071e3] flex items-center justify-center shrink-0">
                <Shuffle className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-semibold text-[#0071e3] px-2 py-0.5 rounded-full bg-[#0071e3]/10 border border-[#0071e3]/15">CI/CD Trigger</span>
                  <h4 className="text-sm font-semibold text-white">Automated Continuous Integration Smoke Gates</h4>
                </div>
                <p className="text-xs text-[#86868b] leading-relaxed text-left">
                  Integrated high-speed smoke validation tests within GitHub Actions. Tests run automatically on PR merges, blocking broken cart payloads from breaching development branches and protecting vital checkout modules.
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Right column: ROI Metrics Calculator */}
        <HoverWaveContainer className="lg:col-span-6 bg-transparent border-transparent p-6">
          <div className="flex items-center gap-2 mb-4">
            <Sliders className="w-4 h-4 text-[#0071e3]" />
            <h3 className="text-md font-semibold text-white">QA Automation Savings Estimator</h3>
          </div>
          <p className="text-xs text-[#86868b] mb-6 leading-relaxed text-left">
            Adjust the sliders to view standard QA execution bounds and estimate the concrete financial + engineering benefits generated by reducing build bottleneck times by 40%.
          </p>

          <div className="space-y-5 text-left">
            {/* Slider 1: Cycles per Month */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-[#86868b]">Regression Run Cycles / Month</span>
                <span className="text-white font-mono">{testCycles} cycles</span>
              </div>
              <input
                id="slider-test-cycles"
                type="range"
                min="1"
                max="12"
                step="1"
                value={testCycles}
                onChange={(e) => setTestCycles(Number(e.target.value))}
                className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#0071e3] focus:outline-none"
              />
            </div>

            {/* Slider 2: Hours per manual cycle */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-[#86868b]">Original Manual Regression Time / Suite</span>
                <span className="text-white font-mono">{manualHours} hours</span>
              </div>
              <input
                id="slider-manual-hours"
                type="range"
                min="10"
                max="100"
                step="5"
                value={manualHours}
                onChange={(e) => setManualHours(Number(e.target.value))}
                className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#0071e3] focus:outline-none"
              />
            </div>

            {/* Slider 3: Cost Rate per Hour */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-[#86868b]">QA Engineer Hourly Cost</span>
                <span className="text-[#0071e3] font-mono font-bold" id="label-billing-rate">${billingRate}/hr</span>
              </div>
              <input
                id="slider-billing-rate"
                type="range"
                min="25"
                max="120"
                step="5"
                value={billingRate}
                onChange={(e) => setBillingRate(Number(e.target.value))}
                className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#0071e3] focus:outline-none"
              />
            </div>

            {/* Output Metric Blocks */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#2c2c2e]">
              <div className="bg-black border border-[#2c2c2e] rounded-2xl p-4 text-center overflow-hidden">
                <span className="text-[10px] text-[#86868b] uppercase tracking-wider block font-semibold">BUDGET REGAINED</span>
                <span className="text-2xl font-semibold text-white font-mono mt-1 block h-8 overflow-hidden">
                  <motion.span
                    key={impactMetrics.savedDollarValue}
                    initial={{ y: 15, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 220, damping: 14 }}
                    className="inline-block"
                  >
                    ${impactMetrics.savedDollarValue.toLocaleString()}
                  </motion.span>
                </span>
                <span className="text-[9px] text-[#86868b] mt-1 block">at standard 40% gain index</span>
              </div>

              <div className="bg-black border border-[#2c2c2e] rounded-2xl p-4 text-center overflow-hidden">
                <span className="text-[10px] text-[#86868b] uppercase tracking-wider block font-semibold">ENGINEERING HOURS</span>
                <span className="text-2xl font-semibold text-white font-mono mt-1 block h-8 overflow-hidden">
                  <motion.span
                    key={impactMetrics.daysSaved}
                    initial={{ y: 15, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 220, damping: 14 }}
                    className="inline-block"
                  >
                    {impactMetrics.daysSaved} Days
                  </motion.span>
                </span>
                <span className="text-[9px] text-[#86868b] mt-1 block">gained inside launch cycles</span>
              </div>
            </div>

            {/* Recharts interactive savings growth area chart */}
            <div className="bg-black border border-[#2c2c2e] rounded-2xl p-4 md:p-5 my-4">
              <div className="flex justify-between items-center mb-3">
                <div>
                  <span className="text-[10px] text-[#86868b] uppercase tracking-wider block font-semibold">12-MONTH SAVINGS ACCRUEMENT</span>
                  <h4 className="text-xs text-white mt-0.5 font-medium">Projected Accrual Forecast</h4>
                </div>
                <span className="text-xs font-mono text-[#0071e3] font-bold bg-[#0071e3]/10 px-2.5 py-0.5 rounded-full border border-[#0071e3]/20">
                  +${Math.round(impactMetrics.monthlySavings * 12).toLocaleString()}/yr
                </span>
              </div>

              <div className="h-44 w-full" style={{ minHeight: "176px" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={impactMetrics.chartData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0071e3" stopOpacity={0.25}/>
                        <stop offset="95%" stopColor="#0071e3" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2c2c2e" opacity={0.5} />
                    <XAxis 
                       dataKey="month" 
                       stroke="#86868b" 
                       fontSize={10} 
                       tickLine={false} 
                       axisLine={false}
                    />
                    <YAxis 
                      stroke="#86868b" 
                      fontSize={10} 
                      tickLine={false} 
                      axisLine={false}
                      width={45}
                      tickFormatter={(value) => {
                        if (value === 0) return "$0";
                        if (value >= 1000) return `$${(value / 1000).toFixed(0)}k`;
                        return `$${value}`;
                      }}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-[#161617] border border-[#2c2c2e] p-3 rounded-xl shadow-2xl font-sans text-[10px] text-left space-y-1">
                              <p className="text-white font-semibold">{data.month}</p>
                              <p className="text-[#0071e3] font-medium">Savings: <span className="text-white">${data.Savings.toLocaleString()}</span></p>
                              <p className="text-zinc-400 font-medium">Hours: <span className="text-white">{data["Hours Gained"]}h saved</span></p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="Savings" 
                      stroke="#0071e3" 
                      strokeWidth={1.5}
                      fillOpacity={1} 
                      fill="url(#colorSavings)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-black border border-[#2c2c2e] text-xs text-[#86868b] flex items-center gap-2.5 leading-normal">
              <div className="w-1.5 h-1.5 bg-[#0071e3] rounded-full shrink-0" />
              <p className="text-left">
                At Ubuy, shifting key regressions from manual to parallel automated suites freed up average squad capacities by <strong className="text-white font-medium">{(testCycles * manualHours * 12 * 0.4).toFixed(0)} engineering hours</strong> annually.
              </p>
            </div>
          </div>
        </HoverWaveContainer>
      </div>
    </div>
  );
}

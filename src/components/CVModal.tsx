import React, { useRef, useState, useEffect } from "react";
import { X, Printer, Download, Mail, Github, Linkedin, MapPin, Phone, Globe, Briefcase, GraduationCap, Award, BookOpen, Layers, AlertCircle, ExternalLink } from "lucide-react";

interface CVModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CVModal({ isOpen, onClose }: CVModalProps) {
  const printableRef = useRef<HTMLDivElement>(null);
  const [isIframe, setIsIframe] = useState(false);
  const [showPrintHint, setShowPrintHint] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    // Detect if nested within an iframe
    setIsIframe(window.self !== window.top);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setIsFullscreen(false);
      setIsMinimized(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePrint = () => {
    if (window.self !== window.top || isIframe) {
      setShowPrintHint(true);
      // Dismiss after 10 seconds automatically
      setTimeout(() => setShowPrintHint(false), 10000);
    }
    try {
      window.print();
    } catch (err) {
      console.warn("Print operation failed or was blocked by browser sandbox:", err);
    }
  };

  const handleDownloadMarkdown = () => {
    const markdown = `# Dipendu Mukherjee
Jaipur, India | Phone: +91 9804148247 | Email: dipendu.mukherjee.27@gmail.com
LinkedIn: linkedin.com/in/dipendu-mukherjee-4199a8226 | GitHub: github.com/Dipendu27

## SUMMARY
With a year of experience as a Software Tester (QA) at Ubuy, I specialise in manual testing web, iOS and Android applications for a global e-commerce platform. My expertise includes functional, regression and cross-platform testing, such as OneSearch validation and web scraping data accuracy testing. I am also skilled in defect tracking, test case execution and collaborating with cross-functional teams to enhance product stability and user experience. As a detail-oriented professional with strong analytical problem-solving and teamwork abilities, I am eager to contribute to high-impact QA initiatives.

## WORK EXPERIENCE
- Software Tester QA | UBUY Technologies Pvt. Ltd. (Jaipur, India) | Apr 2025 - Present
  * Conducted manual testing of iOS and Android applications for a global e-commerce platform. Identified and documented over 150 functional, UI and usability defects.
  * Performed OneSearch feature testing across web and mobile platforms, improving search accuracy and reducing production issues by ~30%.
  * Conducted web scraping validation and data quality testing, ensuring 95%+ accuracy of product data, pricing, and availability.
  * Carried out functional, regression, and cross-browser testing for core e-commerce modules including search, cart, and checkout flows.
  * Used Jira to log, track, and manage 150+ defects, ensuring clear reproduction steps, severity/priority tagging, and traceability throughout the defect life cycle.
  * Collaborated with developers and product teams to retest fixes and validate releases, reducing defect resolution turnaround time by 20–25%.
  * Assisted in test case mapping and requirement traceability by linking Jira tickets with test scenarios.

- QA Intern | UBUY Technologies Pvt. Ltd. (Jaipur, India) | Feb 2025 - Apr 2025
  * Gained hands-on experience in manual testing of web, iOS, and Android applications for a global e-commerce platform.
  * Executed test cases for functional, UI, and regression testing, identifying defects and ensuring compliance with product requirements.
  * Logged and tracked bugs using Jira, following the complete defect life cycle and coordinating with developers for timely resolution.
  * Assisted in test documentation, test case preparation, and release validation.

- Data Science Intern | Celebel Technologies (Remote) | May 2024 - Jul 2024
  * Applied data science and machine learning techniques to analyse and optimise datasets, improving model accuracy.
  * Successfully developed and deployed a data science project utilising machine learning algorithms, resulting in improved prediction accuracy.

## EDUCATION
- Bachelor of Technology in Computer Science and Engineering | University of Engineering and Management Jaipur | Aug 2021 - May 2025 | Cumulative GPA: 8.17/10.0
  * Major in Computer Science; Specialisation in Artificial Intelligence and Machine Learning
  * Relevant Coursework: Software Testing, Software Engineering, Operating Systems, Algorithms, AIML
- Higher Secondary (12th) | Kalyani Pannalal Institution (WBCHSE) | Mar 2019 - Apr 2021
- Secondary (10th) | Bedibhawan Rabitirtha Vidyalaya (WBBSE) | Feb 2016 - Mar 2019

## UNIVERSITY PROJECTS
- Downscaling of Jodhpur's MODIS Land Surface Temperature Data | May 2025
  * Led the development of a model based on MODIS LST data (2000-present), NDVI (2015-2025), DEM data of Jodhpur. Downscaled LST data from 1km to 10m.
- Enhancing Temporal Analysis of Jodhpur's Land Surface Temperature | Nov 2024
  * Developed a temperature model based on 20 years of historical temperature data, fine-tuning the XGBoost model with GridSearchCV.
- Chronic Kidney Disease Detection | Nov 2023
  * Developed models using different machine learning algorithms to identify CKD status.
- Hand Sign Detection using Machine Learning | Aug 2023
  * Led development of hand sign recognition mechanism using OpenCV.
- Fake News Detection using Machine Learning | May 2023
  * Developed model with NLTK preprocessing to identify keywords and analyze news.

## TECHNICAL SKILLS
- Testing: Manual Testing, Black Box Testing, White Box Testing, Test Suite Execution, Regression Testing, Functional Testing, Smoke Testing, Cross-Browser Testing (Chrome, Firefox, Safari, Edge), Web Application Testing, Backend Testing (API / Data Validation)
- Quality Processes: Requirement Analysis, Acceptance Criteria Validation, Defect Tracking & Management, Test Execution Tracking, SDLC / STLC, Agile / Scrum, Bug Life Cycle, Defect Prevention, Root Cause Analysis (RCA), JIRA
- Programming & AI: JAVA, Python, AIML, Deep Learning, SQL, Shell Scripting, jq, Docker, AWS CLI
- Languages: Fluent in Bengali, English; Conversational Proficiency in Hindi
- Certifications: Online Course in Software Testing (Coursera)
`;

    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "Dipendu_Mukherjee_Resume.md");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isMinimized) {
    return (
      <div 
        className="fixed bottom-6 right-6 z-[150] bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-xl shadow-2xl flex items-center gap-3.5 px-4 py-3 text-white pointer-events-auto border-cyan-500/30 shadow-cyan-500/10 transition-all hover:border-cyan-500/50"
        style={{ animation: "scale-up 0.2s ease-out" }}
      >
        <div className="flex items-center gap-1.5 group/window-min">
          <button
            onClick={onClose}
            className="w-3 h-3 rounded-full bg-[#ff453a] hover:bg-[#ff5c52] transition-colors relative p-0 border-0 outline-none select-none"
            title="Close CV"
          >
            <svg 
              className="opacity-0 group-hover/window-min:opacity-100 transition-opacity absolute inset-0 w-full h-full text-red-950/90" 
              viewBox="0 0 12 12" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.6" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M4 4L8 8M8 4L4 8" />
            </svg>
          </button>
          <button
            onClick={() => setIsMinimized(false)}
            className="w-3 h-3 rounded-full bg-[#ff9f0a] hover:bg-[#ffb034] transition-colors relative p-0 border-0 outline-none select-none"
            title="Restore CV"
          >
            <svg 
              className="opacity-0 group-hover/window-min:opacity-100 transition-opacity absolute inset-0 w-full h-full text-amber-950/90" 
              viewBox="0 0 12 12" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.6" 
              strokeLinecap="round"
            >
              <path d="M3.5 6H8.5" />
            </svg>
          </button>
          <button
            disabled
            className="w-3 h-3 rounded-full bg-[#32d74b] opacity-40 relative p-0 border-0 outline-none select-none"
          >
            {/* Disabled, no symbol displayed */}
          </button>
        </div>
        
        <div 
          onClick={() => setIsMinimized(false)}
          className="text-xs font-mono text-slate-300 hover:text-white cursor-pointer select-none font-semibold flex items-center gap-2"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Dipendu_Mukherjee_CV.pdf (Minimized)</span>
        </div>

        <button
          onClick={() => setIsMinimized(false)}
          className="text-[10.5px] font-sans font-bold bg-slate-800 hover:bg-slate-700 text-slate-100 px-2.5 py-1 rounded transition duration-150 cursor-pointer border border-slate-700 hover:border-slate-600 shadow"
        >
          Restore
        </button>
      </div>
    );
  }

  return (
    <div 
      id="cv-modal-wrapper" 
      className={`fixed inset-0 z-[100] flex justify-center items-center transition-all duration-300 ${
        isFullscreen ? "p-0" : "p-4"
      }`}
    >
      {/* Background overlay */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md no-print" 
        onClick={onClose}
      />

      {/* Styled inline media query for perfect clean printing */}
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 12mm 15mm 12mm 15mm !important;
          }
          html, body {
            background-color: #ffffff !important;
            background: white !important;
            color: #000000 !important;
            height: auto !important;
            min-height: 0 !important;
            overflow: visible !important;
            margin: 0 !important;
            padding: 0 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          /* Override body outer container style and let it flow and scroll for full multi-page prints */
          body > #root, 
          body > #root > div {
            background-color: #ffffff !important;
            background: white !important;
            color: #000000 !important;
            min-height: 0 !important;
            height: auto !important;
            overflow: visible !important;
            position: static !important;
            padding: 0 !important;
            margin: 0 !important;
            display: block !important;
          }
          /* Hide everything in #root except the cv-modal-wrapper container */
          body > #root > div > *:not(#cv-modal-wrapper) {
            display: none !important;
          }
          #cv-modal-wrapper {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            height: auto !important;
            min-height: 0 !important;
            padding: 0 !important;
            margin: 0 !important;
            background-color: #ffffff !important;
            background: white !important;
            box-shadow: none !important;
            border: none !important;
            overflow: visible !important;
            display: block !important;
          }
          #printable-cv-modal-container {
            position: relative !important;
            width: 100% !important;
            height: auto !important;
            min-height: 0 !important;
            max-height: none !important;
            padding: 0 !important;
            margin: 0 !important;
            background-color: #ffffff !important;
            background: white !important;
            box-shadow: none !important;
            border: none !important;
            overflow: visible !important;
            display: block !important;
          }
          .print-scroll-container {
            overflow: visible !important;
            display: block !important;
            height: auto !important;
            min-height: 0 !important;
            max-height: none !important;
            padding: 0 !important;
            margin: 0 !important;
            background-color: #ffffff !important;
            background: white !important;
            position: static !important;
          }
          .print-paper {
            width: 100% !important;
            max-width: 100% !important;
            box-shadow: none !important;
            border: none !important;
            padding: 0 !important;
            margin: 0 !important;
            color: #000000 !important;
            background-color: #ffffff !important;
            background: white !important;
            display: block !important;
            overflow: visible !important;
            height: auto !important;
            position: static !important;
          }
          .no-print {
            display: none !important;
          }
          .print-text-dark {
            color: #000000 !important;
          }
          .print-text-muted {
            color: #374151 !important;
          }
          .print-divider {
            border-color: #9ca3af !important;
          }
          /* Break sections gracefully */
          h1, h2, h3, h4, h5, h6 {
            page-break-after: avoid !important;
            break-after: avoid !important;
          }
          /* Keep individual items intact while letting container flow naturally */
          .print-paper > div {
            page-break-inside: auto !important;
            break-inside: auto !important;
          }
          .space-y-1.5, .space-y-3 > div, .space-y-4 > div {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
        }
      `}</style>
      <div 
        id="printable-cv-modal-container"
        className={`w-full bg-slate-900 border border-slate-800 flex flex-col overflow-hidden shadow-2xl relative transition-all duration-300 ease-out z-10 ${
          isFullscreen 
            ? "fixed inset-0 w-screen h-screen max-w-none rounded-none border-none z-[101]" 
            : "max-w-4xl h-[90vh] rounded-2xl animate-scale-up"
        }`}
      >
        {/* Navigation / Actions Bar */}
        <div className="no-print bg-slate-950 px-6 py-4 border-b border-slate-800 flex justify-between items-center select-none">
          <div className="flex items-center gap-1.5 group/window">
            <button
              onClick={onClose}
              className="w-3 h-3 rounded-full bg-[#ff453a] hover:bg-[#ff5c52] transition-colors relative p-0 border-0 outline-none select-none"
              title="Close"
            >
              <svg 
                className="opacity-0 group-hover/window:opacity-100 transition-opacity absolute inset-0 w-full h-full text-red-950/90" 
                viewBox="0 0 12 12" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="1.6" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M4 4L8 8M8 4L4 8" />
              </svg>
            </button>
            <button
              onClick={() => setIsMinimized(true)}
              className="w-3 h-3 rounded-full bg-[#ff9f0a] hover:bg-[#ffb034] transition-colors relative p-0 border-0 outline-none select-none"
              title="Minimize"
            >
              <svg 
                className="opacity-0 group-hover/window:opacity-100 transition-opacity absolute inset-0 w-full h-full text-amber-950/90" 
                viewBox="0 0 12 12" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="1.7" 
                strokeLinecap="round"
              >
                <path d="M3.5 6H8.5" />
              </svg>
            </button>
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="w-3 h-3 rounded-full bg-[#32d74b] hover:bg-[#4ddf64] transition-colors relative p-0 border-0 outline-none select-none"
              title={isFullscreen ? "Restore standard view" : "Maximize view"}
            >
              {isFullscreen ? (
                <svg 
                  className="opacity-0 group-hover/window:opacity-100 transition-opacity absolute inset-0 w-full h-full text-emerald-950/90" 
                  viewBox="0 0 12 12" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M3.5 8.5L8.5 3.5M3.5 6V8.5H6M6 3.5H8.5V6" />
                </svg>
              ) : (
                <svg 
                  className="opacity-0 group-hover/window:opacity-100 transition-opacity absolute inset-0 w-full h-full text-emerald-950/90" 
                  viewBox="0 0 12 12" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="1.6" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M3.5 6H8.5M6 3.5V8.5" />
                </svg>
              )}
            </button>
            <span className="text-xs font-mono text-slate-400 ml-2 hidden sm:inline select-none">Dipendu_Mukherjee_CV.pdf</span>
          </div>

          <div className="flex items-center gap-3">
            {isIframe && (
              <a
                href={window.location.origin || window.location.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold px-3 py-1.5 rounded-md transition duration-200 shadow-[0_0_8px_rgba(217,119,6,0.2)] cursor-pointer"
                title="Open portfolio in a new tab for seamless printing"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open in New Tab</span>
              </a>
            )}

            {/* Print trigger */}
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-3 py-1.5 rounded-md transition duration-200"
              title="Print CV or save to PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Save / Print PDF</span>
            </button>

            {/* Markdown export */}
            <button
              onClick={handleDownloadMarkdown}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-3 py-1.5 rounded-md transition duration-200"
              title="Download neat markdown file"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download MD</span>
            </button>
          </div>
        </div>

        {/* Scrollable Printable CV Document Area */}
        <div className="print-scroll-container flex-1 overflow-y-auto bg-slate-950 p-[12px] sm:p-8 flex flex-col items-center justify-start text-left">
          
          {/* Iframe Notice */}
          {isIframe && (
            <div className="no-print mb-4 p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-xs text-amber-200 flex items-start gap-3 max-w-3xl w-full leading-relaxed shadow-lg">
              <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-semibold text-amber-300">Sandbox Preview Alert</p>
                <p className="text-[11px] text-amber-200/80">
                  You are viewing this portfolio within a nested browser frame, which may block standard device print overlays. If the <span className="font-semibold text-white">Save / Print PDF</span> button does not launch your printer window, please click here to{" "}
                  <a 
                    href={window.location.origin || window.location.href} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="font-bold text-amber-300 underline hover:text-amber-100 inline-flex items-center gap-1 bg-amber-500/20 hover:bg-amber-500/30 px-2 py-0.5 rounded transition duration-150 cursor-pointer"
                  >
                    Open in New Tab <ExternalLink className="w-3.5 h-3.5" />
                  </a>{" "}
                  to run the app independently and print cleanly!
                </p>
              </div>
            </div>
          )}

          <div 
            ref={printableRef}
            className="print-paper w-full max-w-3xl bg-white text-slate-900 px-6 py-8 sm:px-12 sm:py-12 rounded-xl shadow-lg border border-slate-100 flex flex-col space-y-6"
          >
            {/* CV Header */}
            <div className="text-center space-y-2 border-b-2 border-slate-800 pb-5">
              <h1 className="print-text-dark text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Dipendu Mukherjee
              </h1>
              <p className="print-text-dark text-sm sm:text-base font-semibold text-indigo-700 tracking-wide uppercase">
                Software Tester (QA) & QA Specialist
              </p>
              
              {/* Contact Grid */}
              <div className="print-text-muted flex flex-wrap justify-center gap-x-5 gap-y-1.5 text-xs text-slate-600 font-sans mt-3">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-500" />
                  <span>Jaipur, India</span>
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  <span>+91 9804148247</span>
                </span>
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  <a href="mailto:dipendu.mukherjee.27@gmail.com" className="hover:underline">dipendu.mukherjee.27@gmail.com</a>
                </span>
                <span className="flex items-center gap-1">
                  <Linkedin className="w-3.5 h-3.5 text-slate-500" />
                  <a href="https://www.linkedin.com/in/dipendu-mukherjee-4199a8226" target="_blank" rel="noopener noreferrer" className="hover:underline">LinkedIn</a>
                </span>
                <span className="flex items-center gap-1">
                  <Github className="w-3.5 h-3.5 text-slate-500" />
                  <a href="https://github.com/Dipendu27" target="_blank" rel="noopener noreferrer" className="hover:underline">GitHub</a>
                </span>
              </div>
            </div>

            {/* Summary Section */}
            <div className="space-y-1.5">
              <h2 className="print-text-dark text-sm uppercase tracking-wider font-extrabold text-slate-900 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-slate-700" />
                <span>SUMMARY</span>
              </h2>
              <div className="print-divider border-b border-slate-200" />
              <p className="print-text-muted text-[13px] leading-relaxed text-slate-700 pt-1 text-justify">
                With a year of experience as a Software Tester (QA) at Ubuy, I specialise in manual testing web, iOS and Android applications 
                for a global e-commerce platform. My expertise includes functional, regression and cross-platform testing, such as OneSearch 
                validation and web scraping data accuracy testing. I am also skilled in defect tracking, test case execution and collaborating with 
                cross-functional teams to enhance product stability and user experience. As a detail-oriented professional with strong analytical 
                problem-solving and teamwork abilities, I am eager to contribute to high-impact QA initiatives.
              </p>
            </div>

            {/* Work Experience Section */}
            <div className="space-y-4">
              <div>
                <h2 className="print-text-dark text-sm uppercase tracking-wider font-extrabold text-slate-900 flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-slate-700" />
                  <span>WORK EXPERIENCE</span>
                </h2>
                <div className="print-divider border-b border-slate-200 mt-1.5" />
              </div>

              <div className="space-y-4">
                {/* Ubuy - tester QA */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="print-text-dark text-[13px] font-extrabold text-slate-950">
                        UBUY Technologies Pvt. Ltd.
                      </h3>
                      <p className="text-xs font-semibold text-slate-600">Software Tester QA</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-semibold text-slate-700">Jaipur, Rajasthan</p>
                      <p className="text-[11px] text-slate-500 font-medium">Apr 2025 – Present</p>
                    </div>
                  </div>
                  <ul className="print-text-muted list-disc pl-5 text-[11.5px] leading-relaxed text-slate-700 space-y-1">
                    <li>Conducted manual testing of iOS and Android applications for a global e-commerce platform. Identified and documented over 150 functional, UI and usability defects.</li>
                    <li>Performed OneSearch feature testing across web and mobile platforms, improving search accuracy and reducing production issues by ~30%.</li>
                    <li>Conducted web scraping validation and data quality testing, ensuring 95%+ accuracy of product data, pricing, and availability across regions.</li>
                    <li>Carried out functional, regression, and cross-browser testing for core e-commerce modules including search, cart, and checkout flows.</li>
                    <li>Used Jira to log, track, and manage 150+ defects, ensuring clear reproduction steps, severity/priority tagging, and traceability throughout the defect life cycle.</li>
                    <li>Collaborated with developers and product teams to retest fixes and validate releases, contributing to improved release stability and reduced post-production defects.</li>
                    <li>Collaborated with cross-functional teams using Jira workflows, reducing defect resolution turnaround time by 20–25%.</li>
                    <li>Assisted in test case mapping and requirement traceability by linking Jira tickets with test scenarios.</li>
                  </ul>
                </div>

                {/* Ubuy - QA Intern */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="print-text-dark text-[13px] font-extrabold text-slate-950">
                        UBUY Technologies Pvt. Ltd.
                      </h4>
                      <p className="text-xs font-semibold text-slate-600">QA Intern</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-semibold text-slate-700">Jaipur, Rajasthan</p>
                      <p className="text-[11px] text-slate-500 font-medium font-sans">Feb 2025 – Apr 2025</p>
                    </div>
                  </div>
                  <ul className="print-text-muted list-disc pl-5 text-[11.5px] leading-relaxed text-slate-700 space-y-1">
                    <li>Worked as a QA Intern, gaining hands-on experience in manual testing of web, iOS, and Android applications for a global e-commerce platform.</li>
                    <li>Executed test cases for functional, UI, and regression testing, identifying defects and ensuring compliance with product requirements.</li>
                    <li>Logged and tracked bugs using Jira, following the complete defect life cycle and coordinating with developers for timely resolution.</li>
                    <li>Assisted in test documentation, test case preparation, and release validation.</li>
                  </ul>
                </div>

                {/* Celebel */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="print-text-dark text-[13px] font-extrabold text-slate-950">
                        Celebel Technologies
                      </h4>
                      <p className="text-xs font-semibold text-slate-600">Data Science Intern</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-semibold text-slate-700">Remote</p>
                      <p className="text-[11px] text-slate-500 font-medium">May 2024 – Jul 2024</p>
                    </div>
                  </div>
                  <ul className="print-text-muted list-disc pl-5 text-[11.5px] leading-relaxed text-slate-700 space-y-1">
                    <li>Applied data science and machine learning techniques to analyse and optimise datasets, improving model accuracy.</li>
                    <li>Gained practical experience in a professional setting which improved collaboration and problem-solving skills.</li>
                    <li>Successfully developed and deployed a data science project utilising machine learning algorithms, resulting in improved prediction accuracy.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Technical Skills Section */}
            <div className="space-y-1.5">
              <h2 className="print-text-dark text-sm uppercase tracking-wider font-extrabold text-slate-900 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-slate-700" />
                <span>TECHNICAL SKILLS</span>
              </h2>
              <div className="print-divider border-b border-slate-200" />
              <div className="print-text-muted text-[12px] leading-relaxed text-slate-700 pt-1.5 space-y-1.5">
                <p>
                  <strong className="print-text-dark text-slate-950">Testing Methodologies:</strong> Manual Testing, Black Box Testing, White Box Testing, Test Suite Execution, Regression Testing, Functional Testing, Smoke Testing, Cross-Browser Testing (Chrome, Firefox, Safari, Edge), Web Application Testing, Backend Testing (API / Data Validation)
                </p>
                <p>
                  <strong className="print-text-dark text-slate-950">Quality Processes & Tools:</strong> Requirement Analysis, Acceptance Criteria Validation, Defect Tracking & Management, Test Execution Tracking, Bug Life Cycle, Defect Prevention, Root Cause Analysis (RCA), JIRA
                </p>
                <p>
                  <strong className="print-text-dark text-slate-950">Programming & AI:</strong> JAVA, Python, AIML, Deep Learning, SQL, Shell Scripting, jq, Docker, AWS CLI
                </p>
                <p>
                  <strong className="print-text-dark text-slate-950">Languages:</strong> Fluent in Bengali, English; Conversational Proficiency in Hindi
                </p>
                <p>
                  <strong className="print-text-dark text-slate-950">Certifications:</strong> Online Course in Software Testing (Coursera)
                </p>
              </div>
            </div>

            {/* University Projects Section */}
            <div className="space-y-3">
              <div>
                <h2 className="print-text-dark text-sm uppercase tracking-wider font-extrabold text-slate-900 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-slate-700" />
                  <span>UNIVERSITY PROJECTS</span>
                </h2>
                <div className="print-divider border-b border-slate-200 mt-1.5" />
              </div>

              <div className="space-y-3 text-[11.5px] leading-relaxed text-slate-755">
                <div>
                  <div className="flex justify-between items-baseline font-bold print-text-dark text-slate-900">
                    <span>Downscaling of Jodhpur’s MODIS Land Surface Temperature Data</span>
                    <span className="text-[10px] text-slate-500 font-medium">May 2025</span>
                  </div>
                  <p className="print-text-muted text-slate-600 pl-2">
                    Led the development of a model based on MODIS LST data (2000-present), NDVI (2015-2025) and DEM data to downscale details of Jodhpur from 1km resolution to 10m.
                  </p>
                </div>
                <div>
                  <div className="flex justify-between items-baseline font-bold print-text-dark text-slate-900">
                    <span>Enhancing Temporal Analysis of Jodhpur's LST</span>
                    <span className="text-[10px] text-slate-500 font-medium">Nov 2024</span>
                  </div>
                  <p className="print-text-muted text-slate-600 pl-2">
                    Designed and built a predictive thermal analyzer backed by 20 years of historical temperatures, utilizing model-tuning algorithms like XGBoost and GridSearchCV.
                  </p>
                </div>
                <div>
                  <div className="flex justify-between items-baseline font-bold print-text-dark text-slate-900">
                    <span>Chronic Kidney Disease Detection</span>
                    <span className="text-[10px] text-slate-500 font-medium">Nov 2023</span>
                  </div>
                  <p className="print-text-muted text-slate-600 pl-2">
                    Coded multiple diagnostic classification models to analyze risk vectors and choose the highest-accuracy ensemble.
                  </p>
                </div>
                <div>
                  <div className="flex justify-between items-baseline font-bold print-text-dark text-slate-900">
                    <span>Hand Sign Detection using Machine Learning</span>
                    <span className="text-[10px] text-slate-500 font-medium">Aug 2023</span>
                  </div>
                  <p className="print-text-muted text-slate-600 pl-2">
                    Led development of hand sign recognition mechanism using OpenCV.
                  </p>
                </div>
                <div>
                  <div className="flex justify-between items-baseline font-bold print-text-dark text-slate-900">
                    <span>Fake News Detection using Machine Learning</span>
                    <span className="text-[10px] text-slate-500 font-medium">May 2023</span>
                  </div>
                  <p className="print-text-muted text-slate-600 pl-2">
                    Developed model with NLTK preprocessing to identify keywords and analyze news.
                  </p>
                </div>
              </div>
            </div>

            {/* Education Section */}
            <div className="space-y-3">
              <div>
                <h2 className="print-text-dark text-sm uppercase tracking-wider font-extrabold text-slate-900 flex items-center gap-1.5">
                  <GraduationCap className="w-4.5 h-4.5 text-slate-700" />
                  <span>EDUCATION</span>
                </h2>
                <div className="print-divider border-b border-slate-200 mt-1.5" />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="print-text-dark text-[12px] font-extrabold text-slate-900">
                      University of Engineering and Management Jaipur
                    </h4>
                    <p className="text-xs text-slate-600 font-medium">
                      Bachelor of Technology in Computer Science and Engineering
                    </p>
                    <p className="text-[11px] text-slate-500 leading-tight">
                      Specialisation in Artificial Intelligence and Machine Learning | Cumulative GPA: 8.17/10.0
                    </p>
                  </div>
                  <div className="text-right text-xs">
                    <p className="font-semibold text-slate-700">Jaipur, Rajasthan</p>
                    <p className="text-slate-500 font-medium font-sans">Aug 2021 - May 2025</p>
                  </div>
                </div>

                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="print-text-dark text-[12px] font-extrabold text-slate-900">
                      Kalyani Pannalal Institution
                    </h4>
                    <p className="text-xs text-slate-600 font-medium">Higher Secondary Schooling (12th)</p>
                  </div>
                  <div className="text-right text-xs">
                    <p className="font-semibold text-slate-700 font-sans">Kalyani, West Bengal</p>
                    <p className="text-slate-500 font-medium font-sans">Mar 2019 - Apr 2021</p>
                  </div>
                </div>

                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="print-text-dark text-[12px] font-extrabold text-slate-900">
                      Bedibhawan Rabitirtha Vidyalaya
                    </h4>
                    <p className="text-xs text-slate-600 font-medium">Secondary Schooling (10th)</p>
                  </div>
                  <div className="text-right text-xs">
                    <p className="font-semibold text-slate-700 font-sans">Kalyani, West Bengal</p>
                    <p className="text-slate-500 font-medium font-sans">Feb 2016 - Mar 2019</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Print Hint Toast Overlay */}
        {showPrintHint && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-md bg-zinc-950/95 backdrop-blur-md border border-amber-500/30 rounded-2xl p-4 shadow-2xl flex items-start gap-3 text-left animate-fade-in no-print">
            <div className="p-2 bg-amber-500/10 text-amber-500 rounded-xl border border-amber-500/20 shrink-0">
              <Printer className="w-4 h-4 animate-pulse" />
            </div>
            <div className="flex-1 space-y-1">
              <h5 className="text-[12px] font-bold text-white tracking-snug">Launching Device Printer...</h5>
              <p className="text-[10px] text-zinc-300/90 leading-normal">
                If the device print dialog did not launch, browser iframe sandboxing is blocking it. Please click here to{" "}
                <a 
                  href={window.location.origin || window.location.href} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-amber-300 font-semibold underline hover:text-amber-100 inline-flex items-center gap-0.5 bg-amber-500/10 hover:bg-amber-500/20 px-1.5 py-0.5 rounded transition cursor-pointer"
                >
                  Open in New Tab <ExternalLink className="w-2.5 h-2.5" />
                </a>{" "}
                to run the app independently and print directly!
              </p>
            </div>
            <button 
              onClick={() => setShowPrintHint(false)}
              className="text-zinc-500 hover:text-white p-1 shrink-0 self-start hover:bg-zinc-800 rounded-lg transition duration-150 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

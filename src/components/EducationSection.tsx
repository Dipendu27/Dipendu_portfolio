import React, { useState } from "react";
import { GraduationCap, Award, Calendar, MapPin, Users, Heart, Camera, Gamepad, Folder } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import HoverWaveContainer from "./HoverWaveContainer";

type ActiveTab = "academics" | "certifications" | "activities";

export default function EducationSection() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("academics");

  const academics = [
    {
      degree: "Bachelor of Technology (B.Tech)",
      major: "Computer Science and Engineering",
      institution: "University of Engineering and Management, Jaipur",
      period: "Aug 2021 - May 2025",
      location: "Jaipur, Rajasthan",
      grade: "Cumulative GPA: 8.17 / 10.0",
      highlights: [
        "Specialisation in Artificial Intelligence and Machine Learning",
        "Relevant Coursework: Software Testing methodologies, Software Engineering principles, Advanced Operating Systems, Algorithms design, AIML models and architectures"
      ],
      badge: "Class Representative"
    },
    {
      degree: "Higher Secondary Education (12th)",
      major: "Science Stream (WBCHSE Board)",
      institution: "Kalyani Pannalal Institution",
      period: "Mar 2019 - Apr 2021",
      location: "Kalyani, West Bengal",
      grade: "Completed with High Division standings",
      highlights: [
        "Focused study in Mathematics, Physics, Chemistry, and Computer Science",
        "Deepened logical foundation and statistical calculation competencies"
      ],
      badge: "School Prefect"
    },
    {
      degree: "Secondary Education (10th)",
      major: "General Curriculums (WBBSE Board)",
      institution: "Bedibhawan Rabitirtha Vidyalaya",
      period: "Feb 2006 - Mar 2019",
      location: "Bedibhawan, West Bengal",
      grade: "First Class with Distinction",
      highlights: [
        "Strong fundamental training in Mathematics and Sciences",
        "Active participate in local scholastic quiz tournaments"
      ],
      badge: "Science Exhibit Winner"
    }
  ];

  const certifications = [
    {
      title: "Online Course in Software Testing",
      issuer: "Coursera (In collaboration with leading institutions)",
      period: "Verified Candidate Status",
      description: "Comprehensive qualification covering systematic black box testing frameworks, test boundary analysis, verification matrices, testing automation principles, and bug lifecycle coordination flows in modern engineering cycles."
    },
    {
      title: "Deep Learning Foundations Spec",
      issuer: "Analytical campus training loops",
      period: "Ongoing Refinement",
      description: "Foundational mastery in neural connection arrays, CNN architecture optimization, loss computation mechanisms, and multi-model matrix weights tuning."
    }
  ];

  const activities = [
    {
      role: "Photography Club Lead",
      organization: "University Photography Council",
      period: "2022 - 2025",
      icon: Camera,
      color: "text-amber-400 border-amber-500/20 bg-amber-500/10",
      description: "Successfully organized over 15 high-impact campus-wide photography events, contests, and art exhibitions, leading a committee of 12 active student organizers.",
      achievements: [
        "Initiated and coordinated multiple geographic photography field excursions across Rajasthan landmarks",
        "Built custom digital canvas showcase highlighting student visual submissions"
      ]
    },
    {
      role: "ACEHACK Committee Member",
      organization: "Acehack Hackathon Network India",
      period: "2023 - 2025",
      icon: Users,
      color: "text-blue-400 border-blue-500/20 bg-blue-500/10",
      description: "Active logistical planning and review committee member organizing national, high-volume student developer hackathons with active sponsorships and multi-track submissions evaluation.",
      achievements: [
        "Facilitated developer mentorship loops and scheduled server resources checkups for 300+ attendees",
        "Led public outreach programs and drafted critical quality evaluation rules and test criteria"
      ]
    },
    {
      role: "Gaming Club Event Manager",
      organization: "Campus Esports Association",
      period: "2022 - 2024",
      icon: Gamepad,
      color: "text-violet-400 border-violet-500/20 bg-violet-500/10",
      description: "Successfully organized and managed more than 5 campus-wide multiplayer gaming tournaments, optimizing networking configs and brackets layouts for a total roster of 150+ competitors.",
      achievements: [
        "Instituted transparent fairness verification audits and fast disputes resolution protocols",
        "Handled corporate sponsor alignments and student crowd engagement"
      ]
    }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "academics":
        return (
          <motion.div
            key="academics"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            {academics.map((acad, idx) => (
              <HoverWaveContainer
                key={idx}
                className="p-6 bg-transparent border-transparent rounded-3xl"
              >
                <div className="flex flex-col md:flex-row justify-between items-start gap-4 text-left">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-base font-bold text-white tracking-tight">{acad.degree}</h4>
                      <span className="px-2 py-0.5 rounded-full bg-zinc-900 text-[#86868b] text-[9px] font-mono border border-zinc-800 font-semibold uppercase">
                        {acad.badge}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-[#0071e3] tracking-wide uppercase">
                      {acad.major}
                    </div>
                    <div className="text-xs text-zinc-400 font-medium">
                      {acad.institution}
                    </div>
                    <ul className="space-y-1.5 pt-2">
                      {acad.highlights.map((h, hIdx) => (
                        <li key={hIdx} className="flex items-start gap-2 text-[11px] text-[#86868b] leading-relaxed">
                          <span className="text-[#0071e3] font-bold mt-0.5">•</span>
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="md:text-right shrink-0 space-y-1 text-xs">
                    <div className="flex md:justify-end items-center gap-1.5 text-[#fff] font-mono font-semibold">
                      <Calendar className="w-3.5 h-3.5 text-[#2997ff]" />
                      <span>{acad.period}</span>
                    </div>
                    <div className="flex md:justify-end items-center gap-1.5 text-zinc-500">
                      <MapPin className="w-3.5 h-3.5 text-zinc-600" />
                      <span>{acad.location}</span>
                    </div>
                    <div className="pt-2">
                      <span className="px-2 py-1 rounded bg-[#0071e3]/10 text-[#2997ff] border border-[#0071e3]/20 font-mono font-semibold tracking-tight text-[10px]">
                        {acad.grade}
                      </span>
                    </div>
                  </div>
                </div>
              </HoverWaveContainer>
            ))}
          </motion.div>
        );
      case "certifications":
        return (
          <motion.div
            key="certifications"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {certifications.map((cert, idx) => (
              <HoverWaveContainer
                key={idx}
                className="p-6 bg-transparent border-transparent rounded-3xl flex flex-col justify-between text-left space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-baseline gap-2">
                    <span className="text-[10px] font-mono text-indigo-400 uppercase font-semibold">CERTIFIED MODULE</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-500 font-mono font-medium border border-zinc-800">
                      {cert.period}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white tracking-tight">{cert.title}</h4>
                  <div className="text-xs text-zinc-500 font-semibold">{cert.issuer}</div>
                  <p className="text-xs text-[#86868b] leading-relaxed pt-2">
                    {cert.description}
                  </p>
                </div>
                <div className="pt-2 flex items-center gap-1 text-[10px] font-mono text-[#2997ff] font-semibold">
                  <Award className="w-3.5 h-3.5" />
                  <span>Credential ID Registered In-CV</span>
                </div>
              </HoverWaveContainer>
            ))}
          </motion.div>
        );
      case "activities":
        return (
          <motion.div
            key="activities"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            {activities.map((act, idx) => {
              const IconComp = act.icon;
              return (
                <HoverWaveContainer
                  key={idx}
                  className="p-6 bg-transparent border-transparent rounded-3xl"
                >
                  <div className="flex flex-col md:flex-row justify-between items-start gap-4 text-left">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl border ${act.color}`}>
                          <IconComp className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white tracking-tight">{act.role}</h4>
                          <span className="text-xs text-zinc-500 font-semibold">{act.organization}</span>
                        </div>
                      </div>
                      <p className="text-xs text-[#86868b] leading-relaxed">
                        {act.description}
                      </p>
                      <ul className="space-y-1">
                        {act.achievements.map((item, iIdx) => (
                          <li key={iIdx} className="flex items-start gap-2 text-[11px] text-[#86868b] leading-relaxed">
                            <span className="text-zinc-700 font-bold">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="md:text-right shrink-0 space-y-1 text-xs">
                      <div className="flex md:justify-end items-center gap-1.5 text-zinc-400 font-mono font-semibold">
                        <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                        <span>{act.period}</span>
                      </div>
                    </div>
                  </div>
                </HoverWaveContainer>
              );
            })}
          </motion.div>
        );
    }
  };

  return (
    <div id="education-activities" className="w-full text-left">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 text-[#86868b] text-[10px] font-sans border border-zinc-800 mb-3">
            <GraduationCap className="w-3 h-3 text-[#0071e3]" />
            <span>ACADEMIC TIMELINE</span>
          </div>
          <h2 className="text-section-title text-white">Academic Journey & Leadership</h2>
          <p className="text-sm text-[#86868b] mt-1.5">
            Explore academic checkpoints, verified software testing certificates, and campus club structures.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex bg-zinc-950 p-[3px] rounded-full border border-[#2c2c2e] select-none text-xs">
          {(["academics", "certifications", "activities"] as ActiveTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-4 py-1.5 rounded-full text-xs font-semibold cursor-pointer relative transition duration-200"
            >
              {activeTab === tab && (
                <motion.div
                  layoutId="activeEducationTab"
                  className="absolute inset-0 bg-white rounded-full"
                  transition={{ type: "spring", stiffness: 350, damping: 26 }}
                />
              )}
              <span className={`relative z-10 transition-colors duration-200 capitalize ${
                activeTab === tab ? "text-black font-semibold" : "text-zinc-400 hover:text-white"
              }`}>
                {tab === "academics" ? "Education" : tab === "certifications" ? "Certifications" : "Leadership"}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          {renderContent()}
        </AnimatePresence>
      </div>
    </div>
  );
}

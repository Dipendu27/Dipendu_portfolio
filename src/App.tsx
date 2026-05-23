import {
  BriefcaseBusiness,
  CheckCircle2,
  Download,
  GraduationCap,
  Linkedin,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

const email = "dipendu.mukherjee.27@gmail.com";
const phone = "+91 9804148247";
const linkedIn = "https://www.linkedin.com/in/dipendu-mukherjee-4199a8226";

const navItems = [
  ["About", "about"],
  ["Experience", "experience"],
  ["Skills", "skills"],
  ["Projects", "projects"],
  ["Education", "education"],
  ["Contact", "contact"],
];

const stats = [
  ["150+", "Defects identified"],
  ["95%+", "Data accuracy validation"],
  ["30%", "Production issue reduction"],
  ["20-25%", "Faster defect turnaround"],
];

const strengths = [
  "Manual, functional, regression, UI, and usability testing",
  "Cross-browser and cross-platform validation for web, iOS, and Android",
  "Jira defect lifecycle management with clear reproduction evidence",
  "OneSearch, cart, checkout, and e-commerce data quality validation",
];

const experiences = [
  {
    period: "Apr 2025 - Present",
    role: "Software Tester QA",
    company: "UBUY Technologies Pvt. Ltd.",
    location: "Jaipur, Rajasthan",
    points: [
      "Tested web, iOS, and Android applications for a global e-commerce platform.",
      "Identified and documented 150+ functional, UI, and usability defects.",
      "Validated OneSearch, product data, pricing, availability, cart, and checkout flows.",
      "Used Jira to manage bug reports with severity, priority, steps, and traceability.",
    ],
  },
  {
    period: "Feb 2025 - Apr 2025",
    role: "QA Intern",
    company: "UBUY Technologies Pvt. Ltd.",
    location: "Jaipur, Rajasthan",
    points: [
      "Executed test cases for functional, UI, and regression testing.",
      "Logged and tracked bugs through the full defect lifecycle.",
      "Supported release validation, test documentation, and team coordination.",
    ],
  },
  {
    period: "May 2024 - Jul 2024",
    role: "Data Science Intern",
    company: "Celebal Technologies",
    location: "Remote",
    points: [
      "Worked with datasets, machine learning workflows, and model evaluation.",
      "Strengthened analytical thinking, documentation, and collaborative delivery.",
    ],
  },
];

const skillGroups = [
  {
    title: "Testing",
    items: ["Manual Testing", "Black Box Testing", "Regression", "Functional", "Smoke", "Exploratory", "UAT"],
  },
  {
    title: "Platforms",
    items: ["Web Testing", "iOS Testing", "Android Testing", "Chrome", "Firefox", "Safari", "Edge"],
  },
  {
    title: "Tools & Process",
    items: ["Jira", "Test Cases", "Defect Tracking", "SDLC", "STLC", "Agile / Scrum", "RCA"],
  },
  {
    title: "Data & Programming",
    items: ["API Validation", "Data Validation", "Web Scraping Testing", "Java", "Python", "AI/ML Basics"],
  },
];

const projects = [
  {
    date: "May 2025",
    title: "Downscaling of Jodhpur MODIS Land Surface Temperature Data",
    description:
      "Built a model using MODIS LST, NDVI, and DEM data to downscale land surface temperature from 1km to 10m resolution.",
    tags: ["Python", "GIS", "Machine Learning"],
  },
  {
    date: "Nov 2024",
    title: "Temporal Analysis of Jodhpur LST",
    description:
      "Analyzed long-term temperature patterns and tuned XGBoost models with GridSearchCV for improved accuracy.",
    tags: ["XGBoost", "Time Series", "Python"],
  },
  {
    date: "Nov 2023",
    title: "Chronic Kidney Disease Detection",
    description:
      "Compared multiple machine learning models for healthcare classification and selected the best-performing approach.",
    tags: ["Classification", "Healthcare", "ML"],
  },
];

const education = [
  {
    title: "B.Tech in Computer Science and Engineering",
    place: "University of Engineering and Management Jaipur",
    meta: "Aug 2021 - May 2025 | CGPA 8.34/10.0 | AI & ML",
  },
  {
    title: "Higher Secondary (12th)",
    place: "Kalyani Pannalal Institution",
    meta: "WBCHSE | 2019 - 2021",
  },
  {
    title: "Secondary (10th)",
    place: "Bedibhawan Rabitirtha Vidyalaya",
    meta: "WBBSE | 2016 - 2019",
  },
];

function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-8 max-w-3xl animate-fade-up">
      <p className="mb-3 text-sm font-semibold uppercase text-sky-300">{eyebrow}</p>
      <h2 className="text-3xl font-bold text-white sm:text-4xl">{title}</h2>
      {description && <p className="mt-4 text-base leading-7 text-zinc-400">{description}</p>}
    </div>
  );
}

function Pill({ children }: { children: string; key?: string }) {
  return (
    <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-sm font-medium text-zinc-200">
      {children}
    </span>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-[#080808] text-zinc-100">
      <header className="animate-header sticky top-0 z-30 border-b border-white/10 bg-[#080808]/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <a href="#top" className="text-lg font-bold text-white">
            Dipendu
          </a>
          <nav className="hidden items-center gap-6 text-sm font-medium text-zinc-400 md:flex">
            {navItems.map(([label, id]) => (
              <a key={id} href={`#${id}`} className="transition hover:text-sky-300">
                {label}
              </a>
            ))}
          </nav>
          <a
            href={`mailto:${email}`}
            className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-sky-300"
          >
            <Mail className="h-4 w-4" />
            Contact
          </a>
        </div>
      </header>

      <main id="top">
        <section className="border-b border-white/10 bg-[#0c0c0d]">
          <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:py-20 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <div className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-400/10 px-4 py-2 text-sm font-semibold text-sky-200">
                <span className="h-2 w-2 rounded-full bg-sky-300" />
                Open to QA Opportunities
              </div>
              <h1 className="animate-fade-up delay-1 mt-5 max-w-4xl text-4xl font-bold leading-tight text-white sm:text-6xl">
                Software Tester ensuring quality at scale.
              </h1>
              <p className="animate-fade-up delay-2 mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
                QA Specialist at UBUY with experience in manual testing, cross-platform validation,
                defect management, and data accuracy testing for global e-commerce products.
              </p>
              <div className="animate-fade-up delay-3 mt-6 flex flex-wrap items-center gap-4 text-sm text-zinc-400">
                <span className="inline-flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-sky-300" />
                  Jaipur, India
                </span>
                <span className="rounded-full bg-emerald-400/10 px-3 py-1 font-semibold text-emerald-200">
                  QA Engineer
                </span>
              </div>
              <div className="animate-fade-up delay-4 mt-8 flex flex-wrap gap-3">
                <a
                  href={`mailto:${email}`}
                  className="inline-flex items-center gap-2 rounded-full bg-sky-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-400"
                >
                  <Mail className="h-4 w-4" />
                  Contact Me
                </a>
                <a
                  href={linkedIn}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white transition hover:border-sky-300 hover:text-sky-200"
                >
                  <Linkedin className="h-4 w-4" />
                  LinkedIn
                </a>
              </div>
            </div>

            <div className="profile-card rounded-lg border border-white/10 bg-[#151516] p-6 text-white shadow-2xl shadow-black/40">
              <div className="flex items-center gap-4">
                <div className="profile-avatar flex h-24 w-24 items-center justify-center rounded-lg bg-sky-500 text-3xl font-bold">
                  DM
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase text-sky-200">QA @ UBUY</p>
                  <h2 className="mt-2 text-2xl font-bold">Dipendu Mukherjee</h2>
                  <p className="mt-1 text-sm text-zinc-400">Software Tester & QA Specialist</p>
                </div>
              </div>
              <div className="mt-8 grid grid-cols-2 gap-3">
                {stats.map(([value, label], index) => (
                  <div key={label} className={`metric-card rounded-lg bg-white/[0.06] p-4 delay-${index + 1}`}>
                    <p className="text-2xl font-bold">{value}</p>
                    <p className="mt-1 text-sm text-zinc-400">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="mx-auto max-w-6xl px-5 py-16">
          <SectionHeader
            eyebrow="About"
            title="Turning quality into a competitive advantage."
            description="I focus on finding issues early, documenting them clearly, and helping teams ship stable experiences across devices, browsers, and product flows."
          />
          <div className="grid gap-4 md:grid-cols-2">
            {strengths.map((item, index) => (
              <div key={item} className={`interactive-card flex gap-3 rounded-lg border border-white/10 bg-white/[0.04] p-5 delay-${index + 1}`}>
                <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-emerald-300" />
                <p className="text-zinc-300">{item}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="experience" className="border-y border-white/10 bg-[#0c0c0d]">
          <div className="mx-auto max-w-6xl px-5 py-16">
            <SectionHeader
              eyebrow="Career"
              title="Work experience"
              description="A focused QA path across e-commerce testing, defect management, documentation, and data validation."
            />
            <div className="space-y-5">
              {experiences.map((job, index) => (
                <article key={`${job.role}-${job.period}`} className={`interactive-card rounded-lg border border-white/10 bg-[#151516] p-6 delay-${index + 1}`}>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-sky-300">{job.period}</p>
                      <h3 className="mt-1 text-2xl font-bold text-white">{job.role}</h3>
                      <p className="mt-1 text-zinc-400">
                        {job.company} | {job.location}
                      </p>
                    </div>
                    <BriefcaseBusiness className="hidden h-6 w-6 text-amber-300 sm:block" />
                  </div>
                  <ul className="mt-5 grid gap-3 text-zinc-300">
                    {job.points.map((point) => (
                      <li key={point} className="flex gap-3">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-300" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="skills" className="mx-auto max-w-6xl px-5 py-16">
          <SectionHeader
            eyebrow="Expertise"
            title="Technical skills"
            description="A practical stack for manual QA, cross-platform testing, and clear defect communication."
          />
          <div className="grid gap-5 md:grid-cols-2">
            {skillGroups.map((group, index) => (
              <div key={group.title} className={`interactive-card rounded-lg border border-white/10 bg-white/[0.04] p-6 delay-${index + 1}`}>
                <h3 className="text-lg font-bold text-white">{group.title}</h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {group.items.map((skill) => (
                    <Pill key={skill}>{skill}</Pill>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="projects" className="border-y border-white/10 bg-[#0c0c0d]">
          <div className="mx-auto max-w-6xl px-5 py-16">
            <SectionHeader
              eyebrow="Portfolio"
              title="Selected university projects"
              description="Academic projects that support analytical thinking, ML literacy, and data-focused QA work."
            />
            <div className="grid gap-5 lg:grid-cols-3">
              {projects.map((project, index) => (
                <article key={project.title} className={`interactive-card rounded-lg border border-white/10 bg-[#151516] p-6 delay-${index + 1}`}>
                  <p className="text-sm font-semibold text-sky-300">{project.date}</p>
                  <h3 className="mt-3 text-xl font-bold leading-snug text-white">{project.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-zinc-400">{project.description}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <Pill key={tag}>{tag}</Pill>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="education" className="mx-auto max-w-6xl px-5 py-16">
          <SectionHeader eyebrow="Background" title="Education & certification" />
          <div className="grid gap-5 md:grid-cols-3">
            {education.map((item, index) => (
              <article key={item.title} className={`interactive-card rounded-lg border border-white/10 bg-white/[0.04] p-6 delay-${index + 1}`}>
                <GraduationCap className="h-6 w-6 text-amber-300" />
                <h3 className="mt-4 text-lg font-bold text-white">{item.title}</h3>
                <p className="mt-2 text-sm font-medium text-zinc-300">{item.place}</p>
                <p className="mt-2 text-sm leading-6 text-zinc-500">{item.meta}</p>
              </article>
            ))}
          </div>
          <div className="interactive-card delay-4 mt-5 rounded-lg border border-white/10 bg-white/[0.04] p-6">
            <h3 className="text-lg font-bold text-white">Certification</h3>
            <p className="mt-2 text-zinc-400">Online Course in Software Testing - Coursera</p>
          </div>
        </section>

        <section id="contact" className="border-t border-white/10 bg-[#0c0c0d] px-5 py-16 text-white">
          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-center">
            <div className="animate-fade-up">
              <p className="mb-3 text-sm font-semibold uppercase text-sky-300">Contact</p>
              <h2 className="text-3xl font-bold sm:text-4xl">Let's work together.</h2>
              <p className="mt-4 max-w-2xl text-zinc-400">
                Open to QA roles, testing opportunities, and collaborations. Reach out for manual testing,
                defect validation, or e-commerce QA support.
              </p>
            </div>
            <div className="interactive-card rounded-lg border border-white/10 bg-white p-6 text-zinc-950">
              <div className="space-y-4">
                <a href={`mailto:${email}`} className="flex items-center gap-3 font-semibold hover:text-sky-700">
                  <Mail className="h-5 w-5" />
                  {email}
                </a>
                <a href={`tel:${phone.replace(/\s/g, "")}`} className="flex items-center gap-3 font-semibold hover:text-sky-700">
                  <Phone className="h-5 w-5" />
                  {phone}
                </a>
                <a
                  href={linkedIn}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 font-semibold hover:text-sky-700"
                >
                  <Linkedin className="h-5 w-5" />
                  LinkedIn Profile
                </a>
              </div>
              <a
                href={`mailto:${email}`}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-sky-600 px-5 py-3 text-sm font-semibold text-white hover:bg-sky-700"
              >
                <Download className="h-4 w-4" />
                Request CV / Resume
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[#0c0c0d] px-5 pb-8 text-sm text-zinc-500">
        <div className="mx-auto max-w-6xl border-t border-white/10 pt-6">
          &copy; 2026 Dipendu Mukherjee. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

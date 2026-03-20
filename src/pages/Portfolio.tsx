import { useState, useEffect } from "react";
import { ParticleCanvas } from "@/components/portfolio/ParticleCanvas";
import { ScrollReveal } from "@/components/portfolio/ScrollReveal";
import {
  Heart, Globe, Users, BookOpen, GraduationCap, Phone, Mail,
  ChevronDown, Sun, Moon, Menu, X, Award, BarChart3, Shield,
  Droplets, ClipboardList, Handshake, Download, MessageCircle,
  MapPin, ExternalLink
} from "lucide-react";

const NAV_LINKS = [
  { href: "#home", label: "Home" },
  { href: "#profile", label: "Profile" },
  { href: "#competencies", label: "Expertise" },
  { href: "#experience", label: "Career" },
  { href: "#impact", label: "Impact" },
  { href: "#education", label: "Education" },
  { href: "#contact", label: "Contact" },
];

const COMPETENCIES = [
  { icon: Heart, title: "Acute Malnutrition (CMAM)", desc: "Expert in community‑based management protocols" },
  { icon: Shield, title: "Public Health Programming", desc: "Design & implementation in emergencies" },
  { icon: ClipboardList, title: "SAM/MAM Case Management", desc: "Clinical supervision & therapeutic feeding" },
  { icon: BarChart3, title: "Nutrition Surveillance", desc: "Data collection, analysis & interpretation" },
  { icon: Droplets, title: "WASH Integration", desc: "Coordinating cross‑sectoral interventions" },
  { icon: Users, title: "Team Supervision", desc: "Leading multidisciplinary teams" },
  { icon: BookOpen, title: "Monitoring & Reporting", desc: "Quality assurance & donor reporting" },
  { icon: Handshake, title: "Cross‑Cultural Coordination", desc: "Working with diverse communities" },
];

const EXPERIENCE = [
  {
    title: "Nutrition Supervisor",
    date: "2019–2021",
    org: "Action Against Hunger – Pugnido 2 Refugee Camp",
    points: [
      "Supervised frontline nutrition teams delivering SAM/MAM interventions",
      "Ensured compliance with international protocols",
      "Coordinated WASH‑integrated programming",
      "Trained staff on anthropometric measurements",
    ],
  },
  {
    title: "Nutrition Intern – Stabilization Center",
    date: "Mar 2025",
    org: "Adare Hospital, Hawassa",
    points: [
      "Managed complicated SAM cases under supervision",
      "Applied therapeutic feeding protocols",
      "Participated in multidisciplinary assessments",
    ],
  },
  {
    title: "Nutrition Data & Analysis Intern",
    date: "Apr–May 2025",
    org: "Sidama Public Health Institute",
    points: [
      "Conducted nutrition data collection & analysis",
      "Supported evidence‑based planning",
      "Strengthened institutional reporting",
    ],
  },
];

const IMPACT_STATS = [
  { value: "50,000+", label: "Beneficiaries" },
  { value: "3", label: "Countries" },
  { value: "12+", label: "Programs" },
  { value: "100+", label: "Workers Trained" },
];

export default function Portfolio() {
  const [dark, setDark] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [activeSection, setActiveSection] = useState("home");

  // Loading
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(timer);
          setTimeout(() => setLoading(false), 400);
          return 100;
        }
        return p + Math.random() * 25;
      });
    }, 150);
    return () => clearInterval(timer);
  }, []);

  // Scroll listener
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
      const sections = document.querySelectorAll("section[id]");
      let current = "home";
      sections.forEach((s) => {
        const el = s as HTMLElement;
        if (window.scrollY >= el.offsetTop - 120) {
          current = el.id;
        }
      });
      setActiveSection(current);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const themeClasses = dark
    ? "bg-[#0a0f1e] text-[#e0e7ff]"
    : "bg-[#f0f5ff] text-[#0a1a2f]";

  const cardBg = dark ? "bg-[#141b2b]/70 border-white/10" : "bg-white/80 border-black/10";
  const textSecondary = dark ? "text-[#a0b3d9]" : "text-[#2a405c]";
  const navBg = dark ? "bg-[#0a0f1e]/80" : "bg-white/80";

  // Loading screen
  if (loading) {
    return (
      <div className={`fixed inset-0 z-[9999] flex items-center justify-center ${dark ? "bg-[#0a0f1e]" : "bg-[#f0f5ff]"}`}>
        <div className="text-center">
          <div className="text-6xl mb-4">
            <Globe className="w-16 h-16 mx-auto text-cyan-400 animate-spin" style={{ animationDuration: "3s" }} />
          </div>
          <p className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-1">
            Thow Deng Yuel
          </p>
          <p className={`text-sm ${textSecondary} mb-6`}>Human Nutrition & Global Health</p>
          <div className="w-72 h-1 bg-white/20 rounded-full overflow-hidden mx-auto">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${themeClasses} transition-colors duration-300 overflow-x-hidden`} style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* ===== NAVBAR ===== */}
      <nav
        className={`fixed top-0 w-full z-50 backdrop-blur-xl border-b transition-all duration-300 ${navBg} ${
          scrolled ? "shadow-lg shadow-cyan-500/10" : ""
        } border-white/10`}
      >
        <div className="max-w-[1280px] mx-auto px-6 py-4 flex justify-between items-center">
          <a href="#home" className="flex items-center gap-3 no-underline">
            <Globe className="w-7 h-7 text-cyan-400" style={{ animation: "spin 8s linear infinite" }} />
            <span className="text-xl font-extrabold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              TDY
            </span>
          </a>

          {/* Desktop nav */}
          <div className="hidden md:flex gap-8">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className={`relative font-medium no-underline transition-colors duration-200 py-1 ${
                  activeSection === l.href.slice(1)
                    ? "text-cyan-400"
                    : dark ? "text-[#e0e7ff] hover:text-cyan-400" : "text-[#0a1a2f] hover:text-cyan-500"
                }`}
              >
                {l.label}
                <span
                  className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-500 transition-all duration-300 ${
                    activeSection === l.href.slice(1) ? "w-full" : "w-0"
                  }`}
                />
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setDark(!dark)}
              className="p-2 rounded-lg transition-colors hover:bg-white/10"
              aria-label="Toggle theme"
            >
              {dark ? <Sun className="w-5 h-5 text-yellow-300" /> : <Moon className="w-5 h-5 text-slate-700" />}
            </button>
            <button
              className="md:hidden p-2"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menu"
            >
              {menuOpen ? <X className="w-6 h-6 text-cyan-400" /> : <Menu className="w-6 h-6 text-cyan-400" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className={`md:hidden absolute top-full left-0 w-full h-[calc(100vh-72px)] ${dark ? "bg-[#0a0f1e]" : "bg-[#f0f5ff]"} flex flex-col items-center justify-center gap-8 z-50`}>
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className={`text-xl font-medium no-underline ${dark ? "text-[#e0e7ff]" : "text-[#0a1a2f]"} hover:text-cyan-400 transition-colors`}
              >
                {l.label}
              </a>
            ))}
          </div>
        )}
      </nav>

      {/* ===== HERO ===== */}
      <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
        <ParticleCanvas />
        <div className="absolute inset-0 bg-gradient-radial from-transparent to-current opacity-60 z-[2]"
          style={{ background: `radial-gradient(circle at center, transparent 0%, ${dark ? "#0a0f1e" : "#f0f5ff"} 100%)` }}
        />

        <div className="relative z-[3] max-w-[1280px] mx-auto px-6 grid lg:grid-cols-[1.2fr_0.8fr] gap-12 items-center w-full">
          <div className="lg:order-1 order-2">
            <ScrollReveal>
              <span className="inline-block px-4 py-2 border border-cyan-400 rounded-full text-xs tracking-[3px] uppercase text-cyan-400 shadow-[0_0_10px_rgba(0,200,255,0.3)] mb-6">
                ✦ Future of Nutrition ✦
              </span>
            </ScrollReveal>

            <ScrollReveal delay={100}>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.05] mb-4" style={{ lineHeight: "1.05" }}>
                <span className={`bg-gradient-to-br ${dark ? "from-white to-cyan-400" : "from-[#0a1a2f] to-cyan-600"} bg-clip-text text-transparent`}>
                  Thow Deng
                </span>
                <br />
                <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                  Yuel
                </span>
              </h1>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <p className={`text-xl ${textSecondary} mb-4 font-medium`}>
                Human Nutrition & Global Health Professional
              </p>
            </ScrollReveal>

            <ScrollReveal delay={300}>
              <p className={`${textSecondary} max-w-lg mb-8 text-base leading-relaxed`}>
                Pioneering data‑driven nutrition solutions in humanitarian settings with AI‑enhanced surveillance systems and evidence‑based interventions.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={400}>
              <div className="flex gap-4 flex-wrap">
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-white bg-gradient-to-r from-cyan-400 to-purple-500 shadow-[0_0_20px_rgba(0,200,255,0.4)] hover:shadow-[0_0_30px_rgba(0,200,255,0.6)] hover:-translate-y-0.5 transition-all duration-300 active:scale-[0.97] no-underline"
                >
                  <MessageCircle className="w-4 h-4" /> Connect
                </a>
                <a
                  href="#experience"
                  className={`inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold border-2 border-cyan-400 ${
                    dark ? "text-white" : "text-[#0a1a2f]"
                  } hover:bg-cyan-400 hover:text-black transition-all duration-300 active:scale-[0.97] no-underline`}
                >
                  <Download className="w-4 h-4" /> View CV
                </a>
              </div>
            </ScrollReveal>
          </div>

          {/* Profile image */}
          <div className="lg:order-2 order-1 flex justify-center">
            <ScrollReveal delay={200}>
              <div className="relative w-56 h-56 sm:w-64 sm:h-64 lg:w-72 lg:h-72 group">
                {/* Rotating ring */}
                <div
                  className="absolute -inset-3 rounded-full border-2 border-transparent"
                  style={{
                    background: "linear-gradient(135deg, #00c8ff, #7b2eda) border-box",
                    WebkitMask: "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)",
                    WebkitMaskComposite: "xor",
                    maskComposite: "exclude",
                    animation: "spin 10s linear infinite",
                  }}
                />
                {/* Avatar with initials */}
                <div className="w-full h-full rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-600/20 border-4 border-white/10 shadow-[0_8px_32px_rgba(0,200,255,0.3)] flex items-center justify-center group-hover:shadow-[0_0_40px_rgba(0,200,255,0.5)] transition-shadow duration-500">
                  <span className="text-5xl sm:text-6xl lg:text-7xl font-extrabold bg-gradient-to-br from-cyan-400 to-purple-500 bg-clip-text text-transparent select-none">
                    TDY
                  </span>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[3] flex flex-col items-center gap-2 animate-bounce">
          <span className={`text-xs ${textSecondary}`}>Explore</span>
          <ChevronDown className={`w-5 h-5 ${textSecondary}`} />
        </div>
      </section>

      {/* ===== PROFILE ===== */}
      <section id="profile" className={`py-24 ${dark ? "bg-[#141b2b]" : "bg-white"}`}>
        <div className="max-w-[1280px] mx-auto px-6">
          <ScrollReveal>
            <SectionHeader title="Professional Identity" subtitle="PROFILE" />
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <div className={`max-w-3xl mx-auto p-8 sm:p-10 rounded-3xl border backdrop-blur-xl ${cardBg}`}>
              <div className={`flex gap-4 mb-6 pb-6 border-b ${dark ? "border-white/10" : "border-black/10"}`}>
                <Award className="w-8 h-8 text-cyan-400 flex-shrink-0 mt-1 opacity-70" />
                <p className="text-lg font-medium leading-relaxed">
                  Results-oriented Human Nutrition professional (CGPA: 3.61/4.00) with proven leadership in humanitarian nutrition programming, clinical case management, and public health data systems.
                </p>
              </div>
              <div className={`space-y-4 ${textSecondary}`}>
                <p>
                  Demonstrated capacity to manage acute malnutrition interventions (SAM/MAM), coordinate multidisciplinary teams, and integrate WASH and community health strategies in refugee settings. Strong analytical and operational background with a commitment to improving health outcomes in fragile contexts.
                </p>
                <p>
                  Recognized for accountability, adaptability, and evidence-based decision-making. Experienced with international NGOs, UN agencies, and national health systems.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ===== COMPETENCIES ===== */}
      <section id="competencies" className="py-24">
        <div className="max-w-[1280px] mx-auto px-6">
          <ScrollReveal>
            <SectionHeader title="Core Competencies" subtitle="EXPERTISE" />
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {COMPETENCIES.map((c, i) => (
              <ScrollReveal key={c.title} delay={i * 80}>
                <div
                  className={`p-6 rounded-2xl border text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_40px_rgba(0,200,255,0.2)] group cursor-default ${cardBg}`}
                  style={{ borderBottom: "3px solid transparent" }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderBottomColor = "#00c8ff")}
                  onMouseLeave={(e) => (e.currentTarget.style.borderBottomColor = "transparent")}
                >
                  <c.icon className="w-10 h-10 text-cyan-400 mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
                  <h3 className="font-semibold mb-1 text-sm">{c.title}</h3>
                  <p className={`text-xs ${textSecondary}`}>{c.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== EXPERIENCE ===== */}
      <section id="experience" className={`py-24 ${dark ? "bg-[#141b2b]" : "bg-white"}`}>
        <div className="max-w-[1280px] mx-auto px-6">
          <ScrollReveal>
            <SectionHeader title="Professional Journey" subtitle="CAREER" />
          </ScrollReveal>

          <div className="relative max-w-3xl mx-auto">
            {/* Timeline line */}
            <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-400 to-purple-500" />

            {EXPERIENCE.map((exp, i) => (
              <ScrollReveal key={i} delay={i * 120} direction="left">
                <div className="relative mb-10 pl-14">
                  {/* Marker */}
                  <div className="absolute left-2.5 top-2 w-5 h-5 rounded-full bg-cyan-400 border-4 shadow-[0_0_20px_rgba(0,200,255,0.6)] z-10"
                    style={{ borderColor: dark ? "#0a0f1e" : "#f0f5ff" }}
                  />

                  <div className={`p-6 rounded-2xl border backdrop-blur-xl transition-all duration-300 hover:translate-x-2 hover:shadow-[0_0_30px_rgba(0,200,255,0.2)] ${cardBg}`}>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-2">
                      <h3 className="font-bold text-lg">{exp.title}</h3>
                      <span className="text-xs font-semibold bg-cyan-400 text-black px-3 py-1 rounded-full w-fit">
                        {exp.date}
                      </span>
                    </div>
                    <p className={`${textSecondary} mb-3 text-sm`}>📍 {exp.org}</p>
                    <ul className="space-y-1.5">
                      {exp.points.map((pt, j) => (
                        <li key={j} className={`text-sm ${textSecondary} flex gap-2`}>
                          <span className="text-cyan-400 flex-shrink-0">▹</span>
                          {pt}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== GLOBAL IMPACT ===== */}
      <section id="impact" className="py-24">
        <div className="max-w-[1280px] mx-auto px-6">
          <ScrollReveal>
            <SectionHeader title="Global Impact" subtitle="REACH" />
          </ScrollReveal>

          {/* Map-like visual */}
          <ScrollReveal>
            <div className={`relative h-64 rounded-3xl overflow-hidden mb-10 border ${cardBg}`}>
              <div className="absolute inset-0 flex items-center justify-center">
                <Globe className="w-32 h-32 text-cyan-400/20" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex gap-8 flex-wrap justify-center">
                  {["South Sudan", "Ethiopia", "Sudan", "Rwanda"].map((country, i) => (
                    <div key={country} className="flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-400/30 bg-cyan-400/5">
                      <MapPin className="w-4 h-4 text-cyan-400" />
                      <span className="text-sm font-medium">{country}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {IMPACT_STATS.map((s, i) => (
              <ScrollReveal key={s.label} delay={i * 100}>
                <div className={`p-6 rounded-2xl border text-center transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(0,200,255,0.2)] ${cardBg}`}>
                  <p className="text-3xl sm:text-4xl font-extrabold text-emerald-400 mb-1">{s.value}</p>
                  <p className={`text-sm ${textSecondary}`}>{s.label}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== EDUCATION ===== */}
      <section id="education" className={`py-24 ${dark ? "bg-[#141b2b]" : "bg-white"}`}>
        <div className="max-w-[1280px] mx-auto px-6">
          <ScrollReveal>
            <SectionHeader title="Education" subtitle="ACADEMIC" />
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <ScrollReveal delay={0}>
              <div className={`relative p-6 rounded-2xl border overflow-hidden ${cardBg}`}>
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-cyan-400 to-purple-500" />
                <GraduationCap className="w-10 h-10 text-cyan-400 mb-3" />
                <h3 className="font-bold text-lg mb-1">B.Sc. Human Nutrition</h3>
                <p className={`font-semibold ${textSecondary} text-sm`}>Hawassa University, Ethiopia</p>
                <p className="text-cyan-400 text-sm mb-3">2022–2025 | CGPA 3.61/4.00</p>
                <div className="flex flex-wrap gap-2">
                  {["Public Health", "Clinical Nutrition", "CMAM", "Epidemiology"].map((t) => (
                    <span
                      key={t}
                      className="text-xs px-3 py-1 rounded-full border border-cyan-400/40 text-cyan-400 bg-cyan-400/10"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={100}>
              <div className={`relative p-6 rounded-2xl border overflow-hidden ${cardBg}`}>
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-cyan-400 to-purple-500" />
                <BookOpen className="w-10 h-10 text-cyan-400 mb-3" />
                <h3 className="font-bold text-lg mb-1">Secondary Education</h3>
                <p className={`font-semibold ${textSecondary} text-sm`}>DICAC-RADD High School</p>
                <p className="text-cyan-400 text-sm">Pugnido Refugee Camp | 2018–2022</p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ===== CONTACT ===== */}
      <section id="contact" className="py-24">
        <div className="max-w-[1280px] mx-auto px-6">
          <ScrollReveal>
            <SectionHeader title="Contact" subtitle="CONNECT" />
          </ScrollReveal>

          <div className="grid lg:grid-cols-[1fr_1.5fr] gap-8 max-w-4xl mx-auto">
            <div className="space-y-4">
              {[
                { icon: Phone, label: "Phone", value: "+251 977 427 821", href: "tel:+251977427821" },
                { icon: Phone, label: "Phone 2", value: "+251 991 768 409", href: "tel:+251991768409" },
                { icon: Mail, label: "Email", value: "thowjohndengyuel@gmail.com", href: "mailto:thowjohndengyuel@gmail.com" },
              ].map((c, i) => (
                <ScrollReveal key={i} delay={i * 80} direction="left">
                  <a
                    href={c.href}
                    className={`flex items-center gap-4 p-4 rounded-2xl border no-underline transition-all duration-300 hover:translate-x-1 hover:shadow-[0_0_20px_rgba(0,200,255,0.2)] ${cardBg}`}
                  >
                    <div className="w-12 h-12 rounded-full bg-cyan-400/10 flex items-center justify-center flex-shrink-0">
                      <c.icon className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                      <p className={`text-xs ${textSecondary}`}>{c.label}</p>
                      <p className="font-semibold text-sm">{c.value}</p>
                    </div>
                  </a>
                </ScrollReveal>
              ))}
            </div>

            <ScrollReveal delay={100} direction="right">
              <form
                className={`p-6 rounded-3xl border ${cardBg}`}
                onSubmit={(e) => {
                  e.preventDefault();
                  alert("Contact form submitted! (Connect EmailJS for live sending)");
                }}
              >
                <div className="space-y-4">
                  {[
                    { name: "name", placeholder: "Your Name", type: "text" },
                    { name: "email", placeholder: "Your Email", type: "email" },
                    { name: "subject", placeholder: "Subject", type: "text" },
                  ].map((f) => (
                    <input
                      key={f.name}
                      type={f.type}
                      placeholder={f.placeholder}
                      required
                      className={`w-full px-4 py-3 rounded-xl border ${
                        dark ? "bg-black/20 border-white/10 text-white" : "bg-gray-50 border-black/10 text-black"
                      } focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(0,200,255,0.3)] transition-all duration-300 text-sm`}
                    />
                  ))}
                  <textarea
                    placeholder="Your Message"
                    rows={4}
                    required
                    className={`w-full px-4 py-3 rounded-xl border resize-none ${
                      dark ? "bg-black/20 border-white/10 text-white" : "bg-gray-50 border-black/10 text-black"
                    } focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(0,200,255,0.3)] transition-all duration-300 text-sm`}
                  />
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-full font-semibold text-white bg-gradient-to-r from-cyan-400 to-purple-500 shadow-[0_0_20px_rgba(0,200,255,0.4)] hover:shadow-[0_0_30px_rgba(0,200,255,0.6)] hover:-translate-y-0.5 transition-all duration-300 active:scale-[0.97] flex items-center justify-center gap-2"
                  >
                    <Mail className="w-4 h-4" /> Send Message
                  </button>
                </div>
              </form>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className={`py-12 border-t ${dark ? "bg-[#141b2b] border-white/10" : "bg-white border-black/10"}`}>
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid sm:grid-cols-3 gap-8 mb-8">
            <div className="flex items-center gap-3">
              <Globe className="w-7 h-7 text-cyan-400" />
              <span className="text-lg font-bold">Thow Deng Yuel</span>
            </div>
            <div className="flex flex-col gap-2">
              {["Home", "Profile", "Experience", "Contact"].map((l) => (
                <a
                  key={l}
                  href={`#${l.toLowerCase()}`}
                  className={`text-sm no-underline ${textSecondary} hover:text-cyan-400 hover:translate-x-1 transition-all duration-200 w-fit`}
                >
                  {l}
                </a>
              ))}
            </div>
            <div className="flex gap-3">
              {[
                { href: "https://linkedin.com", icon: ExternalLink },
              ].map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-cyan-400/30 flex items-center justify-center text-cyan-400 hover:bg-cyan-400 hover:text-black transition-all duration-300 no-underline"
                >
                  <s.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
          <div className={`text-center pt-6 border-t ${dark ? "border-white/10" : "border-black/10"}`}>
            <p className={`text-sm ${textSecondary}`}>© 2026 Thow Deng Yuel – Human Nutrition & Global Health</p>
          </div>
        </div>
      </footer>

      {/* Global spin keyframe */}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        html { scroll-behavior: smooth; }
      `}</style>
    </div>
  );
}

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="text-center mb-12">
      <span className="inline-block text-sm font-semibold text-cyan-400 tracking-[3px] uppercase mb-2">
        ✦ {subtitle} ✦
      </span>
      <h2 className="text-3xl sm:text-4xl font-bold mb-3">{title}</h2>
      <div className="w-16 h-1 bg-gradient-to-r from-cyan-400 to-purple-500 mx-auto rounded-full" />
    </div>
  );
}

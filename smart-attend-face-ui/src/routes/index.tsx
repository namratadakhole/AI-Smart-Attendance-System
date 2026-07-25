import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ScanFace,
  ArrowRight,
  ShieldCheck,
  GraduationCap,
  Activity,
  Calendar,
  Lock,
  TrendingUp,
  Cloud,
  CheckCircle,
  Database,
  Terminal,
  BookOpen,
  ArrowLeft,
  Sparkles,
  Award,
  BookMarked,
  LayoutDashboard,
  Users,
  Play,
  Github,
  Video,
  Cpu,
  Brain,
  Download,
  CheckCircle2,
  ChevronDown,
  Layers,
  Clock,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SmartAttend AI · EdTech Attendance Platform" },
      { name: "description", content: "AI Face Recognition Attendance Management System" }
    ],
  }),
  component: EdTechLandingPage,
});

// Reusable Counter component that animates count up
function Counter({ value, suffix = "", duration = 1.5 }: { value: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const elementRef = useRef<HTMLDivElement>(null);
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !triggered) {
          setTriggered(true);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [triggered]);

  useEffect(() => {
    if (!triggered) return;

    let start = 0;
    const end = value;
    const totalFrames = duration * 60;
    const increment = Math.ceil(end / totalFrames);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 1000 / 60);

    return () => clearInterval(timer);
  }, [triggered, value, duration]);

  return (
    <div ref={elementRef} className="font-mono">
      {count}{suffix}
    </div>
  );
}

// Reusable Accordion FAQ item
function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-slate-800 py-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left py-2 font-bold text-slate-100 hover:text-primary transition-colors focus:outline-none"
      >
        <span className="text-sm md:text-base">{question}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="h-4 w-4 text-slate-400" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <p className="text-xs md:text-sm text-slate-400 mt-2 leading-relaxed pb-2">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Screenshot Slideshow Carousel in a laptop mockup
function ShowcaseMockup() {
  const slides = [
    { title: "Faculty Dashboard", desc: "Start live sessions, manage database, and configure settings.", color: "from-blue-600 to-indigo-700" },
    { title: "Student Dashboard", desc: "Real-time attendance percentage, exam eligibility, and subject-wise metrics.", color: "from-emerald-600 to-teal-700" },
    { title: "Student Registration", desc: "Allows students to set up accounts, configure emails, and input roll numbers.", color: "from-cyan-600 to-blue-700" },
    { title: "Attendance capturing", desc: "Automatically captures and saves 20 high-quality facial samples.", color: "from-purple-600 to-pink-700" },
    { title: "Analytics Console", desc: "Interactive charts showing student engagement and monthly patterns.", color: "from-amber-600 to-orange-700" },
  ];

  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 z-10">
      {/* Laptop Mockup Frame */}
      <div className="relative mx-auto border-gray-800 bg-gray-800 border-[8px] md:border-[12px] rounded-t-3xl h-[240px] sm:h-[360px] md:h-[480px] max-w-[850px] shadow-2xl overflow-hidden">
        <div className="rounded-lg overflow-hidden h-full w-full relative">
          <div className="absolute inset-0 bg-slate-900 flex flex-col justify-between p-6 text-white relative transition-all duration-700 select-none">
            <div className={`absolute inset-0 bg-gradient-to-tr ${slides[active].color} opacity-95 mix-blend-multiply z-0`} />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

            <div className="z-10 flex justify-between items-start">
              <Badge className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm border-none font-semibold">Live Preview</Badge>
              <div className="text-xs text-white/60 font-mono">0{active + 1} / 0{slides.length}</div>
            </div>

            <div className="z-10 space-y-3 text-left max-w-xl">
              <h3 className="text-xl md:text-3xl font-extrabold tracking-tight">{slides[active].title}</h3>
              <p className="text-xs md:text-sm text-white/95 leading-relaxed">{slides[active].desc}</p>
            </div>
          </div>
        </div>
      </div>
      {/* Laptop Base */}
      <div className="relative mx-auto bg-gray-900 rounded-b-xl rounded-t-sm h-[14px] max-w-[920px] shadow-lg" />
      <div className="relative mx-auto bg-gray-800 rounded-b-xl h-[4px] max-w-[150px]" />

      {/* Slide Indicators */}
      <div className="flex justify-center gap-2 mt-6">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActive(idx)}
            className={`h-2 rounded-full transition-all duration-300 ${active === idx ? "w-6 bg-primary" : "w-2 bg-slate-700 hover:bg-slate-600"}`}
          />
        ))}
      </div>
    </div>
  );
}

function EdTechLandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-primary selection:text-primary-foreground relative overflow-hidden">
      
      {/* 1. BACKGROUND DECORATIONS */}
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0284c708_1px,transparent_1px),linear-gradient(to_bottom,#0284c708_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
      
      {/* Animated blue gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full bg-sky-500/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[550px] h-[550px] rounded-full bg-blue-600/10 blur-[130px] pointer-events-none" />
      
      {/* Tiny Floating Particles Mockup (CSS only) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[20%] left-[30%] w-1.5 h-1.5 bg-sky-400 rounded-full animate-pulse" />
        <div className="absolute top-[60%] left-[80%] w-1 h-1 bg-blue-400 rounded-full animate-ping" />
        <div className="absolute top-[80%] left-[15%] w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDuration: '6s' }} />
      </div>

      {/* Subtle AI Circuit Pattern lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-sky-500/5 stroke-[1] fill-none" xmlns="http://www.w3.org/2000/svg">
        <path d="M 0 120 H 150 L 190 160 V 280 L 170 300 H 60" />
        <path d="M 1400 350 H 1150 L 1110 390 V 550 L 1130 570 H 1250" />
      </svg>

      {/* 2. STICKY NAVBAR */}
      <header className={`border-b sticky top-0 z-50 transition-all duration-300 ${scrolled ? "bg-slate-950/90 border-slate-900 py-3.5 backdrop-blur-md shadow-md" : "bg-transparent border-transparent py-5.5"}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="h-9 w-9 rounded-xl gradient-primary flex items-center justify-center text-primary-foreground shadow-lg group-hover:scale-105 transition-transform duration-300">
              <ScanFace className="h-5 w-5" />
            </div>
            <span className="font-extrabold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-50 via-slate-100 to-slate-350">
              SmartAttend<span className="text-primary font-black font-mono ml-0.5">AI</span>
            </span>
          </Link>

          {/* Nav items */}
          <nav className="hidden lg:flex items-center gap-8 text-xs font-semibold text-slate-400">
            <a href="#features" className="hover:text-slate-100 transition-colors">Features</a>
            <a href="#showcase" className="hover:text-slate-100 transition-colors">How It Works</a>
            <a href="#technology" className="hover:text-slate-100 transition-colors">Technology</a>
            <a href="#faq" className="hover:text-slate-100 transition-colors">FAQ</a>
          </nav>

          {/* Access Buttons */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex gap-1.5">
              <Link to="/student/login">
                <Button variant="ghost" className="text-slate-400 hover:text-white text-xs font-semibold h-9 px-3">
                  Student Login
                </Button>
              </Link>
              <Link to="/faculty/login">
                <Button variant="ghost" className="text-slate-400 hover:text-white text-xs font-semibold h-9 px-3">
                  Faculty Login
                </Button>
              </Link>
            </div>
            <Link to="/auth">
              <Button size="sm" className="gradient-primary text-primary-foreground font-semibold px-4 h-9 shadow-lg shadow-primary/25 hover:scale-[1.02] transition-all">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* 3. HERO SECTION */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-24 md:py-32 grid gap-12 lg:grid-cols-12 items-center relative z-10">
        
        {/* Left Side Content */}
        <div className="lg:col-span-6 space-y-6 text-left">
          
          {/* Option 1: AI-Powered Face Recognition Attendance (With Pulsing Glow Animation) */}
          <div className="inline-flex">
            <Badge className="bg-sky-500/10 border border-sky-400/20 text-sky-400 py-1.5 px-3.5 rounded-full text-xs font-semibold uppercase tracking-wider gap-1.5 backdrop-blur-md animate-pulse shadow-[0_0_15px_rgba(14,165,233,0.15)]">
              <Sparkles className="h-3.5 w-3.5" /> AI-Powered Face Recognition Attendance
            </Badge>
          </div>

          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.05] bg-gradient-to-b from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
            AI Smart Attendance System
          </h1>

          <p className="text-base md:text-lg font-semibold text-sky-400/90 leading-relaxed max-w-xl">
            Transform classroom attendance with AI-powered face recognition, secure authentication, real-time analytics, and intelligent automation.
          </p>

          <p className="text-xs md:text-sm text-slate-400 leading-relaxed max-w-xl">
            Eliminate manual attendance registers using computer vision and AI. Manage students, faculty, attendance records, reports, and analytics from one intelligent platform.
          </p>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3.5 pt-2">
            <Link to="/auth">
              <Button size="lg" className="gradient-primary text-primary-foreground font-bold rounded-2xl h-12 px-6 shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform text-sm">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <a href="#showcase">
              <Button size="lg" variant="outline" className="text-slate-300 border-slate-800 hover:bg-slate-900 bg-slate-950/20 rounded-2xl h-12 px-6 text-sm font-bold">
                Watch Demo
              </Button>
            </a>
            <a href="https://github.com/namratadakhole" target="_blank" rel="noreferrer">
              <Button size="lg" variant="outline" className="text-slate-400 border-slate-900 hover:text-white rounded-2xl h-12 px-4">
                <Github className="h-4 w-4" />
              </Button>
            </a>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-6 border-t border-slate-900 max-w-md">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <CheckCircle2 className="h-4 w-4 text-sky-400 shrink-0" />
              <span>✓ AI Face Recognition</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <CheckCircle2 className="h-4 w-4 text-sky-400 shrink-0" />
              <span>✓ Real-Time Attendance</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <CheckCircle2 className="h-4 w-4 text-sky-400 shrink-0" />
              <span>✓ Subject-wise Analytics</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <CheckCircle2 className="h-4 w-4 text-sky-400 shrink-0" />
              <span>✓ Secure Authentication</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <CheckCircle2 className="h-4 w-4 text-sky-400 shrink-0" />
              <span>✓ Role-Based Access</span>
            </div>
          </div>
        </div>

        {/* Right Side - Real Product Showcase Preview (Mockup UI elements) */}
        <div className="lg:col-span-6 flex items-center justify-center relative">
          <div className="relative w-full max-w-[490px] h-[400px] md:h-[480px]">
            
            {/* Live Camera Preview Widget */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-0 left-0 w-full max-w-[340px] bg-slate-900/80 border border-slate-800 rounded-3xl p-4.5 backdrop-blur-xl shadow-2xl flex flex-col gap-3 z-20"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-sky-400 tracking-wider flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" /> Live Camera Preview
                </span>
                <div className="flex items-center gap-1.5 text-[9px] text-slate-400 font-mono">
                  <Clock className="h-3 w-3" /> 10:15 AM
                </div>
              </div>

              {/* Simulation Screen */}
              <div className="h-[170px] rounded-2xl bg-slate-950 relative overflow-hidden flex items-center justify-center border border-slate-800/60">
                <Video className="h-8 w-8 text-slate-800" />
                
                {/* Custom Face Detection Rectangle overlay */}
                <div className="absolute top-[20%] left-[25%] w-[85px] h-[85px] border-2 border-emerald-400 border-dashed rounded-xl shadow-[0_0_15px_rgba(52,211,153,0.15)] flex items-center justify-center">
                  <div className="absolute top-[-20px] left-0 bg-emerald-400 text-[8px] text-slate-950 font-black px-1.5 py-0.5 rounded shadow">
                    Ravi Verma
                  </div>
                  {/* Bounding markers */}
                  <div className="absolute top-[-2px] left-[-2px] w-2.5 h-2.5 border-t-2 border-l-2 border-emerald-300" />
                  <div className="absolute top-[-2px] right-[-2px] w-2.5 h-2.5 border-t-2 border-r-2 border-emerald-300" />
                  <div className="absolute bottom-[-2px] left-[-2px] w-2.5 h-2.5 border-b-2 border-l-2 border-emerald-300" />
                  <div className="absolute bottom-[-2px] right-[-2px] w-2.5 h-2.5 border-b-2 border-r-2 border-emerald-300" />
                </div>
              </div>

              {/* Student Metadata identified details */}
              <div className="flex items-center justify-between border-t border-slate-800/80 pt-3">
                <div className="text-left">
                  <span className="text-[9px] text-slate-500 uppercase tracking-wider block font-bold">Identified Student</span>
                  <span className="text-xs font-bold text-slate-100">Ravi Verma (Sem 7)</span>
                </div>
                <div className="text-right">
                  <span className="text-[9px] text-slate-500 uppercase tracking-wider block font-bold">Confidence Score</span>
                  <span className="text-xs font-bold text-emerald-400">99.8% match</span>
                </div>
              </div>
            </motion.div>

            {/* Attendance marked successfully banner popup */}
            <motion.div
              animate={{ y: [0, 8, 0], x: [0, 4, 0] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-16 right-0 w-[240px] bg-slate-900/90 border border-slate-800 rounded-2xl p-4.5 backdrop-blur-xl shadow-2xl flex flex-col gap-3.5 z-30"
            >
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                  <Check className="h-4.5 w-4.5" />
                </div>
                <div className="text-left">
                  <h4 className="text-xs font-bold text-slate-100">Attendance Logged</h4>
                  <p className="text-[9px] text-emerald-400/95 font-semibold">Marked Successfully</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 border-t border-slate-800/80 pt-2.5 text-[9px] text-slate-400">
                <div>
                  <span className="text-slate-500 block uppercase font-bold text-[8px]">Subject</span>
                  <span className="font-bold text-slate-200">Artificial Intelligence</span>
                </div>
                <div>
                  <span className="text-slate-500 block uppercase font-bold text-[8px]">Status</span>
                  <span className="font-bold text-emerald-400">PRESENT</span>
                </div>
              </div>
            </motion.div>

            {/* Attendance analytics mini chart widget */}
            <motion.div
              animate={{ y: [0, 6, 0], x: [0, -6, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-4 left-6 w-[200px] bg-slate-900/80 border border-slate-800 rounded-2xl p-4 backdrop-blur-xl shadow-2xl z-10 text-left"
            >
              <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">Attendance Rate</span>
              <div className="text-xl font-mono font-black text-slate-200 mt-1">94.5%</div>
              
              {/* Minimal SVG chart representation */}
              <div className="h-[40px] mt-2 flex items-end gap-1.5">
                <div className="w-full bg-sky-500/20 rounded h-[40%] hover:bg-sky-500 transition-colors" />
                <div className="w-full bg-sky-500/20 rounded h-[65%] hover:bg-sky-500 transition-colors" />
                <div className="w-full bg-sky-500/20 rounded h-[50%] hover:bg-sky-500 transition-colors" />
                <div className="w-full bg-sky-500/20 rounded h-[85%] hover:bg-sky-500 transition-colors" />
                <div className="w-full bg-emerald-500 rounded h-[95%] shadow-[0_0_10px_rgba(16,185,129,0.3)]" />
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 4. STATISTICS SECTION (Animated Counters) */}
      <section id="stats" className="bg-slate-900/20 border-y border-slate-900 py-16 relative z-10">
        <div className="max-w-7xl mx-auto px-6 grid gap-8 grid-cols-2 md:grid-cols-6 text-center">
          <div className="space-y-1.5">
            <div className="text-3xl md:text-4xl font-black text-primary font-mono">
              <Counter value={520} suffix="+" />
            </div>
            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Students Registered</div>
          </div>

          <div className="space-y-1.5">
            <div className="text-3xl md:text-4xl font-black text-emerald-400 font-mono">
              <Counter value={12} />
            </div>
            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Faculty members</div>
          </div>

          <div className="space-y-1.5">
            <div className="text-3xl md:text-4xl font-black text-indigo-400 font-mono">
              <Counter value={42} />
            </div>
            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Subjects</div>
          </div>

          <div className="space-y-1.5">
            <div className="text-3xl md:text-4xl font-black text-purple-400 font-mono">
              <Counter value={3200} suffix="+" />
            </div>
            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Attendance Records</div>
          </div>

          <div className="space-y-1.5">
            <div className="text-3xl md:text-4xl font-black text-sky-400 font-mono">
              <Counter value={99} suffix=".8%" />
            </div>
            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Recognition Accuracy</div>
          </div>

          <div className="space-y-1.5">
            <div className="text-3xl md:text-4xl font-black text-amber-400 font-mono">
              <Counter value={2200} suffix="+" />
            </div>
            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Reports Generated</div>
          </div>
        </div>
      </section>

      {/* 5. PRODUCT CREDIBILITY SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-20 relative z-10 text-center">
        <div className="max-w-3xl mx-auto mb-16 space-y-4">
          <Badge variant="secondary" className="bg-slate-900 border-slate-800 text-slate-400 font-semibold px-3 py-1">Architecture</Badge>
          <h2 className="text-2xl md:text-4xl font-extrabold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            Built for Academic Integrity
          </h2>
        </div>

        {/* Project Credibility Cards */}
        <div className="grid gap-6 md:grid-cols-5 text-left">
          <div className="p-6 rounded-3xl border border-slate-900 bg-slate-950/60 shadow-md">
            <h4 className="font-bold text-slate-200 text-xs mb-1">Designed for Education</h4>
            <p className="text-[10px] text-slate-400 leading-relaxed">Tailored specifically to match departments, roll sheets, and university semester systems.</p>
          </div>
          <div className="p-6 rounded-3xl border border-slate-900 bg-slate-950/60 shadow-md">
            <h4 className="font-bold text-slate-200 text-xs mb-1">Artificial Intelligence</h4>
            <p className="text-[10px] text-slate-400 leading-relaxed">Compiles user images into serialized encoding libraries for fast lookups.</p>
          </div>
          <div className="p-6 rounded-3xl border border-slate-900 bg-slate-950/60 shadow-md">
            <h4 className="font-bold text-slate-200 text-xs mb-1">Computer Vision</h4>
            <p className="text-[10px] text-slate-400 leading-relaxed">Utilizes OpenCV filters to capture and parse high-resolution facial frames.</p>
          </div>
          <div className="p-6 rounded-3xl border border-slate-900 bg-slate-950/60 shadow-md">
            <h4 className="font-bold text-slate-200 text-xs mb-1">Modern Web App</h4>
            <p className="text-[10px] text-slate-400 leading-relaxed">Built with React 19, Vite, Tailwind CSS, and TanStack Router endpoints.</p>
          </div>
          <div className="p-6 rounded-3xl border border-slate-900 bg-slate-950/60 shadow-md">
            <h4 className="font-bold text-slate-200 text-xs mb-1">Secure & Scalable</h4>
            <p className="text-[10px] text-slate-400 leading-relaxed">Bcrypt password hashing and separate tables prevent unauthorized account logins.</p>
          </div>
        </div>
      </section>

      {/* 6. DASHBOARD SHOWCASE */}
      <section id="showcase" className="max-w-7xl mx-auto px-6 py-12 relative z-10 text-center">
        <div className="max-w-3xl mx-auto mb-16 space-y-4">
          <Badge variant="secondary" className="bg-slate-900 border-slate-800 text-slate-400 font-semibold px-3 py-1">See SmartAttend AI in Action</Badge>
          <h2 className="text-2xl md:text-4xl font-extrabold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            Smart Solutions for Smart Campuses
          </h2>
          <p className="text-xs md:text-sm text-slate-400 max-w-xl mx-auto">
            Take a look inside the clean portals designed for faculty logs and student attendance tracking.
          </p>
        </div>

        <ShowcaseMockup />
      </section>

      {/* 7. FEATURES GRID (Highlights) */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-20 border-t border-slate-900/60 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <Badge variant="secondary" className="bg-slate-900 border-slate-800 text-slate-400 font-semibold px-3 py-1">Platform Highlights</Badge>
          <h2 className="text-2xl md:text-4xl font-extrabold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            Complete Institutional Control
          </h2>
          <p className="text-xs md:text-sm text-slate-400 max-w-xl mx-auto">
            Everything your college needs to run face recognition attendance scans.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Card 1: AI Face Recognition */}
          <div className="p-6 md:p-8 rounded-3xl border border-slate-900 bg-slate-950 hover:border-slate-800/80 transition-all duration-300 group flex flex-col justify-between shadow-md hover:translate-y-[-2px]">
            <div>
              <div className="h-10 w-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <ScanFace className="h-5.5 w-5.5" />
              </div>
              <h3 className="font-bold text-slate-100 mb-1.5 text-sm md:text-base">AI Face Recognition</h3>
              <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
                Uses advanced computer vision models to identify students securely.
              </p>
            </div>
          </div>

          {/* Card 2: Auto Attendance */}
          <div className="p-6 md:p-8 rounded-3xl border border-slate-900 bg-slate-950 hover:border-slate-800/80 transition-all duration-300 group flex flex-col justify-between shadow-md hover:translate-y-[-2px]">
            <div>
              <div className="h-10 w-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <Activity className="h-5.5 w-5.5" />
              </div>
              <h3 className="font-bold text-slate-100 mb-1.5 text-sm md:text-base">Automatic Attendance</h3>
              <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
                Start webcam sensors to detect and log attendance automatically within seconds.
              </p>
            </div>
          </div>

          {/* Card 3: Subject-wise Attendance */}
          <div className="p-6 md:p-8 rounded-3xl border border-slate-900 bg-slate-950 hover:border-slate-800/80 transition-all duration-300 group flex flex-col justify-between shadow-md hover:translate-y-[-2px]">
            <div>
              <div className="h-10 w-10 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <BookMarked className="h-5.5 w-5.5" />
              </div>
              <h3 className="font-bold text-slate-100 mb-1.5 text-sm md:text-base">Subject-wise Attendance</h3>
              <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
                Segment records by course codes, departments, and specific semesters catalog.
              </p>
            </div>
          </div>

          {/* Card 4: Faculty Dashboard */}
          <div className="p-6 md:p-8 rounded-3xl border border-slate-900 bg-slate-950 hover:border-slate-800/80 transition-all duration-300 group flex flex-col justify-between shadow-md hover:translate-y-[-2px]">
            <div>
              <div className="h-10 w-10 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <ShieldCheck className="h-5.5 w-5.5" />
              </div>
              <h3 className="font-bold text-slate-100 mb-1.5 text-sm md:text-base">Faculty Dashboard</h3>
              <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
                Dedicated panel for professors to configure subjects and view student details.
              </p>
            </div>
          </div>

          {/* Card 5: Student Dashboard */}
          <div className="p-6 md:p-8 rounded-3xl border border-slate-900 bg-slate-950 hover:border-slate-800/80 transition-all duration-300 group flex flex-col justify-between shadow-md hover:translate-y-[-2px]">
            <div>
              <div className="h-10 w-10 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <GraduationCap className="h-5.5 w-5.5" />
              </div>
              <h3 className="font-bold text-slate-100 mb-1.5 text-sm md:text-base">Student Dashboard</h3>
              <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
                Empower students to monitor attendance rates and exam eligibility targets.
              </p>
            </div>
          </div>

          {/* Card 6: Attendance Analytics */}
          <div className="p-6 md:p-8 rounded-3xl border border-slate-900 bg-slate-950 hover:border-slate-800/80 transition-all duration-300 group flex flex-col justify-between shadow-md hover:translate-y-[-2px]">
            <div>
              <div className="h-10 w-10 rounded-2xl bg-pink-500/10 text-pink-400 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <TrendingUp className="h-5.5 w-5.5" />
              </div>
              <h3 className="font-bold text-slate-100 mb-1.5 text-sm md:text-base">Attendance Analytics</h3>
              <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
                View interactive chart metrics detailing student engagement rates by semester.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. HOW IT WORKS (Modern Timeline Step guides) */}
      <section className="max-w-7xl mx-auto px-6 py-20 border-t border-slate-900/60 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <Badge variant="secondary" className="bg-slate-900 border-slate-800 text-slate-400 font-semibold px-3 py-1">Process Flow</Badge>
          <h2 className="text-2xl md:text-4xl font-extrabold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            How It Works
          </h2>
          <p className="text-xs md:text-sm text-slate-400 max-w-xl mx-auto">
            From setup to analytics: a streamlined automated workflow.
          </p>
        </div>

        {/* Timeline Pipeline Steps layout */}
        <div className="relative max-w-4xl mx-auto space-y-12 before:absolute before:inset-0 before:left-6 md:before:left-1/2 before:w-[2px] before:bg-slate-850 pointer-events-none">
          
          {/* Step 1 */}
          <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between">
            <div className="md:w-5/12 text-left md:text-right md:pr-12 pl-12 md:pl-0">
              <h4 className="font-extrabold text-slate-100 text-sm md:text-base">1. Student Registration</h4>
              <p className="text-xs text-slate-400 leading-relaxed mt-1">Create accounts and add basic details like roll number, department, and semester.</p>
            </div>
            <div className="absolute left-6 md:left-1/2 -translate-x-[11px] h-6 w-6 rounded-full bg-primary border-4 border-slate-950 flex items-center justify-center z-10 shadow-md" />
            <div className="hidden md:block md:w-5/12" />
          </div>

          {/* Step 2 */}
          <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between">
            <div className="hidden md:block md:w-5/12" />
            <div className="absolute left-6 md:left-1/2 -translate-x-[11px] h-6 w-6 rounded-full bg-emerald-450 border-4 border-slate-950 flex items-center justify-center z-10 shadow-md" />
            <div className="md:w-5/12 text-left pl-12 md:pl-12">
              <h4 className="font-extrabold text-slate-100 text-sm md:text-base">2. Face Capture</h4>
              <p className="text-xs text-slate-400 leading-relaxed mt-1">Open the camera stream to capture 20 facial samples to build facial vectors.</p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between">
            <div className="md:w-5/12 text-left md:text-right md:pr-12 pl-12 md:pl-0">
              <h4 className="font-extrabold text-slate-100 text-sm md:text-base">3. AI Model Training</h4>
              <p className="text-xs text-slate-400 leading-relaxed mt-1">Train the facial recognizer module to match embeddings to database files.</p>
            </div>
            <div className="absolute left-6 md:left-1/2 -translate-x-[11px] h-6 w-6 rounded-full bg-purple-400 border-4 border-slate-950 flex items-center justify-center z-10 shadow-md" />
            <div className="hidden md:block md:w-5/12" />
          </div>

          {/* Step 4 */}
          <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between">
            <div className="hidden md:block md:w-5/12" />
            <div className="absolute left-6 md:left-1/2 -translate-x-[11px] h-6 w-6 rounded-full bg-blue-400 border-4 border-slate-950 flex items-center justify-center z-10 shadow-md" />
            <div className="md:w-5/12 text-left pl-12 md:pl-12">
              <h4 className="font-extrabold text-slate-100 text-sm md:text-base">4. Automatic Recognition</h4>
              <p className="text-xs text-slate-400 leading-relaxed mt-1">Scan classes using standard camera feeds to verify matches instantly.</p>
            </div>
          </div>

          {/* Step 5 */}
          <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between">
            <div className="md:w-5/12 text-left md:text-right md:pr-12 pl-12 md:pl-0">
              <h4 className="font-extrabold text-slate-100 text-sm md:text-base">5. Attendance Stored</h4>
              <p className="text-xs text-slate-400 leading-relaxed mt-1">Logs are automatically saved to SQLite database and referenced instantly.</p>
            </div>
            <div className="absolute left-6 md:left-1/2 -translate-x-[11px] h-6 w-6 rounded-full bg-sky-400 border-4 border-slate-950 flex items-center justify-center z-10 shadow-md" />
            <div className="hidden md:block md:w-5/12" />
          </div>

          {/* Step 6 */}
          <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between">
            <div className="hidden md:block md:w-5/12" />
            <div className="absolute left-6 md:left-1/2 -translate-x-[11px] h-6 w-6 rounded-full bg-amber-400 border-4 border-slate-950 flex items-center justify-center z-10 shadow-md" />
            <div className="md:w-5/12 text-left pl-12 md:pl-12">
              <h4 className="font-extrabold text-slate-100 text-sm md:text-base">6. Analytics Generated</h4>
              <p className="text-xs text-slate-400 leading-relaxed mt-1">View overall rate performance and eligibility checklists in real time.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 9. TECHNOLOGY SECTION */}
      <section id="technology" className="max-w-7xl mx-auto px-6 py-20 border-t border-slate-900/60 relative z-10 text-center">
        <div className="max-w-3xl mx-auto mb-12 space-y-4">
          <Badge variant="secondary" className="bg-slate-900 border-slate-800 text-slate-400 font-semibold px-3 py-1">Built with Modern Technologies</Badge>
          <h2 className="text-2xl md:text-4xl font-extrabold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            Next-Gen Tech Infrastructure
          </h2>
        </div>

        {/* Tech Badges grid (Hover scale animations) */}
        <div className="flex flex-wrap justify-center gap-2.5 max-w-3xl mx-auto">
          <Badge className="bg-slate-900 border-slate-850 hover:bg-slate-900/80 text-slate-200 text-xs py-2.5 px-4.5 rounded-xl gap-2 font-mono hover:scale-105 transition-transform"><Cpu className="h-4 w-4 text-sky-400" /> React</Badge>
          <Badge className="bg-slate-900 border-slate-850 hover:bg-slate-900/80 text-slate-200 text-xs py-2.5 px-4.5 rounded-xl gap-2 font-mono hover:scale-105 transition-transform"><Cpu className="h-4 w-4 text-blue-400" /> TypeScript</Badge>
          <Badge className="bg-slate-900 border-slate-850 hover:bg-slate-900/80 text-slate-200 text-xs py-2.5 px-4.5 rounded-xl gap-2 font-mono hover:scale-105 transition-transform"><Brain className="h-4 w-4 text-emerald-400" /> Flask</Badge>
          <Badge className="bg-slate-900 border-slate-850 hover:bg-slate-900/80 text-slate-200 text-xs py-2.5 px-4.5 rounded-xl gap-2 font-mono hover:scale-105 transition-transform"><Brain className="h-4 w-4 text-orange-400" /> Python</Badge>
          <Badge className="bg-slate-900 border-slate-850 hover:bg-slate-900/80 text-slate-200 text-xs py-2.5 px-4.5 rounded-xl gap-2 font-mono hover:scale-105 transition-transform"><Brain className="h-4 w-4 text-blue-500" /> OpenCV</Badge>
          <Badge className="bg-slate-900 border-slate-850 hover:bg-slate-900/80 text-slate-200 text-xs py-2.5 px-4.5 rounded-xl gap-2 font-mono hover:scale-105 transition-transform"><Layers className="h-4 w-4 text-indigo-400" /> MediaPipe</Badge>
          <Badge className="bg-slate-900 border-slate-850 hover:bg-slate-900/80 text-slate-200 text-xs py-2.5 px-4.5 rounded-xl gap-2 font-mono hover:scale-105 transition-transform"><Database className="h-4 w-4 text-sky-500" /> SQLite</Badge>
          <Badge className="bg-slate-900 border-slate-850 hover:bg-slate-900/80 text-slate-200 text-xs py-2.5 px-4.5 rounded-xl gap-2 font-mono hover:scale-105 transition-transform"><Cpu className="h-4 w-4 text-sky-400" /> Tailwind CSS</Badge>
          <Badge className="bg-slate-900 border-slate-850 hover:bg-slate-900/80 text-slate-200 text-xs py-2.5 px-4.5 rounded-xl gap-2 font-mono hover:scale-105 transition-transform"><Cpu className="h-4 w-4 text-teal-400" /> Axios</Badge>
          <Badge className="bg-slate-900 border-slate-850 hover:bg-slate-900/80 text-slate-200 text-xs py-2.5 px-4.5 rounded-xl gap-2 font-mono hover:scale-105 transition-transform"><Terminal className="h-4 w-4 text-yellow-500" /> TanStack Router</Badge>
        </div>
      </section>

      {/* 10. WHY SMARTATTEND AI (Benefits section) */}
      <section className="bg-slate-900/10 border-y border-slate-900/60 py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-16">
          <div className="max-w-3xl mx-auto space-y-4">
            <Badge variant="secondary" className="bg-slate-900 border-slate-800 text-slate-400 font-semibold px-3 py-1">Benefits</Badge>
            <h2 className="text-2xl md:text-4xl font-extrabold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              Why SmartAttend AI
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 text-left">
            {/* Card 1 */}
            <div className="p-6 rounded-3xl border border-slate-900 bg-slate-950/60 hover:border-slate-800/80 transition-all duration-300">
              <h4 className="font-bold text-slate-200 text-sm mb-1">Reduce manual work</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">Save time by automating scanning, checking, and manual paperwork logs.</p>
            </div>
            {/* Card 2 */}
            <div className="p-6 rounded-3xl border border-slate-900 bg-slate-950/60 hover:border-slate-800/80 transition-all duration-300">
              <h4 className="font-bold text-slate-200 text-sm mb-1">Increase accuracy</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">Keep logs secure, reliable, and transparent with zero human errors.</p>
            </div>
            {/* Card 3 */}
            <div className="p-6 rounded-3xl border border-slate-900 bg-slate-950/60 hover:border-slate-800/80 transition-all duration-300">
              <h4 className="font-bold text-slate-200 text-sm mb-1">Real-time reports</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">Instantly filter records by subject or department and download as Excel sheets.</p>
            </div>
            {/* Card 4 */}
            <div className="p-6 rounded-3xl border border-slate-900 bg-slate-950/60 hover:border-slate-800/80 transition-all duration-300">
              <h4 className="font-bold text-slate-200 text-sm mb-1">Easy subject setup</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">Configure new courses, departments, and class thresholds in seconds.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 11. FAQ ACCORDION */}
      <section id="faq" className="max-w-3xl mx-auto px-6 py-20 border-t border-slate-900/60 relative z-10">
        <div className="text-center mb-12 space-y-3">
          <Badge variant="secondary" className="bg-slate-900 border-slate-800 text-slate-400 font-semibold px-3 py-1">FAQ</Badge>
          <h2 className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-1">
          <FaqItem
            question="How does face recognition work?"
            answer="Students register their credentials and capture 20 facial photo samples. Our Python AI module extracts face embeddings/landmarks and compiles them into a serialized model pickle file. During live sessions, OpenCV matches feed vectors to these logged encodings."
          />
          <FaqItem
            question="How accurate is attendance?"
            answer="With 20 facial samples captured from different angles, our system achieves up to 99.8% recognition accuracy under moderate lighting environments, preventing false positives and duplicate logs."
          />
          <FaqItem
            question="Can reports be exported?"
            answer="Yes! Faculty members can export filtered student records, daily attendance details, and final subject sheets directly into formatted Microsoft Excel files (.xlsx) or open PDF prints."
          />
          <FaqItem
            question="How secure is the system?"
            answer="All student and faculty passwords are encrypted using bcrypt hashing before storage. The backend verifies matching rows strictly and returns secure JSON Web Tokens (JWT) for session management."
          />
          <FaqItem
            question="Can multiple departments use it?"
            answer="Absolutely! Subjects can be dynamically configured and assigned to specific departments (e.g. Computer Science, Civil Engineering) and specific semesters (e.g. Semester 5, Semester 7)."
          />
        </div>
      </section>

      {/* 12. CALL TO ACTION BANNER */}
      <section className="max-w-5xl mx-auto px-6 py-16 text-center relative z-10">
        <div className="p-8 md:p-12 rounded-[32px] border border-slate-900 bg-gradient-to-b from-slate-900/80 to-slate-950 relative overflow-hidden shadow-2xl flex flex-col justify-center items-center space-y-6">
          <div className="absolute inset-0 bg-primary/[0.03] mix-blend-color z-0" />
          <h2 className="text-2xl md:text-4xl font-extrabold z-10 bg-gradient-to-r from-white to-slate-350 bg-clip-text text-transparent leading-tight max-w-xl">
            Ready to automate attendance?
          </h2>
          <p className="text-xs md:text-sm text-slate-400 max-w-md z-10 leading-relaxed">
            Register your institution department and set up automatic face captures inside 5 minutes.
          </p>
          <div className="flex gap-3 pt-2 z-10">
            <Link to="/auth">
              <Button size="lg" className="gradient-primary text-primary-foreground font-bold rounded-2xl h-11 px-6 shadow-xl shadow-primary/10 hover:scale-[1.02] transition-transform text-xs">
                Get Started
              </Button>
            </Link>
            <a href="#showcase">
              <Button size="lg" variant="outline" className="text-slate-300 border-slate-800 hover:bg-slate-900 bg-slate-950/20 rounded-2xl h-11 px-6 text-xs font-bold">
                Watch Demo
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* 13. FOOTER */}
      <footer className="border-t border-slate-900/60 bg-slate-950 py-12 text-slate-500 text-[11px] md:text-xs relative z-10">
        <div className="max-w-7xl mx-auto px-6 grid gap-8 md:grid-cols-4">
          <div className="space-y-4 text-left">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center text-primary-foreground">
                <ScanFace className="h-4.5 w-4.5" />
              </div>
              <span className="font-bold text-base text-slate-100">SmartAttend AI</span>
            </div>
            <p className="text-slate-500 leading-relaxed max-w-xs">
              AI-powered Face Recognition Attendance Management System for modern educational environments.
            </p>
          </div>

          <div className="space-y-3 text-left">
            <h5 className="font-bold text-slate-200 text-xs">Explore</h5>
            <ul className="space-y-2">
              <li><a href="#features" className="hover:text-slate-350 transition-colors">Features</a></li>
              <li><a href="#showcase" className="hover:text-slate-350 transition-colors">How It Works</a></li>
              <li><a href="#stats" className="hover:text-slate-350 transition-colors">Impact stats</a></li>
            </ul>
          </div>

          <div className="space-y-3 text-left">
            <h5 className="font-bold text-slate-200 text-xs">Quick Links</h5>
            <ul className="space-y-2">
              <li><Link to="/auth" className="hover:text-slate-350 transition-colors">Access Portal</Link></li>
              <li><Link to="/auth" className="hover:text-slate-350 transition-colors">Register Account</Link></li>
              <li><a href="https://github.com/namratadakhole" target="_blank" rel="noreferrer" className="hover:text-slate-350 transition-colors">GitHub</a></li>
            </ul>
          </div>

          <div className="space-y-3 text-left">
            <h5 className="font-bold text-slate-200 text-xs">Contact</h5>
            <p className="text-slate-500 leading-relaxed">
              Government Engineering College<br />
              Email: tech@gec.university.edu
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 pt-8 mt-8 border-t border-slate-900/60 flex flex-col sm:flex-row justify-between items-center gap-4 text-slate-600">
          <div>&copy; {new Date().getFullYear()} VisionAttend AI. All rights reserved.</div>
          <div className="flex gap-4">
            <a href="https://github.com/namratadakhole" target="_blank" rel="noreferrer" className="hover:text-slate-400 transition-colors">GitHub</a>
            <a href="#" className="hover:text-slate-400 transition-colors">LinkedIn</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

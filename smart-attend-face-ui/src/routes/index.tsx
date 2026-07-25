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
  Layers
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SmartAttend AI · Premium Attendance SaaS" },
      { name: "description", content: "Commercial-grade AI Face Recognition Attendance Management System" }
    ],
  }),
  component: PremiumLandingPage,
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
    { title: "Faculty Console", desc: "Start live sessions, manage database, and configure settings.", color: "from-blue-600 to-indigo-700" },
    { title: "Student Portal", desc: "Real-time attendance percentage, exam eligibility, and subject-wise metrics.", color: "from-emerald-600 to-teal-700" },
    { title: "Webcam Face Capture", desc: "Automatically captures and saves 20 high-quality facial samples.", color: "from-purple-600 to-pink-700" },
    { title: "Attendance Analytics", desc: "Interactive charts showing student engagement and monthly patterns.", color: "from-amber-600 to-orange-700" },
    { title: "Subject-wise Management", desc: "Manage classes, semesters, departments, and course assignments.", color: "from-cyan-600 to-blue-700" },
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
              <Badge className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm border-none font-semibold">Dashboard Showcase</Badge>
              <div className="text-xs text-white/60 font-mono">0{active + 1} / 0{slides.length}</div>
            </div>

            <div className="z-10 space-y-3 max-w-xl text-left">
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

function PremiumLandingPage() {
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
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      
      {/* Soft Glowing Blobs */}
      <div className="absolute top-[10%] left-[10%] w-[450px] h-[450px] rounded-full bg-primary/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[15%] w-[450px] h-[450px] rounded-full bg-emerald-500/10 blur-[130px] pointer-events-none" />
      
      {/* Particle Circuit Line Details */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-slate-800/20 stroke-[1] fill-none" xmlns="http://www.w3.org/2000/svg">
        <path d="M 0 100 H 200 L 250 150 V 300 L 220 330 H 100" />
        <path d="M 1200 400 H 1000 L 950 450 V 600 L 980 630 H 1100" />
      </svg>

      {/* 2. STICKY NAVBAR */}
      <header className={`border-b sticky top-0 z-50 transition-all duration-300 ${scrolled ? "bg-slate-950/90 border-slate-900 py-3.5 backdrop-blur-md" : "bg-transparent border-transparent py-5"}`}>
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
            <a href="#showcase" className="hover:text-slate-100 transition-colors">Product Showcase</a>
            <a href="#how-it-works" className="hover:text-slate-100 transition-colors">How It Works</a>
            <a href="#technology" className="hover:text-slate-100 transition-colors">Technology</a>
            <a href="#faq" className="hover:text-slate-100 transition-colors">FAQ</a>
          </nav>

          {/* Access Buttons */}
          <div className="flex items-center gap-2.5">
            <div className="hidden sm:flex gap-2">
              <Link to="/student/login">
                <Button variant="ghost" className="text-slate-400 hover:text-white text-xs font-semibold h-9 px-3">
                  Student Sign In
                </Button>
              </Link>
              <Link to="/faculty/login">
                <Button variant="ghost" className="text-slate-400 hover:text-white text-xs font-semibold h-9 px-3">
                  Faculty Sign In
                </Button>
              </Link>
            </div>
            <Link to="/auth">
              <Button size="sm" className="gradient-primary text-primary-foreground font-semibold px-4 h-9 shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* 3. HERO SECTION */}
      <section className="max-w-7xl mx-auto px-6 pt-12 pb-20 md:py-28 grid gap-12 lg:grid-cols-12 items-center relative z-10">
        
        {/* Left Side Info */}
        <div className="lg:col-span-6 space-y-6 text-left">
          <Badge className="bg-primary/10 border border-primary/20 text-primary py-1 px-3 rounded-full text-[10px] font-semibold uppercase tracking-wider gap-1 backdrop-blur-md">
            <Sparkles className="h-3 w-3" /> Commercial AI Architecture
          </Badge>

          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.05] bg-gradient-to-b from-white via-slate-50 to-slate-400 bg-clip-text text-transparent">
            <span className="bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent">AI</span> Smart Attendance System
          </h1>

          <p className="text-sm md:text-base text-slate-400 leading-relaxed max-w-xl">
            Next-generation AI-powered attendance management using Face Recognition, Real-Time Analytics, and Intelligent Automation.
          </p>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3.5 pt-2">
            <Link to="/auth">
              <Button size="lg" className="gradient-primary text-primary-foreground font-bold rounded-2xl h-12 px-6 shadow-xl shadow-primary/10 hover:scale-[1.02] transition-transform text-sm">
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

          {/* Feature Badges list */}
          <div className="grid grid-cols-2 gap-3 pt-6 border-t border-slate-900/60 max-w-md">
            <div className="flex items-center gap-2 text-xs text-slate-350">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>99% Face Accuracy</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-350">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Real-Time Attendance</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-350">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Secure Authentication</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-350">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>AI-Powered Insights</span>
            </div>
          </div>
        </div>

        {/* Right Side UI Cards Showcase */}
        <div className="lg:col-span-6 flex items-center justify-center relative">
          <div className="relative w-full max-w-[480px] h-[360px] md:h-[450px]">
            
            {/* Background Blob behind Cards */}
            <div className="absolute inset-0 m-auto w-[250px] h-[250px] rounded-full bg-primary/20 blur-[80px] pointer-events-none" />

            {/* Floating Card 1: Live Webcam Stream Preview */}
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-4 left-4 w-[280px] bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 backdrop-blur-md shadow-2xl flex flex-col gap-2.5 z-20"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" /> Live Camera Feed
                </span>
                <Badge className="bg-primary/20 text-primary border-none text-[8px] py-0.5">ACTIVE</Badge>
              </div>
              <div className="h-[140px] rounded-xl bg-slate-950 relative overflow-hidden flex items-center justify-center border border-slate-900/60">
                <Video className="h-10 w-10 text-slate-800" />
                {/* AI Facial Bounding Box mockup */}
                <div className="absolute top-[25%] left-[30%] w-[70px] h-[70px] border-2 border-emerald-400 rounded-lg">
                  <div className="absolute top-[-22px] left-0 bg-emerald-400 text-[8px] text-slate-950 font-bold px-1 rounded">Ravi Verma</div>
                </div>
              </div>
            </motion.div>

            {/* Floating Card 2: Student Profile Card */}
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-4 right-4 w-[220px] bg-slate-900/70 border border-slate-850 rounded-2xl p-4 backdrop-blur-md shadow-2xl flex flex-col gap-3.5 z-20"
            >
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">RV</div>
                <div className="text-left">
                  <h4 className="text-xs font-bold text-slate-200">Ravi Verma</h4>
                  <p className="text-[10px] text-slate-400">CS21009 · Sem 7</p>
                </div>
              </div>
              <div className="space-y-1.5 border-t border-slate-850 pt-2.5">
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Attendance Rate</span>
                  <span className="font-bold text-emerald-400">88.5%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: "88.5%" }} />
                </div>
              </div>
            </motion.div>

            {/* Floating Card 3: AI Recognition Confidence Meter */}
            <motion.div
              animate={{ x: [0, -8, 0], y: [0, 8, 0] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-16 left-6 w-[180px] bg-slate-900/80 border border-slate-800/80 rounded-xl p-3.5 backdrop-blur-md shadow-2xl flex flex-col gap-2 z-10"
            >
              <span className="text-[9px] uppercase font-bold text-slate-400">AI Confidence</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-slate-100 font-mono">99.2</span>
                <span className="text-xs text-primary font-bold">%</span>
              </div>
              <div className="text-[9px] text-slate-400 leading-relaxed">Model training generated from 20 face samples.</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4. STATISTICS SECTION */}
      <section id="stats" className="bg-slate-900/20 border-y border-slate-900 py-16 relative z-10">
        <div className="max-w-7xl mx-auto px-6 grid gap-8 grid-cols-2 md:grid-cols-5 text-center">
          <div className="space-y-1.5">
            <div className="text-3xl md:text-5xl font-black text-primary">
              <Counter value={550} suffix="+" />
            </div>
            <div className="text-[10px] md:text-xs font-semibold text-slate-400 uppercase tracking-wider">Students Registered</div>
          </div>

          <div className="space-y-1.5">
            <div className="text-3xl md:text-5xl font-black text-emerald-400">
              <Counter value={12} suffix="+" />
            </div>
            <div className="text-[10px] md:text-xs font-semibold text-slate-400 uppercase tracking-wider">Faculty Members</div>
          </div>

          <div className="space-y-1.5">
            <div className="text-3xl md:text-5xl font-black text-indigo-400">
              <Counter value={32} />
            </div>
            <div className="text-[10px] md:text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Subjects</div>
          </div>

          <div className="space-y-1.5">
            <div className="text-3xl md:text-5xl font-black text-purple-400">
              <Counter value={99} suffix=".8%" />
            </div>
            <div className="text-[10px] md:text-xs font-semibold text-slate-400 uppercase tracking-wider">Recognition Accuracy</div>
          </div>

          <div className="space-y-1.5">
            <div className="text-3xl md:text-5xl font-black text-amber-400">
              <Counter value={3400} suffix="+" />
            </div>
            <div className="text-[10px] md:text-xs font-semibold text-slate-400 uppercase tracking-wider">Reports Generated</div>
          </div>
        </div>
      </section>

      {/* 5. PRODUCT SHOWCASE */}
      <section id="showcase" className="max-w-7xl mx-auto px-6 py-20 relative z-10 text-center">
        <div className="max-w-3xl mx-auto mb-16 space-y-4">
          <Badge variant="secondary" className="bg-slate-900 border-slate-800 text-slate-400 font-semibold px-3 py-1">See SmartAttend AI in Action</Badge>
          <h2 className="text-2xl md:text-4xl font-extrabold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            Designed for Instant Campus Management
          </h2>
          <p className="text-xs md:text-sm text-slate-400 max-w-xl mx-auto">
            Take a look inside the clean portals designed for faculty logs and student attendance tracking.
          </p>
        </div>

        <ShowcaseMockup />
      </section>

      {/* 6. FEATURES */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-20 border-t border-slate-900/60 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <Badge variant="secondary" className="bg-slate-900 border-slate-800 text-slate-400 font-semibold px-3 py-1">Platform Features</Badge>
          <h2 className="text-2xl md:text-4xl font-extrabold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            Complete Classroom Control
          </h2>
          <p className="text-xs md:text-sm text-slate-400 max-w-xl mx-auto">
            Eliminate traditional roll calls with powerful automations built directly into the UI dashboard.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Card 1: AI Face Recognition */}
          <div className="p-6 md:p-8 rounded-3xl border border-slate-900 bg-slate-950 hover:border-slate-800/80 transition-all duration-300 group flex flex-col justify-between shadow-md hover:translate-y-[-2px]">
            <div>
              <div className="h-10 w-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <ScanFace className="h-5.5 w-5.5" />
              </div>
              <h3 className="font-bold text-slate-100 mb-1.5">AI Face Recognition</h3>
              <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
                Uses advanced dlib convolutional neural network models to identify student faces rapidly.
              </p>
            </div>
          </div>

          {/* Card 2: Auto Attendance */}
          <div className="p-6 md:p-8 rounded-3xl border border-slate-900 bg-slate-950 hover:border-slate-800/80 transition-all duration-300 group flex flex-col justify-between shadow-md hover:translate-y-[-2px]">
            <div>
              <div className="h-10 w-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <Activity className="h-5.5 w-5.5" />
              </div>
              <h3 className="font-bold text-slate-100 mb-1.5">Auto Attendance</h3>
              <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
                Start webcam sensors to detect and log attendance automatically within seconds.
              </p>
            </div>
          </div>

          {/* Card 3: Attendance Analytics */}
          <div className="p-6 md:p-8 rounded-3xl border border-slate-900 bg-slate-950 hover:border-slate-800/80 transition-all duration-300 group flex flex-col justify-between shadow-md hover:translate-y-[-2px]">
            <div>
              <div className="h-10 w-10 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <TrendingUp className="h-5.5 w-5.5" />
              </div>
              <h3 className="font-bold text-slate-100 mb-1.5">Attendance Analytics</h3>
              <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
                Generates interactive charts to visualize monthly percentages and identify low attendance warning points.
              </p>
            </div>
          </div>

          {/* Card 4: Student Dashboard */}
          <div className="p-6 md:p-8 rounded-3xl border border-slate-900 bg-slate-950 hover:border-slate-800/80 transition-all duration-300 group flex flex-col justify-between shadow-md hover:translate-y-[-2px]">
            <div>
              <div className="h-10 w-10 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <GraduationCap className="h-5.5 w-5.5" />
              </div>
              <h3 className="font-bold text-slate-100 mb-1.5">Student Dashboard</h3>
              <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
                Empower students to check overall attendance, subject eligibility, and configure profile parameters.
              </p>
            </div>
          </div>

          {/* Card 5: Faculty Dashboard */}
          <div className="p-6 md:p-8 rounded-3xl border border-slate-900 bg-slate-950 hover:border-slate-800/80 transition-all duration-300 group flex flex-col justify-between shadow-md hover:translate-y-[-2px]">
            <div>
              <div className="h-10 w-10 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <ShieldCheck className="h-5.5 w-5.5" />
              </div>
              <h3 className="font-bold text-slate-100 mb-1.5">Faculty Console</h3>
              <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
                A dedicated interface for professors to manage course codes, semesters, and departments.
              </p>
            </div>
          </div>

          {/* Card 6: Reports & Exports */}
          <div className="p-6 md:p-8 rounded-3xl border border-slate-900 bg-slate-950 hover:border-slate-800/80 transition-all duration-300 group flex flex-col justify-between shadow-md hover:translate-y-[-2px]">
            <div>
              <div className="h-10 w-10 rounded-2xl bg-pink-500/10 text-pink-400 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <Download className="h-5.5 w-5.5" />
              </div>
              <h3 className="font-bold text-slate-100 mb-1.5">Reports & Exports</h3>
              <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
                Generate clean, printer-friendly reports and download Excel spreadsheets instantly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. HOW IT WORKS */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-6 py-20 border-t border-slate-900/60 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <Badge variant="secondary" className="bg-slate-900 border-slate-800 text-slate-400 font-semibold px-3 py-1">Process</Badge>
          <h2 className="text-2xl md:text-4xl font-extrabold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            How It Works
          </h2>
          <p className="text-xs md:text-sm text-slate-400 max-w-xl mx-auto">
            From setup to analytics: a streamlined automated workflow.
          </p>
        </div>

        {/* Timeline Steps layout */}
        <div className="relative max-w-4xl mx-auto space-y-8 md:space-y-12 before:absolute before:inset-0 before:left-6 md:before:left-1/2 before:w-[2px] before:bg-slate-800/60 pointer-events-none">
          
          {/* Step 1 */}
          <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between">
            <div className="md:w-5/12 text-left md:text-right md:pr-12 pl-12 md:pl-0">
              <h4 className="font-extrabold text-slate-100 text-sm md:text-base">1. Student Registration</h4>
              <p className="text-xs md:text-sm text-slate-400 leading-relaxed mt-1">Create accounts and add basic details like roll number, department, and semester.</p>
            </div>
            <div className="absolute left-6 md:left-1/2 -translate-x-[11px] h-6 w-6 rounded-full bg-primary border-4 border-slate-950 flex items-center justify-center z-10 shadow-md" />
            <div className="hidden md:block md:w-5/12" />
          </div>

          {/* Step 2 */}
          <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between">
            <div className="hidden md:block md:w-5/12" />
            <div className="absolute left-6 md:left-1/2 -translate-x-[11px] h-6 w-6 rounded-full bg-emerald-400 border-4 border-slate-950 flex items-center justify-center z-10 shadow-md" />
            <div className="md:w-5/12 text-left pl-12 md:pl-12">
              <h4 className="font-extrabold text-slate-100 text-sm md:text-base">2. Face Capture</h4>
              <p className="text-xs md:text-sm text-slate-400 leading-relaxed mt-1">Open the camera stream to capture 20 facial samples to build facial vectors.</p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between">
            <div className="md:w-5/12 text-left md:text-right md:pr-12 pl-12 md:pl-0">
              <h4 className="font-extrabold text-slate-100 text-sm md:text-base">3. AI Model Training</h4>
              <p className="text-xs md:text-sm text-slate-400 leading-relaxed mt-1">Train the facial recognizer module to match embeddings to database files.</p>
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
              <p className="text-xs md:text-sm text-slate-400 leading-relaxed mt-1">Scan classes using standard camera feeds to verify matches instantly.</p>
            </div>
          </div>

          {/* Step 5 */}
          <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between">
            <div className="md:w-5/12 text-left md:text-right md:pr-12 pl-12 md:pl-0">
              <h4 className="font-extrabold text-slate-100 text-sm md:text-base">5. Analytics & Storing</h4>
              <p className="text-xs md:text-sm text-slate-400 leading-relaxed mt-1">Automatically save logs to SQLite database and query visual metrics charts.</p>
            </div>
            <div className="absolute left-6 md:left-1/2 -translate-x-[11px] h-6 w-6 rounded-full bg-amber-400 border-4 border-slate-950 flex items-center justify-center z-10 shadow-md" />
            <div className="hidden md:block md:w-5/12" />
          </div>
        </div>
      </section>

      {/* 8. TECHNOLOGY STACK */}
      <section id="technology" className="max-w-7xl mx-auto px-6 py-20 border-t border-slate-900/60 relative z-10 text-center">
        <div className="max-w-3xl mx-auto mb-12 space-y-4">
          <Badge variant="secondary" className="bg-slate-900 border-slate-800 text-slate-400 font-semibold px-3 py-1">Built With</Badge>
          <h2 className="text-2xl md:text-4xl font-extrabold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            Technical Architecture Stack
          </h2>
          <p className="text-xs md:text-sm text-slate-400 max-w-xl mx-auto">
            High performance libraries integrated to build robust and scalable features.
          </p>
        </div>

        {/* Stack Grid badges */}
        <div className="flex flex-wrap justify-center gap-2.5 max-w-3xl mx-auto">
          <Badge className="bg-slate-900 border-slate-850 hover:bg-slate-900/80 text-slate-200 text-xs py-2 px-4 rounded-xl gap-2 font-mono"><Cpu className="h-4 w-4 text-sky-400" /> React 19</Badge>
          <Badge className="bg-slate-900 border-slate-850 hover:bg-slate-900/80 text-slate-200 text-xs py-2 px-4 rounded-xl gap-2 font-mono"><Cpu className="h-4 w-4 text-blue-400" /> TypeScript</Badge>
          <Badge className="bg-slate-900 border-slate-850 hover:bg-slate-900/80 text-slate-200 text-xs py-2 px-4 rounded-xl gap-2 font-mono"><Brain className="h-4 w-4 text-emerald-400" /> Python Flask</Badge>
          <Badge className="bg-slate-900 border-slate-850 hover:bg-slate-900/80 text-slate-200 text-xs py-2 px-4 rounded-xl gap-2 font-mono"><Brain className="h-4 w-4 text-orange-400" /> OpenCV</Badge>
          <Badge className="bg-slate-900 border-slate-850 hover:bg-slate-900/80 text-slate-200 text-xs py-2 px-4 rounded-xl gap-2 font-mono"><Database className="h-4 w-4 text-indigo-400" /> SQLite3</Badge>
          <Badge className="bg-slate-900 border-slate-850 hover:bg-slate-900/80 text-slate-200 text-xs py-2 px-4 rounded-xl gap-2 font-mono"><Cpu className="h-4 w-4 text-teal-400" /> Tailwind CSS</Badge>
          <Badge className="bg-slate-900 border-slate-850 hover:bg-slate-900/80 text-slate-200 text-xs py-2 px-4 rounded-xl gap-2 font-mono"><Terminal className="h-4 w-4 text-yellow-500" /> TanStack Router</Badge>
          <Badge className="bg-slate-900 border-slate-850 hover:bg-slate-900/80 text-slate-200 text-xs py-2 px-4 rounded-xl gap-2 font-mono"><Cpu className="h-4 w-4 text-purple-400" /> Axios</Badge>
        </div>
      </section>

      {/* 9. WHY CHOOSE SMARTATTEND AI */}
      <section className="bg-slate-900/10 border-y border-slate-900/60 py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-16">
          <div className="max-w-3xl mx-auto space-y-4">
            <Badge variant="secondary" className="bg-slate-900 border-slate-800 text-slate-400 font-semibold px-3 py-1">Benefits</Badge>
            <h2 className="text-2xl md:text-4xl font-extrabold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              Why Choose SmartAttend AI
            </h2>
            <p className="text-xs md:text-sm text-slate-400 max-w-xl mx-auto">
              Unlock powerful educational automations.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 text-left">
            {/* Benefit 1 */}
            <div className="p-6 rounded-3xl border border-slate-900 bg-slate-950/60">
              <h4 className="font-bold text-slate-200 text-sm mb-1">No Manual Attendance</h4>
              <p className="text-xs text-slate-400 leading-relaxed">Completely removes registers, saving hours of class time every single week.</p>
            </div>
            {/* Benefit 2 */}
            <div className="p-6 rounded-3xl border border-slate-900 bg-slate-950/60">
              <h4 className="font-bold text-slate-200 text-sm mb-1">AI-Powered Verification</h4>
              <p className="text-xs text-slate-400 leading-relaxed">Matches features with up to 99.8% precision models to block buddy logs.</p>
            </div>
            {/* Benefit 3 */}
            <div className="p-6 rounded-3xl border border-slate-900 bg-slate-950/60">
              <h4 className="font-bold text-slate-200 text-sm mb-1">Instant Export Sheets</h4>
              <p className="text-xs text-slate-400 leading-relaxed">Download final attendance logs in structured Excel format with 1 click.</p>
            </div>
            {/* Benefit 4 */}
            <div className="p-6 rounded-3xl border border-slate-900 bg-slate-950/60">
              <h4 className="font-bold text-slate-200 text-sm mb-1">Role Isolation</h4>
              <p className="text-xs text-slate-400 leading-relaxed">Dedicated interfaces with secure JWT session access protection levels.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 10. TESTIMONIALS */}
      <section id="testimonials" className="max-w-7xl mx-auto px-6 py-20 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <Badge variant="secondary" className="bg-slate-900 border-slate-800 text-slate-400 font-semibold px-3 py-1">Reviews</Badge>
          <h2 className="text-2xl md:text-4xl font-extrabold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            Loved by Administrators
          </h2>
          <p className="text-xs md:text-sm text-slate-400 max-w-xl mx-auto">
            See how colleges use VisionAttend to streamline course verification logs.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="p-6 md:p-8 rounded-3xl border border-slate-900 bg-slate-950 flex flex-col justify-between shadow-md">
            <p className="text-xs md:text-sm text-slate-350 leading-relaxed mb-6 italic">
              "We slashed attendance scanning times from 10 minutes to zero. The system recognizes 60 students in a classroom with zero delays."
            </p>
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-slate-800 text-[10px] flex items-center justify-center font-bold text-slate-300">AP</div>
              <div>
                <div className="font-bold text-slate-200 text-xs">Dr. Amit Patel</div>
                <div className="text-[9px] text-slate-500 uppercase font-semibold">Head of CSE, State College</div>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8 rounded-3xl border border-slate-900 bg-slate-950 flex flex-col justify-between shadow-md">
            <p className="text-xs md:text-sm text-slate-355 leading-relaxed mb-6 italic">
              "As a student, keeping track of class requirements was tough. The dashboard shows my eligibility status instantly for every subject!"
            </p>
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-slate-800 text-[10px] flex items-center justify-center font-bold text-slate-300">RM</div>
              <div>
                <div className="font-bold text-slate-200 text-xs">Rohan Mehta</div>
                <div className="text-[9px] text-slate-500 uppercase font-semibold">Final Year CSE Student</div>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8 rounded-3xl border border-slate-900 bg-slate-950 flex flex-col justify-between shadow-md">
            <p className="text-xs md:text-sm text-slate-355 leading-relaxed mb-6 italic">
              "Generating final semester lists for the exam cell took hours. Now, we export the completed records in excel format with one click."
            </p>
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-slate-800 text-[10px] flex items-center justify-center font-bold text-slate-300">SS</div>
              <div>
                <div className="font-bold text-slate-200 text-xs">Prof. Sarah Sen</div>
                <div className="text-[9px] text-slate-500 uppercase font-semibold">Dean of Academics, GEC</div>
              </div>
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
              <li><a href="#how-it-works" className="hover:text-slate-350 transition-colors">How It Works</a></li>
              <li><a href="#stats" className="hover:text-slate-350 transition-colors">Impact stats</a></li>
            </ul>
          </div>

          <div className="space-y-3 text-left">
            <h5 className="font-bold text-slate-200 text-xs">Quick Links</h5>
            <ul className="space-y-2">
              <li><Link to="/auth" className="hover:text-slate-350 transition-colors">Access Portal</Link></li>
              <li><Link to="/auth" className="hover:text-slate-350 transition-colors">Register Account</Link></li>
              <li><a href="https://github.com/namratadakhole" target="_blank" rel="noreferrer" className="hover:text-slate-350 transition-colors">GitHub Repository</a></li>
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

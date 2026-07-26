import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
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
  Globe,
  Users,
  Play,
  Github,
  Video,
  Cpu,
  Brain,
  Download,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
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
function ShowcaseMockup({ highlight = false }: { highlight?: boolean }) {
  const slides = [
    { 
      title: "Faculty Dashboard", 
      desc: "Complete control panel for professors to manage course codes, semester catalogs, departments, and register sessions.", 
      color: "from-blue-600 to-indigo-800",
      type: "faculty"
    },
    { 
      title: "Student Dashboard", 
      desc: "Personal portal for students to monitor attendance rates, check subject-wise details, and track threshold targets.", 
      color: "from-sky-600 to-blue-800",
      type: "student"
    },
    { 
      title: "Student Registration", 
      desc: "Allows new students to enroll by filling details and performing automated face captures.", 
      color: "from-cyan-600 to-sky-700",
      type: "register"
    },
    { 
      title: "Attendance Recognition", 
      desc: "Automatically detects student faces through the webcam feed and logs attendance instantly.", 
      color: "from-indigo-600 to-slate-800",
      type: "attendance"
    },
    { 
      title: "Analytics Console", 
      desc: "Interactive chart metrics, exam eligibility checkers, and statistical rate sheets showing student engagement.", 
      color: "from-blue-700 to-cyan-800",
      type: "analytics"
    },
  ];

  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setActive((prev) => (prev + 1) % slides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  const handleNext = () => {
    setDirection(1);
    setActive((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setActive((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // Helper function to render a mockup visual on the right of the slide
  const renderSlideMockup = (type: string) => {
    switch (type) {
      case "faculty":
        return (
          <div className="w-full h-full bg-slate-950/80 border border-slate-800 rounded-xl p-3 flex flex-col gap-2 font-sans text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-bold text-slate-200">Professor Console</span>
              <Badge className="bg-sky-500/20 text-sky-400 border-none text-[9px] py-0">ADMIN</Badge>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 bg-slate-900 rounded-lg border border-slate-800 text-left">
                <span className="text-[9px] text-slate-500 block uppercase font-bold">Subject</span>
                <span className="font-semibold text-slate-300">Artificial Intelligence</span>
              </div>
              <div className="p-2 bg-slate-900 rounded-lg border border-slate-800 text-left">
                <span className="text-[9px] text-slate-500 block uppercase font-bold">Total Students</span>
                <span className="font-semibold text-slate-350">32 Enrolled</span>
              </div>
            </div>
            <div className="flex-1 bg-slate-900 rounded-lg border border-slate-800 p-2 flex flex-col justify-between text-left">
              <span className="text-[9px] text-slate-500 uppercase font-bold">Roster Actions</span>
              <div className="flex justify-between items-center mt-1">
                <span className="text-[10px] text-slate-400">Class threshold: 75%</span>
                <div className="h-4 w-12 bg-sky-500 rounded text-[9px] flex items-center justify-center font-bold text-slate-950">Active</div>
              </div>
            </div>
          </div>
        );
      case "student":
        return (
          <div className="w-full h-full bg-slate-950/80 border border-slate-800 rounded-xl p-3 flex flex-col gap-2 font-sans text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-bold text-slate-200">Student Dashboard</span>
              <Badge className="bg-sky-500/20 text-sky-400 border-none text-[9px] py-0">CS21001</Badge>
            </div>
            <div className="flex items-center gap-3 bg-slate-900 rounded-lg border border-slate-800 p-2.5">
              <div className="h-10 w-10 rounded-full bg-sky-500/10 text-sky-400 flex items-center justify-center font-black">92%</div>
              <div className="text-left flex-1">
                <h5 className="font-bold text-slate-200 text-[11px]">Overall Attendance</h5>
                <span className="text-[9px] text-sky-400 font-semibold uppercase">✓ Exam Eligible</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-1.5 text-[9px] text-slate-400">
              <div className="p-1.5 bg-slate-900 rounded border border-slate-800 text-left">
                <span className="block text-slate-500">Operating Systems</span>
                <span className="font-bold text-slate-300">85.0%</span>
              </div>
              <div className="p-1.5 bg-slate-900 rounded border border-slate-800 text-left">
                <span className="block text-slate-500">Computer Networks</span>
                <span className="font-bold text-slate-300">94.2%</span>
              </div>
            </div>
          </div>
        );
      case "register":
        return (
          <div className="w-full h-full bg-slate-950/80 border border-slate-800 rounded-xl p-3 flex flex-col gap-2 font-sans text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
              <span className="font-bold text-slate-200">Face Capture Form</span>
            </div>
            <div className="space-y-1.5 text-left text-[9px]">
              <div>
                <span className="text-slate-500 block">Full Name</span>
                <div className="h-5 px-1.5 bg-slate-900 border border-slate-800 rounded flex items-center text-slate-300">Ravi Verma</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-500 block">Roll Number</span>
                  <div className="h-5 px-1.5 bg-slate-900 border border-slate-800 rounded flex items-center text-slate-300">CS21009</div>
                </div>
                <div>
                  <span className="text-slate-500 block">Semester</span>
                  <div className="h-5 px-1.5 bg-slate-900 border border-slate-800 rounded flex items-center text-slate-300">7</div>
                </div>
              </div>
            </div>
            <div className="h-8 bg-sky-500/10 border border-sky-400/20 text-sky-400 text-[10px] rounded flex items-center justify-center gap-1.5 font-bold">
              <Video className="h-3.5 w-3.5 animate-pulse" /> Capture Face (12/20 completed)
            </div>
          </div>
        );
      case "attendance":
        return (
          <div className="w-full h-full bg-slate-950/80 border border-slate-800 rounded-xl p-3 flex flex-col gap-2 font-sans text-xs relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-bold text-slate-200">Active Camera Sensor</span>
              <span className="h-2 w-2 rounded-full bg-cyan-450 animate-pulse" />
            </div>
            <div className="flex-1 bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-center relative overflow-hidden">
              <ScanFace className="h-10 w-10 text-slate-800" />
              {/* Bounding box mock overlay */}
              <div className="absolute top-[20%] left-[30%] w-[60px] h-[60px] border border-dashed border-cyan-400 rounded-lg">
                <span className="absolute top-[-14px] left-0 bg-cyan-400 text-[7px] text-slate-950 font-bold px-1 rounded">Ravi Verma</span>
              </div>
            </div>
            <div className="flex justify-between items-center text-[9px]">
              <span className="text-slate-400">Match score: 99.8%</span>
              <span className="text-cyan-400 font-bold">✓ Logged successfully</span>
            </div>
          </div>
        );
      case "analytics":
        return (
          <div className="w-full h-full bg-slate-950/80 border border-slate-800 rounded-xl p-3 flex flex-col gap-2 font-sans text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-bold text-slate-200">Roster Analytics</span>
              <Badge className="bg-sky-500/20 text-sky-400 border-none text-[9px] py-0">STATS</Badge>
            </div>
            {/* Mock chart layout */}
            <div className="flex-1 flex items-end gap-2.5 px-2 pb-1">
              <div className="w-full bg-sky-500/20 rounded h-[35%]" />
              <div className="w-full bg-sky-500/20 rounded h-[65%]" />
              <div className="w-full bg-sky-500/20 rounded h-[50%]" />
              <div className="w-full bg-sky-500/20 rounded h-[80%]" />
              <div className="w-full bg-sky-500 rounded h-[95%]" />
            </div>
            <div className="flex justify-between items-center text-[8px] text-slate-500">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 z-10 relative group">
      
      {/* Navigation Arrows */}
      <button 
        onClick={handlePrev}
        className="absolute left-[-10px] md:left-[-35px] top-[45%] -translate-y-1/2 z-35 h-9 w-9 rounded-full bg-slate-900/90 border border-slate-800 text-slate-450 hover:text-white flex items-center justify-center hover:bg-slate-850 transition-colors shadow-xl cursor-pointer"
      >
        <ChevronLeft className="h-4.5 w-4.5" />
      </button>
      <button 
        onClick={handleNext}
        className="absolute right-[-10px] md:right-[-35px] top-[45%] -translate-y-1/2 z-35 h-9 w-9 rounded-full bg-slate-900/90 border border-slate-800 text-slate-450 hover:text-white flex items-center justify-center hover:bg-slate-850 transition-colors shadow-xl cursor-pointer"
      >
        <ChevronRight className="h-4.5 w-4.5" />
      </button>

      {/* Laptop Mockup Frame */}
      <div 
        className={`relative mx-auto border-gray-850 bg-gray-800 border-[8px] md:border-[12px] rounded-t-3xl h-[260px] sm:h-[360px] md:h-[450px] max-w-[800px] shadow-2xl overflow-hidden transition-all duration-500 ${
          highlight ? "ring-4 ring-sky-500 shadow-[0_0_35px_rgba(14,165,233,0.45)] scale-[1.01]" : ""
        }`}
      >
        <div className="rounded-lg overflow-hidden h-full w-full relative">
          <div className="absolute inset-0 bg-slate-900 text-white select-none overflow-hidden">
            
            {/* Slider animation wrapper */}
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={active}
                custom={direction}
                initial={{ opacity: 0, x: direction * 80 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -direction * 80 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="absolute inset-0 flex flex-col justify-between p-5 md:p-8 z-10"
              >
                {/* Background color gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-tr ${slides[active].color} opacity-95 mix-blend-multiply z-0`} />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808010_1px,transparent_1px),linear-gradient(to_bottom,#80808010_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

                <div className="z-10 flex justify-between items-start">
                  <Badge className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm border-none font-semibold text-[9px] py-0.5">Live Mockup Preview</Badge>
                  <div className="text-[10px] text-white/60 font-mono">0{active + 1} / 0{slides.length}</div>
                </div>

                {/* Grid Split Content */}
                <div className="z-10 grid gap-6 md:grid-cols-2 items-center flex-1 py-4">
                  {/* Left slide text */}
                  <div className="space-y-2 md:space-y-3.5 text-left max-w-sm">
                    <h3 className="text-xl md:text-3xl font-extrabold tracking-tight leading-tight">{slides[active].title}</h3>
                    <p className="text-[10px] md:text-xs text-white/90 leading-relaxed">{slides[active].desc}</p>
                  </div>

                  {/* Right slide visual mockup */}
                  <div className="hidden sm:block h-[190px] w-full max-w-[280px] mx-auto">
                    {renderSlideMockup(slides[active].type)}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

          </div>
        </div>
      </div>
      {/* Laptop Base */}
      <div className="relative mx-auto bg-gray-900 rounded-b-xl rounded-t-sm h-[14px] max-w-[860px] shadow-lg" />
      <div className="relative mx-auto bg-gray-800 rounded-b-xl h-[4px] max-w-[140px]" />

      {/* Slide Indicators */}
      <div className="flex justify-center gap-2 mt-5">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              setDirection(idx > active ? 1 : -1);
              setActive(idx);
            }}
            className={`h-2 rounded-full transition-all duration-300 ${active === idx ? "w-6 bg-primary" : "w-2 bg-slate-700 hover:bg-slate-650"}`}
          />
        ))}
      </div>
    </div>
  );
}

function AnimatedCounter({ value, label, prefix = "", suffix = "" }: { value: number; label: string; prefix?: string; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let start = 0;
          const end = value;
          const duration = 2000;
          const increment = end / (duration / 16);
          const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
              clearInterval(timer);
              setCount(end);
            } else {
              setCount(Math.floor(start * 10) / 10);
            }
          }, 16);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => observer.disconnect();
  }, [value, hasAnimated]);

  return (
    <div ref={ref} className="text-left space-y-0.5">
      <div className="text-2xl md:text-3xl font-black font-mono text-slate-50 flex items-baseline gap-0.5">
        <span>{prefix}</span>
        <span>{count.toLocaleString()}</span>
        <span className="text-sky-400 font-extrabold">{suffix}</span>
      </div>
      <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">{label}</div>
    </div>
  );
}

function EdTechLandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [demoVideoOpen, setDemoVideoOpen] = useState(false);
  const [highlightShowcase, setHighlightShowcase] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  // Set this to a URL string (e.g. YouTube embed or MP4 path) to trigger the popup modal mode.
  const DEMO_VIDEO_URL = null; 

  const handleWatchDemo = (e: React.MouseEvent) => {
    e.preventDefault();
    if (DEMO_VIDEO_URL) {
      setDemoVideoOpen(true);
    } else {
      const showcaseEl = document.getElementById("showcase");
      if (showcaseEl) {
        showcaseEl.scrollIntoView({ behavior: "smooth" });
        
        // Brief highlight flash overlay animation
        setHighlightShowcase(true);
        setTimeout(() => {
          setHighlightShowcase(false);
        }, 2200);
      }
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);

      const sections = ["showcase", "features", "technology", "faq"];
      let current = "home";
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 140 && rect.bottom >= 140) {
            current = section;
            break;
          }
        }
      }
      setActiveSection(current);
    };
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const { scrollY } = useScroll();
  const yParallax1 = useTransform(scrollY, [0, 1000], [0, -120]);
  const yParallax2 = useTransform(scrollY, [0, 1000], [0, 80]);
  const yParallax3 = useTransform(scrollY, [0, 1000], [0, -40]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-primary selection:text-primary-foreground relative overflow-hidden">
      
      {/* CSS Animations style block */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scrollGrid {
          from {
            background-position: 0 0;
          }
          to {
            background-position: 64px 64px;
          }
        }
        @keyframes auroraFloat {
          0% {
            transform: translate(-30%, -20%) rotate(0deg) scale(1);
            opacity: 0.15;
          }
          50% {
            transform: translate(-20%, -10%) rotate(180deg) scale(1.1);
            opacity: 0.35;
          }
          100% {
            transform: translate(-30%, -20%) rotate(360deg) scale(1);
            opacity: 0.15;
          }
        }
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}} />

      {/* 1. BACKGROUND DECORATIONS */}
      {/* Fractal Noise Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.015] z-0 bg-[repeat:repeat]" 
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
      />

      {/* Radial Vignette Shadow Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(2,6,23,0.85)_100%)] pointer-events-none z-0" />

      {/* Moving Grid Pattern */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,#0284c705_1px,transparent_1px),linear-gradient(to_bottom,#0284c705_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0"
        style={{ animation: "scrollGrid 25s linear infinite" }}
      />
      
      {/* Premium Aurora Gradient (Parallax Scroll linked) */}
      <motion.div 
        style={{ y: yParallax1 }}
        className="absolute top-[-15%] left-[-10%] w-[120%] h-[75%] overflow-hidden pointer-events-none opacity-20 blur-[130px] z-0 select-none"
      >
        <div 
          className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-sky-600 via-blue-600 to-indigo-750" 
          style={{ animation: "auroraFloat 22s infinite alternate ease-in-out" }}
        />
        <div 
          className="absolute bottom-0 right-[15%] w-[700px] h-[700px] rounded-full bg-gradient-to-tr from-blue-600 via-cyan-700 to-sky-700" 
          style={{ animation: "auroraFloat 28s infinite alternate-reverse ease-in-out" }}
        />
      </motion.div>
      
      {/* Glowing blue and indigo blurred circles (Parallax) */}
      <motion.div 
        style={{ y: yParallax2 }}
        className="absolute top-[25%] right-[-10%] w-[400px] h-[400px] rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none z-0"
      />
      <motion.div 
        style={{ y: yParallax3 }}
        className="absolute bottom-[10%] left-[-5%] w-[450px] h-[450px] rounded-full bg-sky-500/10 blur-[130px] pointer-events-none z-0"
      />
      
      {/* Mouse Follow Spotlight with Low Opacity */}
      <div 
        className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-300 opacity-60"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(14, 165, 233, 0.05), transparent 80%)`,
        }}
      />

      {/* AI Circuit Path lines with Very Low Opacity (opacity-20) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-sky-500/10 stroke-[1.2] fill-none opacity-20 z-0" xmlns="http://www.w3.org/2000/svg">
        <path d="M 0 120 H 150 L 190 160 V 280 L 170 300 H 60" />
        <path d="M 1400 350 H 1150 L 1110 390 V 550 L 1130 570 H 1250" />
      </svg>
      
      {/* Floating Particles using Framer Motion */}
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-sky-450/30 pointer-events-none z-0"
          style={{
            width: Math.random() * 4 + 2,
            height: Math.random() * 4 + 2,
            left: `${Math.random() * 95}%`,
            top: `${Math.random() * 85 + 5}%`,
          }}
          animate={{
            y: [0, -50, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [0.1, 0.6, 0.1],
          }}
          transition={{
            duration: Math.random() * 10 + 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* 2. STICKY NAVBAR */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`sticky top-0 z-50 border-b transition-all duration-300 ${
          scrolled 
            ? "bg-slate-950/80 border-slate-900/60 py-4 backdrop-blur-lg shadow-lg" 
            : "bg-transparent border-transparent py-6.5"
        }`}
      >
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
          <nav className="hidden lg:flex items-center gap-10 text-[10px] uppercase tracking-widest font-black text-slate-400">
            <a 
              href="#showcase" 
              className={`relative py-2 transition-all duration-300 hover:text-slate-100 group ${activeSection === "showcase" ? "text-sky-400" : "text-slate-450"}`}
            >
              How It Works
              <span className={`absolute bottom-[-2px] left-0 h-[2px] bg-gradient-to-r from-sky-400 to-blue-500 rounded-full transition-all duration-300 ${activeSection === "showcase" ? "w-full shadow-[0_0_8px_rgba(56,189,248,0.6)]" : "w-0 group-hover:w-full"}`} />
            </a>
            <a 
              href="#features" 
              className={`relative py-2 transition-all duration-300 hover:text-slate-100 group ${activeSection === "features" ? "text-sky-400" : "text-slate-450"}`}
            >
              Features
              <span className={`absolute bottom-[-2px] left-0 h-[2px] bg-gradient-to-r from-sky-400 to-blue-500 rounded-full transition-all duration-300 ${activeSection === "features" ? "w-full shadow-[0_0_8px_rgba(56,189,248,0.6)]" : "w-0 group-hover:w-full"}`} />
            </a>
            <a 
              href="#technology" 
              className={`relative py-2 transition-all duration-300 hover:text-slate-100 group ${activeSection === "technology" ? "text-sky-400" : "text-slate-450"}`}
            >
              Technology
              <span className={`absolute bottom-[-2px] left-0 h-[2px] bg-gradient-to-r from-sky-400 to-blue-500 rounded-full transition-all duration-300 ${activeSection === "technology" ? "w-full shadow-[0_0_8px_rgba(56,189,248,0.6)]" : "w-0 group-hover:w-full"}`} />
            </a>
            <a 
              href="#faq" 
              className={`relative py-2 transition-all duration-300 hover:text-slate-100 group ${activeSection === "faq" ? "text-sky-400" : "text-slate-450"}`}
            >
              FAQ
              <span className={`absolute bottom-[-2px] left-0 h-[2px] bg-gradient-to-r from-sky-400 to-blue-500 rounded-full transition-all duration-300 ${activeSection === "faq" ? "w-full shadow-[0_0_8px_rgba(56,189,248,0.6)]" : "w-0 group-hover:w-full"}`} />
            </a>
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
      </motion.header>

      {/* 3. HERO SECTION (Redesigned SaaS Layout) */}
      <section className="max-w-7xl mx-auto px-6 pt-4 pb-20 md:pt-6 md:pb-28 grid gap-12 grid-cols-1 lg:grid-cols-10 items-center relative z-10">
        
        {/* Left Side Content (40% Column Width) */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="lg:col-span-4 flex flex-col gap-6 text-left"
        >
          {/* Badge */}
          <div className="inline-flex">
            <Badge className="bg-sky-500/10 border border-sky-400/20 text-sky-400 py-1.5 px-3.5 rounded-full text-xs font-semibold uppercase tracking-wider gap-1.5 backdrop-blur-md animate-pulse shadow-[0_0_15px_rgba(14,165,233,0.15)]">
              <Sparkles className="h-3.5 w-3.5" /> AI-Powered Face Recognition Attendance
            </Badge>
          </div>

          {/* Heading */}
          <div className="relative">
            {/* Spotlight effect behind the hero heading */}
            <div className="absolute -inset-10 bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.18)_0%,transparent_60%)] blur-3xl pointer-events-none z-0" />
            <h1 className="relative z-10 text-5xl sm:text-7xl lg:text-[76px] font-black tracking-tight leading-[0.95] bg-gradient-to-b from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              AI Smart Attendance <br className="hidden lg:inline" />
              System
            </h1>
          </div>

          <p className="text-base md:text-lg font-semibold text-sky-400/90 leading-relaxed max-w-2xl">
            Transform classroom attendance with AI-powered face recognition, secure authentication, real-time analytics, and intelligent automation.
          </p>

          <p className="text-sm md:text-base text-slate-400/95 leading-relaxed max-w-2xl">
            Eliminate manual attendance registers using computer vision and AI. Manage students, faculty, attendance records, reports, and analytics from one intelligent platform.
          </p>

          {/* Action buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 w-full max-w-[620px]"
          >
            <Link to="/auth" className="w-full">
              <Button size="lg" className="w-full gradient-primary text-primary-foreground font-black rounded-2xl h-[56px] px-6 shadow-xl shadow-primary/20 hover:scale-[1.03] hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all duration-300 text-sm md:text-base flex items-center justify-center gap-2">
                Get Started <ArrowRight className="h-4 w-4 shrink-0" />
              </Button>
            </Link>
            <a href="#showcase" onClick={handleWatchDemo} className="w-full">
              <Button size="lg" variant="outline" className="w-full text-slate-350 border-slate-800 hover:border-slate-700 hover:bg-slate-900 bg-slate-950/20 rounded-2xl h-[56px] px-6 text-sm md:text-base font-black hover:scale-[1.03] hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] transition-all duration-300 flex items-center justify-center">
                Watch Demo
              </Button>
            </a>
            <a href="https://github.com/namratadakhole" target="_blank" rel="noreferrer" className="w-full">
              <Button size="lg" variant="outline" className="w-full text-slate-400 border-slate-900 hover:border-slate-850 hover:text-white bg-slate-950/10 rounded-2xl h-[56px] px-6 text-sm md:text-base font-semibold hover:scale-[1.03] hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] transition-all duration-300 flex items-center justify-center gap-1">
                GitHub Repo
              </Button>
            </a>
          </motion.div>

          {/* Trust Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="pt-4 border-t border-slate-900/60 max-w-xl flex flex-col gap-3"
          >
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Built with</span>
            <div className="flex flex-wrap gap-2">
              {["React", "TypeScript", "Flask", "Python", "OpenCV", "MediaPipe", "MongoDB", "Tailwind CSS"].map((tech) => (
                <Badge key={tech} className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-sky-500/40 text-slate-300 hover:text-sky-300 hover:shadow-[0_0_15px_rgba(56,189,248,0.15)] transition-all duration-300 rounded-lg px-2.5 py-1 text-[10px] font-semibold">
                  {tech}
                </Badge>
              ))}
            </div>
          </motion.div>

          {/* Statistics Counters */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="grid grid-cols-2 gap-x-8 gap-y-4 pt-4 border-t border-slate-900/60 max-w-md"
          >
            <AnimatedCounter value={99.8} label="Recognition Accuracy" suffix="%" />
            <AnimatedCounter value={1000} label="Attendance Records" suffix="+" />
            <AnimatedCounter value={500} label="Registered Students" suffix="+" />
            <AnimatedCounter value={20} label="Faculty Members" suffix="+" />
          </motion.div>
        </motion.div>

        {/* Right Side Content - Visual Focus SaaS Mockup Dashboard (60% Column Width) */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="lg:col-span-6 flex items-center justify-center relative w-full lg:-mt-16 lg:translate-y-[-16px]"
        >
          {/* Intense premium blue/cyan lighting backdrop glow behind the glass container */}
          <div className="absolute -inset-20 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.38)_0%,rgba(6,182,212,0.15)_45%,transparent_75%)] rounded-full blur-[120px] pointer-events-none" />

          {/* Single premium glass container shell (Increased by 30% width/height limits) */}
          <div className="relative w-full max-w-[820px] z-20 group/panel">
            {/* Inner hover neon border glow */}
            <div className="absolute -inset-2 bg-gradient-to-r from-sky-500/25 to-blue-500/25 rounded-3xl blur-3xl opacity-85 group-hover/panel:opacity-100 group-hover/panel:scale-[1.03] transition-all duration-500 pointer-events-none" />

            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              className="w-full bg-slate-950/40 border border-white/10 rounded-3xl p-5 md:p-6 backdrop-blur-2xl shadow-[0_35px_70px_-15px_rgba(0,0,0,0.9)] hover:border-white/25 transition-all duration-300 relative overflow-hidden flex flex-col gap-4"
            >
              {/* Internal card glow highlight */}
              <div className="absolute -inset-16 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.22)_0%,rgba(6,182,212,0.1)_45%,transparent_75%)] blur-3xl opacity-90 group-hover/panel:opacity-100 transition-opacity duration-500 pointer-events-none z-0" />

              {/* Subtle glass light sheen sweep animation overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover/panel:animate-[shimmer_1.5s_infinite] pointer-events-none" />

              {/* Top Window Control Bar Chrome */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-900">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-slate-800" />
                  <span className="h-2.5 w-2.5 rounded-full bg-slate-850" />
                  <span className="h-2.5 w-2.5 rounded-full bg-slate-900" />
                </div>
                <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono bg-slate-950/50 px-3 py-1 rounded-lg border border-slate-900">
                  <Globe className="h-3 w-3 text-sky-500/50" /> smartattend.ai/console
                </div>
                <div className="flex items-center gap-1">
                  <Badge className="bg-sky-500/10 border border-sky-500/20 text-sky-400 text-[9px] font-mono">v1.2.0</Badge>
                </div>
              </div>

              {/* Dashboard Grid - Sidebar + Content */}
              <div className="grid grid-cols-12 gap-4 flex-1">
                {/* Sidebar Navigation */}
                <div className="col-span-3 border-r border-slate-900 pr-3 flex flex-col gap-3 text-left">
                  <div className="flex items-center gap-2 py-1 px-1.5 rounded-lg bg-white/5 border border-white/5">
                    <div className="h-5 w-5 rounded-md bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center text-[10px] font-black text-slate-950 font-mono">SA</div>
                    <div className="flex-1 min-w-0">
                      <span className="block text-[10px] font-bold text-slate-200 truncate">IIT Kharagpur</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    {[
                      { label: "Overview", icon: Cpu, active: true },
                      { label: "Students", icon: GraduationCap },
                      { label: "Attendance", icon: ScanFace },
                      { label: "Analytics", icon: TrendingUp },
                      { label: "Settings", icon: ShieldCheck }
                    ].map((item) => (
                      <div key={item.label} className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-[10px] font-semibold transition-all ${item.active ? "bg-sky-500/10 text-sky-400 border border-sky-500/10" : "text-slate-500 hover:text-slate-350 hover:bg-white/5"}`}>
                        <item.icon className="h-3.5 w-3.5" />
                        <span>{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Main Content Dashboard panel */}
                <div className="col-span-9 flex flex-col gap-4 text-left pl-1">
                  {/* Inner Header */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-[11px] uppercase font-black text-slate-500 tracking-wider">Faculty Console</h4>
                      <h3 className="text-sm font-bold text-slate-200">Artificial Intelligence Session</h3>
                    </div>
                    <Badge className="bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[9px] font-mono py-0.5 px-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse mr-1 inline-block" /> ACTIVE SCANNER
                    </Badge>
                  </div>

                  {/* Inner Row 1: Camera Scan + Identified profile details */}
                  <div className="grid grid-cols-12 gap-3">
                    {/* Live Camera (30% larger viewport representation) */}
                    <div className="col-span-7 h-[175px] rounded-xl bg-slate-950/90 relative overflow-hidden flex items-center justify-center border border-slate-900 group/feed">
                      <Video className="h-8 w-8 text-slate-800 group-hover/feed:text-slate-700 transition-colors" />
                      
                      {/* Scanning HUD Grid overlay */}
                      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_45%,#06b6d415_50%,transparent_55%)] bg-[size:100%_20px] animate-[pulse_2s_infinite] pointer-events-none" />

                      {/* Face recognition bounding boxes inside console */}
                      <div className="absolute top-[18%] left-[20%] w-[90px] h-[90px] border-2 border-cyan-400 border-dashed rounded-xl shadow-[0_0_25px_rgba(6,182,212,0.2)] flex items-center justify-center">
                        <div className="absolute top-[-22px] left-0 bg-cyan-450 text-[8px] text-slate-950 font-black px-1.5 py-0.5 rounded shadow flex items-center gap-1 font-mono">
                          ✓ Ravi Verma
                        </div>
                        {/* Box corner markers */}
                        <div className="absolute top-[-2px] left-[-2px] w-2.5 h-2.5 border-t-2 border-l-2 border-cyan-300" />
                        <div className="absolute top-[-2px] right-[-2px] w-2.5 h-2.5 border-t-2 border-r-2 border-cyan-300" />
                        <div className="absolute bottom-[-2px] left-[-2px] w-2.5 h-2.5 border-b-2 border-l-2 border-cyan-300" />
                        <div className="absolute bottom-[-2px] right-[-2px] w-2.5 h-2.5 border-b-2 border-r-2 border-cyan-300" />
                      </div>

                      <div className="absolute bottom-2 left-2 text-[8px] font-mono text-cyan-400 bg-slate-950/80 px-2 py-0.5 rounded-full border border-cyan-500/10">
                        SCANNING IN PROGRESS
                      </div>
                    </div>

                    {/* Meta stats details */}
                    <div className="col-span-5 flex flex-col justify-between p-2.5 rounded-xl bg-slate-950/50 border border-slate-900 text-xs">
                      <div className="space-y-1">
                        <span className="text-[7.5px] font-black text-slate-500 uppercase tracking-widest block">Logged Attendance</span>
                        <h5 className="font-extrabold text-slate-100 text-xs truncate">Ravi Verma</h5>
                        <span className="text-[9px] font-mono text-slate-400 block">Roll: CS21009</span>
                        <span className="text-[9px] font-mono text-slate-500 block">CSE • Semester 7</span>
                      </div>
                      
                      <div className="border-t border-slate-900 my-1.5" />
                      
                      <div className="grid grid-cols-2 gap-1.5">
                        <div>
                          <span className="text-[7px] text-slate-500 uppercase block font-black">Confidence</span>
                          <span className="text-[10px] font-bold text-cyan-400">99.8%</span>
                        </div>
                        <div>
                          <span className="text-[7px] text-slate-500 uppercase block font-black">Status</span>
                          <Badge className="bg-cyan-500/15 border-none text-[8px] text-cyan-400 py-0 px-1 font-bold h-4">Present</Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Inner Row 2: Attendance rate stats & Interactive mini graph logs */}
                  <div className="grid grid-cols-12 gap-3">
                    <div className="col-span-4 p-2.5 rounded-xl bg-slate-950/50 border border-slate-900 flex flex-col justify-between">
                      <span className="text-[7.5px] font-black text-slate-500 uppercase tracking-widest block">Class Attendance Rate</span>
                      <div className="flex items-baseline gap-1 mt-1">
                        <span className="text-sm font-mono font-black text-slate-200">94.5%</span>
                        <span className="text-[8px] text-cyan-400 font-bold">✓ Target met</span>
                      </div>
                    </div>
                    
                    <div className="col-span-8 p-2.5 rounded-xl bg-slate-950/50 border border-slate-900 flex items-center justify-between gap-4">
                      <div className="flex-1">
                        <span className="text-[7.5px] font-black text-slate-500 uppercase tracking-widest block">Weekly Sessions Metrics</span>
                        <span className="text-[9px] text-slate-400 block mt-0.5">Average threshold score: 92%</span>
                      </div>
                      
                      {/* SVG Bar Chart logs */}
                      <div className="h-7 flex items-end gap-1.5 shrink-0 px-1">
                        <div className="w-2 bg-sky-500/15 rounded-sm h-[30%]" />
                        <div className="w-2 bg-sky-500/20 rounded-sm h-[50%]" />
                        <div className="w-2 bg-sky-500/20 rounded-sm h-[40%]" />
                        <div className="w-2 bg-sky-500/30 rounded-sm h-[75%]" />
                        <div className="w-2 bg-gradient-to-t from-sky-500 to-cyan-400 rounded-sm h-[95%] shadow-[0_0_10px_rgba(6,182,212,0.3)]" />
                      </div>
                    </div>
                  </div>

                </div>
              </div>

            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* 5. PRODUCT CREDIBILITY SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-28 relative z-10 text-center">
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

        <ShowcaseMockup highlight={highlightShowcase} />
      </section>

      {/* 7. FEATURES GRID (Highlights) */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-28 border-t border-slate-900/60 relative z-10">
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
              <div className="h-10 w-10 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
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
              <div className="h-10 w-10 rounded-2xl bg-blue-500/10 text-blue-450 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
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
              <div className="h-10 w-10 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
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
              <div className="h-10 w-10 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
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
      <section className="max-w-7xl mx-auto px-6 py-28 border-t border-slate-900/60 relative z-10">
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
            <div className="absolute left-6 md:left-1/2 -translate-x-[11px] h-6 w-6 rounded-full bg-cyan-500 border-4 border-slate-950 flex items-center justify-center z-10 shadow-md" />
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
            <div className="absolute left-6 md:left-1/2 -translate-x-[11px] h-6 w-6 rounded-full bg-blue-400 border-4 border-slate-950 flex items-center justify-center z-10 shadow-md" />
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
              <p className="text-xs text-slate-400 leading-relaxed mt-1">Logs are automatically saved to MongoDB Atlas database and referenced instantly.</p>
            </div>
            <div className="absolute left-6 md:left-1/2 -translate-x-[11px] h-6 w-6 rounded-full bg-sky-400 border-4 border-slate-950 flex items-center justify-center z-10 shadow-md" />
            <div className="hidden md:block md:w-5/12" />
          </div>

          {/* Step 6 */}
          <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between">
            <div className="hidden md:block md:w-5/12" />
            <div className="absolute left-6 md:left-1/2 -translate-x-[11px] h-6 w-6 rounded-full bg-cyan-400 border-4 border-slate-950 flex items-center justify-center z-10 shadow-md" />
            <div className="md:w-5/12 text-left pl-12 md:pl-12">
              <h4 className="font-extrabold text-slate-100 text-sm md:text-base">6. Analytics Generated</h4>
              <p className="text-xs text-slate-400 leading-relaxed mt-1">View overall rate performance and eligibility checklists in real time.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 9. TECHNOLOGY SECTION */}
      <section id="technology" className="max-w-7xl mx-auto px-6 py-28 border-t border-slate-900/60 relative z-10 text-center">
        <div className="max-w-3xl mx-auto mb-12 space-y-4">
          <Badge variant="secondary" className="bg-slate-900 border-slate-800 text-slate-400 font-semibold px-3 py-1">Built with Modern Technologies</Badge>
          <h2 className="text-2xl md:text-4xl font-extrabold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            Next-Gen Tech Infrastructure
          </h2>
        </div>

        {/* Tech Badges grid (Hover scale animations) */}
        <div className="flex flex-wrap justify-center gap-2.5 max-w-3xl mx-auto">
          <Badge className="bg-white/5 border border-white/10 hover:border-sky-500/40 text-slate-300 hover:text-sky-300 hover:shadow-[0_0_15px_rgba(56,189,248,0.15)] text-xs py-2.5 px-4.5 rounded-xl gap-2 font-mono hover:scale-105 transition-all duration-300"><Cpu className="h-4 w-4 text-sky-400" /> React</Badge>
          <Badge className="bg-white/5 border border-white/10 hover:border-sky-500/40 text-slate-300 hover:text-sky-300 hover:shadow-[0_0_15px_rgba(56,189,248,0.15)] text-xs py-2.5 px-4.5 rounded-xl gap-2 font-mono hover:scale-105 transition-all duration-300"><Cpu className="h-4 w-4 text-blue-400" /> TypeScript</Badge>
          <Badge className="bg-white/5 border border-white/10 hover:border-sky-500/40 text-slate-300 hover:text-sky-300 hover:shadow-[0_0_15px_rgba(56,189,248,0.15)] text-xs py-2.5 px-4.5 rounded-xl gap-2 font-mono hover:scale-105 transition-all duration-300"><Brain className="h-4 w-4 text-cyan-400" /> Flask</Badge>
          <Badge className="bg-white/5 border border-white/10 hover:border-sky-500/40 text-slate-300 hover:text-sky-300 hover:shadow-[0_0_15px_rgba(56,189,248,0.15)] text-xs py-2.5 px-4.5 rounded-xl gap-2 font-mono hover:scale-105 transition-all duration-300"><Brain className="h-4 w-4 text-blue-500" /> Python</Badge>
          <Badge className="bg-white/5 border border-white/10 hover:border-sky-500/40 text-slate-300 hover:text-sky-300 hover:shadow-[0_0_15px_rgba(56,189,248,0.15)] text-xs py-2.5 px-4.5 rounded-xl gap-2 font-mono hover:scale-105 transition-all duration-300"><Brain className="h-4 w-4 text-blue-500" /> OpenCV</Badge>
          <Badge className="bg-white/5 border border-white/10 hover:border-sky-500/40 text-slate-300 hover:text-sky-300 hover:shadow-[0_0_15px_rgba(56,189,248,0.15)] text-xs py-2.5 px-4.5 rounded-xl gap-2 font-mono hover:scale-105 transition-all duration-300"><Layers className="h-4 w-4 text-indigo-400" /> MediaPipe</Badge>
          <Badge className="bg-white/5 border border-white/10 hover:border-sky-500/40 text-slate-300 hover:text-sky-300 hover:shadow-[0_0_15px_rgba(56,189,248,0.15)] text-xs py-2.5 px-4.5 rounded-xl gap-2 font-mono hover:scale-105 transition-all duration-300"><Database className="h-4 w-4 text-sky-400" /> MongoDB Atlas</Badge>
          <Badge className="bg-white/5 border border-white/10 hover:border-sky-500/40 text-slate-300 hover:text-sky-300 hover:shadow-[0_0_15px_rgba(56,189,248,0.15)] text-xs py-2.5 px-4.5 rounded-xl gap-2 font-mono hover:scale-105 transition-all duration-300"><Cpu className="h-4 w-4 text-sky-400" /> Tailwind CSS</Badge>
          <Badge className="bg-white/5 border border-white/10 hover:border-sky-500/40 text-slate-300 hover:text-sky-300 hover:shadow-[0_0_15px_rgba(56,189,248,0.15)] text-xs py-2.5 px-4.5 rounded-xl gap-2 font-mono hover:scale-105 transition-all duration-300"><Cpu className="h-4 w-4 text-cyan-500" /> Axios</Badge>
          <Badge className="bg-white/5 border border-white/10 hover:border-sky-500/40 text-slate-300 hover:text-sky-300 hover:shadow-[0_0_15px_rgba(56,189,248,0.15)] text-xs py-2.5 px-4.5 rounded-xl gap-2 font-mono hover:scale-105 transition-all duration-300"><Terminal className="h-4 w-4 text-blue-400" /> TanStack Router</Badge>
        </div>
      </section>

      {/* 10. WHY SMARTATTEND AI (Benefits section) */}
      <section className="bg-slate-900/10 border-y border-slate-900/60 py-28 relative z-10">
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
      <section id="faq" className="max-w-3xl mx-auto px-6 py-28 border-t border-slate-900/60 relative z-10">
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
            <a href="#showcase" onClick={handleWatchDemo}>
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

      {/* 14. DEMO VIDEO MODAL (If added in the future) */}
      <AnimatePresence>
        {demoVideoOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-md p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl"
            >
              {/* Close Button */}
              <button 
                onClick={() => setDemoVideoOpen(false)}
                className="absolute top-4 right-4 z-[110] bg-slate-950/80 text-slate-450 hover:text-white p-2 rounded-full border border-slate-800 transition-colors cursor-pointer"
                aria-label="Close video demo"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="aspect-video w-full bg-black flex items-center justify-center">
                {DEMO_VIDEO_URL && (DEMO_VIDEO_URL.includes("youtube.com") || DEMO_VIDEO_URL.includes("youtu.be")) ? (
                  <iframe 
                    src={DEMO_VIDEO_URL} 
                    className="w-full h-full border-none" 
                    title="SmartAttend AI Demo Video" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                  />
                ) : (
                  <video 
                    src={DEMO_VIDEO_URL || ""} 
                    controls 
                    autoPlay 
                    className="w-full h-full"
                  />
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

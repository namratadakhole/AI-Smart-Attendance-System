import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
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
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AI Smart Attendance System · SaaS Portal" },
      { name: "description", content: "Professional AI Face Recognition Attendance Management System" }
    ],
  }),
  component: LandingPage,
});

// Reusable Counter component for animated statistics
function Counter({ value, suffix = "", duration = 1500 }: { value: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) return;

    const totalMiliseconds = duration;
    const incrementTime = Math.abs(Math.floor(totalMiliseconds / end));

    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start === end) clearInterval(timer);
    }, incrementTime || 1);

    return () => clearInterval(timer);
  }, [value, duration]);

  return <span>{count}{suffix}</span>;
}

// Reusable Screenshot Slideshow Carousel
function ScreenshotCarousel() {
  const slides = [
    { title: "Faculty Dashboard", desc: "Start live sessions, manage database, and configure settings.", color: "from-blue-600 to-indigo-700" },
    { title: "Student Dashboard", desc: "Real-time attendance percentage, exam eligibility, and subject-wise metrics.", color: "from-emerald-600 to-teal-700" },
    { title: "Webcam Face Capture", desc: "Automatically captures and saves 20 high-quality facial samples.", color: "from-purple-600 to-pink-700" },
    { title: "Attendance Analytics", desc: "Interactive charts showing student engagement and monthly patterns.", color: "from-amber-600 to-orange-700" },
    { title: "Subject-wise Management", desc: "Manage classes, semesters, departments, and course assignments.", color: "from-cyan-600 to-blue-700" },
  ];

  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full max-w-4xl bg-slate-900 border border-slate-800/80 rounded-[32px] p-4 md:p-8 shadow-2xl relative overflow-hidden">
      {/* Slides display */}
      <div className="h-[280px] md:h-[420px] rounded-2xl bg-gradient-to-tr flex flex-col justify-between p-8 text-white relative transition-all duration-700 shadow-inner overflow-hidden shadow-black/50 select-none">
        <div className={`absolute inset-0 bg-gradient-to-tr ${slides[active].color} opacity-95 mix-blend-multiply z-0`} />
        
        {/* Decorative Grid Line Patterns */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

        <div className="z-10 flex justify-between items-start">
          <Badge className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm border-none font-semibold">Live Preview</Badge>
          <div className="text-xs text-white/60 font-mono">0{active + 1} / 0{slides.length}</div>
        </div>

        <div className="z-10 space-y-3 max-w-xl">
          <h3 className="text-2xl md:text-4xl font-extrabold tracking-tight">{slides[active].title}</h3>
          <p className="text-sm md:text-base text-white/95 leading-relaxed">{slides[active].desc}</p>
        </div>
      </div>

      {/* Manual indicators */}
      <div className="flex justify-center gap-2.5 mt-6">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActive(idx)}
            className={`h-2.5 rounded-full transition-all duration-300 ${active === idx ? "w-8 bg-primary" : "w-2.5 bg-slate-700 hover:bg-slate-600"}`}
          />
        ))}
      </div>
    </div>
  );
}

function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-primary selection:text-primary-foreground relative overflow-hidden">
      {/* Background radial highlight */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute top-[40%] right-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none" />

      {/* 1. Header (Navigation Bar) */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center text-primary-foreground shadow-lg group-hover:scale-105 transition-transform duration-300">
              <ScanFace className="h-5.5 w-5.5" />
            </div>
            <span className="font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-50 via-slate-150 to-slate-350">
              SmartAttend<span className="text-primary font-black font-mono ml-0.5">AI</span>
            </span>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-400">
            <a href="#features" className="hover:text-slate-100 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-slate-100 transition-colors">How It Works</a>
            <a href="#stats" className="hover:text-slate-100 transition-colors">Impact</a>
            <a href="#testimonials" className="hover:text-slate-100 transition-colors">Testimonials</a>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Link to="/auth">
              <Button variant="ghost" className="text-slate-300 hover:text-white font-semibold">
                Sign In
              </Button>
            </Link>
            <Link to="/auth">
              <Button className="gradient-primary text-primary-foreground font-semibold px-5 shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-24 md:py-32 flex flex-col items-center text-center relative z-10 space-y-8">
        <Badge className="bg-primary/10 border border-primary/20 text-primary py-1.5 px-4 rounded-full text-xs font-semibold uppercase tracking-wider gap-1.5 backdrop-blur-md">
          <Sparkles className="h-3.5 w-3.5" /> AI-Powered Face Recognition
        </Badge>
        
        <h1 className="text-4xl md:text-7xl font-black tracking-tight leading-none max-w-4xl bg-gradient-to-b from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
          AI Smart Attendance System
        </h1>
        
        <p className="text-base md:text-xl text-slate-400 max-w-2xl leading-relaxed">
          AI-powered Face Recognition Attendance Management System for Educational Institutions. Ditch the register, capture attendance instantly.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Link to="/auth">
            <Button size="lg" className="w-full sm:w-auto gradient-primary text-primary-foreground font-bold px-8 py-6 rounded-2xl shadow-xl shadow-primary/10 hover:scale-[1.02] transition-transform">
              Get Started <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <a href="#features">
            <Button size="lg" variant="outline" className="w-full sm:w-auto text-slate-300 border-slate-800 hover:bg-slate-900 bg-slate-950/20 px-8 py-6 rounded-2xl font-bold">
              Learn More
            </Button>
          </a>
        </div>

        {/* Dynamic Image Slideshow Container */}
        <div className="w-full pt-16 flex justify-center">
          <ScreenshotCarousel />
        </div>
      </section>

      {/* 3. Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-20 border-t border-slate-900/60 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <Badge variant="secondary" className="bg-slate-900 border-slate-800 text-slate-400 font-semibold px-3 py-1">Capabilities</Badge>
          <h2 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            Smart Classroom Orchestration
          </h2>
          <p className="text-sm md:text-base text-slate-400 max-w-xl mx-auto">
            Everything your institution needs to register students, monitor real-time class attendances, and compile report statistics.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Card 1 */}
          <div className="p-6 md:p-8 rounded-3xl border border-slate-900 bg-slate-950 hover:border-slate-800/80 transition-all duration-300 group shadow-md hover:translate-y-[-2px]">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
              <ScanFace className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100 mb-2">AI Face Recognition</h3>
            <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
              Detects and matches faces in milliseconds with up to 99.8% precision models.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 md:p-8 rounded-3xl border border-slate-900 bg-slate-950 hover:border-slate-800/80 transition-all duration-300 group shadow-md hover:translate-y-[-2px]">
            <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
              <Activity className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100 mb-2">Automatic Attendance</h3>
            <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
              Scan classrooms using your local webcam sensor to log students automatically.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 md:p-8 rounded-3xl border border-slate-900 bg-slate-950 hover:border-slate-800/80 transition-all duration-300 group shadow-md hover:translate-y-[-2px]">
            <div className="h-12 w-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
              <Calendar className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100 mb-2">Subject-wise Analytics</h3>
            <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
              Segment records by course code, department, and current semester catalog.
            </p>
          </div>

          {/* Card 4 */}
          <div className="p-6 md:p-8 rounded-3xl border border-slate-900 bg-slate-950 hover:border-slate-800/80 transition-all duration-300 group shadow-md hover:translate-y-[-2px]">
            <div className="h-12 w-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
              <LayoutDashboard className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100 mb-2">Student Dashboard</h3>
            <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
              Personalized dashboard for students to check thresholds, metrics, and profiles.
            </p>
          </div>

          {/* Card 5 */}
          <div className="p-6 md:p-8 rounded-3xl border border-slate-900 bg-slate-950 hover:border-slate-800/80 transition-all duration-300 group shadow-md hover:translate-y-[-2px]">
            <div className="h-12 w-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100 mb-2">Faculty Console</h3>
            <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
              Empower professors to handle configurations, check rosters, and start capture streams.
            </p>
          </div>

          {/* Card 6 */}
          <div className="p-6 md:p-8 rounded-3xl border border-slate-900 bg-slate-950 hover:border-slate-800/80 transition-all duration-300 group shadow-md hover:translate-y-[-2px]">
            <div className="h-12 w-12 rounded-2xl bg-pink-500/10 text-pink-400 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
              <TrendingUp className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100 mb-2">Reports and Exports</h3>
            <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
              Export daily summaries, logs, and subject sheets into standard PDF & Excel files.
            </p>
          </div>
        </div>
      </section>

      {/* 4. How It Works Section */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-6 py-20 border-t border-slate-900/60 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <Badge variant="secondary" className="bg-slate-900 border-slate-800 text-slate-400 font-semibold px-3 py-1">Quick Start</Badge>
          <h2 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            How It Works
          </h2>
          <p className="text-sm md:text-base text-slate-400 max-w-xl mx-auto">
            From registry to intelligence in 5 easy steps.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-5 text-center">
          {/* Step 1 */}
          <div className="space-y-4">
            <div className="h-12 w-12 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-bold text-base mx-auto shadow-md">1</div>
            <h4 className="font-bold text-slate-200">Register</h4>
            <p className="text-xs text-slate-400 leading-relaxed">Set up student profiles with basic metadata.</p>
          </div>

          {/* Step 2 */}
          <div className="space-y-4">
            <div className="h-12 w-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 font-bold text-base mx-auto">2</div>
            <h4 className="font-bold text-slate-200">Capture Face</h4>
            <p className="text-xs text-slate-400 leading-relaxed">Generate 20 training photo frames using the webcam.</p>
          </div>

          {/* Step 3 */}
          <div className="space-y-4">
            <div className="h-12 w-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 font-bold text-base mx-auto">3</div>
            <h4 className="font-bold text-slate-200">AI Training</h4>
            <p className="text-xs text-slate-400 leading-relaxed">Compile deep learning models to identify embeddings.</p>
          </div>

          {/* Step 4 */}
          <div className="space-y-4">
            <div className="h-12 w-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 font-bold text-base mx-auto">4</div>
            <h4 className="font-bold text-slate-200">Auto Scan</h4>
            <p className="text-xs text-slate-400 leading-relaxed">Run real-time webcam streams to tag matching students.</p>
          </div>

          {/* Step 5 */}
          <div className="space-y-4">
            <div className="h-12 w-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 font-bold text-base mx-auto">5</div>
            <h4 className="font-bold text-slate-200">Analytics</h4>
            <p className="text-xs text-slate-400 leading-relaxed">Analyze overall rate performance and eligibility checklists.</p>
          </div>
        </div>
      </section>

      {/* 5. Statistics Section */}
      <section id="stats" className="bg-slate-900/30 border-y border-slate-900 py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-6 grid gap-8 grid-cols-2 md:grid-cols-5 text-center">
          <div className="space-y-2">
            <div className="text-3xl md:text-5xl font-black text-primary font-mono">
              <Counter value={500} suffix="+" />
            </div>
            <div className="text-xs md:text-sm font-semibold text-slate-400 uppercase tracking-wider">Students Managed</div>
          </div>

          <div className="space-y-2">
            <div className="text-3xl md:text-5xl font-black text-emerald-400 font-mono">
              <Counter value={45} />
            </div>
            <div className="text-xs md:text-sm font-semibold text-slate-400 uppercase tracking-wider">Subjects</div>
          </div>

          <div className="space-y-2">
            <div className="text-3xl md:text-5xl font-black text-indigo-400 font-mono">
              <Counter value={98} suffix="%" />
            </div>
            <div className="text-xs md:text-sm font-semibold text-slate-400 uppercase tracking-wider">Attendance Accuracy</div>
          </div>

          <div className="space-y-2">
            <div className="text-3xl md:text-5xl font-black text-purple-400 font-mono">
              <Counter value={99} suffix=".8%" />
            </div>
            <div className="text-xs md:text-sm font-semibold text-slate-400 uppercase tracking-wider">AI Recognition</div>
          </div>

          <div className="space-y-2">
            <div className="text-3xl md:text-5xl font-black text-amber-400 font-mono">
              <Counter value={2500} suffix="+" />
            </div>
            <div className="text-xs md:text-sm font-semibold text-slate-400 uppercase tracking-wider">Reports Generated</div>
          </div>
        </div>
      </section>

      {/* 6. Testimonials Section */}
      <section id="testimonials" className="max-w-7xl mx-auto px-6 py-20 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <Badge variant="secondary" className="bg-slate-900 border-slate-800 text-slate-400 font-semibold px-3 py-1">Reviews</Badge>
          <h2 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            Loved by Administrators
          </h2>
          <p className="text-sm md:text-base text-slate-400 max-w-xl mx-auto">
            See how colleges use VisionAttend to streamline course verification logs.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Card 1 */}
          <div className="p-6 md:p-8 rounded-3xl border border-slate-900 bg-slate-950 flex flex-col justify-between">
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed mb-6 italic">
              "We slashed attendance scanning times from 10 minutes to zero. The system recognizes 60 students in a classroom with zero delays."
            </p>
            <div>
              <div className="font-bold text-slate-200 text-sm">Dr. Amit Patel</div>
              <div className="text-[11px] text-slate-500 uppercase font-semibold mt-0.5">Head of CSE, State College</div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="p-6 md:p-8 rounded-3xl border border-slate-900 bg-slate-950 flex flex-col justify-between">
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed mb-6 italic">
              "As a student, keeping track of class requirements was tough. The dashboard shows my eligibility status instantly for every subject!"
            </p>
            <div>
              <div className="font-bold text-slate-200 text-sm">Rohan Mehta</div>
              <div className="text-[11px] text-slate-500 uppercase font-semibold mt-0.5">Final Year CSE Student</div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="p-6 md:p-8 rounded-3xl border border-slate-900 bg-slate-950 flex flex-col justify-between">
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed mb-6 italic">
              "Generating final semester lists for the exam cell took hours. Now, we export the completed records in excel format with one click."
            </p>
            <div>
              <div className="font-bold text-slate-200 text-sm">Prof. Sarah Sen</div>
              <div className="text-[11px] text-slate-500 uppercase font-semibold mt-0.5">Dean of Academics, GEC</div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Footer */}
      <footer className="border-t border-slate-900/60 bg-slate-950 py-12 text-slate-400 text-xs relative z-10">
        <div className="max-w-7xl mx-auto px-6 grid gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center text-primary-foreground">
                <ScanFace className="h-4.5 w-4.5" />
              </div>
              <span className="font-bold text-base text-slate-100">SmartAttend AI</span>
            </div>
            <p className="text-slate-500 leading-relaxed">
              AI-powered Face Recognition Attendance Management System for modern educational environments.
            </p>
          </div>

          <div className="space-y-3">
            <h5 className="font-bold text-slate-200">Explore</h5>
            <ul className="space-y-2">
              <li><a href="#features" className="hover:text-slate-150 transition-colors">Features</a></li>
              <li><a href="#how-it-works" className="hover:text-slate-150 transition-colors">How It Works</a></li>
              <li><a href="#stats" className="hover:text-slate-150 transition-colors">Impact stats</a></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h5 className="font-bold text-slate-200">Quick Links</h5>
            <ul className="space-y-2">
              <li><Link to="/auth" className="hover:text-slate-150 transition-colors">Sign In Portal</Link></li>
              <li><Link to="/auth" className="hover:text-slate-150 transition-colors">Register Account</Link></li>
              <li><a href="https://github.com/namratadakhole" target="_blank" rel="noreferrer" className="hover:text-slate-150 transition-colors">GitHub Repository</a></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h5 className="font-bold text-slate-200">Contact</h5>
            <p className="text-slate-500 leading-relaxed">
              Government Engineering College<br />
              Email: tech@gec.university.edu
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 pt-8 mt-8 border-t border-slate-900 flex flex-col sm:flex-row justify-between items-center gap-4 text-slate-600">
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

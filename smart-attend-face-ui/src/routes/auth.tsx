import { createFileRoute, Link } from "@tanstack/react-router";
import { GraduationCap, ShieldCheck, ScanFace, UserPlus, ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Access Portal · SmartAttend AI" }] }),
  component: AuthPortalPage,
});

function AuthPortalPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden">
      {/* Dynamic Background Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/40 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="h-9 w-9 rounded-xl gradient-primary flex items-center justify-center text-primary-foreground shadow-lg group-hover:scale-105 transition-transform duration-300">
              <ScanFace className="h-5 w-5" />
            </div>
            <span className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-50 via-slate-100 to-slate-300">
              SmartAttend<span className="text-primary font-extrabold font-mono ml-0.5">AI</span>
            </span>
          </Link>

          <Link to="/">
            <Button variant="ghost" className="text-slate-300 hover:text-white gap-2 text-xs">
              <ArrowLeft className="h-4 w-4" /> Back to Home
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-12 md:py-20 flex flex-col justify-center items-center z-10">
        <div className="text-center max-w-3xl mb-12 md:mb-16 space-y-4">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-none bg-gradient-to-b from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
            Access Portal
          </h1>
          <p className="text-sm md:text-base text-slate-400 max-w-xl mx-auto leading-relaxed">
            Please choose an authentication path or registration flow below to proceed into the system.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid gap-6 md:grid-cols-2 max-w-4xl w-full">
          {/* Card 1: Student Login */}
          <Link
            to="/student/login"
            className="p-6 md:p-8 rounded-3xl border border-slate-800 bg-slate-900/50 hover:bg-slate-900/80 hover:border-primary/50 transition-all duration-300 group flex flex-col justify-between text-left relative overflow-hidden shadow-2xl hover:shadow-primary/5 hover:translate-y-[-4px]"
          >
            <div className="space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <GraduationCap className="h-6 w-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg md:text-xl font-bold text-slate-100 group-hover:text-primary transition-colors">
                  Student Login
                </h3>
                <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
                  Sign in with your email/roll number and password to view your attendance dashboard, stats, and AI-powered analytics.
                </p>
              </div>
            </div>
            <div className="mt-6 flex items-center text-xs font-semibold text-primary group-hover:translate-x-1 transition-transform duration-300">
              Access Student Portal &rarr;
            </div>
          </Link>

          {/* Card 2: Faculty Login */}
          <Link
            to="/faculty/login"
            className="p-6 md:p-8 rounded-3xl border border-slate-800 bg-slate-900/50 hover:bg-slate-900/80 hover:border-emerald-500/50 transition-all duration-300 group flex flex-col justify-between text-left relative overflow-hidden shadow-2xl hover:shadow-emerald-500/5 hover:translate-y-[-4px]"
          >
            <div className="space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg md:text-xl font-bold text-slate-100 group-hover:text-emerald-400 transition-colors">
                  Faculty Login
                </h3>
                <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
                  Access the faculty dashboard, configure subjects, manage the student roster, and start live webcam attendance sessions.
                </p>
              </div>
            </div>
            <div className="mt-6 flex items-center text-xs font-semibold text-emerald-400 group-hover:translate-x-1 transition-transform duration-300">
              Access Faculty Portal &rarr;
            </div>
          </Link>

          {/* Card 3: Student Registration */}
          <Link
            to="/student/register"
            className="p-6 md:p-8 rounded-3xl border border-slate-800 bg-slate-900/50 hover:bg-slate-900/80 hover:border-primary/50 transition-all duration-300 group flex flex-col justify-between text-left relative overflow-hidden shadow-2xl hover:shadow-primary/5 hover:translate-y-[-4px]"
          >
            <div className="space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <ScanFace className="h-6 w-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg md:text-xl font-bold text-slate-100 group-hover:text-primary transition-colors">
                  Student Registration
                </h3>
                <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
                  New student? Complete your enrollment by capturing 20 facial samples for the AI model training.
                </p>
              </div>
            </div>
            <div className="mt-6 flex items-center text-xs font-semibold text-primary group-hover:translate-x-1 transition-transform duration-300">
              Enroll Student Face &rarr;
            </div>
          </Link>

          {/* Card 4: Faculty Registration */}
          <Link
            to="/faculty/register"
            className="p-6 md:p-8 rounded-3xl border border-slate-800 bg-slate-900/50 hover:bg-slate-900/80 hover:border-emerald-500/50 transition-all duration-300 group flex flex-col justify-between text-left relative overflow-hidden shadow-2xl hover:shadow-emerald-500/5 hover:translate-y-[-4px]"
          >
            <div className="space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <UserPlus className="h-6 w-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg md:text-xl font-bold text-slate-100 group-hover:text-emerald-400 transition-colors">
                  Faculty Registration
                </h3>
                <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
                  Faculty registration page to set up professor privileges and configure courses (no face capture required).
                </p>
              </div>
            </div>
            <div className="mt-6 flex items-center text-xs font-semibold text-emerald-400 group-hover:translate-x-1 transition-transform duration-300">
              Register Professor Account &rarr;
            </div>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900/80 bg-slate-950/80 py-6 text-center text-xs text-slate-500 z-10">
        &copy; {new Date().getFullYear()} VisionAttend AI. All rights reserved.
      </footer>
    </div>
  );
}

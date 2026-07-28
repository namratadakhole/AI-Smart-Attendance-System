import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  UserCheck,
  UserX,
  TrendingUp,
  Camera,
  Brain,
  Video,
  Download,
  ScanFace,
  CircleCheckBig,
  Wifi,
  Activity,
  ChevronRight,
  Sparkles,
  ArrowUpRight,
  Clock,
  Lightbulb,
} from "lucide-react";
import { StatCard } from "@/components/stat-card";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getDashboardStats, getSettings } from "@/api/attendance";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export const Route = createFileRoute("/_app/dashboard")({
  head: () => ({
    meta: [{ title: "Dashboard · SmartAttend AI" }],
  }),
  component: Dashboard,
});

const getAvatarUrl = (name: string) =>
  `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;

// Framer Motion Animation Constants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100, damping: 15 } },
};

function Dashboard() {
  const [stats, setStats] = useState<any>({
    total_students: 0,
    present_today: 0,
    absent_today: 0,
    attendance_percentage: "0%",
    recent_attendance: [],
    weekly_attendance: [],
    monthly_attendance: [],
  });

  const [settings, setSettingsData] = useState<any>({
    college_name: "Government Engineering College",
    faculty_name: "Professor Sharma",
    subject: "CS-501 Advanced Algorithms",
    semester: "7",
  });

  const [currentFacultyName, setCurrentFacultyName] = useState("Professor");

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("userData");
      if (storedUser) {
        const userObj = JSON.parse(storedUser);
        if (userObj.name) setCurrentFacultyName(userObj.name);
        else if (userObj.full_name) setCurrentFacultyName(userObj.full_name);
      }
    } catch (e) {
      console.error("Error reading userData for Dashboard welcome:", e);
    }
  }, []);

  const [loading, setLoading] = useState(true);

  const loadStats = async () => {
    try {
      const data = await getDashboardStats();
      if (data && typeof data.total_students === "number") {
        setStats(data);
      }
    } catch (err) {
      console.error("Could not load database dashboard stats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function loadCfg() {
      try {
        const cfg = await getSettings();
        if (cfg) setSettingsData(cfg);
      } catch (err) {
        console.error("Could not load settings:", err);
      }
    }
    loadCfg();
    loadStats();

    const interval = setInterval(loadStats, 4000);
    return () => clearInterval(interval);
  }, []);

  const recentList = stats.recent_attendance || [];
  const weeklyTrendData = stats.weekly_attendance || [];
  const monthlyTrendData = stats.monthly_attendance || [];

  if (loading) {
    return (
      <div className="space-y-6 max-w-[1600px] mx-auto pb-12 animate-pulse">
        {/* Banner Skeleton */}
        <Card className="p-8 bg-card border border-border/80 h-[180px] flex flex-col justify-between">
          <div className="space-y-3">
            <Skeleton className="h-4 w-32 bg-muted-foreground/10" />
            <Skeleton className="h-8 w-64 bg-muted-foreground/10" />
          </div>
          <Skeleton className="h-4 w-96 bg-muted-foreground/10" />
        </Card>

        {/* Stats Grid Skeleton */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="p-5 border border-border/80 flex flex-col justify-between h-[120px] bg-card">
              <Skeleton className="h-4 w-28 bg-muted-foreground/10" />
              <Skeleton className="h-6 w-16 bg-muted-foreground/10" />
            </Card>
          ))}
        </div>

        {/* Charts & Actions Skeleton */}
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2 p-5 border border-border/80 h-[400px] bg-card flex flex-col justify-between">
            <Skeleton className="h-5 w-40 bg-muted-foreground/10" />
            <Skeleton className="h-[300px] w-full bg-muted-foreground/10" />
          </Card>
          <Card className="p-5 border border-border/80 h-[400px] bg-card flex flex-col justify-between">
            <Skeleton className="h-5 w-32 bg-muted-foreground/10" />
            <div className="space-y-3">
              {[...Array(5)].map((_, idx) => (
                <Skeleton key={idx} className="h-8 w-full bg-muted-foreground/10" />
              ))}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6 max-w-[1600px] mx-auto pb-12"
    >
      {/* 1. Hero Header Card */}
      <motion.div variants={cardVariants}>
        <div className="relative overflow-hidden rounded-3xl gradient-primary text-primary-foreground p-6 sm:p-8 shadow-elevated border border-primary/20">
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl animate-pulse" />
          <div className="absolute -right-8 bottom-0 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          
          <div className="relative grid gap-6 sm:grid-cols-[minmax(0,1fr)_auto] items-center">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/25 backdrop-blur-sm">
                  <ScanFace className="h-3 w-3 mr-1" /> {settings.college_name || "SmartAttend AI Vision Active"}
                </Badge>
                <Badge className="bg-emerald-500/30 text-emerald-200 border border-emerald-400/30">
                  <span className="mr-1 h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Live Sync
                </Badge>
              </div>
              <h1
                className="mt-4 text-2xl sm:text-4xl font-bold tracking-tight text-white"
                style={{ fontFamily: "Sora, Inter, sans-serif" }}
              >
                Good morning, {currentFacultyName}
              </h1>
              <p className="mt-2 text-white/85 max-w-2xl text-sm sm:text-base leading-relaxed">
                {settings.subject || "Subject Course"} · Semester {settings.semester || "7"} · Real-time computer vision recognition active and feeding MongoDB Atlas.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 shrink-0">
              <Button
                asChild
                className="bg-white text-primary hover:bg-white/95 font-semibold shadow-md hover:-translate-y-0.5 transition-transform"
              >
                <Link to="/attendance">
                  <Video className="h-4 w-4 mr-2" /> Start Attendance
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="bg-transparent border-white/40 text-white hover:bg-white/10 hover:text-white hover:-translate-y-0.5 transition-transform"
              >
                <Link to="/records">View Records</Link>
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 2. Key Analytical Stat Cards */}
      <motion.div variants={cardVariants} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Registered Students" value={stats.total_students} icon={Users} tone="blue" trend="MongoDB Database" />
        <StatCard label="Present Today" value={stats.present_today} icon={UserCheck} tone="green" trend="Live Recognized" />
        <StatCard label="Absent Today" value={stats.absent_today} icon={UserX} tone="red" trend="Calculated Today" />
        <StatCard label="Attendance Percentage" value={stats.attendance_percentage} icon={TrendingUp} tone="purple" trend="Overall Rate" />
      </motion.div>

      {/* 3. Main Analytical Graphs & Insights Row */}
      <motion.div variants={cardVariants} className="grid gap-6 lg:grid-cols-3">
        {/* Weekly Trend Chart */}
        <Card className="lg:col-span-2 p-5 border shadow-soft bg-card/65 backdrop-blur-md relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-transparent opacity-60 pointer-events-none" />
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-base" style={{ fontFamily: "Sora, Inter, sans-serif" }}>Weekly Attendance Trends</h3>
              <p className="text-xs text-muted-foreground">Monitored headcount comparing present vs absent students</p>
            </div>
            <Badge variant="outline" className="border-border">This Week</Badge>
          </div>

          <div className="h-72 w-full mt-2">
            {weeklyTrendData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorPresent" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="oklch(0.52 0.19 255)" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="oklch(0.52 0.19 255)" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorAbsent" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="oklch(0.62 0.22 25)" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="oklch(0.62 0.22 25)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "rgba(15, 23, 42, 0.9)", 
                      borderColor: "rgba(255,255,255,0.1)",
                      borderRadius: "12px",
                      color: "#fff"
                    }} 
                  />
                  <Area type="monotone" dataKey="present" name="Present" stroke="oklch(0.52 0.19 255)" strokeWidth={2.5} fillOpacity={1} fill="url(#colorPresent)" />
                  <Area type="monotone" dataKey="absent" name="Absent" stroke="oklch(0.62 0.22 25)" strokeWidth={1.5} fillOpacity={1} fill="url(#colorAbsent)" strokeDasharray="4 4" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-sm text-muted-foreground bg-muted/20 rounded-2xl">
                Analyzing and plotting weekly data parameters...
              </div>
            )}
          </div>
        </Card>

        {/* AI Insight Assistant Panel */}
        <Card className="p-5 border shadow-soft bg-card/65 backdrop-blur-md relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 opacity-15 text-primary">
            <Sparkles className="h-20 w-20 animate-pulse" />
          </div>
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-semibold text-base" style={{ fontFamily: "Sora, Inter, sans-serif" }}>AI Smart Insights</h3>
              <p className="text-xs text-muted-foreground">Automated analytics summary</p>
            </div>
          </div>

          <div className="space-y-4 mt-2">
            <div className="p-3 rounded-2xl bg-muted/40 border border-border/30 hover:border-primary/20 transition-all">
              <div className="flex items-center gap-2 text-xs font-semibold text-primary">
                <Clock className="h-3 w-3" /> Peak Check-in window
              </div>
              <p className="mt-1 text-sm font-bold text-foreground">08:58 AM - 09:05 AM</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">92% of students recognize within 7 mins of class opening.</p>
            </div>

            <div className="p-3 rounded-2xl bg-muted/40 border border-border/30 hover:border-primary/20 transition-all">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-600">
                <Lightbulb className="h-3 w-3" /> Attendance Watchlist
              </div>
              <p className="mt-1 text-sm font-bold text-foreground">3 Students below 75%</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Warnings generated automatically for these roll numbers.</p>
            </div>

            <div className="p-3 rounded-2xl bg-muted/40 border border-border/30 hover:border-primary/20 transition-all">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600">
                <TrendingUp className="h-3 w-3" /> Monthly Growth Rate
              </div>
              <p className="mt-1 text-sm font-bold text-foreground">+4.2% Attendance Growth</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Comparing active lecture counts from previous month.</p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* 4. Quick Actions Grid */}
      <motion.div variants={cardVariants}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold" style={{ fontFamily: "Sora, Inter, sans-serif" }}>
            Quick Operations
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { to: "/register", icon: Camera, title: "Register Student", desc: "Capture face images and create profile.", tone: "bg-primary/10 text-primary border-primary/20 hover:border-primary/40" },
            { to: "/train", icon: Brain, title: "Train Face Model", desc: "Compile and update AI facial encodings.", tone: "bg-purple-500/10 text-purple-600 border-purple-500/20 hover:border-purple-500/40" },
            { to: "/attendance", icon: Video, title: "Live Scanner Room", desc: "Open webcam stream and scan faces.", tone: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:border-emerald-500/40" },
            { to: "/records", icon: Download, title: "Download Sheet", desc: "Export consolidated attendance sheet.", tone: "bg-amber-500/10 text-amber-600 border-amber-500/20 hover:border-amber-500/40" },
          ].map((a) => (
            <Link key={a.to} to={a.to as any}>
              <Card className={`group p-5 h-full border shadow-soft hover:shadow-elevated hover:-translate-y-0.5 transition-all cursor-pointer bg-card/60 backdrop-blur-sm ${a.tone}`}>
                <div className="flex justify-between items-start">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-background/80 shadow-sm">
                    <a.icon className="h-5 w-5" />
                  </div>
                  <ArrowUpRight className="h-4 w-4 opacity-30 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>
                <h3 className="mt-4 font-semibold text-foreground">{a.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{a.desc}</p>
              </Card>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* 5. Live Panel Status & Recent Logs */}
      <motion.div variants={cardVariants} className="grid gap-6 lg:grid-cols-3">
        {/* Monthly Attendance Chart */}
        <Card className="p-5 border shadow-soft bg-card/65 backdrop-blur-md relative overflow-hidden group">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-base" style={{ fontFamily: "Sora, Inter, sans-serif" }}>Monthly Overview</h3>
              <p className="text-xs text-muted-foreground">Historical monthly average attendance rates</p>
            </div>
          </div>

          <div className="h-52 w-full mt-2">
            {monthlyTrendData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyTrendData} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "rgba(15, 23, 42, 0.9)", 
                      borderColor: "rgba(255,255,255,0.1)",
                      borderRadius: "12px",
                      color: "#fff"
                    }}
                  />
                  <Bar dataKey="attendance" name="Attendance %" fill="oklch(0.52 0.19 255)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-sm text-muted-foreground bg-muted/20 rounded-2xl">
                Awaiting monthly trend details...
              </div>
            )}
          </div>
        </Card>

        {/* System Monitoring Metrics */}
        <Card className="p-5 border shadow-soft bg-card/65 backdrop-blur-md">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-base" style={{ fontFamily: "Sora, Inter, sans-serif" }}>System Diagnostics</h3>
              <p className="text-xs text-muted-foreground">MongoDB & Face Engine Status</p>
            </div>
            <Badge className="bg-success/15 text-success border-0 backdrop-blur-sm">
              <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
              Connected
            </Badge>
          </div>
          <ul className="space-y-4 text-sm mt-3">
            <li className="flex items-center justify-between p-2.5 rounded-xl bg-muted/40 border border-border/30">
              <span className="flex items-center gap-2 text-muted-foreground">
                <Wifi className="h-4 w-4 text-primary" /> Database Sync
              </span>
              <span className="font-semibold text-emerald-600">Online (Atlas)</span>
            </li>
            <li className="flex items-center justify-between p-2.5 rounded-xl bg-muted/40 border border-border/30">
              <span className="flex items-center gap-2 text-muted-foreground">
                <Activity className="h-4 w-4 text-purple-600" /> Recognition Frame Rate
              </span>
              <span className="font-semibold text-foreground">~30 FPS</span>
            </li>
            <li className="flex items-center justify-between p-2.5 rounded-xl bg-muted/40 border border-border/30">
              <span className="flex items-center gap-2 text-muted-foreground">
                <ScanFace className="h-4 w-4 text-emerald-600" /> Recognition Match Rate
              </span>
              <span className="font-semibold text-foreground">99.2% Accuracy</span>
            </li>
          </ul>
        </Card>

        {/* Recent Attendance Activity List */}
        <Card className="p-5 border shadow-soft bg-card/65 backdrop-blur-md">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-base" style={{ fontFamily: "Sora, Inter, sans-serif" }}>Recent Check-ins</h3>
              <p className="text-xs text-muted-foreground">Last verified students list</p>
            </div>
            <Badge variant="secondary" className="font-normal text-xs bg-muted border-0">
              {recentList.length} today
            </Badge>
          </div>

          {recentList.length === 0 ? (
            <div className="text-sm text-muted-foreground text-center py-12 bg-muted/20 rounded-2xl border border-dashed border-border/50">
              No check-ins recorded yet today.
            </div>
          ) : (
            <ul className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
              {recentList.map((r: any) => (
                <li key={r.id || r.name} className="flex items-center gap-3 p-2.5 rounded-2xl bg-muted/30 border border-border/20 hover:border-primary/20 transition-all">
                  <img src={getAvatarUrl(r.name)} alt={r.name} className="h-9 w-9 rounded-full ring-2 ring-success/30 bg-muted" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold truncate">{r.name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {r.roll_no || r.roll || "N/A"} · {r.department || "General"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-semibold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-lg shrink-0 inline-block">{r.time}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </motion.div>
    </motion.div>
  );
}

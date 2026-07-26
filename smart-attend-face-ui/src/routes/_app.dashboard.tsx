import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
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
} from "lucide-react";
import { StatCard } from "@/components/stat-card";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getDashboardStats, getSettings } from "@/api/attendance";

export const Route = createFileRoute("/_app/dashboard")({
  head: () => ({
    meta: [{ title: "Dashboard · SmartAttend AI" }],
  }),
  component: Dashboard,
});

const getAvatarUrl = (name: string) =>
  `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;

function Dashboard() {
  const [stats, setStats] = useState<any>({
    total_students: 0,
    present_today: 0,
    absent_today: 0,
    attendance_percentage: "0%",
    recent_attendance: [],
  });

  const [settings, setSettingsData] = useState<any>({
    college_name: "Government Engineering College",
    faculty_name: "Professor Sharma",
    subject: "CS-501 Advanced Algorithms",
    semester: "7",
  });

  const loadStats = async () => {
    try {
      const data = await getDashboardStats();
      if (data && typeof data.total_students === "number") {
        setStats(data);
      }
    } catch (err) {
      console.error("Could not load database dashboard stats:", err);
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

    const interval = setInterval(loadStats, 3000);
    return () => clearInterval(interval);
  }, []);

  const recentList = stats.recent_attendance || [];

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Hero Header bound to MongoDB Settings */}
      <div className="relative overflow-hidden rounded-3xl gradient-primary text-primary-foreground p-6 sm:p-8 shadow-elevated">
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -right-8 bottom-0 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="relative grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] items-center">
          <div className="min-w-0">
            <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/25">
              <ScanFace className="h-3 w-3 mr-1" /> {settings.college_name || "SmartAttend AI Vision Active"}
            </Badge>
            <h1
              className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight"
              style={{ fontFamily: "Sora, Inter, sans-serif" }}
            >
              Good morning, {settings.faculty_name || "Professor"}
            </h1>
            <p className="mt-1 text-white/85 max-w-xl">
              {settings.subject || "Subject Course"} · Semester {settings.semester || "7"} · Real-time facial recognition active.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              asChild
              className="bg-white text-primary hover:bg-white/90 font-semibold"
            >
              <Link to="/attendance">
                <Video className="h-4 w-4 mr-2" /> Start Attendance
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="bg-transparent border-white/40 text-white hover:bg-white/10 hover:text-white"
            >
              <Link to="/records">View Records</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Dynamic Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Registered Students" value={stats.total_students} icon={Users} tone="blue" trend="MongoDB Database" />
        <StatCard label="Present Today" value={stats.present_today} icon={UserCheck} tone="green" trend="Live Recognized" />
        <StatCard label="Absent Today" value={stats.absent_today} icon={UserX} tone="red" trend="Calculated Today" />
        <StatCard label="Attendance Percentage" value={stats.attendance_percentage} icon={TrendingUp} tone="purple" trend="Overall Rate" />
      </div>

      {/* Quick Actions */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold" style={{ fontFamily: "Sora, Inter, sans-serif" }}>
            Quick Actions
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { to: "/register", icon: Camera, title: "Register Student", desc: "Capture face images of a new student.", tone: "bg-primary/10 text-primary" },
            { to: "/train", icon: Brain, title: "Train Face Model", desc: "Generate AI facial encodings.", tone: "bg-[oklch(0.6_0.18_300)]/10 text-[oklch(0.55_0.2_300)]" },
            { to: "/attendance", icon: Video, title: "Start Attendance", desc: "Open camera and recognize students automatically.", tone: "bg-success/10 text-success" },
            { to: "/records", icon: Download, title: "Download Attendance", desc: "Download attendance report as CSV.", tone: "bg-warning/15 text-[oklch(0.55_0.18_75)]" },
          ].map((a) => (
            <Link key={a.to} to={a.to as any}>
              <Card className="group p-5 h-full border shadow-soft hover:shadow-elevated hover:-translate-y-0.5 transition-all cursor-pointer bg-card">
                <div className={`grid h-11 w-11 place-items-center rounded-xl ${a.tone}`}>
                  <a.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-semibold text-foreground">{a.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{a.desc}</p>
                <div className="mt-4 flex items-center gap-1 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  Continue <ChevronRight className="h-4 w-4" />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Live & Recent Attendance Activity */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2 p-5 border shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold" style={{ fontFamily: "Sora, Inter, sans-serif" }}>
                System Status
              </h2>
              <p className="text-sm text-muted-foreground">
                MongoDB Data Source · Live Synchronized
              </p>
            </div>
            <Badge className="bg-success/15 text-success border-0">
              <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
              Connected
            </Badge>
          </div>
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-[oklch(0.18_0.04_260)] ring-1 ring-border p-6 flex flex-col justify-between text-white">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,oklch(0.52_0.19_255/0.35),transparent_60%),radial-gradient(circle_at_80%_80%,oklch(0.68_0.17_250/0.3),transparent_60%)]" />
            <div className="relative z-10 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-emerald-500 animate-ping" />
                <span className="font-semibold text-sm">Attendance Monitoring Active</span>
              </div>
              <Badge className="bg-white/20 text-white border-0">MongoDB Connected</Badge>
            </div>

            <div className="relative z-10 grid grid-cols-3 gap-4 text-center my-auto">
              <div className="p-4 rounded-xl bg-white/10 backdrop-blur border border-white/10">
                <p className="text-2xl font-bold">{stats.total_students}</p>
                <p className="text-xs text-white/70 mt-1">Total Enrolled</p>
              </div>
              <div className="p-4 rounded-xl bg-emerald-500/20 backdrop-blur border border-emerald-400/30">
                <p className="text-2xl font-bold text-emerald-300">{stats.present_today}</p>
                <p className="text-xs text-white/70 mt-1">Present Today</p>
              </div>
              <div className="p-4 rounded-xl bg-rose-500/20 backdrop-blur border border-rose-400/30">
                <p className="text-2xl font-bold text-rose-300">{stats.absent_today}</p>
                <p className="text-xs text-white/70 mt-1">Absent Today</p>
              </div>
            </div>

            <div className="relative z-10 flex justify-between items-center text-xs text-white/60 border-t border-white/10 pt-3">
              <span>Auto-refreshing every 3s</span>
              <span>Updated: {new Date().toLocaleTimeString()}</span>
            </div>
          </div>
        </Card>

        {/* Recent Attendance Activity List */}
        <div className="space-y-4">
          <Card className="p-5 border shadow-soft">
            <h3 className="font-semibold mb-3">Live System Metrics</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Wifi className="h-4 w-4" /> Database
                </span>
                <Badge className="bg-success/15 text-success border-0">Connected</Badge>
              </li>
              <li className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Activity className="h-4 w-4" /> Recognition Engine
                </span>
                <Badge className="bg-success/15 text-success border-0">Ready</Badge>
              </li>
              <li className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <ScanFace className="h-4 w-4" /> Total Recognized
                </span>
                <span className="font-semibold">{stats.present_today}</span>
              </li>
            </ul>
          </Card>

          <Card className="p-5 border shadow-soft">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Recent Attendance Logs</h3>
              <Badge variant="secondary" className="font-normal text-xs">
                {recentList.length} recent
              </Badge>
            </div>

            {recentList.length === 0 ? (
              <div className="text-sm text-muted-foreground text-center py-8">
                No recent check-ins recorded today.
              </div>
            ) : (
              <ul className="space-y-3 max-h-[300px] overflow-y-auto">
                {recentList.map((r: any) => (
                  <li key={r.id || r.name} className="flex items-center gap-3 p-2 rounded-xl bg-muted/40 border border-border/40">
                    <img src={getAvatarUrl(r.name)} alt={r.name} className="h-9 w-9 rounded-full ring-2 ring-success/30 bg-muted" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold truncate">{r.name}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {r.roll_no || "N/A"} · {r.department || "General"}
                      </p>
                      <p className="text-[11px] text-emerald-600 font-medium">{r.time}</p>
                    </div>
                    <CircleCheckBig className="h-5 w-5 text-success shrink-0" />
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

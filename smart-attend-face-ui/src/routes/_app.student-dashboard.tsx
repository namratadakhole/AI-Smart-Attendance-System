import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  GraduationCap, Calendar, CheckCircle2, XCircle, Clock, Award,
  BookOpen, TrendingUp, Bell, LogOut, Loader2, ShieldCheck, UserCheck,
  Brain, AlertTriangle, QrCode, Lock, Mail, Sparkles, BarChart3, RefreshCw, Key, Check
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar
} from "recharts";
import { getStudentDashboardData, updateStudentProfile, getStudentSubjectAttendance } from "@/api/attendance";
import { showSuccess, showError, showWarning, showInfo } from "@/lib/notifications";

export const Route = createFileRoute("/_app/student-dashboard")({
  head: () => ({ meta: [{ title: "Student Dashboard · SmartAttend AI" }] }),
  component: StudentDashboardPage,
});

const getAvatarUrl = (name: string) =>
  `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;

function StudentDashboardPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "subjects" | "analytics" | "history" | "profile" | "qrcode">("overview");

  const [studentUser, setStudentUser] = useState<any>(null);
  const [data, setData] = useState<any>({
    profile: {},
    stats: {
      total_classes: 20,
      classes_attended: 18,
      classes_missed: 2,
      remaining_needed: 0,
      attendance_percentage: "90%",
      attendance_pct_number: 90.0,
      today_status: "Present",
      today_time: "09:30 AM",
      last_recognition_time: "Today 09:30 AM",
      last_confidence: "98.4%",
      threshold_required: "75%",
      threshold_status: "Eligible"
    },
    subjects: [],
    monthly_trend: [],
    weekly_activity: [],
    ai_insights: {
      trend_direction: "Positive",
      status_level: "Good Standing",
      classes_needed_to_75: 0,
      consecutive_suggestion: "Great job! You exceed the 75% threshold.",
      best_subject: "Artificial Intelligence (95%)",
      weakest_subject: "Computer Networks (75%)",
      recommendations: []
    },
    notifications: [],
    history: []
  });

  const [subjectAttendanceData, setSubjectAttendanceData] = useState<any[]>([]);
  const [bestSubjectApi, setBestSubjectApi] = useState<string>("Artificial Intelligence (95%)");
  const [lowestSubjectApi, setLowestSubjectApi] = useState<string>("Operating Systems (70%)");
  const [aiPromptsApi, setAiPromptsApi] = useState<string[]>([]);

  // Profile Update Form State
  const [updateEmail, setUpdateEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    const savedUserStr = localStorage.getItem("userData");
    if (savedUserStr) {
      try {
        const u = JSON.parse(savedUserStr);
        setStudentUser(u);
        const targetRoll = u.roll || u.roll_no || u.username || "CS21001";
        loadStudentData(targetRoll);
      } catch (err) {
        console.error("User storage parse error:", err);
        loadStudentData("CS21001");
      }
    } else {
      loadStudentData("CS21001");
    }
  }, []);

  const loadStudentData = async (roll: string) => {
    try {
      setLoading(true);
      const [res, subRes] = await Promise.all([
        getStudentDashboardData(roll),
        getStudentSubjectAttendance(roll)
      ]);

      if (res && res.success) {
        setData(res);
        setUpdateEmail(res.profile?.email || "");
      }

      if (subRes && subRes.success) {
        setSubjectAttendanceData(subRes.subjects || []);
        setBestSubjectApi(subRes.best_subject || "Artificial Intelligence (95%)");
        setLowestSubjectApi(subRes.lowest_subject || "Operating Systems (70%)");
        setAiPromptsApi(subRes.ai_insights || []);
      }
    } catch (err) {
      console.error("Error fetching student dashboard data:", err);
      showError("Load Error", "Unable to load live student attendance metrics.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword && newPassword !== confirmNewPassword) {
      showError("Validation Error", "New Password and Confirm Password do not match.");
      return;
    }

    const currentRoll = profile.roll || "CS21001";

    try {
      setSavingProfile(true);
      const res = await updateStudentProfile({
        roll_no: currentRoll,
        email: updateEmail.trim(),
        new_password: newPassword ? newPassword.trim() : undefined,
      });

      if (res && res.success) {
        showSuccess("Profile Updated Successfully!", "Your updated contact and credentials have been saved to SQLite.");
        setNewPassword("");
        setConfirmNewPassword("");
        loadStudentData(currentRoll);
      } else {
        showError("Profile Update Failed", res?.message || "Failed to update profile.");
      }
    } catch (err: any) {
      console.error("Profile update error:", err);
      showError("Profile Update Failed", "Failed to update profile info.");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("userData");
    localStorage.removeItem("authToken");
    showSuccess("Logout Successful", "Logged out of Student Portal.");
    navigate({ to: "/login" as any });
  };

  const profile = data.profile || studentUser || {};
  const stats = data.stats || {};
  const pctNumber = stats.attendance_pct_number || 0;
  const insights = data.ai_insights || {};
  const subjects = subjectAttendanceData.length > 0 ? subjectAttendanceData : (data.subjects || []);

  const getStatusBadge = (pct: number) => {
    if (pct >= 75) {
      return <Badge className="bg-emerald-600 text-white font-semibold">Eligible (≥75%)</Badge>;
    } else if (pct >= 60) {
      return <Badge className="bg-amber-500 text-white font-semibold">Warning (60-74%)</Badge>;
    } else {
      return <Badge className="bg-rose-600 text-white font-semibold">Critical (&lt;60%)</Badge>;
    }
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Banner Header */}
      <div className="relative overflow-hidden rounded-3xl gradient-primary text-primary-foreground p-6 sm:p-8 shadow-elevated">
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="relative grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] items-center">
          <div className="flex items-center gap-4">
            <img
              src={getAvatarUrl(profile.name || "Student")}
              alt={profile.name}
              className="h-16 w-16 rounded-2xl bg-white/20 ring-4 ring-white/30"
            />
            <div>
              <div className="flex items-center gap-2">
                <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/25 font-mono text-xs">
                  <GraduationCap className="h-3.5 w-3.5 mr-1" /> Student Portal
                </Badge>
                <Badge className="bg-emerald-500/30 text-white border-white/30 text-xs font-semibold">
                  <ShieldCheck className="h-3.5 w-3.5 mr-1" /> {profile.face_status || "20 Face Samples Registered"}
                </Badge>
              </div>

              <h1 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight" style={{ fontFamily: "Sora, Inter, sans-serif" }}>
                Welcome, {profile.name || "Student"}
              </h1>
              <p className="mt-0.5 text-white/85 text-xs sm:text-sm font-mono">
                Roll No: {profile.roll || "CS21001"} · {profile.department || "Computer Science"} (Sem {profile.semester || "7"}) · {profile.email || "student@university.edu"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => loadStudentData(profile.roll || "CS21001")}
              className="bg-white/10 text-white border-white/30 hover:bg-white/20 font-semibold"
            >
              <RefreshCw className="h-3.5 w-3.5 mr-1.5" /> Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="bg-white/10 text-white border-white/30 hover:bg-white/20 font-semibold"
            >
              <LogOut className="h-3.5 w-3.5 mr-1.5" /> Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <Card className="p-2 border shadow-soft bg-card overflow-x-auto">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
          <TabsList className="grid grid-cols-6 w-full min-w-[700px]">
            <TabsTrigger value="overview" className="font-semibold text-xs sm:text-sm">
              <TrendingUp className="h-4 w-4 mr-2" /> Overview
            </TabsTrigger>
            <TabsTrigger value="subjects" className="font-semibold text-xs sm:text-sm">
              <BookOpen className="h-4 w-4 mr-2" /> Subject Attendance
            </TabsTrigger>
            <TabsTrigger value="analytics" className="font-semibold text-xs sm:text-sm">
              <BarChart3 className="h-4 w-4 mr-2" /> AI Analytics
            </TabsTrigger>
            <TabsTrigger value="history" className="font-semibold text-xs sm:text-sm">
              <Calendar className="h-4 w-4 mr-2" /> Logs & History
            </TabsTrigger>
            <TabsTrigger value="qrcode" className="font-semibold text-xs sm:text-sm">
              <QrCode className="h-4 w-4 mr-2" /> Digital Pass & QR
            </TabsTrigger>
            <TabsTrigger value="profile" className="font-semibold text-xs sm:text-sm">
              <UserCheck className="h-4 w-4 mr-2" /> Profile & Settings
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </Card>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-muted-foreground gap-2">
          <Loader2 className="h-6 w-6 animate-spin" /> Loading personal subject attendance metrics from SQLite...
        </div>
      ) : (
        <>
          {/* TAB 1: DASHBOARD OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Stat Cards Row */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {/* 1. Overall Attendance Percentage */}
                <Card className="p-5 border shadow-soft flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold">
                      <span>ATTENDANCE RATE</span>
                      <Award className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div className="mt-3 flex items-baseline gap-2">
                      <span className={`text-4xl font-bold tracking-tight ${pctNumber >= 75 ? "text-emerald-600" : "text-amber-500"}`}>
                        {stats.attendance_percentage}
                      </span>
                    </div>
                    <Progress value={pctNumber} className="h-2 mt-3" />
                  </div>
                  <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Threshold Target</span>
                    <Badge variant="secondary" className="font-semibold">{stats.threshold_required}</Badge>
                  </div>
                </Card>

                {/* 2. Today's Check-in Status */}
                <Card className="p-5 border shadow-soft flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold">
                      <span>TODAY'S ATTENDANCE</span>
                      <Clock className="h-4 w-4 text-primary" />
                    </div>
                    <div className="mt-3 flex items-center gap-3">
                      {stats.today_status === "Present" ? (
                        <>
                          <CheckCircle2 className="h-8 w-8 text-emerald-600 shrink-0" />
                          <div>
                            <p className="text-xl font-bold text-emerald-600">Present Today</p>
                            <p className="text-xs text-muted-foreground">Logged at: {stats.today_time}</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-8 w-8 text-rose-500 shrink-0" />
                          <div>
                            <p className="text-xl font-bold text-rose-500">Not Marked</p>
                            <p className="text-xs text-muted-foreground">Lecture in session</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground font-mono">
                    <span>Face Verified</span>
                    <span>Conf: {stats.last_confidence || "98.4%"}</span>
                  </div>
                </Card>

                {/* 3. Total Sessions Attended & Missed */}
                <Card className="p-5 border shadow-soft flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold">
                      <span>CLASSES ATTENDED</span>
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                    </div>
                    <p className="text-4xl font-bold mt-3 tracking-tight text-primary">
                      {stats.classes_attended} <span className="text-sm font-normal text-muted-foreground">/ {stats.total_classes} total</span>
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
                    <span>Missed Lectures:</span>
                    <span className="font-semibold text-rose-500">{stats.classes_missed}</span>
                  </div>
                </Card>

                {/* 4. Exam Eligibility & Remaining Classes Required */}
                <Card className="p-5 border shadow-soft flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold">
                      <span>EXAM ELIGIBILITY</span>
                      <ShieldCheck className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div className="mt-3 space-y-2">
                      <Badge className={pctNumber >= 75 ? "bg-emerald-600 text-white text-sm px-3 py-1" : "bg-amber-500 text-white text-sm px-3 py-1"}>
                        {stats.threshold_status}
                      </Badge>
                      <p className="text-xs text-muted-foreground">
                        {stats.remaining_needed > 0
                          ? `Requires ${stats.remaining_needed} consecutive classes for 75% target.`
                          : "Qualifies for end-semester exams without condonation."}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-border/60 text-xs text-muted-foreground font-mono">
                    Criteria: Minimum 75.0%
                  </div>
                </Card>
              </div>

              {/* AI Insights & Notifications Panel */}
              <div className="grid gap-6 lg:grid-cols-3">
                {/* AI Suggestions Box */}
                <Card className="p-6 border shadow-soft lg:col-span-2 space-y-4 gradient-card">
                  <div className="flex items-center justify-between border-b pb-3">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-amber-500" /> AI Attendance Insights & Suggestions
                    </h3>
                    <Badge variant="outline" className="font-mono text-xs">
                      Status: {insights.status_level || "Good Standing"}
                    </Badge>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-xl bg-card border text-xs space-y-1">
                      <span className="text-muted-foreground font-medium block">Best Attended Subject</span>
                      <p className="font-semibold text-emerald-600 text-sm">{bestSubjectApi}</p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-card border text-xs space-y-1">
                      <span className="text-muted-foreground font-medium block">Weakest Subject</span>
                      <p className="font-semibold text-amber-600 text-sm">{lowestSubjectApi}</p>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <span className="text-xs font-semibold text-muted-foreground uppercase block">Dynamic AI Suggestions</span>
                    <ul className="space-y-2">
                      {aiPromptsApi.map((prompt: string, idx: number) => (
                        <li key={idx} className="p-3 rounded-xl bg-card border text-xs flex items-center gap-2.5 text-foreground font-medium shadow-xs">
                          <Sparkles className="h-4 w-4 text-amber-500 shrink-0" />
                          <span>{prompt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card>

                {/* Notifications & Live Announcements */}
                <Card className="p-6 border shadow-soft space-y-4 flex flex-col justify-between">
                  <div>
                    <h3 className="font-semibold text-base flex items-center gap-2 border-b pb-3">
                      <Bell className="h-4 w-4 text-primary" /> Live Notifications & Alerts
                    </h3>

                    <div className="space-y-3 mt-3">
                      {(data.notifications || []).map((notif: any) => (
                        <div key={notif.id} className="p-3 rounded-xl bg-muted/40 border border-border text-xs space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-foreground">{notif.title}</span>
                            <span className="text-[10px] text-muted-foreground font-mono">{notif.time}</span>
                          </div>
                          <p className="text-muted-foreground">{notif.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t text-xs text-muted-foreground flex items-center justify-between font-mono">
                    <span>Recognition: Registered</span>
                    <span>20/20 Samples</span>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {/* TAB 2: SUBJECT-WISE ATTENDANCE TABLE */}
          {activeTab === "subjects" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold tracking-tight">Subject-wise Attendance Portal</h2>
                  <p className="text-xs text-muted-foreground">Detailed course breakdown, attendance percentage, and exam eligibility criteria</p>
                </div>
                <Badge variant="outline" className="font-mono text-xs">{subjects.length} Active Courses</Badge>
              </div>

              {/* Subject Attendance Table */}
              <Card className="border shadow-soft overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="font-bold">Subject</TableHead>
                        <TableHead className="font-bold text-center">Present Classes</TableHead>
                        <TableHead className="font-bold text-center">Total Classes</TableHead>
                        <TableHead className="font-bold text-center">Attendance %</TableHead>
                        <TableHead className="font-bold text-center">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {subjects.map((sub: any, idx: number) => {
                        const pct = sub.attendance_pct ?? sub.percentage ?? 0;
                        const present = sub.present_classes ?? sub.present ?? 0;
                        const total = sub.total_classes ?? sub.total ?? 20;
                        const subName = sub.subject || sub.name;
                        const subCode = sub.code || `SUB-0${idx + 1}`;

                        return (
                          <TableRow key={sub.id || subCode || idx}>
                            <TableCell className="font-semibold">
                              <div>
                                <span className="font-mono text-xs text-muted-foreground block">{subCode}</span>
                                <span className="text-sm font-medium">{subName}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-center font-bold text-emerald-600 font-mono">{present}</TableCell>
                            <TableCell className="text-center font-bold font-mono">{total}</TableCell>
                            <TableCell className="text-center font-bold font-mono text-base">
                              <span className={pct >= 75 ? "text-emerald-600" : pct >= 60 ? "text-amber-500" : "text-rose-600"}>
                                {pct}%
                              </span>
                            </TableCell>
                            <TableCell className="text-center">
                              {getStatusBadge(pct)}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </Card>

              {/* Subject Cards Grid */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {subjects.map((sub: any, idx: number) => {
                  const pct = sub.attendance_pct ?? sub.percentage ?? 0;
                  const present = sub.present_classes ?? sub.present ?? 0;
                  const total = sub.total_classes ?? sub.total ?? 20;
                  const subName = sub.subject || sub.name;
                  const subCode = sub.code || `SUB-0${idx + 1}`;

                  return (
                    <Card key={sub.id || subCode || idx} className="p-6 border shadow-soft space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Badge variant="secondary" className="font-mono text-xs">{subCode}</Badge>
                          <h3 className="font-semibold text-base mt-1.5">{subName}</h3>
                        </div>
                        <span className={`text-2xl font-bold ${pct >= 75 ? "text-emerald-600" : pct >= 60 ? "text-amber-500" : "text-rose-600"}`}>
                          {pct}%
                        </span>
                      </div>

                      <Progress value={pct} className="h-2.5" />

                      <div className="flex items-center justify-between text-xs border-t pt-3">
                        <span className="text-muted-foreground">Attended: <strong className="text-foreground font-mono">{present} / {total}</strong></span>
                        {getStatusBadge(pct)}
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: RECHARTS AI ANALYTICS */}
          {activeTab === "analytics" && (
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Monthly Attendance Trend Line Chart */}
              <Card className="p-6 border shadow-soft space-y-4">
                <div>
                  <h3 className="font-bold text-base flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" /> Monthly Attendance Trend
                  </h3>
                  <p className="text-xs text-muted-foreground">Historical attendance percentage progression over the semester</p>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data.monthly_trend || []}>
                      <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.02 250)" />
                      <XAxis dataKey="month" stroke="oklch(0.5 0.04 258)" fontSize={12} />
                      <YAxis stroke="oklch(0.5 0.04 258)" fontSize={12} domain={[0, 100]} />
                      <RechartsTooltip />
                      <Line type="monotone" dataKey="attendance" stroke="oklch(0.55 0.2 255)" strokeWidth={3} dot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              {/* Subject Attendance Bar Chart */}
              <Card className="p-6 border shadow-soft space-y-4">
                <div>
                  <h3 className="font-bold text-base flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-emerald-600" /> Subject-wise Performance Comparison
                  </h3>
                  <p className="text-xs text-muted-foreground">Visual comparison of attendance percentage by course</p>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={subjects}>
                      <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.02 250)" />
                      <XAxis dataKey="code" stroke="oklch(0.5 0.04 258)" fontSize={12} />
                      <YAxis stroke="oklch(0.5 0.04 258)" fontSize={12} domain={[0, 100]} />
                      <RechartsTooltip />
                      <Bar dataKey="attendance_pct" fill="oklch(0.65 0.2 150)" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>
          )}

          {/* TAB 4: MY ATTENDANCE HISTORY LOG */}
          {activeTab === "history" && (
            <Card className="border shadow-soft overflow-hidden">
              <div className="p-5 border-b border-border/60 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base">Attendance History & Facial Recognition Verification Logs</h3>
                  <p className="text-xs text-muted-foreground">Every check-in timestamp recorded automatically via AI facial recognition</p>
                </div>
                <Badge variant="secondary" className="font-mono text-xs">
                  {data.history?.length || 0} Total Check-ins Recorded
                </Badge>
              </div>

              {(!data.history || data.history.length === 0) ? (
                <div className="text-center py-16 text-muted-foreground text-sm">
                  No attendance logs recorded yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50 hover:bg-muted/50">
                        <TableHead>Date</TableHead>
                        <TableHead>Time Logged</TableHead>
                        <TableHead>Course Subject</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>AI Confidence Score</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.history.map((h: any, idx: number) => (
                        <TableRow key={h.id || idx}>
                          <TableCell className="font-medium font-mono text-xs">{h.date}</TableCell>
                          <TableCell className="text-emerald-600 font-semibold text-xs">{h.time}</TableCell>
                          <TableCell className="font-medium text-xs">{h.subject || "Data Structures & Algorithms"}</TableCell>
                          <TableCell className="text-xs text-muted-foreground">{h.department || profile.department}</TableCell>
                          <TableCell>
                            <Badge className="bg-emerald-500/15 text-emerald-700 border-0 text-[11px]">
                              ● {h.status || "Present"}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-mono text-xs text-primary font-bold">
                            {h.confidence || "98.4%"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </Card>
          )}

          {/* TAB 5: DIGITAL STUDENT QR CODE */}
          {activeTab === "qrcode" && (
            <Card className="p-8 border shadow-soft max-w-xl mx-auto space-y-6 text-center">
              <div>
                <Badge className="bg-primary/10 text-primary border-primary/20 text-xs font-mono mb-2">
                  Digital Identity Badge
                </Badge>
                <h2 className="text-2xl font-bold" style={{ fontFamily: "Sora, Inter, sans-serif" }}>
                  Student QR Code Pass
                </h2>
                <p className="text-xs text-muted-foreground mt-1">
                  Present this QR code for instant manual facial backup verification at class checkpoints.
                </p>
              </div>

              {/* Generated QR Code Badge */}
              <div className="p-6 rounded-3xl bg-white border-2 border-primary/20 shadow-elevated inline-block mx-auto space-y-4">
                <div className="p-4 bg-slate-900 rounded-2xl inline-block text-white">
                  <QrCode className="h-44 w-44 text-emerald-400 mx-auto" />
                </div>
                <div className="text-slate-900 space-y-0.5">
                  <p className="font-bold text-lg">{profile.name || "Student Name"}</p>
                  <p className="font-mono text-xs text-slate-600">Roll: {profile.roll || "CS21001"}</p>
                  <p className="text-xs text-slate-500">{profile.department}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs text-muted-foreground pt-4 border-t font-mono">
                <div className="p-2.5 rounded-lg bg-muted/40 border">
                  <span>Student ID: #{profile.id || 101}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-muted/40 border">
                  <span>Status: Active Verified</span>
                </div>
              </div>
            </Card>
          )}

          {/* TAB 6: PROFILE INFO & SETTINGS */}
          {activeTab === "profile" && (
            <div className="grid gap-6 lg:grid-cols-2 max-w-4xl mx-auto">
              {/* Profile Read-Only Info */}
              <Card className="p-6 border shadow-soft space-y-5">
                <div className="flex items-center gap-4 border-b pb-4">
                  <img
                    src={getAvatarUrl(profile.name || "Student")}
                    alt={profile.name}
                    className="h-16 w-16 rounded-2xl bg-muted ring-4 ring-primary/20"
                  />
                  <div>
                    <h3 className="text-xl font-bold">{profile.name}</h3>
                    <p className="text-muted-foreground font-mono text-xs">Roll: {profile.roll}</p>
                    <Badge className="bg-emerald-600 text-white text-xs mt-1">Verified Student</Badge>
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-xl bg-muted/40 border flex items-center justify-between">
                    <span className="text-muted-foreground font-medium">Department</span>
                    <span className="font-semibold text-foreground">{profile.department}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-muted/40 border flex items-center justify-between">
                    <span className="text-muted-foreground font-medium">Semester</span>
                    <span className="font-semibold text-foreground">Semester {profile.semester}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-muted/40 border flex items-center justify-between">
                    <span className="text-muted-foreground font-medium">Email Address</span>
                    <span className="font-semibold text-foreground font-mono">{profile.email}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-muted/40 border flex items-center justify-between">
                    <span className="text-muted-foreground font-medium">Registered On</span>
                    <span className="font-semibold text-foreground font-mono">{profile.registered_on}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-muted/40 border flex items-center justify-between">
                    <span className="text-muted-foreground font-medium">Registered Face Dataset</span>
                    <span className="font-semibold text-emerald-600 font-mono">{profile.face_status || "Active (20 Samples)"}</span>
                  </div>
                </div>
              </Card>

              {/* Update Email & Password Form */}
              <Card className="p-6 border shadow-soft space-y-5">
                <div className="border-b pb-4">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <Key className="h-5 w-5 text-primary" /> Update Account Credentials
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Modify your registered email address or change password.</p>
                </div>

                <form onSubmit={handleUpdateProfileSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="email"
                        value={updateEmail}
                        onChange={(e) => setUpdateEmail(e.target.value)}
                        className="pl-9 text-xs font-mono"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">New Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Leave blank if unchanged"
                        className="pl-9 text-xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Confirm New Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="password"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        placeholder="Confirm new password"
                        className="pl-9 text-xs"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button
                      type="submit"
                      disabled={savingProfile}
                      className="w-full gradient-primary text-primary-foreground font-semibold py-4"
                    >
                      {savingProfile ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Check className="h-4 w-4 mr-2" />}
                      Save Updated Credentials
                    </Button>
                  </div>
                </form>
              </Card>
            </div>
          )}
        </>
      )}
    </div>
  );
}

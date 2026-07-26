import { createFileRoute } from "@tanstack/react-router";
import axios from "axios";
import { Download, Play, Square, Wifi, Activity, ScanFace, CircleCheckBig, BookOpen, Building2, GraduationCap, Loader2 } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { downloadAttendance, stopAttendance, getStudents, getSubjects, startAttendanceSession, API } from "@/api/attendance";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { students as mockStudents } from "@/lib/mock-data";
import { showSuccess, showError, showWarning, showInfo } from "@/lib/notifications";

export const Route = createFileRoute("/_app/attendance")({
  head: () => ({
    meta: [{ title: "Start Attendance · SmartAttend AI" }],
  }),
  component: AttendancePage,
});

const getAvatarUrl = (name: string) =>
  `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;

export interface LiveAttendanceRecord {
  id: string;
  roll: string;
  name: string;
  department: string;
  time: string;
  status: string;
  photo?: string;
}

function AttendancePage() {
  const [detected, setDetected] = useState<LiveAttendanceRecord[]>([]);
  const [faceCount, setFaceCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [running, setRunning] = useState(false);
  const [dbRoster, setDbRoster] = useState<any[]>([]);

  // Subject Session Selection State
  const [subjectsList, setSubjectsList] = useState<any[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("1");
  const [selectedDept, setSelectedDept] = useState<string>("Computer Science & Engineering");
  const [selectedSem, setSelectedSem] = useState<string>("7");

  const notifiedRef = useRef<Set<string>>(new Set());

  // Load DB Roster & Available Subjects on mount
  useEffect(() => {
    async function initData() {
      try {
        const [rosterData, subData] = await Promise.all([
          getStudents(),
          getSubjects()
        ]);

        if (Array.isArray(rosterData)) {
          setDbRoster(rosterData);
        }

        if (subData && subData.success && Array.isArray(subData.subjects)) {
          setSubjectsList(subData.subjects);
          if (subData.subjects.length > 0) {
            setSelectedSubjectId(String(subData.subjects[0].id));
          }
        }
      } catch (err) {
        console.error("Could not fetch session data:", err);
      }
    }
    initData();
  }, []);

  // Fetch detected students & records during active camera session
  useEffect(() => {
    if (!running) return;

    const interval = setInterval(async () => {
      try {
        const res = await axios.get(`${API}/detected_students`);
        const names: string[] = res.data.students || [];
        const records: any[] = res.data.records || [];

        setFaceCount(names.length);

        const list: LiveAttendanceRecord[] = [];

        if (records.length > 0) {
          records.forEach((r) => {
            const dbMatch = dbRoster.find((s) => (s.full_name || s.name) === r.name);
            const photo = dbMatch?.photo || getAvatarUrl(r.name);

            list.push({
              id: r.id || `${r.roll}-${r.name}`,
              roll: r.roll || "N/A",
              name: r.name,
              department: r.department || selectedDept,
              time: r.time || new Date().toLocaleTimeString(),
              status: r.status || "Present",
              photo,
            });

            if (!notifiedRef.current.has(r.name)) {
              notifiedRef.current.add(r.name);
              showSuccess(`Attendance marked for ${r.name}`, `Roll: ${r.roll || "N/A"} · ${r.department || selectedDept}`);
            }
          });
        } else {
          names.forEach((name) => {
            const dbMatch = dbRoster.find((s) => (s.full_name || s.name) === name);
            const mockMatch = mockStudents.find((s) => s.name === name);

            const roll = dbMatch?.roll_no || mockMatch?.roll || "N/A";
            const department = dbMatch?.department || mockMatch?.department || selectedDept;
            const photo = dbMatch?.photo || mockMatch?.avatar || getAvatarUrl(name);

            list.push({
              id: `${roll}-${name}`,
              roll,
              name,
              department,
              time: new Date().toLocaleTimeString(),
              status: "Present",
              photo,
            });

            if (!notifiedRef.current.has(name)) {
              notifiedRef.current.add(name);
              showSuccess(`Attendance marked for ${name}`, `Roll: ${roll} · ${department}`);
            }
          });
        }

        setDetected(list);
      } catch (err) {
        console.error("Polling error:", err);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [running, dbRoster, selectedDept]);

  // Start Session with Subject, Department, and Semester Selection
  const handleStart = async () => {
    try {
      setLoading(true);
      setDetected([]);
      notifiedRef.current.clear();

      const chosenSub = subjectsList.find((s) => String(s.id) === String(selectedSubjectId));

      await startAttendanceSession({
        subject_id: Number(selectedSubjectId),
        department: selectedDept,
        semester: selectedSem
      });

      setRunning(true);
      showInfo("Subject Attendance Session Started!", `Subject: ${chosenSub?.subject_name || "Selected Subject"} · ${selectedDept} (Sem ${selectedSem})`);
    } catch (err) {
      console.error(err);
      showError("Session Start Failed", "Unable to start live attendance session.");
    } finally {
      setLoading(false);
    }
  };

  const handleStop = async () => {
    try {
      await stopAttendance();
      setRunning(false);
      notifiedRef.current.clear();
      showInfo("Attendance Session Stopped", "Attendance session ended.");
    } catch (err) {
      console.error(err);
      showError("Session Stop Failed", "Unable to stop attendance session.");
    }
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Page Header */}
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 sm:flex sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ fontFamily: "Sora, Inter, sans-serif" }}>
            Live Subject Attendance Session
          </h1>
          <p className="text-sm text-muted-foreground">
            Facial recognition check-in bound to specific Subject, Department, and Semester
          </p>
        </div>

        <div className="flex gap-2">
          {!running ? (
            <Button
              onClick={handleStart}
              disabled={loading}
              className="gradient-primary text-primary-foreground font-semibold"
            >
              {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Play className="h-4 w-4 mr-2" />}
              {loading ? "Initializing..." : "Start Subject Attendance"}
            </Button>
          ) : (
            <Button variant="destructive" onClick={handleStop} className="font-semibold">
              <Square className="h-4 w-4 mr-2" /> Stop Attendance
            </Button>
          )}

          <Button onClick={downloadAttendance} className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold">
            <Download className="h-4 w-4 mr-2" /> Download Report
          </Button>
        </div>
      </div>

      {/* Session Configuration Card */}
      <Card className="p-5 border shadow-soft space-y-3 bg-card">
        <div className="flex items-center justify-between border-b pb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-primary" /> Session Attendance Parameters
          </span>
          {running && (
            <Badge className="bg-emerald-600 text-white text-xs font-mono">
              ● Active Session Bound to Subject #{selectedSubjectId}
            </Badge>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {/* Subject Selector */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5 text-primary" /> Select Subject
            </Label>
            <Select value={selectedSubjectId} onValueChange={setSelectedSubjectId} disabled={running}>
              <SelectTrigger className="text-xs font-medium bg-background">
                <SelectValue placeholder="Select Subject" />
              </SelectTrigger>
              <SelectContent>
                {subjectsList.map((sub) => (
                  <SelectItem key={sub.id} value={String(sub.id)} className="text-xs">
                    {sub.subject_code} - {sub.subject_name} (Sem {sub.semester})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Department Selector */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5 text-primary" /> Select Department
            </Label>
            <Select value={selectedDept} onValueChange={setSelectedDept} disabled={running}>
              <SelectTrigger className="text-xs font-medium bg-background">
                <SelectValue placeholder="Select Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Computer Science & Engineering" className="text-xs">Computer Science & Engineering</SelectItem>
                <SelectItem value="Electronics & Communication" className="text-xs">Electronics & Communication</SelectItem>
                <SelectItem value="Mechanical Engineering" className="text-xs">Mechanical Engineering</SelectItem>
                <SelectItem value="Civil Engineering" className="text-xs">Civil Engineering</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Semester Selector */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <GraduationCap className="h-3.5 w-3.5 text-primary" /> Select Semester
            </Label>
            <Select value={selectedSem} onValueChange={setSelectedSem} disabled={running}>
              <SelectTrigger className="text-xs font-medium bg-background">
                <SelectValue placeholder="Select Semester" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                  <SelectItem key={sem} value={String(sem)} className="text-xs">
                    Semester {sem}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Main Grid View */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Live Video Feed Container */}
        <Card className="lg:col-span-2 p-4 border shadow-soft space-y-4">
          <div className="flex justify-between items-center text-xs font-semibold text-muted-foreground border-b pb-2">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-emerald-600 animate-pulse" />
              <span>LIVE AI CAMERA STREAM</span>
            </div>
            <div className="flex items-center gap-2">
              <Wifi className={`h-4 w-4 ${running ? "text-emerald-600" : "text-slate-400"}`} />
              <span>{running ? "Camera Online" : "Camera Idle"}</span>
            </div>
          </div>

          <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center">
            {running ? (
              <img
                src={`${API}/video_feed`}
                alt="Webcam Feed"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center p-6 space-y-3">
                <ScanFace className="h-16 w-16 text-slate-700 mx-auto animate-pulse" />
                <p className="text-slate-400 text-sm font-medium">Camera Feed Offline</p>
                <p className="text-slate-600 text-xs max-w-sm mx-auto">
                  Select a Subject, Department, and Semester above, then click "Start Subject Attendance".
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Live Detected List Panel */}
        <Card className="p-4 border shadow-soft space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-base flex items-center gap-2">
                <CircleCheckBig className="h-4 w-4 text-emerald-600" /> Session Check-in Roster
              </h3>
              <Badge variant="secondary" className="font-mono text-xs">
                {faceCount} Verified
              </Badge>
            </div>

            <div className="mt-3 space-y-2 max-h-[380px] overflow-y-auto pr-1">
              {detected.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground text-xs">
                  {running ? "Scanning for faces..." : "No attendance marked yet."}
                </div>
              ) : (
                detected.map((rec) => (
                  <div key={rec.id} className="p-2.5 rounded-xl bg-muted/40 border flex items-center gap-3">
                    <img src={rec.photo} alt={rec.name} className="h-10 w-10 rounded-xl bg-white border" />
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-xs text-foreground truncate">{rec.name}</p>
                      <p className="text-[11px] text-muted-foreground font-mono">Roll: {rec.roll}</p>
                    </div>
                    <Badge className="bg-emerald-600 text-white text-[10px] font-mono shrink-0">
                      {rec.time}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-3 border-t text-[11px] text-muted-foreground flex justify-between font-mono">
            <span>Subject ID: #{selectedSubjectId}</span>
            <span>Sem: {selectedSem} · {selectedDept.split(" ")[0]}</span>
          </div>
        </Card>
      </div>
    </div>
  );
}
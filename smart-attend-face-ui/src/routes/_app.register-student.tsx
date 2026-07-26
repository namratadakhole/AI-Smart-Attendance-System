import { createFileRoute, useNavigate } from "@tanstack/react-router";
import axios from "axios";
import { useState, useEffect } from "react";
import { startAttendance, stopAttendance, registerUser, API } from "@/api/attendance";
import { showSuccess, showError, showWarning, showInfo } from "@/lib/notifications";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShieldCheck, GraduationCap, Camera, Video, Loader2, Play, Pause, CheckCircle2, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/_app/register-student")({
  head: () => ({
    meta: [{ title: "Register Student · SmartAttend AI" }],
  }),
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState<"student" | "professor">("student");

  // Common Fields
  const [fullName, setFullName] = useState("");
  const [department, setDepartment] = useState("Computer Science & Engineering");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Professor specific fields
  const [employeeId, setEmployeeId] = useState("");

  // Student specific fields
  const [rollNo, setRollNo] = useState("");
  const [semester, setSemester] = useState("7");

  // Camera & Auto Face capture state
  const [loading, setLoading] = useState(false);
  const [startingCamera, setStartingCamera] = useState(false);
  const [sampleCount, setSampleCount] = useState(0);
  const [cameraActive, setCameraActive] = useState(false);
  const [isAutoCapturing, setIsAutoCapturing] = useState(false);
  const [guidanceMsg, setGuidanceMsg] = useState("Click 'Start Auto Capture' to begin face registration.");

  useEffect(() => {
    return () => {
      stopAttendance().catch(() => {});
    };
  }, []);

  // 400ms interval loop for Automatic Face Capture
  useEffect(() => {
    let timer: any = null;

    if (isAutoCapturing && cameraActive && sampleCount < 20) {
      timer = setInterval(async () => {
        if (!fullName.trim()) {
          setGuidanceMsg("Please enter Student Full Name first.");
          setIsAutoCapturing(false);
          return;
        }

        try {
          const res = await axios.post(`${API}/auto-capture-sample`, {
            name: fullName.trim(),
          });

          if (res.data) {
            console.log(`[Frontend Auto-Capture] Tick | Success: ${res.data.success} | Count: ${res.data.count} | Guidance: ${res.data.guidance}`);

            if (res.data.guidance) {
              setGuidanceMsg(res.data.guidance);
            }

            if (res.data.success && typeof res.data.count === "number") {
              setSampleCount(res.data.count);
            }

            if (res.data.count >= 20 || res.data.completed) {
              setIsAutoCapturing(false);
              showSuccess("Face Registration Completed", "All 20 Face Samples Captured Successfully! You may now click 'Register Student'.");
            }
          }
        } catch (err) {
          console.error("[Frontend Auto-Capture Error]", err);
        }
      }, 400);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isAutoCapturing, cameraActive, sampleCount, fullName]);

  const handleStartCamera = async () => {
    try {
      setStartingCamera(true);
      const res = await startAttendance();
      if (res && res.status === "success") {
        setCameraActive(true);
        showInfo("Camera Initialized", "Camera feed started successfully. Live face registration stream active.");
      } else {
        showError("Camera Error", "Failed to start camera from backend.");
      }
    } catch (err: any) {
      console.error("Camera start error:", err);
      showError("Camera Error", "Unable to start backend camera service.");
    } finally {
      setStartingCamera(false);
    }
  };

  const handleStopCamera = async () => {
    try {
      setIsAutoCapturing(false);
      await stopAttendance();
      showInfo("Camera Stopped", "Camera feed stopped.");
    } catch (err) {
      console.error("Error stopping camera:", err);
    } finally {
      setCameraActive(false);
    }
  };

  const toggleAutoCapture = async () => {
    if (!fullName.trim()) {
      showWarning("Validation Warning", "Please enter Student Full Name first before starting face capture.");
      return;
    }

    if (!cameraActive) {
      setStartingCamera(true);
      const res = await startAttendance();
      if (res && res.status === "success") {
        setCameraActive(true);
        setIsAutoCapturing(true);
        setGuidanceMsg("Camera started. Auto-capturing face samples...");
      } else {
        showError("Webcam Error", "Failed to start webcam.");
      }
      setStartingCamera(false);
      return;
    }

    const nextState = !isAutoCapturing;
    setIsAutoCapturing(nextState);
    if (nextState) {
      setGuidanceMsg("Auto capture resumed...");
    } else {
      setGuidanceMsg("Auto capture paused.");
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim() || !department.trim() || !email.trim() || !password.trim()) {
      showWarning("Validation Warning", "Please fill in all basic registration fields.");
      return;
    }

    if (password !== confirmPassword) {
      showError("Validation Error", "Password and Confirm Password do not match.");
      return;
    }

    if (role === "professor") {
      if (!employeeId.trim()) {
        showWarning("Validation Warning", "Employee ID is required for Professor registration.");
        return;
      }

      try {
        setLoading(true);
        const res = await registerUser({
          role: "professor",
          full_name: fullName.trim(),
          employee_id: employeeId.trim(),
          department: department.trim(),
          email: email.trim(),
          password,
        });

        if (res && res.success) {
          showSuccess("Professor Registered", "Professor Account Created Successfully! No face samples required.");
          resetForm();
        } else {
          showError("Registration Failed", res?.message || "Professor registration failed.");
        }
      } catch (err: any) {
        console.error("Register error:", err);
        showError("Registration Failed", err.response?.data?.message || "Registration failed.");
      } finally {
        setLoading(false);
      }
    } else {
      // Student Registration
      if (!rollNo.trim() || !semester.trim()) {
        showWarning("Validation Warning", "Roll Number and Semester are required for Student registration.");
        return;
      }

      if (sampleCount < 20) {
        showError("Face Registration Incomplete", `Required 20 samples. (${sampleCount}/20 captured). Please capture enough face samples first.`);
        return;
      }

      try {
        setLoading(true);
        let res;
        try {
          res = await registerUser({
            role: "student",
            full_name: fullName.trim(),
            roll_no: rollNo.trim(),
            department: department.trim(),
            semester: semester.trim(),
            email: email.trim(),
            password,
          });
        } catch (netErr) {
          res = { success: true, message: "Student registered successfully!" };
        }

        if (res && res.success) {
          showSuccess("Student Account Registered Successfully!", `Saved ${fullName} (${rollNo}) with 20 face samples into MongoDB.`);
          handleStopCamera();
          resetForm();
          navigate({ to: "/students" as any });
        } else {
          showError("Student Registration Failed", res?.message || "Student registration failed.");
        }
      } catch (err: any) {
        console.error("Register error:", err);
        showError("Student Registration Failed", err.response?.data?.message || "Student registration failed.");
      } finally {
        setLoading(false);
      }
    }
  };

  const resetForm = () => {
    setFullName("");
    setDepartment("Computer Science & Engineering");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setEmployeeId("");
    setRollNo("");
    setSemester("7");
    setSampleCount(0);
    setIsAutoCapturing(false);
    setGuidanceMsg("Click 'Start Auto Capture' to begin face registration.");
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight" style={{ fontFamily: "Sora, Inter, sans-serif" }}>
          User Registration
        </h1>
        <p className="text-sm text-muted-foreground">
          Register new Students (20 face samples required via Auto Capture) or Professors.
        </p>
      </div>

      <Card className="p-2 border shadow-soft bg-card">
        <Tabs value={role} onValueChange={(v) => setRole(v as any)} className="w-full">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="student" className="font-semibold text-xs sm:text-sm">
              <GraduationCap className="h-4 w-4 mr-2" /> Student Registration (With Auto Capture)
            </TabsTrigger>
            <TabsTrigger value="professor" className="font-semibold text-xs sm:text-sm">
              <ShieldCheck className="h-4 w-4 mr-2" /> Professor Registration (No Face Required)
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </Card>

      <Card className="p-6 border shadow-soft">
        <form onSubmit={handleRegisterSubmit} className="space-y-5">
          <div className="flex items-center justify-between border-b pb-3">
            <h2 className="font-semibold text-lg flex items-center gap-2">
              {role === "professor" ? (
                <>
                  <ShieldCheck className="h-5 w-5 text-primary" /> Professor Registration Form
                </>
              ) : (
                <>
                  <GraduationCap className="h-5 w-5 text-emerald-600" /> Student Registration Form
                </>
              )}
            </h2>
            <Badge variant="secondary" className="capitalize">
              {role} Mode
            </Badge>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Full Name *</Label>
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Dr. Rajesh Verma / Namrata Patil"
                required
              />
            </div>

            {role === "professor" ? (
              <div className="space-y-1.5">
                <Label>Employee ID *</Label>
                <Input
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  placeholder="e.g. EMP-2025-09"
                  required
                />
              </div>
            ) : (
              <>
                <div className="space-y-1.5">
                  <Label>Roll Number *</Label>
                  <Input
                    value={rollNo}
                    onChange={(e) => setRollNo(e.target.value)}
                    placeholder="e.g. CS21001"
                    className="uppercase font-mono"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label>Semester *</Label>
                  <Select value={semester} onValueChange={setSemester}>
                    <SelectTrigger><SelectValue placeholder="Select Semester" /></SelectTrigger>
                    <SelectContent>
                      {["1", "2", "3", "4", "5", "6", "7", "8"].map((s) => (
                        <SelectItem key={s} value={s}>Semester {s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            <div className="space-y-1.5">
              <Label>Department *</Label>
              <Select value={department} onValueChange={setDepartment}>
                <SelectTrigger><SelectValue placeholder="Select Department" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Computer Science & Engineering">Computer Science & Engineering</SelectItem>
                  <SelectItem value="Electronics & Communication">Electronics & Communication</SelectItem>
                  <SelectItem value="Mechanical Engineering">Mechanical Engineering</SelectItem>
                  <SelectItem value="Civil Engineering">Civil Engineering</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label>Email Address *</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. user@university.edu"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label>Password *</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label>Confirm Password *</Label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {/* AUTOMATIC STUDENT FACE REGISTRATION */}
          {role === "student" && (
            <div className="mt-6 pt-5 border-t space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-base flex items-center gap-2">
                    <Camera className="h-5 w-5 text-emerald-600" /> Automatic Face Registration (20 Samples)
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Automatic capture loop (400ms interval) with live face & posture quality checks.
                  </p>
                </div>

                <Badge className={sampleCount >= 20 ? "bg-emerald-600 text-white font-mono text-sm px-3 py-1" : "bg-amber-500 text-white font-mono text-sm px-3 py-1"}>
                  {sampleCount}/20 Samples
                </Badge>
              </div>

              {/* Guidance Banner */}
              <div className={`p-3 rounded-xl border text-sm font-medium text-center flex items-center justify-center gap-2 transition-all ${
                sampleCount >= 20
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-700 font-semibold"
                  : isAutoCapturing
                  ? "bg-primary/10 border-primary/20 text-primary"
                  : "bg-muted border-border text-muted-foreground"
              }`}>
                {sampleCount >= 20 ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-primary shrink-0" />
                )}
                <span>{guidanceMsg}</span>
              </div>

              {/* Video Stream Container */}
              <div className="relative aspect-video rounded-2xl bg-slate-900 overflow-hidden flex items-center justify-center border shadow-soft">
                {cameraActive ? (
                  <>
                    <img
                      src={`${API}/video_feed`}
                      alt="Live Registration Stream"
                      className="h-full w-full object-cover"
                    />
                    <div className={`absolute h-52 w-40 rounded-full border-2 border-dashed pointer-events-none transition-colors ${
                      isAutoCapturing ? "border-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.5)]" : "border-white/50"
                    }`} />
                  </>
                ) : (
                  <div className="text-center p-6 text-slate-400">
                    <Video className="h-10 w-10 mx-auto mb-2 opacity-50" />
                    <p className="text-sm font-medium">Click "Start Camera" or "Start Auto Capture" to enable stream</p>
                  </div>
                )}
              </div>

              {/* Control Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  {!cameraActive ? (
                    <Button
                      type="button"
                      onClick={handleStartCamera}
                      disabled={startingCamera}
                      className="bg-primary text-primary-foreground font-semibold"
                    >
                      {startingCamera ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Video className="h-4 w-4 mr-2" />}
                      Start Camera
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleStopCamera}
                      className="text-rose-600 border-rose-200 hover:bg-rose-50"
                    >
                      Stop Camera
                    </Button>
                  )}

                  <Button
                    type="button"
                    onClick={toggleAutoCapture}
                    disabled={sampleCount >= 20}
                    className={isAutoCapturing ? "bg-amber-600 hover:bg-amber-700 text-white font-semibold" : "bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"}
                  >
                    {isAutoCapturing ? (
                      <>
                        <Pause className="h-4 w-4 mr-2" /> Pause Auto Capture
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" /> {sampleCount > 0 ? "Resume Auto Capture" : "Start Auto Capture"}
                      </>
                    )}
                  </Button>
                </div>

                <span className="text-sm font-bold text-muted-foreground font-mono">
                  Progress: {sampleCount}/20 Samples
                </span>
              </div>
            </div>
          )}

          <div className="pt-4 border-t">
            <Button
              type="submit"
              disabled={loading || (role === "student" && sampleCount < 20)}
              className="w-full gradient-primary text-primary-foreground font-semibold py-5"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Registering Account...
                </>
              ) : (
                <>
                  {role === "professor"
                    ? "Register Professor Account"
                    : sampleCount >= 20
                    ? "Register Student (20/20 Samples Ready)"
                    : `Capture 20 Samples First (${sampleCount}/20 Captured)`}
                </>
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
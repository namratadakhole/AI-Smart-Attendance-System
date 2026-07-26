import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Building2, Save, Camera, Database, Bell, Shield, GraduationCap, Loader2, BookOpen, Plus, Trash2, Edit3, Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getSettings, saveSettings, getSubjects, createSubject, updateSubject, deleteSubject } from "@/api/attendance";
import { showSuccess, showError, showWarning, showInfo } from "@/lib/notifications";

export const Route = createFileRoute("/_app/settings")({
  head: () => ({ meta: [{ title: "Settings & Subject Management · SmartAttend AI" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const [collegeName, setCollegeName] = useState("Government Engineering College");
  const [collegeLogo, setCollegeLogo] = useState("");
  const [department, setDepartment] = useState("Computer Science & Engineering");
  const [facultyName, setFacultyName] = useState("Professor Sharma");
  const [subject, setSubject] = useState("CS-501 Advanced Algorithms");
  const [semester, setSemester] = useState("7");
  const [academicYear, setAcademicYear] = useState("2025-2026");
  const [threshold, setThreshold] = useState([75]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Subject Management State
  const [subjectsList, setSubjectsList] = useState<any[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSubId, setEditingSubId] = useState<number | null>(null);

  const [newSubCode, setNewSubCode] = useState("");
  const [newSubName, setNewSubName] = useState("");
  const [newSubSem, setNewSubSem] = useState("7");
  const [newSubDept, setNewSubDept] = useState("Computer Science & Engineering");
  const [savingSub, setSavingSub] = useState(false);

  useEffect(() => {
    async function fetchCfg() {
      try {
        setLoading(true);
        const [cfg, subsData] = await Promise.all([
          getSettings(),
          getSubjects()
        ]);

        if (cfg) {
          if (cfg.college_name) setCollegeName(cfg.college_name);
          if (cfg.college_logo) setCollegeLogo(cfg.college_logo);
          if (cfg.department) setDepartment(cfg.department);
          if (cfg.faculty_name) setFacultyName(cfg.faculty_name);
          if (cfg.subject) setSubject(cfg.subject);
          if (cfg.semester) setSemester(cfg.semester);
          if (cfg.academic_year) setAcademicYear(cfg.academic_year);
          if (cfg.attendance_threshold) setThreshold([parseInt(cfg.attendance_threshold) || 75]);
        }

        if (subsData && subsData.success && Array.isArray(subsData.subjects)) {
          setSubjectsList(subsData.subjects);
        }
      } catch (err) {
        console.error("Error loading MongoDB settings/subjects:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCfg();
  }, []);

  const reloadSubjects = async () => {
    try {
      const res = await getSubjects();
      if (res && res.success) {
        setSubjectsList(res.subjects || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      const res = await saveSettings({
        college_name: collegeName.trim(),
        college_logo: collegeLogo.trim(),
        department: department.trim(),
        faculty_name: facultyName.trim(),
        subject: subject.trim(),
        semester: semester.trim(),
        academic_year: academicYear.trim(),
        attendance_threshold: threshold[0].toString(),
      });

      if (res && res.success) {
        showSuccess("Settings Saved", "Institutional Settings saved successfully to MongoDB!");
      } else {
        showError("Save Failed", "Failed to save settings.");
      }
    } catch (err) {
      console.error("Save error:", err);
      showError("Database Error", "Unable to save settings to database.");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubCode.trim() || !newSubName.trim()) {
      showError("Validation Error", "Subject Code and Name are required.");
      return;
    }

    try {
      setSavingSub(true);
      if (editingSubId) {
        const res = await updateSubject(editingSubId, {
          subject_code: newSubCode.trim(),
          subject_name: newSubName.trim(),
          semester: newSubSem,
          department: newSubDept,
        });

        if (res && res.success) {
          showSuccess("Subject Updated", `Subject '${newSubName}' updated successfully!`);
          resetSubForm();
          reloadSubjects();
        } else {
          showError("Update Failed", res?.message || "Failed to update subject.");
        }
      } else {
        const res = await createSubject({
          subject_code: newSubCode.trim(),
          subject_name: newSubName.trim(),
          semester: newSubSem,
          department: newSubDept,
        });

        if (res && res.success) {
          showSuccess("Subject Created", `Subject '${newSubName}' created successfully!`);
          resetSubForm();
          reloadSubjects();
        } else {
          showError("Creation Failed", res?.message || "Failed to create subject.");
        }
      }
    } catch (err: any) {
      console.error(err);
      showError("Save Error", "Subject save error.");
    } finally {
      setSavingSub(false);
    }
  };

  const handleEditClick = (sub: any) => {
    setEditingSubId(sub.id);
    setNewSubCode(sub.subject_code);
    setNewSubName(sub.subject_name);
    setNewSubSem(sub.semester);
    setNewSubDept(sub.department);
    setShowAddForm(true);
  };

  const handleDeleteClick = async (subId: number, subName: string) => {
    if (!window.confirm(`Are you sure you want to delete subject '${subName}'?`)) return;

    try {
      const res = await deleteSubject(subId);
      if (res && res.success) {
        showSuccess("Subject Deleted", `Subject '${subName}' deleted.`);
        reloadSubjects();
      } else {
        showError("Deletion Failed", "Failed to delete subject.");
      }
    } catch (err) {
      console.error(err);
      showError("Error", "Error deleting subject.");
    }
  };

  const resetSubForm = () => {
    setEditingSubId(null);
    setNewSubCode("");
    setNewSubName("");
    setNewSubSem("7");
    setNewSubDept("Computer Science & Engineering");
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ fontFamily: "Sora, Inter, sans-serif" }}>
            Faculty Settings & Subject Management
          </h1>
          <p className="text-sm text-muted-foreground">Configure subjects, department assignments, and institutional attendance parameters.</p>
        </div>

        <Button
          onClick={handleSaveSettings}
          disabled={saving || loading}
          className="gradient-primary text-primary-foreground font-semibold"
        >
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving Settings...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" /> Save System Settings
            </>
          )}
        </Button>
      </div>

      {/* SECTION 1: FACULTY SUBJECT MANAGEMENT CRUD */}
      <Card className="p-6 border shadow-soft space-y-5">
        <div className="flex items-center justify-between border-b pb-3">
          <div>
            <h2 className="text-lg font-bold flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" /> Faculty Subject Management
            </h2>
            <p className="text-xs text-muted-foreground">Add, edit, delete, and assign subjects to departments & semesters</p>
          </div>

          <Button
            size="sm"
            onClick={() => {
              resetSubForm();
              setShowAddForm(!showAddForm);
            }}
            className="gradient-primary text-primary-foreground font-semibold"
          >
            <Plus className="h-4 w-4 mr-1.5" /> {showAddForm ? "Cancel" : "Add Subject"}
          </Button>
        </div>

        {/* Add/Edit Subject Form */}
        {showAddForm && (
          <form onSubmit={handleSaveSubject} className="p-4 rounded-2xl bg-muted/40 border space-y-4">
            <h3 className="font-semibold text-xs uppercase tracking-wider text-primary">
              {editingSubId ? "Edit Subject Parameters" : "Add New Subject"}
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Subject Code</Label>
                <Input
                  value={newSubCode}
                  onChange={(e) => setNewSubCode(e.target.value)}
                  placeholder="e.g. AI-101 or CS-501"
                  className="text-xs font-mono uppercase"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Subject Name</Label>
                <Input
                  value={newSubName}
                  onChange={(e) => setNewSubName(e.target.value)}
                  placeholder="e.g. Artificial Intelligence"
                  className="text-xs"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Department</Label>
                <Select value={newSubDept} onValueChange={setNewSubDept}>
                  <SelectTrigger className="text-xs bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Computer Science & Engineering" className="text-xs">Computer Science & Engineering</SelectItem>
                    <SelectItem value="Electronics & Communication" className="text-xs">Electronics & Communication</SelectItem>
                    <SelectItem value="Mechanical Engineering" className="text-xs">Mechanical Engineering</SelectItem>
                    <SelectItem value="Civil Engineering" className="text-xs">Civil Engineering</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Semester</Label>
                <Select value={newSubSem} onValueChange={setNewSubSem}>
                  <SelectTrigger className="text-xs bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                      <SelectItem key={s} value={String(s)} className="text-xs">
                        Semester {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" size="sm" onClick={resetSubForm}>
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={savingSub} className="gradient-primary text-primary-foreground font-semibold">
                {savingSub ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Check className="h-4 w-4 mr-1" />}
                {editingSubId ? "Update Subject" : "Save Subject"}
              </Button>
            </div>
          </form>
        )}

        {/* Subjects Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Code</TableHead>
                <TableHead>Subject Name</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Semester</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subjectsList.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground text-xs">
                    No subjects registered yet. Click "Add Subject" to create one.
                  </TableCell>
                </TableRow>
              ) : (
                subjectsList.map((sub) => (
                  <TableRow key={sub.id}>
                    <TableCell className="font-mono text-xs font-bold text-primary">{sub.subject_code}</TableCell>
                    <TableCell className="font-semibold text-xs">{sub.subject_name}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{sub.department}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-mono text-xs">Sem {sub.semester}</Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEditClick(sub)}>
                        <Edit3 className="h-3.5 w-3.5 text-primary" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-rose-500 hover:text-rose-600" onClick={() => handleDeleteClick(sub.id, sub.subject_name)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* SECTION 2: INSTITUTIONAL SYSTEM SETTINGS */}
      <Card className="p-6 border shadow-soft space-y-6">
        <h2 className="text-lg font-bold border-b pb-2 flex items-center gap-2">
          <Building2 className="h-5 w-5 text-primary" /> Institution & Threshold Metadata
        </h2>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-xs font-semibold">College / University Name</Label>
            <Input
              value={collegeName}
              onChange={(e) => setCollegeName(e.target.value)}
              placeholder="e.g. Government Engineering College"
              className="text-xs"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold">Default Department</Label>
            <Input
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="e.g. Computer Science & Engineering"
              className="text-xs"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold">Faculty / Professor Name</Label>
            <Input
              value={facultyName}
              onChange={(e) => setFacultyName(e.target.value)}
              placeholder="e.g. Professor Sharma"
              className="text-xs"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold">Academic Year</Label>
            <Input
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              placeholder="e.g. 2025-2026"
              className="text-xs font-mono"
            />
          </div>
        </div>

        {/* Mandatory Attendance Threshold Slider */}
        <div className="space-y-3 pt-3 border-t">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-semibold">Minimum Attendance Threshold Target</Label>
            <span className="font-mono text-sm font-bold text-emerald-600">{threshold[0]}%</span>
          </div>
          <Slider
            value={threshold}
            onValueChange={setThreshold}
            min={50}
            max={90}
            step={5}
            className="w-full"
          />
          <p className="text-[11px] text-muted-foreground">
            Students falling below {threshold[0]}% overall or subject attendance will trigger automatic exam warning alerts.
          </p>
        </div>
      </Card>
    </div>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { Pencil, Trash2, Plus, Search, Loader2, X, Save, UserCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { getStudents, deleteStudent, updateStudent } from "@/api/attendance";
import { showSuccess, showError, showWarning } from "@/lib/notifications";

export const Route = createFileRoute("/_app/students")({
  head: () => ({ meta: [{ title: "Students · SmartAttend AI" }] }),
  component: StudentsPage,
});

export interface StudentRecord {
  id: number | string;
  full_name?: string;
  name?: string;
  roll_no?: string;
  roll?: string;
  department: string;
  semester?: string;
  registered_on?: string;
  registeredOn?: string;
  photo?: string;
}

const getAvatar = (name: string) =>
  `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;

function StudentsPage() {
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Edit Modal State
  const [editingStudent, setEditingStudent] = useState<StudentRecord | null>(null);
  const [editName, setEditName] = useState("");
  const [editRoll, setEditRoll] = useState("");
  const [editDept, setEditDept] = useState("");
  const [editSem, setEditSem] = useState("1");
  const [savingEdit, setSavingEdit] = useState(false);

  const fetchRoster = async () => {
    try {
      setLoading(true);
      const data = await getStudents();
      if (Array.isArray(data)) {
        setStudents(data);
      } else {
        setStudents([]);
      }
    } catch (err) {
      console.error("Error loading student database:", err);
      showError("Connection Error", "Failed to fetch student roster from server.");
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoster();
  }, []);

  const openEditDialog = (s: StudentRecord) => {
    setEditingStudent(s);
    setEditName(s.full_name || s.name || "");
    setEditRoll(s.roll_no || s.roll || "");
    setEditDept(s.department || "");
    setEditSem(s.semester || "1");
  };

  const handleSaveEdit = async () => {
    if (!editingStudent) return;
    if (!editName.trim() || !editRoll.trim() || !editDept.trim() || !editSem.trim()) {
      showWarning("Validation Error", "All fields (Name, Roll No, Department, Semester) are required.");
      return;
    }

    try {
      setSavingEdit(true);
      const res = await updateStudent(editingStudent.id, {
        name: editName.trim(),
        roll: editRoll.trim(),
        department: editDept.trim(),
        semester: editSem.trim(),
      });

      if (res.success) {
        showSuccess("Student Updated", res.message || "Student updated successfully.");
        setEditingStudent(null);
        fetchRoster();
      } else {
        showError("Update Failed", res.message || "Failed to update student.");
      }
    } catch (err: any) {
      console.error("Edit error:", err);
      const msg = err.response?.data?.message || "Failed to update student in database.";
      showError("Database Error", msg);
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDelete = async (id: number | string, name: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete student "${name}"?\n\nThis will permanently delete their database record, image dataset, and encodings.`
    );
    if (!confirmed) return;

    try {
      const res = await deleteStudent(Number(id));
      if (res && res.success) {
        showSuccess("Student Deleted", res.message || `Student "${name}" deleted successfully.`);
      } else {
        showSuccess("Deletion Completed", res.message || "Deletion completed.");
      }
      fetchRoster();
    } catch (err: any) {
      console.error("Delete failed:", err);
      const msg = err.response?.data?.message || "Failed to delete student from database.";
      showError("Database Error", msg);
    }
  };

  const filteredStudents = students.filter((s) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    const sName = (s.full_name || s.name || "").toLowerCase();
    const sRoll = (s.roll_no || s.roll || "").toLowerCase();
    const sDept = (s.department || "").toLowerCase();
    return sName.includes(query) || sRoll.includes(query) || sDept.includes(query);
  });

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 sm:flex sm:flex-wrap sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight" style={{ fontFamily: "Sora, Inter, sans-serif" }}>
            Student Roster
          </h1>
          <p className="text-sm text-muted-foreground">
            {students.length} registered student{students.length === 1 ? "" : "s"} in database
          </p>
        </div>
        <Button asChild className="gradient-primary text-primary-foreground shrink-0 font-semibold">
          <Link to="/register">
            <Plus className="h-4 w-4 mr-1" /> Register Student
          </Link>
        </Button>
      </div>

      {/* Search Filter Card */}
      <Card className="p-4 border shadow-soft">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, roll number, or department…"
            className="pl-9 bg-muted/50 border-0"
          />
        </div>
      </Card>

      {/* Student Cards Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-16 text-muted-foreground gap-2">
          <Loader2 className="h-5 w-5 animate-spin" /> Fetching MongoDB database records...
        </div>
      ) : filteredStudents.length === 0 ? (
        <Card className="p-12 text-center border shadow-soft">
          <UserCheck className="h-12 w-12 text-muted-foreground/40 mx-auto mb-3" />
          <p className="font-semibold text-lg">No students found</p>
          <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
            {searchQuery
              ? `No student records match "${searchQuery}". Try adjusting your search query.`
              : "No registered students in database yet. Click 'Register Student' to add a new student."}
          </p>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredStudents.map((s) => {
            const displayName = s.full_name || s.name || "Unknown";
            const displayRoll = s.roll_no || s.roll || "N/A";
            const displayDate = s.registered_on || s.registeredOn || "N/A";
            const photoUrl = s.photo || getAvatar(displayName);

            return (
              <Card key={s.id} className="p-5 border shadow-soft hover:shadow-elevated transition-all bg-card flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <img
                      src={photoUrl}
                      alt={displayName}
                      className="h-14 w-14 rounded-2xl bg-muted ring-2 ring-primary/20 object-cover"
                    />
                    <div className="min-w-0">
                      <p className="font-semibold truncate text-base">{displayName}</p>
                      <p className="text-xs text-muted-foreground truncate font-mono mt-0.5">{displayRoll}</p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2 text-sm border-t pt-3 border-border/60">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground text-xs">Department</span>
                      <Badge variant="secondary" className="font-normal text-xs">{s.department}</Badge>
                    </div>
                    {s.semester && (
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground text-xs">Semester</span>
                        <span className="font-medium text-xs">Sem {s.semester}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground text-xs">Registered</span>
                      <span className="font-medium text-xs">{displayDate}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-2 border-t pt-3 border-border/40">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(s)}
                    className="w-full"
                  >
                    <Pencil className="h-3.5 w-3.5 mr-1" /> Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(s.id, displayName)}
                    className="w-full text-destructive hover:text-destructive hover:bg-destructive/5"
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Edit Student Dialog Modal */}
      {editingStudent && (
        <Dialog open={Boolean(editingStudent)} onOpenChange={() => setEditingStudent(null)}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Pencil className="h-5 w-5 text-primary" /> Edit Student Details
              </DialogTitle>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div>
                <Label htmlFor="edit-name">Full Name</Label>
                <Input
                  id="edit-name"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="edit-roll">Roll Number</Label>
                <Input
                  id="edit-roll"
                  value={editRoll}
                  onChange={(e) => setEditRoll(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="edit-dept">Department</Label>
                <Select value={editDept} onValueChange={setEditDept}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Computer Science">Computer Science</SelectItem>
                    <SelectItem value="Electronics">Electronics</SelectItem>
                    <SelectItem value="Mechanical">Mechanical</SelectItem>
                    <SelectItem value="Civil">Civil</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="edit-sem">Semester</Label>
                <Input
                  id="edit-sem"
                  value={editSem}
                  onChange={(e) => setEditSem(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" onClick={() => setEditingStudent(null)}>
                Cancel
              </Button>
              <Button onClick={handleSaveEdit} disabled={savingEdit} className="gradient-primary text-primary-foreground">
                {savingEdit ? "Saving Changes..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

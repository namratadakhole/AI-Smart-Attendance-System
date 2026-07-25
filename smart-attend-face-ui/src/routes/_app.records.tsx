import { createFileRoute } from "@tanstack/react-router";
import { Download, FileSpreadsheet, FileText, Filter, Search, Calendar, Loader2, TrendingUp, Users, ArrowUpDown, ChevronLeft, ChevronRight, UserCheck, Eye } from "lucide-react";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { getReportsData, exportReportExcel, exportReportPDF, getAttendanceRecords } from "@/api/attendance";
import { showSuccess, showError, showWarning, showInfo } from "@/lib/notifications";

export const Route = createFileRoute("/_app/records")({
  head: () => ({ meta: [{ title: "Attendance History & Reports · SmartAttend AI" }] }),
  component: ReportsPage,
});

const getAvatarUrl = (name: string) =>
  `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;

function ReportsPage() {
  const [activeTab, setActiveTab] = useState<"reports" | "history" | "students">("history");

  // Report State
  const [reportType, setReportType] = useState<"daily" | "weekly" | "monthly" | "custom">("daily");
  const [department, setDepartment] = useState("all");
  const [semester, setSemester] = useState("all");
  const [subject, setSubject] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reportsLoading, setReportsLoading] = useState(false);
  const [reportsData, setReportsData] = useState<any>({
    records: [],
    attendance_percentage: "100%",
    total_records: 0,
    total_students: 0,
    daily_trend: [],
    monthly_trend: [],
  });

  // History Log State
  const [historyLoading, setHistoryLoading] = useState(true);
  const [historyRecords, setHistoryRecords] = useState<any[]>([]);
  const [studentSummaries, setStudentSummaries] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDept, setFilterDept] = useState("all");
  const [filterSem, setFilterSem] = useState("all");
  const [filterDate, setFilterDate] = useState("");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Selected Student History Modal State
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);

  const loadReports = async () => {
    try {
      setReportsLoading(true);
      const res = await getReportsData({
        type: reportType,
        department,
        semester,
        subject,
        start_date: startDate,
        end_date: endDate,
      });

      if (res && res.success) {
        setReportsData(res);
      }
    } catch (err) {
      console.error("Error loading reports data:", err);
    } finally {
      setReportsLoading(false);
    }
  };

  const loadHistory = async () => {
    try {
      setHistoryLoading(true);
      const res = await getAttendanceRecords({
        search: searchQuery,
        department: filterDept,
        semester: filterSem,
        date: filterDate,
        sort: sortOrder,
      });

      if (res) {
        setHistoryRecords(res.records || []);
        setStudentSummaries(res.student_summaries || []);
      }
    } catch (err) {
      console.error("Error loading history logs:", err);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "reports") {
      loadReports();
    } else {
      loadHistory();
    }
  }, [activeTab, reportType, department, semester, subject, filterDept, filterSem, filterDate, sortOrder]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadHistory();
    setCurrentPage(1);
  };

  const handleExcelExport = () => {
    exportReportExcel({ department: filterDept, semester: filterSem });
    showSuccess("Report Exported", "Excel report generated & downloaded.");
  };

  const handlePdfExport = () => {
    exportReportPDF({ department: filterDept, semester: filterSem });
    showSuccess("Report Exported", "PDF report generated & opened.");
  };

  // Filter & Pagination logic for History Table
  const filteredHistory = historyRecords.filter((r) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    const name = (r.name || "").toLowerCase();
    const roll = (r.roll_no || "").toLowerCase();
    const dept = (r.department || "").toLowerCase();
    return name.includes(q) || roll.includes(q) || dept.includes(q);
  });

  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage) || 1;
  const paginatedHistory = filteredHistory.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Page Header */}
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 sm:flex sm:flex-wrap sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight" style={{ fontFamily: "Sora, Inter, sans-serif" }}>
            Attendance History & Reports
          </h1>
          <p className="text-sm text-muted-foreground">
            Complete SQLite database history logs, student metrics, and exports
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            onClick={handleExcelExport}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
          >
            <FileSpreadsheet className="h-4 w-4 mr-2" /> Export Excel
          </Button>
          <Button
            onClick={handlePdfExport}
            className="bg-rose-600 hover:bg-rose-700 text-white font-semibold"
          >
            <FileText className="h-4 w-4 mr-2" /> Export PDF
          </Button>
        </div>
      </div>

      {/* Main Feature Navigation Tabs */}
      <Card className="p-2 border shadow-soft bg-card">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
          <TabsList className="grid grid-cols-3 w-full max-w-xl">
            <TabsTrigger value="history" className="font-semibold">
              <Calendar className="h-4 w-4 mr-2" /> Full History Log
            </TabsTrigger>
            <TabsTrigger value="students" className="font-semibold">
              <Users className="h-4 w-4 mr-2" /> Student % Summary
            </TabsTrigger>
            <TabsTrigger value="reports" className="font-semibold">
              <TrendingUp className="h-4 w-4 mr-2" /> Analytics & Reports
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </Card>

      {/* TAB 1: FULL ATTENDANCE HISTORY LOG */}
      {activeTab === "history" && (
        <div className="space-y-4">
          {/* Search & Multi-Filter Bar */}
          <Card className="p-4 border shadow-soft space-y-3">
            <form onSubmit={handleSearchSubmit} className="grid gap-3 sm:grid-cols-2 md:grid-cols-5 items-end">
              <div className="md:col-span-2 relative">
                <label className="text-xs font-semibold text-muted-foreground mb-1 block">Search Student</label>
                <Search className="absolute left-3 bottom-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by student name or roll number…"
                  className="pl-9 bg-muted/50 border-0"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1 block">Filter Date</label>
                <Input
                  type="text"
                  placeholder="DD-MM-YYYY"
                  value={filterDate}
                  onChange={(e) => {
                    setFilterDate(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1 block">Department</label>
                <Select value={filterDept} onValueChange={(v) => { setFilterDept(v); setCurrentPage(1); }}>
                  <SelectTrigger><SelectValue placeholder="All Departments" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    <SelectItem value="Computer Science">Computer Science</SelectItem>
                    <SelectItem value="Electronics">Electronics</SelectItem>
                    <SelectItem value="Mechanical">Mechanical</SelectItem>
                    <SelectItem value="Civil">Civil</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
                  className="w-full text-xs"
                >
                  <ArrowUpDown className="h-3.5 w-3.5 mr-1" />
                  {sortOrder === "desc" ? "Newest First" : "Oldest First"}
                </Button>
              </div>
            </form>
          </Card>

          {/* Paginated History Data Table */}
          <Card className="border shadow-soft overflow-hidden">
            {historyLoading ? (
              <div className="flex items-center justify-center py-16 text-muted-foreground gap-2">
                <Loader2 className="h-5 w-5 animate-spin" /> Fetching SQLite attendance logs...
              </div>
            ) : paginatedHistory.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground text-sm">
                No attendance records match the selected date or search filter.
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50 hover:bg-muted/50">
                        <TableHead className="w-12">Photo</TableHead>
                        <TableHead>Student Name</TableHead>
                        <TableHead>Roll Number</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedHistory.map((r) => (
                        <TableRow key={r.id}>
                          <TableCell>
                            <img
                              src={getAvatarUrl(r.name)}
                              alt={r.name}
                              className="h-9 w-9 rounded-full ring-2 ring-primary/10 bg-muted"
                            />
                          </TableCell>
                          <TableCell className="font-semibold">{r.name}</TableCell>
                          <TableCell className="text-muted-foreground font-mono text-xs">{r.roll_no || "N/A"}</TableCell>
                          <TableCell>{r.department || "General"}</TableCell>
                          <TableCell className="text-xs">{r.date}</TableCell>
                          <TableCell className="text-xs text-emerald-600 font-medium">{r.time}</TableCell>
                          <TableCell>
                            <Badge className="bg-success/15 text-success border-0 text-[11px]">
                              ● {r.status || "Present"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const matchedSt = studentSummaries.find((s) => s.name === r.name);
                                setSelectedStudent(matchedSt || {
                                  name: r.name,
                                  roll: r.roll_no,
                                  department: r.department,
                                  percentage: "100%",
                                  present_days: 1,
                                  total_days: 1,
                                  history: [{ date: r.date, time: r.time, status: r.status }]
                                });
                              }}
                              className="text-primary hover:text-primary hover:bg-primary/10 text-xs"
                            >
                              <Eye className="h-3.5 w-3.5 mr-1" /> View History
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination Bar */}
                <div className="p-4 border-t border-border/60 flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredHistory.length)} of {filteredHistory.length} records
                  </p>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" /> Previous
                    </Button>
                    <span className="text-xs font-semibold px-2">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </Card>
        </div>
      )}

      {/* TAB 2: PER-STUDENT ATTENDANCE SUMMARY & PERCENTAGE */}
      {activeTab === "students" && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {studentSummaries.length === 0 ? (
            <Card className="col-span-full p-12 text-center text-muted-foreground">
              No student attendance summaries computed yet.
            </Card>
          ) : (
            studentSummaries.map((st) => (
              <Card key={st.id || st.name} className="p-5 border shadow-soft hover:shadow-elevated transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <img
                      src={getAvatarUrl(st.name)}
                      alt={st.name}
                      className="h-12 w-12 rounded-2xl bg-muted ring-2 ring-primary/20"
                    />
                    <div className="min-w-0">
                      <p className="font-semibold truncate text-base">{st.name}</p>
                      <p className="text-xs text-muted-foreground font-mono">{st.roll}</p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2 text-xs border-t pt-3 border-border/60">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Department</span>
                      <Badge variant="secondary" className="font-normal text-xs">{st.department}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Check-ins</span>
                      <span className="font-medium">{st.present_days} / {st.total_days} Sessions</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-muted-foreground block">Attendance Rate</span>
                    <span className={`text-lg font-bold ${st.pct_number >= 75 ? "text-emerald-600" : "text-amber-500"}`}>
                      {st.percentage}
                    </span>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedStudent(st)}
                    className="text-xs"
                  >
                    <Eye className="h-3.5 w-3.5 mr-1" /> View Log
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {/* TAB 3: REPORTS & ANALYTICS */}
      {activeTab === "reports" && (
        <div className="space-y-6">
          <Card className="p-5 border shadow-soft space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-4">
              <Tabs
                value={reportType}
                onValueChange={(val) => setReportType(val as any)}
                className="w-full sm:w-auto"
              >
                <TabsList className="grid grid-cols-4 w-full sm:w-auto">
                  <TabsTrigger value="daily">Daily Report</TabsTrigger>
                  <TabsTrigger value="weekly">Weekly Report</TabsTrigger>
                  <TabsTrigger value="monthly">Monthly Report</TabsTrigger>
                  <TabsTrigger value="custom">Custom Range</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4 items-end">
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1 block">Department</label>
                <Select value={department} onValueChange={setDepartment}>
                  <SelectTrigger><SelectValue placeholder="All Departments" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    <SelectItem value="Computer Science">Computer Science</SelectItem>
                    <SelectItem value="Electronics">Electronics</SelectItem>
                    <SelectItem value="Mechanical">Mechanical</SelectItem>
                    <SelectItem value="Civil">Civil</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1 block">Semester</label>
                <Select value={semester} onValueChange={setSemester}>
                  <SelectTrigger><SelectValue placeholder="All Semesters" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Semesters</SelectItem>
                    <SelectItem value="1">Sem 1</SelectItem>
                    <SelectItem value="2">Sem 2</SelectItem>
                    <SelectItem value="3">Sem 3</SelectItem>
                    <SelectItem value="4">Sem 4</SelectItem>
                    <SelectItem value="5">Sem 5</SelectItem>
                    <SelectItem value="6">Sem 6</SelectItem>
                    <SelectItem value="7">Sem 7</SelectItem>
                    <SelectItem value="8">Sem 8</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1 block">Subject</label>
                <Select value={subject} onValueChange={setSubject}>
                  <SelectTrigger><SelectValue placeholder="All Subjects" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subjects</SelectItem>
                    <SelectItem value="CS-501">CS-501 Advanced Algorithms</SelectItem>
                    <SelectItem value="EC-302">EC-302 Digital Signal Processing</SelectItem>
                    <SelectItem value="ME-401">ME-401 Thermodynamics</SelectItem>
                    <SelectItem value="AI-101">AI-101 Facial Recognition</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          <div className="grid gap-4 lg:grid-cols-3">
            <Card className="p-5 border shadow-soft flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-sm">Attendance Percentage</h3>
                  <TrendingUp className="h-4 w-4 text-emerald-600" />
                </div>
                <p className="text-4xl font-bold mt-4 text-primary tracking-tight">{reportsData.attendance_percentage}</p>
              </div>
            </Card>

            <Card className="p-5 border shadow-soft lg:col-span-2">
              <h3 className="font-semibold text-sm mb-2">Daily Attendance Trend</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={reportsData.daily_trend || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.02 250)" />
                    <XAxis dataKey="day" stroke="oklch(0.5 0.04 258)" fontSize={11} />
                    <YAxis stroke="oklch(0.5 0.04 258)" fontSize={11} />
                    <Tooltip />
                    <Line type="monotone" dataKey="present" stroke="oklch(0.55 0.2 255)" strokeWidth={3} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* INDIVIDUAL STUDENT HISTORY DIALOG MODAL */}
      {selectedStudent && (
        <Dialog open={Boolean(selectedStudent)} onOpenChange={() => setSelectedStudent(null)}>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <img
                  src={getAvatarUrl(selectedStudent.name)}
                  alt={selectedStudent.name}
                  className="h-10 w-10 rounded-full ring-2 ring-primary/20"
                />
                <div>
                  <p className="font-semibold text-lg">{selectedStudent.name}</p>
                  <p className="text-xs text-muted-foreground font-mono">{selectedStudent.roll} · {selectedStudent.department}</p>
                </div>
              </DialogTitle>
              <DialogDescription className="pt-2">
                Detailed attendance check-in history log from SQLite database.
              </DialogDescription>
            </DialogHeader>

            <div className="py-4 space-y-4">
              <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-muted/40 border border-border">
                <div>
                  <span className="text-xs text-muted-foreground block">Attendance Percentage</span>
                  <span className="text-2xl font-bold text-emerald-600">{selectedStudent.percentage || "100%"}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Total Check-in Days</span>
                  <span className="text-2xl font-bold text-primary">{selectedStudent.present_days || selectedStudent.history?.length || 1} Days</span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-muted-foreground mb-2">Check-in Timeline Logs</h4>
                <div className="max-h-[250px] overflow-y-auto space-y-2 pr-1">
                  {(selectedStudent.history || []).map((h: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-card border border-border/60 text-xs">
                      <div>
                        <p className="font-medium text-foreground">{h.date}</p>
                        <p className="text-[11px] text-muted-foreground">{h.time}</p>
                      </div>
                      <Badge className="bg-success/15 text-success border-0 text-[10px]">
                        ● {h.status || "Present"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

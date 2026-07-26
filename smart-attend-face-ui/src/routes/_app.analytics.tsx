import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  BarChart, Bar, Legend,
} from "recharts";
import { Card } from "@/components/ui/card";
import { getDashboardStats } from "@/api/attendance";
import { presentAbsent as mockPie, weeklyAttendance as mockWeekly, monthlyAttendance as mockMonthly } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/analytics")({
  head: () => ({ meta: [{ title: "Analytics · SmartAttend AI" }] }),
  component: AnalyticsPage,
});

const PIE_COLORS = ["oklch(0.55 0.2 255)", "oklch(0.65 0.2 25)"];

function AnalyticsPage() {
  const [pieData, setPieData] = useState<any[]>(mockPie);
  const [weeklyData, setWeeklyData] = useState<any[]>(mockWeekly);
  const [monthlyData, setMonthlyData] = useState<any[]>(mockMonthly);
  const [presentCount, setPresentCount] = useState(0);
  const [absentCount, setAbsentCount] = useState(0);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const res = await getDashboardStats();
        if (res) {
          if (Array.isArray(res.present_absent_pie) && res.present_absent_pie.length > 0) {
            setPieData(res.present_absent_pie);
          }
          if (Array.isArray(res.weekly_attendance) && res.weekly_attendance.length > 0) {
            setWeeklyData(res.weekly_attendance);
          }
          if (Array.isArray(res.monthly_attendance) && res.monthly_attendance.length > 0) {
            setMonthlyData(res.monthly_attendance);
          }
          setPresentCount(res.present_today || 0);
          setAbsentCount(res.absent_today || 0);
        }
      } catch (err) {
        console.error("Error loading analytics stats:", err);
      }
    }
    loadAnalytics();
  }, []);

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight" style={{ fontFamily: "Sora, Inter, sans-serif" }}>
          Analytics & Insights
        </h1>
        <p className="text-sm text-muted-foreground">Understand classroom attendance patterns from MongoDB database logs.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="p-5 border shadow-soft">
          <h3 className="font-semibold">Present vs Absent</h3>
          <p className="text-xs text-muted-foreground mb-2">Today's MongoDB distribution</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={4}>
                  {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 text-sm mt-2">
            <span className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-primary" /> Present {presentCount}</span>
            <span className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-destructive" /> Absent {absentCount}</span>
          </div>
        </Card>

        <Card className="p-5 border shadow-soft lg:col-span-2">
          <h3 className="font-semibold">Weekly Attendance Trend</h3>
          <p className="text-xs text-muted-foreground mb-2">Present vs absent per day (Current Week)</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.02 250)" />
                <XAxis dataKey="day" stroke="oklch(0.5 0.04 258)" fontSize={12} />
                <YAxis stroke="oklch(0.5 0.04 258)" fontSize={12} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="present" stroke="oklch(0.55 0.2 255)" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="absent" stroke="oklch(0.65 0.2 25)" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="p-5 border shadow-soft">
        <h3 className="font-semibold">Monthly Attendance</h3>
        <p className="text-xs text-muted-foreground mb-2">Average attendance percentage per month</p>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.02 250)" />
              <XAxis dataKey="month" stroke="oklch(0.5 0.04 258)" fontSize={12} />
              <YAxis stroke="oklch(0.5 0.04 258)" fontSize={12} />
              <Tooltip />
              <Bar dataKey="attendance" fill="oklch(0.55 0.2 255)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}

export type Student = {
  id: string;
  name: string;
  roll: string;
  department: string;
  registeredOn: string;
  photo: string;
};

const avatar = (seed: string) =>
  `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;

export const students: Student[] = [
  { id: "1", name: "Namrata Patil", roll: "CS21001", department: "Computer Science", registeredOn: "2025-08-12", photo: avatar("Namrata") },
  { id: "2", name: "Tanuja Deshmukh", roll: "CS21002", department: "Computer Science", registeredOn: "2025-08-12", photo: avatar("Tanuja") },
  { id: "3", name: "Yamini Rao", roll: "CS21003", department: "Computer Science", registeredOn: "2025-08-13", photo: avatar("Yamini") },
  { id: "4", name: "Rohan Iyer", roll: "CS21004", department: "Computer Science", registeredOn: "2025-08-13", photo: avatar("Rohan") },
  { id: "5", name: "Aisha Khan", roll: "EC21005", department: "Electronics", registeredOn: "2025-08-14", photo: avatar("Aisha") },
  { id: "6", name: "Karan Mehta", roll: "EC21006", department: "Electronics", registeredOn: "2025-08-15", photo: avatar("Karan") },
  { id: "7", name: "Priya Singh", roll: "ME21007", department: "Mechanical", registeredOn: "2025-08-16", photo: avatar("Priya") },
  { id: "8", name: "Arjun Nair", roll: "ME21008", department: "Mechanical", registeredOn: "2025-08-16", photo: avatar("Arjun") },
];

export const attendanceRecords = students.slice(0, 6).map((s, i) => ({
  ...s,
  date: "2026-07-11",
  time: `09:${(2 + i).toString().padStart(2, "0")} AM`,
  status: "Present" as const,
}));

export const weeklyAttendance = [
  { day: "Mon", present: 92, absent: 28 },
  { day: "Tue", present: 105, absent: 15 },
  { day: "Wed", present: 98, absent: 22 },
  { day: "Thu", present: 110, absent: 10 },
  { day: "Fri", present: 88, absent: 32 },
  { day: "Sat", present: 76, absent: 44 },
];

export const monthlyAttendance = [
  { month: "Jan", attendance: 82 },
  { month: "Feb", attendance: 85 },
  { month: "Mar", attendance: 79 },
  { month: "Apr", attendance: 88 },
  { month: "May", attendance: 84 },
  { month: "Jun", attendance: 91 },
  { month: "Jul", attendance: 87 },
];

export const presentAbsent = [
  { name: "Present", value: 98 },
  { name: "Absent", value: 22 },
];

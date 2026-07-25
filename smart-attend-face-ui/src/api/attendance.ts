import axios from "axios";

const API = "http://127.0.0.1:5000";

export const startAttendance = async () => {
    const response = await axios.post(`${API}/start-attendance`);
    return response.data;
};

export const stopAttendance = async () => {
    const response = await axios.post(`${API}/stop-attendance`);
    return response.data;
};

export const trainModel = async () => {
    const response = await axios.post(`${API}/train-model`);
    return response.data;
};

export const registerStudent = async () => {
    const response = await axios.post(`${API}/register-student`);
    return response.data;
};

export const getStatus = async () => {
    const response = await axios.get(`${API}/status`);
    return response.data;
};

export const getStudents = async () => {
    const response = await axios.get(`${API}/students`);
    return response.data;
};

export const deleteStudent = async (id: number) => {
    const response = await axios.delete(`${API}/students/${id}`);
    return response.data;
};

export const updateStudent = async (id: number | string, data: any) => {
    const response = await axios.put(`${API}/students/${id}`, data);
    return response.data;
};

export const getDashboardStats = async () => {
    const response = await axios.get(`${API}/dashboard-stats`);
    return response.data;
};

export const getAttendanceRecords = async (params?: any) => {
    const response = await axios.get(`${API}/attendance-records`, { params });
    return response.data;
};

export const getReportsData = async (params: any) => {
    const response = await axios.get(`${API}/reports-data`, { params });
    return response.data;
};

export const exportReportExcel = (params?: any) => {
    const query = new URLSearchParams(params || {}).toString();
    window.open(`${API}/export-report-excel?${query}`, "_blank");
};

export const exportReportPDF = (params?: any) => {
    const query = new URLSearchParams(params || {}).toString();
    window.open(`${API}/export-report-pdf?${query}`, "_blank");
};

export const getSettings = async () => {
    const response = await axios.get(`${API}/settings`);
    return response.data;
};

export const saveSettings = async (data: any) => {
    const response = await axios.post(`${API}/settings`, data);
    return response.data;
};

export const loginUser = async (data: any) => {
    const response = await axios.post(`${API}/login`, data);
    return response.data;
};

export const getStudentDashboardData = async (roll_no: string) => {
    const response = await axios.get(`${API}/student/dashboard-data/${encodeURIComponent(roll_no)}`);
    return response.data;
};

export const registerUser = async (data: any) => {
    const response = await axios.post(`${API}/register-user`, data);
    return response.data;
};

export const updateStudentProfile = async (data: any) => {
    const response = await axios.post(`${API}/student/update-profile`, data);
    return response.data;
};

export const getSubjects = async (department?: string, semester?: string) => {
    const response = await axios.get(`${API}/subjects`, { params: { department, semester } });
    return response.data;
};

export const createSubject = async (data: any) => {
    const response = await axios.post(`${API}/subjects`, data);
    return response.data;
};

export const updateSubject = async (id: number, data: any) => {
    const response = await axios.put(`${API}/subjects/${id}`, data);
    return response.data;
};

export const deleteSubject = async (id: number) => {
    const response = await axios.delete(`${API}/subjects/${id}`);
    return response.data;
};

export const getStudentSubjectAttendance = async (roll_no: string) => {
    const response = await axios.get(`${API}/student/${encodeURIComponent(roll_no)}/subject-attendance`);
    return response.data;
};

export const startAttendanceSession = async (data: { subject_id?: number; department?: string; semester?: string }) => {
    const response = await axios.post(`${API}/attendance/start-session`, data);
    return response.data;
};

export const downloadAttendance = () => {
    window.open("http://127.0.0.1:5000/download-attendance", "_blank");
};
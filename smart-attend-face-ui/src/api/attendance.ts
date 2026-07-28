import axios from "axios";
import { showWarning, showError } from "@/lib/notifications";

export const API = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

// Centralized Axios client instance
export const apiClient = axios.create({
  baseURL: API,
  timeout: 60000, // 60 seconds (allows Render servers to cold start)
});

let pendingRequestsCount = 0;
let coldStartTimeout: any = null;

// Request Interceptor: Inject JWT token & monitor slow cold start
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    pendingRequestsCount++;
    if (pendingRequestsCount === 1) {
      coldStartTimeout = setTimeout(() => {
        showWarning(
          "Connecting to Server...",
          "The backend service might be waking up from a Render cold start. This can take up to 50 seconds."
        );
      }, 4000); // Trigger after 4 seconds of initial delay
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Manage session expiry & clear timers
apiClient.interceptors.response.use(
  (response) => {
    pendingRequestsCount--;
    if (pendingRequestsCount <= 0) {
      pendingRequestsCount = 0;
      if (coldStartTimeout) {
        clearTimeout(coldStartTimeout);
        coldStartTimeout = null;
      }
    }
    return response;
  },
  (error) => {
    pendingRequestsCount--;
    if (pendingRequestsCount <= 0) {
      pendingRequestsCount = 0;
      if (coldStartTimeout) {
        clearTimeout(coldStartTimeout);
        coldStartTimeout = null;
      }
    }

    // 401 Unauthorized / Token Expired Handling
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("userRole");
      localStorage.removeItem("userData");
      localStorage.removeItem("authToken");

      showError("Session Expired", "Your authentication session has expired. Please sign in again.");

      if (window.location.pathname !== "/login") {
        setTimeout(() => {
          window.location.href = "/login";
        }, 1000);
      }
    }

    return Promise.reject(error);
  }
);

export const startAttendance = async () => {
  const response = await apiClient.post("/start-attendance");
  return response.data;
};

export const stopAttendance = async () => {
  const response = await apiClient.post("/stop-attendance");
  return response.data;
};

export const trainModel = async () => {
  const response = await apiClient.post("/train-model");
  return response.data;
};

export const registerStudent = async () => {
  const response = await apiClient.post("/register-student");
  return response.data;
};

export const getStatus = async () => {
  const response = await apiClient.get("/status");
  return response.data;
};

export const getStudents = async () => {
  const response = await apiClient.get("/students");
  return response.data;
};

export const deleteStudent = async (id: number | string) => {
  const response = await apiClient.delete(`/students/${id}`);
  return response.data;
};

export const updateStudent = async (id: number | string, data: any) => {
  const response = await apiClient.put(`/students/${id}`, data);
  return response.data;
};

export const getDashboardStats = async () => {
  const response = await apiClient.get("/dashboard-stats");
  return response.data;
};

export const getAttendanceRecords = async (params?: any) => {
  const response = await apiClient.get("/attendance-records", { params });
  return response.data;
};

export const getReportsData = async (params: any) => {
  const response = await apiClient.get("/reports-data", { params });
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
  const response = await apiClient.get("/settings");
  return response.data;
};

export const saveSettings = async (data: any) => {
  const response = await apiClient.post("/settings", data);
  return response.data;
};

export const loginUser = async (data: any) => {
  const response = await apiClient.post("/login", data);
  return response.data;
};

export const getStudentDashboardData = async (roll_no: string) => {
  const response = await apiClient.get(`/student/dashboard-data/${encodeURIComponent(roll_no)}`);
  return response.data;
};

export const registerUser = async (data: any) => {
  const response = await apiClient.post("/register-user", data);
  return response.data;
};

export const updateStudentProfile = async (data: any) => {
  const response = await apiClient.post("/student/update-profile", data);
  return response.data;
};

export const getSubjects = async (department?: string, semester?: string) => {
  const response = await apiClient.get("/subjects", { params: { department, semester } });
  return response.data;
};

export const createSubject = async (data: any) => {
  const response = await apiClient.post("/subjects", data);
  return response.data;
};

export const updateSubject = async (id: number, data: any) => {
  const response = await apiClient.put(`/subjects/${id}`, data);
  return response.data;
};

export const deleteSubject = async (id: number) => {
  const response = await apiClient.delete(`/subjects/${id}`);
  return response.data;
};

export const getStudentSubjectAttendance = async (roll_no: string) => {
  const response = await apiClient.get(`/student/${encodeURIComponent(roll_no)}/subject-attendance`);
  return response.data;
};

export const startAttendanceSession = async (data: { subject_id?: number; department?: string; semester?: string }) => {
  const response = await apiClient.post("/attendance/start-session", data);
  return response.data;
};

export const downloadAttendance = () => {
  window.open(`${API}/download-attendance`, "_blank");
};
const API = "http://localhost:8000";

export const reportService = {
  // Post a new report
  submitReport: async (reportData) => {
    try {
      const response = await fetch(`${API}/api/reports/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reportData),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to submit report");
      }
      return data;
    } catch (error) {
      throw error;
    }
  },

  // Get all reports (admin)
  getAllReports: async (token) => {
    try {
      const response = await fetch(`${API}/api/reports/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch reports");
      }
      return data;
    } catch (error) {
      throw error;
    }
  },

  // Get student's reports
  getStudentReports: async (studentId) => {
    try {
      const response = await fetch(`${API}/api/reports/student/${studentId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch student reports");
      }
      return data;
    } catch (error) {
      throw error;
    }
  },

  // Get report count for a student
  getReportCount: async (studentId) => {
    try {
      const response = await fetch(`${API}/api/reports/student/${studentId}/count`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch report count");
      }
      return data;
    } catch (error) {
      throw error;
    }
  },
};

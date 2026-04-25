import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { RefreshCw, CheckCircle, AlertCircle, Clock, FileText, TrendingUp } from "lucide-react";
import "./Reports.css";

const API = "http://localhost:8000";

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Fetch reports from API
  const fetchReports = async () => {
    try {
      setRefreshing(true);
      const response = await fetch(`${API}/api/reports/`);
      const data = await response.json();
      
      if (data.success && data.data) {
        // Sort by newest first
        const sortedReports = data.data.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        setReports(sortedReports);
        setLastUpdate(new Date());
      } else if (Array.isArray(data)) {
        // Fallback if backend returns array directly
        const sortedReports = data.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        setReports(sortedReports);
        setLastUpdate(new Date());
      }
    } catch (error) {
      console.error("Error fetching reports:", error);
      setReports([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Initial fetch and set up polling
  useEffect(() => {
    fetchReports();
    
    // Poll for new reports every 10 seconds
    const interval = setInterval(() => {
      fetchReports();
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = reports;

    if (statusFilter !== "all") {
      filtered = filtered.filter(report => report.status === statusFilter);
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter(report => report.contentType === typeFilter);
    }

    setFilteredReports(filtered);
  }, [reports, statusFilter, typeFilter]);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "pending":
        return "badge-pending";
      case "reviewed":
        return "badge-reviewed";
      case "rejected":
        return "badge-rejected";
      default:
        return "";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock size={14} />;
      case "reviewed":
        return <CheckCircle size={14} />;
      case "rejected":
        return <AlertCircle size={14} />;
      default:
        return null;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "Forum":
        return "type-forum";
      case "Quiz":
        return "type-quiz";
      case "File":
        return "type-file";
      case "Comment":
        return "type-comment";
      default:
        return "";
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const formatLastUpdate = () => {
    const now = new Date();
    const diff = Math.floor((now - lastUpdate) / 1000);
    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
  };

  const getReportStats = () => {
    return {
      total: reports.length,
      pending: reports.filter(r => r.status === "pending").length,
      reviewed: reports.filter(r => r.status === "reviewed").length,
      rejected: reports.filter(r => r.status === "rejected").length
    };
  };

  return (
    <div>
      <Navbar />
      <div className="reports-container">
        <div className="reports-header">
          <div className="header-top">
            <div className="header-content">
              <h1>Reports Management</h1>
              <p className="subtitle">View and manage content reports in real-time</p>
            </div>
            <div className="header-controls">
              <button 
                className={`btn-refresh ${refreshing ? "refreshing" : ""}`}
                onClick={fetchReports}
                disabled={refreshing}
              >
                <RefreshCw size={16} />
              </button>
              <div className="last-update">
                Updated {formatLastUpdate()}
              </div>
            </div>
          </div>
        </div>

        <div className="filters-section">
          <div className="filter-group">
            <label htmlFor="statusFilter">Status:</label>
            <select
              id="statusFilter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="reviewed">Reviewed</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="typeFilter">Content Type:</label>
            <select
              id="typeFilter"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Types</option>
              <option value="File">File</option>
              <option value="Forum">Forum</option>
              <option value="Quiz">Quiz</option>
              <option value="Comment">Comment</option>
            </select>
          </div>

          <div className="filter-stats">
            {(() => {
              const stats = getReportStats();
              return (
                <>
                  <span className="stat">
                    <FileText size={13} /> {stats.total} Total
                  </span>
                  <span className="stat pending">
                    <Clock size={13} /> {stats.pending} Pending
                  </span>
                  <span className="stat">
                    <CheckCircle size={13} style={{color: '#10b981'}} /> {stats.reviewed} Reviewed
                  </span>
                  <span className="stat">
                    <AlertCircle size={13} style={{color: '#ef4444'}} /> {stats.rejected} Rejected
                  </span>
                </>
              );
            })()}
          </div>
        </div>

        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading reports...</p>
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="no-reports">
            <div className="no-reports-icon">📋</div>
            <p>No reports found</p>
          </div>
        ) : (
          <div className="reports-table-container">
            <table className="reports-table">
              <thead>
                <tr>
                  <th>Content Title</th>
                  <th>Type</th>
                  <th>Reason</th>
                  <th>Reported By</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.map((report) => (
                  <tr key={report._id} className="report-row">
                    <td className="cell-title">{report.contentTitle}</td>
                    <td className="cell-type">
                      <span className={`badge type-badge ${getTypeColor(report.contentType)}`}>
                        {report.contentType}
                      </span>
                    </td>
                    <td className="cell-reason">{report.reason}</td>
                    <td className="cell-reported-by">{report.reportedByName}</td>
                    <td className="cell-status">
                      <span className={`badge status-badge ${getStatusBadgeClass(report.status)}`}>
                        {getStatusIcon(report.status)}
                        {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                      </span>
                    </td>
                    <td className="cell-date">{formatDate(report.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Reports;

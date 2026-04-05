import React, { useState, useEffect } from "react";
import "./Reports.css";

// Demo reports data
const demoReports = [
    {
      _id: "1",
      contentTitle: "Inappropriate Forum Post",
      contentType: "Forum",
      reason: "Offensive Language",
      description: "The user posted offensive content in the general forum that violates community guidelines.",
      reportedBy: "John Doe",
      reportedUserId: { _id: "user1", firstName: "Jane", lastName: "Smith" },
      status: "pending",
      date: new Date("2024-03-28"),
      createdAt: new Date("2024-03-28")
    },
    {
      _id: "2",
      contentTitle: "Quiz Answer Leak",
      contentType: "Quiz",
      reason: "Cheating",
      description: "User shared quiz answers in the group chat, compromising test integrity.",
      reportedBy: "Admin",
      reportedUserId: { _id: "user2", firstName: "Mike", lastName: "Johnson" },
      status: "reviewed",
      date: new Date("2024-03-25"),
      createdAt: new Date("2024-03-25")
    },
    {
      _id: "3",
      contentTitle: "Spam Material Upload",
      contentType: "File",
      reason: "Spam Content",
      description: "Multiple irrelevant files uploaded to the library without description.",
      reportedBy: "Sarah Wilson",
      reportedUserId: { _id: "user3", firstName: "Tom", lastName: "Brown" },
      status: "rejected",
      date: new Date("2024-03-20"),
      createdAt: new Date("2024-03-20")
    },
    {
      _id: "4",
      contentTitle: "Harassment in Comments",
      contentType: "Comment",
      reason: "Harassment",
      description: "User made derogatory comments targeting another student.",
      reportedBy: "Emma Davis",
      reportedUserId: { _id: "user4", firstName: "Alex", lastName: "Taylor" },
      status: "pending",
      date: new Date("2024-03-26"),
      createdAt: new Date("2024-03-26")
    },
    {
      _id: "5",
      contentTitle: "Plagiarized Report",
      contentType: "File",
      reason: "Plagiarism",
      description: "Submitted report appears to be copied from online sources without proper citation.",
      reportedBy: "Professor Admin",
      reportedUserId: { _id: "user5", firstName: "Lisa", lastName: "Anderson" },
      status: "reviewed",
      date: new Date("2024-03-22"),
      createdAt: new Date("2024-03-22")
    },
    {
      _id: "6",
      contentTitle: "Forum Advertisement",
      contentType: "Forum",
      reason: "Unauthorized Advertising",
      description: "User posting commercial advertisements in educational forum.",
      reportedBy: "Moderator",
      reportedUserId: { _id: "user6", firstName: "David", lastName: "Martinez" },
      status: "pending",
      date: new Date("2024-03-27"),
      createdAt: new Date("2024-03-27")
    }
  ];

const Reports = () => {
  const [reports, setReports] = useState(demoReports);
  const [filteredReports, setFilteredReports] = useState(demoReports);
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Apply filters
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
      day: "numeric"
    });
  };

  return (
    <div className="reports-container">
      <div className="reports-header">
        <h1>Reports Management</h1>
        <p className="subtitle">View and manage content reports</p>
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
            <option value="Forum">Forum</option>
            <option value="Quiz">Quiz</option>
            <option value="File">File</option>
            <option value="Comment">Comment</option>
          </select>
        </div>

        <div className="filter-stats">
          <span className="stat">Total: {filteredReports.length}</span>
          <span className="stat">Pending: {filteredReports.filter(r => r.status === "pending").length}</span>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading reports...</div>
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
                <th>Reported User</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
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
                  <td className="cell-reported-by">{report.reportedBy}</td>
                  <td className="cell-reported-user">
                    {report.reportedUserId.firstName} {report.reportedUserId.lastName}
                  </td>
                  <td className="cell-status">
                    <span className={`badge ${getStatusBadgeClass(report.status)}`}>
                      {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                    </span>
                  </td>
                  <td className="cell-date">{formatDate(report.date)}</td>
                  <td className="cell-actions">
                    <button className="btn btn-view">View</button>
                    <button className="btn btn-action">Action</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Reports;

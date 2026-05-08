import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import "./NotificationsPage.css";

const API_BASE_URL = "http://localhost:8000";

const getCategoryLabel = (type) => {
  if (type === "report") return "Report Alert";
  if (type === "warning") return "Warning Message";
  if (type === "message") return "Message";
  return "Notification";
};

const canViewReportNotification = (notification, currentUserId, currentUserRole) => {
  if (notification?.type !== "report") return true;

  const reporterId = notification?.data?.reportedByUserId || notification?.data?.reporterId;
  const message = (notification?.message || "").toLowerCase();

  // If an admin created the report, do not show the "new report submitted" alert back to that same admin.
  if (
    currentUserRole === "admin" &&
    currentUserId &&
    reporterId &&
    String(reporterId) === String(currentUserId) &&
    message.includes("a new report was submitted")
  ) {
    return false;
  }

  // Admins can view report alerts.
  if (currentUserRole === "admin") return true;

  const ownerId = notification?.data?.contentOwnerId;
  if (currentUserId && ownerId && String(ownerId) === String(currentUserId)) {
    return true;
  }

  // Fallback for old notifications without structured ids.
  if (message.includes("your material")) return true;

  // Everyone else should not see report alerts.
  return false;
};

const getFilterLabel = (filter) => {
  if (filter === "all") return "All";
  if (filter === "report") return "Reports";
  if (filter === "warning") return "Warnings";
  if (filter === "message") return "Messages";
  return "All";
};

const getTypeClassName = (type) => {
  if (type === "all") return "type-all";
  if (type === "report") return "type-report";
  if (type === "warning") return "type-warning";
  if (type === "message") return "type-message";
  return "type-default";
};

const isAdminDisplayName = (value) => String(value || "").trim().toLowerCase() === "admin";

export default function NotificationsPage() {
  const location = useLocation();
  const selectedNotificationId = location.state?.selectedNotificationId || null;

  const [notifications, setNotifications] = useState([]);
  const [selectedId, setSelectedId] = useState(selectedNotificationId);
  const [loading, setLoading] = useState(true);
  const [resolvedReporterName, setResolvedReporterName] = useState("");
  const [resolvedAdditionalDetails, setResolvedAdditionalDetails] = useState("");
  const [isReporterAdmin, setIsReporterAdmin] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [liveReportStatus] = useState("");

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  }, []);

  const userId = user?._id || user?.id;
  const userRole = user?.role || "student";
  const availableFilters = useMemo(
    () => (userRole === "admin" ? ["report"] : ["all", "report", "warning", "message"]),
    [userRole]
  );

  const filteredNotifications = useMemo(() => {
    const visibleNotifications = notifications.filter((item) =>
      canViewReportNotification(item, userId, userRole)
    );
    const sortedVisibleNotifications = [...visibleNotifications].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    if (activeFilter === "all") return sortedVisibleNotifications;
    if (activeFilter === "report" || activeFilter === "warning" || activeFilter === "message") {
      return sortedVisibleNotifications.filter((item) => item.type === activeFilter);
    }
    return sortedVisibleNotifications;
  }, [notifications, activeFilter, userId, userRole]);

  const selectedNotification = useMemo(() => {
    if (!filteredNotifications.length) return null;
    return (
      filteredNotifications.find((item) => item._id === selectedId) ||
      filteredNotifications[0]
    );
  }, [filteredNotifications, selectedId]);

  const isWarningFromAdmin = selectedNotification?.type === "warning";

  const fetchNotifications = async () => {
    try {
      if (!userId) return;
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/users/${userId}/notifications`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const list = data.notifications || [];
        setNotifications(list);

        if (!selectedId && list.length > 0) {
          setSelectedId(list[0]._id);
        }
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}/api/users/${userId}/notifications/${notificationId}/read`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        setNotifications((prev) =>
          prev.map((item) =>
            item._id === notificationId ? { ...item, isRead: true } : item
          )
        );
      }
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const onSelectNotification = async (item) => {
    setSelectedId(item._id);
    if (!item.isRead) {
      await markAsRead(item._id);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedNotificationId) {
      setSelectedId(selectedNotificationId);
    }
  }, [selectedNotificationId]);

  useEffect(() => {
    if (!filteredNotifications.length) return;
    const selectedStillVisible = filteredNotifications.some((item) => item._id === selectedId);
    if (!selectedStillVisible) {
      setSelectedId(filteredNotifications[0]._id);
    }
  }, [filteredNotifications, selectedId]);

  useEffect(() => {
    if (!availableFilters.includes(activeFilter)) {
      setActiveFilter(availableFilters[0]);
    }
  }, [activeFilter, availableFilters]);

  useEffect(() => {
    const resolveReporterName = async () => {
      setResolvedReporterName("");
      setResolvedAdditionalDetails("");
      setIsReporterAdmin(false);

      if (!selectedNotification || selectedNotification.type !== "report") return;

      const fromNotification = selectedNotification.data?.reportedBy;
      const fromNotificationDescription = selectedNotification.data?.description;
      const reporterUserId =
        selectedNotification.data?.reportedByUserId || selectedNotification.data?.reporterId;
      const isAdminLabel = String(fromNotification || "").trim().toLowerCase() === "admin";
      if (fromNotification) {
        setResolvedReporterName(fromNotification);
      }
      if (isAdminLabel) {
        setIsReporterAdmin(true);
      }

      if (fromNotificationDescription) {
        setResolvedAdditionalDetails(fromNotificationDescription);
      }

      try {
        const token = localStorage.getItem("token");
        if (reporterUserId) {
          const reporterResponse = await fetch(`${API_BASE_URL}/api/users/${reporterUserId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (reporterResponse.ok) {
            const reporterData = await reporterResponse.json();
            if (reporterData?.role === "admin") {
              setIsReporterAdmin(true);
              setResolvedReporterName("Admin");
            } else if (!fromNotification && reporterData?.fullName) {
              setResolvedReporterName(reporterData.fullName);
            }
          }
        }

        if (fromNotification && fromNotificationDescription) {
          return;
        }

        const reportId = selectedNotification.data?.reportId;
        if (!reportId) return;

        const response = await fetch(`${API_BASE_URL}/api/reports/${reportId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) return;

        const reportData = await response.json();
        const fallbackName =
          reportData?.data?.reportedByName || reportData?.data?.reportedBy || "";
        const fallbackDescription = reportData?.data?.description || "";
        if (!fromNotification && fallbackName) {
          setResolvedReporterName(fallbackName);
        }
        if (fallbackDescription) setResolvedAdditionalDetails(fallbackDescription);
      } catch (error) {
        console.error("Failed to resolve reporter name:", error);
      }
    };

    resolveReporterName();
  }, [selectedNotification]);

  return (
    <div className="notifications-page">
      <Navbar />

      <div className="notifications-shell">
        <div className="notifications-list-panel">
          <div className="notifications-panel-title">All Notifications</div>
          <div className="notifications-filters">
            {availableFilters.map((filter) => (
              <button
                key={filter}
                className={`notifications-filter-btn ${getTypeClassName(filter)} ${
                  activeFilter === filter ? "active" : ""
                }`}
                onClick={() => setActiveFilter(filter)}
              >
                {getFilterLabel(filter)}
              </button>
            ))}
          </div>
          {loading ? (
            <div className="notifications-empty">Loading notifications...</div>
          ) : filteredNotifications.length === 0 ? (
            <div className="notifications-empty">No notifications found</div>
          ) : (
            filteredNotifications.map((item) => (
              <button
                key={item._id}
                className={`notifications-list-item ${selectedNotification?._id === item._id ? "active" : ""}`}
                onClick={() => onSelectNotification(item)}
              >
                <div className="notifications-item-top">
                  <span className={`notifications-type ${getTypeClassName(item.type)}`}>
                    {getCategoryLabel(item.type)}
                  </span>
                  {!item.isRead && <span className="notifications-unread">Unread</span>}
                </div>
                <div className="notifications-item-message">{item.message}</div>
                <div className="notifications-item-time">
                  {new Date(item.createdAt).toLocaleString()}
                </div>
              </button>
            ))
          )}
        </div>

        <div className="notifications-detail-panel">
          <div className="notifications-panel-title">
            Notification Details - {getFilterLabel(activeFilter)}
          </div>

          {!selectedNotification ? (
            <div className="notifications-empty">Select a notification to view full details</div>
          ) : (
            <div className="notifications-details-card">
              <div className="notifications-row">
                <span>Category</span>
                <strong>{getCategoryLabel(selectedNotification.type)}</strong>
              </div>
              <div className="notifications-row">
                <span>Status</span>
                <strong>{selectedNotification.isRead ? "Read" : "Unread"}</strong>
              </div>
              <div className="notifications-row">
                <span>Time</span>
                <strong>{new Date(selectedNotification.createdAt).toLocaleString()}</strong>
              </div>
              <div className="notifications-row block">
                <span>Main Message</span>
                <strong>{selectedNotification.message}</strong>
              </div>

              {selectedNotification.data?.sentByName && (
                <div className="notifications-row">
                  <span>From</span>
                  {/*
                    Warnings are generated by admins in the current flow.
                    Always normalize sender display for warning notifications.
                  */}
                  <strong
                    className={
                      isWarningFromAdmin || isAdminDisplayName(selectedNotification.data.sentByName)
                        ? "notifications-admin-reporter"
                        : ""
                    }
                  >
                    {isWarningFromAdmin ||
                    isAdminDisplayName(selectedNotification.data.sentByName)
                      ? "Admin"
                      : selectedNotification.data.sentByName}
                  </strong>
                </div>
              )}

              {(selectedNotification.data?.reportedBy || resolvedReporterName) && (
                <div className="notifications-row block">
                  <span>Who Reported</span>
                  <strong className={isReporterAdmin ? "notifications-admin-reporter" : ""}>
                    {isReporterAdmin
                      ? "Admin"
                      : selectedNotification.data?.reportedBy || resolvedReporterName}
                  </strong>
                </div>
              )}

              {selectedNotification.data?.reason && (
                <div className="notifications-row block">
                  <span>Reason / Category</span>
                  <strong>{selectedNotification.data.reason}</strong>
                </div>
              )}

              {(selectedNotification.data?.description || resolvedAdditionalDetails) && (
                <div className="notifications-row block">
                  <span>Additional Details</span>
                  <strong>
                    {selectedNotification.data?.description || resolvedAdditionalDetails}
                  </strong>
                </div>
              )}

              {selectedNotification.data?.fullMessage && (
                <div className="notifications-row block">
                  <span>Warning Full Message</span>
                  <strong>{selectedNotification.data.fullMessage}</strong>
                </div>
              )}

              {selectedNotification.data?.contentType && (
                <div className="notifications-row">
                  <span>Content Type</span>
                  <strong>{selectedNotification.data.contentType}</strong>
                </div>
              )}

              {selectedNotification.data?.status && (
                <div className="notifications-row">
                  <span>Report Status</span>
                  <strong>{liveReportStatus || selectedNotification.data.status}</strong>
                </div>
              )}

              {selectedNotification.data?.reportId && (
                <div className="notifications-row">
                  <span>Report ID</span>
                  <strong>{selectedNotification.data.reportId}</strong>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

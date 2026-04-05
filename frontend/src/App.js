import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// ── Pages ──────────────────────────────────────────────────────────────────
import ResourceDashboard from "./pages/Resource_Dashboard/Resource_Dashboard";
import Home              from "./pages/Home/Home";
import QuizPage          from "./pages/Quiz/Quiz";
import Library           from "./pages/Library/Library";
import Kuppi             from "./pages/Kuppi/Meeting";
import Meeting           from "./pages/Kuppi/Meeting";
import Createmeeting     from "./pages/Kuppi/Createmeeting";
import SavedSessions     from "./pages/Kuppi/SavedSessions";
import UploadNotes       from "./pages/Library/UploadPdf";
import Feedback          from "./pages/Feedback/Feedback";
import Forum             from "./pages/Forum/Forum";
import ForumThread       from "./pages/Forum/ForumThread";
import About             from "./pages/About/About";

// ── User Management ────────────────────────────────────────────────────────
import Register       from "./pages/UserManagement/Register";
import Login          from "./pages/UserManagement/Login";
import ForgotPassword from "./pages/UserManagement/ForgotPassword";
import ResetPassword  from "./pages/UserManagement/ResetPassword";
import AdminUsers     from "./pages/UserManagement/AdminUsers";
import EditProfile    from "./pages/UserManagement/EditProfile";
import Profile        from "./pages/UserManagement/Profile";
import ChangePassword from "./pages/UserManagement/ChangePassword";

// ── Auth guard ────────────────────────────────────────────────────────────
import ProtectedRoute from "./components/ProtectedRoute";

// ── Shared layout components (not routed directly) ────────────────────────
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {
  return (
    <Router>
      <Routes>

        {/* ── PUBLIC routes — accessible without login ───────────────── */}
        <Route path="/login"          element={<Login />} />
        <Route path="/Login"          element={<Login />} />          {/* alias */}
        <Route path="/register"       element={<Register />} />
        <Route path="/Register"       element={<Register />} />       {/* alias */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/ForgotPassword" element={<ForgotPassword />} /> {/* alias */}
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/ResetPassword" element={<ResetPassword />} />   {/* alias */}

        {/* Redirect bare root to home (ProtectedRoute inside Home handles the rest) */}
        <Route path="/" element={
          
            <Home />
          
        } />

        {/* ── PROTECTED routes — require a logged-in user ────────────── */}

        {/* Core pages */}
        <Route path="/home" element={
          <ProtectedRoute><Home /></ProtectedRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute><ResourceDashboard /></ProtectedRoute>
        } />

        {/* Learning */}
        <Route path="/library" element={
          <ProtectedRoute><Library /></ProtectedRoute>
        } />
        <Route path="/upload" element={
          <ProtectedRoute><UploadNotes /></ProtectedRoute>
        } />
        <Route path="/quiz" element={
          <ProtectedRoute><QuizPage /></ProtectedRoute>
        } />
        <Route path="/quizzes" element={
          <ProtectedRoute><QuizPage /></ProtectedRoute>
        } />

        {/* Kuppi / Meetings */}
        <Route path="/Kuppi" element={
          <ProtectedRoute><Kuppi /></ProtectedRoute>
        } />
        <Route path="/Meeting" element={
          <ProtectedRoute><Meeting /></ProtectedRoute>
        } />
        <Route path="/Createmeeting" element={
          <ProtectedRoute><Createmeeting /></ProtectedRoute>
        } />
        <Route path="/saved-sessions" element={
          <ProtectedRoute><SavedSessions /></ProtectedRoute>
        } />

        {/* Community */}
        <Route path="/forum" element={
          <ProtectedRoute><Forum /></ProtectedRoute>
        } />
        <Route path="/forum/:id" element={
          <ProtectedRoute><ForumThread /></ProtectedRoute>
        } />
        <Route path="/Feedback" element={
          <ProtectedRoute><Feedback /></ProtectedRoute>
        } />
        <Route path="/About" element={
          <ProtectedRoute><About /></ProtectedRoute>
        } />
        <Route path="/about" element={
          <ProtectedRoute><About /></ProtectedRoute>
        } />

        {/* User account */}
        <Route path="/Profile" element={
          <ProtectedRoute><Profile /></ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute><Profile /></ProtectedRoute>
        } />
        <Route path="/EditProfile" element={
          <ProtectedRoute><EditProfile /></ProtectedRoute>
        } />
        <Route path="/edit-profile" element={
          <ProtectedRoute><EditProfile /></ProtectedRoute>
        } />
        <Route path="/ChangePassword" element={
          <ProtectedRoute><ChangePassword /></ProtectedRoute>
        } />
        <Route path="/change-password" element={
          <ProtectedRoute><ChangePassword /></ProtectedRoute>
        } />

        {/* Admin — protected + only admin role can reach this in practice */}
        <Route path="/AdminUsers" element={
          <ProtectedRoute><AdminUsers /></ProtectedRoute>
        } />
        <Route path="/admin" element={
          <ProtectedRoute><AdminUsers /></ProtectedRoute>
        } />

        {/* ── Layout-only routes removed (Navbar/Footer aren't pages) ── */}
        {/* Catch-all: unknown URLs → redirect to home (which checks auth) */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </Router>
  );
}

export default App;
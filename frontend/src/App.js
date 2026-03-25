import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ResourceDashboard from "./pages/Resource_Dashboard/Resource_Dashboard";
import Home from "./pages/Home/Home";
import QuizPage from "./pages/Quiz/Quiz";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Library from "./pages/Library/Library";
import Kuppi from "./pages/Kuppi/Meeting";
import Meeting from "./pages/Kuppi/Meeting";
import Createmeeting from "./pages/Kuppi/Createmeeting";

import Register  from "./pages/UserManagement/Register";
import Login from './pages/UserManagement/Login';
import ForgotPassword from "./pages/UserManagement/ForgotPassword"; 
import UploadNotes from "./pages/Library/UploadPdf";
import Feedback from "./pages/Feedback/Feedback";
import Forum from "./pages/Forum/Forum"
import About from "./pages/About/About";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/dashboard" element={<ResourceDashboard />} />
        <Route path="/" element={<Home />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/Navbar" element={<Navbar />} />
        <Route path="/Footer" element={<Footer />} />
        <Route path="/library" element={<Library />} />
        <Route path="/Kuppi" element={<Kuppi />} />
        <Route path="/Meeting" element={<Meeting />} />
        <Route path="/Createmeeting" element={<Createmeeting />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/Login" element={<Login />} />
         <Route path="/ForgotPassword" element={<ForgotPassword />} />
         <Route path="/Feedback" element={<Feedback/>} />
        <Route path="/About" element={<About/>} />

        <Route path="/forum" element={<Forum />} />

        <Route path="/upload" element={<UploadNotes />} />
      </Routes>
    </Router>
  );
}

export default App;
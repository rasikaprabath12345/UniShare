import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ResourceDashboard from "./pages/Resource_Dashboard/Resource_Dashboard";
import Home from "./pages/Home/Home";
import QuizPage from "./pages/Quiz/QuizPage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Library from "./pages/Library/Library";
import UploadNotes from "./pages/Library/UploadPdf";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ResourceDashboard />} />
        <Route path="/dashboard" element={<ResourceDashboard />} />
        <Route path="/home" element={<Home />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/Navbar" element={<Navbar />} />
        <Route path="/Footer" element={<Footer />} />
        <Route path="/library" element={<Library />} />
        <Route path="/upload" element={<UploadNotes />} />
      </Routes>
    </Router>
    
  );
}

export default App;
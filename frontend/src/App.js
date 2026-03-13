import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Resource_Dashboard from "./pages/Resource_Dashboard/Resource_Dashboard";
import Home from "./pages/Home/Home";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Resource_Dashboard />} />
        <Route path="/dashboard" element={<Resource_Dashboard />} />
        <Route path="/home" element={<Home />} />
        {/* <Route path="/quiz" element={<QuizPage />} /> */}




      </Routes>
    </Router>
  );
}

export default App;
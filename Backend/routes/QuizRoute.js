const express = require("express");
const router  = express.Router();

const {
  generateQuiz,
  submitQuiz,
  getMyQuizzes,
  getQuizById,
  getAllQuizzes // ✅ ADD THIS
} = require("../controllers/QuizController");

// POST  /quiz/generate → generate quiz
router.post("/generate", generateQuiz);

// POST  /quiz/submit → submit answers
router.post("/submit", submitQuiz);

// GET   /quiz/my → current user quiz history
router.get("/my", getMyQuizzes);

// ✅ GET ALL QUIZZES (optional / admin / debug)
router.get("/all", getAllQuizzes);

// GET   /quiz/:id → single quiz
router.get("/:id", getQuizById);

module.exports = router;
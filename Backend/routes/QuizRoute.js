const express = require("express");
const router  = express.Router();
const {
  generateQuiz,
  submitQuiz,
  getMyQuizzes,
  getQuizById,
} = require("../controllers/QuizController");

// POST  /quiz/generate   → generate 20 MCQs from a PDF material
router.post("/generate", generateQuiz);

// POST  /quiz/submit     → submit answers, get score + grade
router.post("/submit",   submitQuiz);

// GET   /quiz/my         → all submitted quiz results (My Quiz)
router.get ("/my",       getMyQuizzes);

// GET   /quiz/:id        → single quiz detail
router.get ("/:id",      getQuizById);

module.exports = router;
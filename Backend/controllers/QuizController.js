const fs       = require("fs");
const path     = require("path");
const https    = require("https");
const pdfParse = require("pdf-parse");
const Material = require("../models/Material");
const Quiz     = require("../models/Quiz");

// ── Grade helper ─────────────────────────────────────────────
const calcGrade = (pct) => {
  if (pct >= 90) return "A+";
  if (pct >= 80) return "A";
  if (pct >= 70) return "B";
  if (pct >= 60) return "C";
  if (pct >= 50) return "D";
  return "F";
};

const jsonError = (res, status, message) =>
  res.status(status).json({ success: false, message });

// ── Groq Call ────────────────────────────────────────────────
function callGroq(apiKey, messages) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      model: "llama-3.3-70b-versatile",
      temperature: 0.3,
      max_tokens: 4096,
      messages,
    });

    const options = {
      hostname: "api.groq.com",
      path: "/openai/v1/chat/completions",
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(body),
      },
    };

    const req = https.request(options, (groqRes) => {
      let data = "";
      groqRes.on("data", (chunk) => (data += chunk));
      groqRes.on("end", () => {
        try {
          const parsed = JSON.parse(data);
          if (groqRes.statusCode !== 200) {
            reject(
              new Error(parsed.error?.message || "Groq API error")
            );
          } else resolve(parsed);
        } catch {
          reject(new Error("Invalid Groq response"));
        }
      });
    });

    req.on("error", (e) => reject(e));
    req.write(body);
    req.end();
  });
}

// ── GENERATE QUIZ ─────────────────────────────────────────────
const generateQuiz = async (req, res) => {
  try {
    const { materialId, userId } = req.body;

    if (!materialId) return jsonError(res, 400, "materialId required");
    if (!userId) return jsonError(res, 400, "userId required");

    const material = await Material.findById(materialId);
    if (!material) return jsonError(res, 404, "Material not found");

    // Get PDF from Cloudinary URL instead of local filesystem
    const pdfUrl = material.fileUrl;
    if (!pdfUrl) {
      return jsonError(res, 404, "PDF URL not found");
    }

    // Fetch PDF from Cloudinary using https
    let buffer;
    try {
      buffer = await new Promise((resolve, reject) => {
        https.get(pdfUrl, (response) => {
          const chunks = [];
          response.on('data', (chunk) => chunks.push(chunk));
          response.on('end', () => resolve(Buffer.concat(chunks)));
          response.on('error', reject);
        }).on('error', reject);
      });
    } catch (err) {
      return jsonError(res, 500, `Failed to fetch PDF: ${err.message}`);
    }

    const data = await pdfParse(buffer);
    const pdfText = (data.text || "").slice(0, 6000).trim();

    if (pdfText.length < 50) {
      return jsonError(res, 400, "Not enough content in PDF");
    }

const prompt = `
You are an API that returns ONLY valid JSON.

Generate EXACTLY 20 multiple choice questions from the content below.

Return ONLY a JSON array. No explanations outside JSON. No markdown.

FORMAT STRICTLY:

[
  {
    "question": "What is ...?",
    "options": ["A", "B", "C", "D"],
    "correct": 0,
    "explanation": "Short explanation"
  }
]

RULES:
- MUST be valid JSON
- options MUST be exactly 4
- correct MUST be 0,1,2 or 3
- DO NOT include text before or after JSON
- DO NOT use markdown

CONTENT:
${pdfText}
`;

    const groqData = await callGroq(process.env.GROQ_API_KEY, [
      { role: "system", content: "Return JSON only." },
      { role: "user", content: prompt },
    ]);

    const raw = groqData.choices?.[0]?.message?.content || "";

const cleaned = raw
  .replace(/```json/gi, "")
  .replace(/```/g, "")
  .replace(/^[^[\]]*/, "") // remove text before [
  .replace(/[^\]]*$/, "") // remove text after ]
  .trim();

  console.log("RAW AI:\n", raw);
console.log("CLEANED AI:\n", cleaned);

    let questions;
    try {
      questions = JSON.parse(cleaned);
    } catch {
      return jsonError(res, 500, "AI response parsing failed");
    }

const valid = questions
  .map((q) => ({
    question: q.question || "",
    options: Array.isArray(q.options) ? q.options.slice(0, 4) : [],
    correct: Number(q.correct),
    explanation: q.explanation || ""
  }))
  .filter(q =>
    q.question &&
    q.options.length === 4 &&
    !isNaN(q.correct) &&
    q.correct >= 0 &&
    q.correct < 4
  );

    if (valid.length === 0) {
      return jsonError(res, 500, "No valid questions generated");
    }

    const quiz = await Quiz.create({
      user: userId,
      material: material._id,
      materialTitle: material.title,
      questions: valid.slice(0, 20),
      total: Math.min(valid.length, 20), // ✅ FIXED
    });

    return res.status(201).json({ success: true, data: quiz });

  } catch (err) {
    return jsonError(res, 500, err.message);
  }
};

// ── SUBMIT QUIZ ─────────────────────────────────────────────
const submitQuiz = async (req, res) => {
  try {
    const { quizId, answers, timeTaken, userId } = req.body;

    if (!userId) return jsonError(res, 400, "userId required");
    if (!quizId) return jsonError(res, 400, "quizId required");
    if (!Array.isArray(answers)) return jsonError(res, 400, "answers must be array");

    const quiz = await Quiz.findById(quizId);
    if (!quiz) return jsonError(res, 404, "Quiz not found");

    if (quiz.user.toString() !== userId) {
      return jsonError(res, 403, "Access denied");
    }

    if (quiz.submitted) {
      return jsonError(res, 400, "Already submitted");
    }

    if (answers.length !== quiz.questions.length) {
      return jsonError(res, 400, "Answers count mismatch");
    }

    let score = 0;

    quiz.questions.forEach((q, i) => {
      if (answers[i] === q.correct) score++;
    });

    const percentage = Math.round((score / quiz.total) * 100);

    quiz.answers = answers;
    quiz.score = score;
    quiz.percentage = percentage;
    quiz.grade = calcGrade(percentage);
    quiz.timeTaken = timeTaken || 0;
    quiz.submitted = true;

    await quiz.save();

    return res.json({ success: true, data: quiz });

  } catch (err) {
    return jsonError(res, 500, err.message);
  }
};

// ── GET MY QUIZZES ───────────────────────────────────────────
const getMyQuizzes = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) return jsonError(res, 400, "userId required");

    const quizzes = await Quiz.find({
      user: userId,
      submitted: true,
    })
      .sort({ createdAt: -1 })
      .select("materialTitle score total percentage grade timeTaken createdAt");

    return res.json({ success: true, data: quizzes });

  } catch (err) {
    return jsonError(res, 500, err.message);
  }
};

// ── GET QUIZ BY ID ───────────────────────────────────────────
const getQuizById = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) return jsonError(res, 400, "userId required");

    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return jsonError(res, 404, "Quiz not found");

    if (quiz.user.toString() !== userId) {
      return jsonError(res, 403, "Access denied");
    }

    return res.json({ success: true, data: quiz });

  } catch (err) {
    return jsonError(res, 500, err.message);
  }
};

// ── GET ALL QUIZZES ──────────────────────────────────────────
const getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    return res.json({ success: true, data: quizzes });

  } catch (err) {
    return jsonError(res, 500, err.message);
  }
};

module.exports = {
  generateQuiz,
  submitQuiz,
  getMyQuizzes,
  getQuizById,
  getAllQuizzes,
};
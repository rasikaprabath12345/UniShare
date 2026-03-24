const fs       = require("fs");
const path     = require("path");
const https    = require("https");
const pdfParse = require("pdf-parse"); // ← top-level require, not inside function
const Material = require("../models/Material");
const Quiz     = require("../models/Quiz");

// ── Grade helper ──────────────────────────────────────────────────────────────
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

// ── Call Groq using Node built-in https (no axios/fetch needed) ───────────────
function callGroq(apiKey, messages) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      model:       "llama-3.3-70b-versatile",
      temperature: 0.3,
      max_tokens:  4096,
      messages,
    });

    const options = {
      hostname: "api.groq.com",
      path:     "/openai/v1/chat/completions",
      method:   "POST",
      headers: {
        "Authorization":  `Bearer ${apiKey}`,
        "Content-Type":   "application/json",
        "Content-Length": Buffer.byteLength(body),
      },
    };

    const req = https.request(options, (groqRes) => {
      let data = "";
      groqRes.on("data", (chunk) => { data += chunk; });
      groqRes.on("end", () => {
        try {
          const parsed = JSON.parse(data);
          if (groqRes.statusCode !== 200) {
            reject(new Error(`Groq ${groqRes.statusCode}: ${parsed.error?.message || data.slice(0, 200)}`));
          } else {
            resolve(parsed);
          }
        } catch (e) {
          reject(new Error(`Could not parse Groq response: ${data.slice(0, 100)}`));
        }
      });
    });

    req.on("error", (e) => reject(new Error(`Groq request error: ${e.message}`)));
    req.write(body);
    req.end();
  });
}

// ── POST /quiz/generate ───────────────────────────────────────────────────────
const generateQuiz = async (req, res) => {
  try {
    if (!process.env.GROQ_API_KEY) {
      return jsonError(res, 500, "GROQ_API_KEY is not set in server.js");
    }

    const { materialId } = req.body;
    if (!materialId) return jsonError(res, 400, "materialId is required");

    const material = await Material.findById(materialId);
    if (!material)  return jsonError(res, 404, "Material not found");

    // ── Read PDF file ─────────────────────────────────────────────────────────
    const filename = material.fileUrl.split("/uploads/")[1];
    const filePath = path.join("uploads", filename);

    if (!fs.existsSync(filePath)) {
      return jsonError(res, 404, `PDF not found on server: ${filename}`);
    }

    let pdfText = "";
    try {
      const buffer = fs.readFileSync(filePath);
      const data   = await pdfParse(buffer);
      pdfText      = (data.text || "").slice(0, 6000).trim();
    } catch (e) {
      return jsonError(res, 500, `PDF read error: ${e.message}`);
    }

    if (pdfText.length < 80) {
      return jsonError(res, 422,
        "Not enough text extracted from PDF. Please upload a text-based PDF (not a scanned image)."
      );
    }

    // ── Call Groq ─────────────────────────────────────────────────────────────
    const prompt = `You are a university exam question generator.
Based ONLY on the study material below, generate exactly 20 multiple choice questions.

RULES:
- Each question has exactly 4 options
- "correct" is the 0-based index (0,1,2,3) of the correct answer
- Add a short explanation per question
- Mix: 7 easy, 8 medium, 5 hard
- Return ONLY a JSON array. No markdown. No extra text.

Format:
[{"question":"...","options":["A","B","C","D"],"correct":0,"explanation":"..."}]

Study Material:
${pdfText}`;

    let groqData;
    try {
      groqData = await callGroq(process.env.GROQ_API_KEY, [
        {
          role:    "system",
          content: "You are a JSON-only API. Output a valid JSON array only. No markdown, no extra text.",
        },
        { role: "user", content: prompt },
      ]);
    } catch (e) {
      return jsonError(res, 502, `Groq API error: ${e.message}`);
    }

    // ── Parse questions ───────────────────────────────────────────────────────
    const rawText = groqData.choices?.[0]?.message?.content?.trim() || "";
    const cleaned = rawText
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i,     "")
      .replace(/\s*```$/i,     "")
      .trim();

    let questions = [];
    try {
      questions = JSON.parse(cleaned);
    } catch {
      return jsonError(res, 500,
        `AI returned invalid JSON. Preview: ${cleaned.slice(0, 150)}`
      );
    }

    if (!Array.isArray(questions) || questions.length === 0) {
      return jsonError(res, 500, "AI returned empty question list. Try again.");
    }

    const valid = questions.filter(
      (q) =>
        q.question &&
        Array.isArray(q.options) &&
        q.options.length === 4 &&
        typeof q.correct === "number"
    );

    if (valid.length < 5) {
      return jsonError(res, 500,
        `Only ${valid.length} valid questions generated. Try again.`
      );
    }

    const quiz = await Quiz.create({
      material:      material._id,
      materialTitle: material.title,
      questions:     valid.slice(0, 20),
      total:         Math.min(valid.length, 20),
    });

    return res.status(201).json({ success: true, data: quiz });

  } catch (err) {
    console.error("generateQuiz error:", err);
    return jsonError(res, 500, err.message || "Unexpected server error");
  }
};

// ── POST /quiz/submit ─────────────────────────────────────────────────────────
const submitQuiz = async (req, res) => {
  try {
    const { quizId, answers, timeTaken } = req.body;
    if (!quizId || !Array.isArray(answers)) {
      return jsonError(res, 400, "quizId and answers array are required");
    }

    const quiz = await Quiz.findById(quizId);
    if (!quiz)          return jsonError(res, 404, "Quiz not found");
    if (quiz.submitted) return jsonError(res, 400, "Quiz already submitted");

    let score = 0;
    quiz.questions.forEach((q, i) => {
      if (answers[i] === q.correct) score++;
    });

    const percentage    = Math.round((score / quiz.total) * 100);
    quiz.answers        = answers;
    quiz.score          = score;
    quiz.percentage     = percentage;
    quiz.grade          = calcGrade(percentage);
    quiz.timeTaken      = timeTaken || null;
    quiz.submitted      = true;
    await quiz.save();

    return res.json({ success: true, data: quiz });
  } catch (err) {
    return jsonError(res, 500, err.message);
  }
};

// ── GET /quiz/my ──────────────────────────────────────────────────────────────
const getMyQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ submitted: true })
      .sort({ createdAt: -1 })
      .select("materialTitle score total percentage grade timeTaken createdAt");
    return res.json({ success: true, data: quizzes });
  } catch (err) {
    return jsonError(res, 500, err.message);
  }
};

// ── GET /quiz/:id ─────────────────────────────────────────────────────────────
const getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return jsonError(res, 404, "Quiz not found");
    return res.json({ success: true, data: quiz });
  } catch (err) {
    return jsonError(res, 500, err.message);
  }
};

module.exports = { generateQuiz, submitQuiz, getMyQuizzes, getQuizById };
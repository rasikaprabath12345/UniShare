const fs = require("fs");
const Material = require("../models/Material");

// ── POST /Materials ── Upload PDF + save record
const createMaterial = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "PDF file is required",
      });
    }

    const {
      userId, // ✅ get from frontend
      title,
      module,
      year,
      description,
      tags,
      visibility,
    } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    // Parse tags
    let parsedTags = [];
    if (tags) {
      try {
        parsedTags = JSON.parse(tags);
      } catch {
        parsedTags = Array.isArray(tags) ? tags : [tags];
      }
    }

    const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

    const material = await Material.create({
      user: userId, // ✅ manually assign
      title,
      module,
      year,
      description,
      tags: parsedTags,
      visibility: visibility || "public",
      fileUrl,
      fileName: req.file.originalname,
      fileSize: req.file.size,
    });

    res.status(201).json({
      success: true,
      data: material,
    });

  } catch (err) {
    if (req.file) fs.unlink(req.file.path, () => {});
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ── GET /Materials ── List materials
const getMaterials = async (req, res) => {
  try {
    const { module, year, search, page = 1, limit = 12, userId } = req.query;

    const filter = {};

    // ✅ FIX: allow private notes for owner
    if (userId) {
      filter.$or = [
        { visibility: "public" },
        { user: userId }
      ];
    } else {
      filter.visibility = "public";
    }

    if (module) filter.module = module;
    if (year) filter.year = year;

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const total = await Material.countDocuments(filter);

    const items = await Material.find(filter)
      .populate("user", "fullName email _id")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    // DEBUG: Log what we're returning
    if (items && items.length > 0) {
      console.log("📚 getMaterials returned", items.length, "items");
      console.log("First item user data:", items[0].user);
    }

    res.json({
      success: true,
      data: items,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit)),
      },
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET /Materials/:id ── Single material
const getMaterialById = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id)
      .populate("user", "fullName email _id");

    if (!material) {
      return res.status(404).json({
        success: false,
        message: "Material not found",
      });
    }

    res.json({
      success: true,
      data: material,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ── DELETE /Materials/:id ── simple delete (no auth)
const deleteMaterial = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);

    if (!material) {
      return res.status(404).json({
        success: false,
        message: "Material not found",
      });
    }

    // ❗ NO SECURITY (anyone can delete)
    const filename = material.fileUrl.split("/uploads/")[1];
    if (filename) {
      fs.unlink(`uploads/${filename}`, () => {});
    }

    await material.deleteOne();

    res.json({
      success: true,
      message: "Material deleted successfully",
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  createMaterial,
  getMaterials,
  getMaterialById,
  deleteMaterial,
};
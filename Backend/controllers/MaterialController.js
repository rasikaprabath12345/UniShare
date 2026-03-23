const fs       = require("fs");
const Material = require("../models/Material");

// ── POST /Materials ── Upload PDF + save record
const createMaterial = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "PDF file is required" });
    }

    const { title, module, year, description, tags, visibility } = req.body;

    // tags comes as a JSON string from FormData
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
      title,
      module,
      year,
      description,
      tags:       parsedTags,
      visibility: visibility || "public",
      fileUrl,
      fileName:   req.file.originalname,
      fileSize:   req.file.size,
    });

    res.status(201).json({ success: true, data: material });
  } catch (err) {
    // Remove uploaded file if DB save fails
    if (req.file) fs.unlink(req.file.path, () => {});
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET /Materials ── List materials (filter + search + pagination)
const getMaterials = async (req, res) => {
  try {
    const { module, year, search, page = 1, limit = 12 } = req.query;

    const filter = {};

    // Only show public notes unless fetching all (add auth later if needed)
    filter.visibility = "public";

    if (module) filter.module = module;
    if (year)   filter.year   = year;
    if (search) {
      filter.$or = [
        { title:       { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags:        { $regex: search, $options: "i" } },
      ];
    }

    const skip  = (Number(page) - 1) * Number(limit);
    const total = await Material.countDocuments(filter);
    const items = await Material.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.json({
      success: true,
      data: items,
      pagination: {
        total,
        page:  Number(page),
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
    const material = await Material.findById(req.params.id);
    if (!material) {
      return res.status(404).json({ success: false, message: "Material not found" });
    }
    res.json({ success: true, data: material });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── DELETE /Materials/:id ── Delete record + file from disk
const deleteMaterial = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);
    if (!material) {
      return res.status(404).json({ success: false, message: "Material not found" });
    }

    // Extract filename from stored URL and remove from disk
    const filename = material.fileUrl.split("/uploads/")[1];
    if (filename) {
      fs.unlink(`uploads/${filename}`, () => {});
    }

    await material.deleteOne();
    res.json({ success: true, message: "Material deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { createMaterial, getMaterials, getMaterialById, deleteMaterial };
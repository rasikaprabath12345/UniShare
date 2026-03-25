const Forum = require("../models/Forum");

// Create Post
const createPost = async (req, res) => {
  try {
    const post = await Forum.create(req.body);

    res.status(201).json({
      success: true,
      data: post,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Posts
const getPosts = async (req, res) => {
  try {
    const { search, category, sort } = req.query;

    let query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { body: { $regex: search, $options: "i" } },
      ];
    }

    if (category && category !== "All") {
      query.category = category;
    }

    let sortOption = { createdAt: -1 };

    if (sort === "popular") {
      sortOption = { likes: -1 };
    }

    if (sort === "trending") {
      sortOption = { views: -1 };
    }

    const posts = await Forum.find(query).sort(sortOption);

    res.json({
      success: true,
      data: posts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Single Post
const getPostById = async (req, res) => {
  try {
    const post = await Forum.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    post.views += 1;
    await post.save();

    res.json({
      success: true,
      data: post,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Post
const updatePost = async (req, res) => {
  try {
    const post = await Forum.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({
      success: true,
      data: post,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Post
const deletePost = async (req, res) => {
  try {
    await Forum.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Deleted Successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
};
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

    // Ensure all posts have reactions and comments arrays initialized
    const normalizedPosts = posts.map(post => {
      const postObj = post.toObject();
      if (!postObj.reactions) postObj.reactions = [];
      if (!postObj.comments) postObj.comments = [];
      return postObj;
    });

    // Calculate category counts
    const allPosts = await Forum.find({});
    const categoryCounts = {};
    allPosts.forEach(post => {
      if (post.category) {
        categoryCounts[post.category] = (categoryCounts[post.category] || 0) + 1;
      }
    });

    res.json({
      success: true,
      data: normalizedPosts,
      categoryCounts,
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

    // Ensure reactions and comments are initialized
    const postObj = post.toObject();
    if (!postObj.reactions) postObj.reactions = [];
    if (!postObj.comments) postObj.comments = [];

    res.json({
      success: true,
      data: postObj,
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

// Add Reaction
const addReaction = async (req, res) => {
  try {
    const { userId, userName, type } = req.body;
    const post = await Forum.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Initialize reactions array if it doesn't exist
    if (!post.reactions) {
      post.reactions = [];
    }

    // Check if user already reacted
    const existingReactionIndex = post.reactions.findIndex(r => r.userId === userId);

    if (existingReactionIndex !== -1) {
      // Update reaction type if different
      if (post.reactions[existingReactionIndex].type !== type) {
        post.reactions[existingReactionIndex].type = type;
      } else {
        // Remove reaction if same type
        post.reactions.splice(existingReactionIndex, 1);
      }
    } else {
      // Add new reaction
      post.reactions.push({ userId, userName, type });
    }

    post.likes = post.reactions.length;
    await post.save();

    // Return normalized object
    const postObj = post.toObject();
    if (!postObj.reactions) postObj.reactions = [];
    if (!postObj.comments) postObj.comments = [];

    res.json({
      success: true,
      data: postObj,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Add Comment
const addComment = async (req, res) => {
  try {
    const { authorName, authorYear, content } = req.body;
    const post = await Forum.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Initialize comments array if it doesn't exist
    if (!post.comments) {
      post.comments = [];
    }

    post.comments.push({
      authorName,
      authorYear,
      content,
    });

    post.replies = post.comments.length;
    await post.save();

    // Return normalized object
    const postObj = post.toObject();
    if (!postObj.reactions) postObj.reactions = [];
    if (!postObj.comments) postObj.comments = [];

    res.json({
      success: true,
      data: postObj,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Comments
const getComments = async (req, res) => {
  try {
    const post = await Forum.findById(req.params.id).select('comments');

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    res.json({
      success: true,
      data: post.comments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Comment
const deleteComment = async (req, res) => {
  try {
    const { id, commentId } = req.params;
    const post = await Forum.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Initialize comments array if it doesn't exist
    if (!post.comments) {
      post.comments = [];
    }

    // Find and remove the comment
    const commentIndex = post.comments.findIndex(c => c._id.toString() === commentId);

    if (commentIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    post.comments.splice(commentIndex, 1);
    post.replies = post.comments.length;
    await post.save();

    // Return normalized object
    const postObj = post.toObject();
    if (!postObj.reactions) postObj.reactions = [];
    if (!postObj.comments) postObj.comments = [];

    res.json({
      success: true,
      message: "Comment deleted successfully",
      data: postObj,
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
  addReaction,
  addComment,
  getComments,
  deleteComment,
};
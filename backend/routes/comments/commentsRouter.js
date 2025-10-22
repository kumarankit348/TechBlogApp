const express = require("express");
const {
  createComment,
  deleteComment,
  updateComment,
} = require("../../controllers/comments/commentsController");
const isLoggedin = require("../../middlewares/isLoggedin");

const commentsRouter = express.Router();

// Set up the route to create a new comment
commentsRouter.post("/:postId", isLoggedin, createComment);

// Set up the route to delete a comment
commentsRouter.delete("/:commentId", isLoggedin, deleteComment);

// Set up the route to update a comment
commentsRouter.put("/:commentId", isLoggedin, updateComment);

module.exports = commentsRouter;

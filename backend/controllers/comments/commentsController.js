const asyncHandler = require("express-async-handler");
const Post = require("../../models/Posts/Post");
const Comment = require("../../models/Comments/comment");

// @desc    Create a new comment
// @route   POST /api/v1/comments/:postId
// @access  Private

exports.createComment = asyncHandler(async (req, res) => {
  //   Get the payload from the request body
  const { message } = req.body;

  //   get the postId from the request parameters
  const postId = req.params.postId;

  //   create a new comment
  const comment = await Comment.create({
    message,
    author: req?.userAuth?._id,
    postId,
  });

  //   Associate the comment with the post
  await Post.findByIdAndUpdate(
    postId,
    {
      $push: { comments: comment._id },
    },
    { new: true }
  );

  res.status(201).json({
    status: "success",
    message: "Comment created successfully",
    comment,
  });
});

// @desc    Delete a comment
// @route   DELETE /api/v1/comments/:commentId
// @access  Private

exports.deleteComment = asyncHandler(async (req, res) => {
  //   Get the commentId from the request parameters
  const commentId = req.params.commentId;

  //   Find the comment and delete it
  await Comment.findByIdAndDelete(commentId);

  res.status(201).json({
    status: "success",
    message: "Comment deleted successfully",
  });
});

// @desc    Update a comment
// @route   PUT /api/v1/comments/:commentId
// @access  Private

exports.updateComment = asyncHandler(async (req, res) => {
  //   Get the commentId from the request parameters
  const commentId = req.params.commentId;

  //   !get message
  const message = req.body.message;

  //   Find the comment and update it
  const updatedComment = await Comment.findByIdAndUpdate(
    commentId,
    { message },
    { new: true, runValidators: true }
  );

  console.log("CommentId:", commentId);
  const comment = await Comment.findById(commentId);
  console.log("Found comment:", comment);

  if (!updatedComment) {
    return res.status(404).json({
      status: "fail",
      message: "Comment not found",
    });
  }

  res.status(201).json({
    status: "success",
    message: "Comment updated successfully",
    updatedComment,
  });
});

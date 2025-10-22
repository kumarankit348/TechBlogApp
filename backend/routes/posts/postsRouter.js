const express = require("express");
const multer = require("multer");
const storage = require("../../utils/fileUpload");
const {
  createPost,
  getAllPosts,
  getSinglePost,
  deletePost,
  updatePost,
  likePost,
  dislikePost,
  clapPost,
  schedulePost,
  searchPosts,
  getpublicPosts,
  postViewCount,
} = require("../../controllers/posts/postsController");
const isLoggedin = require("../../middlewares/isLoggedin");
const isAccountVerified = require("../../middlewares/isAccountVerified");

const postsRouter = express.Router();

const upload = multer({
  storage,
});
// ?Create  POST route
// @route POST /api/v1/posts
// postsRouter.post("/", isLoggedin, isAccountVerified, createPost);
// postsRouter.post("/", isLoggedin, upload.single("image"), createPost);

postsRouter.post(
  "/",
  isLoggedin,
  upload.single("image"),
  (req, res, next) => {
    next();
  },
  createPost
);

postsRouter.get("/search", isLoggedin, searchPosts);

// ?Get all posts
// @route GET /api/v1/posts
postsRouter.get("/", isLoggedin, getAllPosts);

// ?Get only 4 posts
postsRouter.get("/public", getpublicPosts);

// ?Get single post
// @route GET /api/v1/posts/:id
postsRouter.get("/:id", getSinglePost);

// ?Delete single post
// @route DELETE /api/v1/posts/:id
postsRouter.delete("/:id", isLoggedin, deletePost);

// ?Update single post
// @route PUT /api/v1/posts/:id
postsRouter.put("/:id", isLoggedin, upload.single("image"), updatePost);

// ?like a post
postsRouter.put("/like/:postId", isLoggedin, likePost);

// ?dislike a post
postsRouter.put("/dislike/:postId", isLoggedin, dislikePost);

// ?Clap a post
postsRouter.put("/claps/:postId", isLoggedin, clapPost);

// ?Schedule a post
postsRouter.put("/schedule/:postId", isLoggedin, schedulePost);

// ?Post view count
postsRouter.put("/:postId/post-view-count", isLoggedin, postViewCount);

// postsRouter.post(
//   "/",
//   isLoggedin,
//   upload.single("image"),
//   (req, res, next) => {
//     console.log("File received:", req.file);
//     console.log("Body received:", req.body);
//     next();
//   },
//   createPost
// );

module.exports = postsRouter;

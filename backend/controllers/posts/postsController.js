const mongoose = require("mongoose");

// for handling global errors
const asyncHandler = require("express-async-handler");
// for the Post model
const Post = require("../../models/Posts/post");
// for the Category model
const Category = require("../../models/Categories/category");
// for user model
const User = require("../../models/Users/user");

// 🔎 Search Posts Controller
exports.searchPosts = async (req, res) => {
  try {
    const { author, category } = req.query;

    let filter = {};

    // if author username provided
    if (author) {
      const user = await User.findOne({
        username: { $regex: author, $options: "i" },
      });
      if (user) {
        filter.author = user._id;
      } else {
        return res.json({ status: "success", posts: [] }); // no author found
      }
    }

    // if category name provided
    if (category) {
      const cat = await Category.findOne({
        name: { $regex: category, $options: "i" },
      });
      if (cat) {
        filter.category = cat._id;
      } else {
        return res.json({ status: "success", posts: [] }); // no category found
      }
    }

    const posts = await Post.find(filter)
      .populate("author", "username email")
      .populate("category", "name");

    res.json({ status: "success", posts });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

//@desc create new post
//@route POST /api/v1/posts/
// @access Private

exports.createPost = asyncHandler(async (req, res, next) => {
  // Get the post data from the request body
  console.log("REQ BODY", req.body);
  const { title, content, categoryId } = req.body;
  // Check if the post already exists
  const postFound = await Post.findOne({ title });
  if (postFound) {
    let error = new Error("Post already exists");
    next(error);
    return;
  }
  // Create a new post(if post does not exist)
  const post = await Post.create({
    title,
    content,
    category: categoryId,
    author: req?.userAuth?._id,
    image: req.file.path,
  });
  await Category.findByIdAndUpdate(
    categoryId,
    { $push: { posts: post._id } },
    { new: true }
  );
  // update the author/user with the new post
  const user = await User.findByIdAndUpdate(
    req?.userAuth?._id,
    {
      $push: { posts: post._id },
    },
    { new: true }
  );

  // send the response
  res.json({
    status: "success",
    message: "Post created successfully",
    post,
    // user,
    // catg,
  });
  console.log("File uploaded", req.file);
});

// @desc get all posts
// @route GET /api/v1/posts/
// @access Private
exports.getAllPosts = asyncHandler(async (req, res) => {
  // get the current user id
  const currentUserId = req.userAuth._id;
  // posts scheduled for future publication should not be fetched
  // Get the current date
  const currentDateTime = new Date();
  // get all users id who have blocked the current user(from blockedUsers array)
  const userBlockingCurrentUser = await User.find({
    blockedUsers: currentUserId,
  });
  // Extract the ids of the users who have blocked the current user
  const blockingUsersIds = userBlockingCurrentUser.map(
    (userObj) => userObj._id
  );
  const query = {
    author: { $nin: blockingUsersIds },
    $or: [
      { scheduledPublish: { $lte: currentDateTime } },
      { scheduledPublish: null },
    ],
  };
  // fetch all posts whose author is not in the blockingUsersIds array and whose scheduledPublish date is greater than the current date
  const allPosts = await Post.find(query).populate({
    path: "author",
    model: "User",
    select: "email username role",
  });
  // send the response
  res.json({
    status: "success",
    message: "Posts fetched successfully",
    allPosts,
  });
});

// @desc get single post
// @route GET /api/v1/posts/:id
// @access Public
exports.getSinglePost = asyncHandler(async (req, res) => {
  // fetch single post from the database
  const singlePost = await Post.findById(req.params.id)
    .populate("author", "username email") // also get author info
    .populate({
      path: "comments",
      model: "Comment",
      // select: "message author createdAt",
      populate: {
        path: "author",
        // model: "User",
        select: "username",
      },
    })
    .populate("category");
  // .populate("comments");
  // send the response
  if (singlePost) {
    res.json({
      status: "success",
      message: "Post fetched successfully",
      singlePost,
    });
  } else {
    res.json({
      status: "success",
      message: "No post found with this ID",
    });
  }
});

// @desc get only 4 posts
// @route GET /api/v1/posts
// @access Public
exports.getpublicPosts = asyncHandler(async (req, res) => {
  // fetch only 4 posts from the database
  const posts = await Post.find({})
    .sort({ createdAt: -1 })
    .limit(4)
    .populate("category", "name");
  console.log(JSON.stringify(posts, null, 2));
  // send the response
  res.status(200).json({
    status: "success",
    message: "Posts fetched successfully",
    posts,
  });
});

// @desc delete single post
// @route DELETE /api/v1/posts/:id
// @access Private
exports.deletePost = asyncHandler(async (req, res) => {
  // fetch the post id from the request params
  const postId = req.params.id;
  // fetch the post from the database
  const post = await Post.findById(postId);
  // check whether current user is the author of the post
  const isAuthor =
    req?.userAuth?._id?.toString() === post?.author?._id?.toString();
  if (!isAuthor) {
    throw Error("You are not authorized to delete this post");
  }
  // delete the post from the database
  await Post.findByIdAndDelete(postId);
  // send the response
  res.json({
    status: "success",
    message: "Post deleted successfully",
  });
});

// @desc update single post
// @route PUT /api/v1/posts/:id
// @access Private
exports.updatePost = asyncHandler(async (req, res) => {
  // fetch the post id from the request params
  const postId = req.params.id;
  const postFound = await Post.findById(postId);
  if (!postFound) {
    throw Error("Post not found");
  }
  // get the post object from req
  const { title, category, content } = req.body;
  // get the updated data from the request body
  // const post = req.body;
  // update the post in the database
  // const updatedPost = await Post.findByIdAndUpdate(
  //   postId,
  //   {
  //     image: req?.file.path ? req?.file?.path : postFound.image,
  //     title: title ? title : postFound.title,
  //     category: category ? category : postFound.category,
  //     content: content ? content : postFound.content,
  //   },
  //   {
  //     new: true,
  //     runValidators: true,
  //   }
  // );

  const updatedPost = await Post.findByIdAndUpdate(
    postId,
    {
      image: req?.file?.path ? req.file.path : postFound.image,
      title: title ? title : postFound.title,
      content: content ? content : postFound.content,
      category:
        category === null || category === ""
          ? null // clear category
          : mongoose.Types.ObjectId.isValid(category)
          ? category
          : postFound.category, // fallback if invalid
    },
    {
      new: true,
      runValidators: true,
    }
  );
  // send the response
  res.json({
    status: "success",
    message: "Post updated successfully",
    updatedPost,
  });
});

//@desc like a post
//@route PUT /api/v1/posts/like/:postId
// @access Private

exports.likePost = asyncHandler(async (req, res, next) => {
  // Get the id from post
  const { postId } = req.params;
  // Get the current user
  const currentUserId = req.userAuth._id;
  // Search the post
  const post = await Post.findById(postId);
  if (!post) {
    let error = new Error("Post not found");
    next(error);
    return;
  }
  // Add the currentUserId to the likes array of the post
  await Post.findByIdAndUpdate(
    postId,
    { $addToSet: { likes: currentUserId } },
    { new: true }
  );

  // Remove the currentUserId from the dislikes array of the post if it exists
  post.dislikes = post.dislikes.filter(
    (userId) => userId.toString() !== currentUserId.toString()
  );
  // resave the post with updated dislikes
  const updatedPost = await post.save();

  // Send the response
  res.json({
    status: "success",
    message: "Post liked successfully",
    post: updatedPost,
  });
});

// @desc dislike a post
// @route PUT /api/v1/posts/dislike/:postId
// @access Private

exports.dislikePost = asyncHandler(async (req, res, next) => {
  // Get the id of the post
  const { postId } = req.params;
  // Get the current user
  const currentUserId = req.userAuth._id;
  // Search the post
  const post = await Post.findById(postId);
  if (!post) {
    let error = new Error("Post not found");
    next(error);
    return;
  }
  // Add the currentUserId to the dislikes array of the post
  await Post.findByIdAndUpdate(
    postId,
    { $addToSet: { dislikes: currentUserId } },
    { new: true }
  );

  // Remove the currentUserId from the likes array of the post if it exists
  post.likes = post.likes.filter(
    (userId) => userId.toString() !== currentUserId.toString()
  );
  // resave the post with updated likes
  const updatedPost = await post.save();

  // Send the response
  res.json({
    status: "success",
    message: "Post disliked successfully",
    post: updatedPost,
  });
});

//@desc Clap a post
//@route PUT /api/v1/posts/claps/:postId
// @access Private

exports.clapPost = asyncHandler(async (req, res, next) => {
  // Get the id from post
  const { postId } = req.params;
  // Get the current user
  const currentUserId = req.userAuth._id;
  // Search the post
  const post = await Post.findById(postId);
  if (!post) {
    let error = new Error("Post not found");
    next(error);
    return;
  }
  // implement clap functionality
  // clap is variable that will be incremented
  const updatedPost = await Post.findByIdAndUpdate(
    postId,
    { $inc: { claps: 1 } }, // Increment the claps count
    { new: true }
  );

  // Send the response
  res.json({
    status: "success",
    message: "Post clapped successfully",
    updatedPost,
  });
});

// @desc Schedule a post
// @route PUT /api/v1/posts/schedule/:postId
// @access Private

exports.schedulePost = asyncHandler(async (req, res, next) => {
  // Get the data
  const { postId } = req.params;
  const { scheduledPublish } = req.body;

  // check if postId and scheduledPublish are provided
  if (!postId || !scheduledPublish) {
    let error = new Error("PostId and scheduledPublish are required");
    next(error);
    return;
  }
  // Get the current user
  const currentUserId = req.userAuth._id;
  // Search the post
  const post = await Post.findById(postId);
  if (!post) {
    let error = new Error("Post not found");
    next(error);
    return;
  }
  // Check if the current user is the author of the post
  if (post.author.toString() !== currentUserId.toString()) {
    let error = new Error("You are not authorized to schedule this post");
    next(error);
    return;
  }
  const scheduledDate = new Date(scheduledPublish);
  // Check if the scheduled date is in the future
  if (scheduledDate <= new Date()) {
    let error = new Error("Scheduled date must be in the future");
    next(error);
    return;
  }
  // implement schedule functionality
  const updatedPost = await Post.findByIdAndUpdate(
    postId,
    { scheduledPublish: scheduledDate },
    { new: true }
  );

  // Send the response
  res.json({
    status: "success",
    message: "Post scheduled successfully",
    updatedPost,
  });
});

//@desc post view count
//@route PUT /api/v1/posts/:id/post-view-count
// @access Private

exports.postViewCount = asyncHandler(async (req, res, next) => {
  // Get the id from post
  const { postId } = req.params;
  // Get the current user
  const currentUserId = req.userAuth._id;
  // Search the post
  const post = await Post.findById(postId);
  if (!post) {
    let error = new Error("Post not found");
    next(error);
    return;
  }
  // Add the currentUserId to the likes array of the post
  await Post.findByIdAndUpdate(
    postId,
    { $addToSet: { postViews: currentUserId } },
    { new: true }
  ).populate("author");

  // resave the post
  await post.save();

  // Send the response
  res.json({
    status: "success",
    message: "Post viewed successfully",
    post: Post,
  });
});

const User = require("../../models/Users/user");
const bcrypt = require("bcryptjs");
const generateToken = require("../../utils/generateToken");
const asyncHandler = require("express-async-handler");
const sendEmail = require("../../utils/sendEmail");
const crypto = require("crypto");
const sendAccountVerificationEmail = require("../../utils/sendVerificationEmail");
const cloudinary = require("cloudinary").v2;

// @desc    Upload profile picture
// @route   POST /api/v1/users/profile-picture
// @access  Private
exports.uploadProfilePicture = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  cloudinary.uploader
    .upload_stream({ folder: "profile_pictures" }, async (error, result) => {
      if (error) {
        return res.status(500).json({ message: "Cloudinary upload failed" });
      }

      const user = await User.findByIdAndUpdate(
        req.userAuth._id || req.userAuth.id,
        { profilePicture: result.secure_url },
        { new: true }
      );

      return res.json({
        status: "success",
        message: "Profile picture updated",
        profilePicture: user.profilePicture,
      });
    })
    .end(req.file.buffer); // << use buffer instead of stream
});

// @desc    Update logged-in user profile
// @route   PUT /api/v1/users/update-profile
// @access  Private
exports.updateProfile = asyncHandler(async (req, res) => {
  const userId = req.userAuth._id;

  console.log("Incoming update request:", req.body);
  console.log("UserAuth:", req.userAuth);

  // Extract fields from request body
  const {
    username,
    email,
    bio,
    location,
    gender,
    accountLevel,
    profilePicture,
  } = req.body;

  // Find the user
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({
      status: "error",
      message: "User not found",
    });
  }

  // Update fields if provided
  if (username) user.username = username;
  if (email) user.email = email;
  if (bio) user.bio = bio;
  if (location) user.location = location;
  if (gender) user.gender = gender;
  if (accountLevel) user.accountLevel = accountLevel;
  if (profilePicture) user.profilePicture = profilePicture;

  await user.save();

  res.status(200).json({
    status: "success",
    message: "Profile updated successfully",
    user,
  });
});

//@desc register new user
//@route POST /api/v1/users/register
// @access Public

exports.register = asyncHandler(async (req, res, next) => {
  const { username, email, password } = req.body;
  // Check if user already exists
  const user = await User.findOne({ username });
  if (user) {
    throw new Error("User already exists");
  }
  // Create new user
  const newUser = new User({ username, email, password });

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  newUser.password = await bcrypt.hash(password, salt);

  // Save the new user to the database
  await newUser.save();

  res.json({
    status: "success",
    message: "User registered successfully",
    _id: newUser?.id,
    username: newUser?.username,
    email: newUser?.email,
    role: newUser?.role,
    token: generateToken(newUser), //changed
  });
});

//@desc login new user
//@route POST /api/v1/users/login
// @access Public

exports.login = asyncHandler(async (req, res, next) => {
  const { username, password } = req.body;
  // Check if user exists
  const user = await User.findOne({ username });
  if (!user) {
    throw new Error("User not found");
  }
  // Check if password is correct
  const isMatch = await bcrypt.compare(password, user?.password);
  if (!isMatch) {
    throw new Error("Incorrect password");
  }
  user.lastlogin = Date.now();
  await user.save();
  res.json({
    status: "success",
    email: user?.email,
    _id: user?._id,
    username: user?.username,
    role: user?.role,
    token: generateToken(user),
  });
});

//@desc profile view
//@route POST /api/v1/users/profile
// @access Private

exports.getProfile = asyncHandler(async (req, res, next) => {
  // console.log(req.userAuth);
  const user = await User.findById(req.userAuth.id)
    .populate({
      path: "posts",
      model: "Post",
    })
    .populate({
      path: "following",
      model: "User",
    })
    .populate({
      path: "followers",
      model: "User",
    })
    .populate({
      path: "blockedUsers",
      model: "User",
    })
    .populate({
      path: "profileViewers",
      model: "User",
    });
  res.json({
    status: "success",
    message: "Profile fetched successfully",
    user,
  });
});

//@desc profile view
//@route POST /api/v1/users/public-profile/userId
// @access public

exports.getPublicProfile = asyncHandler(async (req, res, next) => {
  // console.log(req.userAuth);
  const userId = req.params.userId;
  const user = await User.findById(userId)
    .select("-password")
    .populate("posts");
  res.json({
    status: "success",
    message: "Public Profile fetched successfully",
    user,
  });
});

// @desc Block user
// @route PUT /api/v1/users/block/:userIdToBlock
// @access Private

exports.blockUser = asyncHandler(async (req, res, next) => {
  // Get the user ID to block from the request parameters
  const userIdToBlock = req.params.userIdToBlock;

  // !check user is present or not
  const userToBlock = await User.findById(userIdToBlock);
  if (!userToBlock) {
    let error = new Error("User to block not found");
    next(error);
    return;
  }
  // !Get the user who is making the request to block
  const userBlocking = req.userAuth._id;

  // !check if he is trying to block himself
  if (userBlocking.toString() === userIdToBlock.toString()) {
    let error = new Error("You cannot block yourself");
    next(error);
    return;
  }
  // !Get the current user from the database
  const currentUser = await User.findById(userBlocking);

  // !check whether userIdToBlock is already blocked
  if (currentUser.blockedUsers.includes(userIdToBlock)) {
    let error = new Error("User is already blocked");
    next(error);
    return;
  }

  // !Add the user to the blocked users array
  currentUser.blockedUsers.push(userIdToBlock);
  await currentUser.save();

  res.json({
    status: "success",
    message: "User blocked successfully",
  });
});

// @desc Unblock user
// @route PUT /api/v1/users/unblock/:userIdToUnblock
// @access Private

exports.unblockUser = asyncHandler(async (req, res, next) => {
  // Get the user ID to unblock from the request parameters
  const userIdToUnblock = req.params.userIdToUnblock;

  // !check user is present or not
  const userToUnblock = await User.findById(userIdToUnblock);
  if (!userToUnblock) {
    let error = new Error("User to unblock not found");
    next(error);
    return;
  }

  // !Get the user who is making the request to unblock
  const userUnblocking = req?.userAuth?._id;

  // !Get the current user from the database so that we can access the blockedUsers array
  const currentUser = await User.findById(userUnblocking);

  // !check whether userIdToUnblock is already unblocked
  if (!currentUser.blockedUsers.includes(userIdToUnblock)) {
    let error = new Error("User is not blocked");
    next(error);
    return;
  }

  // !Remove the user from the blocked users array
  currentUser.blockedUsers = currentUser.blockedUsers.filter(
    (id) => id.toString() !== userIdToUnblock.toString()
  );
  await currentUser.save();

  res.json({
    status: "success",
    message: "User unblocked successfully",
  });
});

// @desc view another user profile
// @route GET /api/v1/users/view-other-profile/:userProfileId
// @access Private

exports.viewOtherProfile = asyncHandler(async (req, res, next) => {
  // Get the user ID whose profile is being viewed
  const userProfileId = req.params.userProfileId;

  // Check if the user exists
  const userProfile = await User.findById(userProfileId);
  if (!userProfile) {
    let error = new Error("User not found");
    next(error);
    return;
  }

  const currentUserId = req?.userAuth?._id;
  // check if we have already viewed the profile of userProfile
  if (userProfile.profileViewers.includes(currentUserId)) {
    let error = new Error("You have already viewed this profile");
    next(error);
    return;
  }

  // Add the current user to the profile viewers array
  userProfile.profileViewers.push(currentUserId);
  await userProfile.save();

  res.json({
    status: "success",
    message: "Profile viewed successfully",
  });
});

// @desc Follow user
// @route PUT /api/v1/users/follow/:userIdToFollow
// @access Private

exports.followUser = asyncHandler(async (req, res, next) => {
  // Find the current user id
  const currentUserId = req?.userAuth?._id;

  // Find the user to follow
  const userIdToFollow = req.params.userIdToFollow;

  // !check user is present or not
  const userToFollow = await User.findById(userIdToFollow);
  if (!userToFollow) {
    let error = new Error("User to follow not found");
    next(error);
    return;
  }

  // Avoid following himself
  if (currentUserId.toString() === userIdToFollow.toString()) {
    let error = new Error("You cannot follow yourself");
    next(error);
    return;
  }
  // Check if already following
  const currentUser = await User.findById(currentUserId);
  if (currentUser.following.includes(userIdToFollow)) {
    let error = new Error("You are already following this user");
    next(error);
    return;
  }

  // Add the user to the following array
  currentUser.following.push(userIdToFollow);
  await currentUser.save();

  // Add the current user to the followers array
  userToFollow.followers.push(currentUserId);
  await userToFollow.save();

  res.json({
    status: "success",
    message: "User followed successfully",
  });
});

// @desc Unfollow user
// @route PUT /api/v1/users/unfollow/:userIdToUnfollow
// @access Private

exports.unfollowUser = asyncHandler(async (req, res, next) => {
  // Find the current user id
  const currentUserId = req?.userAuth?._id;

  // Find the user to unfollow
  const userIdToUnfollow = req.params.userIdToUnfollow;

  // !check user is present or not
  const userToUnfollow = await User.findById(userIdToUnfollow);
  if (!userToUnfollow) {
    let error = new Error("User to unfollow not found");
    next(error);
    return;
  }

  // Check if not following the user
  const currentUser = await User.findById(currentUserId);
  if (!currentUser.following.includes(userIdToUnfollow)) {
    let error = new Error("You are not following this user");
    next(error);
    return;
  }

  // Avoid unfollowing himself
  if (currentUserId.toString() === userIdToUnfollow.toString()) {
    let error = new Error("You cannot unfollow yourself");
    next(error);
    return;
  }

  // Remove the user from the following array(2 approaches)
  await User.findByIdAndUpdate(
    currentUserId,
    {
      $pull: { following: userIdToUnfollow },
    },
    { new: true }
  );

  // Remove the current user from the followers array
  userToUnfollow.followers = userToUnfollow.followers.filter(
    (id) => id.toString() !== currentUserId.toString()
  );
  await userToUnfollow.save();

  res.json({
    status: "success",
    message: "User unfollowed successfully",
  });
});

// @desc Forgot password
// @route POST /api/v1/users/forgot-password
// @access Public

exports.forgotPassword = asyncHandler(async (req, res, next) => {
  // Get the email from the request body
  const { email } = req.body;

  // Check if user exists
  const userFound = await User.findOne({ email });
  if (!userFound) {
    let error = new Error("User not found");
    next(error);
    return;
  }

  // Generate reset token
  const resetToken = userFound.generatePasswordResetToken();
  // !save the reset token and its expiration time to the user document
  await userFound.save();

  // Send email
  await sendEmail(email, resetToken);

  res.json({
    status: "success",
    message: "Password reset email sent successfully",
  });
});

// @desc Reset password
// @route POST /api/v1/users/reset-password/:resetToken
// @access Public

exports.resetPassword = asyncHandler(async (req, res, next) => {
  // Get the reset token from the request params
  const { resetToken } = req.params;

  // Get the password from the request body
  const { password } = req.body;

  // convert the reset token to hash
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // verify the token in the database
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    let error = new Error("Invalid or expired token");
    next(error);
    return;
  }

  // Update the new password
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  res.json({
    status: "success",
    message: "Password reset successfully",
  });
});

// @desc Send account verification email
// @route POST /api/v1/users/account-verification-email
// @access private

exports.accountVerificationEmail = asyncHandler(async (req, res, next) => {
  // Find the current user's email
  const user = await User.findById(req?.userAuth?._id);
  if (!user) {
    let error = new Error("User not found");
    next(error);
    return;
  }

  // Get the token from current user object
  const verificationToken = user.generateAccountVerificationToken();

  // resave the user
  await user.save();

  // send the verification email
  sendAccountVerificationEmail(user.email, verificationToken);
  res.json({
    status: "success",
    message: `Account verification email sent to ${user.email}`,
  });
});

//@desc Account Token Verification
//@route PUT /api/v1/users/verify-account/:verificationToken
//@access private

exports.verifyAccount = asyncHandler(async (req, res, next) => {
  // Get the verification token from the request params
  const { verificationToken } = req.params;

  // convert the verification token to hashed form
  const hashedToken = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");

  console.log("Plain token from URL:", verificationToken);
  console.log("Hashed token from URL:", hashedToken);

  const userInDB = await User.findOne({
    email: "ankit.kumar.cse26@gmail.com",
  });
  console.log("Stored hashed token in DB:", userInDB?.accountVerificationToken);
  console.log("Stored expiry:", userInDB?.accountVerificationExpires);

  // verify the token in the database
  const userFound = await User.findOne({
    accountVerificationToken: hashedToken,
    accountVerificationExpires: { $gt: Date.now() },
  });

  // console.log("User found:", userFound);

  if (!userFound) {
    let error = new Error("Invalid or expired verification token");
    next(error);
    return;
  }

  // Update the userFound account as verified
  userFound.isVerified = true;
  userFound.accountVerificationToken = undefined;
  userFound.accountVerificationExpires = undefined;
  await userFound.save();

  res.json({
    status: "success",
    message: "Account verified successfully",
  });
});

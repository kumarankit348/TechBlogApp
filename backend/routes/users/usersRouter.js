const express = require("express");
const multer = require("multer");

const {
  register,
  login,
  getProfile,
  blockUser,
  unblockUser,
  viewOtherProfile,
  followUser,
  unfollowUser,
  forgotPassword,
  resetPassword,
  accountVerificationEmail,
  verifyAccount,
  updateProfile,
  uploadProfilePicture,
  getPublicProfile,
} = require("../../controllers/users/usersController");
const isLoggedin = require("../../middlewares/isLoggedin");

const usersRouter = express.Router();
usersRouter.post("/register", register);
usersRouter.post("/login", login);

const upload = multer({ dest: "uploads/" });

usersRouter.put(
  "/upload-profile-picture",
  isLoggedin,
  upload.single("profilePicture"),
  uploadProfilePicture
);

usersRouter.get("/profile", isLoggedin, getProfile);

usersRouter.get("/public-profile/:userId", getPublicProfile);

usersRouter.put("/profile/", isLoggedin, updateProfile);

usersRouter.put("/block/:userIdToBlock", isLoggedin, blockUser);
usersRouter.put("/unblock/:userIdToUnblock", isLoggedin, unblockUser);
usersRouter.get(
  "/view-other-profile/:userProfileId",
  isLoggedin,
  viewOtherProfile
);
usersRouter.put("/follow/:userIdToFollow", isLoggedin, followUser);
usersRouter.put("/unfollow/:userIdToUnfollow", isLoggedin, unfollowUser);

usersRouter.put("/forgot-password", forgotPassword);
usersRouter.put("/reset-password/:resetToken", resetPassword);

usersRouter.put(
  "/account-verification-email",
  isLoggedin,
  accountVerificationEmail
);

usersRouter.put(
  "/verify-account/:verificationToken",
  isLoggedin,
  verifyAccount
);

module.exports = usersRouter;

const mongoose = require("mongoose");
const crypto = require("crypto"); //built-in module for generating cryptographic tokens in node.js
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["admin", "user"],
      default: "user",
    },
    password: {
      type: String,
      required: true,
    },
    lastlogin: {
      type: Date,
      default: Date.now(),
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    accountLevel: {
      type: String,
      enum: ["bronze", "silver", "gold"],
      default: "bronze",
    },
    profilePicture: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
    },
    location: {
      type: String,
    },
    NotificationType: {
      email: {
        type: String,
      },
    },
    gender: {
      type: String,
      enum: ["male", "female", "prefer not to say"],
    },
    // other properties will deals with relationships
    profileViewers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    likedPosts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    blockedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    passwordResetToken: {
      type: String,
    },
    passwordResetExpires: {
      type: Date,
    },
    accountVerificationToken: {
      type: String,
    },
    accountVerificationExpires: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// !generate password reset token
userSchema.methods.generatePasswordResetToken = function () {
  // generate a random token using crypto module
  const resetToken = crypto.randomBytes(20).toString("hex");
  // hash the token and set it to passwordResetToken field
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  console.log(`Password reset token: ${resetToken}`);
  console.log(`Hashed token: ${this.passwordResetToken}`);
  return resetToken;
};

// !generate account verification token
userSchema.methods.generateAccountVerificationToken = function () {
  // generate a random token using crypto module
  const verificationToken = crypto.randomBytes(20).toString("hex");
  // hash the token and set it to accountVerificationToken field
  this.accountVerificationToken = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");
  this.accountVerificationExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  console.log(`Account verification token: ${verificationToken}`);
  console.log(`Hashed token: ${this.accountVerificationToken}`);
  // !set the expiry time to 10 minutes
  this.accountVerificationExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  return verificationToken;
};
// convert the schema into a model
const User = mongoose.models.User || mongoose.model("User", userSchema);
module.exports = User;

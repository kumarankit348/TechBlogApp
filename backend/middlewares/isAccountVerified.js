const User = require("../models/Users/user");
const isAccountVerified = async (req, res, next) => {
  try {
    // find the user by id
    const currentUser = await User.findById(req.userAuth._id);
    // check weather the user is verified or not
    if (currentUser.isVerified) {
      next();
    } else {
      res.status(401).json({
        message: "Account is not verified. Please verify your account first.",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error,
    });
  }
};

module.exports = isAccountVerified;

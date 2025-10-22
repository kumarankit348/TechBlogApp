const jwt = require("jsonwebtoken");
const User = require("../models/Users/user");
const isLoggedin = (req, res, next) => {
  console.log("Middleware isLoggedin called");
  //   fetch token from request
  const token = req.headers.authorization?.split(" ")[1];
  // verify token
  jwt.verify(token, process.env.JWT_KEY, async (err, decoded) => {
    // if not, return error response
    if (err) {
      const error = new Error(err?.message);
      next(err);
    } else {
      // if sucessful, call next()
      const id = decoded?.user?.id;
      const user = await User.findById(id).select("username email role _id");
      console.log(user);
      req.userAuth = user;
      next();
    }
  });
};

module.exports = isLoggedin;
// This middleware can be used to check if a user is logged in before accessing certain routes.

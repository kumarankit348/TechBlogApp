const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const usersRouter = require("./routes/users/usersRouter");
const connectDB = require("./config/database");
const {
  notFoundHandler,
  globalErrorHandler,
} = require("./middlewares/globalErrorHandler");
const categoriesRouter = require("./routes/categories/categoriesRouter");
const postsRouter = require("./routes/posts/postsRouter");
const commentsRouter = require("./routes/comments/commentsRouter");
const sendEmail = require("./utils/sendEmail");
const { send } = require("mailer");

// Create an instance of an Express application
const app = express();

// Load environment variables from .env file
dotenv.config();

// console.log("ENV check:", {
//   CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
//   CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
//   CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET
//     ? "loaded"
//     : "MISSING",
// });

// Connect to the database
connectDB();

// set up the middleware to parse JSON bodies
app.use(express.json());
app.use(cors()); // allow frontend http://localhost:5173

// set up the router
app.use("/api/v1/users", usersRouter);
// ? set up the categories router
app.use("/api/v1/categories", categoriesRouter);

// ? set up the posts router
app.use("/api/v1/posts", postsRouter);

// ? set up the comments router
app.use("/api/v1/comments", commentsRouter);

// ?Not found error handler middleware
app.use(notFoundHandler);

//? Set up the global error handler middleware
app.use(globalErrorHandler);

// Start the server(process->object) (env os property of object)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

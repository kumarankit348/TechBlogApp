const globalErrorHandler = (err, req, res, next) => {
  const statusCode = err?.status ? err?.status : "Failed";
  const message = err?.message ? err?.message : "Internal Server Error";
  const stack = err?.stack ? err?.stack : "No stack trace available";
  res.status(500).json({
    status: "Failed",
    message,
    stack,
  });
};

const notFoundHandler = (req, res, next) => {
  let error = new Error(`Cannot find ${req.originalUrl} on this server`);
  next(error);
};

module.exports = { globalErrorHandler, notFoundHandler };

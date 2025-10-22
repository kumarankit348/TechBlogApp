const jwt = require("jsonwebtoken");
const generateToken = (user) => {
  const payload = {
    user: {
      id: user.id,
    },
  };
  const token = jwt.sign(payload, process.env.JWT_KEY, {
    expiresIn: "4h", // Token will expire in 1 hour
  });
  return token;
};

module.exports = generateToken;

const HttpError = require("./http-error");
const jwt = require("jsonwebtoken");
module.exports = (role) => {
  return (req, res, next) => {
    if (req.method === "OPTIONS") {
      return next();
    }
    try {
      const token = req.headers.authorization.split(" ")[1];

      if (!token) {
        throw new Error("Authentication failed");
      }
      if (!process.env.JWT_KEY) {
        console.error("JWT_KEY is not defined in process.env");
        throw new Error("Server configuration error");
      }
      const decodedToken = jwt.verify(token, process.env.JWT_KEY);

      req.userData = { userId: decodedToken.userId };
      req.role = { role: decodedToken.role };

      // Verify if the user role matches the required role
      if (req.role.role !== role) {
        throw new Error("Unauthorized");
      }

      next();
    } catch (err) {
      console.error("Auth Error:", err.message);
      const error = new HttpError(err.message || "Authentication failed", 401);
      return next(error);
    }
  };
};

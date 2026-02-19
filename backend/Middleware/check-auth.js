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
      const decodedToken = jwt.verify(token, process.env.JWT_KEY);

      req.userData = { userId: decodedToken.userId };
      req.role = { role: decodedToken.role };

      if (req.role.role !== role) {
        console.log("Unauthorized: Role mismatch");
        throw new Error("Unauthorized");
      }

      next();
    } catch (err) {
      const error = new HttpError("Authentication failed: " + err.message, 401);
      return next(error);
    }
  };
};
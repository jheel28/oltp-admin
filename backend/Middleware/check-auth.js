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
      console.log("Required Role:", role);
      console.log("User Role:", decodedToken.role);

      req.role = { role: decodedToken.role };

      // Verify if the user role matches the required role
      if (req.role.role !== role && req.role.role !== "SuperAdmin") {
        console.log("Unauthorized: Role mismatch");
        throw new Error("Unauthorized");
      }

      next(); // Correctly calling next without any argument
    } catch (err) {
      console.error("Auth Middleware Error:", err.message);
      const error = new HttpError("Authentication failed: " + err.message, 401);
      return next(error);
    }
  };
};

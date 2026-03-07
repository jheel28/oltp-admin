const HttpError = require("./http-error");
const jwt = require("jsonwebtoken");
const Admin = require("../Models/Admin");
const Student = require("../Models/Student");

module.exports = (roles) => {
  return async (req, res, next) => {
    if (req.method === "OPTIONS") {
      return next();
    }
    try {
      if (!req.headers.authorization) {
        throw new Error("No authorization header found");
      }
      const token = req.headers.authorization.split(" ")[1];

      if (!token || token === "null") {
        throw new Error("Authentication failed: Token missing");
      }

      const decodedToken = jwt.verify(token, process.env.JWT_KEY);

      let userExists = false;
      if (decodedToken.role === "Admin") {
        userExists = !!(await Admin.findById(decodedToken.userId).select("_id"));
      } else if (decodedToken.role === "Student") {
        userExists = !!(await Student.findById(decodedToken.userId).select("_id"));
      } else {
        throw new Error("Authentication failed: Role is invalid");
      }

      if (!userExists) {
        throw new Error("Authentication failed: Account no longer exists");
      }

      req.userData = {
        userId: decodedToken.userId,
        email: decodedToken.email,
        role: decodedToken.role,
      };

      if (roles) {
        const allowed = Array.isArray(roles) ? roles : [roles];
        if (!allowed.includes(decodedToken.role)) {
          console.log(
            `Unauthorized: Expected one of [${allowed.join(", ")}], got ${decodedToken.role}`,
          );
          return next(new HttpError("Unauthorized: Role mismatch", 403));
        }
      }

      next();
    } catch (err) {
      console.error("JWT Error:", err.message);
      const error = new HttpError("Authentication failed: " + err.message, 401);
      return next(error);
    }
  };
};

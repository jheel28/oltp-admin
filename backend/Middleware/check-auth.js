const HttpError = require("./http-error");
const jwt = require("jsonwebtoken");

module.exports = (roles) => {
  return (req, res, next) => {
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

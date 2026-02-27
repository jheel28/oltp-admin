const HttpError = require("./http-error");
const { normalizeEmail } = require("../Utils/emailNormalization");

const RAW_SUPERADMIN_EMAIL =
  process.env.SUPERADMIN_EMAIL || "preettaparia@gmail.com";

const SUPERADMIN_EMAIL = normalizeEmail(RAW_SUPERADMIN_EMAIL);

if (!SUPERADMIN_EMAIL) {
  console.error(
    "[ADMIN-PERMISSIONS] WARNING: SUPERADMIN_EMAIL resolved to null – " +
    "check your .env configuration."
  );
}

const isSuperAdmin = (requestingEmail) => {
  if (!requestingEmail || !SUPERADMIN_EMAIL) return false;
  return normalizeEmail(requestingEmail) === SUPERADMIN_EMAIL;
};

const checkAdminPermissions = (action) => {
  return (req, res, next) => {
    const { userId, email: requestingEmail } = req.userData || {};
    const targetId = req.params.id;

    const self        = userId === targetId;
    const superAdmin  = isSuperAdmin(requestingEmail);

    if (action === "delete" && self) {
      console.warn(
        `[ADMIN-PERMISSIONS] SELF-DELETE BLOCKED | admin=${requestingEmail} (${userId}) ` +
        `attempted to delete their own account | ip=${req.ip}`
      );
      return next(
        new HttpError("You cannot delete your own admin account.", 403)
      );
    }

    if (self || superAdmin) {
      if (superAdmin && !self) {
        console.info(
          `[ADMIN-PERMISSIONS] SUPERADMIN ACTION | superadmin=${requestingEmail} ` +
          `action=${action} target=${targetId} | ip=${req.ip}`
        );
      }
      return next();
    }

    console.warn(
      `[ADMIN-PERMISSIONS] UNAUTHORIZED | admin=${requestingEmail} (${userId}) ` +
      `attempted to ${action} admin=${targetId} | ip=${req.ip}`
    );

    return next(
      new HttpError(
        `You are not authorized to ${action} this admin account. ` +
        "Only the account owner or a superadmin may perform this action.",
        403
      )
    );
  };
};

module.exports = { checkAdminPermissions, isSuperAdmin, SUPERADMIN_EMAIL };
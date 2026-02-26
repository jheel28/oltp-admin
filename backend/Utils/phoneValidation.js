const {
  parsePhoneNumber,
  isValidPhoneNumber,
  isPossiblePhoneNumber,
} = require("libphonenumber-js");

const validatePhoneNumber = (phone) => {
  if (!phone || typeof phone !== "string") {
    return { valid: false, error: "Phone number is required" };
  }

  const trimmed = phone.trim();

  if (!trimmed.startsWith("+")) {
    return {
      valid: false,
      error: "Phone number must include a country code (e.g. +91...)",
    };
  }

  try {
    if (!isPossiblePhoneNumber(trimmed)) {
      return {
        valid: false,
        error: "Phone number length is invalid for the given country",
      };
    }

    if (!isValidPhoneNumber(trimmed)) {
      return {
        valid: false,
        error: "Phone number is not valid for the given country",
      };
    }

    const parsed = parsePhoneNumber(trimmed);

    if (!parsed || !parsed.isValid()) {
      return { valid: false, error: "Phone number is not valid" };
    }

    return {
      valid: true,
      e164: parsed.format("E.164"),
      national: parsed.formatNational(),
      country: parsed.country,
    };
  } catch (err) {
    return { valid: false, error: "Invalid phone number format" };
  }
};

module.exports = { validatePhoneNumber };
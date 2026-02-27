const PROVIDER_RULES = {
  "gmail.com": (local) => local.split("+")[0].replace(/\./g, ""),
  "googlemail.com": (local) => local.split("+")[0].replace(/\./g, ""),
  "outlook.com": (local) => local.split("+")[0],
  "hotmail.com": (local) => local.split("+")[0],
  "live.com":    (local) => local.split("+")[0],
  "msn.com":     (local) => local.split("+")[0],
  "yahoo.com":   (local) => local.split("-")[0],
  "ymail.com":   (local) => local.split("-")[0],
};

const DOMAIN_ALIASES = {
  "googlemail.com": "gmail.com",
};

const normalizeEmail = (email) => {
  if (!email || typeof email !== "string") return null;

  const trimmed = email.trim().toLowerCase();

  const atIdx = trimmed.lastIndexOf("@");
  if (atIdx < 1 || atIdx === trimmed.length - 1) return trimmed;

  let local  = trimmed.slice(0, atIdx);
  let domain = trimmed.slice(atIdx + 1);

  domain = DOMAIN_ALIASES[domain] || domain;

  const rule = PROVIDER_RULES[domain];
  if (rule) {
    local = rule(local);
  }

  return `${local}@${domain}`;
};

module.exports = { normalizeEmail };
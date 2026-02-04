const bcrypt = require("bcryptjs");
// Hash for "password123"
bcrypt.hash("password123", 12).then(hash => console.log(hash));

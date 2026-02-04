const bcrypt = require("bcryptjs");
bcrypt.hash("password123", 12).then(hash => console.log(hash));

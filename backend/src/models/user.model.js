const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  email: { type: String, unique: true, sparse: true },
  password: String,
  role: {
    type: String,
    enum: ["EMPLOYEE", "ADMIN"],
    default: "EMPLOYEE"
  }
});

module.exports = mongoose.model("User", userSchema);
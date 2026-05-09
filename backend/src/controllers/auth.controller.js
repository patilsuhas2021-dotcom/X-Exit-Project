const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// REGISTER
exports.register = async (req, res) => {
  const { username, email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  await User.create({ username, email, password: hashed });

  res.status(201).json({
    message: "User registered successfully"
  });
};

// LOGIN (Employee + Admin)
exports.login = async (req, res) => {
  const { username, password } = req.body;

  let user;

  // HARD-CODED ADMIN
  if (username === "admin" && password === "admin") {
    const token = jwt.sign(
      { role: "ADMIN", username: "admin" },
      process.env.JWT_SECRET
    );
    return res.json({ token });
  }

  user = await User.findOne({ username });
  if (!user) return res.status(400).json({ message: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Wrong password" });

  const token = jwt.sign(
    { role: "EMPLOYEE", id: user._id },
    process.env.JWT_SECRET
  );

  res.json({ token });
};
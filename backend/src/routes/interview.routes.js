const express = require("express");
const auth = require("../middleware/auth.middleware");
const {
  createInterview,
  getAll
} = require("../controllers/interview.controller");

const router = express.Router();

router.post("/", auth, createInterview);
router.get("/", auth, getAll);

module.exports = router;
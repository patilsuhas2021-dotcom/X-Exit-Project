const express = require("express");
const auth = require("../middleware/auth.middleware");
const { applyResignation } = require("../controllers/resignation.controller");
const { createInterview } = require("../controllers/interview.controller");

const router = express.Router();

router.post("/resign", auth, applyResignation);
router.post("/responses", auth, createInterview);

module.exports = router;

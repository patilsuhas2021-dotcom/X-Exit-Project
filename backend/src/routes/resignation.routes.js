const express = require("express");
const auth = require("../middleware/auth.middleware");
const {
  applyResignation,
  getAll,
  updateStatus
} = require("../controllers/resignation.controller");

const router = express.Router();

router.post("/", auth, applyResignation);
router.get("/", auth, getAll);
router.patch("/:id", auth, updateStatus);

module.exports = router;
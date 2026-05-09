const express = require("express");
const auth = require("../middleware/auth.middleware");
const { getAll: getAllResignations, updateStatus } = require("../controllers/resignation.controller");
const { getAll: getAllInterviews } = require("../controllers/interview.controller");

const router = express.Router();

router.get("/resignations", auth, getAllResignations);
router.put("/conclude_resignation", auth, updateStatus);
router.get("/exit_responses", auth, getAllInterviews);

module.exports = router;

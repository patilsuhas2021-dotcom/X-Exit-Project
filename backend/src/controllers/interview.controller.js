const Interview = require("../models/interview.model");
const Resignation = require("../models/resignation.model");

exports.createInterview = async (req, res) => {
  try {
    // Check if resignation is approved
    const resignation = await Resignation.findOne({ 
      employee: req.user.id, 
      status: "APPROVED" 
    });

    if (!resignation) {
      return res.status(403).json({ 
        message: "You can only submit an exit interview after your resignation is approved." 
      });
    }

    const interview = await Interview.create({
      ...req.body,
      employee: req.user.id
    });
    
    res.status(200).json({ data: interview, message: "Exit interview submitted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const data = await Interview.find().populate("employee", "username");
    res.json({ data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
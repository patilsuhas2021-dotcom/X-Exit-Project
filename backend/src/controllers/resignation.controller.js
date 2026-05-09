const Resignation = require("../models/resignation.model");
const User = require("../models/user.model");
const { isHoliday } = require("../services/holiday.service");
const { sendEmail } = require("../services/email.service");

exports.applyResignation = async (req, res) => {
  try {
    const { lwd, reason } = req.body;

    // Check if weekend or holiday
    const holidayCheck = await isHoliday(lwd);
    if (holidayCheck.holiday) {
      return res.status(400).json({ 
        message: `Last working day cannot be on a ${holidayCheck.reason}` 
      });
    }

    const resignation = await Resignation.create({
      lastWorkingDay: lwd,
      reason: reason || "No reason provided",
      employee: req.user.id
    });

    res.status(200).json({ data: { resignation }, message: "Resignation submitted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    // If HR (ADMIN), get all. If EMPLOYEE, get their own.
    let query = {};
    if (req.user.role === "EMPLOYEE") {
      query = { employee: req.user.id };
    }
    
    const data = await Resignation.find(query).populate("employee", "username");
    res.json({ data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { resignationId, approved, lwd } = req.body;
    const status = approved ? "APPROVED" : "REJECTED";
    
    const resignation = await Resignation.findById(resignationId || req.params.id).populate("employee");
    if (!resignation) return res.status(404).json({ message: "Resignation not found" });

    resignation.status = status;
    if (lwd) resignation.exitDate = lwd;
    
    await resignation.save();

    // Send notification
    const employee = resignation.employee;
    const subject = `Resignation Request ${status}`;
    const text = `Dear ${employee.username}, your resignation request has been ${status.toLowerCase()}.${status === "APPROVED" ? ` Your exit date is set to ${new Date(lwd || resignation.lastWorkingDay).toDateString()}.` : ""}`;
    
    const emailTo = employee.email || `${employee.username}@example.com`;
    await sendEmail(emailTo, subject, text);

    res.json({ message: `Resignation ${status.toLowerCase()} successfully`, data: resignation });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const mongoose = require("mongoose");

const resignationSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  reason: String,
  lastWorkingDay: Date,
  exitDate: Date,
  status: {
    type: String,
    enum: ["PENDING", "APPROVED", "REJECTED"],
    default: "PENDING"
  }
}, { timestamps: true });

module.exports = mongoose.model("Resignation", resignationSchema);
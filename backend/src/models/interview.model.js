const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  feedback: String,
  rating: Number,
  responses: [
    {
      questionText: String,
      response: String
    }
  ],
  interviewDate: Date
}, { timestamps: true });

module.exports = mongoose.model("Interview", interviewSchema);
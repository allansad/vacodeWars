const mongoose = require("mongoose");

const ProblemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  completed_users: { type: Number, default: 0 },
  difficulty_level: { type: Number, required: true },
  description: { type: String, required: true },
  tests: [
    {
      code: { type: String, required: true },
      solution: { type: mongoose.Mixed, require: true },
    }
  ],
});

module.exports = mongoose.model("Problem", ProblemSchema);

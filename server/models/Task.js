const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  priority: {
    type: String,
    enum: ["high", "regular", "low"], // необязательно, но добавляет валидацию
    default: "regular",
  },
});

module.exports = mongoose.model("Task", TaskSchema);

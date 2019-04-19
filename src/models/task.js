const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String
    },
    order: {
      type: Number,
      required: true
    },
    listId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "List"
    }
  },
  {
    timestamps: true
  }
);

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;

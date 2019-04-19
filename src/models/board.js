const mongoose = require("mongoose");

const boardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User"
    },
    lists: [{ type: mongoose.Schema.Types.ObjectId, ref: "List" }]
  },
  {
    timestamps: true
  }
);

const Board = mongoose.model("Board", boardSchema);

module.exports = Board;

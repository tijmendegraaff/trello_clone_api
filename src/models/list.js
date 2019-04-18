const mongoose = require("mongoose");

const listSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    order: {
      type: Number,
      required: true
    },
    boardId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Board"
    }
  },
  {
    timestamps: true
  }
);

const List = mongoose.model("List", listSchema);

module.exports = List;

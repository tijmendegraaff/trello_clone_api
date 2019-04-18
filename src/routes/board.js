const express = require("express");
const router = new express.Router();

const Board = require("../models/board");

const auth = require("../middleware/auth");

router.post("/boards", auth, async (req, res) => {
  const board = new Board({
    ...req.body,
    owner: req.user._id
  });

  try {
    await board.save();
    res.status(201).send(board);
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;

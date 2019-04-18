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

router.get("/boards", auth, async (req, res) => {
  try {
    await req.user
      .populate({
        path: "boards"
      })
      .execPopulate();
    res.send(req.user.boards);
  } catch (e) {
    res.status(500).send();
  }
});

router.delete("/boards/:id", auth, async (req, res) => {
  try {
    const board = await Board.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id
    });
    if (!board) {
      return res.status(404).send();
    }
    res.send(board);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;

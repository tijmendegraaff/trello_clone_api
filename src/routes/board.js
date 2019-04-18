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

router.patch("/boards/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name"];

  const isValidOperation = updates.every(update => {
    return allowedUpdates.includes(update);
  });

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid update" });
  }

  try {
    const board = await Board.findOne({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!board) {
      return res.status(404).send();
    }

    updates.forEach(update => {
      board[update] = req.body[update];
    });

    await board.save();

    res.send(board);
  } catch (e) {
    res.status(400).send(e);
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

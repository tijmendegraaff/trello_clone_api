const express = require("express");
const router = new express.Router();

const Board = require("../models/board");
const List = require("../models/list");
const Task = require("../models/task");

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
// Add list to board
router.post("/boards/:id", auth, async (req, res) => {
  const list = new List({
    ...req.body,
    boardId: req.params.id
  });

  try {
    const currentBoard = await Board.findById({ _id: req.params.id });
    await list.save();
    currentBoard.lists.push(list);
    await currentBoard.save();
    res.status(201).send(list);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Add task to list
router.post("/lists/:id", auth, async (req, res) => {
  const task = new Task({
    ...req.body,
    listId: req.params.id
  });

  try {
    const currentList = await List.findById({ _id: req.params.id });
    await task.save();
    currentList.tasks.push(task);
    await currentList.save();

    res.status(201).send(task);
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

router.get("/boards/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const board = await Board.findOne({ _id, owner: req.user.id })
      .populate({
        path: "lists",
        populate: {
          path: "tasks"
        }
      })
      .exec();
    res.send(board);
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

const express = require("express");
require("./db/mongoose");
// Import Routes
const userRouter = require("./routes/user");
const boardRouter = require("./routes/board");

const app = express();

app.use(express.json());
app.use(userRouter);
app.use(boardRouter);

module.exports = app;

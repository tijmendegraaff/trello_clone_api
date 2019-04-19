const express = require("express");
const cors = require("cors");
require("./db/mongoose");
// Import Routes
const userRouter = require("./routes/user");
const boardRouter = require("./routes/board");

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:8080"],
    credentials: true
  })
);
app.use(userRouter);
app.use(boardRouter);

module.exports = app;

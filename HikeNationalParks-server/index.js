const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");

const PORT = 8081;

app.use(cors());
app.use(bodyParser.json());

// routes

// error handler if no routes reached
app.use(function (req, res, next) {
  let error = new Error("Not Found");
  error.status = 404;
  next(error);
});

app.listen(PORT, function () {
  console.log(`Server is starting on port ${PORT}`);
});

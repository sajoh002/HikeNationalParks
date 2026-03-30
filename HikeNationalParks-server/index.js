require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const errorHandler = require("./handlers/error");
const authRoutes = require("./routes/auth");
const nationalParkRoutes = require("./routes/nationalParks");
const PORT = 8081;

app.use(cors());
app.use(bodyParser.json());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/nationalParks", nationalParkRoutes);

// error handler if no routes reached
app.use(function (req, res, next) {
  let error = new Error("Not Found");
  error.status = 404;
  next(error);
});

app.use(errorHandler);

app.listen(PORT, function () {
  console.log(`Server is starting on port ${PORT}`);
});

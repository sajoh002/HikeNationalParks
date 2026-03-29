require("dotenv").load();
const jwt = require("jsonwebtoken");

exports.isLoggedIn = function (req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
      if (decoded) {
        return next();
      } else {
        next({
          status: 401,
          message: "Please sign in first",
        });
      }
    });
  } catch (err) {
    next({
      status: 401,
      message: "Please sign in first",
    });
  }
};

exports.ensureCorrectUser = function (req, res, next) {};

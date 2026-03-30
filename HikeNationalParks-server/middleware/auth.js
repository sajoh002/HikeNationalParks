const jwt = require("jsonwebtoken");
const db = require("../models");

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

exports.isNationalParkAuthor = async function (req, res, next) {
  try {
    const nationalPark = await db.NationalPark.findById(req.params.id);
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
      if (decoded && decoded.id === nationalPark.author.id) {
        return next();
      } else {
        return next({
          status: 401,
          message: "Unauthorized",
        });
      }
    });
  } catch (err) {
    next({
      status: 401,
      message: "Unauthorized",
    });
  }
};

exports.isSightAuthor = async function (req, res, next) {
  try {
    const sight = await db.Sight.findById(req.params.sightId);
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
      if (decoded && decoded.id === sight.author.id) {
        return next();
      } else {
        return next({
          status: 401,
          message: "Unauthorized",
        });
      }
    });
  } catch (err) {
    next({
      status: 401,
      message: "Unauthorized",
    });
  }
};

exports.isReviewAuthor = async function (req, res, next) {
  try {
    const review = await db.Review.findById(req.params.reviewId);
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
      if (decoded && decoded.id === review.author.id) {
        return next();
      } else {
        return next({
          status: 401,
          message: "Unauthorized",
        });
      }
    });
  } catch (err) {
    next({
      status: 401,
      message: "Unauthorized",
    });
  }
};

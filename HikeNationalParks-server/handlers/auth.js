const db = require("../models");
const jwt = require("jsonwebtoken");

exports.login = async function (req, res, next) {
  try {
    let user = await db.User.findOne({ username: req.body.username });
    let { id, username } = user;
    let isMatch = await user.comparePassword(req.body.password);
    if (isMatch) {
      let token = jwt.sign(
        {
          id,
          username,
        },
        process.env.JWT_SECRET
      );
      return res.status(200).json({
        id,
        username,
        token,
      });
    } else {
      return next({
        status: 400,
        message: "Invalid username and/or password.",
      });
    }
  } catch (err) {
    return next({
      status: 400,
      message: "Invalid username and/or password.",
    });
  }
};

exports.register = async function (req, res, next) {
  try {
    let user = await db.User.create(req.body);
    let { id, username } = user;
    let token = jwt.sign(
      {
        id,
        username,
      },
      process.env.JWT_SECRET
    );
    return res.status(200).json({
      id,
      username,
      token,
    });
  } catch (err) {
    // if validation fails
    if (err.code === 11000) {
      err.message = "Sorry, that email and/or username is taken";
    }

    return next({
      status: 400,
      message: err.message,
    });
  }
};

const express = require("express");
const router = express.Router();

const {
  createNationalPark,
  getAllNationalParks,
  getNationalPark,
  updateNationalPark,
} = require("../handlers/nationalParks");
const { isLoggedIn, isNationalParkAuthor } = require("../middleware/auth");

router.route("/").get(getAllNationalParks).post(isLoggedIn, createNationalPark);

router
  .route("/:id")
  .get(getNationalPark)
  .put(isLoggedIn, isNationalParkAuthor, updateNationalPark);

module.exports = router;

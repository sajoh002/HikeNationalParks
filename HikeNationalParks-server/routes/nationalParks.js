const express = require("express");
const router = express.Router();
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

const {
  createNationalPark,
  getAllNationalParks,
  getNationalPark,
  updateNationalPark,
} = require("../handlers/nationalParks");
const { isLoggedIn, isNationalParkAuthor } = require("../middleware/auth");

router
  .route("/")
  .get(getAllNationalParks)
  .post(isLoggedIn, upload.array("image"), createNationalPark);

router
  .route("/:id")
  .get(getNationalPark)
  .put(
    isLoggedIn,
    isNationalParkAuthor,
    upload.array("image"),
    updateNationalPark
  );

module.exports = router;

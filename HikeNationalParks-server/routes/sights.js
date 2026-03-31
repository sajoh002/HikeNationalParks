const express = require("express");
const router = express.Router({ mergeParams: true });
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

const {
  createSight,
  getSight,
  updateSight,
  deleteSight,
} = require("../handlers/sights");
const { isLoggedIn, isSightAuthor } = require("../middleware/auth");

router.route("/").post(isLoggedIn, upload.array("image"), createSight);

router
  .route("/:sightId")
  .get(getSight)
  .put(isLoggedIn, isSightAuthor, upload.array("image"), updateSight)
  .delete(isLoggedIn, isSightAuthor, deleteSight);

module.exports = router;

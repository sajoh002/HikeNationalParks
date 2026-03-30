const express = require("express");
const router = express.Router({ mergeParams: true });

const {
  createSight,
  getSight,
  updateSight,
  deleteSight,
} = require("../handlers/sights");
const { isLoggedIn, isSightAuthor } = require("../middleware/auth");

router.route("/").post(isLoggedIn, createSight);

router
  .route("/:sightId")
  .get(getSight)
  .put(isLoggedIn, isSightAuthor, updateSight)
  .delete(isLoggedIn, isSightAuthor, deleteSight);

module.exports = router;

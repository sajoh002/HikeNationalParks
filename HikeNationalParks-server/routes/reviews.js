const express = require("express");
const router = express.Router({ mergeParams: true });

const { createReview, deleteReview } = require("../handlers/reviews");
const { isLoggedIn, isReviewAuthor } = require("../middleware/auth");

router.route("/").post(isLoggedIn, createReview);

router.route("/:reviewId").delete(isLoggedIn, isReviewAuthor, deleteReview);

module.exports = router;

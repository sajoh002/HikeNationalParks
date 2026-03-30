const db = require("../models");

// POST /api/nationalparks/:id/sights/:sightId/reviews/
exports.createReview = async function (req, res, next) {
  try {
    const sight = await db.Sight.findById(req.params.sightId);
    const review = new db.Review(req.body.review);
    review.author = req.user._id;
    sight.reviews.push(sight);
    await review.save();
    await sight.save();
    const foundReview = await db.Review.findById(review.id);
    res.status(200).json({ foundReview });
  } catch (err) {
    return next(err);
  }
};

// DELETE /api/nationalParks/:id/sights/:sightId/reviews/:reviewId
exports.deleteReview = async function (req, res, next) {
  try {
    const foundReview = await db.Review.findByIdAndDelete(req.params.reviewId);
    return res.status(200).json(foundReview);
  } catch (err) {
    return next(err);
  }
};

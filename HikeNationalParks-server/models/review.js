const mongoose = require("mongoose");
const User = require("./user");
const Sight = require("./sight");

const reviewSchema = new mongoose.Schema({
  body: String,
  rating: Number,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  sight: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Sight",
  },
});

reviewSchema.pre(
  "findOneAndDelete",
  { document: true, query: false },
  async function (next) {
    let sight = await Sight.findById(this.sight);
    sight.reviews.deleteOne(this.id);
    await sight.save();
    next();
  }
);

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;

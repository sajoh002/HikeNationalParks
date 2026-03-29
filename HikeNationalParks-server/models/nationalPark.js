const mongoose = require("mongoose");
const User = require("./user");

const imageSchema = new mongoose.Schema({
  url: String,
  filename: String,
});

imageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_200");
});

const opts = { toJSON: { virtuals: true } };

const nationalParkSchema = new mongoose.Schema(
  {
    title: String,
    images: [imageSchema],
    geometry: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    description: String,
    state: String,
    price: String,
    pricePer: String,
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    sights: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Sight",
      },
    ],
  },
  opts
);

const NationalPark = mongoose.model("NationalPark", nationalParkSchema);

module.exports = NationalPark;

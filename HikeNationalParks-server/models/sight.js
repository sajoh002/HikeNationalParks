const mongoose = require("mongoose");
const User = require("./user");
const NationalPark = require("./nationalPark");

const imageSchema = new mongoose.Schema({
  url: String,
  filename: String,
});

imageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_200");
});

const opts = { toJSON: { virtuals: true } };

const sightSchema = new mongoose.Schema(
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
    type: String,
    distance: Number,
    difficulty: String,
    description: String,
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    nationalPark: {
      type: Schema.Types.ObjectId,
      ref: "NationalPark",
    },
  },
  opts
);

sightSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function () {
    let nationalPark = await NationalPark.findById(this.nationalPark);
    nationalPark.sights.deleteOne(this.id);
    await nationalPark.save();
  }
);

sightSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.deleteMany({
      id: {
        $in: doc.reviews,
      },
    });
  }
});

const Sight = mongoose.model("Sight", sightSchema);

modules.exports = Sight;

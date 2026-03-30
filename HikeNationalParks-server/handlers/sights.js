const db = require("../models");
const { cloudinary } = require("../cloudinary");

// POST /api/nationalparks/:id/sights
exports.createSight = async function (req, res, next) {
  try {
    const nationalPark = await db.NationalPark.findById(req.params.id);
    const sight = new db.Sight(req.body.sight);
    sight.geometry = {
      type: "Point",
      coordinates: [
        req.body.coordinates.longitude,
        req.body.coordinates.latitude,
      ],
    };
    sight.images = req.files.map((f) => ({
      url: f.path,
      filename: f.filename,
    }));
    sight.author = req.user._id;
    nationalPark.sights.push(sight);
    await sight.save();
    await nationalPark.save();
    const foundSight = await db.Sight.findById(sight.id);
    res.status(200).json({ foundSight });
  } catch (err) {
    return next(err);
  }
};

// GET /api/nationalParks/:id/sight/:sightId
exports.getSight = async function (req, res, next) {
  try {
    const nationalPark = await db.NationalPark.findById(req.params.id);
    const sight = await db.Sight.findById(req.params.sightId)
      .populate({
        path: "reviews",
        populate: {
          path: "author",
        },
      })
      .populate("author");
    return res.status(200).json({ sight, nationalPark });
  } catch (err) {
    return next(err);
  }
};

// PUT /api/nationalParks/:id/sight/:sightId
exports.updateSight = async function (req, res, next) {
  try {
    const sight = await db.Sight.findByIdAndUpdate(
      req.params.sightId,
      {
        ...req.body.sight,
      },
      { new: true }
    );
    const imgs = req.files.map((f) => ({
      url: f.path,
      filename: f.filename,
    }));
    sight.images.push(...imgs);
    await sight.save();
    if (req.body.deleteImages) {
      for (let filename of req.body.deleteImages) {
        await cloudinary.uploader.destroy(filename);
      }
      await sight.updateOne({
        $pull: { images: { filename: { $in: req.body.deleteImages } } },
      });
    }
    const foundSight = await db.Sight.findById(sight.id);
    return res.status(200).json(foundSight);
  } catch (err) {
    return next(err);
  }
};

// DELETE /api/nationalParks/:id/sights/:sightId
exports.deleteSight = async function (req, res, next) {
  try {
    const foundSight = await db.Sight.findByIdAndDelete(req.params.sightId);
    return res.status(200).json(foundSight);
  } catch (err) {
    return next(err);
  }
};

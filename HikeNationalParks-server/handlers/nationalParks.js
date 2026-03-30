const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const db = require("../models");
const { cloudinary } = require("../cloudinary");

const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

// POST /api/nationalParks/
exports.createNationalPark = async function (req, res, next) {
  try {
    const geoData = await geocoder
      .forwardGeocode({
        query: req.body.nationalPark.title,
        limit: 1,
      })
      .send();
    const nationalPark = new db.NationalPark(req.body.nationalPark);
    nationalPark.geometry = geoData.body.features[0].geometry;
    nationalPark.images = req.files.map((f) => ({
      url: f.path,
      filename: f.filename,
    }));
    nationalPark.author = req.user.id;
    await nationalPark.save();
    const foundNationalPark = await db.NationalPark.findById(nationalPark.id);
    res.status(200).json({ foundNationalPark });
  } catch (err) {
    return next(err);
  }
};

// GET /api/nationalParks
exports.getAllNationalParks = async function (req, res, next) {
  try {
    const nationalParks = await db.NationalPark.find();
    nationalParks.sort((a, b) => a.title.localeCompare(b.title));
    return res.status(200).json(nationalParks);
  } catch (err) {
    return next(err);
  }
};

// GET /api/nationalParks/:id
exports.getNationalPark = async function (req, res, next) {
  try {
    const nationalPark = await db.NationalPark.find(req.params.id)
      .populate("sights")
      .populate("author");
    return res.status(200).json(nationalPark);
  } catch (err) {
    return next(err);
  }
};

// PUT /api/nationalParks/:id
exports.updateNationalPark = async function (req, res, next) {
  try {
    const nationalPark = await db.NationalPark.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body.nationalParh,
      },
      { new: true }
    );
    const imgs = req.files.map((f) => ({
      url: f.path,
      filename: f.filename,
    }));
    nationalPark.images.push(...imgs);
    await nationalPark.save();
    if (req.body.deleteImages) {
      for (let filename of req.body.deleteImages) {
        await cloudinary.uploader.destroy(filename);
      }
      await nationalPark.updateOne({
        $pull: { images: { filename: { $in: req.body.deleteImages } } },
      });
    }
    const foundNationalPark = await db.NationalPark.findById(nationalPark.id);
    return res.status(200).json(foundNationalPark);
  } catch (err) {
    return next(err);
  }
};

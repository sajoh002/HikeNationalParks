const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const db = require("../models");
const { cloudinary } = require("../cloudinary");

const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

exports.createNationalPark = async function (req, res, next) {
  try {
    const geoData = await geocoder
      .forwardGeocode({
        query: req.body.nationalPark.title,
        limit: 1,
      })
      .send();
    let nationalPark = new db.NationalPark(req.body.nationalPark);
    nationalPark.geometry = geoData.body.features[0].geometry;
    nationalPark.images = req.files.map((f) => ({
      url: f.path,
      filename: f.filename,
    }));
    nationalPark.author = req.user.id;
    await nationalPark.save();
    let foundNationalPark = await db.NationalPark.findById(nationalPark.id);
    res.status(200).json({ foundNationalPark });
  } catch (err) {
    return next(err);
  }
};

exports.getNationalPark = async function (req, res, next) {};

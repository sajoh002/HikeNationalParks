const mongoose = require("mongoose");
mongoose.set("debug", true);
mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/hike");

module.exports.User = require("./user");
module.exports.NationalPark = require("./nationalPark");
module.exports.Sight = require("./sight");
module.exports.Review = require("./review");

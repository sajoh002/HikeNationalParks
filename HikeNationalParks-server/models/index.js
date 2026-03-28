const mongoose = require("mongoose");
mongoose.set("dubug", true);
mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/hike", {
  keepAlive: true,
  useMongoClient: true,
});

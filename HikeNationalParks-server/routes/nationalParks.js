const express = require("express");
const router = express.Router();

const { createNationalPark } = require("../handlers/nationalParks");

router.route("/").post(createNationalPark);

module.exports = router;

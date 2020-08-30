const express = require("express");

const router = express.Router();

const controller = require("./controllers/controller");

// this router file is to handle all the routing here
router.get("/",controller.renderHomePage);

router.post("/",controller.getWeather);

router.get("/about",controller.renderAboutPage);

module.exports = router; // export this router module because we need to have app.js as the single entry point

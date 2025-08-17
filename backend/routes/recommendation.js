const express = require("express");
const router = express.Router();
const getRecommendationsController = require("../controllers/recommendation.controller");
const authenticate = require("../middleware/auth.middleware");

router.get("/:userId",authenticate, getRecommendationsController.getRecommendations);

module.exports = router;
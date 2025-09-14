const express = require("express");
const multer = require("multer");
const { validateCv } = require("../controllers/cvController");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/validate", upload.single("cv"), validateCv);

module.exports = router;

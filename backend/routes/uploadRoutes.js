const express = require("express");
const router = express.Router();
const upload = require("../controllers/uploadController").upload;
const uploadFile = require("../controllers/uploadController").uploadFile;

router.post("/", upload.single("file"), uploadFile);

module.exports = router;

const express = require('express');
const router = express.Router();
const multer = require('multer');
const generateController = require('../controllers/generateController');

const upload = multer({ dest: 'uploads/' });

// POST /api/generate/upload
router.post('/upload', upload.single('file'), generateController.uploadAndGenerate);

module.exports = router;

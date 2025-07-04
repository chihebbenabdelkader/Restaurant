const express = require('express');
const router = express.Router();
const qrCodeController = require('../controllers/qrcode.controller');

router.post('/generate/:restaurantId', qrCodeController.generateQRCodes);

module.exports = router;


const express = require('express');
const passport = require('passport');
const router = express.Router();

const forgotPaswdController = require('../controllers/forgotPaswd_controller');

router.get('/forgot-password', forgotPaswdController.forgot);

module.exports = router;


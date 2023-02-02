const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');
const schemaPassword = require("../middleware/password");

router.post('/signup', schemaPassword, userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;

const express = require('express');
const router = express.Router();

const authCtrl = require('../controllers/auth');
const schemaPassword = require("../middleware/password");

router.post('/signup', schemaPassword, authCtrl.signup);
router.post('/login', authCtrl.login);

module.exports = router;

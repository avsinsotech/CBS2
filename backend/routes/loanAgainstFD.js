const express = require('express');
const router = express.Router();
const controller = require('../controllers/loanAgainstFDController');

router.get('/', controller.getLoanAgainstFDReport);

module.exports = router;

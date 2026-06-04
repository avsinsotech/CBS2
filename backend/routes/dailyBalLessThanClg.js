const express = require('express');
const router = express.Router();
const controller = require('../controllers/dailyBalLessThanClgController');

router.post('/report', controller.getDailyBalLessThanClgReport);
router.get('/text-report-view', controller.getDailyBalLessThanClgTextReport);

module.exports = router;

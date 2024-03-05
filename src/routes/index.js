const express = require('express');
const router = express.Router();
const homeRoutes = require('./home');
const authRoutes = require('./auth');
const actionRoutes = require('./actions');


router.use('/', homeRoutes);

router.use('/action', actionRoutes )
router.use('/auth',authRoutes);

module.exports = router;
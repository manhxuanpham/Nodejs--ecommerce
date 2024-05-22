'use strict'
const express = require('express');
const { apiKey, permission } = require('../auth/checkAuth');
const {pushLogToDiscord} = require('../middlewares/index')
const router = express.Router();

//add log discord
router.use(pushLogToDiscord)
//check apiKey
router.use(apiKey)
//check permission
router.use(permission('0000'));

router.use('/v1/api/category', require('./category'))
router.use('/v1/api/subcategory', require('./subcategory'))

router.use('/v1/api/product', require('./product'))
router.use('/v1/api', require('./access'))
router.use('/v1/api/discount', require('./discount'))
router.use('/v1/api/cart', require('./cart'))
router.use('/v1/api/checkout', require('./checkout'))
router.use('/v1/api/order', require('./order'))


module.exports = router
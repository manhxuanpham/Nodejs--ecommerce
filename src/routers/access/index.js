'use strict'
const express = require('express');
const accessController = require('../../controllers/access.controller');
const {catchAsync,asyncHandler } = require('../../helpers/catch.async')

const router = express.Router();

router.post('/shop/sigup',asyncHandler(accessController.signUp))

module.exports = router
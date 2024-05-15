const express = require('express')
const router = express.Router()
const CheckoutController = require('../../controllers/checkout.controller')
const { authenticationV2 } = require("../../auth/authUtils");
const { asyncHandler } = require('../../helpers/asyncHandler')

router.use(authenticationV2)

router.post('', asyncHandler(CheckoutController.getCheckOut))



// router
module.exports = router
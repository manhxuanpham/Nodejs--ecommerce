const express = require('express')
const router = express.Router()
const OrderController = require('../../controllers/order.controller')
const { authenticationV2 } = require("../../auth/authUtils");
const { asyncHandler } = require('../../helpers/asyncHandler')

router.use(authenticationV2)

router.post('', asyncHandler(OrderController.orderByUser))



// router
module.exports = router
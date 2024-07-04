const express = require('express')
const router = express.Router()
const OrderController = require('../../controllers/order.controller')
const { authenticationV2 } = require("../../auth/authUtils");
const { asyncHandler } = require('../../helpers/asyncHandler')

router.use(authenticationV2)

router.post('', asyncHandler(OrderController.orderByUser))
router.post('/update-status', asyncHandler(OrderController.updateStatusByShop))
router.get('', asyncHandler(OrderController.getOrder))
router.get('/get-by-shop', asyncHandler(OrderController.getAllOrderByShop))
router.get('/get-revenue-month', asyncHandler(OrderController.getRevenueWithMonth))
router.get('/get-revenue-year', asyncHandler(OrderController.getRevenueWithYear))



// router
module.exports = router
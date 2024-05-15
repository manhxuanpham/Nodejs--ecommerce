const express = require('express')
const router = express.Router()
const CartController = require('../../controllers/cart.controller')
const { authenticationV2 } = require("../../auth/authUtils");
const { asyncHandler } = require('../../helpers/asyncHandler')

router.use(authenticationV2)



router.post('', asyncHandler(CartController.addToCart))
router.post('update', asyncHandler(CartController.update))


router.get('', asyncHandler(CartController.getList))
router.delete('', asyncHandler(CartController.delete))



// router
module.exports = router
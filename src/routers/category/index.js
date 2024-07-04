const express = require('express')
const router = express.Router()
const CategoryController = require('../../controllers/category.controller')
const { authenticationV2 } = require("../../auth/authUtils")
const { asyncHandler } = require('../../helpers/asyncHandler')



router.get('', asyncHandler(CategoryController.getAll))
router.use(authenticationV2)

router.post('', asyncHandler(CategoryController.create))
router.post('/insertmany', asyncHandler(CategoryController.createMany))
router.post('/update', asyncHandler(CategoryController.update))




// router
module.exports = router
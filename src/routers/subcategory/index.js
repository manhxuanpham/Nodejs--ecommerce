const express = require('express')
const router = express.Router()
const SubCategoryController = require('../../controllers/subcategory.controller')
const { authenticationV2 } = require("../../auth/authUtils");
const { asyncHandler } = require('../../helpers/asyncHandler')

router.use(authenticationV2)

router.post('', asyncHandler(SubCategoryController.create))
router.post('/insertmany', asyncHandler(SubCategoryController.createMany))
router.post('update', asyncHandler(SubCategoryController.update))




// router
module.exports = router
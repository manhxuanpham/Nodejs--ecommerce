'use strict'
const express = require('express');
const productController = require('../../controllers/product.controller');
const {asyncHandler } = require('../../helpers/asyncHandler')
const {authentication,authenticationV2} = require('../../auth/authUtils')
const router = express.Router();


router.get('/search/:keySearch',asyncHandler(productController.getListSearchProduct))
router.get('',asyncHandler(productController.findAllProducts))
router.get('/:product_id',asyncHandler(productController.findProduct))

// authentication
router.use(authenticationV2)
router.post('/create',asyncHandler(productController.createProduct))
router.patch('/:productId',asyncHandler(productController.updateProduct))
router.post('/publish/:id',asyncHandler(productController.publishProductForShop))
router.post('/unpublish/:id',asyncHandler(productController.unPublishProductForShop))

//Query

router.get('/drafts/all', asyncHandler(productController.getAllDraftsForShop))
router.get('/publish/all', asyncHandler(productController.getAllPublishForShop))

module.exports = router
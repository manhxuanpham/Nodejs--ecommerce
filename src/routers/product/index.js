'use strict'
const express = require('express');
const productController = require('../../controllers/product.controller');
const {asyncHandler } = require('../../helpers/asyncHandler')
const {authentication,authenticationV2} = require('../../auth/authUtils')
const router = express.Router();


router.get('/search/:keySearch',asyncHandler(productController.getListSearchProductv2))
// router.get('/search/:keySearch',asyncHandler(productController.getListSearchProduct))
router.get('/sku/select_variation',asyncHandler(productController.findOneSku))
router.get('/spu/get_spu_info',asyncHandler(productController.findOneSpu))
router.get('',asyncHandler(productController.findAllProducts))
router.get('/category/:categoryId',asyncHandler(productController.findAllSpuWithCategory))
router.get('/:product_id',asyncHandler(productController.findProduct))

// authentication
router.use(authenticationV2)
router.post('/spu/create',asyncHandler(productController.createSpu))
router.post('/spu/createMultiple',asyncHandler(productController.createMultipleSpu))
router.post('/create',asyncHandler(productController.createProduct))
router.patch('/:productId',asyncHandler(productController.updateProduct))
router.post('/publish/:id',asyncHandler(productController.publishProductForShop))
router.post('/unpublish/:id',asyncHandler(productController.unPublishProductForShop))

//Query

router.get('/drafts/all', asyncHandler(productController.getAllDraftsForShop))
router.get('/publish/all', asyncHandler(productController.getAllPublishForShop))


module.exports = router
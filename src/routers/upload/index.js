const express = require('express')
const router = express.Router()
const UploadController = require('../../controllers/upload.controller')
const { authenticationV2 } = require("../../auth/authUtils");
const { asyncHandler } = require('../../helpers/asyncHandler')
const {uploadDisk } = require('../../configs/multer.config')
router.use(authenticationV2)

router.post('/url', asyncHandler(UploadController.uploadImageFromUrl))

router.post('/product',uploadDisk.single('file'), asyncHandler(UploadController.uploadImageFromLocal))

// router
module.exports = router
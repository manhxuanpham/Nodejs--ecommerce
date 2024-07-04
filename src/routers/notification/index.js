const express = require('express')
const router = express.Router()
const NotificationController = require('../../controllers/notification.controller')
const { authenticationV2 } = require("../../auth/authUtils");


router.use(authenticationV2)
router.get('', NotificationController.listNotificationByUser)

// router
module.exports = router
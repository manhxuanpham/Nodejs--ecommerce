const { catchAsync, asyncHandler } = require('../helpers/asyncHandler')
const { OK } = require("../core/success.response");
const {listNotificationByUser} = require('../services/notification.service')

class NotificationController {
    listNotificationByUser = catchAsync(async (req, res, next) => {
        OK(res, "create noti success",
            await listNotificationByUser(req.body));
    })


}

module.exports = new NotificationController()
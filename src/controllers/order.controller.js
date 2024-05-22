const { catchAsync, asyncHandler } = require('../helpers/asyncHandler')
const { OK, CREATED } = require("../core/success.response");
const OrderService = require("../services/order.service");


class OrderController {
    orderByUser = catchAsync(async (req, res, next) => {
        CREATED(res, "ordered success",
            await OrderService.orderByUser(req.body));
    })

}

module.exports = new OrderController()
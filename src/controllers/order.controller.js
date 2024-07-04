const { catchAsync, asyncHandler } = require('../helpers/asyncHandler')
const { OK, CREATED } = require("../core/success.response");
const OrderService = require("../services/order.service");


class OrderController {
    orderByUser = catchAsync(async (req, res, next) => {
        CREATED(res, "ordered success",
            await OrderService.orderByUser(req.body));
    })
    getOrder = catchAsync(async (req, res, next) => {
        OK(res, "get Order success",
            await OrderService.getOrderByUser({userId:req.user.userId}));
    })
    
    getAllOrderByShop = catchAsync(async (req, res, next) => {
        OK(res, "get all Order by shop success",
            await OrderService.getAllOrderByShop({shopId:req.user.userId}));
    })
    getRevenueWithMonth = catchAsync(async (req, res, next) => {
        OK(res, "get revenue with moth Order success " + req.query.month,
            await OrderService.statisticsRevenueWithMonth({ order_shopId: req.user.userId, month: req.query.month, year: req.query.year }));
    })
    getRevenueWithYear = catchAsync(async (req, res, next) => {
        OK(res, "get revenue with moth Order success " + req.query.month,
            await OrderService.statisticsRevenueWithYear({ order_shopId: req.user.userId, year: req.query.year }));
    })
    updateStatusByShop = catchAsync(async (req, res, next) => {
        CREATED(res, "update status order success",
            await OrderService.updateOrderStatusByShop(req.body));
    })

}

module.exports = new OrderController()
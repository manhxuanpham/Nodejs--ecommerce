const { catchAsync, asyncHandler } = require('../helpers/asyncHandler')
const { OK } = require("../core/success.response");
const CheckoutService = require("../services/checkout.service");

class CheckoutController {
    getCheckOut = catchAsync(async (req, res, next) => {
        OK(res, "get review order success",
            await CheckoutService.checkoutReview(req.body));
    })

    
}

module.exports = new CheckoutController()
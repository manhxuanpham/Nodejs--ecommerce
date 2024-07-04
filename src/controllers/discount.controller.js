const {catchAsync,asyncHandler} = require('../helpers/asyncHandler')
const { OK } = require("../core/success.response");
const DiscountService  = require("../services/discount.service");

class DiscountController {
    createDiscountCode = asyncHandler(async (req, res, next) => {
        OK(res, "Create discount success",
            await DiscountService.createDiscountCode({
                ...req.body,
                shopId: req.user.userId
            }));
    })

    updateDiscountCode = asyncHandler(async (req, res) => {
        OK(res, "Update discount success",
            await DiscountService.updateDiscountCode({
                ...req.body,
                shopId: req.user.userId
            }));
    })

    getAllDiscountCodeWithProduct = asyncHandler(async (req, res) => {
        OK(res, "Get product with discount Code success",
        await DiscountService.getAllDiscountCodesWithProduct({
            ...req.query,
            shopId: req.user.userId,
        }));

    })

    getAllDiscountCodesByShop = asyncHandler(async (req, res) => {
        OK(res, "Get all discount codes success",
            await DiscountService.getAllDiscountCodesByShop({
                ...req.query
            }));
    })

    getDiscountAmount = asyncHandler(async (req, res) => {
        OK(res, "Get discount amount success",
            await DiscountService.getDiscountAmount({
                ...req.body,
                shopId: req.user.userId
            }));
    })

    deleteDiscountCode = asyncHandler(async (req, res) => {
        OK(res, "Delete discount success",
            await DiscountService.deleteDiscountCode({
                ...req.body,
                shopId: req.user.userId
            }));
    })

    cancelDiscountCode = asyncHandler(async (req, res) => {
        OK(res, "Cancel discount success",
            await DiscountService.cancelDiscountCode({
                ...req.body,
                shopId: req.user.userId
            }));
    })

}

module.exports = new DiscountController()
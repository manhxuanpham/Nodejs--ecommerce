const { findCartById } = require("../models/repositories/cart.repo");
const { Api404Error, BusinessLogicError } = require("../core/error.response");
const { checkProductByServer } = require("../models/repositories/product.repo");
const DiscountService  = require("./discount.service");

class CheckoutService {
    static async checkoutReview({
        cartId, userId, shop_order_ids = []
    }) {

        // check cartId exists
        const foundCart = findCartById(cartId)
        if (!foundCart) throw new Api404Error(`Cart don't exists`)

        const checkout_order = {
            totalPrice: 0, // tong tien hang
            feeShip: 0, // phi van chuyen
            totalDiscount: 0, // tong tien giam gia
            totalCheckout: 0 // tong thanh toan
        }, shop_order_ids_new = []
        
        // calculator bill
        for (let i = 0; i < shop_order_ids.length; i++) {
            const { shopId, shop_discounts = [], item_products = [] } = shop_order_ids[i]

            // check product available
            const checkProductServer = await checkProductByServer(item_products)
            // if (!checkout_order[0]) throw new BusinessLogicError('Order invalid')
                
            // sum total order
            const checkoutPrice = checkProductServer.reduce((acc, product) => {
                return acc + (product.quantity * product.price)
            }, 0)

            // total before
            checkout_order.totalPrice = +checkoutPrice

            const itemCheckout = {
                shopId,
                shop_discounts,
                priceRow: checkoutPrice,
                priceApplyDiscount: checkoutPrice,
                item_products: checkProductServer
            }

            // neu shop_discounts ton tai > 0, check valid
            if (shop_discounts.length > 0) {
                const { totalPrice, discount = 0 } = await DiscountService.getDiscountAmount({
                    codeId: shop_discounts[0].discount_code,
                    userId,
                    shopId:shop_discounts[0].shop_id,
                    products: checkProductServer 
                })
                checkout_order.totalDiscount += discount
                if (discount > 0) {
                    itemCheckout.priceApplyDiscount = checkoutPrice - discount
                }
            }

            // tong thanh toan cuoi cung
            checkout_order.totalCheckout += itemCheckout.priceApplyDiscount
            shop_order_ids_new.push(itemCheckout)
        }

        return {
            shop_order_ids,
            shop_order_ids_new,
            checkout_order
        }
    }
}

module.exports = CheckoutService
const { findCartById } = require("../models/repositories/cart.repo");
const { Api404Error, BusinessLogicError, BadRequestError } = require("../core/error.response");
const { checkProductByServer, findProductbyId } = require("../models/repositories/product.repo");
const { DiscountService } = require("./discount.service");
const CheckoutService = require("./checkout.service");
const ORDER_MODEL = require("../models/order.model")
const { getProductById } = require("../models/repositories/product.repo")
const { randomOrderId } = require("../utils");
const { deleteProductFromCart } = require("./cart.service");
const { decreaseQuantityById } = require("./sku.service")
const { oneSpuV2 } = require("./spu.service")
class OrderService {

    /*
        {
            cartId,
            userId,
            shop_order_ids: [
                {
                    shopId,
                    shop_discounts: [
                        {
                            shopId,
                            discountId,
                            codeId
                        }
                    ],
                    item_products: [
                        {
                            price,
                            quantity,
                            productId
                        }
                    ]
                }
            ]
        }
     */


    static async orderByUser({
        shop_order_ids_new,
        cartId,
        userId,
        user_address = {},
        user_payment = {}
    }) {
        const { checkout_order }
            = await CheckoutService.checkoutReview({
                cartId: cartId,
                userId: userId,
                shop_order_ids: shop_order_ids_new
            })
        // check lai mot lan nua xem ton kho hay k
        // get new array products
        const products = shop_order_ids_new.flatMap(order => order.item_products)
        console.log('[1]::', products)

        // for (let i = 0; i < products.length; i++) {
        //     const { productId, quantity,sku_id } = products[i];
        //     const checkStock = await getProductById(productId,sku_id);
        //     if (quantity > checkStock.quantity ) {
        //         throw new BadRequestError("product not available");
        //     }
        // }
        const checkStockPromises = products.map(async (product) => {
            const { productId, quantity, sku_id } = product;
            const checkStock = await getProductById(productId, sku_id);
            if (quantity > checkStock.quantity) {
                return Promise.reject(new BusinessLogicError("product not available"));
            }
        });
        await Promise.all(checkStockPromises);

        const order_product_info = products.map(async (product) => {
            return await oneSpuV2({ sku_id: product.sku_id, product_id: product.productId })
        })
        const productDetails = await Promise.all(order_product_info);

        console.log("$$order_product", productDetails)
        const newOrder = await ORDER_MODEL.create({
            oder_userId: userId,
            order_checkout: checkout_order,
            order_shipping: user_address,
            order_payment: user_payment,
            order_products: productDetails,
            tracking_number: `#+${randomOrderId()}`
        })
        if (newOrder) {
            //remove product in cart
            // decrease stock in inventory
            await Promise.all(products.map(async (product) => {
                await deleteProductFromCart({ userId, productId: product.productId })
                await decreaseQuantityById({ sku_id: product.sku_id, quantity: product.quantity })
            }))
        }
        return newOrder
    }

    static async getOrderByUser({userId}) {
        const foundOrder = ORDER_MODEL.find({userId})

    }

    static async getOneOrderByUser() {

    }

    static async cancelOrderByUser() {

    }

    static async updateOrderStatusByShop() {

    }
}

module.exports = OrderService
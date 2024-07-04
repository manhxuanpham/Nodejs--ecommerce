const { findCartById } = require("../models/repositories/cart.repo");
const { Api404Error, BusinessLogicError, BadRequestError } = require("../core/error.response");
const { checkProductByServer, findProductbyId } = require("../models/repositories/product.repo");
const { DiscountService } = require("./discount.service");
const CheckoutService = require("./checkout.service");
const ORDER_MODEL = require("../models/order.model")
const { getProductById } = require("../models/repositories/product.repo")
const { randomOrderId,convertToObjectIdMongodb } = require("../utils");
const { deleteProductFromCart } = require("./cart.service");
const { decreaseQuantityById } = require("./sku.service")
const  moment  = require('moment')

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
        const checkout_orderV2 = shop_order_ids_new.map(order => { return {priceRow: order.priceRow, priceApplyDiscount:order.priceApplyDiscount} })
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

        // const order_product_info = products.map(async (product) => {
        //     return await oneSpuV2({ sku_id: product.sku_id, product_id: product.productId })
        // })
        //const productDetails = await Promise.all(order_product_info);
        const productDetails = products
      
        const newOrder = shop_order_ids_new.length>= 2 ? 
        shop_order_ids_new.map(async (order) => {
                await ORDER_MODEL.create({
                    order_shopId: order.shopId,
                    order_userId: userId,
                    order_checkout: { totalPrice: order.priceRow, totalCheckout: order.priceApplyDiscount },
                    order_shipping: user_address,
                    order_payment: user_payment,
                    order_products: order.item_products,
                    order_trackingNumber: `#${randomOrderId()}`
                })
            })
            :
                await ORDER_MODEL.create({
                    order_shopId:shop_order_ids_new[0].shopId,
                    order_userId: userId,
                    order_checkout: checkout_order,
                    order_shipping: user_address,
                    order_payment: user_payment,
                    order_products: productDetails,
                    order_trackingNumber: `#${randomOrderId()}`
                })
        
        console.log("$$order_product", productDetails)
        // const newOrder = await ORDER_MODEL.create({
        //     order_userId: userId,
        //     order_checkout: checkout_order,
        //     order_shipping: user_address,
        //     order_payment: user_payment,
        //     order_products: productDetails,
        //     tracking_number: `#+${randomOrderId()}`
        // })
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
        const foundOrder = ORDER_MODEL.find({ order_userId: userId }).sort({ _id: -1 }).lean()
        return foundOrder
    }

    static async getOneOrderByUser() {

    }
    static async getAllOrderByShop({shopId}) {
        return ORDER_MODEL.find({ order_shopId: shopId }).sort({ _id: -1 }).lean()

    }
    static async cancelOrderByUser() {

    }

    static async updateOrderStatusByShop({order_id,order_status}) {
        const orderFound = await ORDER_MODEL.findOneAndUpdate({order_trackingNumber:order_id},{
            order_status: order_status
        },{new:true});
        return orderFound
    }
    static async statisticsRevenueWithMonth({ order_shopId,month ,year }) {
        var date = new Date();
        date.setMonth(month)
        date.setFullYear(year)
        var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        // year = year || moment().year()
        // month = month || moment().month()
        // const firstDayOfMonth = moment([year, month]).startOf('day'); // Đảm bảo bắt đầu từ 00:00 của ngày đầu tiên trong tháng
        // const lastDayOfMonth = moment(firstDayOfMonth).endOf('month'); // Ngày cuối cùng của tháng // Tạo một moment tại ngày cuối cùng của tháng
        const results = await ORDER_MODEL.aggregate([
            {
                $match: {
                    order_shopId: convertToObjectIdMongodb(order_shopId),
                    createOn: { $gte: firstDay, $lte: lastDay },
                    order_status: 'confirmed' // Giả sử chỉ tính những đơn hàng đã hoàn thành
                }
            },
            {
                $group: {
                    _id: null, // Nhóm tất cả đơn hàng lại để tính tổng
                    totalRevenue: { $sum: "$order_checkout.totalCheckout" } 
                }
            }
        ]);
        return results.length > 0 ? results[0].totalRevenue : 0;
    }
    static async statisticsRevenueWithYear({ order_shopId, year }) {
        // Tạo ngày đầu tiên và cuối cùng của năm
        const firstDayOfYear = new Date(year, 0, 1); // Ngày đầu tiên của năm
        const lastDayOfYear = new Date(year, 12, 0); // Ngày cuối cùng của năm

        const results = await ORDER_MODEL.aggregate([
            {
                $match: {
                    order_shopId:convertToObjectIdMongodb(order_shopId),
                    createOn: { $gte: firstDayOfYear, $lte: lastDayOfYear },
                    order_status: 'confirmed'  // Giả sử chỉ tính những đơn hàng đã hoàn thành
                }
            },
            {
                $group: {
                    _id: { $month: "$createOn" },  // Nhóm theo tháng của ngày tạo đơn hàng
                    totalRevenue: { $sum: "$order_checkout.totalCheckout" }  // Tính tổng doanh thu
                }
            },
            {
                $sort: { "_id": 1 }  // Sắp xếp kết quả theo tháng tăng dần
            }
        ]);



        // Khởi tạo mảng doanh thu cho mỗi tháng với giá trị mặc định là 0
        const monthlyRevenue = Array.from({ length: 12 }, (_, index) => ({
            month: "Tháng " + (index + 1),
            revenue: 0
        }));

        // Cập nhật doanh thu cho các tháng có trong kết quả aggregation
        results.forEach(result => {
            // Vì _id là số tháng và bắt đầu từ 1, cần trừ đi 1 để phù hợp với chỉ số mảng bắt đầu từ 0
            monthlyRevenue[result._id - 1].revenue = result.totalRevenue;
        });

        return monthlyRevenue;  // Trả về mảng doanh thu theo tháng
    }
}

module.exports = OrderService
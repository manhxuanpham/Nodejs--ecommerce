const { model } = require('mongoose')
const CART_MODEL = require('../models/cart.model')
const { findProductbyId } = require('../models/repositories/product.repo')
const { convertToObjectIdMongodb } = require('../utils')
const {Api404Error} = require('../core/error.response')


/**
 * Key Feature cart service
 * add product to cart
 * reduce product quantity
 * increase product quantity
 * get cart User
 * delete Cart User
 * delete Cart Item
 */

class CartService {
    static async createCart({ userId, product }) {
        const query = { cart_userId: convertToObjectIdMongodb(userId), cart_state: 'active' },
            updateOrInsert = {
                $addToSet: {
                    cart_products: product
                }
            }, options = { upsert: true, new: true }
        return await CART_MODEL.findOneAndUpdate(query, updateOrInsert, options)
    }
    // Hàm thêm một sản phẩm vào cart_products
    static async addProductToCart({userId, product}) {
        console.log("newProduct",product)
        const query = { cart_userId: userId, cart_state: 'active' };
        const update = {
            $push: {  // Sử dụng $push để thêm sản phẩm mới vào mảng cart_products
                cart_products: product
            }
        };
        const options = { new: true, upsert: true };

        return await CART_MODEL.findOneAndUpdate(query, update, options);

    
}
    static async updateCartQuantity({ userId, product }) {
        const { product_id, product_quantity } = product
        const query = { cart_userId: userId, 'cart_products.product_id': product_id, cart_state: 'active' },
            updateSet = {
                $inc: {
                    'cart_products.$.product_quantity': product_quantity 
                }
            }, options = { upsert: true, new: true }
        return await CART_MODEL.findOneAndUpdate(query, updateSet, options)
    }
    static async addToCart({ userId, product = {} }) {
        const userCart = await CART_MODEL.findOne({ cart_userId: convertToObjectIdMongodb(userId) })
        const productCart = await CART_MODEL.findOne({cart_userId:convertToObjectIdMongodb(userId),'cart_products.product_id': product.product_id})
        if (!userCart) {
            return await this.createCart({ userId, product })
        }
        // if exist cart but not have product
        if (!userCart.cart_products.length) {
            userCart.cart_products = [product]
            return await userCart.save()
        }
        //add more product to cart
        if(!productCart) {
            return await this.addProductToCart({userId,product})
        }
            // if exist cart and have product already so update quantity
        else return await this.updateCartQuantity({ userId, product })
        

    }
    // updateCart 
    /**
     * shop_order_ids:[
    {
        shopId,
        products: [
            {
                quantity,
                price,
                shopId,
                old_quantity,
                productId
            },
            version

        ]
    }
    ]
     */
    static async addToCartV2({userId,product}) {
        const {productId,quantity,old_quantity} = shop_order_ids[0]?.item_product[0]
        const foundProduct =  await findProductbyId(productId)
        if (!foundProduct) throw new Api404Error("notfound product")
        if (quantity == 0) {
            //delete
        }
        return await this.updateCartQuantity({userId,product:{
            productId,
            quantity:quantity - old_quantity
        }})
        
    }
    static async deleteProductFromCart({userId,productId}) {
        const query = { cart_userId: userId, cart_state: 'active' },
            updateSet = {
                $pull: {
                    cart_products: {
                        product_id:productId
                    }
                }
            }
        const result = await CART_MODEL.updateOne(query, updateSet);
        if (result.modifiedCount === 0) {
            console.log('No product was removed from the cart.');
            return false;  // Hoặc xử lý phù hợp
        }
        return true;

    }

    static async getListCart({userId}) {
        return await CART_MODEL.find({
            cart_userId: convertToObjectIdMongodb(userId), cart_state: 'active'
        }).lean()
    }
}

module.exports = CartService
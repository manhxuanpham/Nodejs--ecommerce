const CartService = require('../services/cart.service')

const { CREATED, OK } = require("../core/success.response")

class CartController {
    addToCart = async(req,res,next)=> {
        CREATED(res,'add to cart success', await CartService.addToCart(req.body))
    }
    update = async(req,res,next)=> {
        CREATED(res,'update to cart success', await CartService.addToCartV2(req.body))
    }
    delete = async(req,res,next)=> {
        CREATED(res, 'delete to cart success', await CartService.deleteProductFromCart(req.body))
    }
    getList = async(req,res,next)=> {
        OK(res,'get list to cart success', await CartService.getListCart(req.query))
    }
}
module.exports =  new CartController()
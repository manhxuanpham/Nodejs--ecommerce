const CART_MODEL = require('../cart.model')


const findCartById = async(cartId)=> {
    return CART_MODEL.findOne({cartId})
}

module.exports = {
    findCartById
}
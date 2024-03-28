const ProductService = require('../services/product.service')
const ProductServiceV2 = require('../services/product.service.xxx')
const {CREATED, OK} = require("../core/success.response")
const {asyncHandler,catchAsync} = require('../helpers/asyncHandler')

class ProductController {
    createProduct = async(req,res,next) => {
        console.log("req.body",{...req.body})

        CREATED(res,'create new product success',await ProductServiceV2.createProduct(req.body.product_type,
            {
                ...req.body,
                product_shop:req.user.userId
            
            }))
    }
}

module.exports = new ProductController()
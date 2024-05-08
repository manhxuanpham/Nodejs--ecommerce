const ProductService = require('../services/product.service')
const ProductServiceV2 = require('../services/product.service.xxx')
const { CREATED, OK } = require("../core/success.response")


const { oneSku } = require("../services/sku.service")
const { asyncHandler, catchAsync } = require('../helpers/asyncHandler')
const { newSpu, oneSpu } = require('../services/spu.service')

class ProductController {

    //SPU,SKU
    createSpu = async (req, res, next) => {

        const spu = await newSpu({ ...req.body, product_shop: req.user.userId })
        CREATED(res, 'success create spu', spu)
    }

    findOneSku = async (req, res, next) => {
        try {
            const { sku_id, product_id } = req.query;
            CREATED(res, "get sku one", await oneSku({ sku_id, product_id }))
        } catch (error) {

        }
    }
    findOneSpu = async (req, res, next) => {
        try {
            const { product_id } = req.query;
            console.log("#Product_id", product_id)
            CREATED(res, "Product One", await oneSpu({ spu_id: product_id }))
        } catch (error) {

        }
    }
    //END SPU, SKU


    createProduct = async (req, res, next) => {
        console.log("req.body", { ...req.body })

        CREATED(res, 'create new product success', await ProductServiceV2.createProduct(req.body.product_type,
            {
                ...req.body,
                product_shop: req.user.userId

            }))

    }
    publishProductForShop = async (req, res, next) => {
        CREATED(res, 'publish product success', await ProductServiceV2.publishProductByShop(
            {

                product_id: req.params.id,
                product_shop: req.user.userId

            }))
    }
    unPublishProductForShop = async (req, res, next) => {
        CREATED(res, 'Unpublish product success', await ProductServiceV2.unPublishProductByShop(
            {

                product_id: req.params.id,
                product_shop: req.user.userId

            }))
    }
    //update product 
    updateProduct = async (req, res, next) => {
        debugger
        CREATED(res, 'update product success', await ProductServiceV2.updateProduct(req.body.product_type, req.params.productId,
            {

                ...req.body,
                product_shop: req.user.userId
            }))
    }
    //Query//
    /**
     * @desc Get all drafts for shop
     * @param {Number} limit 
     * @param {Number} skip 
     * @return {Json}  
     */
    getAllDraftsForShop = async (req, res, next) => {


        OK(res, 'get draft product success', await ProductServiceV2.findAllDraftForShop(
            {
                product_shop: req.user.userId
            }))

    }
    getAllPublishForShop = async (req, res, next) => {


        OK(res, 'get publish product success', await ProductServiceV2.findAllPublishForShop(
            {
                product_shop: req.user.userId
            }))

    }
    getListSearchProduct = async (req, res, next) => {


        OK(res, 'get list product success', await ProductServiceV2.searchProducts(req.params))

    }
    findAllProducts = async (req, res, next) => {


        OK(res, 'find all product success', await ProductServiceV2.findAllProducts(req.query))

    }
    findProduct = async (req, res, next) => {


        OK(res, 'find product success', await ProductServiceV2.findProduct({
            product_id: req.params.product_id
        }))

    }
    //End Query //
}

module.exports = new ProductController()
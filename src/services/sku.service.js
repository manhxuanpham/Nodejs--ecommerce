const _ = require('lodash')
const { findOne } = require("../models/shop.model")
const SKU_MODEL = require("../models/sku.model")
const {randomProductId} = require("../utils/index")
const newSku = async ({ sku_list, spu_id }) => {
    try {
        const convert_sku_list = sku_list.map(sku=> {
            return {...sku,product_id:spu_id,sku_id:`${spu_id}.${randomProductId()}`}
        })
        const skus = await SKU_MODEL.create(convert_sku_list)
        return skus
    } catch (error) {
        return []
    }
}
const oneSku = async({sku_id,product_id})=> {
    try {
        const sku = await SKU_MODEL.findOne({
            sku_id,product_id
        })
        if (sku) {
            // set cached
        }
        return _.omit(sku,['__v','updateAt','createAt','isDeleted'])
    } catch (error) {
        return null
    }
}
const allSkuBySpuId = async ({ product_id }) => {
    try {
        const skus = await SKU_MODEL.find({ product_id }).lean()
        return skus
    } catch (error) {
        return null
    }
}
module.exports = {
    newSku,
    oneSku,
    allSkuBySpuId
}
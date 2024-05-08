const {findShopbyId} = require('../models/repositories/shop.repo')
const _ = require('lodash')
const SPU_MODEL = require("../models/spu.model")
const { BadRequestError } = require('../core/error.response')
const {randomProductId} = require("../utils/index")
const { newSku, allSkuBySpuId } = require("../services/sku.service")
const newSpu = async({
    product_name,
    product_thumb,
    product_description,
    product_quantity,
    product_price,
    product_category,
    product_shop,
    product_attributes,
    product_variations,
    sku_list = []

})=> {
    try {
        //1 check if shop exist
        const foundShop = findShopbyId({
            shop_id:product_shop
        })
        if (!foundShop) throw new BadRequestError("shop not invalid")
        // 2 create spu
    
        const spu = await SPU_MODEL.create({
            product_id:randomProductId(),
            product_name,
            product_thumb,
            product_description,
            product_quantity,
            product_price,
            product_category,
            product_shop,
            product_attributes,
            product_variations
            
        })
        if (spu) {
            //3 create SKU
            newSku({sku_list,spu_id:spu.product_id})
            .then()
        }
        //4  sync data via elasticsearch (search.service)
        
        //5 return result object
        return !!spu

    } catch (error) {
        console.error("Error occurred:", error);
    }
}
const oneSpu = async({spu_id})=> {
    try {
        const spu = SPU_MODEL.findOne({
            product_id:spu_id,
            isPublished:false
        }).lean()
        console.log("#spu",spu_id)
        if(!spu) throw new BadRequestError("spu not found")
        const skus = await allSkuBySpuId({product_id:spu_id})
        return {
            spu_info:_.omit(spu,['__v']),
            sku_list:skus.map(sku=>_.omit(sku,['__v','createAt']))
        }
    } catch (error) {
        console.log('not found',error)   
    }
}
module.exports = {
    newSpu, 
    oneSpu
}
const { findShopbyId } = require('../models/repositories/shop.repo')
const _ = require('lodash')
const SPU_MODEL = require("../models/spu.model")
const { BadRequestError, Api404Error } = require('../core/error.response')
const { randomProductId } = require("../utils/index")
const { newSku, allSkuBySpuId, oneSku } = require("../services/sku.service")
const newSpu = async ({
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

}) => {
    try {
        //1 check if shop exist
        const foundShop = findShopbyId({
            shop_id: product_shop
        })
        if (!foundShop) throw new BadRequestError("shop not invalid")
        // 2 create spu

        const spu = await SPU_MODEL.create({
            product_id: randomProductId(),
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
            newSku({ sku_list, spu_id: spu.product_id })
                .then()
        }
        //4  sync data via elasticsearch (search.service)

        //5 return result object
        return !!spu

    } catch (error) {
        console.error("Error occurred:", error);
    }
}
const oneSpu = async ({ spu_id }) => {
    try {
        const spu = await SPU_MODEL.findOne({
            product_id: spu_id,
            isPublished: false
        }).lean()
        console.log("#spu", spu_id)
        if (!spu) throw new BadRequestError("spu not found")
        const skus = await allSkuBySpuId({ product_id: spu_id })
        return {
            spu_info: _.omit(spu, ['__v']),
            sku_list: skus.map(sku => _.omit(sku, ['__v', 'createAt']))
        }
    } catch (error) {
        console.log('not found', error)
    }
}

const oneSpuV2 = async ({ sku_id, product_id }) => {
    try {
        // Tìm SKU dựa trên sku_id và product_id
        const sku = await oneSku({ sku_id, product_id })

        // Tìm sản phẩm SPU tương ứng để lấy thông tin biến thể
        const spu = await SPU_MODEL.findOne({
            product_id: product_id,
            isDeleted: false  // Giả sử bạn cũng muốn loại bỏ SPU đã xóa
        }).lean();

        if (!spu) throw new Api404Error("not found spu");  // Nếu không tìm thấy SPU, trả về null

        // Lấy ra các biến thể tương ứng từ sku.sku_tier_idx
        const variations = sku.sku_tier_idx.map((index, variantIndex) => {

            return {
                name: spu.product_variations[variantIndex].name,
                option: spu.product_variations[variantIndex].options[index],
                image: spu.product_variations[variantIndex].image[index]
            };
        });
        console.log(`variations::`, variations)

        // Trả về đối tượng SKU với các thông tin biến thể đã lọc và chỉ số biến thể tương ứng
        return {
            ..._.omit(spu, ['__v', 'updateAt', 'createAt', 'isDeleted', 'product_variations']),
            product_variation: variations  // Thêm thông tin biến thể vào kết quả trả về
        };
    } catch (error) {
        console.error('Error retrieving SKU:', error);
        return null;
    }
};
module.exports = {
    newSpu,
    oneSpu,
    oneSpuV2
}
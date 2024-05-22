const SPU_MODEL = require('../spu.model')
const {oneSku  }= require("../../services/sku.service")
const _ = require('lodash')

const findAllProducts = async ({ limit, sort, page, filter }) => {
    const skip = (page - 1) * limit;
    const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
    const products = await SPU_MODEL
        .find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .lean();
    return products
};
const getVariationFromIndex = async ({ sku_id, product_id })=> {

    const sku = await oneSku({ sku_id, product_id })

    // Tìm sản phẩm SPU tương ứng để lấy thông tin biến thể
    const spu = await SPU_MODEL.findOne({
        product_id: product_id,
        isDeleted: false  // Giả sử bạn cũng muốn loại bỏ SPU đã xóa
    }).lean();


    // Lấy ra các biến thể tương ứng từ sku.sku_tier_idx
 
    const variations = sku.sku_tier_idx.map((index, variantIndex) => {
        return {
            name: spu.product_variations[variantIndex].name,
            option: spu.product_variations[variantIndex].options[index],
            image: spu.product_variations[variantIndex].image[index]
        };
    });
    return 
}

module.exports = {findAllProducts,
    getVariationFromIndex
}
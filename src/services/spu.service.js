const { findShopbyId } = require('../models/repositories/shop.repo')
const fs = require('fs');
const _ = require('lodash')
const SPU_MODEL = require("../models/spu.model")
const { BadRequestError, Api404Error } = require('../core/error.response')
const { randomProductId } = require("../utils/index")
const { newSku, allSkuBySpuId, oneSku } = require("../services/sku.service")
const { pushNotiToSystem } = require('./notification.service')
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

        //push notification
        pushNotiToSystem({
            type:'SHOP-001',
            receivedId:1,
            senderId:spu.product_shop,
            options:{
                product_name:spu.product_name,
                shop_name:spu.product_shop
            }

        }).then(rs => console.log(rs))
        return !!spu

    } catch (error) {
        console.error("Error occurred:", error);
    }
}

const newSpus = async({products})=> {
    try {
        
        const data = fs.readFileSync('D:/Downloads/Compressed/Tiki_crawlData/data_thoitrangnu.json', 'utf8');
        const jsonData = JSON.parse(data);
        console.log(jsonData);
        // Đảm bảo tất cả các shop tồn tại và các sản phẩm hợp lệ
        for (const product of jsonData) {
            const foundShop = await findShopbyId({ shop_id: product.product_shop });
            if (!foundShop) {
                throw new BadRequestError("Shop not valid");
            }
        }

        // Tạo một danh sách promise để tạo tất cả SPUs
        const spuPromises = jsonData.map(async product => {
            const spu = await SPU_MODEL.create({
                product_id: randomProductId(),
                product_name: product.product_name,
                product_thumb: product.product_thumb,
                product_description: product.product_description,
                product_quantity: product.product_quantity,
                product_price: product.product_price,
                product_category: product.product_category,
                product_shop: product.product_shop,
                product_attributes: product.product_attributes,
                product_variations: product.product_variations
            });

            // Tạo SKU sau khi tạo SPU
            await newSku({ sku_list: product.sku_list, spu_id: spu.product_id });
            return spu;
        });

        // Đợi cho tất cả SPUs được tạo thành công
        const spus = await Promise.all(spuPromises);
        return spus.map(spu => !!spu);  // Trả về danh sách kết quả tạo SPU
    } catch (error) {
        console.error("Error occurred while creating multiple SPUs:", error);
        throw error;
    }
}
const oneSpu = async ({ spu_id }) => {
    try {
        const spu = await SPU_MODEL.findOne({
            product_id: spu_id,

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
const getAllSpuByShop = async({shopId,page=1,limit=10}) => {
    const skip = (page-1)*limit
    try {
        const spu = await SPU_MODEL.find({
            product_shop_id:shopId
            // isPublished: false
        }).skip(skip)
        .limit(limit)
        .lean()
        if (!spu) throw new BadRequestError("spu not found")
        return spu
    } catch (error) {
        console.log('not found', error)
    }
}
const getAllSpuWithCategory = async ({ product_category, page = 1, limit = 20 })=> {
    const skip = (page - 1) * limit
    try {
        const spu = await SPU_MODEL.find({
            product_category: +product_category
        }).skip(skip)
            .limit(limit)
            .lean()
        if (!spu) throw new BadRequestError("spu not found")
        return spu
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
    oneSpuV2,
    newSpus,
    getAllSpuWithCategory,
    getAllSpuByShop
}
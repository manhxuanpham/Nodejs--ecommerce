"use strict";
const SPU_MODEL = require('../spu.model')
const SKU_MODEL = require('../sku.model')
const _  = require('lodash')
const {
  product,
  electronic,
  furniture,
  clothing,
} = require("../product.model");
const { Types } = require("mongoose");
const { getSelectData, unGetSelectData, convertToObjectIdMongodb } = require("../../utils");
const { oneSpuV2 } = require("../../services/spu.service");
const findAllDraftForShop = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip });
};
const findAllPublishForShop = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip });
};
const searchProductByUser = async ({ keySearch }) => {
  const regexSearch = new RegExp(keySearch);
  const results = await SPU_MODEL
    .find(
      {
        // isPublished: true,
        $text: { $search: regexSearch },
      },
      {
        score: { $meta: "textScore" },
      }
    )
    .sort({ score: { $meta: "textScore" } })
    .lean();
  return results;
};
const searchProductByUserv2 = async ({ keySearch,limit,sort,page }) => {
  
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  const regexSearch = new RegExp(keySearch);
  const results = await SPU_MODEL
    .find(
      {
        // isPublished: true,
        $text: { $search: regexSearch },
      },
      {
        score: { $meta: "textScore" },
      }
    )
    .skip(skip)
    .limit(limit)
    .sort({ score: { $meta: "textScore" } })
    .lean();
  return results;
};
const queryProduct = async ({ query, limit, skip }) => {
  return await SPU_MODEL
    .find(query)
    .populate("product_shop", "name email -_id")
    .sort({ updateAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();
};

const findProductbyId = async(productId)=> {
  return product.findOne({_id:convertToObjectIdMongodb(productId)}).lean()
}

const findAllProducts = async ({ limit, sort, page, filter, select }) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: 1 } : { _id: -1 };
  const products = await SPU_MODEL
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean();
  return products;
};

const findProduct = async ({ product_id, unSelect }) => {
  return await product.findById(product_id).select(unGetSelectData(unSelect));
};

const getProductById = async(productId,skuId) => {
  try {
    const sku = await SKU_MODEL.findOne({
      product_id:productId, sku_id:skuId
    })
    return _.omit(sku, ['__v', 'updateAt', 'createAt', 'isDeleted'])
  } catch (error) {
    return null
  }
}

const checkProductByServer = async (products) => {
  return await Promise.all(
    products.map(async product => {
      const foundProduct = await getProductById(product.productId,product.sku_id)
      const spu = await oneSpuV2({ sku_id: product.sku_id, product_id: product.productId })
      if (foundProduct) {
        return {
          price: foundProduct.sku_price,
          quantity: product.quantity,
          productId: product.productId,
          sku_id:foundProduct.sku_id,
          name: spu.product_name,
          thumb: spu.product_thumb,
          variation: spu.product_variation
          
        }
      }
    })
  )
}

const publishProductByShop = async ({ product_shop, product_id }) => {
  const foundShop = await product.findOne({
    product_shop: new Types.ObjectId(product_shop),
    _id: new Types.ObjectId(product_id),
  });
  if (!foundShop) return null;

  foundShop.isDraft = false;
  foundShop.isPublished = true;
  const { modifiedCount } = await foundShop.updateOne(foundShop);

  return modifiedCount;
};
const unPublishProductByShop = async ({ product_shop, product_id }) => {
  const foundShop = await product.findOne({
    product_shop: new Types.ObjectId(product_shop),
    _id: new Types.ObjectId(product_id),
  });
  if (!foundShop) return null;

  foundShop.isDraft = true;
  foundShop.isPublished = false;
  const { modifiedCount } = await foundShop.updateOne(foundShop);

  return modifiedCount;
};
const updateProductById = async ({
  productId,
  bodyUpdate,
  model,
  isNew = true,
}) => {
  return await model.findByIdAndUpdate(productId, bodyUpdate, { new: isNew });
};

module.exports = {
  findAllDraftForShop,
  findAllPublishForShop,
  publishProductByShop,
  unPublishProductByShop,
  searchProductByUser,
  findAllProducts,
  findProduct,
  updateProductById,
  findProductbyId,
  checkProductByServer,
  getProductById,
  searchProductByUserv2
};

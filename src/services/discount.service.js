"use strict";
const { filter } = require("lodash");
const moment = require('moment')
const { BadRequestError } = require("../core/error.response");
const Discount = require("../models/discount.model");
const { convertToObjectIdMongodb } = require("../utils");
/*
discount service 
1-generator discount code [Shop | Admin]
2-get discount amount User
3- get all discount codes [Shop | Admin]
4- Verify discount code [user]
5- delêt discount code [Admin \ Shop]
6- cancel discount code [user]
*/
class DiscountService {
  static async createDiscountCode(payload) {
    const {
    discount_description,
    discount_type,
    discount_code,
    discount_value,
    discount_min_order_value,
    discount_max_value,
    discount_start_day,
    discount_end_day,
    discount_max_uses,
    discount_name,
    discount_uses_count,
    discount_users_used,
    discount_max_uses_per_user,
    discount_is_active,
    discount_applies_to,
    discount_product_ids,
    shopId
    } = payload;


    // kiểm tra
    // if (new moment() > moment(discount_start_day) || new moment() < moment(discount_end_day)) {
    //   throw new BadRequestError("discount code has expired!");
    // }
    const foundDiscount = await Discount
      .findOne({
        discount_code: discount_code,
        discount_shop_id: convertToObjectIdMongodb(shopId),
      })
      .lean();
    if (foundDiscount && foundDiscount.discount_is_active) {
      throw new BadRequestError("discount exist!");
    }
    const newDiscount = await Discount.create({
      discount_name: discount_name,
      discount_description: discount_description,
      discount_type: discount_type,
      discount_code: discount_code,
      discount_value: discount_value,
      discount_min_order_value: discount_min_order_value || 0,
      discount_max_value: discount_max_value,
      discount_start_day: moment.utc(discount_start_day),
      discount_end_day: moment.utc(discount_end_day),
      discount_max_uses: discount_max_uses,
      discount_uses_count: discount_uses_count,
      discount_users_used: discount_users_used,
      discount_shop_id: shopId,
      discount_max_uses_per_user: discount_max_uses_per_user,
      discount_is_active: discount_is_active,
      discount_applies_to: discount_applies_to,
      discount_product_ids: discount_product_ids === "all" ? [] : discount_product_ids
      
    });
    return newDiscount
  }
  static async updateDiscountCode() { }
  /*
        Get all discount codes available 
       */
  static async getAllDiscountCodesWithProduct({
    code,
    shopId,
    userId,
    limit,
    page,
  }) {
    const foundDiscount = await Discount
      .findOne({
        discount_code: code,
        discount_shopId: convertToObjectIdMongodb(shopId),
      })
      .lean();
    if (foundDiscount && foundDiscount.discount_is_active) {
      throw new BadRequestError("discount exist!");
    }
    const { discount_applies_to, discount_product_ids } = foundDiscount;
    let products;
    if (discount_applies_to === "all") {
      products = await finAllProducts({
        filter: {
          product_shop: convertToObjectIdMongodb(shopId),
          isPublish: true,
        },
        limit: +limit,
        page: +page,
        sort: "ctime",
        select: ["product_name"],
      });
    }
    return products;
  }
  /*
       get all discount code of Shop
      */
  static async getAllDiscountCodesByShop({ limit, page, shopId }) {
    return await findAllDiscountCodesSelect({
      limit: +limit,
      page: +page,
      filter: {
        discount_shopId: convertToObjectIdMongodb(shopId),
        discount_is_active: true,
      },
      Select: [ "discount_shop_id","discount_value"],
      model: discount,
    });
  }
  // Apply discount code
  static async getDiscountAmount({ codeId, userId, shopId, products }) {
    const foundDiscount = await checkDiscountExists({
      model: discount,
      filter: {
        discount_code: code,
        discount_shop_id: convertToObjectIdMongodb(shopId),
      },
    });

    if (!foundDiscount) {
      throw new BusinessLogicError("Discount not exists");
    }

    const {
      discount_is_active,
      discount_max_uses,
      discount_start_date,
      discount_end_date,
      discount_min_order_value,
      discount_max_order_value,
      discount_users_used,
      discount_type,
      discount_value,
    } = foundDiscount;
    if (!discount_is_active) throw new BusinessLogicError("Discount expired");
    if (discount_max_uses === 0)
      throw new BusinessLogicError("Discount are out");

    if (
      new Date() < new Date(discount_start_date) ||
      new Date() > new Date(discount_end_date)
    )
      throw new BusinessLogicError("Discount code has expired");

    // check xem cos et gia tri toi thieu hay k
    let totalOrder = 0;
    if (discount_min_order_value > 0) {
      // get total
      totalOrder = products.reduce((acc, product) => {
        return acc + product.quantity * product.price;
      }, 0);

      if (totalOrder < discount_min_order_value) {
        throw new BadRequestError(
          `Discount requires a minium order value of ${discount_min_order_value}`
        );
      }
    }

    if (discount_max_order_value > 0) {
      const userDiscount = discount_users_used.find(
        (user) => user.userId === userId
      );
      if (userDiscount) {
        // ..
      }
    }

    // check xem discount nay la fixed amount
    const amount =
      discount_type === "fixed_amount"
        ? discount_value
        : totalOrder * (discount_value / 100);

    return {
      totalOrder,
      discount: amount,
      totalPrice: totalOrder - amount,
    };
  } // delete voucher
  static async deleteDiscountCode({ shopId, codeId }) {
    // kiem tra xem co dk su dung o dau khong, neu k co thi xoa
    return discount.findOneAndDelete({
      discount_code: codeId,
      discount_shop_id: convert2ObjectId(shopId),
    });
  }

  //
  static async cancelDiscountCode({ codeId, shopId, userId }) {
    // check exists
    const foundDiscount = await checkDiscountExists({
      model: discount,
      filter: {
        discount_code: codeId,
        discount_shop_id: convertObjectId(shopId),
      },
    });

    if (!foundDiscount) throw new BusinessLogicError("Discount not exists");

    return discount.findByIdAndUpdate(foundDiscount._id, {
      $pull: {
        discount_users_used: userId,
      },
      $inc: {
        discount_max_users: 1,
        discount_uses_count: -1,
      },
    });
  }
}

module.exports =  DiscountService;

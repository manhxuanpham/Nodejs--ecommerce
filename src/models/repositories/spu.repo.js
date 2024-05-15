const SPU_MODEL = require('../spu.model')
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
module.exports = {findAllProducts}
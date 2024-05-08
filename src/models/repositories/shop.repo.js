const SHOP_MODEL = require('../shop.model')
const selectStruct =  {
    name:1,email:1,status:1,roles:1
}

const findShopbyId = async({
    shop_id,
    select = selectStruct
})=>{
    return await SHOP_MODEL.findById(shop_id).select(select)
}

module.exports = {
    findShopbyId
}
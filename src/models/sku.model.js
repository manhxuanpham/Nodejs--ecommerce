
const { model, Types, Schema } = require('mongoose'); 
const DOCUMENT_NAME = "SKU";
const COLLECTION_NAME = "skus";

const productSchema = new Schema({
    sku_id: { type: String,require:true,unique:true, default: '' },
    sku_tier_idx: {
        type: Array,
        default:[0]
        /**
         * color = [red,green]
         * size = [S,M] = [0,1]
         * 
         * red+ S => [0,0]
         * green+ S => [1,0]
         */

    },
    sku_default:{type:Boolean,default:false},
    sku_slug:{type:String,default:''},
    sku_price: {type:Number,default:0},
    sku_sort: {type:Number,default:0},
    sku_stock:{type:Number,default:0},
    product_id: { type: String, require: true },// ref spu product
    isDeleted: { type: Boolean, default: false },
    isDraft: {
        type: Boolean,
        default: true, // khong dk select ra
        index: true,
        select: false // khong lay field nay ra
    },
    isPublished: {
        type: Boolean,
        default: false, // khong dk select ra
        index: true,
        select: false // khong lay field nay ra
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})
module.exports = model(DOCUMENT_NAME,productSchema)
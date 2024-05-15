const { model, Schema } = require("mongoose");

// hang ton kho
const DOCUMENT_NAME = "Cart";
const COLLECTION_NAME = "Carts";

const cartSchema = new Schema(
    {
        cart_state: {
            type:String,
            enum:['active','complete','failed','pending']
        },
        cart_products: {
            type: Array,
            require:true,
            default: [],
        },
        cart_count_product: {
            type: Number
        },
        cart_userId: {
            type:Number,
            require:true

        }
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

module.exports = model(DOCUMENT_NAME, cartSchema);

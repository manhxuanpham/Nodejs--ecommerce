const { model,Types, Schema } = require('mongoose');



const DOCUMENT_NAME = "Order";
const COLLECTION_NAME = "Orders";


const orderSchema = new Schema({
    order_userId: { type: Types.ObjectId, require: true },
    order_checkout: { type: Object, default: {} },
    /**
     *  order_checkout = {
     * totalPrice,
     * totalApplyDiscount,
     * feeShip}
     */
    order_shipping: { type: Object, default: {} },
    /**
     * street
     * city
     * state
     * country
     */
    order_shopId: { type: Types.ObjectId, require: true, ref: 'Shop' },
    order_payment: { type: Object, default: {} },
    order_products: { type: Array, require: true },
    order_trackingNumber: { type: String, default: '#012092132' },
    order_status: { type: String, enum: ['pending', 'confirmed','shipped','cancel','delivered'] ,default:'pending'},


}, {
    collection: COLLECTION_NAME,
    timestamps: {
        createdAt: 'createOn',
        updatedAt: 'modifierOn'
    }
})

module.exports = model(DOCUMENT_NAME,orderSchema);
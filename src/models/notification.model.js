const { model, Schema } = require("mongoose");

// hang ton kho
const DOCUMENT_NAME = "Notification";
const COLLECTION_NAME = "Notifications";
// Order-001 success
// Order-0002 failed
//Promotion-001 new Promotion
//Shop-001 new product by user following
const notifySchema = new Schema(
    {
        noti_type: { type: String, enum: ['ORDER-001','ORDER-002','PROMOTION-001','SHOP-001'], required: true },
        noti_sender_id: { type: Schema.Types.ObjectId, required: true },
        noti_received_id: { type: Schema.Types.ObjectId, required: true, ref: 'Shop' },
        noti_content: { type: String, required: true },
        noti_options: { type: Object, default: {} }
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

module.exports = model(DOCUMENT_NAME, notifySchema);

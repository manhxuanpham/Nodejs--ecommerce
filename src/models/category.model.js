const { model, Schema } = require("mongoose");

// hang ton kho
const DOCUMENT_NAME = "Category";
const COLLECTION_NAME = "Categories";

const categorySchema = new Schema(
    {
        category_id: { type: String, unique: true },
        category_name: {
            type: String
        },
        category_description: {
            type: Array,
            require: true,
            default: [],
        },
        category_image: {
            type: String
        }
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

module.exports = model(DOCUMENT_NAME, categorySchema);

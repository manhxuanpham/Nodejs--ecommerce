const { upperCase } = require("lodash");
const { model, Schema } = require("mongoose");
const slugify = require('slugify')

// hang ton kho
const DOCUMENT_NAME = "Category";
const COLLECTION_NAME = "Categories";

const categorySchema = new Schema(
    {
        category_id: { type: String, unique: true },
        category_name: {
            type: String
        },
        category_slug: {
            type:String,
            index:true,
            upperCase:true
        },
        category_description: {
            type: String
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
categorySchema.pre('save', function (next) {
    this.category_slug = slugify(this.category_name, { lower: true })
    next()
})

module.exports = model(DOCUMENT_NAME, categorySchema);

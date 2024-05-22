const { upperCase } = require("lodash");
const { model, Schema } = require("mongoose");
const slugify = require('slugify')

// hang ton kho
const DOCUMENT_NAME = "SubCategory";
const COLLECTION_NAME = "SubCategories";

const categorySchema = new Schema(
    {
        subcategory_id: { type: String, unique: true },
        subcategory_name: {
            type: String
        },
        subcategory_slug: {
            type: String,
            index: true,
            upperCase: true
        },
        subcategory_parent: {
            type: Schema.Types.ObjectId,
            ref:'Category',
            require:true,
        }
        
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);
categorySchema.pre('save', function (next) {
    this.subcategory_slug = slugify(this.subcategory_name, { lower: true })
    next()
})

module.exports = model(DOCUMENT_NAME, categorySchema);

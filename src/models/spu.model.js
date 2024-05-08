const { model, Schema } = require('mongoose');
const slugify = require('slugify');


const DOCUMENT_NAME = "SPU";
const COLLECTION_NAME = "spus";

const productSchema = new Schema({
    product_id: { type: String, default: '' },
    product_name: {
        type: String,
        trim: true,
        maxLength: 150
    },
    product_thumb: {
        type: String,
        unique: true,
        trim: true
    },
    product_description: {
        type: String,
    },
    product_slug: String,
    product_category: { type: Array, default: [] },
    product_price: {
        type: Number,
        required: true
    },
    product_quantity: {
        type: Number,
        required: true
    },
    product_shop: {
        type: Schema.Types.ObjectId,
        ref: 'Shop'
    },
    product_attributes: {
        type: Schema.Types.Mixed,
        required: true
    },
    /*
        attribute_id:12345, áo mùa hè, phong cách trẻ chung ..
        attribute_values:[{
            value_id:123
        }]
    */
    // more
    product_ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be above 5.0'],
        set: (val) => Math.round(val * 10) / 10
    },
    product_variations: {
        type: Array,
        default: [],
    },
    /*
        tier_variation:[
            {
                images: [],
                name:'color',
                options:['red','green']
            },
            {
                name:'size',
                options:['s','m'],
                images:[]
            }
        ]
    */
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
    },
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

// create index for search
productSchema.index({
    product_name: 'text',
    product_description: 'text'
})

// Document middleware runs before .save and .create...
productSchema.pre('save', function (next) {
    this.product_slug = slugify(this.product_name, { lower: true })
    next()
})


module.exports = model(DOCUMENT_NAME, productSchema)
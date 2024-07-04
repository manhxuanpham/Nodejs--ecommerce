const SUBCATEGORY_MODEL = require('../models/subcategory.model')
class SubCategoryService {
    static async newSubCategory({
        subcategory_id,
        subcategory_name,
        subcategory_description,
        subcategory_image,
        subcategory_parent
    }){
        await SUBCATEGORY_MODEL.create({
            subcategory_id,
            subcategory_name,
            subcategory_description,
            subcategory_image,
            subcategory_parent
        })
    }
    static async newSubCategories(payload) {
        await SUBCATEGORY_MODEL.insertMany(payload)
    }
    static async updateSubCategory({
        subcategory_id,
        subcategory_name,
        subcategory_description,
        subcategory_image,
        subcategory_parent
    }) {
        await CATEGORY_MODEL.findByIdAndUpdate({
            subcategory_id,
            subcategory_name,
            subcategory_description,
            subcategory_image,
            subcategory_parent
        })
    }
}
module.exports = SubCategoryService
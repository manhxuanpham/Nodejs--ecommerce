const CATEGORY_MODEL = require('../models/category.model')
class CategoryService {
    static async newCategory({
        category_id,
        category_name,
        category_description,
        category_image,
    }) {
       return await CATEGORY_MODEL.create({
            category_id,
            category_name,
            category_description,
            category_image,

        })
    }
    static async newCategories(payload) {
        return await CATEGORY_MODEL.insertMany(payload);
    }
    
    static async updateCategory({
        category_id,
        category_name,
        category_description,
        category_image,
    }) {
       return await CATEGORY_MODEL.findByIdAndUpdate({
            category_id,
            category_name,
            category_description,
            category_image,

        })
    }
    static async getListCategory() {
       return await CATEGORY_MODEL.find();
    }
}

module.exports = CategoryService
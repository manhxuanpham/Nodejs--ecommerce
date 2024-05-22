const SubCategoryService = require('../services/subcategory.service')

const { CREATED, OK } = require("../core/success.response")

class SubCategoryController {
    create = async (req, res, next) => {
        CREATED(res, 'create subcategory success', await SubCategoryService.newSubCategory(req.body))
    }
    createMany = async (req, res, next) => {
        CREATED(res, 'create subcategories success', await SubCategoryService.newSubCategories(req.body))
    }
    update = async (req, res, next) => {
        CREATED(res, 'update subcategory success', await SubCategoryService.updateSubCategory(req.body))
    }
}
module.exports = new SubCategoryController()
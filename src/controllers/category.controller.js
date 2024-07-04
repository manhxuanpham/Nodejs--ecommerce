const CategoryService = require('../services/category.service')

const { CREATED, OK } = require("../core/success.response")

class CategoryController {
    create = async (req, res, next) => {
        CREATED(res, 'create category success', await CategoryService.newCategory(req.body))
    }
    createMany = async (req, res, next) => {
        CREATED(res, 'create categories success', await CategoryService.newCategories(req.body))
    }
    update = async (req, res, next) => {
        CREATED(res, 'update category success', await CategoryService.updateCategory(req.body))
    }
    getAll = async (req, res, next) => {
        OK(res, 'get category success', await CategoryService.getListCategory())
    }
    
}
module.exports = new CategoryController()
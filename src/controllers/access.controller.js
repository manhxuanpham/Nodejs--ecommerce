'use strict'
const AccessService = require('../services/acess.service');
const {CREATED, OK} = require("../core/success.respone");

const {catchAsync,asyncHandler} = require('../helpers/catch.async')

class AccessController {
    signUp =  async (req, res,next) => {
        CREATED(res, "Register success", await AccessService.signUp(req.body))
    }
}

module.exports = new AccessController()
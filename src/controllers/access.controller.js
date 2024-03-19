'use strict'
const AccessService = require('../services/acess.service');
const {CREATED, OK} = require("../core/success.respone");

const {asyncHandler,catchAsync} = require('../helpers/asyncHandler')

class AccessController {
    handlerRefreshToken = catchAsync(async (req, res) => {
        OK(res, "get token success", await AccessService.refreshToken({
            refreshToken: req.refreshToken,
            user: req.user,
            keyStore: req.keyStore
        }))
    })
    logout = catchAsync(async (req, res) => {
        OK(res, "Logout success", await AccessService.logout(req.keyStore))
    })
    login = catchAsync(async (req, res) => {
        OK(res, "Login success", await AccessService.login(req.body))
    })
    signUp =  async (req, res,next) => {
        CREATED(res, "Register success", await AccessService.signUp(req.body))
    }
}

module.exports = new AccessController()
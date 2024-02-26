'use strict'
const AccessService = require('../services/acess.service');
class AccessController {
    sigUp = async (req,res,next ) => {
        try {
            console.log(`[P]::sigUp::`,req.body)
            // 200 Ok, 201 created
            return res.status(201).json(
                await AccessService.sigUp(req.body)
            )
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new AccessController()
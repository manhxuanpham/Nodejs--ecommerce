'use strict'
const {findByid} = require('../services/apikey.service')
const HEADER =  {
    API_KEY :  'x-api-key',
    AUTHORIZATION:'authorization'
}

const apiKey = async (req,res,next) => {
    try {
        const key = req.headers[HEADER.API_KEY]?.toString();
        console.log('key',key)
        if (!key) {
            return res.status(403).json({
                message: 'Forbbiden error 15'
            })
        }
        // check object key
        const objKey = await findByid(key);
        console.log(objKey)
        if (!objKey) {
            return res.status(403).json({
                message: 'Forbbiden error 22' 
            })
        }
        req.objKey = objKey;
        return next();

    } catch (error) {
        console.log(error)
    }

}

const permission = (permission)=> {
    return(req,res,next)=> {
        if(!req.objKey.permissions) {
            return res.status(403).json({
                message:'permission denied'
            })
        }
        console.log('permission::',req.objKey.permissions)
        const validpermission = req.objKey.permissions.includes(permission);
        if(!validpermission) {
            return res.status(403).json({
                message:'permission denied'
            })
        }
        return next();
    }
}
module.exports = {
    apiKey,
    permission
}
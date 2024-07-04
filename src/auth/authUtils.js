'use strict'
const JWT = require('jsonwebtoken')
const {asyncHandler} = require('../helpers/asyncHandler');
const {AuthFailureError,Api404Error,Api401Error} = require('../core/error.response')
const {findUserById} = require('../services/keyToken.service')

const HEADER =  {
    API_KEY :  'x-api-key',
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION:'authorization',
    REFRESH_TOKEN: 'refresh-token'
}
const createTokenPair = async(payload,publicKey,privateKey) => {
    try {
        //access token
        const accessToken = await JWT.sign(payload,publicKey,{
            expiresIn:'30 days'
        })
        const refreshToken = await JWT.sign(payload,privateKey,{
            expiresIn:'365 days'
        })
        JWT.verify(accessToken,publicKey,(err,decode) => {
            if(err) {
                console.log(`error verify::`,err)
            }
            else {
                console.log(`decode verify::`,decode)
            } 
            
        })
        return {accessToken,refreshToken}
    } catch (error) {
        
    }
}


const authentication = asyncHandler(async(req,res,next)=> {
    /*
        1, check userid missing
        2,get accesstoken
        3,verify token
        4,check user in dbs
        5,check keystore with userid
        6,Ok all return next
    */
    //1
    const userId = req.headers[HEADER.CLIENT_ID]
    if(!userId) throw new AuthFailureError("invalid request")
    //2
    const keyStore = await findUserById(userId)
    if(!keyStore) throw new Api404Error("Not Found keyStore")
    //3
    const accessToken = req.headers[HEADER.AUTHORIZATION]
    if(!accessToken) throw new AuthFailureError("Invalid request")
    try {
        const decodeUser  = JWT.verify(accessToken,keyStore.publicKey)
        if(userId !== decodeUser.userId) throw new AuthFailureError('invalid Userid')
        req.keyStore = keyStore
        return next()
    } catch (error) {
        throw error
    }

})


const authenticationV2 = asyncHandler(async (req, res, next) => {

    const refreshToken = req.headers[HEADER.REFRESH_TOKEN]
    const accessToken = req.headers[HEADER.AUTHORIZATION]
    const userId = req.headers[HEADER.CLIENT_ID]
    console.log("user id",userId)
    if(!userId) throw new AuthFailureError("invalid request ")
      // 2. check keyStore by userId
    const keyStore = await findUserById(userId)
    if(!keyStore) throw new Api404Error("Not Found keyStore")


    // 3. get refreshToken
    if (refreshToken) {
        try {
            const decodeUser = verifyJwt(refreshToken, keyStore.privateKey);
            if (userId !== decodeUser.userId) throw new AuthFailureError('Invalid userId')
            req.user = decodeUser
            req.keyStore = keyStore
            req.refreshToken = refreshToken

            return next()
        }  catch (error) {
            throw error
        }
    }

    // 3. get auth token
    if (!accessToken) throw new AuthFailureError('Invalid request')

    // 4.
    try {
        const decodeUser = verifyJwt(accessToken, keyStore.publicKey);
        if (userId !== decodeUser.userId) throw new AuthFailureError('Invalid userId')

        req.user = decodeUser
        //console.log("::req.user",req.user)
        req.keyStore = keyStore
        return next()
    } catch (error) {
        throw error
    }
})

const verifyJwt = (token, keySecret) => {
    return JWT.verify(token, keySecret);
}

module.exports = {
    createTokenPair,
    authentication,
    verifyJwt,
    authenticationV2
}
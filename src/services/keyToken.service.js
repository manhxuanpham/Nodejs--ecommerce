'use strict'

const keyTokenModel = require("../models/keyToken.model")
const {Types} = require('mongoose')
class KeyTokenService {
    static createKeyToken = async ({userId, publicKey, privateKey, refreshToken}) => {
        try {
            // level0
            // const tokens = await keyTokenModel.create({
            //     user: userId,
            //     publicKey,
            //     privateKey
            // })
            //
            // return tokens ? tokens.publicKey : null

            // level xx
            const filter = {user: userId}, update = {
                publicKey, privateKey, refreshTokensUsed: [], refreshToken
            }, options = {upsert: true, new: true}

            const tokens = await keyTokenModel.findOneAndUpdate(filter, update, options)

            return tokens ? tokens.publicKey : null
        } catch (error) {
            console.error('createKeyToken::error::', error)
            throw error;
        }
    }
    static findUserById = async(userId)=> {
        return await keyTokenModel.findOne({user:new Types.ObjectId(userId)}).lean()
    } 
    static removeKeyById = async(id) => {
        console.debug("id remove",id);
        return  await keyTokenModel.deleteOne({_id:new Types.ObjectId(id)})
    }
    static findByRefreshTokenUsed = async (refreshToken) => {
        return await keyTokenModel.findOne({ refreshTokensUsed: refreshToken}).lean()
    }

    static findByRefreshToken = async (refreshToken) => {
        return await keyTokenModel.findOne({ refreshToken })
    }

    static deleteKeyById = async (userId) => {
        return await keyTokenModel.findByIdAndDelete({userId: userId})
    }

}

module.exports = KeyTokenService
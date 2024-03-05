"use strict";

const shopeModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("node:crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtils");
const { getInfoData } = require("../utils/index");
const {Api403Error} = require("../core/error.respone")

const RoleShop = {
  SHOP: "SHOP",
  WRITER: "Writer",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};
class AccessService {
  static signUp = async ({ name, email, password }) => {
    try {
      const holderShop = await shopeModel.findOne({ email }).lean();
      if (holderShop) {
        throw new Api403Error("error shop alrealy registered ")
      }
      console.log("password", password, "email", email, "name:", name);
      const passwordHash = await bcrypt.hash(password, 10);
      const newShop = await shopeModel.create({
        name,
        email,
        password: passwordHash,
        roles: [RoleShop.SHOP],
      });
      if (newShop) {
        //create privatekey, publickey
        // const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
        //   modulusLength: 4096,
        //   publicKeyEncoding: {
        //     type: "pkcs1",
        //     format: "pem",
        //   },
        //   privateKeyEncoding: {
        //     type: "pkcs1",
        //     format: "pem",
        //   }
        //    });
        
        // publickey CryptoGraphy standard
        const privateKey = crypto.randomBytes(64).toString('hex');
        const publicKey = crypto.randomBytes(64).toString('hex');

        console.log({ publicKey, privateKey }); // save collection Keystore
        const keyStore = await KeyTokenService.createKeyToken({
          userId: newShop._id,
          publicKey,
          privateKey
        });
        if (keyStore) {
            console.log('save keystore succed',keyStore)
        }
        if (!keyStore) {
          return {
            code: "xxx",
            message: "error keyStore",
          };
        }
        // create token pair
        const tokens = await createTokenPair(
          { userId: newShop._id, email },
          publicKey,
          privateKey
        );
        console.log(`create token success`, tokens);
        return {
          code: 201,
          metadata: {
           shop:getInfoData({fileds:['_id','name','password'],object:newShop}),
            tokens,
          },
        };
      }
      return {
        code: 200,
        metadata: null,
      };
    } catch (error) {
      return {
        code: "xxx",
        message: error.message,
        status: "error",
      };
    }
  };
}

module.exports = AccessService;

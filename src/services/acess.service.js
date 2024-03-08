"use strict";

const shopeModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("node:crypto");
const KeyTokenService = require("./keyToken.service");

const { createTokenPair, verifyJwt } = require("../auth/authUtils");
const { getInfoData } = require("../utils/index");
const {
  Api403Error,
  BusinessLogicError,
  BadRequestError,
  AuthFailureError,
} = require("../core/error.response");
const { findByEmail } = require("./shop.service");

const RoleShop = {
  SHOP: "SHOP",
  WRITER: "Writer",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};
class AccessService {
  /**
   * Check this token used?
   * @param refreshToken
   * @returns {Promise<void>}
   */
  static refreshToken = async(refreshToken) => {
    const foundToken = await KeyTokenService.findByRefreshTokenUsed(refreshToken)
    //check token used yet
    if (foundToken) {

      //decode see who is that
      const {userId,email} = await verifyJwt(refreshToken,foundToken.privateKey)
      //delete all token in keyStore
      await KeyTokenService.deleteKeyById(userId)
      throw Api401Error("something wrong happened");

    }
    // if no
    const holderToken = await KeyTokenService.findByRefreshToken(refreshToken)
    if(!holderToken) throw new AuthFailureError("shop not registered")

    //verify token 
    const {userId,email} = await verifyJwt(refreshToken,holderToken.privateKey)
    console.log("[2]==",{userId,email})


    // check userId
    const foundShop = await findByEmail({ email });
    if (!foundShop) throw new AuthFailureError("shop not registered")

    // create accessToken, refreshToken
    const tokens = await createTokenPair(
      { userId, email },
      holderToken.publicKey,
      holderToken.privateKey
    );

    // update token
    await holderToken.update({
      $set: {
        refreshToken: tokens.refreshToken,
      },
      $addToSet: {
        refreshTokensUsed: refreshToken,
      },
    });

    // return new tokens
    return {
      user,
      tokens,
    };
  };

  static logout = async (keyStore) => {
    console.log("keystore ??", keyStore);
    const delKey = await KeyTokenService.removeKeyById(keyStore._id);
    return delKey;
  };

  static login = async ({ email, password, refreshToken = null }) => {
    // 1.check email in dbs
    const foundShop = await findByEmail({ email });
    if (!foundShop) throw new BadRequestError("Shop not registered");

    // 2. match password
    const match = bcrypt.compare(password, foundShop.password);
    if (!match) throw new AuthFailureError("Authentication errror");

    // 3. create private key, public key
    const privateKey = crypto.randomBytes(64).toString("hex");
    const publicKey = crypto.randomBytes(64).toString("hex");

    // 4. generate tokens
    const { _id: userId } = foundShop;
    const tokens = await createTokenPair(
      {
        userId: userId.toString(),
        email,
      },
      publicKey,
      privateKey
    );

    await KeyTokenService.createKeyToken({
      userId: userId.toString(),
      privateKey,
      publicKey,
      refreshToken: tokens.refreshToken,
    });

    return {
      shop: getInfoData({
        fileds: ["_id", "name", "password"],
        object: foundShop,
      }),
      tokens,
    };
  };

  static signUp = async ({ name, email, password }) => {
    try {
      const holderShop = await shopeModel.findOne({ email }).lean();
      if (holderShop) {
        throw new Api403Error("error shop alrealy registered ");
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
        const privateKey = crypto.randomBytes(64).toString("hex");
        const publicKey = crypto.randomBytes(64).toString("hex");

        console.log({ publicKey, privateKey }); // save collection Keystore
        const keyStore = await KeyTokenService.createKeyToken({
          userId: newShop._id,
          publicKey,
          privateKey,
        });
        if (keyStore) {
          console.log("save keystore succed", keyStore);
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
            shop: getInfoData({
              fileds: ["_id", "name", "password"],
              object: newShop,
            }),
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

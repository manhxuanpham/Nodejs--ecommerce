const {
  product,
  clothing,
  furniture,
  electronic,
} = require("../models/product.model");
const { BadRequestError } = require("../core/error.response");
const {} = require("../core/success.response");
const {
  findAllDraftForShop,
  publishProductByShop,
  findAllPublishForShop,
  unPublishProductByShop,
  searchProductByUser,
  findProduct,
  findAllProducts,
  updateProductById,
} = require("../models/repositories/product.repo");
const {insertInventory} = require('../models/repositories/inventory.repo')
const { removeUndefinedObject, updateNestedObjectParser } = require("../utils");

// define factory class to create product
class ProductFactory {
  /*
          type:'clothing',
          payload
      */
  static productRegistry = {}; // key-class

  static registerProductType(type, classRef) {
    ProductFactory.productRegistry[type] = classRef;
  }
  static createProduct(type, payload) {
    console.log("::payload", payload);
    const productClass = ProductFactory.productRegistry[type];
    if (!productClass) throw new BadRequestError("Invalid product type");
    return  new productClass(payload).createProduct();
  }
  static updateProduct(type, productId, payload) {
    const productClass = ProductFactory.productRegistry[type];
    if (!productClass) throw new BadRequestError("Invalid product type");
    return new productClass(payload).updateProduct(productId);
  }
  // query
  static async findAllDraftForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isDraft: true };
    return await findAllDraftForShop({ query, limit, skip });
  }
  static async findAllPublishForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isPublished: true };
    return await findAllPublishForShop({ query, limit, skip });
  }
  static async searchProducts({ keySearch }) {
    return await searchProductByUser({ keySearch });
  }
  static async findAllProducts({
    limit = 50,
    sort = "ctime",
    page = 1,
    filter = { isPublished: true },
  }) {
    return await findAllProducts({
      limit,
      sort,
      page,
      filter,
      select: ["product_name ", "product_price", "product_thumb"],
    });
  }
  static async findProduct({ product_id }) {
    return await findProduct({ product_id, unSelect: ["__v"] });
  }

  //Put //
  static async publishProductByShop({ product_shop, product_id }) {
    return await publishProductByShop({ product_shop, product_id });
  }
  static async unPublishProductByShop({ product_shop, product_id }) {
    return await publishProductByShop({ product_shop, product_id });
  }
  //End Put//
}

//define product base class

class Product {
  constructor({
    product_name,
    product_thumb,
    product_description,
    product_shop,
    product_price,
    product_quality,
    product_type,
    product_attributes,
  }) {
    this.product_name = product_name;
    this.product_thumb = product_thumb;
    this.product_description = product_description;
    this.product_price = product_price;
    this.product_quality = product_quality;
    this.product_type = product_type;
    this.product_shop = product_shop;
    this.product_attributes = product_attributes;
  }
  //create product
  async createProduct(product_id) {
    const newProduct = await product.create({ ...this, _id: product_id });
    if(newProduct) {
        await insertInventory({
          productId: newProduct._id,
          shopId: this.product_shop,
          stock: this.product_quality
        }); 
    }
    return newProduct
  }
  //update product
  async updateProduct(productId, bodyUpdate) {
    return await updateProductById({ productId, bodyUpdate, model: product });
  }
}
//define sub class for deferent product types clothing
class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothing.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newClothing) throw new BadRequestError("create new clothing error");

    const newProduct = await super.createProduct(newClothing._id);
    if (!newProduct) throw new BadRequestError("create new product error");
    return newProduct;
  }
  async updateProduct(productId) {
    //1 remove attributes has null undefine
    const objectParams = removeUndefinedObject(this);
    if (objectParams.product_attributes) {
      //update child
      await updateProductById({
        productId,
        bodyUpdate: updateNestedObjectParser(objectParams.product_attributes),
        model: Clothing,
      });
    }
    const updateProduct = await super.updateProduct(
      productId,
      updateNestedObjectParser(objectParams)
    );
    return updateProduct;
  }
}
//define sub class for deferent product types Electronic
class Electronic extends Product {
  async createProduct() {
    console.log("::this", { ...this });
    console.log("::Electronic attribute:", { ...this.product_attributes });
    const newElectronic = await electronic.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newElectronic)
      throw new BadRequestError("create new electronic error");
    const newProduct = await super.createProduct(newElectronic._id);
    if (!newProduct) throw new BadRequestError("create new product error");
    return newProduct;
  }
  async updateProduct(productId) {
    //1 remove attributes has null undefine
    const objectParams = removeUndefinedObject(this);
    if (objectParams.product_attributes) {
      //update child
      await updateProductById({
        productId,
        bodyUpdate: updateNestedObjectParser(objectParams.product_attributes),
        model: electronic,
      });
    }
    const updateProduct = await super.updateProduct(
      productId,
      updateNestedObjectParser(objectParams)
    );
    return updateProduct;
  }
}
//define sub class for deferent product types furniture
class Furniture extends Product {
  async createProduct() {
    const newFurniture = await furniture.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newFurniture) throw new BadRequestError("create new furniture error");
    const newProduct = await super.createProduct(newFurniture._id);
    if (!newProduct) throw new BadRequestError("create new product error");
    return newProduct;
  }
  async updateProduct(productId) {
    //1 remove attributes has null undefine
    const objectParams = removeUndefinedObject(this);
    if (objectParams.product_attributes) {
      //update child
      await updateProductById({
        productId,
        bodyUpdate: updateNestedObjectParser(objectParams.product_attributes),
        model: furniture,
      });
    }
    const updateProduct = await super.updateProduct(
      productId,
      updateNestedObjectParser(objectParams)
    );
    return updateProduct;
  }
}

ProductFactory.registerProductType("Clothing", Clothing);
ProductFactory.registerProductType("Electronic", Electronic);
ProductFactory.registerProductType("Furniture", Furniture);

module.exports = ProductFactory;

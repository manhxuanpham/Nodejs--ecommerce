const {
    product,
    clothing,
    furniture,
    electronic,
} = require("../models/product.model");
const { BadRequestError } = require("../core/error.response");
const { } = require("../core/success.response");

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
        console.log("::payload",payload)
        const productClass = ProductFactory.productRegistry[type];
        if (!productClass) throw new BadRequestError("Invalid product type");
        return new productClass(payload).createProduct();
    }
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
        product_attributes
    }
      
        
    ) {
        this.product_name = product_name
        this.product_thumb = product_thumb
        this.product_description = product_description
        this.product_price = product_price
        this.product_quality = product_quality
        this.product_type = product_type
        this.product_shop = product_shop
        this.product_attributes = product_attributes

    }
    async createProduct(product_id) {
        return await product.create({ ...this, _id: product_id });
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
        return newProduct
    }
}
//define sub class for deferent product types Electronic
class Electronic extends Product {
    async createProduct() {
        console.log("::this",{...this})
        console.log("::Electronic attribute:", { ...this.product_attributes });
        const newElectronic = await electronic.create({
            ...this.product_attributes,
            product_shop: this.product_shop,
        });
        if (!newElectronic)
            throw new BadRequestError("create new electronic error");
        const newProduct = await super.createProduct(newElectronic._id);
        if (!newProduct) throw new BadRequestError("create new product error");
        return newProduct

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
        return newProduct

    }
}

ProductFactory.registerProductType("Clothing", Clothing);
ProductFactory.registerProductType("Electronic", Electronic);
ProductFactory.registerProductType("Furniture", Furniture);

module.exports = ProductFactory;

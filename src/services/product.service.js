const {product,clothing,furniture,electronic} = require('../models/product.model')
const {BadRequestError} = require('../core/error.response')
const {} = require('../core/success.response')


// define factory class to create product
class ProductFactory {
    /*
        type:'clothing'
    */
    static createProduct(type,payload) {
        switch(type) {
            case 'Electronic':
                return new Electronic(payload)
            case 'Clothing':
                return new Clothing(payload)
            case 'Furniture':
                return new Furniture(payload)
            default: throw new BadRequestError(`invalid product type ${type}`)
        }
    }
}

//define product base class

class Product {
    contructor(product_name,
        product_thumb,
        product_description,
        product_slug,
        product_price,
        product_quality,
        product_type,
        product_shop,
        product_attributes,
        product_ratingsAverage,
        product_variations,
        isDraft,
        isPublished) {
            this.product_name = this.product_name
            this.product_thumb = this.product_thumb
            this.product_description = this.product_description
            this.product_slug = this.product_slug
            this.product_price = this.product_price
            this.product_quality = this.product_quality
            this.product_type = this.product_type
            this.product_shop = this.product_shop
            this.product_attributes = this.product_attributes,
            this.product_ratingsAverage = this.product_ratingsAverage
            this.isDraft = this.isDraft
            this.isPublished = this.isPublished
        }
    async createProduct(product_id) {
        return await  product.create({...this,_id:product_id})
    }        
}
//define sub class for deferent product types clothing
class Clothing extends Product {
    async createProduct() {
        const newClothing = await clothing.create(this.product_attributes)
        if(!newClothing) throw new BadRequestError('create new clothing error')
        const newProduct = await super.createProduct()
        if(!newProduct) throw new BadRequestError('create new product error')

    }
}
//define sub class for deferent product types Electronic
class Electronic extends Product {
    async createProduct() {
        const newElectronic = await electronic.create({...this.product_attributes,product_shop:this.product_shop})
        if(!newElectronic) throw new BadRequestError('create new electronic error')
        const newProduct = await super.createProduct()
        if(!newProduct) throw new BadRequestError('create new product error')

    }
}
//define sub class for deferent product types furniture
class Furniture extends Product {
    async createProduct() {
        const newFurniture = await furniture.create(this.product_attributes)
        if(!newFurniture) throw new BadRequestError('create new furniture error')
        const newProduct = await super.createProduct()
        if(!newProduct) throw new BadRequestError('create new product error')

    }
}
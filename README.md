# NODE-ecommerce API Documentation

Welcome to the NODE-ecommerce API documentation! This API is designed for handling a comprehensive e-commerce platform that includes functionalities like user authentication, product management, cart handling, and checkout processes.

## Features

### User Authentication:
- Sign up
- Login
- Logout


### Product Management:
- Create, update, publish, and manage products

### Cart Management:
- Add items to cart, update items, and manage cart

### Order Processing:
- Review and process orders

### Category Management:
- Manage product categories and subcategories

### Discount Management:
- Create and manage discounts for products

## API Endpoints

### Access
- `POST /v1/api/shop/signup`: Sign up a new shop.
- `POST /v1/api/shop/login`: Login for shop owners.
- `POST /v1/api/shop/logout`: Logout a shop owner.
- `POST /v1/api/shop/handlerrefreshtoken`: Refresh authentication token.

### Products
- `POST /v1/api/product/create`: Create a new product.
- `GET /v1/api/product/drafts/all`: Retrieve all draft products.
- `POST /v1/api/product/publish/{productId}`: Publish a product.
- `PATCH /v1/api/product/{productId}`: Update product details.

### Cart
- `POST /v1/api/cart`: Add a product to the cart.
- `POST /v1/api/cart/update`: Update cart items.
- `GET /v1/api/cart`: Get all cart items for a user.

### Order
- `POST /v1/api/checkout`: Process a checkout.
- `POST /v1/api/order: Order by User

- 
### Categories
- `GET /v1/api/category`: Get all categories.
- `POST /v1/api/category`: Create a new category.

### Discounts
- `POST /v1/api/discount`: Create a new discount.
- `GET /v1/api/discount/list-product-code`: List products applicable for a discount.

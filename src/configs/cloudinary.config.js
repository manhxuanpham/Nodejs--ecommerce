const cloudinary  = require('cloudinary').v2 ;


    // Configuration
cloudinary.config({
        cloud_name: "dy0iolbcw",
        api_key: "274446456325686",
        api_secret: "XibBV1fkYzPGE-3vL8WBQPXEb5Y" // Click 'View Credentials' below to copy your API secret
    });


module.exports = cloudinary
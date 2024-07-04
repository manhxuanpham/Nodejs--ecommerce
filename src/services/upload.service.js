const cloudinary = require("../configs/cloudinary.config")
// upload from url image

const uploadImageFromUrl  = async() => {
    try {
        const urlImage = 'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-ltkypdfkkq2yb3';
        const folderName = 'product/shopId' , newFile = 'testDemo'
        const result = await cloudinary.uploader.upload(urlImage,{
            // public_id:
            folder:folderName
        })
        console.log(result)
        return result
    } catch (error) {
        console.log(error)
    }
}
const uploadImageFromLocal = async({path,folderName = 'product/xxx'}) => {
    try {
        const result = await cloudinary.uploader.upload(path, {
            // public_id:
            folder: folderName
        })
        console.log(result)
        return {
            img_url:result.secure_url,
            shopId:'abc',
            thumb_url:await cloudinary.url(result.public_id,{
                height:320,
                width:320,
                format:'jpg'
            }),
            standard_url: await cloudinary.url(result.public_id, {
                height: 1024,
                width: 1024,
                format: 'jpg'
            }),
        }
    } catch (error) {
        console.log(error)
    }
}
module.exports = {
    uploadImageFromUrl,
    uploadImageFromLocal
}


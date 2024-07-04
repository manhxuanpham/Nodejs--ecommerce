const { uploadImageFromUrl, uploadImageFromLocal } = require('../services/upload.service')
const {CREATED} = require('../core/success.response')
class UploadController {
   
        uploadImageFromUrl = async (req, res, next) => {
            CREATED(res, 'upload success', await uploadImageFromUrl())
        }

        uploadImageFromLocal = async (req, res, next) => {
            CREATED(res, 'upload success', await uploadImageFromLocal(req.file))
        }
    
}
module.exports = new UploadController();

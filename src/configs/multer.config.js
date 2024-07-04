const multer = require('multer')

const uploadMemory = multer({
    storage:multer.memoryStorage()
})
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './src/uploads')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + file.originalname
        cb(null, uniqueSuffix)
    }
})
const uploadDisk = multer({storage:storage})

module.exports = {
    uploadDisk,
    uploadMemory
}
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
     cloud_name: process.env.CLOUDINARYCLOUDNAME,
     api_key: process.env.CLOUDINARYKEY,
     api_secret: process.env.CLOUDINARYSECRET
})

const storage = new CloudinaryStorage({
     cloudinary,
     params: {
          folder: 'YelpCamp',
          allowedFormats: ['png', 'jpg', 'jpeg']
     }
})

module.exports = {
     cloudinary,
     storage
}
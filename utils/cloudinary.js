const configurations = require('config')
const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: configurations.get("CLOUDINARY_NAME"),
    api_key: configurations.get("CLOUDINARY_API_KEY"),
    api_secret: configurations.get("CLOUDINARY_API_SECRET")
})

module.exports = {cloudinary}
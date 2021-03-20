const {Router} = require('express')
const Text = require('../models/Text')
const User = require('../models/User')
const {config} = require('config')
const {cloudinary} = require('../utils/cloudinary')
const router = Router()

router.post('/uploadChapterImage', async(req, res) => {
    try {
        const fileStr = req.body

        console.log(req.body)
        //console.log(file)

        const uploadedResponse = await cloudinary.uploader.upload(fileStr, {
            upload_preset: 'fanficSiteImages'
        })

        // const response = await fetch("https://api.cloudinary.com/v1_1/ignatcloud/image/upload", {
        //     method: 'POST',
        //     body: data
        // }) 
        // const file = await response.json()

        console.log(uploadedResponse)

        //res.json(uploadedResponse)

    } catch (e) {
        console.log(e.message)
        res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'})
    }
})

module.exports = router
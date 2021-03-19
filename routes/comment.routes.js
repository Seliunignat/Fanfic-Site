const {Router} = require('express')
const config = require('config')
const Comment = require('../models/Comment')
const auth = require('../middleware/auth.middleware')
const {check, validationResult} = require('express-validator')
const router = Router()

router.post('/create', auth, async(req, res) => {
    try {
        const {title, author, content, fanficId} = req.body

        const comment = Comment({title, author, content, onFanfic: fanficId})

        await comment.save()

        res.status(201).json({message: 'Комментарий успешно добавлен'})
    } catch (e) {
        res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'})
    }
})

module.exports = router 
const {Router} = require('express')
const config = require('config')
const Comment = require('../models/Comment')
const auth = require('../middleware/auth.middleware')
const {check, validationResult} = require('express-validator')
const { connect } = require('mongoose')
const router = Router()


router.post('/create', auth,[
        check('content').isLength({min: 1})
    ],
 async(req, res) => {
    try {
        const errors = validationResult(req)

        if(!errors.isEmpty()){
            return res.status(400).json({
                errors: errors.array(),
                message: 'Некорректные данные при создании комментария'
            })
        }

        const {author, content, textId} = req.body

        // console.log("author: " + author)
        // console.log("content: " + content)
        // console.log("fanficId: " + textId)

        const comment = Comment({author, content, onFanfic: textId})

        await comment.save()

        res.status(201).json({message: 'Комментарий успешно добавлен'})
    } catch (e) {
        res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'})
    }
})

router.get('/getCommentsOfText/:id', async(req, res) => {
    try {
        const textId = req.params.id

        // console.log(textId)

        const comments = await Comment.find({onFanfic: textId}).populate('author')

        // console.log(comments)

        res.json(comments)

    } catch (e) {
        res.status(500).json({message: 'Что-то пошло не так при попытке получить комментарии'})
    }
})

module.exports = router 
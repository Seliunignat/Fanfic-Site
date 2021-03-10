const {Router} = require('express')
const config = require('config')
const Text = require('../models/Text')
const auth = require('../middleware/auth.middleware')
const {check, validationResult} = require('express-validator')
const router = Router()

router.post('/create', 
[
    check('title', 'Минимальная длина названия - 1 символ').isLength({min: 1}),
],
async(req, res) => {
    try {
        const errors = validationResult(req)

        if(!errors.isEmpty()){
            return res.status(400).json({
                errors: errors.array(),
                message: 'Некорректные данные при создании текста'
            })
        }
        const baseUrl = config.get('baseUrl')

        const {title, author, date, chapters} = req.body

        const text = Text({title, author, date, chapters})

        await text.save()

        res.status(201).json({message: 'Фанфик успешно создан' })

    } catch (e) {
        res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'})
    }
})

router.get('/', auth, async(req, res) => {
    try {
        const texts = await Text.find({ author: req.user.userId }).populate('author')
        res.json(texts)
    } catch (e) {
        res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'})
    }
})

router.get('/:id', auth, async(req, res) => {
    try {
        const text = await Text.findById(req.params.id) // ???
        res.json(text)
    } catch (e) {
        res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'})
    }
})

module.exports = router 
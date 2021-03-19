const {Router} = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')
const {check, validationResult} = require('express-validator')
const User = require('../models/User')
const auth = require('../middleware/auth.middleware')
const router = Router()

// /api/auth/register
router.post(
    '/register',
    [
        check('username', 'Минимальная длина логина - 1 символ').isLength({min: 1}),
        check('password', 'Минимальная длина пароля - 3 символа').isLength({min: 3}),
        check('email', 'Неправильный email').isEmail()
    ],
    async (req, res) => {
    try {
        //console.log('Body', req.body)
        const errors = validationResult(req)

        if(!errors.isEmpty()){
            return res.status(400).json({
                errors: errors.array(),
                message: 'Некорректные данные при регистрации'
            })
        }

        const {username, password, email, isBanned, isAdmin} = req.body
        const candidate = await User.findOne({username})

        if(candidate){
            return res.status(400).json({message: 'Такой пользователь уже существет'})
        }
        
        const hashedPassword = await bcrypt.hash(password, 12)
        const user = User({username, password: hashedPassword, email, isBanned, isAdmin})

        await user.save()

        res.status(201).json({message: 'Пользователь создан'})

    } catch (e) {
        console.log(e.message)
        res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'})
    }
})

// /api/auth/login
router.post(
    '/login', 
    [
        check('username', 'Минимальная длина логина - 1 символ').isLength({min: 1}),
        check('password', 'Введите пароль').exists()
    ],
    async (req, res) => {
    try {
        const errors = validationResult(req)

        if(!errors.isEmpty()){
            return res.status(400).json({
                errors: errors.array(),
                message: 'Некорректные данные при входе в систему'
            })
        }

        const {username, password} = req.body

        const user = await User.findOne({username})

        if(!user){
            return res.status(400).json({message: 'Пользователь не найден'})
        }

        // console.log(user)

        if(user.isBanned){
            res.status(405).json({message: "Пользователь забанен"})
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch){
            return res.status(400).json({message: 'Неверный пароль, попробуйте снова'})
        }

        const token = jwt.sign(
            {userId: user.id, isAdmin: user.isAdmin}, 
            config.get('jwtSecret'),
            {expiresIn: '1h'}
        )

        res.json({token, userId: user.id, username: user.username, isBanned: user.isBanned})

    } catch (e) {
        res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'})
        console.log('Error: ' + e.message)
    }   
})

router.get("/user/:id", async(req, res) => {
    try {
        const user = await User.findOne({_id: req.params.id}).populate('texts')
        if(!user){
            return res.status(400).json({message: 'Пользователь не найден'})
        }
        // res.json({userId: user.id, username: user.username, email: user.email, isBanned: user.isBanned, isAdmin: user.isAdmin, avatar: user.avatar, texts: user.texts})
        res.json(user)
    } catch (e) {
        res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'})
        console.log('Error: ' + e.message)
    }
    
})

module.exports = router
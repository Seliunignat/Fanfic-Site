const {Router} = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')
const {check, validationResult} = require('express-validator')
const User = require('../models/User')
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

        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch){
            return res.status(400).json({message: 'Неверный пароль, попробуйте снова'})
        }

        const token = jwt.sign(
            {userId: user.id }, 
            config.get('jwtSecret'),
            {expiresIn: '1h'}
        )

        res.json({token, userId: user.id, username: user.username})

    } catch (e) {
        res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'})
        console.log('Error: ' + e.message)
    }   
})

module.exports = router
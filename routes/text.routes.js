const {Router} = require('express')
const config = require('config')
const Text = require('../models/Text')
const auth = require('../middleware/auth.middleware')
const {check, validationResult} = require('express-validator')
const User = require('../models/User')
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
        const {title, summary, author, date, chapters} = req.body

        const text = Text({title, summary, author, date, chapters})

        // console.log("text: " + text)

        const savedText = await text.save()

        // console.log("savedText: " + savedText)
        const userTexts = (await User.find({_id: author}))[0].texts
        //console.log(userTexts)

        userTexts.push(savedText._id)
        //console.log(userTexts)
        await User.updateOne({_id: author}, {$set : {texts: userTexts}})

        res.status(201).json({message: 'Фанфик успешно создан' })

    } catch (e) {
        console.log(e.message)
        res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'})
    }
})

router.post('/update/:id', auth, async (req, res) =>{
    try {
        //console.log("try to find text")
        const findedText = await Text.findOne({_id: req.params.id})
        // console.log(findedText)
        // console.log(req.body.text)
        const {title, summary, chapters} = req.body
        if(req.body){
            await Text.updateOne({_id: req.params.id}, {$set : {title: title, summary: summary, chapters: chapters, lastUpdate: new Date(Date.now())}})
            // findedText.title = req.body.text.title
        }
        //console.log("try to save")
        res.status(201).json({message: 'Фанфик успешно отредактирован' })
    } catch (e) {
        res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'})
    }
})

router.post('/setRateValueOnText/:id', auth, async(req, res) => {
    try {
        const {userId, rateValue} = req.body
        //console.log("req.body: userId = " + userId + ", rateValue = " + rateValue)
        
        if(userId){
            const text = await Text.findById(req.params.id)
            //console.log(text.title)
            //console.log("rateValue: " + rateValue)
            //console.log("userId: " + userId)
    
            const textRateValues = text.rateValues
    
            //console.log(textRateValues)
            
            var rateValueIndex = -1;
            textRateValues.forEach((element, index) => {
                if(element.user == userId){
                    rateValueIndex = index
                }
            });
            
            //console.log("rateValueIndex: " + rateValueIndex)

            if(rateValueIndex > -1){
                textRateValues[rateValueIndex].rateValue = rateValue
            }
            else{
                textRateValues.push({user: userId, rateValue: rateValue})
            }
            
            var avarage = 0;
            textRateValues.forEach(element => {
                avarage += element.rateValue
            })
            avarage /= textRateValues.length

            //console.log(avarage);

            const response = await Text.updateOne({_id: req.params.id}, {$set : { avarageRating: avarage, rateValues: textRateValues.map(element => {
                return element
            })}})

            //console.log(response)

            res.json("Оценка поставлена")
        }
    } catch (e) {
        res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'})
    }
})


router.get('/latest', async (req, res) => {
    try {
        const texts = await Text.find({}).sort({lastUpdate: -1}).limit(10).populate('author')
        res.json(texts)
    } catch (e) {
        res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'})
    }
})

router.get('/:id', async(req, res) => {
    try {
        const text = await Text.findById(req.params.id).populate('author') // ???
        res.json(text)
    } catch (e) {
        res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'})
    }
})

router.get(`/getUserTexts/:id`, async(req, res) => {
    try {
        // console.log("try to load")
        // console.log("req: ")
        // console.log(req)
        const texts = await Text.find({ author: req.params.id }).populate('author')
        res.json(texts)
    } catch (e) {
        res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'})
    }
})

router.post('/updateChapterLikesInText/:id', auth, async(req, res) => {
    try {
        const {chapter} = req.body
        const text = await Text.findById(req.params.id)

        //console.log(text)

        text.chapters.find(element => element._id == chapter._id).likes = chapter.likes

        //console.log(text.chapters)

        await Text.updateOne({_id: req.params.id}, {$set : {chapters: text.chapters}})

        res.json({message: 'Данные главы обновлены'})
    } catch (e) {
        res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'})
    }
})

router.delete('/delete/:id', async (req, res) => {
    try {
        //console.log("try to delete")
        await Text.remove({_id: req.params.id})
        res.json({message: "Успешно удалено"})
    } catch (e) {
        res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'})
    }
})


module.exports = router 
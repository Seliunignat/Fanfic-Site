const {Router} = require('express')
const Text = require('../models/Text')
const auth = require('../middleware/auth.middleware')
const {check, validationResult} = require('express-validator')
const algoliasearch = require('algoliasearch')
const User = require('../models/User')
const router = Router()

const client = algoliasearch(process.env.ALGOLIA_APPLICATION_ID, process.env.ALGOLIA_ADMIN_API_KEY)
const globalIndex = client.initIndex(process.env.ALGOLIA_INDEX_NAME)


const prepareText = (text) => {
    // console.log("text " + text)
    return{
        objectID: text._id,
        title: text.title,
        summary: text.summary,
        author: text.author.username,
        chapters: text.chapters.map(chapter => ({
            chapterTitle: chapter.chapterTitle,
            chapterContent: chapter.chapterContent
        })),
        comments: text.comments.map(comment => ({
            content: comment.content,
            author: comment.author
        }))
    }
}

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

        const savedText = await text.save()
        const textSaved = await Text.findById(savedText._id).populate('author')

        const prepared = await prepareText(textSaved)
        await globalIndex.saveObject(prepared)

        const userTexts = (await User.find({_id: author}))[0].texts

        userTexts.push(savedText._id)

        await User.updateOne({_id: author}, {$set : {texts: userTexts}})

        res.status(201).json({message: 'Фанфик успешно создан' })

    } catch (e) {
        console.log(e.message)
        res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'})
    }
});

router.post('/update/:id', auth, async (req, res) =>{
    try {
        //console.log("try to find text")
        const findedText = await Text.findOne({_id: req.params.id})
        // console.log(findedText)
        // console.log(req.body.text)
        const {title, summary, chapters} = req.body
        if(req.body){
            const updatedText = await Text.updateOne({_id: req.params.id}, {$set : {title: title, summary: summary, chapters: chapters, lastUpdate: new Date(Date.now())}})
            
            const text = await Text.findById({_id: req.params.id}).populate('author').populate('comments')

            // console.log(text)

            const prepared = await prepareText(text)
            await globalIndex.saveObject(prepared)

        }
        //console.log("try to save")
        res.status(201).json({message: 'Фанфик успешно отредактирован' })
    } catch (e) {
        res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'})
    }
});

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
});


router.get('/latest', async (req, res) => {
    try {
        const texts = await Text.find({}).sort({lastUpdate: -1}).limit(10).populate('author')
        res.json(texts)
    } catch (e) {
        res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'})
    }
});

router.get('/:id', async(req, res) => {
    try {
        const text = await Text.findById(req.params.id).populate('author') // ???
        res.json(text)
    } catch (e) {
        res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'})
    }
});

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
});

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
});

router.post('/:id/updateChaptersImages', async(req, res) => {
    try {
        const {chaptersImages} = req.body
        var chapters = (await Text.findById(req.params.id)).chapters
        chapters.forEach((chapter, index) => {
            chapter.chapterImage = chaptersImages[index]
        })
        await Text.updateOne({_id: req.params.id}, {$set : {chapters: chapters}})
    } catch (e) {
        
    }
})


router.delete('/delete/:id', async (req, res) => {
    try {
        //console.log("try to delete")
        await Text.remove({_id: req.params.id})

        await globalIndex.deleteObject(req.params.id)

        res.json({message: "Успешно удалено"})
    } catch (e) {
        res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'})
    }
});


module.exports = router 
const {Router, text} = require('express')
const Comment = require('../models/Comment')
const auth = require('../middleware/auth.middleware')
const {check, validationResult} = require('express-validator')
const algoliasearch = require('algoliasearch')
const Text = require('../models/Text')
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

        const uloadedComment = await comment.save()

        const commentsOfText = (await Text.findById(textId)).comments

        // console.log("commentsOfText\n" + commentsOfText)

        commentsOfText.push(uloadedComment)

        await Text.updateOne({_id: textId}, {$set: { comments: commentsOfText.map(commentOfText => commentOfText)} })

        const text = await Text.findById({_id: textId}).populate('author').populate('comments')
        const prepared = prepareText(text)
        await globalIndex.saveObject(prepared)

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
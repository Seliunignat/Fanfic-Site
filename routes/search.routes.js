const {Router} = require('express')
const Text = require('../models/Text')
const algoliasearch = require('algoliasearch')
const router = Router()

const client = algoliasearch("R0Q6VC5O2I", "6348fe46decdeeba82f4524c233288ee")

const globalIndex = client.initIndex('global')

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

const createIndex = async(req, res) => {
    try {
        const data = await Text.find({}).populate('author').populate('comments')

        const prepared = data.map(text => prepareText(text))

        await globalIndex.saveObjects(prepared)
        res.status(200).json({message: 's:indexes_created'})
    } catch (e) {
        console.log(e.message)
        res.status(500).json({message: 'Что-то пошло не так при создании индекса'})
    }
}

const addToIndex = async (text) => {
    const prepared = await prepareText(text)
    await globalIndex.saveObjects(prepared)
}

const deleteFromIndex = async (objectId) => {
    await globalIndex.deleteObject(objectId)
}

const updateIndex = async(text) => {
    await addToIndex(text)
}

const search = async (req, res) => {
    try {
        const textQuery = req.query.text
        const data = await globalIndex.search(textQuery)
        // console.log(data)
        res.status(200).json({result: data.hits})
    } catch (e) {
        res.status(500).json({message: 'Что-то пошло не так при поиске индекса'})
    }
}

router.get('/createAll', createIndex)
router.get('/create', async(req, res) => {
    try {
        const {text} = req.body
        await createIndex(text)
    } catch (e) {
        res.status(500).json({message: 'Что-то пошло не так при создании индекса'})
    }
})
router.get('/', search)

module.exports = router
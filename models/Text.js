const {Schema, model, Types} = require('mongoose')
const User = require('./User')

const schema = new Schema({
    title: {type: String, required: true},
    summary: {type: String},
    author: {type: Types.ObjectId, ref: 'User'},
    date: {type: Date, default: Date.now},
    lastUpdate: {type: Date, default: Date.now},
    chapters: [{id: Number, chapterTitle: String, chapterContent: String, chapterImage: {name: String, url: String}, order: Number, likes: [{type: Types.ObjectId, ref:'User'}]}],
    rateValues: [{user: {type: Types.ObjectId, ref:'User'}, rateValue: Number}],
    comments: [{type: Types.ObjectId, ref: 'Comment'}],
    avarageRating: {type: Number, default: 0}
})
// schema.index({'textTitle': 'text', 'chapters.chapterTitle': 'text', 'chapter.chapterContent': 'text', 'author': 'text'})

module.exports = model('Text', schema)
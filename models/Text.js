const {Schema, model, Types} = require('mongoose')
const User = require('./User')

const schema = new Schema({
    title: {type: String, required: true},
    author: {type: Types.ObjectId, ref: 'User'},
    date: {type: Date, default: Date.now},
    //chapters: [{type: Types.ObjectId, ref: 'Chapter'}]
    chapters: [{id: Number, chapterTitle: String, content: String, order: Number, likes: Number}]
})

module.exports = model('Text', schema)
const {Schema, model, Types} = require('mongoose')
const User = require('./User')

const schema = new Schema({
    title: {type: String, required: true},
    summary: {type: String},
    author: {type: Types.ObjectId, ref: 'User'},
    date: {type: Date, default: Date.now},
    lastUpdate: {type: Date, default: Date.now},
    chapters: [{id: Number, chapterTitle: String, chapterContent: String, order: Number, likes: Number}],
    rateValues: [{user: {type: Types.ObjectId, ref:'User'}, rateValue: Number}],
    avarageRating: {type: Number, default: 0}
})

module.exports = model('Text', schema)
const {Schema, model, Types} = require('mongoose')
const User = require('./User')
const Text = require('./Text')

const schema = new Schema({
    author: {type: Types.ObjectId, ref: 'User'},
    date: {type: Date, default: Date.now},
    content: {type: String},
    onFanfic: {type: Types.ObjectId, ref: 'Text'}
})

module.exports = model('Comment', schema)
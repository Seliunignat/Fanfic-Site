const {Schema, model, Types} = require('mongoose')

const schema = new Schema({
    id: {type: Number, required: true, unique: true},
    title: {type: String, required: true},
    content: {type: Text, default: ""},
    order: {type: Number, required: true},
    likes: {type: Number, default: 0}
})

module.exports = model('Chapter', schema)
const {Schema, model, Types} = require('mongoose')

const schema = new Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    email: {type: String, required: true},
    isBanned: {type: Boolean, required: true},
    isAdmin: {type: Boolean, required: true},
    texts: [{type: Types.ObjectId, ref: 'Text'}]
})

module.exports = model('User', schema)
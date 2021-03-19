const {Schema, model, Types} = require('mongoose')

const schema = new Schema({
    avatar: {type: String, default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"},
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    email: {type: String, required: true},
    isBanned: {type: Boolean, required: true},
    isAdmin: {type: Boolean, required: true},
    texts: [{type: Types.ObjectId, ref: 'Text', default: ""}]
})

module.exports = model('User', schema)
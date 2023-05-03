const mongoose = require('mongoose')
const uniqueValue = require('mongoose-unique-validator')
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        minLength: 3 ,
        required: true,
        unique: true
    },
    name: {
        type: String,
        minLength:3
    },
    passwordHash: String,
    blogs: [
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog' 
        }
    ]
})
userSchema.plugin(uniqueValue)
userSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = ret._id.toString()
        delete ret._id,
        delete ret.__v
        delete ret.passwordHash
    }
})

module.exports = mongoose.model('User', userSchema)
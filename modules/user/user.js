var mongoose = require('mongoose')

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: String,
    password: String,
    tel: String,
    email: String,
    createDate: String,
    lastLoginDate: String,
    lastLoginAddr: String,
    isAdmin:{
        type: Boolean,
        default: false
    },
    isShow:{
        type: Boolean,
        default: true
    }
})


module.exports = mongoose.model('user',userSchema)
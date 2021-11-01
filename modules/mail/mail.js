var mongoose = require('mongoose')

const Schema = mongoose.Schema;

const mailSchema = new Schema({
    id:{
        type:Number,
        default:1
    },
    mail:String,
    code:Number,
    createTime:{
        type:Number,
        default:new Date().getTime()
    }
})


module.exports = mongoose.model('mail',mailSchema)
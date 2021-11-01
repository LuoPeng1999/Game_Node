var mongoose = require('mongoose');

var ClassifySchema = new mongoose.Schema({
    ChineseName:{
        type:String
    },
    EnglishName:{
        type:String
    },
    author:{
        type:String
    },
    classify:{
        type:String
    },
    classifyUrl:{
        type:String
    },
    date:{
        type:String
    },
    detail:{
        type:String
    },
    gameVideo:{
        type:String
    },
    iframeUrl:{
        type:String
    },
    tag:{
        type:Array
    },
    tagUrl:{
        type:Array
    },
    downloadUrl:String,
    giftUrl:String,
    activationCode:Number,
    isShow:{
        type: Boolean,
        default:true
    }
});

module.exports = mongoose.model('game',ClassifySchema);

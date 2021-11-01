var mongoose = require('mongoose');

const Schema = mongoose.Schema;
var labelSchema = new Schema({
    total: {
        type:Number,
        default:0
    },
    label:[
        {
            key:String,
            label:String
        }
    ]
});

module.exports = mongoose.model('game_label',labelSchema);

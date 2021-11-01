const mongoose = require("mongoose");

const Schema = mongoose.Schema;
let NavbarSchema = new Schema({
    // 只有一条导航数据
    navbar:[
        {
            id:Number,  //数据id唯一
            name:String,
            path:String,
            url:String,
            icon:String,
            label:String,
            mate:{
                keepAlive:{
                    type:Boolean, // 是否被缓存
                    default:true
                },
            },
            pid:{ //父级id
                type:Number,
                default:0 //默认最大父级id为0
            },
            isShow:{
                type:Boolean,
                default:true
            }
        }
    ],
    count:{ //计算叠加值
        type:Number,
        default:1
    }
})

module.exports = mongoose.model('navbar',NavbarSchema);

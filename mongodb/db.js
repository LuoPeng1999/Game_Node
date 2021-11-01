const mongoose = require('mongoose')
const chalk = require('chalk')

mongoose.connect('mongodb://127.0.0.1:27017/game',{ useNewUrlParser: true ,useUnifiedTopology: true})
mongoose.Promise = global.Promise

const db = mongoose.connection

db.once('open',()=>{
    console.log(
        chalk.green('连接数据库成功')
    )
})

db.on('error',error=>{
    console.error(
        chalk.red('Error in MongoDB connection:' + error)
    )
    mongoose.disconnect();
})

db.on('close',()=>{
    console.log(
        chalk.red('数据库断开，重新连接数据库')
    )
    mongoose.connect('mongodb://127.0.0.1:27017/stu',{server:{auto_reconnect:true}})
})

module.exports = db
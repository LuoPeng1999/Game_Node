const chalk = require('chalk')
const db = require('./mongodb/db')
const bodyParser = require('body-parser')
var express = require('express')
var router = require('./routes/index')
var app = express()

//设置跨域访问
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    res.header("X-Powered-By",' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

// post 请求
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// 链接数据库
db

// 添加路由
router(app)

// 监听端口 启动服务
app.listen(3000,()=>{
	console.log(
		chalk.green('成功监听端口3000')
	)
})
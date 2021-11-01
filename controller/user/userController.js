const userModel = require('../../modules/user/user')
const md5Fun = require('md5')
const chalk = require('chalk')
const smtpMail = require('../../function/mail')
const mailModel = require('../../modules/mail/mail')
const { ObjectId } = require('bson')

class User {
    constructor(){
        this.login = this.login.bind(this)
        this.register = this.register.bind(this)
        this.md5 = this.md5.bind(this)
        this.verifyCode = this.verifyCode.bind(this)
        this.sendMail = this.sendMail.bind(this)
        this.resetPassword = this.resetPassword.bind(this)
        this.getUser = this.getUser.bind(this)
        this.delUser = this.delUser.bind(this)
        this.editUser = this.editUser.bind(this)
        this.jsonData = {
            mate: {
                status: 200,
                message: ''
            },
            data:null
        }
    }

    async login(req,res,next){
        try {
            var { username, password,lastLoginDate,lastLoginAddr } = req.body;
            if(username && password){
                password = this.md5(password)
                var userDoc = await userModel.findOne({username:username})
                if(!userDoc){
                    this.jsonData.mate.status = 210
                    this.jsonData.mate.message = '该用户不存在'
                    this.jsonData.data = null
                    res.status(this.jsonData.mate.status).json(this.jsonData)
                    return
                }else if(userDoc.isShow == false){
                    this.jsonData.mate.status = 210
                    this.jsonData.mate.message = '无法操作该角色'
                    this.jsonData.data = null
                    res.status(this.jsonData.mate.status).json(this.jsonData)
                    return
                }
                if(password != userDoc.password){
                    this.jsonData.mate.status = 210
                    this.jsonData.data = null
                    this.jsonData.mate.message = '密码错误，请重新输入密码'
                    res.status(this.jsonData.mate.status).json(this.jsonData)
                    return
                }else{
                    await userModel.updateOne({username:username},{lastLoginAddr:lastLoginAddr,lastLoginDate:lastLoginDate})
                    this.jsonData.data = {}
                    this.jsonData.data.username = userDoc.username
                    this.jsonData.data.tel = userDoc.tel
                    this.jsonData.data.email = userDoc.email
                    this.jsonData.data.createDate = userDoc.createDate
                    this.jsonData.data.lastLoginDate = userDoc.lastLoginDate
                    this.jsonData.data.lastLoginAddr = userDoc.lastLoginAddr
                    this.jsonData.mate.status = 200
                    this.jsonData.mate.message = '登录成功'
                    res.status(this.jsonData.mate.status).json(this.jsonData)
                }
            }else{
                this.jsonData.mate.status = 210
                this.jsonData.data = null
                this.jsonData.mate.message = '请输入账号或者密码'
                res.status(this.jsonData.mate.status).json(this.jsonData)
                return
            }
        } catch (error) {
            console.log(
                chalk.red(error)
            );
            this.jsonData.mate.status = 210
            this.jsonData.mate.message = '登录失败'
            this.jsonData.data = null
            res.status(this.jsonData.mate.status).json(this.jsonData)
            return
        }
    }
    async register(req,res,next){
        try {
            var { username, password, createDate, email, telephone, lastLoginAddr } = req.body
            if(username && password && createDate && email && telephone && lastLoginAddr){
                var userDoc = await userModel.findOne({username:username})
                var emailDoc = await userModel.findOne({email:email})
                var telDoc = await userModel.findOne({tel:telephone})
                if(userDoc){
                    this.jsonData.mate.status = 210
                    this.jsonData.mate.message = '该账号已存在'
                    this.jsonData.data = null
                    res.status(this.jsonData.mate.status).json(this.jsonData)
                    return
                }
                if(emailDoc){
                    this.jsonData.mate.status = 210
                    this.jsonData.mate.message = '该邮箱已绑定其他账号'
                    this.jsonData.data = null
                    res.status(this.jsonData.mate.status).json(this.jsonData)
                    return
                }
                if(telDoc){
                    this.jsonData.mate.status = 210
                    this.jsonData.mate.message = '该手机号已绑定其他账号'
                    this.jsonData.data = null
                    res.status(this.jsonData.mate.status).json(this.jsonData)
                    return
                }
                var obj = {}
                password = this.md5(password)
                obj.username = username
                obj.password = password
                obj.createDate = createDate
                obj.email = email
                obj.tel = telephone
                obj.lastLoginDate = createDate
                obj.lastLoginAddr = lastLoginAddr
                await userModel.insertMany(obj)
                this.jsonData.mate.message = '注册成功'
                this.jsonData.data = null
                this.jsonData.mate.status = 200
                res.status(this.jsonData.mate.status).json(this.jsonData)
            }else{
                this.jsonData.mate.status = 210
                this.jsonData.mate.message = '请填写完整注册信息'
                this.jsonData.data = null
                res.status(this.jsonData.mate.status).json(this.jsonData)
                return
            }
        } catch (error) {
            console.log(
                chalk.red(error)
            );
            this.jsonData.mate.status = 210
            this.jsonData.mate.message = '注册失败'
            this.jsonData.data = null
            res.status(this.jsonData.mate.status).json(this.jsonData)
            return
        }
    }
    md5(password){
        const pass = md5Fun(md5Fun(password).substr(11,7) + md5Fun(password))
        return pass
    }
    async verifyCode(req,res,next){
        try {
            var { id,code } = req.body
            var mailDoc = await mailModel.findOne({id:id})
            if(mailDoc){
                var nowTime = parseInt(new Date().getTime())
                var createTime = parseInt(mailDoc.createTime)
                var aging = 5*60*1000
                if((nowTime - createTime) < aging){
                    if(code == mailDoc.code){
                        this.jsonData.mate.status = 200
                        delete this.jsonData.id
                        this.jsonData.mate.message = '验证成功'
                        this.jsonData.data = null
                        res.status(this.jsonData.mate.status).json(this.jsonData)
                    }else{
                        this.jsonData.mate.status = 210
                        delete this.jsonData.id
                        this.jsonData.mate.message = '验证码输入错误'
                        this.jsonData.data = null
                        res.status(this.jsonData.mate.status).json(this.jsonData)
                        return
                    }
                }else{
                    this.jsonData.mate.status = 210
                    delete this.jsonData.id
                    this.jsonData.mate.message = '验证码已超时'
                    this.jsonData.data = null
                    res.status(this.jsonData.mate.status).json(this.jsonData)
                    return
                }
            }else{
                this.jsonData.mate.status = 210
                this.jsonData.mate.message = '暂未获取验证码'
                this.jsonData.data = null
                res.status(this.jsonData.mate.status).json(this.jsonData)
                return
            }
        } catch (error) {
            console.log(
                chalk.red(error)
            );
            this.jsonData.mate.status = 210
            this.jsonData.mate.message = '验证失败'
            this.jsonData.data = null
            res.status(this.jsonData.mate.status).json(this.jsonData)
            return
        }
    }
    async sendMail(req,res,next){
        try {
            var { email } = req.body
            var mailCode = smtpMail.randomCode()
            var html = '【系统账号重置密码】验证码'+mailCode+'，用于账号重置密码,5分钟内有效。泄露有风险，如非本人操作，请忽略本条信息。'
            var subject = '系统账号重置密码'

            var userDoc = await userModel.findOne({email:email})
            if(!userDoc){   
                this.jsonData.mate.status = 210
                this.jsonData.mate.message = '该邮箱暂未绑定系统账号'
                this.jsonData.data = null
                res.status(this.jsonData.mate.status).json(this.jsonData)
                return
            }else if(userDoc.isShow == false){
                this.jsonData.mate.status = 210
                this.jsonData.mate.message = '无法操作该角色'
                this.jsonData.data = null
                res.status(this.jsonData.mate.status).json(this.jsonData)
                return
            }else{
                smtpMail.sendMail(email,subject,html,async (err,result)=>{
                    if(err){
                        this.jsonData.mate.status = 210
                        this.jsonData.mate.message = '验证码发送失败'
                        this.jsonData.data = null
                        res.status(this.jsonData.mate.status).json(this.jsonData)
                        return
                    }
                    var mailDoc = await mailModel.find()
                    var obj = {}
                    obj.mail = email
                    obj.id = mailDoc.length + 1
                    obj.code = mailCode
                    await mailModel.insertMany(obj)
                    this.jsonData.id = obj.id
                    this.jsonData.mate.message = '验证码发送成功'
                    this.jsonData.mate.status = 200
                    this.jsonData.data = null
                    res.status(this.jsonData.mate.status).json(this.jsonData)
                })
            }
        } catch (error) {
            console.log(
                chalk.red(error)
            );
            this.jsonData.mate.status = 210
            this.jsonData.mate.message = '验证码发送失败'
            this.jsonData.data = null
            res.status(this.jsonData.mate.status).json(this.jsonData)
            return
        }
    }
    async resetPassword(req,res,next){
        try {
            var { email , password } = req.body
            var userDoc = await userModel.findOne({email:email})
            if(userDoc){
                password = this.md5(password)
                userDoc.password = password
                await userModel.updateOne({email:email},{password:password})
                this.jsonData.mate.status = 200
                this.jsonData.mate.message = '重置密码成功'
                this.jsonData.data = null
                res.status(this.jsonData.mate.status).json(this.jsonData)
            }else{
                this.jsonData.mate.status = 210
                this.jsonData.mate.message = '该邮箱暂未绑定系统账号'
                this.jsonData.data = null
                res.status(this.jsonData.mate.status).json(this.jsonData)
                return
            }
        } catch (error) {
            console.log(
                chalk.red(error)
            );
            this.jsonData.mate.status = 210
            this.jsonData.mate.message = '重置密码失败'
            this.jsonData.data = null
            res.status(this.jsonData.mate.status).json(this.jsonData)
            return
        }
    }
    async getUser(req,res,next){
        let jsonData = {
            mate: {
                status: 200,
                message: ''
            },
            data:null
        }
        var page = req.query.page || 1
        var pageSize = req.query.pageSize || 10
        var keyword = req.query.keyword
        try {
            // 分页
            if(keyword == "" || keyword == null){
                var doc = await userModel.find().skip((parseInt(page) - 1) * parseInt(pageSize)).limit(parseInt(pageSize)).sort({date:-1}).select(
                    'username isAdmin tel email createDate lastLoginDate lastLoginAddr isShow'
                )
                var total = await userModel.count()
            }else{
                // 模糊查询
                var reg = new RegExp(keyword,'i')
                var doc = await userModel.find({"$or":[
                    {username:reg},
                    {email:reg},
                    {tel:reg}
                ]}).skip((parseInt(page) - 1) * parseInt(pageSize)).limit(parseInt(pageSize)).sort({date:-1}).select(
                    'username isAdmin tel email createDate lastLoginDate lastLoginAddr isShow'
                )
                var total = await userModel.count({"$or":[
                    {username:reg},
                    {email:reg},
                    {tel:reg}
                ]})
            }
            jsonData.mate.message = '查询成功'
            jsonData.mate.status = 200
            jsonData.data = doc
            jsonData.total = total
            res.status(jsonData.mate.status).json(jsonData)
        } catch (error) {
            console.log(
                chalk.red(error)
            );
            jsonData.mate.status = 210
            jsonData.mate.message = '查询用户失败'
            jsonData.data = null
            res.status(jsonData.mate.status).json(jsonData)
            return
        }
    }
    async delUser(req,res,next){
        try {
            let { _id } = req.body
            if(_id){
                _id = new ObjectId(_id)
                await userModel.updateOne({_id:_id},{isShow:false})
                this.jsonData.mate.status = 200
                this.jsonData.mate.message = '删除成功'
                this.jsonData.data = null
                res.status(this.jsonData.mate.status).json(this.jsonData)
            }else{
                this.jsonData.mate.status = 210
                this.jsonData.mate.message = '请传递正确的游戏Id'
                this.jsonData.data = null
                res.status(this.jsonData.mate.status).json(this.jsonData)
                return
            }
        } catch (error) {
            console.log(
                chalk.red(error)
            );
            this.jsonData.mate.status = 210
            this.jsonData.mate.message = '删除失败'
            this.jsonData.data = null
            res.status(this.jsonData.mate.status).json(this.jsonData)
            return
        }
    }
    async editUser(req,res,next){
        try {
            let { _id , isShow } = req.body
            if(_id){
                _id = new ObjectId(_id)
                await userModel.updateOne({_id:_id},{isShow:isShow})
                this.jsonData.mate.status = 200
                this.jsonData.mate.message = '修改成功'
                this.jsonData.data = null
                res.status(this.jsonData.mate.status).json(this.jsonData)
            }else{
                this.jsonData.mate.status = 210
                this.jsonData.mate.message = '请传递正确的游戏Id'
                this.jsonData.data = null
                res.status(this.jsonData.mate.status).json(this.jsonData)
                return
            }
        } catch (error) {
            console.log(
                chalk.red(error)
            );
            this.jsonData.mate.status = 210
            this.jsonData.mate.message = '删除失败'
            this.jsonData.data = null
            res.status(this.jsonData.mate.status).json(this.jsonData)
            return
        }
    }
}

module.exports = new User()
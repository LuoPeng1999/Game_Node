const gameModel = require('../../modules/game/game')
const chalk = require('chalk')
const { ObjectId } = require('bson')

class Game {
    constructor(){
        this.getGame = this.getGame.bind(this)
        this.insertGame = this.insertGame.bind(this)
        this.editGame = this.editGame.bind(this)
        this.delGame = this.delGame.bind(this)
        this.jsonData = {
            mate: {
                status: 200,
                message: ''
            },
            data:null
        }
    }

    async getGame(req,res,next){
        try {
            // 分页
            var page = req.query.page || 1
            var pageSize = req.query.pageSize || 10
            var keyword = req.query.keyword;

            if(keyword == "" || keyword == null){
                var doc = await gameModel.find().skip((parseInt(page) - 1) * parseInt(pageSize)).limit(parseInt(pageSize)).sort({date:-1})
                var total = await gameModel.count()
            }else{
                // 模糊查询
                var reg = new RegExp(keyword,'i')
                var doc = await gameModel.find({"$or":[
                    {ChineseName:reg},
                    {EnglishName:reg},
                ]}).skip((parseInt(page) - 1) * parseInt(pageSize)).limit(parseInt(pageSize)).sort({date:-1})
                var total = await gameModel.count({"$or":[
                    {ChineseName:reg},
                    {EnglishName:reg},
                ]})
            }
            this.jsonData.mate.message = '查询成功'
            this.jsonData.mate.status = 200
            this.jsonData.data = doc
            this.jsonData.total = total
            res.status(this.jsonData.mate.status).json(this.jsonData)
        } catch (error) {
            console.log(
                chalk.red(error)
            );
            this.jsonData.mate.status = 210
            this.jsonData.mate.message = '查询失败'
            this.jsonData.data = null
            res.status(this.jsonData.mate.status).json(this.jsonData)
            return
        }
    }
    async insertGame(req,res,next){
        try {
            var gameBody = req.body
            await gameModel.insertMany(gameBody)
            this.jsonData.mate.status = 200
            this.jsonData.mate.message = '添加成功'
            this.jsonData.data = null
            res.status(this.jsonData.mate.status).json(this.jsonData)
        } catch (error) {
            console.log(
                chalk.red(error)
            );
            this.jsonData.mate.status = 210
            this.jsonData.mate.message = '添加游戏失败'
            this.jsonData.data = null
            res.status(this.jsonData.mate.status).json(this.jsonData)
            return
        }
    }
    async editGame(req,res,next){
        try {
            let { _id , ...gamebody} = req.body
            if(_id){
                _id = new ObjectId(_id)
                await gameModel.updateOne({_id:_id},gamebody)
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
            this.jsonData.mate.message = '修改游戏失败'
            this.jsonData.data = null
            res.status(this.jsonData.mate.status).json(this.jsonData)
            return
        }
    }
    async delGame(req,res,next){
        try {
            let { _id } = req.body
            if(_id){
                _id = new ObjectId(_id)
                await gameModel.updateOne({_id:_id},{isShow:false})
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
}

module.exports = new Game()
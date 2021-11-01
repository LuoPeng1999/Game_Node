const gameLabelModel = require('../../modules/gameLabel/gameLabel')
const chalk = require('chalk')
const { ObjectId } = require('bson')

class GameLabel {
    constructor(){
        this.getGameLabel = this.getGameLabel.bind(this)
        this.insertGameLabel = this.insertGameLabel.bind(this)
        this.editGameLabel = this.editGameLabel.bind(this)
        this.delGameLabel = this.delGameLabel.bind(this)
        this.jsonData = {
            mate: {
                status: 200,
                message: ''
            },
            data:null
        }
    }

    async getGameLabel(req,res,next){
        try {
            var gameLabelDoc = await gameLabelModel.find()
            this.jsonData.data = gameLabelDoc[0].label
            this.jsonData.total = gameLabelDoc[0].total
            this.jsonData.mate.status = 200
            this.jsonData.mate.message = '查询成功'
            res.status(this.jsonData.mate.status).json(this.jsonData)
        } catch (error) {
            console.log(
                chalk.red(error)
            );
            this.jsonData.mate.status = 210
            this.jsonData.mate.message = '查询游戏标签失败'
            this.jsonData.data = null
            res.status(this.jsonData.mate.status).json(this.jsonData)
            return
        }
    }
    async insertGameLabel(req,res,next){
        try {
            var gameLabelBody = req.body
            var gameLabelDoc = await gameLabelModel.findOne()
            for (var i = 0; i < gameLabelDoc.label.length; i++) {
                if(gameLabelDoc.label[i].label == gameLabelBody.label){
                    this.jsonData.mate.status = 210
                    this.jsonData.mate.message = '该游戏标签已存在'
                    this.jsonData.data = null
                    res.status(this.jsonData.mate.status).json(this.jsonData)
                    return
                }
            }
            gameLabelDoc.label.push(gameLabelBody)
            gameLabelDoc.total += 1
            gameLabelDoc.save(()=>{
                this.jsonData.mate.status = 200
                this.jsonData.mate.message = '添加游戏标签成功'
                this.jsonData.data = null
                res.status(this.jsonData.mate.status).json(this.jsonData)
            })
        } catch (error) {
            console.log(
                chalk.red(error)
            );
            this.jsonData.mate.status = 210
            this.jsonData.mate.message = '添加游戏标签失败'
            this.jsonData.data = null
            res.status(this.jsonData.mate.status).json(this.jsonData)
            return
        }
    }
    async editGameLabel(req,res,next){
        try {
            var gameLabelBody = req.body
            var gameLabelDoc = await gameLabelModel.findOne()
            gameLabelDoc.label.forEach(item=>{
                if(gameLabelBody._id == item._id){
                    item.label = gameLabelBody.label
                    item.key = gameLabelBody.label
                }
            })
            gameLabelDoc.save(()=>{
                this.jsonData.mate.status = 200
                this.jsonData.mate.message = '更新游戏标签成功'
                this.jsonData.data = null
                res.status(this.jsonData.mate.status).json(this.jsonData)
            })
        } catch (error) {
            console.log(
                chalk.red(error)
            );
            this.jsonData.mate.status = 210
            this.jsonData.mate.message = '更新游戏标签失败'
            this.jsonData.data = null
            res.status(this.jsonData.mate.status).json(this.jsonData)
            return
        }
    }
    async delGameLabel(req,res,next){
        // 开放世界
        try {
            var { _id } = req.body
            var gameLabelDoc = await gameLabelModel.findOne()
            gameLabelDoc.label.forEach((item,index)=>{
                if(_id == item._id){
                    gameLabelDoc.label.splice(index,1)
                    gameLabelDoc.total -= 1
                }
            })
            gameLabelDoc.save(()=>{
                this.jsonData.mate.status = 200
                this.jsonData.mate.message = '删除游戏标签成功'
                this.jsonData.data = null
                res.status(this.jsonData.mate.status).json(this.jsonData)
            })
        } catch (error) {
            console.log(
                chalk.red(error)
            );
            this.jsonData.mate.status = 210
            this.jsonData.mate.message = '删除游戏标签失败'
            this.jsonData.data = null
            res.status(this.jsonData.mate.status).json(this.jsonData)
            return
        }
    }
}

module.exports = new GameLabel()
const navbarModel = require('../../modules/navbar/navbar')
const tree = require('../../public/js/tree')
const treejson = require('../../public/js/treejson')
const chalk = require('chalk')

class Navbar {
    constructor(){
        this.getNavbar = this.getNavbar.bind(this)
        this.insertNavbar = this.insertNavbar.bind(this)
        this.delNavbar = this.delNavbar.bind(this)
        this.editNavbar = this.editNavbar.bind(this)
        this.jsonData = {
            mate:{
                status: 200,
                message: '查询成功'
            },
            data:null
        }
    }

    async getNavbar(req,res,next){
        try {
            var nav = []
            var navbars = await navbarModel.find()
            // navbars[0].navbar = navbars[0].navbar.filter(item=>{
            //     return item.isShow == true
            // })
            this.jsonData.mate.status = 200
            this.jsonData.mate.message = '查询成功'
            this.jsonData.data = navbars[0].navbar
            res.status(this.jsonData.mate.status).json(this.jsonData)
        } catch (error) {
            console.log(
                chalk.red(error)
            );
            this.jsonData.mate.status = 210
            this.jsonData.mate.message = '查询失败'
            this.jsonData.data = null
            res.status(this.jsonData.mate.status).json(this.jsonData)
        }
    }
    async insertNavbar(req,res,next){
        try {
            let body = req.body
            var doc = await navbarModel.findOne()
            doc.count += 1 //每次添加一条数据参数加一
            body.id = doc.count || 1 //获取默认id编号唯一
            body.mate = {
                keepAlive: true
            }
            doc.navbar.push(body)
            doc.save(()=>{
                this.jsonData.mate.status = 200
                this.jsonData.mate.message = '添加成功'
                this.jsonData.data = null
                res.status(this.jsonData.mate.status).json(this.jsonData)
            })
        } catch (error) {
            console.log(
                chalk.red(error)
            );
            this.jsonData.mate.status = 210
            this.jsonData.mate.message = '添加失败'
            this.jsonData.data = null
            res.status(this.jsonData.mate.status).json(this.jsonData)
        }
    }
    async delNavbar(req,res,next){
        try {
            let { _id } = req.body
            var doc = await navbarModel.findOne()
            let index = doc.navbar.findIndex(value=>value._id == _id)
            doc.navbar[index].isShow = false // 隐藏数据
            doc.save(()=>{
                this.jsonData.mate.status = 200
                this.jsonData.mate.message = '删除成功'
                this.jsonData.data = null
                res.status(this.jsonData.mate.status).json(this.jsonData)
            })
        } catch (error) {
            console.log(
                chalk.red(error)
            );
            this.jsonData.mate.status = 210
            this.jsonData.mate.message = '删除失败'
            this.jsonData.data = null
            res.status(this.jsonData.mate.status).json(this.jsonData)
        }
    }
    async editNavbar(req,res,next){
        try {
            let { _id , ...input} = req.body
            var doc = await navbarModel.findOne()
            let objIndex = doc.navbar.findIndex(value=>value._id == _id)
            for (let i in input) {
                doc.navbar[objIndex][i] = input[i]
            }
            doc.save(()=>{
                this.jsonData.mate.status = 200
                this.jsonData.mate.message = '修改成功'
                this.jsonData.data = null
                res.status(this.jsonData.mate.status).json(this.jsonData)
            })
        } catch (error) {
            console.log(
                chalk.red(error)
            );
            this.jsonData.mate.status = 210
            this.jsonData.mate.message = '修改失败'
            this.jsonData.data = null
            res.status(this.jsonData.mate.status).json(this.jsonData)
        }
    }
}

module.exports = new Navbar()
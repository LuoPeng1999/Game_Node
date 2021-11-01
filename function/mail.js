var nodemailer = require('nodemailer')
var smtpTransport = require('nodemailer-smtp-transport')
var config = require('../config/default')

smtpTransport = nodemailer.createTransport(smtpTransport({
    service: config.email.service,
    auth: {
        user: config.email.user,
        pass: config.email.pass
    }
}))

/**
 * @param {String} recipient 收件人
 * @param {String} subject 发送的主题
 * @param {String} html 发送的html内容
 */

exports.sendMail = function (recipient, subject, html, callBack) {
    smtpTransport.sendMail({
        from: config.email.user,
        to: recipient,
        subject: subject,
        html: html
    },(err,res)=>{
        callBack(err,res)
    })
}


// 随机生成6位数
exports.randomCode = function randomCode() {
    var arr = []
    for (var i =0; i < 6; i++) {
        var n = Math.ceil(Math.random()*9);
        arr.push(n)
    }
    return arr.join('')
}

const express = require('express')
const User = require('../controller/user/userController')
const router = express.Router()

router.post('/login',User.login)
router.post('/register',User.register)
router.post('/verifyCode',User.verifyCode)
router.post('/sendMail',User.sendMail)
router.post('/resetPassword',User.resetPassword)
router.post('/delUser',User.delUser)
router.post('/editUser',User.editUser)
router.get('/getUser',User.getUser)

module.exports = router
const express = require('express')
const Navbar = require('../controller/navbar/navbarController')
const router = express.Router()

router.get('/getNavbar',Navbar.getNavbar)
router.post('/insertNavbar',Navbar.insertNavbar)
router.post('/delNavbar',Navbar.delNavbar)
router.post('/editNavbar',Navbar.editNavbar)

module.exports = router
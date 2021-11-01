const express = require('express')
const Address = require('../controller/address/addressController')
const router = express.Router()

router.post('/getAddress',Address.getAddress)

module.exports = router
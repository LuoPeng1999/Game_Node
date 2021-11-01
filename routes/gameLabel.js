const express = require('express')
const GameLabel = require('../controller/gameLabel/gameLabelController')
const router = express.Router()

router.get('/getGameLabel',GameLabel.getGameLabel)
router.post('/insertGameLabel',GameLabel.insertGameLabel)
router.post('/editGameLabel',GameLabel.editGameLabel)
router.post('/delGameLabel',GameLabel.delGameLabel)

module.exports = router
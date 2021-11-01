const express = require('express')
const Game = require('../controller/game/gameController')
const router = express.Router()

router.get('/getGame',Game.getGame)
router.post('/insertGame',Game.insertGame)
router.post('/editGame',Game.editGame)
router.post('/delGame',Game.delGame)

module.exports = router
const user = require('./user')
const game = require('./game')
const gameLabel = require('./gameLabel')
const navbar = require('./navbar')
const address = require('./address')

module.exports = app => {
    app.use('/user',user)
    app.use('/game',game)
    app.use('/gameLabel',gameLabel)
    app.use('/navbar',navbar)
    app.use('/address',address)
}
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const passport = require('passport')
require('./config/passport')
const connection = require('./config/database')
const app = express()

if(process.env.NODE_ENV != 'production'){
    require('dotenv').config()
    app.use(morgan('dev'))
}

// Connect to database
connection

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cors())

// Passport
require('./config/passport')

// Routes
app.use('/auth', require('./routes/auth_route'))
app.use('/profile', passport.authenticate('jwt', {session: false}), require('./routes/user_route'))
app.use('/address', passport.authenticate('jwt', {session: false}), require('./routes/address_route'))
app.use('/drug-allergy', passport.authenticate('jwt', {session: false}), require('./routes/drug_allergy_route'))
app.use('/congenital-disease', passport.authenticate('jwt', {session: false}), require('./routes/congenital_route'))

const PORT = process.env.PORT || 8000

app.listen(PORT, () => {
    console.log(`User Profile Service listening on ${PORT}`)
})

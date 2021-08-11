const express = require('express')
const cors = require('cors')
const passport = require('passport')
const morgan = require('morgan')
const app = express()

if(process.env.NODE_ENV != 'production'){
    require('dotenv').config()
    app.use(morgan('dev'))
}

// Connect to database
require('./config/database').dbConnection

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cors())
app.use('/public', express.static('./public'))

// Express session
const expressSession = require('express-session')({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
})
app.use(expressSession)

// Routes
const authRoute = require('./routes/auth')
const userRoute = require('./routes/user')
const addressRoute = require('./routes/address')

app.use('/api/auth', authRoute)
app.use('/api/user', userRoute)
app.use('/api/address', addressRoute)

app.listen(process.env.PORT || 8080, () => {
    console.log(`Server starts at port ${process.env.PORT || 8080}`)
})

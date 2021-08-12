const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
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
app.use('/public', express.static('./public'))

// Routes
const authRoute = require('./routes/auth_route')

app.use('/auth', authRoute)


app.get('/', async (req, res) => {
    connection.query('show databases; show tables;', (err, results, fields) => {
        if(err) return res.json({message: err.message})
        return res.json({results})
    });
})

const PORT = process.env.PORT || 8000

app.listen(PORT, () => {
    console.log(`User Profile Service listening on ${PORT}`)
})

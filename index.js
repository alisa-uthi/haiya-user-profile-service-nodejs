const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
var connection = require('./config/database')
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
app.get('/', (req, res) => {
    connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
        if (error) throw error;
        console.log('The solution is: ', results[0].solution);
      })
})

const PORT = process.env.PORT || 8000

app.listen(PORT, () => {
    console.log(`User Profile Service listening on ${PORT}`)
})

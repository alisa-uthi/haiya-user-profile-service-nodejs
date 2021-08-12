const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const path = require('path')
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
// app.use('/public', express.static('./public'))
// app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.static(__dirname+'/public'));
app.use('/public/uploads', express.static(__dirname + '/public/uploads', { maxAge: '1m' }));

// Passport
require('./config/passport')

// Routes
app.use('/auth', require('./routes/auth_route'))
app.use('/user', require('./routes/user_route'))
app.use('/drug-allergy', require('./routes/drug_allergy_route'))


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

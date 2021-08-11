const express = require('express')
const router = express.Router()
const authService = require('../services/auth_service')

router.post('/signup', (req, res) => {
    authService.signup(req, res)
})

router.get('/user/:userId', (req, res) => {
    authService.getUserById(req.params.userId, res)
})


module.exports = router
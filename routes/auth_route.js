const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const passport = require('passport')
const authService = require('../services/auth_service')

// Sign up
router.post('/signup', async (req, res) => {
    try {
        const result = await authService.signup(req)
        res.status(201).json({ message: "Sign up successfully", data: result })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

router.post('/signin', (req, res, next) => {
    passport.authenticate('local', {session: false}, (err, user, info) => {
        if (err) return next(err)
        if(user) {
            const token = jwt.sign({ user }, process.env.JWT_SECRET)
            return res.status(200).json({user, token})
        } else {
            return res.status(422).json({ error: info })
         }
    })(req, res, next);
})

module.exports = router
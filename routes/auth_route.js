const express = require('express')
const router = express.Router()
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

module.exports = router
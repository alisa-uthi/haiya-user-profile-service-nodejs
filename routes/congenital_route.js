const express = require('express')
const router = express.Router()
const congenitalDiseaseService = require('../services/congenital_service')

// Update congenital disease by disease id
router.put('/:congenitalId', async (req, res) => {
    try {
        const congenitalId = req.params.congenitalId

        await congenitalDiseaseService.updatetCongenitalDisease(req.body, congenitalId)
        const result = await congenitalDiseaseService.getCongenitalDiseaseById(congenitalId)
        
        res.status(200).json({ data: result })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Add congenital disease by user id
router.post('/user/:userId', async (req, res) => {
    try {
        const result = await congenitalDiseaseService.insertCongenitalDisease(req.body, req.params.userId)
        res.status(200).json({ data: result })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Get all congenital disease by user id
router.get('/user/:userId', async (req, res) => {
    try {
        const result = await congenitalDiseaseService.getCongenitalDisByUserId(req.params.userId)
        res.status(200).json({ data: result })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

module.exports = router
const express = require('express')
const router = express.Router()
const congenitalDiseaseService = require('../services/congenital_service')

// Create congenital disease by user id
router.post('/:userId', async (req, res) => {
    try {
        const result = await congenitalDiseaseService.insertCongenitalDisease(req.body, req.params.userId)
        res.status(200).json({ data: result })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Get all congenital disease by user id
router.get('/:userId', async (req, res) => {
    try {
        const result = await congenitalDiseaseService.getCongenitalDisByUserId(req.params.userId)
        res.status(200).json({ data: result })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Update congenital disease by allergy id
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

module.exports = router
const express = require('express')
const router = express.Router()
const drugAllergyService = require('../services/drug_allergy_service')

// Create drug allergy by user id
router.post('/:userId', async (req, res) => {
    try {
        const result = await drugAllergyService.insertDrugAllergy(req.body, req.params.userId)
        res.status(200).json({ data: result })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Get all drug allergy by user id
router.get('/:userId', async (req, res) => {
    try {
        const result = await drugAllergyService.getDrugAlleryByUserId(req.params.userId)
        res.status(200).json({ data: result })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Update drug allergy by allergy id
router.put('/:allergyId', async (req, res) => {
    try {
        const allergyId = req.params.allergyId

        await drugAllergyService.updatetDrugAllery(req.body, allergyId)
        const result = await drugAllergyService.getDrugAlleryById(allergyId)
        
        res.status(200).json({ data: result })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

module.exports = router
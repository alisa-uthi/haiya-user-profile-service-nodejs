const express = require('express')
const router = express.Router()
const addressService = require('../services/address_service')
const personalAddrService = require('../services/personal_addr_service')

// Get all address by user id
router.get('/user/:userId', async (req, res) => {
    try {
        const result = await addressService.getAddressByUserId(req.params.userId)
        res.status(200).json({ data: result })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Get address by address id
router.get('/:id', async (req, res) => {
    try {
        const result = await addressService.getAddressById(req.params.id)
        res.status(200).json({ data: result })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Add address by user id
router.post('/user/:userId', async (req, res) => {
    try {
        const addressId = await addressService.insertAddress(req.body)
        await personalAddrService.insertPersonalAddress(req.params.userId, addressId)
        
        res.status(200).json({ data: "This address is added successfully." })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Update address by user id
router.put('/:addressId', async (req, res) => {
    try {
        const addressId = req.params.addressId
  
        await addressService.updateAddressById(req.body, addressId)
        const result = await addressService.getAddressById(addressId)
  
        res.status(200).json({ data: result })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Update flag delete of the address by address id
router.delete('/:addressId', async (req, res) => {
    try {
        await addressService.updateFlagDelete(req.params.addressId)
        res.status(200).json({ data: "Remove the address successfully." })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

module.exports = router
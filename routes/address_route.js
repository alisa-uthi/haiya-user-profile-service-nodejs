const express = require('express')
const router = express.Router()
const addressService = require('../services/address_service')

// Get address by address id
router.get('/:addressId', async (req, res) => {
    try {
        const result = await addressService.getAddressById(req.params.addressId)
        res.status(200).json({ data: result })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Update address by address id
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

// Update delivery address by user id
router.patch('/:addressId', async (req, res) => {
    try {
        const { addressId } = req.params
        const { userId, isDeliveryAddress } = req.body
        
        const result = await addressService.updateDeliveryAddress(userId, addressId, isDeliveryAddress)
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

// Get all address by user id
router.get('/user/:userId', async (req, res) => {
    try {
        const result = await addressService.getAddressByUserId(req.params.userId)
        res.status(200).json({ data: result })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Add address by user id
router.post('/user/:userId', async (req, res) => {
    try {
        const addressId = await addressService.insertAddress(req.body)
        await addressService.insertPersonalAddress(req.params.userId, addressId, req.body.isDeliveryAddress)
        
        res.status(200).json({ data: "This address is added successfully." })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

module.exports = router
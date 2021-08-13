const express = require('express')
const router = express.Router()
const passport = require('passport')
const upload = require('../config/multer')

const userService = require('../services/user_service')
const addressService = require('../services/address_service')
const drugAllergyService = require('../services/drug_allergy_service')
const congenitalDiseaseService = require('../services/congenital_service')

// Get User by ID
router.get('/:userId', async (req, res) => {
    try {
        const userId = req.params.userId

        const user = await userService.getUserById(userId)
        const address = await addressService.getAddressByUserId(userId)
        const drugAllergy = await drugAllergyService.getDrugAlleryByUserId(userId)
        const congenitalDisease = await congenitalDiseaseService.getCongenitalDisByUserId(userId)
        
        const result = {
          user,
          address,
          drugAllergy,
          congenitalDisease
        }

        res.status(200).json({ data: result })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Update User General Information by ID
router.put('/:userId', async (req, res) => {
  try {
      const userId = req.params.userId

      await userService.updatePerson(req.body, userId)
      const result = await userService.getUserById(userId)
      
      res.status(200).json({ data: result })
  } catch (error) {
      res.status(500).json({ error: error.message })
  }
})

// Update profile image
router.patch('/:userId/image', upload.single('image'), async (req, res) => {
    const filePath = `public/uploads/profile_image/${req.file.filename}`

    try {
      const result = await userService.updateProfileImage(req.params.userId, filePath)
      res.status(200).json({ data: result })
    } catch(err) {
      res.status(500).json({ error: error.message })
    }
})

// Get profile image
router.get('/:userId/image', passport.authenticate('jwt', {session: false}), async (req, res) => {
    try {
      const result = await userService.getProfileImage(req.params.userId)
      res.status(200).json({ data: result })
    } catch(err) {
      res.status(500).json({ error: error.message })
    }
})


module.exports = router
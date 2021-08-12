const express = require('express')
const router = express.Router()
const upload = require('../config/multer')
const userService = require('../services/user_service')

// Get User by ID
router.get('/:userId', async (req, res) => {
    try {
        const result = await userService.getUserById(req.params.userId)
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
router.get('/:userId/image', async (req, res) => {
    try {
      const result = await userService.getProfileImage(req.params.userId)
      res.status(200).json({ data: result })
    } catch(err) {
      res.status(500).json({ error: error.message })
    }
})

module.exports = router
const express = require('express')
const router = express.Router()
const userService = require('../services/user_service')
const upload = require('../config/multer')

router.get('/:userId', (req, res) => {
    userService.getUserById(req.params.userId, res)
})

router.patch('/profile-image/:userId', upload.single('profileImage'), async (req, res) => {
   userService.updateProfileImage(req, res)
})

module.exports = router
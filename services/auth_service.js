const tokenService = require('./token_service')
const userService = require('./user_service')
const drugAllergyService = require('./drug_allergy_service')
const congenitalDiseaseService = require('./congenital_service')

var { apiInstance, sendSmtpEmail } = require('../util/send_email')
const crypto = require("crypto");
const bcrypt = require('bcryptjs')

export const signup = async (req) => {
    let { title, firstname, lastname, dob, gender, phone, height, weight, email, password, drugAllergy, congenitalDisease } = req.body

    // Insert Person into table
    const userId = await userService.insertPerson({
        title, firstname, lastname, dob, gender, phone, height, weight, email, password,
    })

    // Insert Drug Allerfy into table if any
    if(drugAllergy) {
        drugAllergy.forEach(async (dal) => {
            await drugAllergyService.insertDrugAllergy(dal, userId)
        })
    }

    // Insert Congenital Disease into table if any
    if(congenitalDisease) {
        congenitalDisease.forEach(async (congenital) => {
            await congenitalDiseaseService.insertCongenitalDisease(congenital, userId)
        })
    }

    // Get user that has just inserted and return the query result 
    const result = await userService.getUserById(userId)

    return result
}

export const requestPasswordReset = async (email) => {
    // Find email to check if it exists
    const user = await userService.getUserByEmail(email)
    if (!user) throw new Error("Email does not exist.")

    // Find token of this user. If found, delete it
    const token = await tokenService.getTokenByUserId(user.ID)
    if (token) await tokenService.deleteTokenByUserId(user.ID)

    // Generate token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = await bcrypt.hash(resetToken, 10);
  
    // Insert token into database
    await tokenService.insertTokenByUserId(hashedToken, user.ID)
  
    // Send email
    const link = `haiya-reset-password.netlify.app/?token=${resetToken}&id=${user.ID}`

    sendSmtpEmail = {
        to: [{
            'email': user.Psn_Email,
            'name': `${user.Psn_Fname} ${user.Psn_Lname}`
        }],
        templateId: 1,
        params: {
            'NAME': `${user.Psn_Fname} ${user.Psn_Lname}`,
            'LINK': link
        },
        headers: {
            'api-key': process.env.SENDINBLUE_API_KEY,
            'content-type': 'application/json',
            'accept': 'application/json'
        }
    }
    
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail)
    if(data.messageId) {
        return data.messageId
    }

    return null
}

export const resetPassword = async (userId, token, password) => {
    // Delete any expired token
    await tokenService.deleteExpiredToken()

    // Find token of this user
    let passwordResetToken = await tokenService.getTokenByUserId(userId)
    if (!passwordResetToken) {
      throw new Error("Invalid or expired password reset token.");
    }
  
    // Compare received token and token stored in database
    const isValid = await bcrypt.compare(token, passwordResetToken.Token);
    if (!isValid) {
      throw new Error("Invalid or expired password reset token.");
    }
  
    // Update user password
    await userService.updatePasswordWithoutCompareOldPwd(userId, password)
  
    // Get user info to send email
    const user = await userService.getUserById(userId)
  
    // Send email
    sendSmtpEmail = {
        to: [{
            'email': user.Psn_Email,
            'name': `${user.Psn_Fname} ${user.Psn_Lname}`
        }],
        templateId: 2,
        params: {
            'NAME': `${user.Psn_Fname} ${user.Psn_Lname}`,
        },
        headers: {
            'api-key': process.env.SENDINBLUE_API_KEY,
            'content-type': 'application/json',
            'accept': 'application/json'
        }
    }
    
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail)
    if(data.messageId) {
        return data.messageId
    }

    return null
}
  
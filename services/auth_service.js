const bcrypt = require('bcryptjs');
const userService = require('./user_service')
const addressService = require('./address_service')
const drugAllergyService = require('./drug_allergy_service')
const congenitalDiseaseService = require('./congenital_service')
const personalAddrService = require('./personal_addr_service')

const comparePassword = (password, hashedPassword) => {
    return bcrypt.compareSync(password, hashedPassword)
}

export const signup = async (req) => {
    let { title, firstname, lastname, dob, gender, phone, height, weight, email, password, address, drugAllergy, congenitalDisease } = req.body

    const userId = await userService.insertPerson({
        title, firstname, lastname, dob, gender, phone, height, weight, email, password,
    })

    let addressId
    address.forEach(async (addr) => {
        addressId = await addressService.insertAddress(addr)
        await personalAddrService.insertPersonalAddress(userId, addressId)
    });

    if(drugAllergy) {
        drugAllergy.forEach(async (dal) => {
            await drugAllergyService.insertDrugAllergy(dal, userId)
        })
    }

    if(congenitalDisease) {
        congenitalDisease.forEach(async (congenital) => {
            await congenitalDiseaseService.insertCongenitalDisease(congenital, userId)
        })
    }

    const result = await userService.getUserById(userId)

    return result
}


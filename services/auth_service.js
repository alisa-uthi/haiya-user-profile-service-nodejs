const userService = require('./user_service')
const drugAllergyService = require('./drug_allergy_service')
const congenitalDiseaseService = require('./congenital_service')

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


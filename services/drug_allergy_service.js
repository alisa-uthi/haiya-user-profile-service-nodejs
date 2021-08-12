const connection = require('../config/database')

export const insertDrugAllergy = async (drugAllergy, userId) => {
    const query = 'INSERT INTO Drug_Allergy (Dal_Name, Dal_Reaction, Dal_severity, Dal_Psn_ID) VALUES (?, ?, ?, ?);'

    try {
        const result = await connection.promise().execute(
            query,
            [ drugAllergy.name, drugAllergy.reaction, drugAllergy.severity, userId ],
        );

        return result[0].insertId
    } catch (err) {
        throw new Error(`Insert Drug Allergy: ${err.message}`)
    }
}
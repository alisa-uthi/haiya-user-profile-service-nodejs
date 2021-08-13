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

export const getDrugAlleryByUserId = async (id) => {
    let query = 'SELECT ID, Dal_Name, Dal_Reaction, Dal_Severity FROM Drug_Allergy WHERE Dal_Psn_ID = ? ;'
    
    try {
        const result = await connection.promise().execute(
            query,
            [id],
        );
        return result[0]
    } catch (err) {
        throw new Error(`Get Drug Allergy By User ID: ${err.message}`)
    }
}

export const getDrugAlleryById = async (allergyId) => {
    let query = 'SELECT ID, Dal_Name, Dal_Reaction, Dal_Severity FROM Drug_Allergy WHERE ID = ? ;'
    
    try {
        const result = await connection.promise().execute(
            query,
            [allergyId],
        );
        return result[0][0]
    } catch (err) {
        throw new Error(`Get Drug Allergy By ID: ${err.message}`)
    }
}

export const updatetDrugAllery = async (drugAllergy, allergyId) => {
    let query = 'UPDATE Drug_Allergy SET '
    query += 'Dal_Name = ?, Dal_Reaction = ?, Dal_Severity = ? WHERE ID = ? ;'
    
    try {
        await connection.promise().execute(
            query,
            [ drugAllergy.name, drugAllergy.reaction, drugAllergy.severity, allergyId ],
        );
    } catch (err) {
        throw new Error(`Update Drug Allergy By ID: ${err.message}`)
    }
}
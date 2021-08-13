const connection = require('../config/database')

export const insertCongenitalDisease = async (congenital, userId) => {
    const query = 'INSERT INTO Congenital_Disease (Cdi_Name, Cdi_Reaction, Cdi_severity, Cdi_Psn_ID) VALUES (?, ?, ?, ?)'

    try {
        const result = await connection.promise().execute(
            query,
            [ congenital.name, congenital.reaction, congenital.severity, userId ],
        );
        return result[0].insertId
    } catch (err) {
        throw new Error(`Insert Congenital Disease: ${err.message}`)
    }
}

export const getCongenitalDisByUserId = async (id) => {
    let query = 'SELECT ID, Cdi_Name, Cdi_Reaction, Cdi_Severity FROM Congenital_Disease WHERE Cdi_Psn_ID = ? ;'
    
    try {
        const result = await connection.promise().execute(
            query,
            [id],
        );
        return result[0]
    } catch (err) {
        throw new Error(`Get Congenital Disease By User ID: ${err.message}`)
    }
}

export const getCongenitalDiseaseById = async (congenitalId) => {
    let query = 'SELECT ID, Cdi_Name, Cdi_Reaction, Cdi_Severity FROM Congenital_Disease WHERE ID = ? ;'
    
    try {
        const result = await connection.promise().execute(
            query,
            [congenitalId],
        );
        return result[0][0]
    } catch (err) {
        throw new Error(`Get Congenital Disease By ID: ${err.message}`)
    }
}

export const updatetCongenitalDisease = async (congenital, congenitalId) => {
    let query = 'UPDATE Congenital_Disease SET '
    query += 'Cdi_Name = ?, Cdi_Reaction = ?, Cdi_Severity = ? WHERE ID = ? ;'
    
    try {
        await connection.promise().execute(
            query,
            [ congenital.name, congenital.reaction, congenital.severity, congenitalId ],
        );
    } catch (err) {
        throw new Error(`Update Congenital Disease By ID: ${err.message}`)
    }
}
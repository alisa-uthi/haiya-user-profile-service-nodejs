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
        throw new Error(`Get Profile Image: ${err.message}`)
    }
}
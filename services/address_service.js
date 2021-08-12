const connection = require('../config/database')

export const insertAddress = async (address) => {
    const query = 'INSERT INTO Address (Addr_Name, Addr_Location, Addr_AdditionalInfo, Addr_Latitude, Addr_Longitude) VALUES (?, ?, ?, ?, ?);'

    try {
        const result = await connection.promise().execute(
            query,
            [ address.name, address.address, address.additionalNote, address.latitude, address.longitude ],
        );

        return result[0].insertId
    } catch (err) {
        throw new Error(`Insert Address: ${err.message}`)
    }
}

export const getAddressByUserId = async (id) => {
    let query = 'SELECT a.ID, a.Addr_Name, a.Addr_Location, a.Addr_AdditionalInfo, a.Addr_Latitude, a.Addr_Longitude '
    query += 'FROM Address a '
    query += 'INNER JOIN Personal_Addr pa ON pa.Psn_ID = ? '
    query += `WHERE pa.FlagDelete = 'N';`
    
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
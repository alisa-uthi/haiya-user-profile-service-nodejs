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

export const getAddressById = async (id) => {
    let query = 'SELECT ID, Addr_Name, Addr_Location, Addr_AdditionalInfo, Addr_Latitude, Addr_Longitude '
    query += 'FROM Address WHERE ID = ? ;'
    
    try {
        const result = await connection.promise().execute(
            query,
            [id],
        );
        return result[0][0]
    } catch (err) {
        throw new Error(`Get Address By Id: ${err.message}`)
    }
}

export const getAddressByUserId = async (id) => {
    let query = 'SELECT a.ID, a.Addr_Name, a.Addr_Location, a.Addr_AdditionalInfo, a.Addr_Latitude, a.Addr_Longitude '
    query += 'FROM Address a '
    query += 'INNER JOIN Personal_Addr pa ON pa.Addr_ID = a.ID '
    query += `WHERE pa.Psn_ID = ? AND pa.FlagDelete = 'N';`
    
    try {
        const result = await connection.promise().execute(
            query,
            [id],
        );
        return result[0]
    } catch (err) {
        throw new Error(`Get Address By User Id: ${err.message}`)
    }
}

export const updateAddressById = async (address, addressId) => {
    let query = 'UPDATE Address SET '
    query += 'Addr_Name = ? , Addr_Location = ? , Addr_AdditionalInfo = ? , Addr_Latitude = ? , Addr_Longitude = ? '
    query += 'WHERE ID = ? ;'
    
    try {
        await connection.promise().execute(
            query,
            [ address.name, address.address, address.additionalNote, address.latitude, address.longitude, addressId ],
        );
    } catch (err) {
        throw new Error(`Update Address By Id: ${err.message}`)
    }
}

export const updateFlagDelete = async (addressId) => {
    let query = `UPDATE Personal_Addr SET FlagDelete = 'Y'`
    query += 'WHERE Addr_ID = ? ;'
    
    try {
        await connection.promise().execute(
            query,
            [ addressId ],
        );
    } catch (err) {
        throw new Error(`Update Flag Delete of the Address By Address Id: ${err.message}`)
    }
}
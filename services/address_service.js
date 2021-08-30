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
    let query = 'SELECT a.ID, a.Addr_Name, a.Addr_Location, a.Addr_AdditionalInfo, '
    query += 'a.Addr_Latitude, a.Addr_Longitude, pa.Psn_ID, pa.IsDeliveryAddress '
    query += 'FROM Address a '
    query += 'LEFT JOIN Personal_Addr pa ON pa.Addr_ID = a.ID '
    query += 'WHERE ID = ?;'
    
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
    let query = 'SELECT a.ID, a.Addr_Name, a.Addr_Location, a.Addr_AdditionalInfo, '
    query += 'a.Addr_Latitude, a.Addr_Longitude, pa.Psn_ID, pa.IsDeliveryAddress '
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

export const insertPersonalAddress = async (userId, addressId, isDeliveryAddress) => {
    const query = 'INSERT INTO Personal_Addr (Psn_ID, Addr_ID, IsDeliveryAddress) VALUES (?, ?, ?);'

    try {
        const result = await connection.promise().execute(
            query,
            [ userId, addressId, isDeliveryAddress ],
        );

        return result[0].insertId
    } catch (err) {
        throw new Error(`Insert Personal Address: ${err.message}`)
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

export const updateDeliveryAddress = async (userId, addressId, isDeliveryAddress) => {
    let query1 = 'UPDATE Personal_Addr SET IsDeliveryAddress = "N" '
    query1 += 'WHERE Psn_ID = ? ;'
    
    let query2 = 'UPDATE Personal_Addr SET IsDeliveryAddress = ? '
    query2 += 'WHERE Addr_ID = ? ;'
    
    try {
        await connection.promise().execute(
            query1,
            [ userId ],
        );
        await connection.promise().execute(
            query2,
            [ isDeliveryAddress, addressId ],
        );
    } catch (err) {
        throw new Error(`Update Delivery Address Status of the Address By Address Id: ${err.message}`)
    }
}
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

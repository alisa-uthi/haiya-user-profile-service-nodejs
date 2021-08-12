const connection = require('../config/database')

export const insertPersonalAddress = async (userId, addressId) => {
    const query = 'INSERT INTO Personal_Addr (Psn_ID, Addr_ID) VALUES (?, ?);'

    try {
        const result = await connection.promise().execute(
            query,
            [ userId, addressId ],
        );

        return result[0].insertId
    } catch (err) {
        throw new Error(`Insert Personal Address: ${err.message}`)
    }
}
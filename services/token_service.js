const connection = require('../config/database')

export const insertTokenByUserId = async (token, userId) => {
    let query = 'INSERT INTO Token (Token, Expire, Token_Psn_ID) VALUES '
    query += '(?, NOW() + INTERVAL 1 HOUR, ?)'
    
    try {
        await connection.promise().execute(
            query,
            [token, userId],
        );
    } catch (err) {
        throw new Error(`Insert Token By User Id: ${err.message}`)
    }
}

export const getTokenByUserId = async (userId) => {
    let query = 'SELECT ID, Token FROM Token WHERE Token_Psn_ID = ? ;'
    
    try {
        const result = await connection.promise().execute(
            query,
            [userId],
        );
        return result[0][0]
    } catch (err) {
        throw new Error(`Get Token By User Id: ${err.message}`)
    }
}

export const deleteTokenByUserId = async (userId) => {
    let query = 'DELETE FROM Token WHERE Token_Psn_ID = ? ;'
    
    try {
        await connection.promise().execute(
            query,
            [userId],
        );
    } catch (err) {
        throw new Error(`Delete Token By User Id: ${err.message}`)
    }
}

export const deleteExpiredToken = async () => {
    let query = 'DELETE FROM Token WHERE Expire < NOW();'
    
    try {
        await connection.promise().execute(query);
    } catch (err) {
        throw new Error(`Delete Expired Token: ${err.message}`)
    }
}
const bcrypt = require('bcryptjs');
const connection = require('../config/database')

const hashPassword = (password) => {
    const saltRounds = 10;
    return bcrypt.hashSync(password, saltRounds)
}

export const insertPerson = async (data) => {
    const query = 'INSERT INTO Person (Psn_Title, Psn_Fname, Psn_Lname, Psn_DoB, Psn_Gender, Psn_Height, Psn_Weight, Psn_Email, Psn_Password, Psn_Phone) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?);'
    
    try {
        const hashedPassword = hashPassword(data.password)
  
        const result = await connection.promise().execute(
            query,
            [
                data.title, data.firstname, data.lastname, data.dob, data.gender, 
                data.height, data.weight, data.email, hashedPassword, data.phone,
            ],
        );
    
        return result[0].insertId
    } catch (err) {
        throw new Error(`Insert Person: ${err.message}`)
    }
}

export const getUserById = async (id) => {
    let query = 'SELECT ID, Psn_Title, Psn_Fname, Psn_Lname, Psn_DoB, Psn_Gender, Psn_Height, Psn_Weight, Psn_Email, Psn_Phone, Psn_Image '
    query += 'FROM Person WHERE ID = ?'
    
    try {
        const result = await connection.promise().execute(
            query,
            [id],
        );
    
        return result[0][0]
    } catch (err) {
        throw new Error(`Get User by id: ${err.message}`)
    }
}

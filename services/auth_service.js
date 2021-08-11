const { Request, TYPES } = require('tedious')
const { connection } = require('../config/database')
const bcrypt = require('bcrypt');

const tableName = "[dbo].[Person]"

const hashPassword = (password) => {
    const saltRounds = 10;
    return bcrypt.hashSync(password, saltRounds)
}

const comparePassword = (password, hashedPassword) => {
    return bcrypt.compareSync(password, hashedPassword)
}

exports.signup = async (req, res) => {
    let result = []
    console.log(req.body)

    const query = `INSERT INTO ${tableName} VALUES 
    (null, @title, @firstname, @lastname, @dob, @gender, @height, @weight, @email, @password, @phone, null);
    SELECT * FROM ${tableName} WHERE ID = @@identity;
    `
    const request = new Request(
        query,
        (err) => {
            if (err) return res.status(500).json({ error: err.message })
        }
    );
    const hashedPassword = await hashPassword(req.body.password)

    request.addParameter('title', TYPES.NVarChar, req.body.title);
    request.addParameter('firstname', TYPES.NVarChar, req.body.firstName);
    request.addParameter('lastname', TYPES.NVarChar, req.body.lastName);
    request.addParameter('dob', TYPES.Date, req.body.dob);
    request.addParameter('gender', TYPES.NVarChar, req.body.gender);
    request.addParameter('height', TYPES.Int, req.body.height);
    request.addParameter('weight', TYPES.Int, req.body.weight);
    request.addParameter('email', TYPES.NVarChar, req.body.email);
    request.addParameter('password', TYPES.NVarChar, hashedPassword);
    request.addParameter('phone', TYPES.NVarChar, req.body.phone);

    request.on('row', function (columns) {
        let jsonObj = {}
        columns.map(obj => {
            jsonObj[obj.metadata.colName] = obj.value
        })
        result.push(jsonObj)
    });

    request.on("doneProc", () => {
        return res.status(201).json(result[0])
    })

    connection.execSql(request);
}


const { Connection } = require("tedious");

// Create connection to database
const config = {
  authentication: {
    options: {
      userName: process.env.DB_USER, 
      password: process.env.DB_PASSWORD 
    },
    type: "default"
  },
  server: process.env.DB_SERVER_NAME, 
  options: {
    database: process.env.DB_NAME, 
    encrypt: true,
    rowCollectionOnDone: true
  }
};

const connection = new Connection(config);

// Attempt to connect and execute queries if connection goes through
connection.on("connect", err => {
  if (err) {
    console.error(err.message);
  } else {
    console.log("Database is running...")
  }
});

module.exports = {
  dbConnecttion: connection.connect(),
  connection: connection
};


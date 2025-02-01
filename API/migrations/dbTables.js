let mysql = require("mysql");
const { dbConfig } = require("../config.json");

async function dbTables() {
    let con = mysql.createConnection({
        host: dbConfig.host,
        user: dbConfig.user,
        password: dbConfig.password,
        database: dbConfig.database,
    });

    con.connect(function (err) {
        if (err) throw err;
        console.log("Connected to MySQL!");

        const createTable = `
            CREATE TABLE IF NOT EXISTS links (
                id INT AUTO_INCREMENT PRIMARY KEY,
                titres VARCHAR(255) NOT NULL,
                url TEXT NOT NULL,
                description TEXT
            )
        `;

        con.query(createTable, (err, results) => {
            if (err) throw err;
            console.log("Table 'links' created or already exists.");
        });

        con.end();
    });
}

module.exports = dbTables;

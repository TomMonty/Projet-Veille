let mysql = require("mysql");
const { dbConfig } = require("../config.json");

let con = mysql.createConnection({
    host: dbConfig.host,
    user: dbConfig.user,
    password: dbConfig.password,
    database: dbConfig.database,
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected to MySQL!");
    const sql =
        "CREATE TABLE IF NOT EXISTS veille (id INT AUTO_INCREMENT PRIMARY KEY, amandes VARCHAR(255), quantity INT)";

    con.query(sql, (err, results) => {
        if (err) throw err;
        console.log('Table Veille created!');
    });
});

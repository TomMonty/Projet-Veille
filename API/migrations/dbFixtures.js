let mysql = require("mysql");
const { dbConfig } = require("../config.json");

async function dbFixtures() {
    let con = mysql.createConnection({
        host: dbConfig.host,
        user: dbConfig.user,
        password: dbConfig.password,
        database: dbConfig.database,
    });

    con.connect(function (err) {
        if (err) throw err;
        console.log("Connected to MySQL!");

        const insertData = `
            INSERT INTO links (titres, url, description) VALUES 
            ('Développement Web', 'https://developer.mozilla.org', 'Ressources pour développeurs web'),
            ('Veille Technologique', 'https://techcrunch.com', 'Actualités technologiques'),
            ('Actualités Générales', 'https://www.bbc.com', 'Actualités internationales')
        `;

        con.query(insertData, (err, results) => {
            if (err) throw err;
            console.log("Links inserted or already exist.");
        });

        con.end();
    });
}

module.exports = dbFixtures;

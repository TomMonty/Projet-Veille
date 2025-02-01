const dbCreate = require('./dbCreate');
const dbTables = require('./dbTables');
const dbFixtures = require('./dbFixtures');

async function runMigrations() {
    try {
        // Crée la base de données
        await dbCreate();

        // Crée les tables
        await dbTables();

        // Insère les données par défaut
        await dbFixtures();

        console.log("Migrations exécutées avec succès !");
    } catch (error) {
        console.error("Erreur lors de l'exécution des migrations :", error);
    }
}

runMigrations();

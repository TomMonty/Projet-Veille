const { REST, Routes } = require("discord.js");
const { token, clientId, guildId } = require("./config.json");

const rest = new REST({ version: "10" }).setToken(token);

(async () => {
    try {
        // Supprime les commandes globales
        console.log("Fetching global commands...");
        const globalCommands = await rest.get(Routes.applicationCommands(clientId));
        console.log(`Found ${globalCommands.length} global commands.`);

        if (globalCommands.length > 0) {
            for (const command of globalCommands) {
                console.log(`Deleting global command: ${command.name} (${command.id})`);
                await rest.delete(Routes.applicationCommand(clientId, command.id));
            }
        }

        // Supprime les commandes spécifiques à une guilde
        console.log("Fetching guild commands...");
        const guildCommands = await rest.get(Routes.applicationGuildCommands(clientId, guildId));
        console.log(`Found ${guildCommands.length} guild commands.`);

        if (guildCommands.length > 0) {
            for (const command of guildCommands) {
                console.log(`Deleting guild command: ${command.name} (${command.id})`);
                await rest.delete(Routes.applicationGuildCommand(clientId, guildId, command.id));
            }
        }

        console.log("Successfully deleted all commands.");
    } catch (error) {
        console.error(error);
    }
})();

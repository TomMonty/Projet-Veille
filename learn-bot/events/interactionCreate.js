const { Events } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        try {
            // ✅ Handle Slash Commands
            if (interaction.isChatInputCommand()) {
                const command = interaction.client.commands.get(interaction.commandName);

                if (!command) {
                    console.error(`No command matching ${interaction.commandName} was found.`);
                    return;
                }

                await command.execute(interaction);
            }

            // ✅ Handle Dropdown Menu (Selecting a Title)
            else if (interaction.isStringSelectMenu() && interaction.customId === 'select_veille_title') {
                // ✅ Acknowledge the interaction immediately to prevent Discord timeout
                await interaction.deferUpdate();

                const selectedTitle = interaction.values[0];

                // Fetch the links asynchronously (background task)
                fetch(`http://localhost:3000/veille?title=${encodeURIComponent(selectedTitle)}`)
                    .then(response => response.json())
                    .then(async (links) => {
                        if (!links.length) {
                            return interaction.user.send(`🚫 No links found for **${selectedTitle}**.`);
                        }

                        // Format the message with links
                        let messageContent = `📌 **Links for "${selectedTitle}"**:\n\n`;
                        links.forEach(link => {
                            messageContent += `🔗 [${link.description}](${link.url})\n`;
                        });

                        // ✅ Send private message with the fetched links
                        await interaction.user.send(messageContent);

                        // ✅ Confirm to the user in Discord
                        await interaction.followUp({
                            content: `📩 Links for **${selectedTitle}** have been sent to your **DM**.`,
                            ephemeral: true,
                        });
                    })
                    .catch(async (error) => {
                        console.error("❌ Error fetching links:", error);
                        await interaction.user.send("❌ Error retrieving links.");
                    });
            }
        } catch (error) {
            console.error("❌ Error in interactionCreate.js:", error);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: "❌ An error occurred.", ephemeral: true });
            } else {
                await interaction.reply({ content: "❌ An error occurred.", ephemeral: true });
            }
        }
    },
};

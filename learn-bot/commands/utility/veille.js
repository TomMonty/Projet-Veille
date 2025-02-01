const { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('veille')
        .setDescription('Retrieve saved links by selecting a topic.'),
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        try {
            // Fetch available titles from the API
            const response = await fetch("http://localhost:3000/veille/titles");
            const titles = await response.json();

            if (!titles.length) {
                return interaction.editReply({ content: "🚫 No saved titles found.", ephemeral: true });
            }

            // Create a dropdown menu
            const options = titles.map((title) => ({
                label: title,
                value: title,
            }));

            const row = new ActionRowBuilder().addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('select_veille_title')
                    .setPlaceholder('Choose a title')
                    .addOptions(options)
            );

            // Send ephemeral response with dropdown
            await interaction.editReply({
                content: "📌 **Choose a title to see its saved links:**",
                components: [row],
                ephemeral: true,
            });

        } catch (error) {
            console.error("❌ Error fetching titles:", error);
            await interaction.editReply({
                content: "❌ Failed to retrieve titles.",
                ephemeral: true,
            });
        }
    },
};

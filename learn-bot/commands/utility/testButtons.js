const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('testbutton')
        .setDescription('Sends a DM with a delete button.'),
    async execute(interaction) {
        try {
            // Create the "Delete This Message" button
            const deleteButton = new ButtonBuilder()
                .setCustomId('delete_message') // Ensure this ID is unique and handled correctly
                .setLabel('Delete this message')
                .setStyle(ButtonStyle.Danger);

            const row = new ActionRowBuilder().addComponents(deleteButton);

            // Send a DM with the button
            const dmMessage = await interaction.user.send({
                content: 'Here is a test DM with a button.',
                components: [row],
            });

            // Respond to the slash command publicly (ephemeral)
            await interaction.reply({
                content: 'I sent you a DM! Check your inbox. 📩',
                ephemeral: true,
            });

        } catch (error) {
            console.error('Error sending DM with button:', error);
            await interaction.reply({
                content: '❌ I could not send you a DM. Please check your DM settings.',
                ephemeral: true,
            });
        }
    },
};

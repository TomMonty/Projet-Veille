const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('talkprivately')
        .setDescription('Send a private message to the user who called this command.'),
    async execute(interaction) {
        try {
            // Create the button
            const deleteButton = new ButtonBuilder()
                .setCustomId('delete_message')
                .setLabel('Delete this message')
                .setStyle(ButtonStyle.Danger);

            // Create the row that holds the button
            const row = new ActionRowBuilder().addComponents(deleteButton);

            // Send the private message with the button
            const dmMessage = await interaction.user.send({
                content: 'Hello! This is a private message just for you. If you want to delete it, click the button below.',
                components: [row],
            });

            // Respond to the slash command publicly (ephemeral)
            await interaction.reply({
                content: 'I sent you a private message! Check your DMs. 📩',
                ephemeral: true,
            });

            // Create a collector to listen for button interactions
            const collector = dmMessage.createMessageComponentCollector({ time: 60000 }); // Collector active for 1 minute

            collector.on('collect', async (buttonInteraction) => {
                if (buttonInteraction.customId === 'delete_message') {
                    // Delete the message and reply to the button interaction
                    await dmMessage.delete();
                    await buttonInteraction.reply({
                        content: 'Message deleted successfully!',
                        ephemeral: true,
                    });

                    // Stop the collector after the button is pressed
                    collector.stop();
                }
            });

            collector.on('end', (collected, reason) => {
                if (reason === 'time') {
                    // Disable the button if the collector times out
                    const disabledRow = new ActionRowBuilder().addComponents(
                        deleteButton.setDisabled(true)
                    );
                    dmMessage.edit({ components: [disabledRow] }).catch(console.error);
                }
            });
        } catch (error) {
            console.error('Error sending private message:', error);

            // Respond if an error occurs (e.g., DMs are disabled)
            await interaction.reply({
                content: 'I could not send you a private message. Please check your DM settings!',
                ephemeral: true,
            });
        }
    },
};

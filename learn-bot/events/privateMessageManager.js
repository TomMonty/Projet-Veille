const { Events, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        // Only process messages sent by the bot in DMs
        if (message.channel.type === 'DM' && message.author.bot) {
            console.log(`Bot sent a DM: ${message.content}`); // Debugging log

            try {
                // Create a "Delete This Message" button
                const deleteButton = new ButtonBuilder()
                    .setCustomId('delete_message')
                    .setLabel('Delete this message')
                    .setStyle(ButtonStyle.Danger);

                const row = new ActionRowBuilder().addComponents(deleteButton);

                // Send a new message in the DM with the button
                const buttonMessage = await message.channel.send({
                    content: '🔴 **Click the button below to delete the previous message.**',
                    components: [row],
                });

                // Set up a collector for the button
                const collector = buttonMessage.createMessageComponentCollector({
                    componentType: 'BUTTON',
                    time: 24 * 60 * 60 * 1000, // 24 hours
                });

                collector.on('collect', async (interaction) => {
                    if (interaction.customId === 'delete_message') {
                        try {
                            // Delete both messages
                            await message.delete(); // Delete the original DM
                            await buttonMessage.delete(); // Delete the button message
                            await interaction.reply({ content: '✅ Message deleted successfully!', ephemeral: true });
                        } catch (error) {
                            console.error('Error deleting messages:', error);
                            await interaction.reply({ content: '❌ Could not delete the message.', ephemeral: true });
                        }
                        collector.stop();
                    }
                });

                collector.on('end', async (collected, reason) => {
                    if (reason === 'time') {
                        console.log('Button collector expired. Disabling the button.'); // Debugging log
                        const disabledRow = new ActionRowBuilder().addComponents(
                            deleteButton.setDisabled(true)
                        );
                        await buttonMessage.edit({ components: [disabledRow] }).catch(console.error);
                    }
                });
            } catch (error) {
                console.error('Error sending delete button message:', error);
            }
        }
    },
};

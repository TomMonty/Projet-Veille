const { Events, ChannelType } = require("discord.js");

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        const triggerCommand = "!getAllChannels";

        // Liste des IDs des canaux à exclure
        const excludedChannelIds = [
            "1326864586053390371",
            "1326864586053390367",
            "1326864586053390375",
        ];

        if (message.content !== triggerCommand) return;
        if (message.author.bot) return;

        // Récupère tous les canaux du serveur, en excluant ceux spécifiés
        const allChannels = message.guild.channels.cache.filter(
            (channel) => !excludedChannelIds.includes(channel.id)
        );

        if (allChannels.size === 0) {
            return message.reply("Aucun canal trouvé sur ce serveur.");
        }

        // Organise les canaux par catégorie
        const categories = allChannels
            .filter((channel) => channel.type === ChannelType.GuildCategory)
            .map((category) => ({
                name: category.name,
                id: category.id,
                channels: allChannels
                    .filter((channel) => channel.parentId === category.id)
                    .map((childChannel) => `#${childChannel.name} - ID: ${childChannel.id}`),
            }));

        // Ajoute les canaux hors catégorie (sans parentId)
        const uncategorizedChannels = allChannels
            .filter((channel) => !channel.parentId && channel.type === ChannelType.GuildText)
            .map((channel) => `#${channel.name} - ID: ${channel.id}`);

        // Crée une réponse organisée
        let response = "**Liste des canaux par catégorie :**\n\n";
        categories.forEach((category) => {
            response += `**${category.name}** (ID: ${category.id})\n`;
            response += category.channels.length
                ? category.channels.join("\n")
                : "Aucun canal dans cette catégorie.\n";
            response += "\n";
        });

        if (uncategorizedChannels.length > 0) {
            response += "**Canaux hors catégorie :**\n";
            response += uncategorizedChannels.join("\n");
        }

        // Envoie la liste des canaux
        await message.reply(response.length > 2000
            ? "La liste est trop longue pour être affichée ici."
            : response
        );
    },
};

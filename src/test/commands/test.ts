import { InteractionHandler } from "../../class/InteractionHandler";
import SlashCommand from "../../class/SlashCommand";
import { ApplicationCommandType, ButtonBuilder, EmbedBuilder } from "discord.js";
import { InteractionType } from "../../class/InteractionHandler"
import createRow from "../../components/createRow";

new SlashCommand({
    name: "ping",
    description: "Mostra um menu interativo",
    type: ApplicationCommandType.ChatInput,
    run: async (client, interaction) => {
        await client.invokeInteraction("button/home", interaction);
    }
});

new InteractionHandler({
    customId: "button/home",
    type: InteractionType.Button,
    run: async (_client, interaction) => {
        const row = createRow([
            new ButtonBuilder()
                .setCustomId("button/home-1")
                .setLabel("Home 1")
                .setStyle(1)
                .setEmoji("1️⃣"),
            new ButtonBuilder()
                .setCustomId("button/home-2")
                .setLabel("Home 2")
                .setStyle(1)
                .setEmoji("2️⃣")
        ]);

        const embed = new EmbedBuilder()
            .setTitle("🎮 Menu Interativo")
            .setDescription("Escolha uma das opções abaixo:")
            .setColor("#2f3136")
            .setTimestamp();

        await interaction.reply({
            embeds: [embed],
            components: [row],
            ephemeral: true
        });
    }
});

new InteractionHandler({
    customId: "button/:homes",
    type: InteractionType.Button,
    run: async (_client, interaction, { homes }) => {  
        const embed = new EmbedBuilder()
            .setColor("#2f3136")
            .setTimestamp();

        const row = createRow([
            new ButtonBuilder()
                .setCustomId("button/home-1")
                .setLabel("Home 1")
                .setStyle(homes === "home-1" ? 3 : 1)
                .setEmoji("1️⃣"),
            new ButtonBuilder()
                .setCustomId("button/home-2")
                .setLabel("Home 2")
                .setStyle(homes === "home-2" ? 3 : 1)
                .setEmoji("2️⃣")
        ]);

        switch (homes) {
            case "home-1":
                embed.setTitle("🏠 Home 1")
                    .setDescription("Você está na primeira página");
                break;
            case "home-2":
                embed.setTitle("🏠 Home 2")
                    .setDescription("Você está na segunda página");
                break;
            default:
                embed.setTitle("❌ Erro")
                    .setDescription("Página não encontrada");
                break;
        }

        await interaction.update({
            embeds: [embed],
            components: [row]
        });
    }
});
import { InteractionHandler, SlashCommand } from "class";
import { CreateEmbed, CreateModal, CreateRow } from "components";
import { ApplicationCommandType, ButtonBuilder, TextInputStyle } from "discord.js";
import { InteractionType } from "class/InteractionHandler";

new SlashCommand({
    name: "test",
    description: "Test command",
    type: ApplicationCommandType.ChatInput,
    run: async (_client, interaction) => {
        const components = [
            CreateRow([
                new ButtonBuilder({
                    customId: `test-button/accept`,
                    label: "Button accept",
                    style: 1
                }),
                new ButtonBuilder({
                    customId: `test-button/decline`,
                    label: "Button decline",
                    style: 4
                })
            ])
        ]
        
        await interaction.reply({content: "Test command", ephemeral: true, components});
    }
})

new InteractionHandler({
    customId: "test-button/:action",
    type: InteractionType.Button,
    run: async (_client, interaction) => {
        CreateEmbed({
            title: "Test embed",
            description: "Test embed description",
        })
        CreateModal({
            title: "Test modal",
            customId: "test-modal",
            inputs: [
                {
                    label: "Test input",
                    customId: "test-input",
                    style: TextInputStyle.Short
                }
            ]
        })
    }
})
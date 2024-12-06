"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const class_1 = require("class");
const components_1 = require("components");
const discord_js_1 = require("discord.js");
new class_1.SlashCommand({
    name: "test",
    description: "Test command",
    type: discord_js_1.ApplicationCommandType.ChatInput,
    run: (client, interaction) => __awaiter(void 0, void 0, void 0, function* () {
        const options = [
            { label: "Option 1", value: "option1" },
            { label: "Option 2", value: "option2" },
            { label: "Option 3", value: "option3" }
        ];
        const components = [
            (0, components_1.CreateRow)([
                new components_1.CreateSelect().StringSelectMenuBuilder({ customId: "test-select", placeholder: "Select a value", options, getValueInLastParam: true })
            ])
        ];
        return interaction.reply({ content: 'Hello World! 2', components, ephemeral: true });
    })
});
new class_1.InteractionHandler({
    customId: "test-select",
    run: (client, interaction, param1, param2, valueOfOption) => __awaiter(void 0, void 0, void 0, function* () {
        return interaction.reply({ content: `You selected ${param1}, ${param2} and ${valueOfOption}`, ephemeral: true });
    })
});

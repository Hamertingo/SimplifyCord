"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
class CustomModalBuilder extends discord_js_1.ModalBuilder {
    show(interaction) {
        interaction.showModal(this);
    }
}
const CreateModal = (modalData) => {
    try {
        const { title, inputs, customId } = modalData;
        if (!title || typeof title !== 'string') {
            throw new Error('Modal title is required and must be a string');
        }
        if (!customId || typeof customId !== 'string') {
            throw new Error('Modal customId is required and must be a string');
        }
        if (!Array.isArray(inputs) || inputs.length === 0) {
            throw new Error('Modal must have at least one input field');
        }
        const modal = new CustomModalBuilder()
            .setTitle(title)
            .setCustomId(customId);
        inputs.forEach((input, index) => {
            if (!input.label || typeof input.label !== 'string') {
                throw new Error(`Input #${index + 1}: Label is required and must be a string`);
            }
            if (!input.customId || typeof input.customId !== 'string') {
                throw new Error(`Input #${index + 1}: CustomId is required and must be a string`);
            }
            if (input.value && typeof input.value !== 'string') {
                throw new Error(`Input #${index + 1}: Value must be a string`);
            }
            if (input.placeholder && typeof input.placeholder !== 'string') {
                throw new Error(`Input #${index + 1}: Placeholder must be a string`);
            }
            if (input.style && !Object.values(discord_js_1.TextInputStyle).includes(input.style)) {
                throw new Error(`Input #${index + 1}: Invalid TextInputStyle provided`);
            }
            const newComponent = new discord_js_1.TextInputBuilder()
                .setCustomId(input.customId)
                .setLabel(input.label)
                .setStyle(input.style || discord_js_1.TextInputStyle.Short)
                .setRequired(input.required ?? false);
            if (input.value)
                newComponent.setValue(input.value);
            if (input.placeholder)
                newComponent.setPlaceholder(input.placeholder);
            modal.addComponents(new discord_js_1.ActionRowBuilder().addComponents(newComponent));
        });
        return modal;
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new Error(`Failed to create modal: ${errorMessage}`);
    }
};
exports.default = CreateModal;

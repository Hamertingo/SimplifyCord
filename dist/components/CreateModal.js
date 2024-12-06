"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
class CustomModalBuilder extends discord_js_1.ModalBuilder {
    show(interaction) {
        interaction.showModal(this);
    }
}
const CreateModal = (modalData) => {
    const { title, inputs, customId } = modalData;
    if (!title) {
        throw new Error('>> Modal title is required');
    }
    if (!inputs || inputs.length === 0) {
        throw new Error('>> Modal inputs are required');
    }
    if (!customId) {
        throw new Error('>> Modal customId is required');
    }
    const modal = new CustomModalBuilder()
        .setTitle(title)
        .setCustomId(customId);
    inputs.forEach(input => {
        if (!input.label || !input.customId) {
            throw new Error('>> Input label and customId are required');
        }
        const newComponent = new discord_js_1.TextInputBuilder()
            .setCustomId(input.customId)
            .setLabel(input.label)
            .setStyle(input.style || discord_js_1.TextInputStyle.Short)
            .setRequired(input.required || false);
        if (input.value)
            newComponent.setValue(input.value);
        if (input.placeholder)
            newComponent.setPlaceholder(input.placeholder);
        modal.addComponents(new discord_js_1.ActionRowBuilder().addComponents(newComponent));
    });
    return modal;
};
exports.default = CreateModal;
// const modal = CreateModal({ title: "teste", customId: "customId", inputs: [{label: "Um text Input", customId: "teste"}]})
// modal.show(interaction)

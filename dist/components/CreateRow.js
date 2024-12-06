"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
function CreateRow(components) {
    if (!components || components.length === 0) {
        throw new Error('CreateRow: Components array cannot be empty');
    }
    const flatComponents = Array.isArray(components[0]) ? components[0] : components;
    if (flatComponents.length === 0) {
        throw new Error('CreateRow: Components array cannot be empty');
    }
    if (flatComponents.length > 5) {
        throw new Error('CreateRow: ActionRow can only contain up to 5 components');
    }
    return new discord_js_1.ActionRowBuilder().addComponents(flatComponents);
}
exports.default = CreateRow;

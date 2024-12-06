"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
function CreateRow(...components) {
    if (components.length === 0 || (Array.isArray(components[0]) && components[0].length === 0)) {
        throw new Error('>> ActionRowComponent requires at least one component');
    }
    // Flatten the array if the first element is an array
    if (Array.isArray(components[0]))
        components = components[0];
    if (components.length > 5)
        throw new Error('>> ActionRowComponent can only have up to 5 components');
    const row = new discord_js_1.ActionRowBuilder();
    row.addComponents(...components);
    return row;
}
exports.default = CreateRow;

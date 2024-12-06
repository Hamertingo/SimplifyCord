"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = __importDefault(require("discord.js"));
const CreateEmbed = (embedData) => {
    const title = embedData.title;
    const description = embedData.description;
    const color = embedData.color;
    const footer = embedData.footer;
    const fields = embedData.fields;
    const author = embedData.author;
    const image = embedData.image;
    const thumbnail = embedData.thumbnail;
    const timestamp = embedData.timestamp;
    const embed = new discord_js_1.default.EmbedBuilder();
    if (fields) {
        fields.forEach(field => {
            if (!field.name || !field.value)
                return new Error('>> Field name and value are required');
            embed.addFields({ name: field.name, value: field.value, inline: field.inline || false });
        });
    }
    if (title)
        embed.setTitle(title);
    if (description)
        embed.setDescription(description);
    if (color)
        embed.setColor(color);
    if (footer)
        embed.setFooter(footer);
    if (author)
        embed.setAuthor(author);
    if (image)
        embed.setImage(image);
    if (thumbnail)
        embed.setThumbnail(thumbnail);
    if (timestamp)
        embed.setTimestamp();
    return embed;
};
exports.default = CreateEmbed;

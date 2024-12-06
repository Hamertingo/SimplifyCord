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
    try {
        if (fields) {
            for (const field of fields) {
                if (!field.name || !field.value) {
                    throw new Error('Field name and value are required');
                }
                embed.addFields({
                    name: field.name,
                    value: field.value,
                    inline: field.inline || false
                });
            }
        }
        if (title) {
            if (typeof title !== 'string')
                throw new Error('Title must be a string');
            embed.setTitle(title);
        }
        if (description) {
            if (typeof description !== 'string')
                throw new Error('Description must be a string');
            embed.setDescription(description);
        }
        if (color)
            embed.setColor(color);
        if (footer)
            embed.setFooter(footer);
        if (author)
            embed.setAuthor(author);
        if (image) {
            if (typeof image !== 'string')
                throw new Error('Image URL must be a string');
            embed.setImage(image);
        }
        if (thumbnail) {
            if (typeof thumbnail !== 'string')
                throw new Error('Thumbnail URL must be a string');
            embed.setThumbnail(thumbnail);
        }
        if (timestamp)
            embed.setTimestamp();
        return embed;
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new Error(`Failed to create embed: ${errorMessage}`);
    }
};
exports.default = CreateEmbed;

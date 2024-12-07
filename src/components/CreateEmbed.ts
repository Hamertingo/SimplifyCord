import Discord, { APIEmbedField, ColorResolvable, EmbedAuthorOptions, EmbedFooterOptions } from "discord.js";

type BaseEmbedData = {
    title?: string;
    description?: string;
    color?: ColorResolvable;
    footer?: EmbedFooterOptions;
    fields?: APIEmbedField[];
    author?: EmbedAuthorOptions;
    image?: string;
    thumbnail?: string;
    timestamp?: boolean;
};

type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = 
    Pick<T, Exclude<keyof T, Keys>> & {
        [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
    }[Keys];

type embedData = RequireAtLeastOne<BaseEmbedData>;

const createEmbed = (embedData: embedData) => {
    const title = embedData.title;
    const description = embedData.description;
    const color = embedData.color;
    const footer = embedData.footer;
    const fields = embedData.fields;
    const author = embedData.author;
    const image = embedData.image;
    const thumbnail = embedData.thumbnail;
    const timestamp = embedData.timestamp;

    const embed = new Discord.EmbedBuilder();

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
            if (typeof title !== 'string') throw new Error('Title must be a string');
            embed.setTitle(title);
        }
        if (description) {
            if (typeof description !== 'string') throw new Error('Description must be a string');
            embed.setDescription(description);
        }
        if (color) embed.setColor(color as ColorResolvable);
        if (footer) embed.setFooter(footer);
        if (author) embed.setAuthor(author);
        if (image) {
            if (typeof image !== 'string') throw new Error('Image URL must be a string');
            embed.setImage(image);
        }
        if (thumbnail) {
            if (typeof thumbnail !== 'string') throw new Error('Thumbnail URL must be a string');
            embed.setThumbnail(thumbnail);
        }
        if (timestamp) embed.setTimestamp();

        return embed;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new Error(`Failed to create embed: ${errorMessage}`);
    }
}

export default createEmbed;
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
type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> & {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
}[Keys];
type embedData = RequireAtLeastOne<BaseEmbedData>;
declare const CreateEmbed: (embedData: embedData) => Discord.EmbedBuilder;
export default CreateEmbed;

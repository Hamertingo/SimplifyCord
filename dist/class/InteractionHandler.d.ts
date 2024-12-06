import { ButtonInteraction, ModalSubmitInteraction, StringSelectMenuInteraction, AnySelectMenuInteraction, UserSelectMenuInteraction, RoleSelectMenuInteraction, ChannelSelectMenuInteraction, MentionableSelectMenuInteraction, MessageComponentInteraction, CacheType, ModalMessageModalSubmitInteraction, Client } from "discord.js";
export declare enum InteractionType {
    Button = "Button",
    Select = "Select menu",
    StringSelect = "String select menu",
    UserSelect = "User select menu",
    RoleSelect = "Role select menu",
    ChannelSelect = "Channel select menu",
    MentionableSelect = "Mentionable select menu",
    Row = "Row",
    Modal = "Modal",
    ModalComponent = "Modal component",
    All = "Component or modal"
}
export type InteractionTypeMap<Type extends InteractionType, Cache extends CacheType> = {
    [InteractionType.Button]: ButtonInteraction<Cache>;
    [InteractionType.Select]: AnySelectMenuInteraction<Cache>;
    [InteractionType.StringSelect]: StringSelectMenuInteraction<Cache>;
    [InteractionType.UserSelect]: UserSelectMenuInteraction<Cache>;
    [InteractionType.RoleSelect]: RoleSelectMenuInteraction<Cache>;
    [InteractionType.ChannelSelect]: ChannelSelectMenuInteraction<Cache>;
    [InteractionType.MentionableSelect]: MentionableSelectMenuInteraction<Cache>;
    [InteractionType.Row]: MessageComponentInteraction<Cache>;
    [InteractionType.Modal]: ModalSubmitInteraction<Cache>;
    [InteractionType.ModalComponent]: ModalMessageModalSubmitInteraction<Cache>;
    [InteractionType.All]: MessageComponentInteraction<Cache> | ModalSubmitInteraction<Cache>;
}[Type];
export interface IInteractionHandlerOptions<T extends InteractionType> {
    customId: string;
    type: T;
    run: (client: Client, interaction: InteractionTypeMap<T, CacheType>, params: {
        [key: string]: string;
    }) => void | Promise<void>;
    cache?: "cached" | "api";
}
export declare class InteractionHandler<T extends InteractionType = InteractionType> {
    constructor(options: IInteractionHandlerOptions<T>);
}
export declare const interactionHandlers: Map<any, any>;

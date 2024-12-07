import { ButtonInteraction, ModalSubmitInteraction, StringSelectMenuInteraction, AnySelectMenuInteraction, UserSelectMenuInteraction, RoleSelectMenuInteraction, ChannelSelectMenuInteraction, MentionableSelectMenuInteraction, MessageComponentInteraction, ModalMessageModalSubmitInteraction } from "discord.js";
import { bootstrapApp } from "./Client";

export enum InteractionType {
    Button="Button",
    Select="Select menu",
    StringSelect="String select menu",
    UserSelect="User select menu",
    RoleSelect="Role select menu",
    ChannelSelect="Channel select menu",
    MentionableSelect="Mentionable select menu",
    Row="Row",
    Modal="Modal",
    ModalComponent="Modal component",
    All="Component or modal"
}

export type InteractionTypeMap = {
    [InteractionType.Button]: ButtonInteraction;
    [InteractionType.Select]: AnySelectMenuInteraction;
    [InteractionType.StringSelect]: StringSelectMenuInteraction;
    [InteractionType.UserSelect]: UserSelectMenuInteraction;
    [InteractionType.RoleSelect]: RoleSelectMenuInteraction;
    [InteractionType.ChannelSelect]: ChannelSelectMenuInteraction;
    [InteractionType.MentionableSelect]: MentionableSelectMenuInteraction;
    [InteractionType.Row]: MessageComponentInteraction;
    [InteractionType.Modal]: ModalSubmitInteraction;
    [InteractionType.ModalComponent]: ModalMessageModalSubmitInteraction;
    [InteractionType.All]: MessageComponentInteraction | ModalSubmitInteraction;
}

export interface IInteractionHandlerOptions<T extends InteractionType> {
    customId: string;
    type: T;
    run: (client: bootstrapApp, interaction: InteractionTypeMap[T], params: { [key: string]: string }) => void | Promise<void>;
    cache?: "cached" | "api";
}

export class InteractionHandler<T extends InteractionType> {
    constructor(options: IInteractionHandlerOptions<T>) {
        interactionHandlers.set(options.customId, {
            run: options.run,
            type: options.type,
            cache: options.cache
        });
    }
}

export const interactionHandlers = new Map();
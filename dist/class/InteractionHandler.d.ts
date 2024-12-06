import { AutocompleteInteraction, Interaction, StringSelectMenuInteraction } from "discord.js";
import { Client } from ".";
export declare const interactionHandlers: Map<any, any>;
export interface IInteractionHandlerOptions {
    customId: string;
    run: (client: Client, interaction: Exclude<Interaction, AutocompleteInteraction> | StringSelectMenuInteraction, ...args: string[]) => void;
    useParams?: boolean;
}
export default class {
    constructor(options: IInteractionHandlerOptions);
}

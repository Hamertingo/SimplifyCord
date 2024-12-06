import { Client, GatewayIntentBits, Collection, Interaction, CommandInteraction } from "discord.js";
import { ISlashCommandHandler } from "./SlashCommand";
interface CustomOptions {
    autoImport?: string[];
    intents?: GatewayIntentBits[];
}
export default class FastClient extends Client {
    customOptions?: CustomOptions;
    slashCommands: Collection<string, ISlashCommandHandler>;
    slashArray: any[];
    constructor({ autoImport, intents }?: {
        autoImport?: string[];
        intents?: GatewayIntentBits[];
    });
    login(token: string): Promise<string>;
    invokeInteraction(interactionName: string, interaction: Interaction): Promise<any>;
    invokeCommand(commandName: string, interaction: Interaction | CommandInteraction): Promise<void>;
    reloadCommands(): void;
    private loadAutoImportPaths;
    private startListening;
    private getInteractionCallback;
}
export {};

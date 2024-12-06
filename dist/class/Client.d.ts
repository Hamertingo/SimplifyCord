import { Client, ClientOptions, GatewayIntentBits, Collection, Interaction, CommandInteraction } from "discord.js";
import { CommandErrorHandler } from "./SlashCommand";
import { ISlashCommandHandler } from "./SlashCommand";
interface BootstrapAppOptions extends Partial<ClientOptions> {
    token: string;
    intents?: GatewayIntentBits[];
    autoImport?: string[];
    commands?: {
        guilds?: string[];
        onError?: CommandErrorHandler;
    };
    loadLogs?: boolean;
}
export default class bootstrapApp extends Client {
    customOptions?: BootstrapAppOptions;
    slashCommands: Collection<string, ISlashCommandHandler>;
    slashArray: any[];
    commands?: {
        guilds?: string[];
        onError?: CommandErrorHandler;
    };
    constructor(options: BootstrapAppOptions);
    invokeInteraction(interactionName: string, interaction: Interaction): Promise<any>;
    invokeCommand(commandName: string, interaction: Interaction | CommandInteraction): Promise<void>;
    reloadCommands(): Promise<void>;
    private loadAutoImportPaths;
    private startListening;
    private parsePattern;
    private getInteractionCallback;
}
export { bootstrapApp };

import { ClientOptions, GatewayIntentBits, CommandInteraction, ButtonInteraction, AnySelectMenuInteraction, ModalSubmitInteraction } from "discord.js";

export interface BootstrapAppOptions extends Partial<ClientOptions> {
    token: string;
    intents?: GatewayIntentBits[];
    autoImport?: string[];
    commands?: {
        guilds?: string[];
    };
    loadLogs?: boolean;
}

export interface ISimplifyClient {
    invokeInteraction(interactionName: string, interaction: CommandInteraction | ButtonInteraction | AnySelectMenuInteraction | ModalSubmitInteraction, params: { [key: string]: string }): Promise<any>;
    invokeCommand(commandName: string, interaction: CommandInteraction): Promise<void>;
    customOptions?: BootstrapAppOptions;
    commands?: {
        guilds?: string[];
    };
}

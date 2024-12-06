import { ApplicationCommandOption, ApplicationCommandType, CommandInteraction, InteractionResponse, Client } from "discord.js";
export type CommandErrorHandler = (error: unknown, interaction: CommandInteraction) => void;
export declare const slashCommandHandlers: Map<any, any>;
export interface ISlashCommandHandler {
    name: string;
    description: string;
    type: ApplicationCommandType;
    options?: ApplicationCommandOption[];
    run: (client: Client, interaction: CommandInteraction) => Promise<void | InteractionResponse>;
}
export default class SlashCommand {
    constructor(data: ISlashCommandHandler);
    static loadLogs(): void;
}

import { ApplicationCommandOption, ApplicationCommandType, CommandInteraction } from "discord.js";
import { bootstrapApp } from "../../class/Client";
import chalk from 'chalk';

export const slashCommandHandlers = new Map();

export interface ISlashCommandHandler {
    name: string;
    description: string;
    type: ApplicationCommandType;
    options?: ApplicationCommandOption[];
    run: (client: bootstrapApp, interaction: CommandInteraction) => any;
}

export default class SlashCommand {
    constructor(data: ISlashCommandHandler){
        if (slashCommandHandlers.has(data.name)) {
            console.log(chalk.yellow(`⚠ Warning: Command "${data.name}" is being registered more than once!`));
            return;
        }
        slashCommandHandlers.set(data.name, data);
    }

    public static loadLogs() {
        for (const [name] of slashCommandHandlers) {
            console.log(chalk.green(`{/} ${chalk.blue.underline(name)} command loaded!`));
        }  
    }
}
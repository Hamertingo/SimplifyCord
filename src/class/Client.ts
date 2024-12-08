import { Client, ClientOptions, GatewayIntentBits, Collection, Events, ChatInputCommandInteraction, ButtonInteraction, AnySelectMenuInteraction, ModalSubmitInteraction, Interaction, CommandInteraction } from "discord.js";
import SlashCommand, { slashCommandHandlers } from "../handlers/commands/index";
import { interactionHandlers } from "../handlers/interactions/index";
import { Event } from "./Event";

import { pathToFileURL } from 'url';
import { utils } from "../functions/index"
import { z } from "zod";

import * as path from 'path';
import { ISlashCommandHandler } from "../handlers/commands/index";

import { Logger } from '../functions/logger';
import { version as djsVersion } from 'discord.js';
import chalk from "chalk";

import { DEFAULT_INTENTS } from "../lib/constants/intents";
import { BootstrapAppOptions, ISimplifyClient } from "../types/index";

export default class bootstrapApp extends Client implements ISimplifyClient {
    customOptions?: BootstrapAppOptions;
    slashCommands: Collection<string, ISlashCommandHandler> = new Collection();
    slashArray: any[] = [];
    commands?: {
        guilds?: string[];
    };

    constructor(options: BootstrapAppOptions) {
        
        const intentsValidation = z.array(z.nativeEnum(GatewayIntentBits), { invalid_type_error: "Intents list must be a GatewayIntentBits object from discord" });
        intentsValidation.parse(options.intents || DEFAULT_INTENTS);

        const tokenValidation = z.string({ required_error: "Token is required", invalid_type_error: "Token must be a string" });
        tokenValidation.parse(options.token);

        const clientOptions: ClientOptions = {
            intents: options.intents || DEFAULT_INTENTS
        };

        super(clientOptions);
        this.customOptions = options;
        this.commands = options.commands;
        
        this.slashCommands = new Collection();
        this.slashArray = [];

        this.startListening();
        this.loadAutoImportPaths().then(() => {
            Event.register(this);
            this.login(options.token);
        });
    }

    public async invokeInteraction(interactionName: string, interaction: CommandInteraction | ButtonInteraction | AnySelectMenuInteraction | ModalSubmitInteraction, params: { [key: string]: string } = {}): Promise<any> {
        try {
            const handler = interactionHandlers.get(interactionName);
            if (!handler) {
                Logger.error(`No handler found for interaction: ${interactionName}`);
                if (!interaction.replied && !interaction.deferred) {
                    await interaction.reply({ content: 'Interaction handler not found.', ephemeral: true });
                }
                return;
            }

            return await handler.run(this, interaction, params);
        } catch (error) {
            Logger.error(`Error invoking interaction "${interactionName}"`, error);
            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({ content: 'An error occurred while processing this interaction.', ephemeral: true });
            }
        }
    }

    public async invokeCommand(commandName: string, interaction: ChatInputCommandInteraction) {
        const command = this.slashCommands.get(commandName);
                
        if (!command){
            Logger.error(`Command "${commandName}" not found!`);
            return;
        }

        try {
            await command.run(this, interaction);
        } catch (error) {
            Logger.error(`Error in command "${commandName}"`, error);
        }
    }

    public async reloadCommands() {
        try {
            this.slashCommands = new Collection();
            this.slashArray = [];
            
            for (const [name, command] of slashCommandHandlers) {
                if (this.slashCommands.has(name)) {
                    continue;
                }
                
                this.slashCommands.set(name, command);
                this.slashArray.push({
                    name: command.name,
                    description: command.description,
                    type: command.type,
                    options: command.options || []
                });
            }

            if (this.slashArray.length === 0) {
                Logger.warn("Warning: No commands to register.");
                return;
            }

            if (this.guilds.cache.size === 0) {
                Logger.warn("Warning: No guilds found. Commands will be registered when joining a guild.");
                return;
            }

            // If specific guilds are configured, only register in those guilds
            if (this.commands?.guilds && this.commands.guilds.length > 0) {
                for (const guildId of this.commands.guilds) {
                    const guild = this.guilds.cache.get(guildId);
                    if (!guild) {
                        Logger.warn(`Guild with ID ${guildId} not found. Make sure the bot is in the guild.`);
                        continue;
                    }

                    try {
                        await guild.commands.set(this.slashArray);
                        Logger.success(`Commands registered in guild: ${guild.name} (${this.slashArray.length} commands)`);
                    } catch (error) {
                        Logger.error(`Failed to register commands in guild ${guild.name}`, error);
                    }
                }
            } else {
                // If no specific guilds are configured, register globally
                try {
                    await this.application?.commands.set(this.slashArray);
                    Logger.success(`Commands registered globally (${this.slashArray.length} commands)`);
                } catch (error) {
                    Logger.error("Failed to register commands globally", error);
                }
            }
        } catch (error) {
            Logger.error("Error reloading commands", error);
        }
    }
    
    private async loadAutoImportPaths() {
        const root_path = path.resolve();
        const autoImportPath = this.customOptions?.autoImport;

        if (autoImportPath) {
            for (const importPath of autoImportPath) {
                const files = utils.getRecursiveFiles(`${root_path}/${importPath}`);
                if (!files) {
                    Logger.warn(`Auto Import path not found: '${importPath}'`);
                    Logger.info("Make sure to provide a valid path to the components folder");
                    continue;
                }

                for (const file of files) {
                    const isValidFile = file.endsWith('.mjs') || file.endsWith('.js') || file.endsWith(".ts");
                    if (!isValidFile) continue;

                    try {
                        const componentPath = pathToFileURL(file).href;
                        await import(componentPath);
                    } catch (error) {
                        Logger.error(`Failed to import component: ${file}`, error);
                    }
                }
            }
        }

        this.slashCommands = new Collection();
        this.slashArray = [];

        for (const [name, command] of slashCommandHandlers) {
            this.slashCommands.set(name, command);
            this.slashArray.push({
                name: command.name,
                description: command.description,
                type: command.type,
                options: command.options || []
            });
        }
    }
    
    private startListening() {
        this.once(Events.ClientReady, async (client) => {
            console.log()
            await this.loadAutoImportPaths();

            if (this.customOptions?.loadLogs !== false) {
                SlashCommand.loadLogs();
                Event.loadLogs();
                Logger.separator();
            }
            
            Logger.info(`${chalk.green.bold(`discord.js`)} @${chalk.white.bold(djsVersion)} / ${chalk.green.bold(`NodeJs`)} @${chalk.white.bold(process.versions.node)}`);
            Logger.separator();
            Logger.ready(`Online as ${Logger.highlight(client.user.username)}`);
            await this.reloadCommands();
        });

        this.on(Events.InteractionCreate, async (interaction: Interaction) => {
            if (interaction.isCommand()) {
                const command = this.slashCommands.get(interaction.commandName);
                
                if (!command) {
                    Logger.error(`Command "${interaction.commandName}" not found!`);
                    Logger.info(`Available commands: ${Array.from(this.slashCommands.keys()).join(", ")}`);
                    if (!interaction.replied && !interaction.deferred) {
                        await interaction.reply({ content: 'Command not found. Please try again later.', ephemeral: true });
                    }
                    return;
                }

                try {
                    await command.run(this, interaction);
                } catch (error) {
                    Logger.error(`Error in command "${interaction.commandName}"`, error);
                    if (!interaction.replied && !interaction.deferred) {
                        await interaction.reply({ content: 'An error occurred while executing this command.', ephemeral: true });
                    }
                }
            }

            if (interaction.isButton() || interaction.isAnySelectMenu() || interaction.isModalSubmit()) {
                try {
                    const runInteractionHandler = this.getInteractionCallback(interaction.customId, interaction);
                    if (!runInteractionHandler) {
                        Logger.error(`No handler found for interaction: ${interaction.customId}`);
                        if (!interaction.replied && !interaction.deferred) {
                            await interaction.reply({ content: 'Interaction handler not found.', ephemeral: true });
                        }
                        return;
                    }

                    await runInteractionHandler();
                } catch (error) {
                    Logger.error(`Error in interaction "${interaction.customId}"`, error);
                    if (!interaction.replied && !interaction.deferred) {
                        await interaction.reply({ content: 'An error occurred while processing this interaction.', ephemeral: true });
                    }
                }
            }
        });

        this.on(Events.GuildCreate, async () => {
            await this.reloadCommands();
        });
    }

    private parsePattern(pattern: string, customId: string) {
        const patternParts = pattern.split('/');
        const customIdParts = customId.split('/');

        if (patternParts.length !== customIdParts.length) {
            return null;
        }

        const params: { [key: string]: string } = {};

        for (let i = 0; i < patternParts.length; i++) {
            if (patternParts[i].startsWith(':')) {
                const paramName = patternParts[i].slice(1);
                params[paramName] = customIdParts[i];
            } else if (patternParts[i] !== customIdParts[i]) {
                return null;
            }
        }

        return params;
    }

    private getInteractionCallback(customId: string, interaction: Interaction | ChatInputCommandInteraction) {
        if (interaction.isButton() || interaction.isAnySelectMenu() || interaction.isCommand() || interaction.isModalSubmit()) {
            try {
                const useOptionInLastParam = customId.includes("(OILP)");
                const cleanCustomId = customId.replace("(OILP)", "");

                for (const [pattern, handler] of interactionHandlers.entries()) {
                    const params = this.parsePattern(pattern, cleanCustomId);
                    if (params) {
                        if (interaction.isAnySelectMenu() && useOptionInLastParam && interaction.values.length > 0) {
                            params.value = interaction.values[0];
                        }

                        const callback = handler.run;
                        if (!callback) {
                            Logger.error(`Callback not found for pattern: ${pattern}`);
                            return;
                        }

                        return callback.bind(null, this, interaction, params);
                    }
                }

                Logger.warn(`No matching handler found for customId: ${customId}`);
            } catch (error) {
                Logger.error(`Error processing interaction for customId ${customId}`, error);
            }
        }
    }
}

export { bootstrapApp };

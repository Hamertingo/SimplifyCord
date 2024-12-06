import Discord, { Client, ClientOptions, GatewayIntentBits, Collection, Events, Interaction, CommandInteraction } from "discord.js";
import { interactionHandlers } from "./InteractionHandler";
import SlashCommand, { CommandErrorHandler, slashCommandHandlers } from "./SlashCommand";
import { Event } from "./Event";

import { pathToFileURL } from 'url';
import { utils } from "../functions/index"
import { z } from "zod";

import * as path from 'path';
import { ISlashCommandHandler } from "./SlashCommand";

import ck from 'chalk';
import { version as djsVersion } from 'discord.js';
import chalk from "chalk";

const allIntents: GatewayIntentBits[] = [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMessageTyping,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.DirectMessageTyping
];

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
    slashCommands: Collection<string, ISlashCommandHandler> = new Collection();
    slashArray: any[] = [];
    commands?: {
        guilds?: string[];
        onError?: CommandErrorHandler;
    };

    constructor(options: BootstrapAppOptions) {
        
        const intentsValidation = z.array(z.nativeEnum(GatewayIntentBits), { invalid_type_error: "Intents list must be a GatewayIntentBits object from discord" });
        intentsValidation.parse(options.intents || allIntents);

        const tokenValidation = z.string({ required_error: "Token is required", invalid_type_error: "Token must be a string" });
        tokenValidation.parse(options.token);

        const clientOptions: ClientOptions = {
            intents: options.intents || allIntents
        };

        super(clientOptions);
        this.customOptions = options;
        this.commands = options.commands;

        this.startListening();
        this.loadAutoImportPaths().then(() => {
            Event.register(this);
            this.login(options.token);
        });
    }

    public async invokeInteraction(interactionName: string, interaction: Interaction){
        const runInteractionHandler = this.getInteractionCallback(interactionName, interaction) ;
        if (runInteractionHandler) return await runInteractionHandler();
    }

    public async invokeCommand(commandName: string, interaction: Interaction | CommandInteraction){
        const command = this.slashCommands.get(commandName)
                
        if (!command){
            console.log(ck.red.bold("❌ Error:"), ck.red(`Command "${commandName}" not found!`));
            return;
        }

        try {
            await command.run(this, interaction as CommandInteraction);
        } catch (error) {
            console.log(ck.red.bold("❌ Error in command:"), ck.red(`${commandName}`));
            console.log(ck.red("Details:"), error);
            return;
        }
    }

    public async reloadCommands() {
        if (this.commands?.guilds && this.commands.guilds.length > 0) {
            this.commands.guilds.forEach(async guildId => {
                const guild = this.guilds.cache.get(guildId);
                if (guild) {
                    await guild.commands.set([]);
                    guild.commands.set(this.slashArray.map(cmd => cmd.toJSON())).catch(error => {
                        console.log(ck.red.bold("❌ Error:"), ck.red(`Failed to register commands in guild ${guild.name}`));
                        console.log(ck.red("Details:"), error);
                    });
                    console.log(`⤿ Commands registered in guild: ${ck.hex("#57F287").underline(guild.name)} (${guildId})`);
                } else {
                    console.log(ck.yellow("⚠"), ck.yellow(`Guild with ID ${guildId} not found. Skipping command registration.`));
                }
            });
        } else {
            this.guilds.cache.forEach(guild => {
                guild.commands.set(this.slashArray.map(cmd => cmd)).catch(error => {
                    console.log(ck.red.bold("❌ Error:"), ck.red(`Failed to register commands in guild ${guild.name}`));
                    console.log(ck.red("Details:"), error);
                });
            });
            console.log(chalk.greenBright.bold("⤿ Commands registered globally in all guilds"));
        }
    }
    
    private async loadAutoImportPaths() {
        const root_path = path.resolve();
    
        this.slashCommands = new Discord.Collection();
        this.slashArray = [];
        const autoImportPath = this.customOptions?.autoImport;
    
        if (autoImportPath) {
            for (const importPath of autoImportPath) {
                const files = utils.getRecursiveFiles(`${root_path}/${importPath}`);
                if (!files) {
                    console.log(ck.yellow("⚠"), ck.yellow(`Auto Import path not found: '${importPath}'`));
                    console.log(ck.yellow("ℹ"), "Make sure to provide a valid path to the components folder");
                    continue;
                }
    
                for (const file of files) {
                    const isValidFile = file.endsWith('.mjs') || file.endsWith('.js') || file.endsWith(".ts");
                    if (!isValidFile) continue;
    
                    try {
                        const componentPath = pathToFileURL(file).href;
                        await import(componentPath);
                    } catch (error) {
                        console.log(ck.red.bold("❌ Error:"), ck.red(`Failed to import component: ${file}`));
                        console.log(ck.red("Details:"), error);
                    }
                }
            }
        }
    
        const uniqueCommands = new Map(slashCommandHandlers);
        this.slashCommands = new Discord.Collection(uniqueCommands);
        this.slashArray = Array.from(uniqueCommands.values());
    }
    
    private startListening() {
        this.once(Events.ClientReady, async (client) => {
            console.log()
            await this.loadAutoImportPaths();

            if (this.customOptions?.loadLogs !== false) {
                SlashCommand.loadLogs();
                Event.loadLogs();
                console.log()
            }
            
            console.log("📦", `${ck.hex("#5865F2").underline("discord.js")} ${ck.yellow(djsVersion)}`, "/", `${ck.hex("#68a063").underline("NodeJs")} ${ck.yellow(process.versions.node)}`);
            console.log()
            console.log(ck.greenBright(`➝ Online as ${ck.hex("#57F287").underline(client.user.username)}`));
            this.reloadCommands();

            process.on("uncaughtException", err => console.log(err, client));
            process.on("unhandledRejection", err => console.log(err, client));
        });

        this.on(Events.InteractionCreate, async (interaction: Interaction) => {
            if (interaction.isCommand()) {
                const command = this.slashCommands.get(interaction.commandName)
                
                if (!command){
                    return interaction.reply({content: 'Error on interaction! Command not found.', ephemeral: true});
                }

                await command.run(this, interaction);
            }

            if (interaction.isButton() || interaction.isAnySelectMenu() || interaction.isModalSubmit()){
                const runInteractionHandler = this.getInteractionCallback(interaction.customId, interaction) ;
                if (runInteractionHandler) return await runInteractionHandler();
            }
        });

        this.on(Events.GuildCreate, async () => {
            this.reloadCommands();
        })
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

    private getInteractionCallback(customId: string, interaction: Interaction | CommandInteraction) {
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
                            console.log(`\x1b[31mError: Callback not found for pattern: ${pattern}\x1b[0m`);
                            return;
                        }

                        return callback.bind(null, this, interaction, params);
                    }
                }

                console.log(`\x1b[33mWarning: No matching handler found for customId: ${customId}\x1b[0m`);
            } catch (error) {
                console.error(`\x1b[31mError processing interaction for customId ${customId}:`, error, '\x1b[0m');
            }
        }
    }
}

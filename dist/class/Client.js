"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bootstrapApp = void 0;
const discord_js_1 = __importStar(require("discord.js"));
const InteractionHandler_1 = require("./InteractionHandler");
const SlashCommand_1 = __importStar(require("./SlashCommand"));
const Event_1 = require("./Event");
const url_1 = require("url");
const index_1 = require("../functions/index");
const zod_1 = require("zod");
const path = __importStar(require("path"));
const chalk_1 = __importDefault(require("chalk"));
const discord_js_2 = require("discord.js");
const chalk_2 = __importDefault(require("chalk"));
const allIntents = [
    discord_js_1.GatewayIntentBits.Guilds,
    discord_js_1.GatewayIntentBits.MessageContent,
    discord_js_1.GatewayIntentBits.GuildMessages,
    discord_js_1.GatewayIntentBits.GuildMembers,
    discord_js_1.GatewayIntentBits.GuildPresences,
    discord_js_1.GatewayIntentBits.GuildMessageReactions,
    discord_js_1.GatewayIntentBits.GuildMessageTyping,
    discord_js_1.GatewayIntentBits.DirectMessages,
    discord_js_1.GatewayIntentBits.DirectMessageReactions,
    discord_js_1.GatewayIntentBits.DirectMessageTyping
];
class bootstrapApp extends discord_js_1.Client {
    customOptions;
    slashCommands = new discord_js_1.Collection();
    slashArray = [];
    commands;
    constructor(options) {
        const intentsValidation = zod_1.z.array(zod_1.z.nativeEnum(discord_js_1.GatewayIntentBits), { invalid_type_error: "Intents list must be a GatewayIntentBits object from discord" });
        intentsValidation.parse(options.intents || allIntents);
        const tokenValidation = zod_1.z.string({ required_error: "Token is required", invalid_type_error: "Token must be a string" });
        tokenValidation.parse(options.token);
        const clientOptions = {
            intents: options.intents || allIntents
        };
        super(clientOptions);
        this.customOptions = options;
        this.commands = options.commands;
        this.startListening();
        this.loadAutoImportPaths().then(() => {
            Event_1.Event.register(this);
            this.login(options.token);
        });
    }
    async invokeInteraction(interactionName, interaction) {
        const runInteractionHandler = this.getInteractionCallback(interactionName, interaction);
        if (runInteractionHandler)
            return await runInteractionHandler();
    }
    async invokeCommand(commandName, interaction) {
        const command = this.slashCommands.get(commandName);
        if (!command) {
            console.log(chalk_1.default.red.bold("❌ Error:"), chalk_1.default.red(`Command "${commandName}" not found!`));
            return;
        }
        try {
            await command.run(this, interaction);
        }
        catch (error) {
            console.log(chalk_1.default.red.bold("❌ Error in command:"), chalk_1.default.red(`${commandName}`));
            console.log(chalk_1.default.red("Details:"), error);
            return;
        }
    }
    async reloadCommands() {
        if (this.commands?.guilds && this.commands.guilds.length > 0) {
            this.commands.guilds.forEach(async (guildId) => {
                const guild = this.guilds.cache.get(guildId);
                if (guild) {
                    await guild.commands.set([]);
                    guild.commands.set(this.slashArray.map(cmd => cmd.toJSON())).catch(error => {
                        console.log(chalk_1.default.red.bold("❌ Error:"), chalk_1.default.red(`Failed to register commands in guild ${guild.name}`));
                        console.log(chalk_1.default.red("Details:"), error);
                    });
                    console.log(`⤿ Commands registered in guild: ${chalk_1.default.hex("#57F287").underline(guild.name)} (${guildId})`);
                }
                else {
                    console.log(chalk_1.default.yellow("⚠"), chalk_1.default.yellow(`Guild with ID ${guildId} not found. Skipping command registration.`));
                }
            });
        }
        else {
            this.guilds.cache.forEach(guild => {
                guild.commands.set(this.slashArray.map(cmd => cmd)).catch(error => {
                    console.log(chalk_1.default.red.bold("❌ Error:"), chalk_1.default.red(`Failed to register commands in guild ${guild.name}`));
                    console.log(chalk_1.default.red("Details:"), error);
                });
            });
            console.log(chalk_2.default.greenBright.bold("⤿ Commands registered globally in all guilds"));
        }
    }
    async loadAutoImportPaths() {
        const root_path = path.resolve();
        this.slashCommands = new discord_js_1.default.Collection();
        this.slashArray = [];
        const autoImportPath = this.customOptions?.autoImport;
        if (autoImportPath) {
            for (const importPath of autoImportPath) {
                const files = index_1.utils.getRecursiveFiles(`${root_path}/${importPath}`);
                if (!files) {
                    console.log(chalk_1.default.yellow("⚠"), chalk_1.default.yellow(`Auto Import path not found: '${importPath}'`));
                    console.log(chalk_1.default.yellow("ℹ"), "Make sure to provide a valid path to the components folder");
                    continue;
                }
                for (const file of files) {
                    const isValidFile = file.endsWith('.mjs') || file.endsWith('.js') || file.endsWith(".ts");
                    if (!isValidFile)
                        continue;
                    try {
                        const componentPath = (0, url_1.pathToFileURL)(file).href;
                        await import(componentPath);
                    }
                    catch (error) {
                        console.log(chalk_1.default.red.bold("❌ Error:"), chalk_1.default.red(`Failed to import component: ${file}`));
                        console.log(chalk_1.default.red("Details:"), error);
                    }
                }
            }
        }
        const uniqueCommands = new Map(SlashCommand_1.slashCommandHandlers);
        this.slashCommands = new discord_js_1.default.Collection(uniqueCommands);
        this.slashArray = Array.from(uniqueCommands.values());
    }
    startListening() {
        this.once(discord_js_1.Events.ClientReady, async (client) => {
            console.log();
            await this.loadAutoImportPaths();
            if (this.customOptions?.loadLogs !== false) {
                SlashCommand_1.default.loadLogs();
                Event_1.Event.loadLogs();
                console.log();
            }
            console.log("📦", `${chalk_1.default.hex("#5865F2").underline("discord.js")} ${chalk_1.default.yellow(discord_js_2.version)}`, "/", `${chalk_1.default.hex("#68a063").underline("NodeJs")} ${chalk_1.default.yellow(process.versions.node)}`);
            console.log();
            console.log(chalk_1.default.greenBright(`➝ Online as ${chalk_1.default.hex("#57F287").underline(client.user.username)}`));
            this.reloadCommands();
            process.on("uncaughtException", err => console.log(err, client));
            process.on("unhandledRejection", err => console.log(err, client));
        });
        this.on(discord_js_1.Events.InteractionCreate, async (interaction) => {
            if (interaction.isCommand()) {
                const command = this.slashCommands.get(interaction.commandName);
                if (!command) {
                    return interaction.reply({ content: 'Error on interaction! Command not found.', ephemeral: true });
                }
                await command.run(this, interaction);
            }
            if (interaction.isButton() || interaction.isAnySelectMenu() || interaction.isModalSubmit()) {
                const runInteractionHandler = this.getInteractionCallback(interaction.customId, interaction);
                if (runInteractionHandler)
                    return await runInteractionHandler();
            }
        });
        this.on(discord_js_1.Events.GuildCreate, async () => {
            this.reloadCommands();
        });
    }
    parsePattern(pattern, customId) {
        const patternParts = pattern.split('/');
        const customIdParts = customId.split('/');
        if (patternParts.length !== customIdParts.length) {
            return null;
        }
        const params = {};
        for (let i = 0; i < patternParts.length; i++) {
            if (patternParts[i].startsWith(':')) {
                const paramName = patternParts[i].slice(1);
                params[paramName] = customIdParts[i];
            }
            else if (patternParts[i] !== customIdParts[i]) {
                return null;
            }
        }
        return params;
    }
    getInteractionCallback(customId, interaction) {
        if (interaction.isButton() || interaction.isAnySelectMenu() || interaction.isCommand() || interaction.isModalSubmit()) {
            try {
                const useOptionInLastParam = customId.includes("(OILP)");
                const cleanCustomId = customId.replace("(OILP)", "");
                for (const [pattern, handler] of InteractionHandler_1.interactionHandlers.entries()) {
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
            }
            catch (error) {
                console.error(`\x1b[31mError processing interaction for customId ${customId}:`, error, '\x1b[0m');
            }
        }
    }
}
exports.default = bootstrapApp;
exports.bootstrapApp = bootstrapApp;

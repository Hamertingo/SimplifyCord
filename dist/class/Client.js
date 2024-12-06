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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = __importStar(require("discord.js"));
const InteractionHandler_1 = require("./InteractionHandler");
const SlashCommand_1 = require("./SlashCommand");
const url_1 = require("url");
const index_1 = require("../functions/index");
const zod_1 = require("zod");
const path = __importStar(require("path"));
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
class FastClient extends discord_js_1.Client {
    constructor({ autoImport, intents } = {}) {
        const intentsValidation = zod_1.z.array(zod_1.z.nativeEnum(discord_js_1.GatewayIntentBits), { invalid_type_error: "Intents list must be a GatewayIntentBits object from discord" });
        intentsValidation.parse(intents || allIntents);
        const customOptions = { autoImport, intents };
        const options = {
            intents: customOptions.intents || allIntents
        };
        super(options);
        this.slashCommands = new discord_js_1.Collection();
        this.slashArray = [];
        this.customOptions = customOptions;
    }
    login(token) {
        const _super = Object.create(null, {
            login: { get: () => super.login }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const tokenValidation = zod_1.z.string({ required_error: "Token is required", invalid_type_error: "Token must be a string" });
            tokenValidation.parse(token);
            const result = _super.login.call(this, token);
            this.startListening();
            return result;
        });
    }
    invokeInteraction(interactionName, interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const runInteractionHandler = this.getInteractionCallback(interactionName, interaction);
            if (runInteractionHandler)
                return yield runInteractionHandler();
        });
    }
    invokeCommand(commandName, interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const command = this.slashCommands.get(commandName);
            if (!command) {
                return console.error('Error on interaction! Command not found.');
            }
            yield command.run(this, interaction);
        });
    }
    reloadCommands() {
        this.guilds.cache.forEach(guild => guild.commands.set(this.slashArray));
    }
    loadAutoImportPaths() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const root_path = path.resolve();
            this.slashCommands = new discord_js_1.default.Collection();
            const autoImportPath = (_a = this.customOptions) === null || _a === void 0 ? void 0 : _a.autoImport;
            if (autoImportPath) {
                for (const importPath of autoImportPath) {
                    const files = index_1.utils.getRecursiveFiles(`${root_path}/${importPath}`);
                    if (!files)
                        throw new Error(`Auto Import path not found: '${importPath}'. You need to pass a valid path to the components folder`);
                    for (const file of files) {
                        const isValidFile = file.endsWith('.mjs') || file.endsWith('.js') || file.endsWith(".ts");
                        if (!isValidFile)
                            continue;
                        const componentPath = (0, url_1.pathToFileURL)(file).href;
                        yield import(componentPath).catch(err => {
                            throw new Error(`Error on import component: ${err}`);
                        });
                    }
                }
            }
            for (const [key, value] of SlashCommand_1.slashCommandHandlers.entries()) {
                this.slashCommands.set(key, value);
                this.slashArray.push(value);
            }
        });
    }
    startListening() {
        this.once(discord_js_1.Events.ClientReady, (client) => __awaiter(this, void 0, void 0, function* () {
            yield this.loadAutoImportPaths();
            this.reloadCommands();
        }));
        this.on(discord_js_1.Events.InteractionCreate, (interaction) => __awaiter(this, void 0, void 0, function* () {
            if (interaction.isCommand()) {
                const command = this.slashCommands.get(interaction.commandName);
                if (!command) {
                    return interaction.reply({ content: 'Error on interaction! Command not found.', ephemeral: true });
                }
                yield command.run(this, interaction);
            }
            if (interaction.isButton() || interaction.isAnySelectMenu() || interaction.isModalSubmit()) {
                const runInteractionHandler = this.getInteractionCallback(interaction.customId, interaction);
                if (runInteractionHandler)
                    return yield runInteractionHandler();
            }
        }));
        this.on(discord_js_1.Events.GuildCreate, () => __awaiter(this, void 0, void 0, function* () {
            this.reloadCommands();
        }));
    }
    getInteractionCallback(customId, interaction) {
        var _a;
        if (interaction.isButton() || interaction.isAnySelectMenu() || interaction.isCommand() || interaction.isModalSubmit()) {
            const useOptionInLastParam = customId.includes("(OILP)");
            customId = customId.replace("(OILP)", "");
            const customId_whitout_params = customId === null || customId === void 0 ? void 0 : customId.split(":")[0];
            const interactionHandler = InteractionHandler_1.interactionHandlers.get(customId_whitout_params);
            if (!interactionHandler) {
                return console.log(`\x1b[36mInteractionHandler not found for customId: ${customId}\x1b[0m`);
            }
            let params = [];
            const separate_params = customId.split(":");
            params = separate_params.slice(1);
            if (interaction.isAnySelectMenu() && useOptionInLastParam) {
                params.push(interaction.values[0]);
            }
            const callback = (_a = InteractionHandler_1.interactionHandlers.get(customId_whitout_params)) === null || _a === void 0 ? void 0 : _a.run;
            if (!callback)
                return console.log(`\x1b[36mCallback not found for customId: ${customId}\x1b[0m`);
            // vamos retornar a função para ser chamada posteriormente
            return callback.bind(null, this, interaction, ...params);
        }
    }
}
exports.default = FastClient;

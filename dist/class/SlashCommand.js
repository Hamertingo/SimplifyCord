"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.slashCommandHandlers = void 0;
const chalk_1 = __importDefault(require("chalk"));
exports.slashCommandHandlers = new Map();
class SlashCommand {
    constructor(data) {
        if (exports.slashCommandHandlers.has(data.name)) {
            console.log(chalk_1.default.yellow(`⚠ Warning: Command "${data.name}" is being registered more than once!`));
            return;
        }
        exports.slashCommandHandlers.set(data.name, data);
    }
    static loadLogs() {
        for (const [name] of exports.slashCommandHandlers) {
            console.log(chalk_1.default.green(`{/} ${chalk_1.default.blue.underline(name)} command loaded!`));
        }
    }
}
exports.default = SlashCommand;

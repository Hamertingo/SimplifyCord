"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Event = void 0;
const chalk_1 = __importDefault(require("chalk"));
const discord_js_1 = require("discord.js");
class Event {
    static items = new discord_js_1.Collection();
    constructor(data) {
        const events = Event.items.get(data.event) ?? new discord_js_1.Collection();
        events.set(data.name, data);
        Event.items.set(data.event, events);
    }
    static register(client) {
        const eventHandlers = Event.items.map((collection, event) => ({
            event, handlers: collection.map(e => ({ run: e.run, once: e.once }))
        }));
        for (const { event, handlers } of eventHandlers) {
            client.on(event, (...args) => {
                for (const { run } of handlers.filter(e => !e.once))
                    run(...args);
            });
            client.once(event, (...args) => {
                for (const { run } of handlers.filter(e => e.once))
                    run(...args);
            });
        }
    }
    static loadLogs() {
        for (const events of Event.items.values()) {
            for (const { name } of events.values()) {
                console.log(chalk_1.default.green(`${chalk_1.default.green.bold("✔")} ${chalk_1.default.yellow.underline(name)} event loaded!`));
            }
        }
    }
}
exports.Event = Event;

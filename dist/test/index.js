"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Client_js_1 = __importDefault(require("../class/Client.js"));
new Client_js_1.default({
    autoImport: ["src/test/commands", "src/test/events"],
    token: "",
    loadLogs: true
    //commands: {
    //    guilds: [""],
    //}
});

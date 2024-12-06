"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Client_1 = __importDefault(require("class/Client"));
const utils_1 = require("./functions/utils");
const client = new Client_1.default({ autoImport: ["src/test/commands"] });
client.login((0, utils_1.getEnv)("TOKEN"));
client.on("ready", () => {
    var _a;
    console.log("Bot is ready as " + ((_a = client.user) === null || _a === void 0 ? void 0 : _a.tag));
});

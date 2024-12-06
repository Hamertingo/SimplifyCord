"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const InteractionHandler_1 = __importDefault(require("../class/InteractionHandler"));
const CreateButton = ({ customId, style, label, disabled = false, emoji, url, onClick }) => {
    var _a;
    try {
        if (!customId && !url && !onClick)
            throw new Error('>> Button: customId or url or onClick is required');
        if (customId && url)
            throw new Error('>> Button: customId and url cannot be used together');
        if (!label)
            throw new Error('>> Button label is required');
        const button = new discord_js_1.ButtonBuilder()
            .setLabel(label)
            .setStyle(style || 1)
            .setDisabled(disabled || false);
        if (emoji)
            button.setEmoji(emoji);
        if (url) {
            button.setURL(url);
        }
        else if (onClick) {
            customId = `${label.replace(/ /g, "_").toLowerCase()}_${style}_${disabled}_${emoji}`;
            new InteractionHandler_1.default({ customId: customId, run: onClick });
        }
        if (customId)
            button.setCustomId(customId);
        return button;
    }
    catch (error) {
        if ((_a = error === null || error === void 0 ? void 0 : error.message) === null || _a === void 0 ? void 0 : _a.includes("Expected the value to be one of the following enum values:")) {
            return new discord_js_1.ButtonBuilder()
                .setLabel("Style Button Invalid")
                .setStyle(4)
                .setDisabled(true)
                .setCustomId(Math.random().toString(36).substring(7));
        }
        else {
            throw new Error((error === null || error === void 0 ? void 0 : error.message) || "unidentified error");
        }
    }
};
exports.default = CreateButton;

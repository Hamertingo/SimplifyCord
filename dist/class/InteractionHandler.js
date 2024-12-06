"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.interactionHandlers = exports.InteractionHandler = exports.InteractionType = void 0;
var InteractionType;
(function (InteractionType) {
    InteractionType["Button"] = "Button";
    InteractionType["Select"] = "Select menu";
    InteractionType["StringSelect"] = "String select menu";
    InteractionType["UserSelect"] = "User select menu";
    InteractionType["RoleSelect"] = "Role select menu";
    InteractionType["ChannelSelect"] = "Channel select menu";
    InteractionType["MentionableSelect"] = "Mentionable select menu";
    InteractionType["Row"] = "Row";
    InteractionType["Modal"] = "Modal";
    InteractionType["ModalComponent"] = "Modal component";
    InteractionType["All"] = "Component or modal";
})(InteractionType || (exports.InteractionType = InteractionType = {}));
class InteractionHandler {
    constructor(options) {
        exports.interactionHandlers.set(options.customId, {
            run: options.run,
            type: options.type,
            cache: options.cache
        });
    }
}
exports.InteractionHandler = InteractionHandler;
exports.interactionHandlers = new Map();

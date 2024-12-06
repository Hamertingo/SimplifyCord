"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.interactionHandlers = void 0;
exports.interactionHandlers = new Map();
class default_1 {
    constructor(options) {
        exports.interactionHandlers.set(options.customId, { run: options.run, useParams: options.useParams });
    }
}
exports.default = default_1;
